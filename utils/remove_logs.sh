#!/bin/bash

if [ -f "app.log" ]; then
    echo "Removing app.log"
    rm "app.log"
    echo "Done"
else
    echo "app.log does not exist"
fi
