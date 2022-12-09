FROM node:lts-alpine

RUN apk add git

RUN npm install -g dotenv

WORKDIR server

RUN git clone https://github.com/GoldenCodeRam/racun-app-backend.git

WORKDIR racun-app-backend/webserver

COPY ./webserver/.env.prod .

RUN npm install

EXPOSE 8000

CMD npm start
