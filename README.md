<div align="center">

# Code Trainer Card

**English** · [Português](README.pt-BR.md)

**The trainer card for devs.** A pixel-art card, inspired by the Pokémon FireRed trainer card, built from your GitHub profile and ready to drop in your README.

<a href="https://codetrainer.pepinelli.dev"><img src="https://codetrainer.pepinelli.dev/api/card/lpepinelli?role=Software%20Eng.&skills=aws,terraform,ts,csharp&shine&auto-flip=15&float&private" alt="lpepinelli's Code Trainer Card" width="500"></a>

**[Build yours at codetrainer.pepinelli.dev](https://codetrainer.pepinelli.dev)**

</div>

## What's on the card

- **Name, avatar and trainer ID** from your GitHub profile
- **Followers, commits and pull requests**: commits count your contributions from the last year
- **Badges**: your GitHub achievements, like Pull Shark or YOLO
- **Skills**: icons for your top languages, picked from your recently pushed repositories, or the ones you choose
- **A back side** with your handle and the year you joined, shown when the card flips

## Usage

The easiest way is the [card builder](https://codetrainer.pepinelli.dev): type your username, tweak the options with a live preview, and copy the snippet.

Or write the URL yourself. The card is a plain SVG, so it works anywhere an image does:

```html
<a href="https://codetrainer.pepinelli.dev"><img src="https://codetrainer.pepinelli.dev/api/card/YOUR_USERNAME" alt="YOUR_USERNAME's Code Trainer Card" width="500"></a>
```

The HTML `<img>` is there for the `width`: Markdown's `![]()` can't size images, and the card is 1029px wide. The link sends people who like your card to the builder, so they can make their own.

## Options

Add any of these as query parameters, for example `?role=Back-end&skills=go,postgres,docker&shine`.

| Parameter | Example | Description |
| --- | --- | --- |
| `name` | `name=Mona` | Name shown on the card. Defaults to your GitHub name |
| `role` | `role=Front-end` | Role line, up to 15 characters |
| `color` | `color=7FB3FF` | Hex color without `#`. Every shade on the card derives from it. Default `BC93FF` |
| `skills` | `skills=ts,react,node` | Skill icons, in order, from the [list below](#skills). Up to 4, or 8 with `hide-badges`. Defaults to your top languages |
| `hide-badges` | `hide-badges` | Gives the badge row to skills |
| `private` | `private` | Adds private contributions to the commit count (they must be visible on your GitHub profile) |
| `pixelate` | `pixelate` or `pixelate=40` | Pixel-art avatar and icons. The number is blocks across the avatar, 8 to 128, default 80 |
| `shine` | `shine` | A light sweeps across the card |
| `float` | `float` | The card bobs up and down. Makes the image a little taller |
| `shadow` | `shadow` | With `float`, a shadow under the card that shrinks as it rises |
| `auto-flip` | `auto-flip` or `auto-flip=15` | Flips to the back every few seconds. The number is how long the front shows, 2 to 60, default 10 |

Flags like `shine` need no value. A `pixelate` or `auto-flip` number outside its range turns that effect off, and an invalid `color` falls back to the default. Animations stop for viewers who ask their system to reduce motion.

## Skills

| Category | Keys |
| --- | --- |
| Languages | `ts` `js` `python` `java` `go` `rust` `c` `cpp` `csharp` `php` `ruby` `kotlin` `swift` `dart` `bash` `lua` `elixir` `scala` `haskell` `r` `julia` `zig` `ocaml` `clojure` `erlang` `fsharp` `perl` `objectivec` `powershell` `solidity` `gleam` `groovy` `elm` `nim` `crystal` `nix` `matlab` `fortran` `cobol` `coffeescript` `prolog` `racket` `purescript` `haxe` `visualbasic` `delphi` `apex` `vyper` `latex` `vala` `ballerina` `apl` `wolfram` `processing` `wasm` |
| Frontend | `html` `css` `react` `angular` `vue` `svelte` `nextjs` `astro` `tailwind` `flutter` |
| Backend | `node` `express` `nestjs` `django` `fastapi` `spring` `laravel` `rails` `dotnet` `graphql` |
| Databases | `sql` `postgres` `mysql` `sqlite` `mongodb` `redis` `firebase` `supabase` `prisma` |
| DevOps & Cloud | `docker` `kubernetes` `terraform` `aws` `gcp` `azure` `githubactions` `nginx` `linux` |
| Data & ML | `jupyter` `pandas` `numpy` `matplotlib` `pytorch` `tensorflow` `spark` `airflow` |
| AI | `claude` `claudecode` `codex` `copilot` `cursor` `opencode` `windsurf` `gemini` `mistral` `deepseek` `perplexity` `huggingface` `langchain` `ollama` `lmstudio` `mcp` `openrouter` |
| Tools | `git` `vim` `neovim` `figma` |

Missing one? Skills come from [devicon](https://devicon.dev), or [Simple Icons](https://simpleicons.org) for brands devicon lacks, so adding one is a small PR: drop the icon in `api/src/assets/skills/<key>.svg`, register the key in `api/src/config/skills.ts` (with its GitHub language names, if any) and give it a category in `app/src/config/skillCategories.ts`. The tests check that every skill has an icon and a category.

## How it works

```
codetrainer.pepinelli.dev ── CloudFront ─┬─ /*      → S3: the card builder (React + Vite)
                                         └─ /api/*  → Lambda: Express renders the SVG
```

- **`api/`**: Express on AWS Lambda. Fetches the profile through GitHub's GraphQL API and composes the SVG. Cards are cached for 4 hours.
- **`app/`**: the card builder. It renders the preview in the browser with the same card code as the API, so the preview matches the real card without a request per option change.
- **`infra/`**: Terraform for all of it: Lambda, S3, CloudFront and the certificate.

## Running locally

Requires Node 22.18+, [just](https://github.com/casey/just) and the [GitHub CLI](https://cli.github.com) logged in (`gh auth login`); the API uses its token to call GitHub.

```sh
just install
just dev
```

- API: http://localhost:3333/api/card/YOUR_USERNAME
- Builder: the URL Vite prints, already pointed at the local API

Run the tests with `npm test` in `api/` or `app/`.

## Self-hosting

Everything is in `infra/`. You'll need an AWS account, a domain, and a GitHub [fine-grained token](https://github.com/settings/personal-access-tokens) (no permissions needed; it only reads public profiles).

1. Point the names at your own: the state bucket in `infra/main.tf`, the domain and GitHub OIDC subject in `infra/locals.tf`, the domain in `app/src/config/api.ts`, the bucket name in `infra/s3.tf`, the function name in `infra/lambda.tf`, and the bucket and function names in `.github/workflows/` (the function names must match).
2. Create `infra/terraform.tfvars` with `github_token` and `budget_email` (for a cost alert).
3. `terraform apply -target=aws_acm_certificate.app`, add the CNAME from `terraform output cert_validation` at your DNS provider, then run `terraform apply`.
4. Point your domain at the `terraform output app_cname` value.
5. Add a repository variable `AWS_DEPLOY_ROLE_ARN` set to `terraform output deploy_role_arn`. Pushes to `main` deploy the API and the builder: GitHub Actions assumes that role through OIDC, so no AWS keys are stored. The role relies on your account's GitHub OIDC provider; if it doesn't have one yet, [add it](https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services) first.

## Credits

- Font: [Pokemon Fire Red](https://www.cufonfonts.com/font/pokemon-fire-red) by KaelinT, licensed under [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). Modified to fix an invalid cmap entry and to add accented vowels, Ç and Ñ, shared under the same license.
- Skill icons: [devicon](https://devicon.dev) (MIT) and [Simple Icons](https://simpleicons.org) (CC0). Logos belong to their owners.
- Badges are GitHub's achievement artwork, shown for the achievements on each profile.
- Inspired by the trainer card from Pokémon FireRed. This is a fan project, not affiliated with Nintendo, Game Freak or The Pokémon Company.

## License

[MIT](LICENSE)
