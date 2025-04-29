import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song-dto';
import { Connection } from 'src/common/constants/connection';
import { Song } from './songs.entity';
import { UpdateSongDto } from './dto/update-song-dto';
import { UpdateResult } from 'typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';
import { JwtArtistGuard } from 'src/auth/artist-jwt-guard';
import {
  createPaginationDecorators,
  normalizePagination,
} from 'src/common/utils/pagination.utils';
import { Request as ExpressRequest } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('songs')
@ApiTags('Songs')
@ApiBearerAuth('JWT-auth')
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
  create(
    @Body() createSongDto: CreateSongDto,
    @Req() request: ExpressRequest,
  ): Promise<Song> {
    console.log('Request:', request.user);
    return this.songsService.create(createSongDto);
  }

  @Get()
  findall(
    @Query('page', ...createPaginationDecorators()) page = 1,
    @Query('limit', ...createPaginationDecorators())
    limit = 10,
    @Query('sortBy', ...createPaginationDecorators())
    sortBy = 'releaseDate',
    @Query('order', ...createPaginationDecorators())
    order: 'ASC' | 'DESC' = 'DESC',
  ): Promise<Pagination<Song>> {
    try {
      const {
        page: normalizedPage,
        limit: normalizedLimit,
        sortBy: normalizedSortBy,
        order: normalizedOrder,
      } = normalizePagination({ page, limit, sortBy, order });

      return this.songsService.paginate(
        {
          page: normalizedPage,
          limit: normalizedLimit,
        },

        normalizedSortBy,
        normalizedOrder,
      );
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
  findOne(
    @Param('id')
    id: string,
  ): Promise<Song> {
    return this.songsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateSongDTO: UpdateSongDto,
  ): Promise<UpdateResult> {
    return this.songsService.update(id, updateSongDTO);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.songsService.remove(id);
  }
}
