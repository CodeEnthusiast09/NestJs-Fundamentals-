import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { DevConfigService } from './common/providers/DevConfigService';
// import { DataSource } from 'typeorm';
import { PlayListsModule } from 'src/playlists/playLists.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';
import { ArtistsController } from './artists/artists.controller';
import { typeOrmAsyncConfig } from 'db/data-source';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SeedModule } from './seed/seed.module';
import configuration from './config/configuration';
import { validate } from 'env.validation';

const devConfig = { port: 3000 };
const proConfig = { port: 4000 };

@Module({
  imports: [
    SongsModule,
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    PlayListsModule,
    AuthModule,
    UsersModule,
    ArtistsModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.production'],
      isGlobal: true,
      load: [configuration],
      validate: validate,
    }),
    SeedModule,
  ],
  controllers: [AppController, ArtistsController],
  providers: [
    AppService,
    {
      provide: DevConfigService,
      useClass: DevConfigService,
    },
    {
      provide: 'CONFIG',
      useFactory: () => {
        return process.env.NODE_ENV === 'development' ? devConfig : proConfig;
      },
    },
  ],
})
export class AppModule implements NestModule {
  constructor(/*private dataSource: DataSource*/) {
    // console.log('Database Name:', this.dataSource.driver.database);
  }
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'songs', method: RequestMethod.POST });
  }
}
