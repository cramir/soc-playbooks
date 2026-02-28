# Contributing to the SOC Playbook Automation Library

Thank you for helping make this library better. Every playbook contributed here could help a SOC analyst respond to an incident faster and more effectively. That matters.

---

## Ways to Contribute

- **Submit a new playbook** — Cover an incident type not yet in the library
- **Improve an existing playbook** — Add steps, automation hints, better tool integration
- **Fix a bug** — Schema validation errors, incorrect MITRE mappings, broken links
- **Improve tooling** — Validation scripts, CI, documentation

---

## Before You Start

1. **Check for duplicates** — Browse the [playbook index](README.md#playbook-index) to make sure your playbook isn't already covered
2. **Read the schema** — Familiarize yourself with [`schema/playbook-schema.yaml`](schema/playbook-schema.yaml)
3. **Set up locally** — Clone the repo and run `npm install`

```bash
git clone https://github.com/costnimbus/soc-playbooks.git
cd soc-playbooks
npm install
```

---

## Writing a New Playbook

### Naming Convention

```
IR-XXX-descriptive-name.yaml
```

- `IR-XXX` — Next available ID (check existing playbooks and bump by 1)
- Lowercase with hyphens, no spaces
- Place in the correct category subdirectory under `playbooks/`

### Required Fields

Every playbook **must** include:

| Field | Description |
|-------|-------------|
| `id` | Unique ID (e.g., `IR-011`) |
| `name` | Human-readable name |
| `version` | Semantic version, start at `1.0.0` |
| `author` | Your name or GitHub handle |
| `category` | One of the [valid categories](#valid-categories) |
| `severity` | Array: `low`, `medium`, `high`, `critical` |
| `mitre_attack` | Array of MITRE ATT&CK technique IDs (e.g., `T1566.001`) |
| `trigger` | What fires this playbook |
| `tags` | Searchable keywords |
| `tools_required` | Tools needed to execute |
| `estimated_time` | Realistic completion time |
| `steps` | Minimum 8 steps |
| `post_incident` | Cleanup/follow-up actions |
| `metrics` | `avg_resolution_time` and `false_positive_rate` |

### Valid Categories

```
email-security | endpoint | cloud | identity | network |
data-loss | insider-threat | ransomware | supply-chain | compliance
```

### Step Types

Each step must have one of these types:

| Type | When to Use |
|------|-------------|
| `action` | Do something (quarantine, block, isolate) |
| `investigation` | Gather data, run queries, analyze |
| `decision` | Branch point — if X then Y |
| `escalation` | Notify a human or higher-tier team |
| `notification` | Send alerts, tickets, comms |

### Automation Hints

For `action` and `investigation` steps, include an `automation_hint` field with a real API call, CLI command, or SOAR action. These are the most valuable part of the playbook.

**Good examples:**
```yaml
automation_hint: "aws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=ConsoleLogin"
automation_hint: "POST https://api.crowdstrike.com/devices/entities/devices-actions/v2 {action_name: contain}"
automation_hint: "Splunk SPL: index=windows EventCode=4625 | stats count by src_ip | where count > 50"
```

**Bad examples:**
```yaml
automation_hint: "check the logs"
automation_hint: "use your SIEM"
```

### Quality Bar

Your playbook will be rejected if it:
- Has fewer than 8 steps
- Uses fake/made-up tool names or API endpoints
- Has incorrect MITRE ATT&CK technique IDs
- Lacks automation hints on action steps
- Has generic/placeholder descriptions
- Doesn't pass `npm run validate`

---

## Submitting Your Playbook

### 1. Fork and branch

```bash
git checkout -b playbook/IR-011-your-playbook-name
```

### 2. Create the playbook file

Place it in the correct category subdirectory:
```
playbooks/
└── <category>/
    └── IR-011-your-playbook-name.yaml
```

### 3. Validate locally

```bash
npm run validate
# or validate a single file:
node schema/validate.js playbooks/category/IR-011-your-playbook-name.yaml
```

Fix all validation errors before submitting.

### 4. Update the README

Add your playbook to the index table in `README.md`:
```markdown
| [IR-011](playbooks/category/IR-011-your-playbook-name.yaml) | Your Playbook Name | category | severity | Xm |
```

### 5. Open a PR

- Title: `feat: IR-011 Your Playbook Name`
- Description: Briefly explain the incident type and what makes this playbook useful
- The CI will automatically validate your schema

---

## PR Review Criteria

Maintainers will check:

1. **Schema validation passes** — CI must be green
2. **Step quality** — Are steps actionable? Do they build logically?
3. **Automation hints** — Are they real and accurate?
4. **MITRE mapping** — Are technique IDs correct?
5. **Tool references** — Are tool names accurate and commonly deployed?
6. **Writing quality** — Clear, professional, brand-appropriate

Reviews typically complete within 3 business days.

---

## Improving Existing Playbooks

Open a PR with:
- Title: `fix: IR-XXX description of change` or `improve: IR-XXX description`
- Specific explanation of what changed and why
- For significant changes, explain the incident type context

---

## Reporting Issues

Use GitHub Issues for:
- Incorrect MITRE ATT&CK mappings
- Outdated tool API references
- Missing step coverage for known attack patterns
- Schema bugs

---

## Code of Conduct

Be excellent to each other. This is a professional security community resource. Constructive feedback only.

---

## Questions?

Open an issue or email **security@costnimbus.io**.
