import { Exclude } from 'class-transformer';
import { Song } from '../songs/songs.entity';
import { User } from '../users/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  artistName: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @ManyToMany(() => Song, (song) => song.artists)
  songs: Song[];
}
