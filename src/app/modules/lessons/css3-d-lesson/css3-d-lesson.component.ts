import { Component, OnInit } from '@angular/core';
import { ThreeJsWorld } from 'src/threeJsController';

@Component({
  selector: 'app-css3-d-lesson',
  templateUrl: './css3-d-lesson.component.html',
  styleUrls: ['./css3-d-lesson.component.css'],
})
export class CSS3DLessonComponent implements OnInit {
  e!: ThreeJsWorld;
  gui!: dat.GUI;

  constructor() {}

  ngOnInit(): void {
    this.initLesson();
  }

  async initLesson() {
    // debug
    const dat = await import('dat.gui');
    this.gui = new dat.GUI();
    const gui = this.gui;

    // raycast lesson

    const canvas = document.getElementById('threeCanvas') as HTMLCanvasElement;

    this.e = new ThreeJsWorld(
      { height: 600 ?? window.innerHeight, width: 800 ?? window.innerWidth },
      { fpsInterval: 500, WebGLRendererAlpha: true },
      {
        resizeable: true,
        evalHeight: '600', //'window.innerHeight',
        evalWidth: '800', //'window.innerWidth',
      },
      {
        hasCamera: true,
        far: 10000,
      },
      canvas
    );
  }
}
