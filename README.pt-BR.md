<div align="center">

# Code Trainer Card

[English](README.md) · **Português**

**O trainer card para devs.** Um card em pixel art, inspirado no trainer card de Pokémon FireRed, gerado a partir do seu perfil do GitHub e pronto para colocar no seu README.

<a href="https://codetrainer.pepinelli.dev"><img src="https://codetrainer.pepinelli.dev/api/card/lpepinelli?role=Software%20Eng.&skills=aws,terraform,ts,csharp&shine&auto-flip=15&private" alt="Code Trainer Card de lpepinelli" width="500"></a>

**[Crie o seu em codetrainer.pepinelli.dev](https://codetrainer.pepinelli.dev)**

</div>

## O que aparece no card

- **Nome, avatar e ID de treinador** do seu perfil do GitHub
- **Seguidores, commits e pull requests**: os commits contam suas contribuições do último ano
- **Insígnias**: suas conquistas do GitHub, como Pull Shark ou YOLO
- **Skills**: ícones das suas linguagens principais, escolhidas a partir dos repositórios com push mais recente, ou as que você escolher
- **Um verso** com seu usuário e o ano em que você entrou no GitHub, mostrado quando o card vira

## Como usar

O jeito mais fácil é o [criador de cards](https://codetrainer.pepinelli.dev): digite seu usuário, ajuste as opções com a prévia ao vivo e copie o trecho.

Ou monte a URL você mesmo. O card é um SVG comum, então funciona em qualquer lugar que aceite uma imagem:

```html
<a href="https://codetrainer.pepinelli.dev"><img src="https://codetrainer.pepinelli.dev/api/card/SEU_USUARIO" alt="Code Trainer Card de SEU_USUARIO" width="500"></a>
```

O `<img>` em HTML está ali por causa do `width`: o `![]()` do Markdown não permite definir o tamanho da imagem, e o card tem 1029px de largura. O link leva quem gostar do seu card até o criador, para fazer o próprio.

## Opções

Adicione qualquer uma destas como parâmetro na URL, por exemplo `?role=Back-end&skills=go,postgres,docker&shine`.

| Parâmetro | Exemplo | Descrição |
| --- | --- | --- |
| `name` | `name=Mona` | Nome exibido no card. O padrão é o seu nome no GitHub |
| `role` | `role=Front-end` | Linha do cargo, até 15 caracteres |
| `color` | `color=7FB3FF` | Cor hexadecimal sem `#`. Todos os tons do card derivam dela. Padrão `BC93FF` |
| `skills` | `skills=ts,react,node` | Ícones de skills, em ordem, da [lista abaixo](#skills). Até 4, ou 8 com `hide-badges`. O padrão são suas linguagens principais |
| `hide-badges` | `hide-badges` | Usa a linha das insígnias para mais skills |
| `private` | `private` | Soma as contribuições privadas aos commits (elas precisam estar visíveis no seu perfil do GitHub) |
| `pixelate` | `pixelate` ou `pixelate=40` | Avatar e ícones em pixel art. O número é a quantidade de blocos na largura do avatar, de 8 a 128, padrão 80 |
| `shine` | `shine` | Um brilho passa pelo card |
| `auto-flip` | `auto-flip` ou `auto-flip=15` | Vira o card para o verso a cada poucos segundos. O número é quanto tempo a frente fica visível, de 2 a 60, padrão 10 |

Opções como `shine` não precisam de valor. Um número de `pixelate` ou `auto-flip` fora do intervalo desliga esse efeito, e uma `color` inválida volta para o padrão. As animações param para quem pede ao sistema para reduzir movimento.

## Skills

| Categoria | Chaves |
| --- | --- |
| Linguagens | `ts` `js` `python` `java` `go` `rust` `c` `cpp` `csharp` `php` `ruby` `kotlin` `swift` `dart` `bash` `lua` `elixir` `scala` `haskell` `r` `julia` `zig` `ocaml` `clojure` `erlang` `fsharp` `perl` `objectivec` `powershell` `solidity` `gleam` `groovy` `elm` `nim` `crystal` `nix` `matlab` `fortran` `cobol` `coffeescript` `prolog` `racket` `purescript` `haxe` `visualbasic` `delphi` `apex` `vyper` `latex` `vala` `ballerina` `apl` `wolfram` `processing` `wasm` |
| Frontend | `html` `css` `react` `angular` `vue` `svelte` `nextjs` `astro` `tailwind` `flutter` |
| Backend | `node` `express` `nestjs` `django` `fastapi` `spring` `laravel` `rails` `dotnet` `graphql` |
| Bancos de dados | `sql` `postgres` `mysql` `sqlite` `mongodb` `redis` `firebase` `supabase` `prisma` |
| DevOps e Cloud | `docker` `kubernetes` `terraform` `aws` `gcp` `azure` `githubactions` `nginx` `linux` |
| Dados e ML | `jupyter` `pandas` `numpy` `matplotlib` `pytorch` `tensorflow` `spark` `airflow` |
| IA | `claude` `claudecode` `codex` `copilot` `cursor` `opencode` `windsurf` `gemini` `mistral` `deepseek` `perplexity` `huggingface` `langchain` `ollama` `lmstudio` `mcp` `openrouter` |
| Ferramentas | `git` `vim` `neovim` `figma` |

Faltou alguma? As skills vêm do [devicon](https://devicon.dev), ou do [Simple Icons](https://simpleicons.org) para marcas que o devicon não tem, então adicionar uma é um PR pequeno: coloque o ícone em `api/src/assets/skills/<chave>.svg`, registre a chave em `api/src/config/skills.ts` (com os nomes de linguagem do GitHub, se houver) e dê uma categoria a ela em `app/src/config/skillCategories.ts`. Os testes verificam se toda skill tem ícone e categoria.

## Como funciona

```
codetrainer.pepinelli.dev ── CloudFront ─┬─ /*      → S3: o criador de cards (React + Vite)
                                         └─ /api/*  → Lambda: o Express gera o SVG
```

- **`api/`**: Express no AWS Lambda. Busca o perfil pela API GraphQL do GitHub e monta o SVG. Os cards ficam em cache por 4 horas.
- **`app/`**: o criador de cards. Ele desenha a prévia no navegador com o mesmo código de card da API, então a prévia é igual ao card real sem uma requisição a cada opção alterada.
- **`infra/`**: Terraform para tudo isso: Lambda, S3, CloudFront e o certificado.

## Rodando localmente

Precisa de Node 22.18+, [just](https://github.com/casey/just) e do [GitHub CLI](https://cli.github.com) autenticado (`gh auth login`); a API usa o token dele para chamar o GitHub.

```sh
just install
just dev
```

- API: http://localhost:3333/api/card/SEU_USUARIO
- Criador: a URL que o Vite mostra, já apontando para a API local

Rode os testes com `npm test` em `api/` ou `app/`.

## Hospedando você mesmo

Está tudo em `infra/`. Você vai precisar de uma conta na AWS, um domínio e um [token fine-grained](https://github.com/settings/personal-access-tokens) do GitHub (sem nenhuma permissão; ele só lê perfis públicos).

1. Troque os nomes pelos seus: o bucket de state em `infra/main.tf`, o domínio e o subject OIDC do GitHub em `infra/locals.tf`, o domínio em `app/src/config/api.ts`, o nome do bucket em `infra/s3.tf`, o nome da função em `infra/lambda.tf` e os nomes do bucket e da função em `.github/workflows/` (os nomes da função precisam ser iguais).
2. Crie `infra/terraform.tfvars` com `github_token` e `budget_email` (para um alerta de custo).
3. Rode `terraform apply -target=aws_acm_certificate.app`, adicione o CNAME de `terraform output cert_validation` no seu provedor de DNS e depois rode `terraform apply`.
4. Aponte seu domínio para o valor de `terraform output app_cname`.
5. Adicione uma variável de repositório `AWS_DEPLOY_ROLE_ARN` com o valor de `terraform output deploy_role_arn`. Pushes na `main` fazem o deploy da API e do criador: o GitHub Actions assume essa role via OIDC, então nenhuma chave da AWS fica guardada. A role depende do provedor OIDC do GitHub na sua conta; se ela ainda não tiver um, [adicione](https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services) antes.

## Créditos

- Fonte: [Pokemon Fire Red](https://fontlibrary.org/en/font/pokemon) de KaelinT, licenciada sob [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). Modificada para corrigir uma entrada cmap inválida.
- Ícones de skills: [devicon](https://devicon.dev) (MIT) e [Simple Icons](https://simpleicons.org) (CC0). Os logos pertencem aos seus donos.
- As insígnias são as artes de conquistas do próprio GitHub, mostradas conforme as conquistas de cada perfil.
- Inspirado no trainer card de Pokémon FireRed. Este é um projeto de fã, sem afiliação com a Nintendo, a Game Freak ou a The Pokémon Company.

## Licença

[MIT](LICENSE)
