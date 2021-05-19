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
  'Groep' = 1,
  'Achtste finale' = 2,
  'Kwartfinale' = 3,
  'Halve finale' = 4,
  'Finale' = 5
}
