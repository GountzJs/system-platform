FROM node:24.11.1 AS base

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json ./

RUN npm install -g pnpm
RUN corepack enable && pnpm install -r --frozen-lockfile

COPY . .

RUN pnpm bot:build

WORKDIR /app/apps/gountzbot/dist

CMD ["node", "main.js"]
