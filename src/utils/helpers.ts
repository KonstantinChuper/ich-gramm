export function parseImage(base64Image: string): string {
  return `data:image/png;base64,${base64Image}`;
}
