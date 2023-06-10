<p align="center">
  <img src=".github/logo.png" alt="Agrek logo" />
</p>

<p align="center">Manage your customers' crop sprayings</p>

<p align="center">Created using <a href="http://nestjs.com/" target="blank">NestJS</a> and <a href="https://www.prisma.io/" target="blank">Prisma</a>.</p>

## Features

- Manage customer information.
- Manage your business assets.
- Manage your business finances.
- Manage customers' growing areas.

## How to run

1. `git clone https://github.com/JoVictorNunes/agrek-server.git`.
2. `cd agrek-server`.
3. Run `npm install`.
3. Open the file `prisma/shema.prisma` and change the provider to the desired datasource provider. We recommend using PostgreSQL (`postgresql`). See all the possible options on <a href="https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#fields">Prisma datasource docs</a>.
4. Open the file `.env` and set environment variables:
      - `DATABASE_URL`: your database url.
      - `SECRET`: salt used for generating auth tokens.
      - `AVATAR_FOLDER`: directory where avatar images will be stored. Make sure your user has write/read permissions on this directory.
5. Run `npx prisma migrate dev` to apply migrations.
6. Run `npx ts-node prisma/seed.ts` to seed your database.
7. Your database will be seeded with a default user that can be used for testing purposes. Default user data:
    - `email`: admin@agrek.com
    - `password`: adminadmin
6. Finally, run `npm run start:dev`. The server should start running on <a href="http://localhost:3001">localhost:3001</a>.

## Notes

- It is an extremely WIP.
- &#128680; Don't use it in production. It is intended for learning purposes only.