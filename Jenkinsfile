pipeline {
    agent any
    environment {
        DOCKER_CREDENTIALS_ID = 'dockerhub_credentials'   // Credenciales de Docker Hub
        SSH_CREDENTIALS_ID = 'ssh_vps_credentials'        // Credenciales SSH para el VPS
        GOOGLE_CREDENTIALS = credentials('GOOGLE_CREDENTIALS')  // Credenciales de Google
        MYSQL_HOST = credentials('MYSQL_HOST')
        MYSQL_DATABASE = credentials('MYSQL_DATABASE')
        MYSQL_USER = credentials('MYSQL_USER')
        MYSQL_PASSWORD = credentials('MYSQL_PASSWORD')
        SSH_PORT = credentials('SSH_PORT')
        SSH_HOST = credentials('SSH_HOST')
    }

    stages {
        stage('Build Backend') {
            steps {
                script {
                    docker.build("bymave/backend-morales-systeam:latest", "-f BackendApiRest/Dockerfile ./BackendApiRest")
                }
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    docker.build("bymave/frontend-morales-systeam:latest", "-f frontend/Dockerfile ./frontend")
                }
            }
        }

        stage('Push Docker Images to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_CREDENTIALS_ID}") {
                        docker.image("bymave/backend-morales-systeam:latest").push('latest')
                        docker.image("bymave/frontend-morales-systeam:latest").push('latest')
                    }
                }
            }
        }

        stage('Deploy on VPS') {
            steps {
                script {
                    sshagent (credentials: [SSH_CREDENTIALS_ID]) {
                        sh '''
                        ssh -o StrictHostKeyChecking=no -p ${SSH_PORT} root@${SSH_HOST} << EOF
                            # Verificar si el repositorio sysmorales ya existe
                            if [ -d "/var/www/sysmorales" ]; then
                                echo "El repositorio sysmorales ya existe, haciendo git pull..."
                                cd /var/www/sysmorales
                                git reset --hard   # Asegura que no haya cambios locales
                                git pull origin main
                            else
                                echo "El repositorio sysmorales no existe, clonándolo..."
                                cd /var/www
                                git clone git@github.com:byma-ve/sysmorales.git
                                cd sysmorales
                            fi

                            # Detener los contenedores actuales si están corriendo
                            docker compose -f /var/www/sysmorales/docker-compose.yml down

                            # Actualizar las imágenes desde Docker Hub
                            docker pull bymave/backend-morales-systeam:latest
                            docker pull bymave/frontend-morales-systeam:latest

                            # Levantar los contenedores con las últimas imágenes
                            docker compose -f /var/www/sysmorales/docker-compose.yml up -d
                        EOF
                        '''
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
