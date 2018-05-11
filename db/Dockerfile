FROM mysql:5.5.59 

ENV MYSQL_DATABASE=hts MYSQL_ROOT_PASSWORD=password 

ADD hts_schema.sql /docker-entrypoint-initdb.d 

EXPOSE 3306