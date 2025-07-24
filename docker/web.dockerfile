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

COPY apps/web/package.json apps/web/
RUN pnpm install --filter @founditems/web 
COPY apps/web apps/web/
RUN pnpm deploy --filter @founditems/web web

WORKDIR /monorepo/web
RUN pnpm run build

FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=base /monorepo/web/build build/
COPY --from=base /monorepo/web/node_modules node_modules/
COPY --from=base /monorepo/web/package.json .

CMD [ "node","build" ]