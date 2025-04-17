import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Playlist } from '../playlists/playlist.entity';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Jane',
    description: 'Provide the first name of the user',
  })
  @Column()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Provide the last name of the user',
  })
  @Column()
  lastName: string;

  @ApiProperty({
    example: 'jd@gmail.com',
    description: 'Provide the email of the user',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    example: 'test@123',
    description: 'Provide the password of the user',
  })
  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true, type: 'text' })
  twoFASecret: string;

  @Column({ default: false, type: 'boolean' })
  enable2FA: boolean;

  @Column({ nullable: true })
  apiKey: string;

  @OneToMany(() => Playlist, (playList) => playList.user)
  playLists: Playlist[];
}
