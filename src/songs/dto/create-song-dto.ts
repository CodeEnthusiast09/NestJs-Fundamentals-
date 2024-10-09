import {
  IsArray,
  IsDateString,
  IsMilitaryTime,
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
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  readonly artists: Artist[];

  @IsDateString()
  @IsNotEmpty()
  readonly releasedDate: Date;

  @IsMilitaryTime()
  @IsNotEmpty()
  readonly duration: Date;

  @IsString()
  @IsOptional()
  readonly lyrics: string;
}
