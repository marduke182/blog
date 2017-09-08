FROM nginx
VOLUME /public
COPY nginx.conf /etc/nginx/nginx.conf
