FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install --omit=dev
# to omit dev dependencies(as they may be big) that we need only for local testing - use --omit-dev

COPY . .

CMD ["npm", "start"]

# Build this using docker build -t jogeshwarsingh/expiration .
# Would also need to push it to dockerhub - docker push jogeshwarsingh/expiration
# Will not work here as we are using wrong username - dont need it right now as not using gcp