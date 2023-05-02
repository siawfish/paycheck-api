FROM node:16-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add --no-cache python3 py3-pip make g++

RUN npm install --only=development

COPY . .

RUN npm run build

FROM node:16-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add --no-cache python3 py3-pip make g++

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
