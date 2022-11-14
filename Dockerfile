ARG SOURCE=https://github.com/org/repo

# --

FROM node:16-slim as build

WORKDIR /app

# See: https://github.com/prisma/prisma/issues/8478
RUN apt-get update
RUN apt-get install -y openssl

COPY .yarn .yarn
COPY api api
COPY scripts scripts
COPY web web

COPY .nvmrc .
COPY .yarnrc.yml .
COPY ecosystem.config.js .
COPY graphql.config.js .
COPY jest.config.js .
COPY package.json .
COPY prettier.config.js .
COPY redwood.toml .
COPY yarn.lock .

RUN \
  yarn install --immutable && \
  yarn cache clean

ARG GUIDE_URL
ARG SENTRY_DSN
ARG SITE_URL
ARG STRIPE_PUBLISHABLE_KEY

RUN yarn rw build --verbose

# --

FROM node:16-slim as api

# See: https://github.com/prisma/prisma/issues/8478
RUN apt-get update
RUN apt-get install -y curl openssl

# RUN apk --no-cache add curl -- Re-add once the above issue is resolved

WORKDIR /app
RUN chown -R node /app

COPY .yarn .yarn

COPY .nvmrc .
COPY .yarnrc.yml .
COPY ecosystem.config.js .
COPY graphql.config.js .
COPY package.json .
COPY redwood.toml .
COPY yarn.lock .

COPY api/package.json .
COPY api/server.config.js .

RUN \
  npm install -g pm2 && \
  yarn workspaces focus --production api && \
  yarn cache clean

COPY --from=build /app/api/dist api/dist
COPY --from=build /app/api/templates api/templates
COPY --from=build /app/node_modules/.prisma node_modules/.prisma

USER node

EXPOSE 8911
ENTRYPOINT [ "pm2-runtime", "start", "ecosystem.config.js" ]

HEALTHCHECK --interval=5s CMD curl -f http://localhost:8911/graphql/health

LABEL org.opencontainers.image.source=$SOURCE

# --

FROM nginx:1.23.0-alpine as web

RUN apk --no-cache add curl

RUN \
  chown -R nginx /etc/nginx && \
  chown -R nginx /usr/share/nginx && \
  chown -R nginx /var/cache/nginx && \
  chown -R nginx /var/log/nginx && \
  touch /var/run/nginx.pid && \
  chown nginx /var/run/nginx.pid

COPY web/config/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/web/dist /usr/share/nginx/html

USER nginx

EXPOSE 8080

HEALTHCHECK --interval=5s CMD curl -f http://localhost:8080

LABEL org.opencontainers.image.source=$SOURCE

