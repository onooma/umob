data "terraform_remote_state" "main" {
  backend   = "s3"
  workspace = var.environment

  config = {
    bucket = var.remote_state_main_bucket
    key    = var.remote_state_main_key
    region = "eu-central-1"
  }
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }

    acme = {
      source  = "vancluever/acme"
      version = "~> 2.5.3"
    }
  }

  backend "s3" {
    bucket = "umob-remote-state"
    key    = "umob-remote-state-key"
    region = "eu-central-1"
  }
}

module "umob_label" {
  source = "git::https://github.com/cloudposse/terraform-null-label.git?ref=tags/0.25.0"

  name        = "umob"
  environment = var.environment
  namespace   = var.namespace
  tags        = var.tags
}

resource "aws_default_vpc" "default_vpc" {}
