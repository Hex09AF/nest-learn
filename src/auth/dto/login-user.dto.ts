import { IsEmail, IsNotEmpty } from 'class-validator';

export default class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}
