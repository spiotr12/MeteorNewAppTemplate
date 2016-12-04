#!/bin/bash
#=========================================================
# give file permissions
#       sudo chmod a+x /path/to/file
# create link in /usr/bin to run app using this script
#       sudo ln /path/to/file/run.sh /usr/bin/<name>
#=========================================================

clear

# Change dit to your project directory
#cd /home/<ursename>/<path to project dir>

# Change mongodb url, app root url, port number and settings json file
MONGO_URL='mongodb://localhost:27017/<db name>' ROOT_URL='http://<url>:<port>' meteor --port <port> --settings dev.json

