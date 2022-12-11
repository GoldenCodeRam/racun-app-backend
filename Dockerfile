ARG PORT

FROM node:lts-alpine

WORKDIR server

COPY ./package.json .

RUN npm install --quiet

COPY ./tsconfig.json .
COPY ./babel.config.json .
COPY ./prisma/ prisma
COPY ./res/ res
COPY ./src/ src

RUN npm run prisma-generate
RUN npm run build

EXPOSE $PORT

CMD npm run start
