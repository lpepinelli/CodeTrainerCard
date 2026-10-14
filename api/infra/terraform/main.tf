terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.32"
    }
  }
  backend "s3" {
    bucket = "tf-state-dev-trainer-card"
    key    = "network/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = "us-east-1"
}

variable "github_token" {
  type      = string
  sensitive = true
}

# IAM role for Lambda
resource "aws_iam_role" "lambda_exec" {
  name = "lambda_exec_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action    = "sts:AssumeRole",
      Effect    = "Allow",
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "card_lambda" {
  function_name    = "developer-trainer-card"
  role             = aws_iam_role.lambda_exec.arn
  handler          = "dist/index.handler"
  runtime          = "nodejs18.x"
  filename         = "${path.module}/dummy.zip" # Dummy zip for initial creation
  source_code_hash = filebase64sha256("${path.module}/dummy.zip")
  publish          = true
  timeout          = 10

  environment {
    variables = {
      GITHUB_TOKEN = var.github_token
      NODE_ENV     = "production"
    }
  }

  # Code is deployed by the GitHub workflow; without this, apply would roll it back to dummy.zip
  lifecycle {
    ignore_changes = [filename, source_code_hash]
  }
}

resource "aws_lambda_function_url" "lambda_url" {
  function_name      = aws_lambda_function.card_lambda.function_name
  authorization_type = "NONE"
}

resource "aws_lambda_permission" "url" {
  statement_id           = "FunctionURLAllowPublicAccess"
  action                 = "lambda:InvokeFunctionUrl"
  function_name          = aws_lambda_function.card_lambda.function_name
  principal              = "*"
  function_url_auth_type = "NONE"
}

output "lambda_url" {
  value = aws_lambda_function_url.lambda_url.function_url
}

