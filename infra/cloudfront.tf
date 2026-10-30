# The bucket stays private: only this distribution can read it, through origin access control
resource "aws_cloudfront_origin_access_control" "app" {
  name                              = "codetrainer-app"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_origin_access_control" "api" {
  name                              = "codetrainer-api"
  origin_access_control_origin_type = "lambda"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# Card options live in the query string, so it is part of the cache key; the API's Cache-Control decides how long
resource "aws_cloudfront_cache_policy" "api" {
  name        = "codetrainer-api"
  min_ttl     = 0
  default_ttl = 0
  max_ttl     = 86400

  parameters_in_cache_key_and_forwarded_to_origin {
    enable_accept_encoding_gzip   = true
    enable_accept_encoding_brotli = true

    query_strings_config {
      query_string_behavior = "all"
    }
    headers_config {
      header_behavior = "none"
    }
    cookies_config {
      cookie_behavior = "none"
    }
  }
}

resource "aws_cloudfront_distribution" "app" {
  depends_on = [aws_s3_bucket_ownership_controls.logs]

  enabled             = true
  is_ipv6_enabled     = true
  aliases             = [local.app_domain]
  default_root_object = "index.html"
  price_class         = "PriceClass_All"

  # Usage logs only see requests that reach the Lambda; these also show the ones CloudFront answers from its cache
  logging_config {
    bucket          = aws_s3_bucket.logs.bucket_domain_name
    prefix          = "cloudfront/"
    include_cookies = false
  }

  origin {
    origin_id                = "app"
    domain_name              = aws_s3_bucket.app.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.app.id
  }

  # Card URLs in READMEs point at this domain, so the Lambda behind it can change without breaking them
  origin {
    origin_id                = "api"
    domain_name              = trimsuffix(trimprefix(aws_lambda_function_url.lambda_url.function_url, "https://"), "/")
    origin_access_control_id = aws_cloudfront_origin_access_control.api.id

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    target_origin_id       = "app"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true
    cache_policy_id        = data.aws_cloudfront_cache_policy.caching_optimized.id

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.app_routes.arn
    }
  }

  ordered_cache_behavior {
    path_pattern             = "/api/*"
    target_origin_id         = "api"
    viewer_protocol_policy   = "redirect-to-https"
    allowed_methods          = ["GET", "HEAD", "OPTIONS"]
    cached_methods           = ["GET", "HEAD"]
    compress                 = true
    cache_policy_id          = aws_cloudfront_cache_policy.api.id
    origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_viewer_except_host.id
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.app.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}

# The app's screens are real paths for search engines and analytics, but S3 only has index.html.
# A distribution-wide custom error response would also turn the API's 404s into the app page.
resource "aws_cloudfront_function" "app_routes" {
  name    = "codetrainer-app-routes"
  runtime = "cloudfront-js-2.0"
  publish = true
  code    = <<-EOT
    var appRoutes = ['/builder', '/builder/', '/guide', '/guide/'];

    function handler(event) {
      var request = event.request;
      if (appRoutes.indexOf(request.uri) !== -1) request.uri = '/index.html';
      return request;
    }
  EOT
}
