import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from 'src/users/dto/create-user-dto';
import { User } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login-dto';
import { AuthService } from './auth.service';
import { ArtistsService } from 'src/artists/artists.service';
import { ArtistSignupDto } from 'src/artists/dto/create-artist-dto';
import { Artist } from 'src/artists/artists.entity';
import { ArtistLoginDto } from 'src/artists/dto/artist-login-dto';
import { JwtAuthGuard } from './jwt-guard';
import { Enable2FAType } from './types/auth-types';
import { ValidateTokenDTO } from './dto/validate-token-dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private artistService: ArtistsService,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({
    status: 201,
    description: 'It will return the user in the response',
    schema: {
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        user: { type: 'object', description: 'User object (optional)' },
      },
    },
  })
  signup(
    @Body() userDto: CreateUserDTO,
  ): Promise<{ success: boolean; message: string; user?: User }> {
    return this.userService.create(userDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'It will give you the access_token in the response',
  })
  login(@Body() loginDTO: LoginDTO) {
    return this.authService.login(loginDTO);
  }

  @Post('artist/signup')
  @ApiOperation({ summary: 'Register artist' })
  @ApiResponse({
    status: 200,
    description: 'It will the artist in the response',
  })
  artistSignup(
    @Body() artistDto: ArtistSignupDto,
  ): Promise<{ success: boolean; message: string; artist?: Artist }> {
    return this.artistService.create(artistDto);
  }

  @Post('artist/login')
  @ApiOperation({ summary: 'Login artist' })
  @ApiResponse({
    status: 200,
    description: 'It will give you the access_token in the response',
  })
  artistLogin(@Body() artistLoginDto: ArtistLoginDto) {
    return this.authService.artistLogin(artistLoginDto);
  }

  @Post('enable-2fa')
  @UseGuards(JwtAuthGuard)
  enable2FA(
    @Req()
    request,
  ): Promise<Enable2FAType> {
    // console.log(request.user);
    return this.authService.enable2FA(request.user.userId);
  }

  @Get('disable-2fa')
  @UseGuards(JwtAuthGuard)
  async disable2FA(
    @Req()
    request,
  ): Promise<{ success: boolean; message: string }> {
    await this.authService.disable2FA(request.user.userId);
    return {
      success: true,
      message: 'Two-factor authentication successfully disabled',
    };
  }

  @Post('validate-2fa')
  @UseGuards(JwtAuthGuard)
  validate2FA(
    @Req()
    request,
    @Body()
    validateTokenDTO: ValidateTokenDTO,
  ): Promise<{ verified: boolean }> {
    return this.authService.validate2FAToken(
      request.user.userId,
      validateTokenDTO.token,
    );
  }

  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('bearer'))
  getProfile(
    @Req()
    request,
  ) {
    delete request.user.password;
    return {
      msg: 'authenticated with api key',
      user: request.user,
    };
  }

  @Get('test')
  testEnv() {
    return this.authService.getEnvVariables();
  }
}
