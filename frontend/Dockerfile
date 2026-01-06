FROM node:22-alpine

RUN mkdir -p /usr/src/frontend && chown -R node:node /usr/src/frontend

WORKDIR /usr/src/frontend

COPY --chown=node:node package.json package-lock.json* ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
