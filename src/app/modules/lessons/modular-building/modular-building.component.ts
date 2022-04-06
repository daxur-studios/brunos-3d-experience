import { Component, OnInit } from '@angular/core';
import { ThreeJsWorld } from 'src/app/controllers/three/ThreeJsWorld.controller';

type room = {
  label: string;
  previewUrl: string;
  url: string;
};

@Component({
  selector: 'app-modular-building',
  templateUrl: './modular-building.component.html',
  styleUrls: ['./modular-building.component.css'],
})
export class ModularBuildingComponent implements OnInit {
  e!: ThreeJsWorld;

  rooms: room[] = [
    {
      label: `Bruno's 3D Experience`,
      previewUrl: '',
      url: 'https://brunos-3d-experience.web.app',
    },
    {
      label: `Bruno's Plant Shop`,
      previewUrl: '',
      url: 'https://brunos-plant-shop.web.app',
    },
    {
      label: `Bruno's Complex Angular Fire Web App`,
      previewUrl: '',
      url: 'https://brunos-complex-angularfire.web.app',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
