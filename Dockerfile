FROM node:16

WORKDIR /amaizon_api/

RUN npm install pm2 -g

COPY package*.json .
RUN npm install

COPY . .

CMD pm2-runtime server.js
