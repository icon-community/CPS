#!/bin/bash
# Generalized Lambda Deployment Script
# Usage: ./deploy_lambda.sh [-n <lambda_name> -t <runtime> -r <aws_region> -m <mode> [-u] [-e]]

set -e

# Default runtime
RUNTIME="nodejs20.x"
UPDATE_RUNTIME=false
UPDATE_ENV=false
AWS_REGION="us-west-2"
MODE="dev"

# Predefined Lambda functions and corresponding folders
declare -A DEV_LAMBDAS=(
    ["cps-notification-dev"]="cron"
    ["cps-lambda-dev"]="proposals"
    ["cps-ipfs-dev"]="drafts"
    ["cps-authorizer-dev"]="authorizer"
    ["cps-list-user"]="users"

)

declare -A PROD_LAMBDAS=(
    ["cps-notification-func"]="cron"
    ["cps-lambda-func"]="proposals"
    ["cps-ipfs-func"]="drafts"
    ["cps-authorizer"]="authorizer"
    ["cps-list-user"]="users"
)

# Parse command-line arguments
while getopts n:m:re flag; do
    case "${flag}" in
        n) LAMBDA_NAME=${OPTARG} ;;
        m) MODE=${OPTARG} ;;
        r) UPDATE_RUNTIME=true ;;
        e) UPDATE_ENV=true ;;
    esac
done

# Set the environment file based on mode
if [ "$MODE" == "dev" ]; then
    ENV_FILE=".env.dev.json"
    AVAILABLE_LAMBDAS=("${!DEV_LAMBDAS[@]}")
elif [ "$MODE" == "prod" ]; then
    ENV_FILE=".env.prod.json"
    AVAILABLE_LAMBDAS=("${!PROD_LAMBDAS[@]}")
else
    echo "Invalid mode! Use 'dev' or 'prod'."
    exit 1
fi

declare -n LAMBDA_MAP=${MODE^^}_LAMBDAS

# If no Lambda name provided, prompt the user to select one from the list for the current mode
if [ -z "$LAMBDA_NAME" ]; then
    echo "Please select a Lambda function for the '$MODE' mode from the list below:"
    select option in "${AVAILABLE_LAMBDAS[@]}"; do
        if [ -n "$option" ]; then
            LAMBDA_NAME=$option
            break
        else
            echo "Invalid selection. Please try again."
        fi
    done
fi

FOLDER=${LAMBDA_MAP[$LAMBDA_NAME]}

if [ -z "$FOLDER" ]; then
    echo "No folder mapping found for Lambda function '$LAMBDA_NAME'."
    exit 1
fi

echo "Deploying Lambda Function: $LAMBDA_NAME"
echo "Selected Mode: $MODE"
echo "Folder: $FOLDER"
echo "Using environment file: $ENV_FILE"

ZIP_FILE="${LAMBDA_NAME}-lambda.zip"

echo "Deleting existing zip file..."
rm -rf "$ZIP_FILE"

# Package the Lambda function code
echo "Packaging Lambda function..."
# Try using 'zip' if available, else fallback to PowerShell on Windows
if command -v zip >/dev/null; then
    zip -r "$ZIP_FILE" "$FOLDER"
else
    powershell -Command "Compress-Archive -Force -Path ./${FOLDER}/* -DestinationPath ${ZIP_FILE}"
fi

# Update the Lambda runtime (if requested)
if [ "$UPDATE_RUNTIME" == true ]; then
    echo "Updating Lambda runtime..."
    aws lambda update-function-configuration \
        --function-name "$LAMBDA_NAME" \
        --region "$AWS_REGION" \
        --runtime "$RUNTIME" > output.txt
    cat output.txt
    sleep 10
else
    echo "Skipping runtime update."
fi

# Update environment variables (if requested)
if [ "$UPDATE_ENV" == true ]; then
    echo "Updating environment variables..."
    aws lambda update-function-configuration \
        --function-name "$LAMBDA_NAME" \
        --region "$AWS_REGION" \
        --environment "file://${FOLDER}/${ENV_FILE}" > output.txt
    cat output.txt
    sleep 10
else
    echo "Skipping environment variable update."
fi

# Deploy the updated code to Lambda
echo "Deploying Lambda function..."
aws lambda update-function-code \
    --function-name "$LAMBDA_NAME" \
    --zip-file "fileb://$ZIP_FILE" \
    --region "$AWS_REGION" > output.txt
cat output.txt

echo "${LAMBDA_NAME} lambda function deployed successfully!"
