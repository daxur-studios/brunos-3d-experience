export function fibonacciSphere(samples: number) {
  const points: number[][] = [];

  const phi = Math.PI * (3 - Math.sqrt(5)); // # golden angle in radians

  for (let i = 0; i < samples; i++) {
    const y = 1 - (i / (samples - 1)) * 2; // # y goes from 1 to -1
    const radius = Math.sqrt(1 - y * y); // # radius at y

    const theta = phi * i; //  # golden angle increment

    const x = Math.cos(theta) * radius;
    const z = Math.sin(theta) * radius;

    points.push([x, y, z]);
  }

  return points;
}
