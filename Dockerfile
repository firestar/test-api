FROM node:stretch

ADD ./ /srv/

RUN cd /srv/;npm install

ENTRYPOINT ["node bin/www"]