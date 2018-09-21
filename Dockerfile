FROM node:stretch

ADD . /srv/

RUN cd /srv/;npm install

ENTRYPOINT ["cd /srv/;node bin/www"]