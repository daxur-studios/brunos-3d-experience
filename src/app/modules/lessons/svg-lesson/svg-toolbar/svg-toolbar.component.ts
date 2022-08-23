import { ToolbarItem, SVGConfig } from './../svg.model';
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { SubscriptionContainer } from '@daxur-studios/angular-core';

@Component({
  selector: 'app-svg-toolbar',
  templateUrl: './svg-toolbar.component.html',
  styleUrls: ['./svg-toolbar.component.css'],
})
export class SvgToolbarComponent implements OnInit {
  @Input() config!: SVGConfig;

  @ViewChild('innerWrapper') set innerWrapper(innerWrapper: ElementRef) {
    console.log('innerWrapper', innerWrapper);

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    const resizeObserver = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      //  rect.height;
      //  rect.width;

      this.config.width = rect.width;
      //   this.config.height = rect.height;
      this.config.sizes$.next({ width: rect.width, height: rect.height });

      console.log('Size changed', this.config.width, this.config.height);
    });

    resizeObserver.observe(innerWrapper.nativeElement);

    this.resizeObserver = resizeObserver;
  }
  resizeObserver?: ResizeObserver;
  subs = new SubscriptionContainer();

  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.config.sizes$.subscribe((sizes) => {
      this.ref.detectChanges();
    });
  }
  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.subs.dispose();
  }

  generateShape() {}
}
