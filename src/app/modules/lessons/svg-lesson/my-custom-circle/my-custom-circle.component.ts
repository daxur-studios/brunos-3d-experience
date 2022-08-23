import { myCustomCircleOptions } from '../svg.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'svg:g[my-custom-circle]',
  templateUrl: './my-custom-circle.component.html',
  styleUrls: ['./my-custom-circle.component.css'],
})
export class MyCustomCircleComponent implements OnInit {
  @Input() options!: myCustomCircleOptions;

  constructor() {}

  ngOnInit(): void {}
}
