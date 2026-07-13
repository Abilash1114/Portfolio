import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, forkJoin, map, of, shareReplay, switchMap } from 'rxjs';

const IPWHO_URL = 'https://ipwho.is/';
const NOMINATIM_REVERSE_URL = 'https://nominatim.openstreetmap.org/reverse';
const TRACKING_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbyZMZYvEPVujTz6KWgy3F9F8ROS8ku_XuF0ahlH-BIWfUVHvjcTtUXJQfCOvPDi99tn/exec';

interface IpWhoResponse {
  success: boolean;
  ip: string;
  country: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
}

interface NominatimResponse {
  display_name?: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    country?: string;
    suburb?: string;
    neighbourhood?: string;
    quarter?: string;
    road?: string;
    postcode?: string;
  };
}

interface Coords {
  lat: number;
  lon: number;
  accuracyMeters: number;
}

interface ReverseGeoResult {
  city: string;
  state: string;
  country: string;
  area: string;
  road: string;
  postalCode: string;
  fullAddress: string;
}

interface LocationInfo {
  ip: string;
  country: string;
  state: string;
  city: string;
  area: string;
  road: string;
  postalCode: string;
  fullAddress: string;
  latitude: number | null;
  longitude: number | null;
  locationAccuracyMeters: number | null;
}

interface DeviceInfo {
  browser: string;
  os: string;
  device: string;
  screenResolution: string;
  language: string;
  referrer: string;
  currentUrl: string;
}

interface VisitorPayload extends DeviceInfo, LocationInfo {
  timestamp: string;
  event: string;
  trafficSource: string;
  locationTheme: string;
}

// City/country -> { label shown in the sheet, accent color applied on-site }.
// Only City/Country columns from ipwho.is are used to key this — no fabricated data.
const LOCATION_THEMES: Record<string, { label: string; color: string }> = {
  chennai: { label: 'Chennai Blue', color: '#3b82f6' },
  bangalore: { label: 'Bangalore Purple', color: '#a855f7' },
  bengaluru: { label: 'Bangalore Purple', color: '#a855f7' },
  hyderabad: { label: 'Hyderabad Orange', color: '#f97316' },
  mumbai: { label: 'Mumbai Green', color: '#22c55e' },
  coimbatore: { label: 'Coimbatore Cyan', color: '#06b6d4' },
  madurai: { label: 'Madurai Pink', color: '#ec4899' },
  'united states': { label: 'USA Blue', color: '#3b82f6' },
  usa: { label: 'USA Blue', color: '#3b82f6' },
  canada: { label: 'Canada Violet', color: '#8b5cf6' },
  'united kingdom': { label: 'UK Emerald', color: '#10b981' },
  uk: { label: 'UK Emerald', color: '#10b981' },
  germany: { label: 'Germany Gray', color: '#6b7280' },
  france: { label: 'France Lavender', color: '#c4b5fd' },
  japan: { label: 'Japan Sakura', color: '#f9a8d4' },
  singapore: { label: 'Singapore Teal', color: '#14b8a6' },
  'united arab emirates': { label: 'UAE Gold', color: '#eab308' },
  uae: { label: 'UAE Gold', color: '#eab308' },
};
const DEFAULT_THEME = { label: 'Default', color: '#0bdfbb' };

// Hostname -> traffic source label shown in the sheet.
const TRAFFIC_SOURCE_MAP: Array<[RegExp, string]> = [
  [/linkedin\.com/i, 'LinkedIn'],
  [/behance\.net/i, 'Behance'],
  [/dribbble\.com/i, 'Dribbble'],
  [/github\.com/i, 'GitHub'],
  [/google\./i, 'Google'],
  [/bing\.com/i, 'Bing'],
  [/facebook\.com|fb\.com/i, 'Facebook'],
  [/instagram\.com/i, 'Instagram'],
  [/twitter\.com|x\.com/i, 'Twitter/X'],
  [/whatsapp\.com|wa\.me/i, 'WhatsApp'],
  [/telegram\.org|t\.me/i, 'Telegram'],
  [/mail\.google\.com/i, 'Gmail'],
];

@Injectable({ providedIn: 'root' })
export class VisitorService {
  private themeApplied = false;
  private locationInfo$?: Observable<LocationInfo>;

  constructor(private http: HttpClient) {}

  /** Collects device + geo info and reports it to the Apps Script sheet. Fire-and-forget. */
  track(event: string = 'Page View'): void {
    const device = this.collectDeviceInfo();
    const trafficSource = this.classifyTrafficSource(document.referrer);

    this.getLocationInfo().subscribe((loc) => {
      const theme = this.resolveLocationTheme(loc.city, loc.country);
      this.applyLocationTheme(theme.color);

      this.send({
        ...device,
        ...loc,
        timestamp: new Date().toISOString(),
        event,
        trafficSource,
        locationTheme: theme.label,
      });
    });
  }

  /**
   * Resolves visitor location once per page load and replays it for every
   * subsequent track()/click call — avoids re-prompting for GPS permission
   * or re-hitting either geo API on every click.
   *
   * Prefers precise browser GPS (reverse-geocoded to a real city/state/country)
   * over the coarser IP-based guess; if the visitor denies/ignores the location
   * permission prompt, or geolocation isn't available, it silently falls back
   * to the IP-based result — nothing ever blocks on the permission prompt.
   */
  private getLocationInfo(): Observable<LocationInfo> {
    if (!this.locationInfo$) {
      const ipGeo$ = this.http.get<IpWhoResponse>(IPWHO_URL).pipe(
        catchError((err) => {
          console.warn('[VisitorService] IP lookup failed', err);
          return of(null);
        }),
      );

      const precise$ = this.getPreciseCoords().pipe(
        switchMap((coords) => {
          if (!coords) return of({ coords: null as Coords | null, address: null });
          return this.reverseGeocode(coords).pipe(map((address) => ({ coords, address })));
        }),
      );

      this.locationInfo$ = forkJoin([ipGeo$, precise$]).pipe(
        map(([ipGeo, precise]) => ({
          ip: ipGeo?.ip ?? '',
          country: precise.address?.country || ipGeo?.country || '',
          state: precise.address?.state || ipGeo?.region || '',
          city: precise.address?.city || ipGeo?.city || '',
          area: precise.address?.area || '',
          road: precise.address?.road || '',
          postalCode: precise.address?.postalCode || '',
          fullAddress: precise.address?.fullAddress || '',
          latitude: precise.coords?.lat ?? ipGeo?.latitude ?? null,
          longitude: precise.coords?.lon ?? ipGeo?.longitude ?? null,
          locationAccuracyMeters: precise.coords?.accuracyMeters ?? null,
        })),
        shareReplay({ bufferSize: 1, refCount: false }),
      );
    }

    return this.locationInfo$;
  }

  /**
   * Prompts the browser for precise GPS coordinates; resolves to null (never errors)
   * on denial/timeout/unsupported. enableHighAccuracy asks the device to use its best
   * available sensor (real GPS chip on phones) instead of coarse WiFi/cell positioning —
   * note this only helps on hardware that actually has GPS; a desktop/laptop with no GPS
   * chip is still limited to WiFi-based accuracy (often 20m-a few km) no matter what we ask for.
   */
  private getPreciseCoords(): Observable<Coords | null> {
    return new Observable<Coords | null>((subscriber) => {
      if (!navigator.geolocation) {
        subscriber.next(null);
        subscriber.complete();
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          subscriber.next({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            accuracyMeters: Math.round(pos.coords.accuracy),
          });
          subscriber.complete();
        },
        () => {
          subscriber.next(null);
          subscriber.complete();
        },
        { timeout: 8000, maximumAge: 300000, enableHighAccuracy: true },
      );
    });
  }

  /** Converts GPS coordinates into a precise address (down to street/neighbourhood) via OpenStreetMap's free reverse-geocoder. */
  private reverseGeocode(coords: Coords): Observable<ReverseGeoResult | null> {
    // zoom=18 asks Nominatim for building/street-level detail rather than just the city centroid.
    const url = `${NOMINATIM_REVERSE_URL}?format=json&lat=${coords.lat}&lon=${coords.lon}&zoom=18&addressdetails=1`;

    return this.http.get<NominatimResponse>(url).pipe(
      map((res) => {
        const addr = res?.address;
        if (!addr) return null;
        return {
          city: addr.city || addr.town || addr.village || addr.county || '',
          state: addr.state || '',
          country: addr.country || '',
          area: addr.neighbourhood || addr.suburb || addr.quarter || '',
          road: addr.road || '',
          postalCode: addr.postcode || '',
          fullAddress: res?.display_name || '',
        };
      }),
      catchError((err) => {
        console.warn('[VisitorService] reverse geocoding failed, falling back to IP-based location', err);
        return of(null);
      }),
    );
  }

  /**
   * Fire-and-forget POST via raw fetch in 'no-cors' mode. Apps Script's /exec
   * endpoint responds with a 302 redirect to script.googleusercontent.com to
   * serve its output; doPost() already runs (and writes the sheet row) on the
   * *original* request, before that redirect. But Angular's HttpClient always
   * validates CORS on the redirected response, which throws a console error
   * even though the write already succeeded. 'no-cors' skips that validation
   * entirely — we don't need to read the response anyway.
   */
  private send(payload: VisitorPayload): void {
    fetch(TRACKING_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    }).catch((err) => {
      console.warn('[VisitorService] failed to report visitor', err);
    });
  }

  /** Classifies where the visitor came from — LinkedIn, other social/search, or Direct. */
  private classifyTrafficSource(referrer: string): string {
    if (!referrer) return 'Direct';
    const match = TRAFFIC_SOURCE_MAP.find(([pattern]) => pattern.test(referrer));
    return match ? match[1] : 'Other';
  }

  private resolveLocationTheme(city?: string, country?: string): { label: string; color: string } {
    const cityKey = (city || '').toLowerCase();
    const countryKey = (country || '').toLowerCase();
    return LOCATION_THEMES[cityKey] ?? LOCATION_THEMES[countryKey] ?? DEFAULT_THEME;
  }

  /** Applies a subtle, additive background accent once per page load — never touches existing site colors. */
  private applyLocationTheme(color: string): void {
    if (this.themeApplied) return;
    this.themeApplied = true;
    document.documentElement.style.setProperty('--visitor-accent', color);
  }

  private collectDeviceInfo(): DeviceInfo {
    const ua = navigator.userAgent;

    return {
      browser: this.detectBrowser(ua),
      os: this.detectOS(ua),
      device: this.detectDevice(ua),
      screenResolution: `${screen.width}x${screen.height}`,
      language: navigator.language,
      referrer: document.referrer || 'direct',
      currentUrl: window.location.href,
    };
  }

  private detectBrowser(ua: string): string {
    if (/edg\//i.test(ua)) return 'Edge';
    if (/opr\//i.test(ua) || /opera/i.test(ua)) return 'Opera';
    if (/chrome|crios/i.test(ua)) return 'Chrome';
    if (/firefox|fxios/i.test(ua)) return 'Firefox';
    if (/safari/i.test(ua) && !/android/i.test(ua)) return 'Safari';
    return 'Unknown';
  }

  private detectOS(ua: string): string {
    if (/windows/i.test(ua)) return 'Windows';
    if (/android/i.test(ua)) return 'Android';
    if (/iphone|ipad|ipod/i.test(ua)) return 'iOS';
    if (/mac os/i.test(ua)) return 'macOS';
    if (/linux/i.test(ua)) return 'Linux';
    return 'Unknown';
  }

  private detectDevice(ua: string): string {
    if (/ipad|tablet/i.test(ua)) return 'Tablet';
    if (/mobile|iphone|android/i.test(ua)) return 'Mobile';
    return 'Desktop';
  }
}
