import { DataSource } from 'typeorm';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: DataSource,
      inject: [],
      useFactory: async () => {
        try {
          const dataSource = new DataSource({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'dapo',
            password: '1234',
            database: 'n-fundamental-pro',
            synchronize: false,
            entities: [`${__dirname}/../**/**.entity{.ts,.js}`],
          });
          await dataSource.initialize();
          // console.log('Database connected successfully');
          // console.log(process.env.DB_PASSWORD);
          // console.log(typeof process.env.DB_PASSWORD);
          return dataSource;
        } catch (error) {
          // console.log('Error connecting to database');
          throw error;
        }
      },
    },
  ],
  exports: [DataSource],
})
export class TypeOrmModule {}
