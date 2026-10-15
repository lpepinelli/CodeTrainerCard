// Groups the builder's skill list; every key in api/src/config/skills.ts belongs to exactly one category
export const skillCategories: Record<string, string[]> = {
  Languages: [
    'ts', 'js', 'python', 'java', 'go', 'rust', 'c', 'cpp', 'csharp', 'php', 'ruby', 'kotlin', 'swift', 'dart', 'bash',
    'lua', 'elixir', 'scala', 'haskell', 'r', 'julia', 'zig', 'ocaml', 'clojure', 'erlang', 'fsharp', 'perl', 'objectivec',
    'powershell', 'solidity', 'gleam'
  ],
  Frontend: ['html', 'css', 'react', 'angular', 'vue', 'svelte', 'nextjs', 'tailwind', 'flutter'],
  Backend: ['node', 'express', 'nestjs', 'django', 'fastapi', 'spring', 'laravel', 'rails', 'dotnet', 'graphql'],
  Databases: ['sql', 'postgres', 'mysql', 'sqlite', 'mongodb', 'redis', 'firebase', 'supabase', 'prisma'],
  'DevOps & Cloud': ['docker', 'kubernetes', 'terraform', 'aws', 'gcp', 'azure', 'githubactions', 'nginx', 'linux'],
  'Data & ML': ['jupyter', 'pandas', 'pytorch', 'tensorflow'],
  Tools: ['git', 'vim', 'neovim', 'figma']
}
