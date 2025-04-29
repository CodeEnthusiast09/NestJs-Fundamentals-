import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from 'src/artists/artists.entity';
import { ArtistSignupDto } from './dto/create-artist-dto';
import * as bcrypt from 'bcryptjs';
import { ArtistLoginDto } from './dto/artist-login-dto';
import { User } from 'src/users/users.entity';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private artistRepo: Repository<Artist>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findArtist(userId: string): Promise<Artist> {
    return this.artistRepo.findOneBy({ user: { id: userId } });
  }

  async create(
    artistDto: ArtistSignupDto,
  ): Promise<{ success: boolean; message: string; artist?: Artist }> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: artistDto.userId },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const salt = await bcrypt.genSalt();

      artistDto.password = await bcrypt.hash(artistDto.password, salt);

      const newArtist = this.artistRepo.create({
        ...artistDto,
        user: user,
      });

      const savedArtist = await this.artistRepo.save(newArtist);

      delete savedArtist.password;

      return {
        success: true,
        message: 'Artist created successfully',
        artist: savedArtist,
      };
    } catch (error) {
      if (error.code === '23505' && error.detail?.includes('email')) {
        return {
          success: false,
          message: 'Email already in use.',
        };
      }

      return {
        success: false,
        message: 'Failed to create artist. Please try again.',
      };
    }
  }

  async findOne(data: ArtistLoginDto): Promise<Artist> {
    const artist = await this.artistRepo.findOne({
      where: { email: data.email },
      relations: ['user'],
    });
    if (!artist) {
      throw new UnauthorizedException('Could not find artist');
    }
    return artist;
  }
}
