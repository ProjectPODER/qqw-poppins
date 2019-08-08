#!/bin/bash

WEB_ORG_NAME=poder
WEB_APP_NAME=qqw-poppins
WEB_VERSION=$(cat package.json | jq -r .version)
WEB_IMG=${WEB_ORG_NAME}/${WEB_APP_NAME}:${WEB_VERSION}
APPS_DATA_FILE=/var/lib/jenkins/apps_data

[[ ! -f "$APPS_DATA_FILE" ]] && touch $APPS_DATA_FILE
chown jenkins:jenkins $APPS_DATA_FILE;

sed -i \
 -e '/^WEB_VERSION/ d'  \
 -e '/^WEB_ORG_NAME/ d' \
 -e '/^WEB_APP_NAME/ d' \
 -e '/^WEB_IMG/ d' \
$APPS_DATA_FILE
echo "WEB_VERSION=$WEB_VERSION" >> $APPS_DATA_FILE
echo "WEB_ORG_NAME=$WEB_ORG_NAME" >> $APPS_DATA_FILE
echo "WEB_APP_NAME=$WEB_APP_NAME" >> $APPS_DATA_FILE
echo "WEB_IMG=$WEB_IMG" >> $APPS_DATA_FILE
