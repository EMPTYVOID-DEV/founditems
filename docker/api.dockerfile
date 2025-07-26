FROM node:20 AS base
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

COPY apps/api/package.json apps/api/
RUN pnpm install --filter @founditems/api 
COPY apps/api apps/api/
RUN pnpm deploy --filter @founditems/api api

WORKDIR /monorepo/api
RUN pnpm run build

FROM node:20 AS runner
WORKDIR /app

RUN apt-get update && apt-get install -y git git-lfs && rm -rf /var/lib/apt/lists/*
RUN git lfs install
RUN mkdir -p .cache
WORKDIR /app/.cache
RUN git clone https://huggingface.co/Xenova/all-MiniLM-L6-v2

WORKDIR /app
COPY --from=base /monorepo/api/dist dist/
COPY --from=base /monorepo/api/store store/
COPY --from=base /monorepo/api/node_modules node_modules/
COPY --from=base /monorepo/api/package.json .

CMD [ "node","dist" ]