provider "aws" {
  region = "eu-central-1"
}

provider "acme" {
  server_url = "https://acme-v02.api.letsencrypt.org/directory"
}
