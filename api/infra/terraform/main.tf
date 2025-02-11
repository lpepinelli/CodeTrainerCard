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

resource "aws_s3_bucket" "cache" {
  bucket = "developer-trainer-card-cache"
}
