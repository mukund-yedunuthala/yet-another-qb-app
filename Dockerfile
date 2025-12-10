FROM node:24.11.1-alpine3.23 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:24.11.1-alpine3.23
WORKDIR /app

USER node
COPY --chown=node:node --from=builder /app/build build/
COPY --chown=node:node --from=builder /app/node_modules node_modules/
COPY --chown=node:node --from=builder /app/package*.json ./

EXPOSE 4173
ENV PORT=4173
ENV HOST=0.0.0.0

CMD ["node", "build"]
