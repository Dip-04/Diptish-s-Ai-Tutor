# Database setup

This project uses PostgreSQL through Prisma. Supabase is the intended hosted PostgreSQL and authentication provider.

## 1. Configure the connection

Copy `.env.example` to `.env` and fill in these values:

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/postgres?schema=public"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/postgres?schema=public"
```

For Supabase, open the project dashboard and select **Connect**:

- Use the transaction pooler URL (port `6543`) as `DATABASE_URL` for a serverless deployment.
- Use the direct URL, or the session pooler URL (port `5432`) when direct IPv6 is unavailable, as `DIRECT_URL` for migrations.
- URL-encode special characters in the database password.
- Never commit `.env`; it is already ignored by Git.

## 2. Create the schema

For a new development database:

```bash
npm install
npm run db:migrate -- --name init
npm run db:generate
```

`db:migrate` reads `prisma/schema.prisma`, creates `prisma/migrations/<timestamp>_init/migration.sql`, applies it, and records it in the database.

To inspect the tables:

```bash
npm run db:studio
```

For a throwaway prototype only, this creates the tables without migration history:

```bash
npm run db:push
```

## 3. Enable Supabase row-level security

After the Prisma migration succeeds, open **Supabase Dashboard → SQL Editor**, paste the contents of `supabase/rls.sql`, and run it once.

The policies use `auth.uid()` and therefore require `User.id` to equal the authenticated Supabase user's UUID. Test with two separate accounts before using the database in production.

## 4. Deploy later schema changes

Change `prisma/schema.prisma`, create a migration against a development database, and commit the generated `prisma/migrations` directory:

```bash
npm run db:migrate -- --name describe_the_change
```

Apply committed migrations in staging or production:

```bash
npm run db:deploy
npm run db:generate
```

Do not run `prisma migrate reset` against a database containing data: it removes the schema and data.

## Common errors

- `P1001`: the database host is unreachable. Check the URL, project status, network, and whether you need the IPv4 session pooler.
- Authentication failed: reset/check the database password and URL-encode special characters.
- Migration fails through port `6543`: set `DIRECT_URL` to the direct or session-mode port `5432` URL.
- Existing tables but no migration history: do not run the initial migration blindly. Follow Prisma's baseline workflow first.
