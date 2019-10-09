#!/bin/bash

[[ ! -f $HOME/allvars ]] && { echo -e "[ERROR]: No se encontro allvars deployado"; exit -1; }

source $HOME/allvars
APP_PORT=8086:8080
APP_VERSION=$(cat package.json | jq -r .version)
REPO=${DOCKER_REPO}/${WEB_ORG_NAME}:${APP_VERSION}
export ENVIRONMENT="stg"


build() {
	echo -e "Building ${REPO} image."
	docker build -t ${REPO} .
	echo -e "Listing ${REPO} image."
	docker images
}

test() {
	echo -e "Run ${REPO} image."
	docker run --name ${WEB_APP_NAME} -p ${APP_PORT} -d ${REPO} &
	sleep 5
	docker logs ${WEB_APP_NAME}
}

release() {
	echo -e "Release ${REPO} image."
	if [[ ! -z "$DOCKER_PWD" ]]; then
		cat ${DOCKER_PWD} | docker login --username ${DOCKER_USER} --password-stdin
	fi
	docker tag  ${REPO} ${REPO}
	docker push ${REPO}
}

clean() {
	echo -e "Cleaning local build environment."
	docker stop ${WEB_APP_NAME} 2>/dev/null; true
	docker rm ${WEB_APP_NAME}  2>/dev/null; true
	docker rmi ${REPO} 2>/dev/null; true
}

help() {
	echo -e ""
	echo -e "Please use: 'bash $0 <target>' where <target> is one of"
	echo -e ""
	echo -e "  build		Builds the docker image."
	echo -e "  test		Tests image."
	echo -e "  release	Releases images."
	echo -e "  clean		Cleans local images."
	echo -e ""
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
