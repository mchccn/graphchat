## Server

### Setup

### .env

- `DB_URL` – PostgreSQL connection url.
- `SERVER_ADDRESS` – Server's address.
- `CLIENT_ADDRESS` – Client's address.
- `COOKIE_SECRET` – Cookie secret.
- `PORT` – Port to listen on.
- `REDIS_PORT` – Port Redis server is running on.
- `REDIS_HOST` – Host Redis serber is running on.

**Example:**

```
DB_URL=postgres://username:password@localhost:5000/database
SERVER_ADDRESS=http://localhost:4000
CLIENT_ADDRESS=http://localhost:3000
COOKIE_SECRET=dontstealme
PORT=4000
REDIS_PORT=6379
REDIS_HOST=localhost
```
