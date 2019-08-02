#
# Makefile for qqw-popppins on docker
#
# author: Jorge Armando Medina
# desc: Script to build test and release the qqw-popppins docker image.

include /var/lib/jenkins/.env

ORG_NAME = poder
APP_NAME = qqw-poppins
APP_PORT = 8086:8080
APP_VERSION = 0.2.0
IMAGE_NAME = ${ORG_NAME}/${APP_NAME}:${APP_VERSION}

.PHONY: all build test release clean help

all: help

build:
	@echo "Building ${IMAGE_NAME} image."
	docker build -t ${IMAGE_NAME} .
	@echo "Listing ${IMAGE_NAME} image."
	docker images

test:
	@echo "Run ${IMAGE_NAME} image."
	docker run --name ${APP_NAME} -p ${APP_PORT} -d ${IMAGE_NAME} &
	@echo "Wait until ${APP_NAME} is fully started."
	sleep 10
	docker logs ${APP_NAME}

release:
	@echo "Release ${IMAGE_NAME} image."
	cat ${DOCKER_PWD} | docker login --username ${DOCKER_USER} --password-stdin
	docker tag  ${IMAGE_NAME} ${DOCKER_REPO}:${APP_NAME}-${APP_VERSION}
	docker push ${DOCKER_REPO}:${APP_NAME}-${APP_VERSION}

clean:
	@echo ""
	@echo "Cleaning local build environment."
	@echo ""
	docker stop ${APP_NAME} 2>/dev/null; true
	docker rm ${APP_NAME}  2>/dev/null; true
	@echo ""
	@echo "Purging local images."
	docker rmi ${IMAGE_NAME} 2>/dev/null; true

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

