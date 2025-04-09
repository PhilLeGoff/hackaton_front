FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN rm -f package-lock.json && npm install

COPY . .

RUN npm run build && ls -al /app

FROM node:18-alpine

RUN npm install -g serve

COPY --from=build /app/dist /app/dist

EXPOSE 3000

CMD ["serve", "-s", "/app/dist"]
