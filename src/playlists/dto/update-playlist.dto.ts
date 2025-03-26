import { IsArray, IsOptional, IsString } from 'class-validator';
// import { Song } from 'src/entities/songs/songs.entity';

export class UpdatePlayListDto {
  @IsString()
  @IsOptional()
  readonly name: string;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  readonly songs: string[];

  @IsString()
  @IsOptional()
  readonly user: string;
}
