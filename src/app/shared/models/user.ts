export interface IUser {
  id?: string;
  uid?: string;
  displayName: string;
  roles: IRoles;
}

export interface IRoles {
  admin?: boolean;
  player?: boolean;
}
