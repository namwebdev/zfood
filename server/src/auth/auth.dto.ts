import { IsNotEmpty, IsOptional, MinLength } from "class-validator";

export class UserLoginDTO {
  @IsNotEmpty()
  phone: string;

  @MinLength(5)
  password: string;
}

export class UserDTO extends UserLoginDTO {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  address: string;
}

export interface AuthRequestPayLoad extends Pick<UserDTO, "phone"> {
  id: number;
}
