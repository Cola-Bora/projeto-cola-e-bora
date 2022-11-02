export interface IUserRequest {
  name: string;
  email: string;
  age: number;
  password: string;
  isAdm: boolean;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  age: number;
  isAdm: boolean;
  IsActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserUpdate {
  name?: string;
  email?: string;
  age?: number;
  password?: string;
}
