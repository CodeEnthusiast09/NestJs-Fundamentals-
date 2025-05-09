import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ArtistLoginDto {
  @ApiProperty({
    example: 'vibesinc@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'test@123',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
