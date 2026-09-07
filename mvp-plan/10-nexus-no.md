# Registry / Publishing

## Current decision

**Do not publish to Nexus.**

The package is intended for the public npm registry.

Historical context: an earlier plan considered a private company Nexus registry. That is no longer the target.

## Public publishing target

```text
npmjs.com
```

The first release is intended to be public.

The agent should verify:
- package name availability — see the decision rule in D-018 and
  [`01-product-and-naming.md`](01-product-and-naming.md)
- npm account/org ownership
- publish access (`--access public` is required for a scoped package's first publish)
- package visibility
- authentication method

Prefer npm's trusted publishing/OIDC mechanism from CI. Exact requirements, and the
fallback if the release tool does not perform the OIDC exchange, are specified in
[`12-ci-release-and-commits.md`](12-ci-release-and-commits.md).

Do not commit npm tokens.
