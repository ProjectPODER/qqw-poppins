FROM mhart/alpine-node:14
MAINTAINER Kronops <kronops@kronops.com.mx>

ENV PORT=${PORT:-8080}
ENV NODE_ENV=production

RUN apk --no-cache add tini git \
  && addgroup -S node \
  && adduser -S -G node node

WORKDIR /src

COPY package.json .

COPY .env.example .env

COPY . .

RUN chown -R node:node /src

EXPOSE $PORT

USER node
#RUN npm install --silent
RUN npm install

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["npm", "start"]
