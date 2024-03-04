terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }
}

provider "aws" {
  region                   = var.app_region
  shared_credentials_files = ["~/.aws/credentials"]
  profile                  = var.app_aws_profile_name
}