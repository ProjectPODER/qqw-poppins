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
          BRANCH='*/hotfix/pipeline_env'
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
        echo "Set App Vars"
        sh 'bash setAppData.sh'
        echo "Clean container and Image"
        sh 'make clean'
      }
    }
    stage ('Build Image') {
      agent { label 'swarm' }
      steps {
        script {
          echo "Build container"
          sh 'make build'
        }
      }
    }
    stage ('Test Image') {
      agent { label 'swarm' }
      steps {
        script {
          echo "Test container"
          sh 'make test'
        }
      }
    }
    stage ('Release Image') {
      agent { label 'swarm' }
      steps {
        script {
          echo "Push container image to dockerhub registry"
          sh 'make release'
          echo "Clean container and Image"
          sh 'make clean'
        }
      }
    }
    stage ('Deploy to cluster') {
      steps {
        script {
          URL='http://gitlab.rindecuentas.org/equipo-qqw/qqw-doks.git'
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
        echo "Deploy to Cluster"
        sh 'cd kubernetes/qqw-popppins; bash scripts/deploy.sh'
      }
    } // End stage deploy
    stage ('TestWeb') {
      steps {
        build 'testweb-qqw-popppins'
      }
    }
  }
}
