import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDTO } from './dto/login-dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ArtistsService } from 'src/artists/artists.service';
import { PayloadType } from './types/payload-types';
import { ArtistLoginDto } from 'src/artists/dto/artist-login-dto';
import * as speakeasy from 'speakeasy';
import { User } from 'src/users/users.entity';
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
    | { success: boolean; message: string; accessToken: string }
    | { validate2FA: string; message: string }
    | { success: false; message: string }
  > {
    try {
      const user = await this.userService.findOne(loginDTO);

      const passwordMatched = await bcrypt.compare(
        loginDTO.password,
        user.password,
      );

      if (!passwordMatched) {
        return {
          success: false,
          message: 'Invalid email or password.',
        };
      }

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
        success: true,
        message: 'Login successful',
        accessToken: this.jwtService.sign(payload),
      };
    } catch (err) {
      return {
        success: false,
        message: 'Invalid email or passward',
      };
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

  async enable2FA(
    userId: string,
  ): Promise<{ message: string; secret: string }> {
    try {
      const user = await this.userService.findById(userId);

      if (user.enable2FA) {
        return {
          message: 'Enter the key into your authenticator app to generate OTP',
          secret: user.twoFASecret,
        };
      }

      const secret = speakeasy.generateSecret();

      user.twoFASecret = secret.base32;

      await this.userService.updateSecretKey(user.id, user.twoFASecret);

      return {
        message: 'Enter the key into your authenticator app to generate OTP',
        secret: user.twoFASecret,
      };
    } catch (error) {
      return {
        message: 'Failed to enable 2FA. Please try again.',
        secret: '',
      };
    }
  }

  async disable2FA(
    userId: string,
  ): Promise<{ success: boolean; message: string }> {
    await this.userService.disable2FA(userId);
    return {
      success: true,
      message: 'Two-factor authentication successfully disabled',
    };
  }

  async validate2FAToken(
    userId: string,
    token: string,
  ): Promise<{ verified: boolean; message: string }> {
    try {
      const user = await this.userService.findById(userId);

      const verified = speakeasy.totp.verify({
        secret: user.twoFASecret,
        token: token,
        encoding: 'base32',
      });
      if (verified) {
        return {
          verified: true,
          message: 'Two-factor authentication successfully enabled',
        };
      } else {
        return {
          verified: false,
          message: 'Invalid or expired verification token',
        };
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
