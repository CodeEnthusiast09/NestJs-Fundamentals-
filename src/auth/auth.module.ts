import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JWTStrategy } from './jwt-strategy';
import { PassportModule } from '@nestjs/passport';
import { authConstants } from './auth.constants';
import { ArtistsModule } from 'src/artists/artists.module';
import { ApiKeyStrategy } from './apiKeyStrategy';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: authConstants.secret,
      signOptions: {
        expiresIn: '12h',
      },
    }),
    PassportModule,
    ArtistsModule,
  ],
  providers: [AuthService, JWTStrategy, ApiKeyStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
