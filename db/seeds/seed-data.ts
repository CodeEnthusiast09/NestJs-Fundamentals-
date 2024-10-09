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

export const seedData = async (manager: EntityManager): Promise<void> => {
  await seedUser();
  await seedArtist();
  await seedPlayLists();

  async function seedUser() {
    const salt = await bcrypt.genSalt();
    const encryptedPassword = await bcrypt.hash('123456', salt);

    for (let i = 0; i < 2000; i++) {
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

    for (const user of users.slice(0, 2000)) {
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

    for (const user of users.slice(0, 2000)) {
      const playList = new Playlist();
      playList.name = faker.music.genre();
      playList.user = user;
      await manager.getRepository(Playlist).save(playList);
    }
  }
};
