## Server

### Setup

Execute these commands inside the `server/` directory to generate your JWT keys.

```bash
$ ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key
$ openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
$ cat jwtRS256.key
$ cat jwtRS256.key.pub
```

### .env

- `DB_URL` – PostgreSQL connection url.
- `SERVER_ADDRESS` – Server's address.
- `CLIENT_ADDRESS` – Client's address.
- `GH_CLIENT_ID` – GitHub app's client id.
- `GH_CLIENT_SECRET` – GitHub app's client secret.
- `GH_CALLBACK` – GitHub app's registered callback url.
- `STATE_SECRET` – State secret for encryption.
- `PORT` – Port to listen on.

**Example:**

```
DB_URL=postgres://username:password@localhost:5000/database
SERVER_ADDRESS=http://localhost:4000
CLIENT_ADDRESS=http://localhost:3000
GH_CLIENT_ID=somecoolgithubappid
GH_CLIENT_SECRET=deadbeefdeadbeefdeadbeefdeadbeefdeadbeef
GH_CALLBACK=http://localhost:4000/auth/github/callback
STATE_SECRET=dontstealme
PORT=4000
```
