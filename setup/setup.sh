#!/bin/bash

usage(){

    cat<<EOF
   
    usage: $0 OPTIONS
    
    This tool is for setting up the application to run as a service. 
    
    OPTIONS
    -h  Show this message
    -w  Define application working directory. Defaults to current directory
    -s  Define local docker repository hostname (Required)
    -c  Define local docker repository certificate full path to copy 
            from (Required). Note that the path should include the full source
            filename and path e.g. /home/user/domain.cert
    
EOF

}

LOCAL_DOCKER_SERVER_IP=

WORKING_DIR=$(pwd);

CERTIFICATE_PATH=

while getopts "hw:s:c:" OPTION
do

    case $OPTION in
        h)
            usage
            exit 0
            ;;
        w)
            WORKING_DIR=$OPTARG
            ;;
        s)
            LOCAL_DOCKER_SERVER_IP=$OPTARG
            ;;
        c)
            CERTIFICATE_PATH=$OPTARG
            ;;
        ?)
            usage
            exit 1
            ;;
    esac

done

if [ ${#LOCAL_DOCKER_SERVER_IP} -eq 0 ] || [ ${#CERTIFICATE_PATH} -eq 0 ]; then

    usage
    exit 1;

fi

echo "
version: \"2.1\"

services:
  hts:
    restart: always
    image: $LOCAL_DOCKER_SERVER_IP/htslb_hts
    environment:
      PORT: 3000
      REDIS_HOST: redis
    ports:
      - 3000:3000
    volumes:
      - .:/usr/src/app
    container_name: hts
    depends_on:
      elasticsearch:
        condition: service_healthy
      redis:
        condition: service_healthy
      dde:
        condition: service_healthy
      mysql:
        condition: service_healthy
    links:
      - elasticsearch
      - redis
      - mysql
    networks: 
      - ntwk
  elasticsearch:
    image: $LOCAL_DOCKER_SERVER_IP/elasticsearch:5.3.0
    container_name: es
    volumes:
      - /opt/es_data:/usr/share/elasticsearch/data
    ports:
      - 9201:9200
    healthcheck:
      test: curl 0.0.0.0:9200
    networks: 
      - ntwk
  kibana:
    image: $LOCAL_DOCKER_SERVER_IP/kibana:5.3.0
    container_name: kb
    ports:
      - 5602:5601
    depends_on:
      - elasticsearch
    links:
      - elasticsearch
    networks: 
      - ntwk
  couchdb:
    image: $LOCAL_DOCKER_SERVER_IP/couchdb:1.7.1
    container_name: cb
    healthcheck:
      test: curl 0.0.0.0:5984
    volumes:
      - /opt/cb_data:/usr/local/var/lib/couchdb
    ports:
      - 5985:5984
    environment:
      COUCHDB_USER: admin
      COUCHDB_PASSWORD: test
    networks: 
      - ntwk
  mysql:
    image: $LOCAL_DOCKER_SERVER_IP/htslb_mysql
    container_name: ms
    healthcheck:
      test: mysqladmin --silent --wait -uroot -ppassword ping || exit 1
    volumes:
      - /opt/mysql_data:/var/lib/mysql
    ports:
      - 3307:3306
    networks: 
      - ntwk
  redis:
    image: $LOCAL_DOCKER_SERVER_IP/redis:4.0.8
    container_name: rd
    healthcheck:
      test: redis-cli ping
    ports:
      - 6479:6379
    networks: 
      - ntwk
  dde:
    image: $LOCAL_DOCKER_SERVER_IP/kachaje/dde3_0
    container_name: dde
    ports: 
      - 3009:3009
    depends_on:
      elasticsearch:
        condition: service_healthy
      couchdb:
        condition: service_healthy
    healthcheck:
      test: curl 0.0.0.0:3009
    links:
      - elasticsearch
      - couchdb
    networks: 
      - ntwk
volumes:
  esdata:
    driver: local
  cbdata:
    driver: local
  mysqldata:
networks: 
  ntwk:
" > $WORKING_DIR/docker-compose.yml

echo "[Unit]
Description=Docker Compose Application Service
Requires=docker.service
After=docker.service

[Service]
WorkingDirectory=$WORKING_DIR
ExecStart=/usr/local/bin/docker-compose up
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0
Restart=on-failure
StartLimitIntervalSec=60
StartLimitBurst=3

[Install]
WantedBy=multi-user.target" > /etc/systemd/system/docker-compose-app.service;

systemctl enable docker-compose-app;

mkdir -p /etc/docker/certs.d/$LOCAL_DOCKER_SERVER_IP;

cp $CERTIFICATE_PATH /etc/docker/certs.d/$LOCAL_DOCKER_SERVER_IP/ca.crt;
