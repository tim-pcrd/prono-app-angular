import { ITeam } from "./team";

export interface IMatch {
  id?: string;
  date: Date;
  homeTeamId: string;
  homeTeam?: ITeam;
  awayTeamId: string;
  awayTeam?: ITeam;
  homeTeamScore?: number;
  awayTeamScore?: number;
  stage: string;
}

export enum Stage {
  'Groep' = 1,
  'Achtste finale' = 2,
  'Kwartfinale' = 3,
  'Halve finale' = 4,
  'Finale' = 5
}
