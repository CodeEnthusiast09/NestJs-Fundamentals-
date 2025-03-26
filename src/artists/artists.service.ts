import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from 'src/entities/artists/artists.entity';
import { ArtistSignupDto } from './dto/create-artist-dto';
import * as bcrypt from 'bcryptjs';
import { ArtistLoginDto } from './dto/artist-login-dto';
import { User } from 'src/entities/users/users.entity';

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

  async create(artistDto: ArtistSignupDto): Promise<Artist> {
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

    return savedArtist;
  }

  async findOne(data: ArtistLoginDto): Promise<Artist> {
    const artist = await this.artistRepo.findOneBy({
      email: data.email,
    });
    if (!artist) {
      throw new UnauthorizedException('Could not find artist');
    }
    return artist;
  }
}
