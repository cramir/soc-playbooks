#!/usr/bin/env node
/**
 * SOC Playbook Validator
 * Validates one or all playbooks against the schema definition.
 *
 * Usage:
 *   node schema/validate.js                        # validate all playbooks
 *   node schema/validate.js playbooks/email-security/IR-001-*.yaml  # validate single
 *
 * Exit codes:
 *   0 — all playbooks valid
 *   1 — one or more validation errors
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { load as yamlLoad } from 'js-yaml';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

// ─── Load schema ────────────────────────────────────────────────────────────

function loadSchema() {
  const schemaPath = join(__dirname, 'playbook-schema.yaml');
  const raw = readFileSync(schemaPath, 'utf8');
  const schema = yamlLoad(raw);

  // Strip YAML-only fields that AJV doesn't understand
  delete schema.$schema;
  delete schema.title;
  delete schema.description;

  return schema;
}

// ─── Collect playbook files ──────────────────────────────────────────────────

function collectPlaybooks(target) {
  if (target) return [resolve(target)];

  const playbooksDir = join(ROOT, 'playbooks');
  const files = [];

  function walk(dir) {
    readdirSync(dir).forEach(entry => {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        walk(full);
      } else if (entry.endsWith('.yaml') || entry.endsWith('.yml')) {
        files.push(full);
      }
    });
  }

  walk(playbooksDir);
  return files;
}

// ─── Validate ────────────────────────────────────────────────────────────────

function validate(schemaObj, filePath) {
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const validateFn = ajv.compile(schemaObj);

  let raw;
  try {
    raw = readFileSync(filePath, 'utf8');
  } catch (err) {
    return { file: filePath, ok: false, errors: [`Cannot read file: ${err.message}`] };
  }

  let data;
  try {
    data = yamlLoad(raw);
  } catch (err) {
    return { file: filePath, ok: false, errors: [`YAML parse error: ${err.message}`] };
  }

  const valid = validateFn(data);
  if (valid) {
    return { file: filePath, ok: true, id: data.id, name: data.name };
  }

  const errors = validateFn.errors.map(e => {
    const path = e.instancePath || '(root)';
    return `  ${path}: ${e.message}`;
  });

  return { file: filePath, ok: false, id: data?.id, errors };
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
  const targetArg = process.argv[2];
  const schema = loadSchema();
  const files = collectPlaybooks(targetArg);

  if (files.length === 0) {
    console.error('❌ No playbook files found.');
    process.exit(1);
  }

  console.log(`\n🔍 Validating ${files.length} playbook(s) against schema...\n`);

  let passCount = 0;
  let failCount = 0;

  for (const file of files) {
    const rel = file.replace(ROOT + '/', '');
    const result = validate(schema, file);

    if (result.ok) {
      console.log(`  ✅  ${result.id} — ${result.name}`);
      console.log(`      ${rel}`);
      passCount++;
    } else {
      console.log(`  ❌  ${result.id || 'UNKNOWN'} — ${rel}`);
      result.errors.forEach(e => console.log(`      ${e}`));
      failCount++;
    }
    console.log('');
  }

  console.log('─'.repeat(60));
  console.log(`\n  Passed: ${passCount}  |  Failed: ${failCount}  |  Total: ${files.length}\n`);

  if (failCount > 0) {
    console.error(`❌ Validation failed — fix the errors above and re-run.\n`);
    process.exit(1);
  }

  console.log(`✅ All playbooks valid.\n`);
  process.exit(0);
}

main();
