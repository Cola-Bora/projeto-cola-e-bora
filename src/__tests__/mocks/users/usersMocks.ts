import { IUserRequest } from "../../../interfaces/user";

export const mockedInvalidRequestBody: any = {
  name: "Ana",
  email: "ana@gmail.com",
  birthDate: "1990/10/10",
  password: "1234",
  IsAdmin: true,
};

export const mockedInvaliKey: any = {
  name: "Ana",
  email: "ana@gmail.com",
  birthDate: "1990/10/10",
  passwor: "1234",
};

export const mockedUser: IUserRequest = {
  name: "Ana",
  email: "ana@gmail.com",
  birthDate: "1990/10/10",
  password: "1234",
};

export const mockedInvalidKeyLogin: any = {
  mail: "ana@gmail.com",
  password: "1234",
};

export const mockedInvalidEmailLogin: any = {
  email: "an@gmail.com",
  password: "1234",
};

export const mockedInvalidPasswordLogin: any = {
  email: "ana@gmail.com",
  password: "12345",
};

export const mockedUserLogin: any = {
  email: "ana@gmail.com",
  password: "1234",
};
