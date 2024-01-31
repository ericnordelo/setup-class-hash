# Setup starknet-class-hash action

Sets up [starknet-class-hash](https://github.com/ericnordelo/starknet-class-hash) in your GitHub Actions workflow.

## Inputs

### `version`

**Required** The version of the package to use.

## Example usage

```yaml
name: My workflow
on:
  push:
  pull_request:
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: ericnordelo/setup-class-hash@v1
        with:
          version: "0.1.0"
      - run: class_hash get --json
```