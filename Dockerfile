FROM node:latest
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY ./ ./
RUN npm run-script build
EXPOSE 8080
#Kedze chcem aby sa vzdy pri spusteni vykonal test
CMD ["npm","test"]
#Ak by som chcel spustenie bez testu tak by som pouzil toto
# CMD["node","server.js"]