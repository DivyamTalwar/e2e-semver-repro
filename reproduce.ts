/** Run against an e2e source checkout, no test server or paid model needed. */
import { pathToFileURL } from "node:url"
import path from "node:path"

const repository = process.env.E2E_REPO
if (!repository) throw new Error("Set E2E_REPO to the e2e-inc/e2e source checkout")
const file = pathToFileURL(path.resolve(repository, "packages/e2e/src/internal/semver.ts"))
const { parseVersion, compareVersions } = await import(file.href)
const older = parseVersion("0.25.0-rc.9007199254740992")!
const newer = parseVersion("0.25.0-rc.9007199254740993")!
const order = Math.sign(compareVersions(older, newer))
console.log("Expected older < newer (-1), actual:", order)
if (order !== -1) process.exitCode = 1
