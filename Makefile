#
# Makefile for qqw-popppins on docker
#
# author: Jorge Armando Medina
# desc: Script to build test and release the qqw-popppins docker image.

include /var/lib/jenkins/.env
include /var/lib/jenkins/apps_data

APP_PORT = 8086:8080
WEB_IMG = ${WEB_ORG_NAME}/${WEB_IMG_NAME}:${WEB_VERSION}

.PHONY: all build test release clean help

all: help

build:
	@echo "Building ${WEB_IMG} image."
	docker build -t ${WEB_IMG} .
	@echo "Listing ${WEB_IMG} image."
	docker images

test:
	@echo "Run ${WEB_IMG} image."
	docker run --name ${WEB_APP_NAME} -p ${APP_PORT} -d ${WEB_IMG} &
	@echo "Wait until ${WEB_APP_NAME} is fully started."
	sleep 10
	docker logs ${WEB_APP_NAME}

release:
	@echo "Release ${WEB_IMG} image."
	cat ${DOCKER_PWD} | docker login --username ${DOCKER_USER} --password-stdin
	docker tag  ${WEB_IMG} ${DOCKER_REPO}:${WEB_IMG_NAME}-${WEB_VERSION}
	docker push ${DOCKER_REPO}:${WEB_IMG_NAME}-${WEB_VERSION}

clean:
	@echo ""
	@echo "Cleaning local build environment."
	@echo ""
	docker stop ${WEB_APP_NAME} 2>/dev/null; true
	docker rm ${WEB_APP_NAME}  2>/dev/null; true
	@echo ""
	@echo "Purging local images."
	docker rmi ${WEB_IMG} 2>/dev/null; true

help:
	@echo ""
	@echo "Please use \`make <target>' where <target> is one of"
	@echo ""
	@echo "  build		Builds the docker image."
	@echo "  test		Tests image."
	@echo "  release	Releases images."
	@echo "  clean		Cleans local images."
	@echo ""
	@echo ""
