import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  host: {
    class: 'page-flex',
  },
})
export class AppComponent {
  title = 'brunos-abstract-site';
}
