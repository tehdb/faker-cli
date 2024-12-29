import * as r from 'ramda';
import * as ra from 'ramda-adjunct';
import { allLocales, Faker, LocaleDefinition } from '@faker-js/faker';

export const supportedLocales: string[] = (function () {
  const keys = r.keys(allLocales);
  const validKeys = r.filter((key) => !r.includes(key, ['base']))(keys);
  return validKeys;
})();

const getLozalizedFaker = (locale?: string) => {
  if (!locale || ra.isNilOrEmpty(locale))
    return new Faker({ locale: allLocales.en });

  if (!r.includes(locale, supportedLocales)) {
    throw new Error(`locale '${locale}' not supported`);
  }

  const localeDefinition = r.path<LocaleDefinition>([locale], allLocales);
  return new Faker({ locale: localeDefinition! });
};

export const callFakerFunction = (
  moduleName: string,
  functionName: string,
  functionArgs: any[], // eslint-disable-line @typescript-eslint/no-explicit-any
  locale?: string,
) => {
  const fakerInstance = getLozalizedFaker(locale);
  const func = r.path([moduleName, functionName], fakerInstance);

  if (ra.isNotFunction(func)) {
    throw new Error(`function 'faker.${moduleName}.${functionName}' not found`);
  }

  try {
    return (func as Function)(...functionArgs); // eslint-disable-line  @typescript-eslint/no-unsafe-function-type
  } catch (err) {
    throw new Error(
      `calling 'faker.${moduleName}.${functionName}' with args '${r.toString(functionArgs)}' failed - ${err}`,
    );
  }
};

export const availebleModules = ((): Map<string, string[]> => {
  const modelKeysExclude = ['definitions', 'rawDefinitions'];
  const functionKeysExluce = ['faker'];

  const getObjectKeys = (obj: object, exclude: string[]): string[] => {
    return r.pipe(
      r.keys,
      r.map((key) => key as string),
      r.filter(
        (key: string) => !r.startsWith('_', key) && !r.includes(key, exclude),
      ),
      r.sort((a: string, b: string) => a.localeCompare(b)),
    )(obj);
  };
  const faker = new Faker({ locale: allLocales.en });
  const modulesMap = new Map<string, string[]>();

  getObjectKeys(faker, modelKeysExclude).forEach((key) => {
    const fakerModule = r.path([key], faker);

    if (!fakerModule) return;

    const fakerModuleFunctionKeys = getObjectKeys(
      fakerModule,
      functionKeysExluce,
    );
    modulesMap.set(key, fakerModuleFunctionKeys);
  });

  return modulesMap;
})();
