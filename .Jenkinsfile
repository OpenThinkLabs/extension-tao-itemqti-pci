pipeline {
    agent {
        label 'builder'
    }
    stages {
        stage('Resolve TAO dependencies') {
            environment {
                GITHUB_ORGANIZATION='oat-sa'
                REPO_NAME='oat-sa/extension-tao-itemqti-pci'
            }
            steps {
                sh(
                    label : 'Create build build directory',
                    script: 'mkdir -p build'
                )

                withCredentials([string(credentialsId: 'jenkins_github_token', variable: 'GIT_TOKEN')]) {
                    sh(
                        label : 'Run the Dependency Resolver',
                        script: '''
changeBranch=$CHANGE_BRANCH
TEST_BRANCH="${changeBranch:-$BRANCH_NAME}"
echo "select branch : ${TEST_BRANCH}"
docker run --rm  \\
-e "GITHUB_ORGANIZATION=${GITHUB_ORGANIZATION}" \\
-e "GITHUB_SECRET=${GIT_TOKEN}"  \\
tao/dependency-resolver oat:dependencies:resolve --main-branch ${TEST_BRANCH} --repository-name ${REPO_NAME} > build/composer.json
                        '''
                    )
                }
            }
        }
        stage('Install') {
            agent {
                docker {
                    image 'alexwijn/docker-git-php-composer'
                    reuseNode true
                }
            }
            environment {
                HOME = '.'
            }
            options {
                skipDefaultCheckout()
            }
            steps {
                dir('build') {
                    sh(
                        label: 'Install/Update sources from Composer',
                        script: 'COMPOSER_DISCARD_CHANGES=true composer update --no-interaction --no-ansi --no-progress --no-scripts'
                    )
                    sh(
                        label: 'Add phpunit',
                        script: 'composer require phpunit/phpunit:^8.5'
                    )
                    sh(
                        label: "Extra filesystem mocks",
                        script: '''
mkdir -p taoQtiItem/views/js/mathjax/ && touch taoQtiItem/views/js/mathjax/MathJax.js
mkdir -p tao/views/locales/en-US/
    echo "{\\"serial\\":\\"${BUILD_ID}\\",\\"date\\":$(date +%s),\\"version\\":\\"3.3.0-${BUILD_NUMBER}\\",\\"translations\\":{}}" > tao/views/locales/en-US/messages.json
mkdir -p tao/views/locales/en-US/
                        '''
                    )
                }
            }
        }
        stage('Tests') {
            parallel {
                stage('Backend Tests') {
                    agent {
                        docker {
                            image 'alexwijn/docker-git-php-composer'
                            reuseNode true
                        }
                    }
                    options {
                        skipDefaultCheckout()
                    }
                    when {
                        expression {
                            fileExists('build/qtiItemPci/test/unit')
                        }
                    }
                    steps {
                        dir('build'){
                            sh(
                                label: 'Run backend tests',
                                script: './vendor/bin/phpunit qtiItemPci/test/unit'
                            )
                        }
                    }
                }
                stage('Frontend Tests') {
                    when {
                        expression {
                            fileExists('build/qtiItemPci/views/build/grunt/test.js')
                        }
                    }
                    agent {
                        docker {
                            image 'btamas/puppeteer-git'
                            reuseNode true
                        }
                    }
                    environment {
                        HOME = '.'
                    }
                    options {
                        skipDefaultCheckout()
                    }
                    steps {
                        dir('build/qtiItemPci/views'){
                            sh(
                                label: 'Ensure FE resource are available',
                                script: 'npm install --production'
                            )
                        }
                        dir('build/qtiItemPci/views/build') {
                            sh(
                                label: 'Setup frontend toolchain',
                                script: 'npm install'
                            )
                            sh (
                                label : 'Run frontend tests',
                                script: 'npx grunt qtiitempcitest'
                            )
                        }
                    }
                }
            }
        }
    }
}