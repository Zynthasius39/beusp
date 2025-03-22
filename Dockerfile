FROM oven/bun:1-alpine AS base
WORKDIR /usr/src/beusp

FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

FROM base AS build
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

ENV NODE_ENV=production
RUN bun run build

FROM nginx:1-alpine
COPY --from=build /usr/src/beusp/dist /usr/share/nginx/html
COPY beusp.nginx.conf /etc/nginx/conf.d/default.conf