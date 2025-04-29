import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';
import { Artist } from 'src/artists/artists.entity';
export class CreateSongDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Huspuppi',
  })
  readonly title: string;

  @IsArray()
  // @IsString()
  @IsString({ each: true })
  @IsNotEmpty()
  @ApiProperty({
    example: ['66e73c83-a37c-4291-8378-f8c27cbf43c3'],
  })
  readonly artists: Artist[];

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2022-03-03',
  })
  readonly releaseDate: Date;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 196,
  })
  readonly duration: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
  })
  readonly lyrics: string;
}
