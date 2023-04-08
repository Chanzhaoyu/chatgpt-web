import java.time.*
import java.time.format.DateTimeFormatter

def now = LocalDateTime.now()
TODAY = now.format(DateTimeFormatter.ofPattern("yyyy.MM.dd"))

pipeline {
    environment { 
        registry = "jenac/chatgpt-web" 
        registryCredential = 'docker_hub' 
        dockerImage = '' 
    }
    agent any
    stages {
        stage('remove old node base') {
            steps {
                sh "docker rmi -f node:lts-alpine"
            }
        }
        stage('build docker image') {
            steps {
                
                script { 
                    dockerImage = docker.build registry + ":${TODAY}.${BUILD_NUMBER}" 
                }
                
            }
        }
        stage('publish image') { 
            steps { 
                script { 
                    docker.withRegistry( '', registryCredential ) { 
                        dockerImage.push() 
                    }
                } 
            }
        } gst
    }
}