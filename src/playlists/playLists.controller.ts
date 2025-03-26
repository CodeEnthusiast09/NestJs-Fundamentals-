import { Body, Controller, Param, Post } from '@nestjs/common';
import { Playlist } from 'src/entities/playlists/playlist.entity';
import { CreatePlayListDto } from 'src/playlists/dto/create-playlist-dto';
import { UpdatePlayListDto } from './dto/update-playlist.dto';
import { PlayListsService } from 'src/playlists/playLists.service';

@Controller('playlists')
export class PlayListsController {
  constructor(private playListService: PlayListsService) {}

  @Post()
  create(@Body() playlistDTO: CreatePlayListDto): Promise<Playlist> {
    return this.playListService.create(playlistDTO);
  }

  @Post(':id/add-songs')
  async addSongsToPlaylist(
    @Param('id') playlistId: string,
    @Body() updateDto: UpdatePlayListDto,
  ) {
    return this.playListService.update(playlistId, updateDto);
  }
}
