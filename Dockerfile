FROM node:latest

COPY . .

EXPOSE 8080

WORKDIR ./client
RUN npm i
RUN npm run build

WORKDIR ../server
RUN npm i --production

WORKDIR ../

CMD ["node","server/app.js"]