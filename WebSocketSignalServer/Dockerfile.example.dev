FROM node:20-alpine

WORKDIR /app
COPY . .
RUN npm install typescript -g
RUN npm install
RUN tsc
CMD ["npm", "run" , "start"]