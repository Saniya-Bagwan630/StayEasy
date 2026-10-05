pipeline {
    agent any

    stages {

        stage('Build Backend Image') {
            steps {
                bat 'docker build -t stayeasy-backend ./backend'
            }
        }

        stage('Build Frontend Image') {
            steps {
                bat 'docker build -t stayeasy-frontend ./frontend'
            }
        }

        stage('Load Images into Minikube') {
            steps {
                bat 'minikube image load stayeasy-backend'
                bat 'minikube image load stayeasy-frontend'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                bat 'kubectl apply -f k8s/'
            }
        }

        stage('Verify Deployment') {
            steps {
                bat 'kubectl get pods'
                bat 'kubectl get services'
            }
        }
    }
}