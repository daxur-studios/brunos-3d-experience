type ProceduralLeafParameters = {
  leafType: 'spikey' | 'longThin' | 'eh';
};

export class ProceduralLeaf {
  constructor(private params: ProceduralLeafParameters) {}
}
