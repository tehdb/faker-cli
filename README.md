# Faker CLI

Faker CLI is a command-line interface wrapper for the [@faker-js/faker](https://fakerjs.dev) library, which allows you to generate fake data directly from your terminal.

## 📦 Install

```sh
npm install -g @tehdb/faker-cli
```

## 🪄 Usage

```sh
faker -m <module-name> -f <function-name> [-p <param-value>] [-p <param-key>:<param-value>]... [-l <locale>]
```

### Options

- `-V, --version` Output the version number
- `-m, --module-name <value>` The name of the faker module
- `-f, --function-name <value>` The name of the function in the module
- `-p, --parameter [value...]` Function parameters as simple value and/or key-value pairs, separated by semicolons (default: [])
- `-l, --locale <value>` The locale (default: "en")
- `--info` display package information
- `--available-modules` display faker modules/functions
- `--supported-locales` display supported locales
- `-h, --help` Display help for command

> For modules and supported functions see [faker api reference](https://fakerjs.dev/api/)

> For supported locales see [available locales](https://fakerjs.dev/guide/localization.html#available-locales)

Generate data using a specific module and function:

```sh
faker -m lorem -f words
```

Generate data with a specific locale:

```sh
faker -m lorem -f words -l de
```

Generate data with simple parameters:

```sh
faker -m lorem -f words -p 5
```

Generate data with key-value pairs parameters:

```sh
faker -m lorem -f words -p min:4 -p max:7
```

Alternative syntax:

```sh
faker --module-name="lorem" --function-name="words"
faker --module-name="lorem" --function-name="words" --parameter=5
faker --module-name="lorem" --function-name="words" --parameter="min:4" --parameter="max:7"
faker --module-name="lorem" --function-name="words" --locale="de"
```

Shortened syntax:

```sh
faker lorem.words
faker lorem words
faker lorem words de
faker lorem words 5
faker lorem words 5 de
faker lorem words min:4 max:5
faker lorem words min:4 max:5 de
```

## Zsh completions

```sh
# .zshrc
fpath=(/path/to/faker-cli/completions $fpath)
autoload -U compinit && compinit
```

## License MIT
