FROM node:12-alpine as retaily-web-app-builder
ARG WORKDIR=/usr/local/src/retaily-web-app
RUN mkdir -p ${WORKDIR}
COPY . ${WORKDIR}
WORKDIR ${WORKDIR}
RUN npm install
RUN npm run build

FROM nginx:1.18-alpine
RUN apk --update add iputils curl
#RUN addgroup -S retaily-web-app && adduser -S retaily-web-app -G retaily-web-app
#USER retaily-web-app:retaily-web-app
ARG WORKDIR=/usr/share/nginx/html
WORKDIR ${WORKDIR}
COPY --from=retaily-web-app-builder /usr/local/src/retaily-web-app/build/ ${WORKDIR}/
COPY --from=retaily-web-app-builder /usr/local/src/retaily-web-app/docker.nginx.default.conf /etc/nginx/conf.d/default.conf
#ENTRYPOINT tail -f /dev/null
ENTRYPOINT nginx -g 'daemon off;'
