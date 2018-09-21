FROM node:stretch

ADD . /

RUN npm install

ENTRYPOINT ["node", "bin/www"]