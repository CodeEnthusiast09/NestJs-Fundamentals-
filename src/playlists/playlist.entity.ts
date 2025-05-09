import { Song } from 'src/songs/songs.entity';
import { User } from 'src/users/users.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity('playlists')
export class Playlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  // Each Playlist will have multiple songs
  @ManyToMany(() => Song, (song) => song.playlists, { cascade: true })
  @JoinTable({ name: 'playlists_songs' })
  songs: Song[];

  // Many Playlist can belong to a single unique user
  @ManyToOne(() => User, (user) => user.playLists)
  user: User;
}
