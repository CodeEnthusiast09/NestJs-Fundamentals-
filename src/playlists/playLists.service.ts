import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from 'src/entities/playlists/playlist.entity';
import { In, Repository, UpdateResult } from 'typeorm';
import { CreatePlayListDto } from './dto/create-playlist-dto';
import { Song } from 'src/entities/songs/songs.entity';
import { User } from 'src/entities/users/users.entity';
import { UpdatePlayListDto } from './dto/update-playlist.dto';

@Injectable()
export class PlayListsService {
  constructor(
    @InjectRepository(Playlist)
    private playListRepo: Repository<Playlist>,
    @InjectRepository(Song)
    private songsRepo: Repository<Song>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(playListDTO: CreatePlayListDto): Promise<Playlist> {
    const playList = new Playlist();

    playList.name = playListDTO.name;

    // If songs are provided, find and add them
    if (playListDTO.songs && playListDTO.songs.length > 0) {
      const songs = await this.songsRepo.findBy({ id: In(playListDTO.songs) });
      playList.songs = songs;
    } else {
      // If no songs are provided, initialize with an empty array
      playList.songs = [];
    }

    // A user will be the ID of the user we are getting from the request

    //When we implemented the user authentication this id will become the logged in user id

    const user = await this.userRepo.findOneBy({ id: playListDTO.user });

    playList.user = user;

    return this.playListRepo.save(playList);
  }

  async update(
    playlistId: string,
    updateDto: UpdatePlayListDto,
  ): Promise<UpdateResult> {
    // Find the existing playlist
    const playlist = await this.playListRepo.findOne({
      where: { id: playlistId },
      relations: ['songs'], // Ensure we load existing songs
    });

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    // Update name if provided
    if (updateDto.name) {
      playlist.name = updateDto.name;
    }

    // Update songs if provided
    if (updateDto.songs && updateDto.songs.length > 0) {
      const songsToAdd = await this.songsRepo.findBy({
        id: In(updateDto.songs),
      });

      if (songsToAdd.length !== updateDto.songs.length) {
        throw new NotFoundException('One or more songs not found');
      }

      // Combine existing songs with new songs, avoiding duplicates
      playlist.songs = [
        ...playlist.songs,
        ...songsToAdd.filter(
          (newSong) =>
            !playlist.songs.some(
              (existingSong) => existingSong.id === newSong.id,
            ),
        ),
      ];
    }

    return this.playListRepo.update(playlistId, playlist);
  }
}
