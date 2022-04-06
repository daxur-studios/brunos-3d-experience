import { getRandomColor, randomBetween } from 'src/app/helpers/randomFunctions';
import { ProceduralLeaf } from './ProceduralLeaf';
import { ProceduralPetal } from './ProceduralPetal';

type ProceduralFlowerParameters = {
  branchCount: number;
  hasSpikes: boolean;
};

export class ProceduralFlower {
  constructor(
    private petal: ProceduralPetal,
    private leaf: ProceduralLeaf,
    private params: ProceduralFlowerParameters
  ) {}

  randomizeParameters() {
    this.params.branchCount = Math.min(
      randomBetween(0, 5, true),
      randomBetween(0, 5, true)
    );
  }
}
