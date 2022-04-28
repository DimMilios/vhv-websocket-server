FROM node:16
  
WORKDIR /usr/src/app

COPY . .
COPY --chown=node:node . .

RUN npm ci

RUN npm run prisma:generate

# Only change to the node user AFTER having executed
# previous commands as root
USER node

CMD npm run test:watch