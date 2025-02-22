import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from 'src/entities/playlists/playlist.entity';
import { In, Repository } from 'typeorm';
import { CreatePlayListDto } from 'src/playLists/dto/create-playlist-dto';
import { Song } from 'src/entities/songs/songs.entity';
import { User } from 'src/entities/users/users.entity';

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

    // songs will be the array of IDs that we are getting from the DTO object
    const songs = await this.songsRepo.findBy({ id: In(playListDTO.songs) });

    //Set the relation for the songs with the playlist entity
    playList.songs = songs;

    // A user will be the ID of the user we are getting from the request
    //When we implemented the user authentication this id will become the logged in user id
    const user = await this.userRepo.findOneBy({ id: playListDTO.user });
    playList.user = user;
    return this.playListRepo.save(playList);
  }
}
