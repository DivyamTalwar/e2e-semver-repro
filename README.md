# e2e CLI numeric-prerelease ordering reproducer

On e2e main (23 Nov 2026), the CLI's internal `compareVersions()` converts arbitrary-length numeric prerelease identifiers to JavaScript Numbers. SemVer permits numeric identifiers longer than `Number.MAX_SAFE_INTEGER`, and those distinct numbers must still compare numerically. However, `9007199254740992` and `9007199254740993` both round to the same Number, so the CLI compares two valid unequal prerelease versions as equal.

## Reproduce

Requires [Bun](https://bun.sh) and a checkout of the public e2e repository; no app, model, browser or API key is required (this is a CLI release/version comparator bug):

```sh
git clone --depth 1 https://github.com/e2e-inc/e2e.git /tmp/e2e-repro-source
E2E_REPO=/tmp/e2e-repro-source bun reproduce.ts
```

**Actual:** `Expected older < newer (-1), actual: 0`, exit status 1.

**Expected:** comparison returns a negative value, exit status 0. The bug may affect choosing the newest available prerelease or checking exact comparator bounds for versions with large numeric identifiers.

Source: [`packages/e2e/src/internal/semver.ts`](https://github.com/e2e-inc/e2e/blob/main/packages/e2e/src/internal/semver.ts). This reproducer deliberately imports the upstream module; it does not reimplement it.
