import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDTO } from './dto/login-dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ArtistsService } from 'src/artists/artists.service';
import { PayloadType } from './types/payload-types';
import { ArtistLoginDto } from 'src/artists/dto/artist-login-dto';
import { Enable2FAType } from './types/auth-types';
import * as speakeasy from 'speakeasy';
import { UpdateResult } from 'typeorm';
import { User } from 'src/entities/users/users.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private artistService: ArtistsService,
    private configService: ConfigService,
  ) {}

  getEnvVariables() {
    return {
      port: this.configService.get<number>('port'),
    };
  }

  async login(
    loginDTO: LoginDTO,
  ): Promise<
    { accessToken: string } | { validate2FA: string; message: string }
  > {
    const user = await this.userService.findOne(loginDTO);
    const passwordMatched = await bcrypt.compare(
      loginDTO.password,
      user.password,
    );
    if (passwordMatched) {
      delete user.password;

      const payload: PayloadType = { email: user.email, userId: user.id };

      const artist = await this.artistService.findArtist(user.id);
      if (artist) {
        payload.artistId = artist.id;
      }
      if (user.enable2FA && user.twoFASecret) {
        return {
          validate2FA: 'http://localhost:3000/auth/validate-2fa',
          message: 'Enter one-time password/token from your Authenticator App',
        };
      }
      return {
        accessToken: this.jwtService.sign(payload),
      };
    } else {
      throw new UnauthorizedException('Password does not match');
    }
  }

  async artistLogin(
    artistLoginDto: ArtistLoginDto,
  ): Promise<{ message: string; access_token: string }> {
    const artist = await this.artistService.findOne(artistLoginDto);

    if (
      !artist ||
      !(await bcrypt.compare(artistLoginDto.password, artist.password))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: PayloadType = {
      email: artist.email,
      artistId: artist.id,
      userId: artist.user.id,
    };
    return {
      message: 'Login successful',
      access_token: this.jwtService.sign(payload),
    };
  }

  async enable2FA(userId: string): Promise<Enable2FAType> {
    const user = await this.userService.findById(userId);
    if (user.enable2FA) {
      return { secret: user.twoFASecret };
    }
    const secret = speakeasy.generateSecret();
    // console.log(secret);
    user.twoFASecret = secret.base32;
    await this.userService.updateSecretKey(user.id, user.twoFASecret);
    return { secret: user.twoFASecret };
  }

  async disable2FA(userId: string): Promise<UpdateResult> {
    return this.userService.disable2FA(userId);
  }

  async validate2FAToken(
    userId: string,
    token: string,
  ): Promise<{ verified: boolean }> {
    try {
      const user = await this.userService.findById(userId);

      const verified = speakeasy.totp.verify({
        secret: user.twoFASecret,
        token: token,
        encoding: 'base32',
      });
      if (verified) {
        return { verified: true };
      } else {
        return { verified: false };
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      throw new UnauthorizedException('Error verifying token');
    }
  }

  async validateUserByApiKey(apiKey: string): Promise<User> {
    return this.userService.findByApiKey(apiKey);
  }
}
