// Groups the builder's skill list; every key in api/src/config/skills.ts belongs to exactly one category
export const skillCategories: Record<string, string[]> = {
  Languages: [
    'ts', 'js', 'python', 'java', 'go', 'rust', 'c', 'cpp', 'csharp', 'php', 'ruby', 'kotlin', 'swift', 'dart', 'bash',
    'lua', 'elixir', 'scala', 'haskell', 'r', 'julia', 'zig', 'ocaml', 'clojure', 'erlang', 'fsharp', 'perl', 'objectivec',
    'powershell', 'solidity', 'gleam', 'groovy', 'elm', 'nim', 'crystal', 'nix', 'matlab', 'fortran', 'cobol',
    'coffeescript', 'prolog', 'racket', 'purescript', 'haxe', 'visualbasic', 'delphi', 'apex', 'vyper', 'latex', 'vala',
    'ballerina', 'apl', 'wolfram', 'processing', 'wasm'
  ],
  Frontend: ['html', 'css', 'react', 'angular', 'vue', 'svelte', 'nextjs', 'astro', 'tailwind', 'flutter'],
  Backend: ['node', 'express', 'nestjs', 'django', 'fastapi', 'spring', 'laravel', 'rails', 'dotnet', 'graphql'],
  Databases: ['sql', 'postgres', 'mysql', 'sqlite', 'mongodb', 'redis', 'firebase', 'supabase', 'prisma'],
  'DevOps & Cloud': ['docker', 'kubernetes', 'terraform', 'aws', 'gcp', 'azure', 'githubactions', 'nginx', 'linux'],
  'Data & ML': ['jupyter', 'pandas', 'numpy', 'matplotlib', 'pytorch', 'tensorflow', 'spark', 'airflow'],
  AI: [
    'claude', 'claudecode', 'codex', 'copilot', 'cursor', 'opencode', 'windsurf', 'gemini', 'mistral', 'deepseek', 'perplexity', 'huggingface',
    'langchain', 'ollama', 'lmstudio', 'mcp', 'openrouter'
  ],
  Tools: ['git', 'vim', 'neovim', 'figma']
}
