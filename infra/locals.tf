locals {
  app_domain = "codetrainer.pepinelli.dev"
  # The repo's OIDC subject prefix, from `gh api repos/OWNER/REPO/actions/oidc/customization/sub`.
  # It carries the owner and repo ids, so a rename or a new repo reusing the name doesn't match
  github_oidc_subject = "repo:lpepinelli@43144939/CodeTrainerCard@480408661"
}
