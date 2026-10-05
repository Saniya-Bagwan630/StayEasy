pipeline {
    agent any
    
    environment {
        KUBECONFIG = '/var/jenkins_home/.kube/config'
    }

    stages {

        stage('Build Backend Image') {
            steps {
                sh 'docker build -t stayeasy-backend:latest ./backend'
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh 'docker build -t stayeasy-frontend:latest ./frontend'
            }
        }

        stage('Load Images into Minikube') {
            steps {
                sh '''
                    docker save stayeasy-backend:latest | \
                    docker exec -i minikube ctr -n k8s.io images import -
                '''

                sh '''
                    docker save stayeasy-frontend:latest | \
                    docker exec -i minikube ctr -n k8s.io images import -
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f k8s/'

                sh 'kubectl rollout restart deployment/backend-deployment'
                sh 'kubectl rollout restart deployment/frontend-deployment'
            }
        }

        stage('Verify Deployment') {
            steps {
                sh 'kubectl rollout status deployment/backend-deployment --timeout=120s'
                sh 'kubectl rollout status deployment/frontend-deployment --timeout=120s'

                sh 'kubectl get pods'
                sh 'kubectl get services'
            }
        }
    }
}