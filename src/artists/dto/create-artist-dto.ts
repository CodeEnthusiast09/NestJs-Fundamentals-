import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ArtistSignupDto {
  @ApiProperty({
    example: 'Seyi vibes',
  })
  @IsNotEmpty()
  @IsString()
  artistName: string;

  @ApiProperty({
    example: 'vibesinc@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '66e73c83-a37c-4291-8378-f8c27cbf43c3',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    example: 'test@123',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
