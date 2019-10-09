def URL
def BRANCH
def CREDENTIALS

pipeline {
  agent { label 'swarm' }
  stages {
    stage ('Checkout') {
      steps {
        script {
          URL='http://gitlab.rindecuentas.org/equipo-qqw/qqw-popppins.git'
          BRANCH='*/master'
          CREDENTIALS='f28cf2d5-ce55-4f0b-9bad-c84376ce401d'
        }
          dir('new-dir') { sh 'pwd' }
          ansiColor('xterm') {
            checkout changelog: false, poll: false, scm:
            [$class:
             'GitSCM', branches: [[name: BRANCH]],
              doGenerateSubmoduleConfigurations: false,
              extensions: [],
              submoduleCfg: [],
              userRemoteConfigs:
              [[
                credentialsId: CREDENTIALS,
                url: URL
              ]]
            ]
          }
        sh 'bash docker_build.sh clean'
      }
    }
    stage ('Build Image') {
      agent { label 'swarm' }
      steps {
        script {
          echo "Build container"
          sh 'bash docker_build.sh build'
        }
      }
    }
    stage ('Test Image') {
      agent { label 'swarm' }
      steps {
        script {
          echo "Test container"
          sh 'bash docker_build.sh test'
        }
      }
    }
    stage ('Release Image') {
      agent { label 'swarm' }
      steps {
        script {
          echo "Push container image to dockerhub registry"
          sh 'bash docker_build.sh release'
          echo "Clean container and Image"
          sh 'bash docker_build.sh clean'
        }
      }
    }
  }
}
