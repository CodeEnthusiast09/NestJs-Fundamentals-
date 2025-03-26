import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Artist } from '../artists/artists.entity';
import { Playlist } from '../playlists/playlist.entity';
import { IsDate } from 'class-validator';

@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @ManyToMany(() => Artist, (artist) => artist.songs, { cascade: true })
  @JoinTable({ name: 'songs_artists' })
  artists: Artist[];

  @Column({ type: 'date' })
  @IsDate()
  releaseDate: Date;

  @Column({ type: 'int' })
  duration: number;

  @Column({ type: 'text', nullable: true })
  lyrics: string;

  //  One song can belong to multiple playlists
  @ManyToMany(() => Playlist, (playlist) => playlist.songs)
  playlist: Playlist;
}
