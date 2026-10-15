# GitHub Actions deploys by assuming this role through OIDC, so the repo holds no AWS keys.
# An account has one GitHub OIDC provider, shared by every repo, so it's looked up rather than created here
data "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"
}

resource "aws_iam_role" "deploy" {
  name = "codetrainer-deploy"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action    = "sts:AssumeRoleWithWebIdentity",
      Effect    = "Allow",
      Principal = { Federated = data.aws_iam_openid_connect_provider.github.arn },
      Condition = {
        StringEquals = {
          "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com",
          # Only pushes to main: workflows from forks and other branches can't assume it
          "token.actions.githubusercontent.com:sub" = "repo:${local.github_repo}:ref:refs/heads/main"
        }
      }
    }]
  })
}

resource "aws_iam_role_policy" "deploy" {
  role = aws_iam_role.deploy.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = "lambda:UpdateFunctionCode",
        Resource = aws_lambda_function.card_lambda.arn
      },
      {
        Effect   = "Allow",
        Action   = "s3:ListBucket",
        Resource = aws_s3_bucket.app.arn
      },
      {
        Effect   = "Allow",
        Action   = ["s3:PutObject", "s3:DeleteObject"],
        Resource = "${aws_s3_bucket.app.arn}/*"
      }
    ]
  })
}
