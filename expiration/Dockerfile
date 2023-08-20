FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install --omit=dev
# to omit dev dependencies(as they may be big) that we need only for local testing - use --omit-dev

COPY . .

CMD ["npm", "start"]