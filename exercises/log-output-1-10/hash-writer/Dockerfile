FROM node:alpine

WORKDIR /usr/src/app

COPY package* ./

RUN npm i 
# RUN npm ci

COPY . .

CMD ["npm", "start"]

