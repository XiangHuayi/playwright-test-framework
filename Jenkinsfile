pipeline {
    agent any
    
    tools {
        nodejs 'Node.js 18'
    }
    
    stages {
        stage('检出代码') {
            steps {
                checkout scm
            }
        }
        
        stage('安装依赖') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('安装Playwright浏览器') {
            steps {
                sh 'npx playwright install --with-deps'
            }
        }
        
        stage('运行自动化测试') {
            steps {
                sh 'npm run test:allure'
            }
            
            post {
                always {
                    // 生成Allure报告
                    sh 'npm run allure:generate'
                    
                    // 发布Allure报告
                    allure([
                        includeProperties: false,
                        jdk: '',
                        properties: [],
                        reportBuildPolicy: 'ALWAYS',
                        results: [[path: './reports/allure-results']]
                    ])
                }
            }
        }
        
        stage('部署到测试环境') {
            when {
                branch 'main'
                expression { currentBuild.resultIs('SUCCESS') }
            }
            steps {
                sh 'echo "测试通过，部署到测试环境..."'
                // 这里可以添加实际的部署脚本
            }
        }
    }
    
    post {
        always {
            // 清理工作空间
            cleanWs()
        }
        
        success {
            // 发送成功通知
            echo '自动化测试执行成功！'
            // 可以添加邮件通知或其他通知方式
        }
        
        failure {
            // 发送失败通知
            echo '自动化测试执行失败！'
            // 可以添加邮件通知或其他通知方式
        }
    }
}
