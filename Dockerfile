FROM node:14.18.0

WORKDIR /vintars-digital-market

COPY package*.json .

RUN npm install 

COPY . .

EXPOSE 5000

CMD ["npm", "start"]