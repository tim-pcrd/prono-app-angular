import { IMatch } from "./match";
import { IUser } from "./user";

export interface IProno {
  id?: string;
  userId: string;
  user?: IUser;
  matchId: string;
  match?: IMatch;
  homeTeamScore: number;
  awayTeamScore: number;
  points?: number;
}
