#!/usr/bin/env bash

# Tool for searching for missing Pepfar data indicators

FILE=$1;

if [ ${#FILE} != 0 ]; then

    curl -H "Content-Type: application/json" -X GET -d @$1.json localhost:9200/omrs/pepfar/_search  | jq -s '.[].hits.hits[]._id' > $1.txt;

fi;

