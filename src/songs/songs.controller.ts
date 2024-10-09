import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song-dto';
import { Connection } from 'src/common/constants/connection';
import { Song } from 'src/entities/songs/songs.entity';
import { UpdateSongDto } from './dto/updateSongDto';
import { UpdateResult } from 'typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';
import { JwtArtistGuard } from 'src/auth/artist-jwt-guard';

@Controller('songs')
export class SongsController {
  constructor(
    @Inject('CONNECTION')
    private connection: Connection,
    private songsService: SongsService,
  ) {
    console.log(
      `This is connection string ${this.connection.CONNECTION_STRING}`,
    );
  }

  @Post()
  @UseGuards(JwtArtistGuard)
  create(@Body() createSongDto: CreateSongDto, @Request() req): Promise<Song> {
    console.log('Request:', req.user);
    return this.songsService.create(createSongDto);
  }

  @Get()
  findall(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Song>> {
    try {
      limit = limit > 100 ? 100 : limit;
      return this.songsService.paginate({
        page,
        limit,
      });
    } catch (error) {
      throw new HttpException(
        'server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Song> {
    return this.songsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSongDTO: UpdateSongDto,
  ): Promise<UpdateResult> {
    return this.songsService.update(id, updateSongDTO);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.songsService.remove(id);
  }
}
