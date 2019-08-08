#!/bin/bash

source /var/lib/jenkins/.env

WEB_ORG_NAME=qqw-poppins
WEB_APP_NAME=quienesquienweb
WEB_VERSION=$(cat package.json | jq -r .version)
WEB_IMG_NAME=$WEB_VERSION
WEB_DOCKER_REPO=${DOCKER_REPO}/${WEB_ORG_NAME}:${WEB_IMG_NAME}
APPS_DATA_FILE=/var/lib/jenkins/apps_data

[[ ! -f "$APPS_DATA_FILE" ]] && touch $APPS_DATA_FILE
chown jenkins:jenkins $APPS_DATA_FILE;

sed -i \
 -e '/^WEB_VERSION/ d'  \
 -e '/^WEB_ORG_NAME/ d' \
 -e '/^WEB_APP_NAME/ d' \
 -e '/^WEB_IMG_NAME/ d' \
 -e '/^WEB_DOCKER_REPO/ d' \
$APPS_DATA_FILE
echo "WEB_VERSION=$WEB_VERSION" >> $APPS_DATA_FILE
echo "WEB_ORG_NAME=$WEB_ORG_NAME" >> $APPS_DATA_FILE
echo "WEB_APP_NAME=$WEB_APP_NAME" >> $APPS_DATA_FILE
echo "WEB_IMG_NAME=$WEB_IMG_NAME" >> $APPS_DATA_FILE
echo "WEB_DOCKER_REPO=$WEB_DOCKER_REPO" >> $APPS_DATA_FILE
