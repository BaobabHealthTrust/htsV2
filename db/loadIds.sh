#!/bin/bash

usage(){

    cat<<EOF
    
    usage: $0 OPTIONS
    
    This script is run to load valid DHA usernames
    to the provided database. Fill all required fields marked with *
    
    OPTIONS
    -h  Show this message
    -f  * Text file with list of ids to load with each id on a separate line
    -u  * Database username
    -p  * Database password
    -h  * Database hostname or IP address
    -d  * Database name
    
EOF
}

FILENAME=
USERNAME=
PASSWORD=
HOST=
DATABASE=

while getopts "f:u:p:h:d:" OPTION
do

    case $OPTION in
        f)
            FILENAME=$OPTARG
            ;;
        u)
            USERNAME=$OPTARG
            ;;
        p)
            PASSWORD=$OPTARG
            ;;
        h)
            HOST=$OPTARG
            ;;
        d)
            DATABASE=$OPTARG
            ;;
        ?)
            usage
            exit 1
            ;;
    esac
    
done
  
if [ ${#FILENAME} -eq 0 ] || [ ${#USERNAME} -eq 0 ] || [ ${#PASSWORD} -eq 0 ] || [ ${#HOST} -eq 0 ] || [ ${#DATABASE} -eq 0 ]; then

    usage
    
    exit 1;

fi

declare -a MYARRAY;

readarray MYARRAY < $FILENAME;

SIZE=${#MYARRAY[@]};
BATCH=10000;

for i in `seq 0 $BATCH $SIZE`; do

    echo "Loading group $i...";

    declare -a GROUP;

    GROUP=${MYARRAY[@]:$i:$BATCH};

    SQL=$(printf "\"),(\"%s" ${GROUP[@]});
    SQL=${SQL:3};

    # echo $SQL;

    mysql -h $HOST -u $USERNAME -p$PASSWORD $DATABASE -e "INSERT INTO hts_valid_usernames (username) VALUES $SQL\")";
    
    if [ $? -ne 0 ]; then
	
		exit 1;
	
	fi

done
