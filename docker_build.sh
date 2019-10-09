#!/bin/bash

source $HOME/allvars
APP_PORT=8086:8080
export ENVIRONMENT="stg"

build() {
	echo -e "Building ${WEB_DOCKER_REPO} image."
	docker build -t ${WEB_DOCKER_REPO} .
	echo -e "Listing ${WEB_DOCKER_REPO} image."
	docker images
}

test() {
	echo -e "Run ${WEB_DOCKER_REPO} image."
	docker run --name ${WEB_APP_NAME} -p ${APP_PORT} -d ${WEB_DOCKER_REPO} &
	echo -e "Wait until ${WEB_DOCKER_REPO} is fully started."
	sleep 10
	docker logs ${WEB_APP_NAME}
}

release() {
	echo -e "Release ${WEB_IMG} image."
	if [[ ! -z "$DOCKER_PWD" ]]; then
		cat ${DOCKER_PWD} | docker login --username ${DOCKER_USER} --password-stdin
	fi
	docker tag  ${WEB_DOCKER_REPO} ${WEB_DOCKER_REPO}
	docker push ${WEB_DOCKER_REPO}
}

clean() {
	echo -e ""
	echo -e "Cleaning local build environment."
	echo -e ""
	docker stop ${WEB_APP_NAME} 2>/dev/null; true
	docker rm ${WEB_APP_NAME}  2>/dev/null; true
	echo -e ""
	echo -e "Purging local images."
	docker rmi ${WEB_DOCKER_REPO} 2>/dev/null; true
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
