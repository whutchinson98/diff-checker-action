# Diff Checker Action

Takes a list of paths to check and outputs if they have changes.

## Inputs

### `diff`

Newline separated list of `key:value` pairs where the key is a name used in the
output and the value is a regex string path to check if files have changed against.

## Outputs

### `${key}`

For each `key` in the `diff` input, there will be an output with that name. The
value will be a stringified boolean to show whether there have been changes in
that path or not.

## Example usage

```yaml
- uses: whutchinson98/diff-checker-action@v1
  with:
    token: ${{ GITHUB.TOKEN }}
    token: ${{ GITHUB.TOKEN }}
    diff: |
      all: ./*
      foo: ./test/path/*.foo
      bar: src/index.ts
      baz: ./src/random_file.ts
```
