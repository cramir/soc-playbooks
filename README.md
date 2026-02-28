# SOC Playbook Automation Library

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Playbooks](https://img.shields.io/badge/playbooks-10-blue.svg)](#playbook-index)
[![Schema Validated](https://img.shields.io/badge/schema-validated-brightgreen.svg)](schema/playbook-schema.yaml)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

> **Free, open-source incident response playbooks for modern SOC teams** — structured, machine-readable, and ready to plug into your SOAR platform.

Built and maintained by the [CostNimbus](https://costnimbus.io) team. Browse all playbooks at **[playbooks.costnimbus.io](https://playbooks.costnimbus.io)** *(coming soon)*.

---

## What Is This?

This library provides battle-tested incident response playbooks in a consistent, machine-readable YAML format. Each playbook maps to real MITRE ATT&CK techniques, integrates with commonly deployed security tools (CrowdStrike, Splunk, Microsoft Defender, AWS CloudTrail, and more), and includes automation hints so you can wire them directly into Cortex XSOAR, Splunk SOAR, Tines, or any other SOAR platform.

**Why YAML?**
- Human-readable and version-controllable
- Easy to import into SOAR platforms
- Parseable by automation scripts
- Diffable in PRs — you can review playbook changes like code changes

---

## Playbook Index

| ID | Name | Category | Severity | Est. Time |
|----|------|----------|----------|-----------|
| [IR-001](playbooks/email-security/IR-001-phishing-email-investigation.yaml) | Phishing Email Investigation | email-security | medium, high | 30m |
| [IR-002](playbooks/endpoint/IR-002-malware-endpoint-containment.yaml) | Malware Endpoint Containment | endpoint | high, critical | 45m |
| [IR-003](playbooks/identity/IR-003-brute-force-authentication.yaml) | Brute Force Authentication | identity | medium, high | 20m |
| [IR-004](playbooks/cloud/IR-004-aws-unauthorized-access.yaml) | AWS Unauthorized Access | cloud | high, critical | 40m |
| [IR-005](playbooks/data-loss/IR-005-data-exfiltration-dlp.yaml) | Data Exfiltration via DLP | data-loss | high, critical | 60m |
| [IR-006](playbooks/ransomware/IR-006-ransomware-initial-response.yaml) | Ransomware Initial Response | ransomware | critical | 15m |
| [IR-007](playbooks/identity/IR-007-insider-threat-investigation.yaml) | Insider Threat Investigation | insider-threat | medium, high | 90m |
| [IR-008](playbooks/cloud/IR-008-cloud-resource-hijacking.yaml) | Cloud Resource Hijacking | cloud | high, critical | 35m |
| [IR-009](playbooks/supply-chain/IR-009-supply-chain-compromise.yaml) | Supply Chain Compromise | supply-chain | critical | 120m |
| [IR-010](playbooks/endpoint/IR-010-privilege-escalation-detection.yaml) | Privilege Escalation Detection | endpoint | high, critical | 30m |

---

## Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/costnimbus/soc-playbooks.git
cd soc-playbooks
```

### 2. Validate all playbooks

```bash
npm install
npm run validate
```

### 3. Import into your SOAR

Each playbook is self-contained YAML. Import paths by SOAR platform:

- **Cortex XSOAR** — Use the YAML as a playbook definition template
- **Splunk SOAR** — Parse the `steps` array to build automation flows
- **Tines** — Map each `step.automation_hint` to a Tines action
- **Torq** — Use `integrations` block to auto-configure connectors

---

## Playbook Structure

Every playbook follows this schema:

```yaml
id: IR-XXX                    # Unique identifier
name: Human-readable name
version: 1.0.0
author: CostNimbus
category: email-security       # See schema for valid categories
severity: [medium, high]       # low | medium | high | critical
mitre_attack: [T1566.001]      # MITRE ATT&CK technique IDs
trigger:                       # What fires this playbook
  - email_alert
tags: [phishing, email]
tools_required: [email_gateway, edr, siem]
estimated_time: 30m

integrations:
  - platform: defender_for_o365
    optional: false

steps:
  - id: step-1
    name: Step name
    type: action               # action | investigation | decision | escalation | notification
    tool: email_gateway
    description: What to do
    automation_hint: "API call or command hint"
    outputs: [result_variables]

post_incident:
  - Cleanup action 1

metrics:
  avg_resolution_time: 45m
  false_positive_rate: 15%
```

Full schema definition: [`schema/playbook-schema.yaml`](schema/playbook-schema.yaml)

---

## Categories

| Category | Description |
|----------|-------------|
| `email-security` | Phishing, BEC, malicious attachments |
| `endpoint` | Malware, EDR alerts, host-based threats |
| `cloud` | AWS/Azure/GCP unauthorized access, misconfigs |
| `identity` | Auth attacks, account compromise, MFA bypass |
| `network` | C2 traffic, lateral movement, scanning |
| `data-loss` | DLP alerts, exfiltration, data exposure |
| `insider-threat` | Suspicious insider behavior |
| `ransomware` | Ransomware detection and containment |
| `supply-chain` | Third-party/dependency compromise |
| `compliance` | Regulatory compliance incident response |

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for:
- How to write a new playbook
- Schema requirements and validation
- PR process and review criteria

**Quick contribution checklist:**
- [ ] Playbook follows [schema](schema/playbook-schema.yaml)
- [ ] `npm run validate` passes locally
- [ ] Minimum 8 steps with realistic descriptions
- [ ] Real MITRE ATT&CK technique IDs
- [ ] At least one `automation_hint` per action step
- [ ] `post_incident` and `metrics` sections filled

---

## Roadmap

- [ ] Browsable website at playbooks.costnimbus.io
- [ ] SOAR import scripts (XSOAR, Splunk SOAR, Tines)
- [ ] Playbook search and filtering by tool/technique
- [ ] Automated MITRE ATT&CK matrix visualization
- [ ] Community playbook submissions (20+ playbooks)
- [ ] Playbook effectiveness metrics tracking

---

## License

MIT License — free to use, modify, and distribute. See [LICENSE](LICENSE).

---

## About CostNimbus

[CostNimbus](https://costnimbus.io) builds tools that help security teams operate more efficiently. This playbook library is our contribution back to the SOC community.

Questions? Ideas? Open an issue or reach out at **security@costnimbus.io**.
