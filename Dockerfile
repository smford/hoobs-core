FROM node:10.18.0-alpine3.10

RUN apk add --no-cache --virtual .gyp-deps python make gcc g++ git avahi-compat-libdns_sd avahi-dev dbus iputils nano
RUN chmod 4755 /bin/ping
RUN mkdir /hoobs

WORKDIR /usr/src/hoobs
VOLUME /hoobs

COPY dist ./dist
COPY lib ./lib
COPY scripts ./scripts
COPY bin/hoobs-docker ./bin/hoobs
COPY default-docker.json ./default.json
COPY package.json ./
COPY LICENSE ./
COPY docker /

RUN npm install --only=production

RUN [ "${AVAHI:-1}" = "1" ] || (rm -rf /etc/services.d/avahi \
    /etc/services.d/dbus \
    /etc/cont-init.d/40-dbus-avahi)

CMD [ "bin/hoobs" ]