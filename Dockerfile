FROM nginx:alpine
COPY . /usr/shre/nginx/html
EXPOSE 8080