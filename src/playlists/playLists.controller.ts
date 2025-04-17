import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Playlist } from 'src/playlists/playlist.entity';
import { CreatePlayListDto } from 'src/playlists/dto/create-playlist-dto';
import { UpdatePlayListDto } from './dto/update-playlist.dto';
import { PlayListsService } from 'src/playlists/playLists.service';
import { JwtAuthGuard } from 'src/auth/jwt-guard';

@Controller('playlists')
export class PlayListsController {
  constructor(private playListService: PlayListsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() playlistDTO: CreatePlayListDto): Promise<Playlist> {
    return this.playListService.create(playlistDTO);
  }

  @Put(':id/add-songs')
  @UseGuards(JwtAuthGuard)
  async addSongsToPlaylist(
    @Param('id') playlistId: string,
    @Body() updateDto: UpdatePlayListDto,
  ) {
    return this.playListService.update(playlistId, updateDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllPlaylists(): Promise<Playlist[]> {
    return this.playListService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getPlaylistById(@Param('id') id: string): Promise<Playlist> {
    return this.playListService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deletePlaylist(@Param('id') id: string): Promise<void> {
    return this.playListService.remove(id);
  }
}
