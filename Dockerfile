FROM node:16-slim as build

# See: https://github.com/prisma/prisma/issues/8478
RUN apt-get update
RUN apt-get install -y openssl

WORKDIR /app


COPY .yarn .yarn
COPY api api
COPY scripts scripts
COPY web web

COPY .nvmrc .
COPY .yarnrc.yml .
COPY graphql.config.js .
COPY package.json .
COPY redwood.toml .
COPY yarn.lock .

RUN \
  yarn install --immutable && \
  yarn cache clean

ARG WEB_ENV_VAR

RUN yarn rw build --verbose

# --

FROM node:16-slim as api

# See: https://github.com/prisma/prisma/issues/8478
RUN apt-get update
RUN apt-get install -y openssl wget

WORKDIR /app

COPY .yarn .yarn

COPY .yarnrc.yml .
COPY package.json .
COPY redwood.toml .
COPY yarn.lock .

COPY api/package.json .
COPY api/server.config.js .
COPY api/config/ecosystem.config.js .

RUN \
  npm install -g pm2 && \
  yarn workspaces focus --production api && \
  yarn cache clean

COPY api/templates api/templates

COPY --from=build /app/api/dist api/dist
COPY --from=build /app/node_modules/.prisma node_modules/.prisma

EXPOSE 8911
ENTRYPOINT [ "pm2-runtime", "start", "api/config/ecosystem.config.js" ]

HEALTHCHECK --interval=5s CMD wget --no-verbose --tries=1 --spider http://localhost:8911/graphql/health || exit

# --

FROM caddy:2.6.2-alpine as web

COPY web/config/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/web/dist /srv

EXPOSE 8080

HEALTHCHECK --interval=5s CMD wget --no-verbose --tries=1 --spider http://localhost:8080 || exit
