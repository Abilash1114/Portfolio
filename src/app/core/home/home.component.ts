import { AfterViewInit, Component } from '@angular/core';
declare function text():any
declare function timer():any
declare function heroheading():any
declare function parallax():any
declare function sward():any
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit{
  ngAfterViewInit(): void {
   text();
   timer();
   heroheading();
  //  parallax();
   sward();
  }

}
