#!/bin/bash

echo "Instance has been started."

/usr/bin/indexer -c /sphinx/conf/sphinx.conf --rotate --all

echo "Database has been indexed."

/usr/bin/searchd -c /sphinx/conf/sphinx.conf --nodetach "$@"

echo "Searchd has been run."

while true; do 
    sleep 3600
done