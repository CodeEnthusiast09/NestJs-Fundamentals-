import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class ArtistSignupDto {
  @IsNotEmpty()
  @IsString()
  artistName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  userId: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
