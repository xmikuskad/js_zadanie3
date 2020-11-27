FROM node:latest
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY ./ ./
RUN npm run-script build
EXPOSE 8080
CMD [ "node", "server.js" ]