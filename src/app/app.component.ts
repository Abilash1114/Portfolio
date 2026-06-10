import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HeroComponent } from "./core/components/hero/hero.component";
import { AboutComponent } from "./core/components/about/about.component";
import { SkillsComponent } from "./core/components/skills/skills.component";
import { CareerComponent } from "./core/components/career/career.component";
import { HomeComponent } from "./core/home/home.component";
import { WorksComponent } from "./core/components/works/works.component";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeroComponent, AboutComponent, SkillsComponent, CareerComponent, HomeComponent, WorksComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
    schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  title = 'portfolio';
}
