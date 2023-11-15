FROM node:18-alpine

RUN apk add --no-cache bash
RUN yarn global add @nestjs/cli typescript ts-node

COPY package.json /tmp/app/
COPY yarn.lock /tmp/app/
RUN cd /tmp/app && yarn

COPY . /usr/src/app
RUN cp -a /tmp/app/node_modules /usr/src/app
COPY ./wait-for-it.sh /opt/wait-for-it.sh
COPY ./startup.ci.sh /opt/startup.ci.sh
RUN sed -i 's/\r//g' /opt/wait-for-it.sh
RUN sed -i 's/\r//g' /opt/startup.ci.sh

WORKDIR /usr/src/app
RUN cp example.env .env
RUN yarn build

CMD ["/opt/startup.ci.sh"]
