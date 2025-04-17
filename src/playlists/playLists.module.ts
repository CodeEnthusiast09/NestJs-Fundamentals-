import { Module } from '@nestjs/common';
import { PlayListsController } from 'src/playlists/playLists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayListsService } from 'src/playlists/playLists.service';
import { Playlist } from 'src/playlists/playlist.entity';
import { Song } from 'src/songs/songs.entity';
import { User } from 'src/users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Playlist, Song, User])],
  controllers: [PlayListsController],
  providers: [PlayListsService],
})
export class PlayListsModule {}
