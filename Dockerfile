FROM node:alpine

WORKDIR /usr/src/app

COPY . .

WORKDIR /usr/src/app/client

RUN npm install \
&& npm run build 

WORKDIR /usr/src/app/server

RUN npm install

CMD ["node", "server.js"]
