#
# Makefile for qqw-popppins on docker
#
# author: Jorge Armando Medina
# desc: Script to build the qqw-popppins docker images using docker build.

#include /var/lib/jenkins/.env

ORG_NAME = poder
APP_NAME = qqw-popppins
APP_PORT = 8085:8080
APP_VERSION = 0.0.0
IMAGE_NAME = ${ORG_NAME}/${APP_NAME}:${APP_VERSION}
REGISTRY_URL = localhost:5000

.PHONY: all build test clean purge help

all: help

build:
	@echo "Building ${IMAGE_NAME} image."
	docker build -t ${IMAGE_NAME} .

test:
	@echo "Run ${IMAGE_NAME} image."
	docker run --name ${APP_NAME} -p ${APP_PORT} -d ${IMAGE_NAME} &
	@echo "Wait until ${APP_NAME} is fully started."
	sleep 10
	docker logs ${APP_NAME}

deploy:
	cat ${DOCKER_PWD} | docker login --username ${DOCKER_USER} --password-stdin
	docker tag  ${IMAGE_NAME} ${DOCKER_REPO}:${APP_NAME}-${APP_VERSION}
	docker push ${DOCKER_REPO}:${APP_NAME}-${APP_VERSION}
	@echo "Listing ${IMAGE_NAME} image."
	docker images

clean:
	@echo ""
	@echo "Cleaning local build environment."
	@echo ""
	docker stop ${APP_NAME} 2>/dev/null; true
	docker rm ${APP_NAME}  2>/dev/null; true
	@echo ""
	docker rmi ${IMAGE_NAME} 2>/dev/null; true

help:
	@echo ""
	@echo "Please use \`make <target>' where <target> is one of"
	@echo ""
	@echo "  build		Builds the docker image."
	@echo "  test		Test image."
	@echo "  deploy	Deploys local images."
	@echo "  clean		Cleans local images."
	@echo ""
	@echo ""

