export interface Rank {
  label: string;
  min: number;
  max: number;
}

export const ranks: Rank[] = [
  {
    label: "Junior",
    min: 0,
    max: 69,
  },
  {
    label: "Mid-level",
    min: 70,
    max: 84,
  },
  {
    label: "Senior",
    min: 85,
    max: 94,
  },
  {
    label: "Principal",
    min: 95,
    max: 100,
  },
];