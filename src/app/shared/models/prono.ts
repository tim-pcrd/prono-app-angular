import { IMatch } from "./match";

export interface IProno {
  id?: string;
  userId: string;
  matchId: string;
  match?: IMatch;
  homeTeamScore: number;
  awayTeamScore: number;
  points?: number;
}
