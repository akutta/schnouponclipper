FROM node:lts-alpine
WORKDIR /usr/src/app

COPY package.json .
COPY ./src/ .

ENTRYPOINT node index.js
