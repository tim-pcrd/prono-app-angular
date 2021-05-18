export interface IMatch {
  id?: string;
  date: Date;
  homeTeamId: string;
  awayTeamId: string;
  homeTeamScore?: number;
  awayTeamScore?: number;
  stage: Stage;
}

export enum Stage {
  Group = 1,
  Last16 = 2,
  QuarterFinal = 3,
  SemiFinal = 4,
  Final = 5
}
