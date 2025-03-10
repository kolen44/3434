FROM node:20.11.0

WORKDIR /app

COPY . .

RUN npm install --legacy-peer-deps

EXPOSE 3000

CMD ["npm", "run", "start"]
