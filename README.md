# README

## Prerequisites

- node v10+
- docker
- docker-compose

### Install

Use this for initial install and package updates, this now automatically calls `lerna bootstrap`.

```
npm i
```

### Start

`start-dev` now automatically runs `docker-compose up -d`.

```
npm run start-dev
```

### Utilities

Build database schema, required when schema is updated.

```
npm run build-schema
```

Clean all packages

```
npm run clean
```

For running custom commands on `docker-compose`, eg. `npm run docker rm`.

```
npm run docker
```

Instead of requiring global package installs, use `npx` to call cli dependencies instead.

```
npx lerna|graphql|nodemon|prisma|yarn ...
```

### Stop

Will stop docker images from running

```
npm run docker-stop
```
