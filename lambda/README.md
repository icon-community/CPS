# Lambda Deployment Script Manual

## Overview
`deploy_lambda.sh` script automates the deployment of AWS Lambda functions. It allows users to:
- Choose a Lambda function from a predefined list.
- Select between `dev` and `prod` deployment modes.
- Optionally update runtime and environment variables.
- Package and deploy the Lambda function.

## Prerequisites
- AWS CLI must be installed and configured with the necessary credentials.
- Bash shell (Linux/macOS) or Git Bash (Windows).
- `powershell` (for Windows users) to handle zip compression.
- Lambda function names and corresponding folders should be defined in the script.

## Usage
### Running the Script
```bash
./deploy_lambda.sh -m <mode> -l <lambda_name> [-u] [-e]
```

### Arguments
| Flag | Description |
|------|-------------|
| `-m` | Deployment mode (`dev` or `prod`). Required. |
| `-l` | Name of the Lambda function to deploy. Optional. |
| `-u` | Update the runtime version. Optional. |
| `-e` | Update the environment variables. Optional. |

### Example Commands
#### Deploy a Lambda function named `myLambdaFunction` in `dev` mode without updating runtime or env:
```bash
./deploy_lambda.sh -m dev -l myLambdaFunction
```

#### Deploy in `prod` mode and update environment variables:
```bash
./deploy_lambda.sh -m prod -l myLambdaFunction -e
```

#### Deploy and update both runtime and env variables:
```bash
./deploy_lambda.sh -m dev -l myLambdaFunction -u -e
```

## Script Functionality
1. **Select Deployment Mode**
   - Sets environment file based on `dev` or `prod` mode.
   - Chooses the correct Lambda function folder.

2. **Package Lambda Code**
   - Deletes the existing zip file.
   - Creates a new zip archive of the Lambda code folder.

3. **Optional: Update Runtime**
   - If `-u` flag is provided, the script updates the Lambda runtime.
   - Waits 10 seconds for AWS to apply the change.

4. **Optional: Update Environment Variables**
   - If `-e` flag is provided, updates the Lambda environment variables.
   - Waits 10 seconds before proceeding.

5. **Deploy Updated Code**
   - Uploads the new Lambda function code.
   - Confirms successful deployment.

## Notes
- The script will exit if an invalid mode or Lambda function name is provided.
- To add new Lambda functions, update the script with the corresponding folder mappings.
- AWS CLI must have the necessary permissions to update Lambda functions.
