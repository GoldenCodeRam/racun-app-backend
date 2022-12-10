ARG PORT

FROM node:lts-alpine

RUN apk add git

WORKDIR server

RUN git clone https://github.com/GoldenCodeRam/racun-app-backend.git

WORKDIR racun-app-backend/webserver

RUN npm install

EXPOSE $PORT

CMD npm run start
