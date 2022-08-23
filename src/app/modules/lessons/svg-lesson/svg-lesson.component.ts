import { ToolbarItem, SVGConfig } from './svg.model';
import { BehaviorSubject } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-svg-lesson',
  templateUrl: './svg-lesson.component.html',
  styleUrls: ['./svg-lesson.component.css'],
})
export class SvgLessonComponent implements OnInit {
  config: SVGConfig = {
    width: 1000,
    height: 60,
    sizes$: new BehaviorSubject({ width: 1000, height: 60 }),
    items$: new BehaviorSubject<ToolbarItem[]>([
      {
        label: 'Home',
        path: '/',
        matIcon: 'home',
      },
      {
        label: 'About',
        path: '/about',
        matIcon: 'info',
      },
      {
        label: 'Contact',
        path: '/contact',
        matIcon: 'contact_mail',
      },
    ]),
    backgroundFill: 'lime',
    backgroundStroke: 'black',
    backgroundStrokeWidth: 2,
  };

  constructor() {}

  ngOnInit(): void {}
}
