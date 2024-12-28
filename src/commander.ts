import * as r from 'ramda';
import * as ra from 'ramda-adjunct';
import path from 'path';
import fs from 'fs';
import { Command, Option } from 'commander';
import { InputParams } from 'faker-cli';
import { parseParameters } from './params';
import { supportedLocales } from './faker';

const packageName = PACKAGE_NAME;
const packageVersion = PACKAGE_VERSION;
const fakerPackageName = '@faker-js/faker';

const program = new Command();

program
  .version(packageVersion)
  .description('cli wrapper for @faker-js/faker (https://fakerjs.dev)')
  .name('faker')
  .usage(
    '-m <module-name> -f <function-name> [-p <param-value]... [-p <param-key>:<param-value>]... [-l <locale>]',
  )
  .addHelpText(
    'after',
    `
Examples:
  $ faker --help
  $ faker -m lorem -f words
  $ faker -m lorem -f words -l de
  $ faker -m lorem -f words -p 5
  $ faker -m lorem -f words -p 5 -l de
  $ faker -m lorem -f words -p min:4 -p max:7
  $ faker -m lorem -f words -p min:4 -p max:7 -l de
  $ faker -m lorem -f sentences -p 2 -p '<br>'
  $ faker -m lorem -f sentences -p 2 -p '<br>' -l de
  $ faker --module-name=lorem --function-name=words
  $ faker --module-name=lorem --function-name=words --parameter=5
  $ faker --module-name=lorem --function-name=words --parameter='min:4' --parameter='max:7'
  $ faker --module-name=lorem --function-name=words --locale='de'
  $ faker --module-name=lorem --function-name=sentences --parameter='2' --parameter='<br>' --locale='de'
  $ faker lorem.words
  $ faker lorem words de
  $ faker lorem words 5
  $ faker lorem words 5 de
  $ faker lorem words min:4 max:5
  $ faker lorem words min:4 max:5 de
  $ faker lorem sentences 2 '<br>'
  $ faker lorem sentences 2 '<br>' de
  `,
  );

program
  .addOption(
    new Option('-m, --module-name <value>', 'the name of the faker module'),
  )
  .addOption(
    new Option(
      '-f, --function-name <value>',
      'the name of the function in the module',
    ),
  )
  .addOption(
    new Option(
      '-p, --parameter [value...]',
      'function parameters as simple value and/or key-value pairs, separated by semicolons',
    ).default([]),
  )
  .addOption(new Option('-l, --locale <value>', 'the locale').default('en'))
  .addOption(new Option('-i, --info', 'display information'));

program.parse(process.argv);

const cliOptions = program.opts();
export const inputParams$ = new Promise<InputParams | string>((resolve) => {
  if (cliOptions.info) {
    const fakerPackageJsonPath = path.resolve(__dirname, `../node_modules/${fakerPackageName}/package.json`);
    const fakerPackageJson = JSON.parse(fs.readFileSync(fakerPackageJsonPath, 'utf8'));
    const fakerVersion = fakerPackageJson.version;

    return resolve(
      `${packageName} v${packageVersion} | ${fakerPackageName} v${fakerVersion}`,
    );
  }

  if (
    ra.isNonEmptyString(cliOptions.moduleName) &&
    ra.isNonEmptyString(cliOptions.functionName)
  ) {
    return resolve({
      moduleName: cliOptions.moduleName,
      functionName: cliOptions.functionName,
      functionArgs: parseParameters(cliOptions.parameter),
      locale: cliOptions.locale,
    });
  }

  program
    .allowUnknownOption()
    .arguments('<moduleName> [functionName] [functionArgs...]')
    .action(
      (moduleName: string, functionName: string, functionArgs: string[]) => {
        let locale = 'en';

        if (ra.isNonEmptyArray(functionArgs)) {
          const lastArg = r.last(functionArgs);
          if (lastArg && r.includes(lastArg, supportedLocales)) {
            locale = lastArg;
            functionArgs = r.init(functionArgs);
          }
        }

        if (!moduleName.includes('.')) {
          return resolve({
            moduleName,
            functionName,
            functionArgs: parseParameters(functionArgs),
            locale,
          });
        }

        const [splitedModuleName, splitedFuncionName] = moduleName.split('.');

        resolve({
          moduleName: splitedModuleName,
          functionName: splitedFuncionName,
          functionArgs: parseParameters([functionName, ...functionArgs]),
          locale,
        });
      },
    )
    .parse(process.argv);
});

export default program;
