FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY index.html ./
COPY vite.config.js ./
COPY src ./src

RUN npm run build

EXPOSE 4173
CMD ["npm", "run", "preview"]
