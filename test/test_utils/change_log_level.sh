#!/bin/bash

# Log levels mapping
declare -A LOG_LEVELS
LOG_LEVELS[1]="DEBUG"
LOG_LEVELS[2]="INFO"
LOG_LEVELS[3]="WARNING"
LOG_LEVELS[4]="ERROR"
LOG_LEVELS[5]="CRITICAL"

if [ "$1" == "-i" ]; then
    echo "Pass in an argument like so to change the log level:"

    echo "DEBUG, INFO, WARNING, ERROR, CRITICAL"

else

    log_levels=("DEBUG" "INFO" "ERROR" "WARNING" "CRITICAL")

    # check that only 1 argument is provided
    if [ $# -ne 1 ]; then
        echo "Error: Script Expects argument"
        echo "Enter -i for help or a valid log level"
        exit
    fi

    # Store the input log level
    input_log_level=$1

    # check its valid
    if [[ " ${log_levels[@]} " =~ " ${input_log_level} " ]]; then
        echo "The selected log level is: log.$input_log_level"
    else
        echo "Invalid Log Level"
        echo "Valid values are one of the following: DEBUG, INFO, WARNING, ERROR, CRITICAL"
        exit
    fi


    # Modify the Python file (replace `log.INFO` with the chosen log level)
    sed -i "s/level=log\.[A-Za-z]*\b/level=log.$input_log_level/" ./test_change_log_level.py

    echo "Log level has been updated to $input_log_level in your Python script."

fi