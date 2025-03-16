export interface Rank {
  label: string;
  min: number;
  max: number;
}

export const ranks: Rank[] = [
  {
    label: "Junior",
    min: 0,
    max: 60,
  },
  {
    label: "Mid-level",
    min: 61,
    max: 75,
  },
  {
    label: "Senior",
    min: 76,
    max: 90,
  },
  {
    label: "Principal",
    min: 91,
    max: 100,
  },
];