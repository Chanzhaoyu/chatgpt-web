import java.time.*
import java.time.format.DateTimeFormatter

def now = LocalDateTime.now()
TODAY = now.format(DateTimeFormatter.ofPattern("yyyy.MM.dd"))

pipeline {
   agent any
    stages {
        stage('build docker image') {
            steps {
                sh "docker build . -t jenac/chatgpt-web:${TODAY}.${BUILD_NUMBER} --network host"
            }
        }
    }
}