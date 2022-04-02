FROM node:14.18

WORKDIR /home/vintars-digital-market

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]