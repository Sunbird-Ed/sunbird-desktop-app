@Library('deploy-conf') _
node() {
    try {
        String ANSI_GREEN = "\u001B[32m"
        String ANSI_NORMAL = "\u001B[0m"
        String ANSI_BOLD = "\u001B[1m"
        String ANSI_RED = "\u001B[31m"
        String ANSI_YELLOW = "\u001B[33m"
        
        ansiColor('xterm') {
            stage('Checkout') {
                cleanWs()
                if(params.github_release_tag == ""){
                    checkout scm
                    commit_hash = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    branch_name = sh(script: 'git name-rev --name-only HEAD | rev | cut -d "/" -f1| rev', returnStdout: true).trim()
                    artifact_version = branch_name + "_" + commit_hash
                    println(ANSI_BOLD + ANSI_YELLOW + "github_release_tag not specified, using the latest commit hash: " + commit_hash + ANSI_NORMAL)
                }
                else {
                    def scmVars = checkout scm
                    checkout scm: [$class: 'GitSCM', branches: [[name: "refs/tags/${params.github_release_tag}"]],  userRemoteConfigs: [[url: scmVars.GIT_URL]]]
                    artifact_version = params.github_release_tag
                    println(ANSI_BOLD + ANSI_YELLOW + "github_release_tag specified, building from github_release_tag: " + params.github_release_tag + ANSI_NORMAL)
                }
                echo "artifact_version: "+ artifact_version
            }
        }

        stage('Build') {
            sh """
                        cd src
                        npm install
                        npm run build
                    """
        }

        stage('Archive artifacts'){
            if(params.profile_id == "platform-services"){
                 sh """
                        mkdir lp_artifacts
                        cp platform-modules/service/target/learning-service.war lp_artifacts
                        cp searchIndex-platform/module/search-api/search-manager/target/search-manager*.zip lp_artifacts
                        cp platform-tools/spikes/sync-tool/target/sync-tool*.jar lp_artifacts
                        cp platform-tools/spikes/content-tool/target/content-tool-*.jar lp_artifacts
                        zip -j lp_artifacts.zip:${artifact_version} lp_artifacts/*
                    """
            }        
            else {
                 sh """
                               mkdir offline_desktop_artifacts
                               cp -r src offline_desktop_artifacts
                               zip -j offline_desktop_artifacts.zip:${artifact_version} offline_desktop_artifacts/*
                    """
              }
                 
            archiveArtifacts artifacts: "offline_desktop_artifacts.zip:${artifact_version}", fingerprint: true, onlyIfSuccessful: true
            sh """echo {\\"artifact_name\\" : \\"offline_desktop_artifacts.zip\\", \\"artifact_version\\" : \\"${artifact_version}\\", \\"node_name\\" : \\"${env.NODE_NAME}\\"} > metadata.json"""
            archiveArtifacts artifacts: 'metadata.json', onlyIfSuccessful: true
            currentBuild.result = "SUCCESS"
            currentBuild.description = "Artifact: ${artifact_version}, Public: ${params.github_release_tag}"
        }
    }
    catch (err) {
        currentBuild.result = "FAILURE"
        throw err
    }
    finally {
        slack_notify(currentBuild.result)
        email_notify()
    }
}