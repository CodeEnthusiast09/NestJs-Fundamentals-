import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ArtistSignupDto {
  @IsNotEmpty()
  @IsString()
  artistName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
