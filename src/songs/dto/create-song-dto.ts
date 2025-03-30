import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';
import { Artist } from 'src/entities/artists/artists.entity';
export class CreateSongDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsArray()
  // @IsString()
  @IsString({ each: true })
  @IsNotEmpty()
  readonly artists: Artist[];

  @IsDateString()
  @IsNotEmpty()
  readonly releaseDate: Date;

  @IsNumber()
  @IsNotEmpty()
  readonly duration: number;

  @IsString()
  @IsOptional()
  readonly lyrics: string;
}
