variable "github_token" {
  type      = string
  sensitive = true
}

# Kept out of the repo: set it in terraform.tfvars
variable "budget_email" {
  type = string
}
