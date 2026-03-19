# Recommended workflow

```mermaid
sequenceDiagram
  participant You
  participant Agent
  participant Plan as plan-review
  participant CR as code-review
  participant QA as qa
  participant Ship as ship
  You->>Agent: Feature / bug in plain language
  Agent->>You: Plan
  You->>Plan: Validate plan
  You->>Agent: Implement using .ai/rules
  You->>CR: Review diff (checklist)
  You->>QA: Build, lint, test, a11y, Lighthouse
  You->>Ship: Commit / PR
```

## After generation

1. Edit **`.ai/context/domain-map.md`** with real domains and paths.  
2. Lock **`.ai/context/tech-stack.md`** to libraries you allow.  
3. Use **`.ai/tracking/efficiency.md`** when the model repeats the same mistake — update a rule.

## Bonus skills

- **performance-audit** — CWV, bundle, images  
- **accessibility-audit** — axe, keyboard, screen reader  
- **component-audit** — props, complexity, Storybook coverage  
- **dependency-audit** — security, licenses, bundle impact  

---

[Contributing & support](/community/contributing)
