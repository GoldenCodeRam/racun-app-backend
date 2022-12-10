ARG PORT

FROM node:lts-alpine

WORKDIR server

COPY ./webserver/package.json .

RUN npm install --quiet

COPY ./webserver/tsconfig.json .
COPY ./webserver/babel.config.json .
COPY ./webserver/prisma/ prisma
COPY ./webserver/res/ res
COPY ./webserver/src/ src

RUN npm run prisma-generate
RUN npm run build

EXPOSE $PORT

RUN echo "Using port: $PORT"

CMD npm run start
