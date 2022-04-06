import { Component, OnInit } from '@angular/core';
import { randomBetween } from 'src/app/helpers/randomFunctions';
import { ThreeJsWorld } from 'src/app/controllers/three/ThreeJsWorld.controller';

import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Points,
  PointsMaterial,
  SphereBufferGeometry,
  Texture,
} from 'three';
import { SolarSystem } from './_SolarSystem';

@Component({
  selector: 'app-particles-lesson',
  templateUrl: './particles-lesson.component.html',
  styleUrls: ['./particles-lesson.component.css'],
})
export class ParticlesLessonComponent implements OnInit {
  e!: ThreeJsWorld;
  gui!: dat.GUI;

  solarSystem!: SolarSystem;

  constructor() {}

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.gui.destroy();
    this.e.destroy();
  }
  async ngOnInit() {
    // debug
    const dat = await import('dat.gui');
    this.gui = new dat.GUI({ width: 600 });
    const gui = this.gui;

    // raycast lesson

    const canvas = document.getElementById(
      'particlesCanvas'
    ) as HTMLCanvasElement;

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
      },
      canvas
    );

    this.e.initWorld('OrbitControls');

    this.solarSystem = new SolarSystem(this.e, this.gui);

    gui.add(this, 'orb').name('Particles at verts');
    gui.add(this, 'starfield').name('Star Field');

    gui.add(this, 'fountain').name('Fountain');

    gui.add(this, 'galaxy').name('Galaxy Generator');

    gui.add(this.solarSystem, 'generate').name('Solar System');

    if (localStorage.particlesId) {
      try {
        (this as any)?.[localStorage.particlesId]?.();
      } catch (e) {
        try {
          (this as any)?.[localStorage.particlesId]?.generate?.();
        } catch (e) {}
      }
    }
  }

  resetParticles(fn: any) {
    this.e.scene.clear();
    fn?.();
  }

  fountain() {
    this.resetParticles(null);
    localStorage.particlesId = 'fountain';
  }

  async starfield() {
    this.resetParticles(null);
    localStorage.particlesId = 'starfield';

    const env = this.e;

    const texture: Texture = await new Promise((r) => {
      env.textureLoader.load('assets/particles/4.png', (t) => {
        r(t);
      });
    });

    const particlesGeo = new BufferGeometry();

    const count = 50000;

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;

      colors[i] = Math.random();
    }

    particlesGeo.setAttribute('position', new BufferAttribute(positions, 3));
    particlesGeo.setAttribute('color', new BufferAttribute(colors, 3));

    const particlesMat = new PointsMaterial();
    particlesMat.size = 0.05;
    particlesMat.sizeAttenuation = true;

    particlesMat.vertexColors = true;

    particlesMat.alphaMap = texture;
    particlesMat.transparent = true;
    particlesMat.alphaTest = 0.001;

    const particles = new Points(particlesGeo, particlesMat);

    env.scene.add(particles);
  }

  orb() {
    this.resetParticles(null);
    localStorage.particlesId = 'orb';

    const env = this.e;

    const particlesGeo = new SphereBufferGeometry();
    const particlesMat = new PointsMaterial();
    particlesMat.size = 0.05;
    //particlesMat.sizeAttenuation = false;

    const particles = new Points(particlesGeo, particlesMat);
    env.scene.add(particles);
  }

  galaxyParams = {
    count: 60000,
    size: 0.02,
    radius: 2,
    branches: 3,
    spinPower: 1,
    spinFactor: 4.5,
    randomness: 0.2,
    randomnessFactor: 10,

    insideColor: '#0072a2',
    outsideColor: '#3e1422',
  };

  async galaxy() {
    await new Promise((r) => {
      setTimeout(() => {
        r(true);
      }, 50);
    });

    this.resetParticles(null);
    localStorage.particlesId = 'galaxy';

    const geo = new BufferGeometry();

    const r = this.galaxyParams.radius;
    const twoPI = Math.PI * 2;
    /**
     * Positions
     */

    const pointsPerBranch = Math.round(
      (this.galaxyParams.count * 3) / this.galaxyParams.branches
    );

    //  const positions = new Float32Array(this.galaxyParams.count * 3);
    const positions = new Float32Array(
      pointsPerBranch * this.galaxyParams.branches
    );

    const colors = new Float32Array(
      pointsPerBranch * this.galaxyParams.branches
    );

    // loop per galaxy branch
    const angleRadiant = twoPI / this.galaxyParams.branches;
    const pointsDistance = r / pointsPerBranch;

    const insideColor = new Color(this.galaxyParams.insideColor);
    const outsideColor = new Color(this.galaxyParams.outsideColor);

    // loop for branches
    for (
      let branchIndex = 0;
      branchIndex < this.galaxyParams.branches;
      branchIndex++
    ) {
      // loop for points per branch
      for (
        let pointIndex = 0;
        pointIndex < pointsPerBranch * 3;
        pointIndex = pointIndex + 3
      ) {
        const i3 = pointsPerBranch * branchIndex + pointIndex;
        const currentAngle = angleRadiant * branchIndex;

        // const spinFactor = 1;
        let spin =
          (1 - pointIndex / pointsPerBranch) * this.galaxyParams.spinFactor;

        spin = spin ** this.galaxyParams.spinPower;
        //+spinFactor;
        const randomness = this.galaxyParams.randomness;
        const randomnessFactor = this.galaxyParams.randomnessFactor;

        const randomnessX =
          Math.pow(randomBetween(0, 1, false), randomnessFactor) *
          randomBetween(-1, 1, false) *
          randomness;

        const randomnessY =
          Math.pow(randomBetween(0, 1, false), randomnessFactor) *
          randomBetween(-1, 1, false) *
          randomness;

        const randomnessZ =
          Math.pow(randomBetween(0, 1, false), randomnessFactor) *
          randomBetween(-1, 1, false) *
          randomness;

        const basePointPos = pointsDistance * pointIndex; // Base Equally Distributed Point Position Along Axis

        const x = basePointPos * Math.sin(currentAngle + spin) + randomnessX;
        const y = basePointPos * Math.cos(currentAngle + spin) + randomnessY;

        positions[i3 + 0] = x; // (Math.random() - 0.5) * 3;
        positions[i3 + 1] = randomnessZ; // / 5; //Math.random() * this.galaxyParams.thicknessFactor; //(Math.random() - 0.5) * 3;
        positions[i3 + 2] = y; //(Math.random() - 0.5) * 3;

        // Color
        const mixedColor = insideColor.clone();

        // mixedColor.lerp(outsideColor, pointsPerBranch / pointIndex);

        mixedColor.lerp(outsideColor, basePointPos / this.galaxyParams.radius);

        colors[i3 + 0] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
      }
    }

    console.log(positions, { pointsPerBranch });
    geo.setAttribute('position', new BufferAttribute(positions, 3));

    geo.setAttribute('color', new BufferAttribute(colors, 3));
    /**
     * Material
     */
    const mat = new PointsMaterial({
      size: this.galaxyParams.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: AdditiveBlending,
      vertexColors: true,
    });

    /**
     * Points
     */

    const points = new Points(geo, mat);
    this.e.scene.add(points);

    /**
     * Gui
     */

    if (this.gui.__folders.galaxyParams) {
      this.gui.removeFolder(this.gui.__folders.galaxyParams);
    }

    this.gui.addFolder('galaxyParams');
    this.gui.__folders.galaxyParams.open();

    this.gui.__folders.galaxyParams
      .add(this.galaxyParams, 'count')
      .min(0)
      .max(30000)
      .step(3)
      .onFinishChange(() => this.galaxy());

    this.gui.__folders.galaxyParams
      .add(this.galaxyParams, 'radius')
      .min(0)
      .max(5)
      .step(0.01)
      .onFinishChange(() => this.galaxy());

    this.gui.__folders.galaxyParams
      .add(this.galaxyParams, 'branches')
      .min(2)
      .max(12)
      .step(1)
      .onFinishChange(() => this.galaxy());

    this.gui.__folders.galaxyParams
      .add(this.galaxyParams, 'spinPower')
      .min(0.5)
      .max(4)
      .step(0.001)
      .onFinishChange(() => this.galaxy());

    this.gui.__folders.galaxyParams
      .add(this.galaxyParams, 'spinFactor')
      .min(0)
      .max(100)
      .step(0.001)
      .onFinishChange(() => this.galaxy());

    this.gui.__folders.galaxyParams
      .add(this.galaxyParams, 'randomness')
      .min(0)
      .max(1)
      .step(0.1)
      .onFinishChange(() => this.galaxy());

    this.gui.__folders.galaxyParams
      .add(this.galaxyParams, 'randomnessFactor')
      .min(1)
      .max(10)
      .step(0.01)
      .onFinishChange(() => this.galaxy());

    this.gui.__folders.galaxyParams
      .addColor(this.galaxyParams, 'insideColor')
      .onFinishChange(() => this.galaxy());
    this.gui.__folders.galaxyParams
      .addColor(this.galaxyParams, 'outsideColor')
      .onFinishChange(() => this.galaxy());
  }
}
