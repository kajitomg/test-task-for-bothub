FROM node:20.12.0-alpine AS dev
RUN apk add --no-cache tzdata
ENV TZ Europe/Moscow

WORKDIR /opt/server/

FROM node:20.12.0-alpine AS production
RUN apk add --no-cache tzdata
ENV TZ Europe/Moscow

WORKDIR /opt/server/

COPY package*.json ./

RUN npm install

COPY . .