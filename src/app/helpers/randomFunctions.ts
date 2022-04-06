export function randomBetween(
  min: number,
  max: number,
  isWholeNumber: boolean
) {
  const rand = Math.random() * (max - min) + min;
  if (isWholeNumber) {
    return Math.round(rand);
  } else {
    return Math.random() * (max - min) + min;
  }
}

export function getRandomColor() {
  let color: string = 'blue';

  return color;
}
