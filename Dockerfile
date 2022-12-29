FROM node:lts-alpine

WORKDIR /app

COPY package.json .

RUN npm install
RUN apk update && apk add bash 

COPY . .

CMD ["npm", "start"]

