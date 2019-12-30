FROM node:lts-alpine
WORKDIR /usr/src/app

COPY *.json ./
COPY ./src/ ./

RUN npm ci

ENTRYPOINT node index.js
