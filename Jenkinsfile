def URL
def BRANCH
def CREDENTIALS

pipeline {
  agent { label 'swarm' }
  stages {
    stage ('Checkout and Clean') {
      steps {
        script {
          URL='https://gitlab.com/kronops/qqw-popppins.git'
          BRANCH='*/master'
          CREDENTIALS='c992e8db-63b4-449d-8df4-85f7f084ddab'
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
        echo "Clean container and Image"
        sh 'make clean'
      }
    }
    stage ('Build and Run') {
      agent { label 'swarm' }
      steps {
        script {
          echo "Build container"
          sh 'make build'
        }
      }
    }
    stage ('Test') {
      agent { label 'swarm' }
      steps {
        script {
          echo "Run container"
          sh 'make test'
        }
      }
    }
    stage ('Deploy') {
      agent { label 'swarm' }
      steps {
        script {
          echo "Push to dockerhub container"
          sh 'make deploy'
        }
      }
    }
  }
}

