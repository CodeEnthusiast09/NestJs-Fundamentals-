import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
// import { Song } from 'src/entities/songs/songs.entity';

export class CreatePlayListDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  readonly songs: string[];

  @IsString()
  @IsNotEmpty()
  readonly user: string;
}
