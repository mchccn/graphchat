---
title: "Server codebase"
date: "2021-06-24"
index: 0
---

<h1>Server codebase documentation</h1>

Reanvue's server primarily consists of TypeScript and GraphQL.
It uses PostgreSQL as its database and is built with Apollo Server with Type-GraphQL. Redis is used for caching and storing user sessions.

### Table of contents

- [Directories](#directories)
  - [`scripts/`](#scripts)
  - [`src/`](#src)
- [WebSockets](#websockets)
- [Database](#database)
  - [Entities](#entities)
- [Public assets](#public-assets)
- [Utilities](#utilities)
- [GraphQL](#graphql)
  - [Apollo Server](#apollo-server)
  - [Guards](#guards)
  - [Resolvers](#resolvers)

## Directories

### `scripts/`

Houses all development scripts to make life easier.

- `ddos_server.ts` – Server load testing.
- `drop_database.ts` – Drops the database.
- `typeorm_cli.ts` – CLI to interact with the database.

### `src/`

Holds the source code of the server.

- `src/app/` – Contains the Express app and websockets.
  - `src/app/routes` – Express app routes.
- `src/database/` – Connects to the database and sets up Apollo Server.
- `src/entities/` – All database entities.
- `src/public/` – Statically served assets.
- `src/resolvers/` – GraphQL resolvers.
  - `src/resolvers/errors` – Errors returned by GraphQL.
  - `src/resolvers/guards` – GraphQL guard middleware.
  - `src/resolvers/inputs` – All GraphQL input types.
- `src/utils/` – Reusable utility functions.

## WebSockets

Reanvue employs websockets to deliver real-time events and notifications.

Messages are buffered until the buffer can be parsed into JSON data.

```
client { "hell => server - { "hell
client o": "wo => server - { "hello": "wo
client rld" }  => server - { "hello": "world" }
client            server
```

Incoming websocket connections should have a cookie header including the user's session.
The server will check if the session is valid and retrieve the session's data from Redis.
Then the authorized user's ID will be stored in a map of websockets, to be later retrieved when needed.

```
client CONNECT => server => ask for cookies
client COOKIES => server => check cookie validity
                  server => fetch session from redis
                  server => store user id in map of websockets
client P I N G <= server    ping client back
```

WebSockets in the map are deleted when the websocket is closed or terminated.

The same user can use multiple devices while still receiving the events on all of them because the websockets are stored in an array.

## Database

Reanvue uses PostgreSQL as its primary database.
The ORM of choice is TypeORM and the server connects to Postgres on start-up.
When the connection is complete, TypeORM will run any migrations available.

### Entities

Existing entities in the database. Names are pretty self-explanatory.

- `User`
- `UserBan`
- `UserFollow`
- `UserFriend`
- `UserFriendRequest`
- `UserBlock`
- `Post`
- `PostComment`
- `Article`
- `ArticleComment`
- `DirectMessage`

## Public assets

Reanvue serves public static assets with Express.
Most notably is `/assets/avatars/` as it serves all active user avatars.
Avatars are in the format `<hash>.<ext>` where `hash` is a SHA1 hash of a random hex string of length 16 plus the current unix timestamp.

## Utilities

In `src/utils/`, there are a few utility functions that are reused a lot.

- `errors.ts` – Provides easier GraphQL error resolution.
  - `queryError` – Creates a query error object.
  - `wrapErrors` – Wraps provided errors in an object.
- `ids.ts` – Helps creates unique IDs.
  - `uuid` – Generates a UUID.
  - `hex` – Generates a random hex string with the provided length.
- `logging.ts` – Where all the logging happens.
  - `logger` – Logger object.
- `RateLimiter.ts` – Ratelimiting utilities.
  - `RateLimiter` – Ratelimiter class.
- `slugs.ts` – URL slug generation.
  - `toSlug` – Transforms provided string into a useable slug.
- `users.ts` – User I/O utility.
  - `io` – User I/O utility.
    - `isHigherThan` – Does a user have more permissions than the other?
- `webhooks.ts` – Webhook utilities.
  - `modlog` – Sends a formatted modlog to a channel on Discord.

## GraphQL

### Apollo Server

For GraphQL, Reanvue uses Apollo Server with uploads disabled and credentials enabled.
Uploads are disabled since Reanvue uses GraphQL Upload to implement user avatar uploading functionality.

### Guards

There are a few guards/middleware currently used.

- `AdminPerms` – Only users with permissions can use this endpoint.
- `CheckBans` – Check bans on the currently authenticated user and stop non-authorized users.
- `CheckBansIfAuthed` – Check bans on the currently authenticated user.
- `RateLimit` – Add a ratelimit.

### Resolvers

Usually there is one entity corresponding to one resolver, but `AssetResolver` is different.
Each resolver manages its own entity or entities, usually with basic CRUD and some middleware.
`AssetResolver` is special in the fact that it manages assets and uploads.
