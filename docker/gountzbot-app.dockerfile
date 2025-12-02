FROM node:24.11.1 AS base

WORKDIR /app

COPY . .

RUN npm install -g pnpm

RUN corepack enable

RUN pnpm install

RUN pnpm bot:build

WORKDIR /app/apps/gountzbot/dist

CMD ["node", "main.js"]