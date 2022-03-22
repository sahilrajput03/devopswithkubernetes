FROM node:alpine

WORKDIR /usr/src/app

COPY package* ./

RUN npm ci
# RUN wget https://picsum.photos/1200 -O image.jpeg

COPY . .

CMD ["npm", "start"]
