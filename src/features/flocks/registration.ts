export function validPlacement(received: number, placed: number): boolean {
  return Number.isInteger(received) && Number.isInteger(placed) && placed > 0 && received >= placed;
}