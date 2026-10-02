#!/usr/bin/env node
// Validate the kit: manifests agree, every skill/agent has proper front matter, links and scripts exist,
// and Node scripts parse.   node scripts/validate-kit.mjs
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const errors = [];
const front = (file) => {
  const m = readFileSync(file, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const name = m[1].match(/^name:\s*(.+)$/m)?.[1]?.trim();
  const desc = m[1].split(/^description:/m)[1] ?? '';
  return { name, hasDesc: desc.replace(/^\s*>-?|\|/, '').trim().length > 20 };
};

const plugin = JSON.parse(readFileSync(join(root, 'plugin.json'), 'utf8'));
const market = JSON.parse(readFileSync(join(root, '.github', 'plugin', 'marketplace.json'), 'utf8'));
const entry = market.plugins.find((p) => p.name === plugin.name);
if (!entry) errors.push('marketplace.json does not list the plugin');
else if (entry.version !== plugin.version) errors.push(`version mismatch: plugin.json ${plugin.version} vs marketplace.json ${entry.version}`);
if (market.metadata?.version !== plugin.version) errors.push(`marketplace metadata.version ${market.metadata?.version} != ${plugin.version}`);

const skillsDir = join(root, 'skills');
const skills = readdirSync(skillsDir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
for (const s of skills) {
  const f = join(skillsDir, s, 'SKILL.md');
  if (!existsSync(f)) {
    errors.push(`skills/${s}: missing SKILL.md`);
    continue;
  }
  const fm = front(f);
  if (!fm) errors.push(`skills/${s}: missing front matter`);
  else {
    if (fm.name !== s) errors.push(`skills/${s}: name "${fm.name}" must match the folder name`);
    if (!fm.hasDesc) errors.push(`skills/${s}: description missing or too short`);
  }
  const body = readFileSync(f, 'utf8');
  for (const m of body.matchAll(/\]\(((?:references|scripts)\/[^)#]+)\)/g)) {
    if (!existsSync(join(skillsDir, s, m[1]))) errors.push(`skills/${s}: broken link ${m[1]}`);
  }
  for (const m of body.matchAll(/<kit>\/skills\/([\w-]+)\/scripts\/([\w.-]+)/g)) {
    if (!existsSync(join(skillsDir, m[1], 'scripts', m[2]))) errors.push(`skills/${s}: references missing script ${m[1]}/scripts/${m[2]}`);
  }
}

const agentsDir = join(root, 'agents');
const agents = readdirSync(agentsDir).filter((f) => f.endsWith('.agent.md'));
for (const a of agents) {
  const fm = front(join(agentsDir, a));
  if (!fm?.hasDesc) errors.push(`agents/${a}: description missing`);
  if (fm?.name && fm.name !== a.replace(/\.agent\.md$/, '')) errors.push(`agents/${a}: name "${fm.name}" should match the file name`);
}
// Skill and agent names mentioned anywhere in agents/skills must exist.
const known = new Set([...skills, ...agents.map((a) => a.replace(/\.agent\.md$/, ''))]);
const mentioned = /`((?:modernize|legacy|community|event|venue|photo|decap|site|azure|visual|plain)-[a-z0-9-]+)`/g;
for (const f of [...agents.map((a) => join(agentsDir, a)), ...skills.map((s) => join(skillsDir, s, 'SKILL.md'))]) {
  for (const m of readFileSync(f, 'utf8').matchAll(mentioned)) {
    if (!known.has(m[1]) && !/^community-site-(starter|kit)$/.test(m[1])) errors.push(`${f.slice(root.length + 1)}: unknown skill/agent \`${m[1]}\``);
  }
}

const scripts = [];
const walk = (d) => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory() && e.name !== 'node_modules') walk(p);
    else if (/\.(mjs|js)$/.test(e.name)) scripts.push(p);
  }
};
walk(skillsDir);
for (const s of scripts) {
  try {
    execFileSync(process.execPath, ['--check', s], { stdio: 'pipe' });
  } catch (e) {
    errors.push(`syntax error in ${s.slice(root.length + 1)}: ${String(e.stderr).split('\n').slice(0, 3).join(' ')}`);
  }
}

console.log(`${skills.length} skills, ${agents.length} agents, ${scripts.length} Node scripts checked.`);
if (errors.length) {
  console.error(errors.map((e) => `✗ ${e}`).join('\n'));
  process.exit(1);
}
console.log('✓ kit is valid');
