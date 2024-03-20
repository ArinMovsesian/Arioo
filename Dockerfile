FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY ./build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

ADD ./nginx.conf /etc/nginx/conf.d/

WORKDIR /usr/share/nginx/html