FROM node:22

WORKDIR /app
COPY ./package.json ./package.json
RUN npm install
COPY ./web ./web
COPY ./shared ./shared
RUN cd web && npm install && npm run build

WORKDIR /app/web
CMD ["npm","run","start"]