pipeline {
    agent any
    environment {
        DOCKER_CREDENTIALS_ID = 'dockerhub_credentials'   // Credenciales de Docker Hub
        SSH_CREDENTIALS_ID = 'ssh_vps_credentials'        // Credenciales SSH para el VPS
    }

    stages {
        stage('Check Variables') {
            steps {
                script {
                    // Utilizar withCredentials para manejar credenciales de forma segura
                    withCredentials([
                        string(credentialsId: 'MYSQL_HOST', variable: 'MYSQL_HOST'),
                        string(credentialsId: 'MYSQL_DATABASE', variable: 'MYSQL_DATABASE'),
                        string(credentialsId: 'MYSQL_USER', variable: 'MYSQL_USER'),
                        string(credentialsId: 'MYSQL_PASSWORD', variable: 'MYSQL_PASSWORD'),
                        string(credentialsId: 'GOOGLE_CREDENTIALS', variable: 'GOOGLE_CREDENTIALS'),
                        string(credentialsId: 'SSH_PORT', variable: 'SSH_PORT'),
                        string(credentialsId: 'SSH_HOST', variable: 'SSH_HOST')
                    ]) {
                        // Verificar si las variables están cargando correctamente
                        echo "DEBUG: Verificando si las variables se cargan correctamente"
                        echo "MYSQL_HOST: ${MYSQL_HOST}"
                        echo "MYSQL_DATABASE: ${MYSQL_DATABASE}"
                        echo "MYSQL_USER: ${MYSQL_USER}"
                        echo "GOOGLE_CREDENTIALS: ${GOOGLE_CREDENTIALS}"
                        echo "SSH_PORT: ${SSH_PORT}"
                        echo "SSH_HOST: ${SSH_HOST}"
                    }
                }
            }
        }

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
                    withCredentials([
                        string(credentialsId: 'MYSQL_HOST', variable: 'MYSQL_HOST'),
                        string(credentialsId: 'MYSQL_DATABASE', variable: 'MYSQL_DATABASE'),
                        string(credentialsId: 'MYSQL_USER', variable: 'MYSQL_USER'),
                        string(credentialsId: 'MYSQL_PASSWORD', variable: 'MYSQL_PASSWORD'),
                        string(credentialsId: 'GOOGLE_CREDENTIALS', variable: 'GOOGLE_CREDENTIALS'),
                        string(credentialsId: 'SSH_PORT', variable: 'SSH_PORT'),
                        string(credentialsId: 'SSH_HOST', variable: 'SSH_HOST')
                    ]) {
                        sshagent (credentials: [SSH_CREDENTIALS_ID]) {
                            sh '''
                            ssh -o StrictHostKeyChecking=no -p $SSH_PORT root@$SSH_HOST 'bash -s' <<EOF
                                if [ -d "/var/www/sysmorales" ]; then
                                    echo "El repositorio sysmorales ya existe, haciendo git pull..."
                                    cd /var/www/sysmorales
                                    git reset --hard
                                    git pull origin main
                                else
                                    echo "El repositorio sysmorales no existe, clonándolo..."
                                    cd /var/www
                                    git clone git@github.com:byma-ve/sysmorales.git
                                    cd sysmorales
                                fi

                                # Exportar variables de entorno necesarias para Docker Compose
                                export MYSQL_HOST=$MYSQL_HOST
                                export MYSQL_DATABASE=$MYSQL_DATABASE
                                export MYSQL_USER=$MYSQL_USER
                                export MYSQL_PASSWORD=$MYSQL_PASSWORD
                                export GOOGLE_CREDENTIALS=$GOOGLE_CREDENTIALS

                                docker compose -f /var/www/sysmorales/docker-compose.yml down
                                docker pull bymave/backend-morales-systeam:latest
                                docker pull bymave/frontend-morales-systeam:latest
                                docker compose -f /var/www/sysmorales/docker-compose.yml up -d
                                exit
                            EOF
                            '''
                        }
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