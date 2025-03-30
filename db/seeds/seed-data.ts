// import { Artist } from '../../src/entities/artists/artists.entity';
// import { User } from '../../src/entities/users/users.entity';
// import { EntityManager } from 'typeorm';
// import { faker } from '@faker-js/faker';
// import { v4 as uuid4 } from 'uuid';
// import * as bcrypt from 'bcryptjs';
// import { Playlist } from '../../src/entities/playlists/playlist.entity';
// export const seedData = async (manager: EntityManager): Promise<void> => {
//   await seedUser();
//   await seedArtist();
//   await seedPlayLists();

//   async function seedUser() {
//     const salt = await bcrypt.genSalt();
//     const encryptedPassword = await bcrypt.hash('123456', salt);
//     const user = new User();
//     user.firstName = faker.person.firstName();
//     user.lastName = faker.person.lastName();
//     user.email = faker.internet.email();
//     user.password = encryptedPassword;
//     user.apiKey = uuid4();
//     await manager.getRepository(User).save(user);
//   }

//   async function seedArtist() {
//     const salt = await bcrypt.genSalt();
//     const encryptedPassword = await bcrypt.hash('123456', salt);
//     const user = new User();
//     user.firstName = faker.person.firstName();
//     user.lastName = faker.person.lastName();
//     user.email = faker.internet.email();
//     user.password = encryptedPassword;
//     user.apiKey = uuid4();
//     const artist = new Artist();
//     artist.user = user;
//     await manager.getRepository(User).save(user);
//     await manager.getRepository(Artist).save(artist);
//   }

//   async function seedPlayLists() {
//     const salt = await bcrypt.genSalt();
//     const encryptedPassword = await bcrypt.hash('123456', salt);
//     const user = new User();
//     user.firstName = faker.person.firstName();
//     user.lastName = faker.person.lastName();
//     user.email = faker.internet.email();
//     user.password = encryptedPassword;
//     user.apiKey = uuid4();
//     const playList = new Playlist();
//     playList.name = faker.music.genre();
//     playList.user = user;
//     await manager.getRepository(User).save(user);
//     await manager.getRepository(Playlist).save(playList);
//   }
// };

import { Artist } from '../../src/entities/artists/artists.entity';
import { User } from '../../src/entities/users/users.entity';
import { EntityManager } from 'typeorm';
import { faker } from '@faker-js/faker';
import { v4 as uuid4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { Playlist } from '../../src/entities/playlists/playlist.entity';
import { Song } from 'src/entities/songs/songs.entity';

export const seedData = async (manager: EntityManager): Promise<void> => {
  await seedUser();
  await seedArtist();
  await seedPlayLists();
  await seedSongs();

  async function seedUser() {
    const salt = await bcrypt.genSalt();
    const encryptedPassword = await bcrypt.hash('123456', salt);

    for (let i = 0; i < 20; i++) {
      const user = new User();
      user.firstName = faker.person.firstName();
      user.lastName = faker.person.lastName();
      user.email = faker.internet.email();
      user.password = encryptedPassword;
      user.apiKey = uuid4();
      await manager.getRepository(User).save(user);
    }
  }

  async function seedArtist() {
    const users = await manager.getRepository(User).find();

    if (users.length === 0) {
      console.log('No users found to link to artists!');
      return;
    }

    for (const user of users.slice(0, 9)) {
      const salt = await bcrypt.genSalt();
      const encryptedPassword = await bcrypt.hash('artistPassword', salt);

      const artist = new Artist();
      artist.artistName = faker.person.fullName();
      artist.email = faker.internet.email();
      artist.password = encryptedPassword;
      artist.user = user;

      await manager.getRepository(Artist).save(artist);
    }
  }

  async function seedPlayLists() {
    const users = await manager.getRepository(User).find();

    if (users.length === 0) {
      console.error('No users found to link to playlists!');
      return;
    }

    for (const user of users.slice(0, 20)) {
      const playList = new Playlist();
      playList.name = faker.music.genre();
      playList.user = user;
      await manager.getRepository(Playlist).save(playList);
    }
  }

  async function seedSongs() {
    const artists = await manager.getRepository(Artist).find();
    const playlists = await manager.getRepository(Playlist).find();

    if (artists.length === 0) {
      console.error('No artists found to link to songs!');
      return;
    }

    if (playlists.length === 0) {
      console.error('No playlists found to link to songs!');
      return;
    }

    // Generate 50 songs
    for (let i = 0; i < 20; i++) {
      const song = new Song();
      song.title = faker.music.songName();

      // Assign 1-3 artists randomly to each song
      const numberOfArtists = Math.floor(Math.random() * 3) + 1;
      song.artists = [];

      for (let j = 0; j < numberOfArtists; j++) {
        const randomArtist =
          artists[Math.floor(Math.random() * artists.length)];
        // Avoid duplicate artists
        if (!song.artists.some((artist) => artist.id === randomArtist.id)) {
          song.artists.push(randomArtist);
        }
      }

      // Generate a random release date within the last 20 years
      const pastDate = new Date();
      pastDate.setFullYear(
        pastDate.getFullYear() - Math.floor(Math.random() * 20),
      );
      song.releaseDate = pastDate;

      // Duration in seconds (between 2-6 minutes)
      song.duration = Math.floor(Math.random() * 240) + 120;

      // Generate lyrics (sometimes null to simulate songs without lyrics)
      song.lyrics =
        Math.random() > 0.3
          ? faker.lorem.paragraphs(Math.floor(Math.random() * 5) + 1, '\n\n')
          : null;

      // Randomly assign the song to a playlist
      if (Math.random() > 0.5) {
        const randomPlaylist =
          playlists[Math.floor(Math.random() * playlists.length)];
        song.playlists = randomPlaylist;
      }

      await manager.getRepository(Song).save(song);
    }
  }
};
