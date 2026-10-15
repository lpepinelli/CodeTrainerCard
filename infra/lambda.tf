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
  runtime          = "nodejs22.x"
  filename         = "${path.module}/dummy.zip" # Dummy zip for initial creation
  source_code_hash = filebase64sha256("${path.module}/dummy.zip")
  publish          = true
  timeout          = 10
  memory_size      = 512

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

# CloudFront's origin; IAM auth means only signed requests from the distribution get through
resource "aws_lambda_function_url" "lambda_url" {
  function_name      = aws_lambda_function.card_lambda.function_name
  authorization_type = "AWS_IAM"
}

# Function URLs need both actions granted to the caller
resource "aws_lambda_permission" "cloudfront_url" {
  statement_id  = "AllowCloudFrontInvokeFunctionUrl"
  action        = "lambda:InvokeFunctionUrl"
  function_name = aws_lambda_function.card_lambda.function_name
  principal     = "cloudfront.amazonaws.com"
  source_arn    = aws_cloudfront_distribution.app.arn
}

resource "aws_lambda_permission" "cloudfront_invoke" {
  statement_id  = "AllowCloudFrontInvokeFunction"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.card_lambda.function_name
  principal     = "cloudfront.amazonaws.com"
  source_arn    = aws_cloudfront_distribution.app.arn
}
