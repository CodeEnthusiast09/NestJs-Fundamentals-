import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from './songs.entity';
import { In, Repository, UpdateResult } from 'typeorm';
import { CreateSongDto } from './dto/create-song-dto';
import { UpdateSongDto } from './dto/update-song-dto';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { Artist } from 'src/artists/artists.entity';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,

    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
  ) {}

  async paginate(
    options: IPaginationOptions,
    sortBy = 'releaseDate',
    order: 'ASC' | 'DESC' = 'DESC',
  ): Promise<Pagination<Song>> {
    const queryBuilder = this.songRepository.createQueryBuilder('c');

    const validSortFields = ['releaseDate', 'title'];

    if (validSortFields.includes(sortBy)) {
      queryBuilder.orderBy(`c.${sortBy}`, order);
    } else {
      queryBuilder.orderBy('c.releaseDate', 'DESC');
    }

    return paginate<Song>(queryBuilder, options);
  }

  async create(songDTO: CreateSongDto): Promise<Song> {
    const song = new Song();

    song.title = songDTO.title;

    song.artists = songDTO.artists;

    song.duration = songDTO.duration;

    song.lyrics = songDTO.lyrics;

    song.releaseDate = songDTO.releaseDate;

    const artists = await this.artistRepository.findBy({
      id: In(songDTO.artists),
    });
    song.artists = artists;

    return await this.songRepository.save(song);
  }

  async findAll(): Promise<Song[]> {
    return this.songRepository.find({
      relations: {
        artists: true,
        playlists: true,
      },
    });
  }

  async findOne(id: string): Promise<Song> {
    return this.songRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.songRepository.delete(id);
  }

  async update(
    id: string,
    recordToUpdate: UpdateSongDto,
  ): Promise<UpdateResult> {
    return this.songRepository.update(id, recordToUpdate);
  }
}
