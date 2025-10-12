// palette simple para asignar colores por barber
export const PALETTE = [
  "#6366F1", // indigo-500
  "#06B6D4", // cyan-500
  "#10B981", // green-500
  "#F59E0B", // amber-500
  "#EF4444", // red-500
  "#8B5CF6", // violet-500
];

export function barberColor(index: number) {
  return PALETTE[index % PALETTE.length];
}
