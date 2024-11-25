FROM node:22.11-alpine

WORKDIR /server-app

COPY package.json .
COPY package-lock.json .

RUN npm i --force && npm cache clean --force
COPY . .

CMD ["npm", "run", "docker:start:dev"]
