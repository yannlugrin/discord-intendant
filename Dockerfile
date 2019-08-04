FROM node:12-alpine

WORKDIR /var/app

ADD ./package.json ./yarn.lock ./

RUN set -ex; \
  \
  yarn install --no-progress --non-interactive; \
  yarn cache clean

COPY . ./

CMD ["yarn", "start"]
