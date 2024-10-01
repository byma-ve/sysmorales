pipeline {
    agent any
    environment {
        DOCKER_CREDENTIALS_ID = 'dockerhub_credentials'   // Credenciales de Docker Hub
        SSH_CREDENTIALS_ID = 'ssh_vps_credentials'        // Credenciales SSH para el VPS
        GOOGLE_CREDENTIALS = credentials('GOOGLE_CREDENTIALS')  // Credenciales de Google
        MYSQL_HOST = credentials('MYSQL_HOST')            // Host de la base de datos MySQL
        MYSQL_DATABASE = credentials('MYSQL_DATABASE')    // Nombre de la base de datos
        MYSQL_USER = credentials('MYSQL_USER')            // Usuario de MySQL
        MYSQL_PASSWORD = credentials('MYSQL_PASSWORD')    // Contraseña de MySQL
        SSH_PORT = credentials('SSH_PORT')                // Puerto SSH
        SSH_HOST = credentials('SSH_HOST')                // Host del VPS
    }

    stages {
        stage('Check Variables') {
            steps {
                script {
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
                        ssh -o StrictHostKeyChecking=no -tt -p ${SSH_PORT} root@${SSH_HOST} << EOF
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
                            export MYSQL_HOST=${MYSQL_HOST}
                            export MYSQL_DATABASE=${MYSQL_DATABASE}
                            export MYSQL_USER=${MYSQL_USER}
                            export MYSQL_PASSWORD=${MYSQL_PASSWORD}
                            export GOOGLE_CREDENTIALS=${GOOGLE_CREDENTIALS}

                            docker compose -f /var/www/sysmorales/docker-compose.yml down
                            docker pull bymave/backend-morales-systeam:latest
                            docker pull bymave/frontend-morales-systeam:latest
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
