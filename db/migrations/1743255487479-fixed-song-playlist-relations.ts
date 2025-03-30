import { MigrationInterface, QueryRunner } from "typeorm";

export class FixedSongPlaylistRelations1743255487479 implements MigrationInterface {
    name = 'FixedSongPlaylistRelations1743255487479'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "artists" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "artistName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "userId" uuid, CONSTRAINT "UQ_5c65eae62aec298ebe355fe8947" UNIQUE ("email"), CONSTRAINT "REL_f7bd9114dc2849a90d39512911" UNIQUE ("userId"), CONSTRAINT "PK_09b823d4607d2675dc4ffa82261" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "songs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "releaseDate" date NOT NULL, "duration" integer NOT NULL, "lyrics" text, CONSTRAINT "PK_e504ce8ad2e291d3a1d8f1ea2f4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "playlists" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "userId" uuid, CONSTRAINT "PK_a4597f4189a75d20507f3f7ef0d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "twoFASecret" text, "enable2FA" boolean NOT NULL DEFAULT false, "apiKey" character varying, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "songs_artists" ("songsId" uuid NOT NULL, "artistsId" uuid NOT NULL, CONSTRAINT "PK_78eb64551964b78d544c2ac019b" PRIMARY KEY ("songsId", "artistsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_971d95bf6df45f2b07c317b6b3" ON "songs_artists" ("songsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3f43a7e4032521e4edd2e7ecd2" ON "songs_artists" ("artistsId") `);
        await queryRunner.query(`CREATE TABLE "playlists_songs" ("playlistsId" uuid NOT NULL, "songsId" uuid NOT NULL, CONSTRAINT "PK_64bfa1f885a85f3ac8018058218" PRIMARY KEY ("playlistsId", "songsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cc2754593bf1d1aacf7ac0bffe" ON "playlists_songs" ("playlistsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_29be0cff3806ae85428335c34f" ON "playlists_songs" ("songsId") `);
        await queryRunner.query(`ALTER TABLE "artists" ADD CONSTRAINT "FK_f7bd9114dc2849a90d39512911b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "playlists" ADD CONSTRAINT "FK_708a919e9aa49019000d9e9b68e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "songs_artists" ADD CONSTRAINT "FK_971d95bf6df45f2b07c317b6b34" FOREIGN KEY ("songsId") REFERENCES "songs"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "songs_artists" ADD CONSTRAINT "FK_3f43a7e4032521e4edd2e7ecd29" FOREIGN KEY ("artistsId") REFERENCES "artists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "playlists_songs" ADD CONSTRAINT "FK_cc2754593bf1d1aacf7ac0bffed" FOREIGN KEY ("playlistsId") REFERENCES "playlists"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "playlists_songs" ADD CONSTRAINT "FK_29be0cff3806ae85428335c34fb" FOREIGN KEY ("songsId") REFERENCES "songs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "playlists_songs" DROP CONSTRAINT "FK_29be0cff3806ae85428335c34fb"`);
        await queryRunner.query(`ALTER TABLE "playlists_songs" DROP CONSTRAINT "FK_cc2754593bf1d1aacf7ac0bffed"`);
        await queryRunner.query(`ALTER TABLE "songs_artists" DROP CONSTRAINT "FK_3f43a7e4032521e4edd2e7ecd29"`);
        await queryRunner.query(`ALTER TABLE "songs_artists" DROP CONSTRAINT "FK_971d95bf6df45f2b07c317b6b34"`);
        await queryRunner.query(`ALTER TABLE "playlists" DROP CONSTRAINT "FK_708a919e9aa49019000d9e9b68e"`);
        await queryRunner.query(`ALTER TABLE "artists" DROP CONSTRAINT "FK_f7bd9114dc2849a90d39512911b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_29be0cff3806ae85428335c34f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cc2754593bf1d1aacf7ac0bffe"`);
        await queryRunner.query(`DROP TABLE "playlists_songs"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3f43a7e4032521e4edd2e7ecd2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_971d95bf6df45f2b07c317b6b3"`);
        await queryRunner.query(`DROP TABLE "songs_artists"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "playlists"`);
        await queryRunner.query(`DROP TABLE "songs"`);
        await queryRunner.query(`DROP TABLE "artists"`);
    }

}
