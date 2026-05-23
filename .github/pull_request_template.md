## Summary

<!-- What changed? Keep this direct. -->

-

## Change Type

- [ ] CLI behavior
- [ ] Template / generated output
- [ ] Adapter or preset
- [ ] Documentation / website
- [ ] Tests
- [ ] Release workflow / package metadata

## Quality Evidence

- [ ] `npm run build` passes locally or in CI.
- [ ] `npm test` passes locally or in CI.
- [ ] `npm run check:dist` passes locally or in CI.
- [ ] Generated-output contracts inspected or confirmed not touched.
- [ ] Relevant `docs/verify/*` or lifecycle evidence updated or confirmed not needed.
- [ ] Engineering repo source mapping linked or confirmed not needed.
- [ ] Environment, package, or release workflow changes are documented or confirmed not touched.

Smoke evidence:

```text
Preset/adapter:
Command:
Generated path:
Result:
```

## Generated Output / Dist

- [ ] Generated `.ai/` or starter output was inspected when templates/adapters changed.
- [ ] Dist/package contents are valid when package output changed.
- [ ] No unintended skill identifiers or internal-only files ship in package output.

## Docs Release

- [ ] CLI docs changes are included or confirmed not needed.
- [ ] `npm run docs:build` passes when docs are touched or is recorded as not needed.
- [ ] Release notes or docs mapping describe generated-output contract changes when applicable.

## Release Checks

- [ ] Package impact is clear: none / patch / minor / major.
- [ ] `npm run test:pack` passes when package output or release behavior changed.
- [ ] Release workflow should run only after PR merge and green CI.
- [ ] Notion release mapping and versioning handoff is linked or confirmed not needed.

## Risk And Rollback

- Risk:
- Rollback:

## Review Notes

- [ ] AI-generated changes, if any, were reviewed by a human before merge.
- [ ] CLI behavior, generated-output contracts, docs release, and package release impact received focused review or are not touched.
