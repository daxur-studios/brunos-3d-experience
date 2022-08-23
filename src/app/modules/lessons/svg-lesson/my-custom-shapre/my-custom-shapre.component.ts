import { Component, Input, OnInit } from '@angular/core';
import { myCustomShapeOptions } from '../svg.model';

@Component({
  selector: 'svg:g[app-my-custom-shape]',
  templateUrl: './my-custom-shapre.component.html',
  styleUrls: ['./my-custom-shapre.component.css'],
})
export class MyCustomShapeComponent implements OnInit {
  @Input() options!: myCustomShapeOptions;
  constructor() {}

  ngOnInit(): void {}
}
