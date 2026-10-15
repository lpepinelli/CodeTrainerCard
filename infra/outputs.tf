output "cert_validation" {
  value = [for option in aws_acm_certificate.app.domain_validation_options : {
    name  = option.resource_record_name
    type  = option.resource_record_type
    value = option.resource_record_value
  }]
}

output "app_cname" {
  value = {
    name  = local.app_domain
    type  = "CNAME"
    value = aws_cloudfront_distribution.app.domain_name
  }
}

output "app_bucket" {
  value = aws_s3_bucket.app.bucket
}

output "deploy_role_arn" {
  value = aws_iam_role.deploy.arn
}
