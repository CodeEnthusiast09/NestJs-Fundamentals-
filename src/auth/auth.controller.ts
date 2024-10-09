import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from 'src/users/dto/create-user-dto';
import { User } from 'src/entities/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login-dto';
import { AuthService } from './auth.service';
import { ArtistsService } from 'src/artists/artists.service';
import { ArtistSignupDto } from 'src/artists/dto/create-artist-dto';
import { Artist } from 'src/entities/artists/artists.entity';
import { ArtistLoginDto } from 'src/artists/dto/artist-login-dto';
import { JwtAuthGuard } from './jwt-guard';
import { Enable2FAType } from './types/auth-types';
import { UpdateResult } from 'typeorm';
import { ValidateTokenDTO } from './dto/validate-token-dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private artistService: ArtistsService,
  ) {}

  @Post('signup')
  signup(@Body() userDto: CreateUserDTO): Promise<User> {
    return this.userService.create(userDto);
  }

  @Post('login')
  login(@Body() loginDTO: LoginDTO) {
    return this.authService.login(loginDTO);
  }

  @Post('artistSignup')
  artistSignup(@Body() artistDto: ArtistSignupDto): Promise<Artist> {
    return this.artistService.create(artistDto);
  }

  @Post('artistLogin')
  artistLogin(@Body() artistLoginDto: ArtistLoginDto) {
    return this.authService.artistLogin(artistLoginDto);
  }

  @Post('enable-2fa')
  @UseGuards(JwtAuthGuard)
  enable2FA(
    @Request()
    req,
  ): Promise<Enable2FAType> {
    console.log(req.user);
    return this.authService.enable2FA(req.user.userId);
  }

  @Get('disable-2fa')
  @UseGuards(JwtAuthGuard)
  async disable2FA(
    @Request()
    req,
  ): Promise<UpdateResult> {
    await this.authService.disable2FA(req.user.userId);
    return {
      raw: '2FA successfully disabled',
      generatedMaps: [{ raw: '2FA successfully disabled' }],
    };
  }

  @Post('validate-2fa')
  @UseGuards(JwtAuthGuard)
  validate2FA(
    @Request()
    req,
    @Body()
    ValidateTokenDTO: ValidateTokenDTO,
  ): Promise<{ verified: boolean }> {
    return this.authService.validate2FAToken(
      req.user.userId,
      ValidateTokenDTO.token,
    );
  }

  @Get('profile')
  @UseGuards(AuthGuard('bearer'))
  getProfile(
    @Request()
    req,
  ) {
    delete req.user.password;
    return {
      msg: 'authenticated with api key',
      user: req.user,
    };
  }
}
