export interface IUser {
  id: string;
  displayName: string;
  roles?: IRoles;
}

export interface IRoles {
  admin?: boolean;
  player?: boolean;
}
