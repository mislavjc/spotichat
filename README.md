# Spotichat

A playground for testing OpenAI function calling using the Spotify API to create a message-like interface for getting user stats.

![App Screenshot](/public/spotichat.png)

## Tech Stack

**Frontend:** Next.js, TailwindCSS, shadcn/ui

**DBs:** Vercel Postgres

**Libs:** Next Auth, Prisma, Vercel AI

## Run Locally

Clone the project

```bash
  git clone https://github.com/mislavjc/spotichat.git
```

Go to the project directory

```bash
  cd spotichat
```

Install dependencies

```bash
  pnpm install
```

Start the dev server

```bash
  npm run dev
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file:

### Vercel Postgres

`POSTGRES_PRISMA_URL`
`POSTGRES_URL_NON_POOLING`

### Vercel KV

`KV_REST_API_READ_ONLY_TOKEN`
`KV_REST_API_TOKEN`
`KV_REST_API_URL`
`KV_URL`

### PlanetScale

`DATABASE_URL`

### Authentication

`NEXTAUTH_SECRET`
`NEXTAUTH_URL`
`SPOTIFY_CLIENT_ID`
`SPOTIFY_CLIENT_SECRET`

### OpenAI

`OPENAI_API_KEY`
