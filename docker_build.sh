#!/bin/bash

source $HOME/allvars
APP_PORT = 8086:8080
export ENVIRONMENT="stg"

build() {
	echo -n "Building ${WEB_DOCKER_REPO} image."
	docker build -t ${WEB_DOCKER_REPO} .
	echo -n "Listing ${WEB_DOCKER_REPO} image."
	docker images
}

test() {
	echo -n "Run ${WEB_DOCKER_REPO} image."
	docker run --name ${WEB_APP_NAME} -p ${APP_PORT} -d ${WEB_DOCKER_REPO} &
	echo -n "Wait until ${WEB_DOCKER_REPO} is fully started."
	sleep 10
	docker logs ${WEB_APP_NAME}
}

release() {
	echo -n "Release ${WEB_IMG} image."
	if [[ ! -z "$DOCKER_PWD" ]]; then
		cat ${DOCKER_PWD} | docker login --username ${DOCKER_USER} --password-stdin
	fi
	docker tag  ${WEB_DOCKER_REPO} ${WEB_DOCKER_REPO}
	docker push ${WEB_DOCKER_REPO}
}

clean() {
	echo -n ""
	echo -n "Cleaning local build environment."
	echo -n ""
	docker stop ${WEB_APP_NAME} 2>/dev/null; true
	docker rm ${WEB_APP_NAME}  2>/dev/null; true
	echo -n ""
	echo -n "Purging local images."
	docker rmi ${WEB_DOCKER_REPO} 2>/dev/null; true
}

help() {
	echo -n ""
	echo -n "Please use \`make <target>' where <target> is one of"
	echo -n ""
	echo -n "  build		Builds the docker image."
	echo -n "  test		Tests image."
	echo -n "  release	Releases images."
	echo -n "  clean		Cleans local images."
	echo -n ""
	echo -n ""
}

if [[ "$1" == "build" ]]; then build;
elif [[ "$1" == "test" ]]; then test;
elif [[ "$1" == "release" ]];then release;
elif [[ "$1" == "clean" ]]; then clean;
elif [[ "$1" == "help" ]];then help;
else
	help
	exit -1
fi
