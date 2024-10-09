export const connection: Connection = {
  CONNECTION_STRING: 'PSQL://myDatabase:3000',
  DB: 'MYSQL',
  DBNAME: 'TEST',
};

export type Connection = {
  CONNECTION_STRING: string;
  DB: string;
  DBNAME: string;
};
