FROM node:20-alpine AS base
WORKDIR /monorepo

RUN npm i -g pnpm
COPY pnpm-workspace.yaml package.json .npmrc ./


COPY  packages/utils/package.json packages/utils/
RUN pnpm install --filter @founditems/utils 
COPY packages/utils packages/utils/
RUN pnpm run utils:build

COPY  packages/db/package.json packages/db/
RUN pnpm install --filter @founditems/db 
COPY packages/db packages/db/
RUN pnpm run db:build

WORKDIR /monorepo/packages/db
CMD [ "node","dist/migrator.js" ]