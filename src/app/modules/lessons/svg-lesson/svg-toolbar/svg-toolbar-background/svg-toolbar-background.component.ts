import { BehaviorSubject } from 'rxjs';
import { D, SVGConfig } from './../../svg.model';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { SubscriptionContainer } from '@daxur-studios/angular-core';

@Component({
  selector: 'svg:g[app-svg-toolbar-background]',
  templateUrl: './svg-toolbar-background.component.html',
  styleUrls: ['./svg-toolbar-background.component.css'],
})
export class SvgToolbarBackgroundComponent implements OnInit {
  @Input() config!: SVGConfig;

  draw = ``;

  subs = new SubscriptionContainer();

  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit(): void {
    // this.subs.add = this.config.sizes$.subscribe((sizes) => {
    //   const items: string[] = [
    //     D.M(0, 0),
    //     D.L(0, this.config.height),
    //     D.L(this.config.width, this.config.height),
    //     D.L(this.config.width, 0),
    //     D.Z(),
    //   ];
    //   this.draw = D.joinCoords(items);
    //   this.ref.detectChanges();
    // });
    //   this.draw = `M 0,0 L 0, ${this.config.height} L ${this.config.width}, ${this.config.height} L 100, 0 Z`;
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subs.dispose();
  }
}
