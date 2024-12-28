FROM nginx:alpine
COPY ./fastcgi-symfony.conf /etc/nginx/snippets/fastcgi-symfony.conf
COPY ./nginx.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]

#TODO
#ADD QA Dockerfile
