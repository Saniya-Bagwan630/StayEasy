pipeline {
    agent any

    stages {
        stage('Build Backend Image') {
            steps {
                bat 'docker build -t stayeasy-backend:latest ./backend'
            }
        }

        stage('Build Frontend Image') {
            steps {
                bat 'docker build -t stayeasy-frontend:latest ./frontend'
            }
        }

        stage('Load Images into Minikube') {
            steps {
                bat 'minikube image load stayeasy-backend:latest'
                bat 'minikube image load stayeasy-frontend:latest'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                bat 'kubectl apply -f k8s/'
                bat 'kubectl rollout restart deployment/backend-deployment'
                bat 'kubectl rollout restart deployment/frontend-deployment'
            }
        }

        stage('Verify Deployment') {
            steps {
                bat 'kubectl rollout status deployment/backend-deployment --timeout=120s'
                bat 'kubectl rollout status deployment/frontend-deployment --timeout=120s'
                bat 'kubectl get pods'
                bat 'kubectl get services'
            }
        }
    }
}
