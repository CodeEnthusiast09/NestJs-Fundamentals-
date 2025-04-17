import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Artist } from 'src/artists/artists.entity';

export class UpdateSongDto {
  @IsString()
  @IsOptional()
  readonly title: string;

  @IsOptional()
  @IsArray()
  // @IsString({ each: true })
  @IsNumber({}, { each: true })
  readonly artists: Artist[];

  @IsDateString()
  @IsOptional()
  readonly releaseDate: Date;

  @IsNumber()
  @IsOptional()
  readonly duration: number;

  @IsString()
  @IsOptional()
  readonly lyrics: string;
}
