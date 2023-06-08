FROM node:latest

WORKDIR /app
COPY . .
RUN npm install -g serve 
RUN npm ci 
RUN npm run build
ENV NODE_ENV production
EXPOSE 8080
CMD [ "npx", "serve", "build" ]