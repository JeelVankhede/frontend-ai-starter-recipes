/**
 * In-memory `RenderedContext` fixtures for adapter tests. Replaces the v1.1
 * `minimal-ai/` on-disk fixture; adapters now consume `RenderedContext` directly.
 */
import type { RenderedContext } from '../../src/types.js';

export const MINIMAL_RENDERED: RenderedContext = {
  agent: '# FARE Test Agent\n\nMinimal agent body for adapter tests.\n',
  rules: {
    architecture:
      '---\ndescription: Architecture rule\nalwaysApply: true\n---\n\n# Architecture\n\nArchitecture body.\n',
    components:
      '---\ndescription: Components rule\n---\n\n# Components\n\nComponents body with .tsx references.\n',
    'performance-and-testing':
      '---\ndescription: Performance and testing rule\n---\n\n# Performance and Testing\n\nTesting body.\n',
  },
  lifecycle: {
    think: '# Think\n\nLifecycle fixture think.\n',
    plan: '# Plan\n\nLifecycle fixture plan.\n',
    build: '# Build\n\nLifecycle fixture build.\n',
    review: '# Review\n\nLifecycle fixture review.\n',
    test: '# Test\n\nLifecycle fixture test.\n',
    ship: '# Ship\n\nLifecycle fixture ship.\n',
    reflect: '# Reflect\n\nLifecycle fixture reflect.\n',
  },
};

export const EMPTY_RENDERED: RenderedContext = {
  agent: '# Empty Agent\n',
  rules: {},
  lifecycle: {},
};
