import { FnParameter } from 'faker-cli';
import * as r from 'ramda';
import * as ra from 'ramda-adjunct';

const NUMBER_REGEX = /^-?\d+(\.\d+)?n?$/;

const isNumberLike = (str: string): boolean => {
  return NUMBER_REGEX.test(str);
};

export const parseValue = (val: string): FnParameter => {
  if (val === 'null') {
    return null;
  }

  if (r.includes(val, ['true', 'false'])) {
    return val === 'true';
  }

  if (isNumberLike(val)) {
    if (val.includes('.')) {
      return parseFloat(val);
    } else if (val.endsWith('n')) {
      return BigInt(val.slice(0, -1));
    } else {
      return parseInt(val, 10);
    }
  }

  return val;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseParameters = (parameter: any[]): FnParameter[] => {
  const functionArgs: FnParameter[] = [];
  if (ra.isNonEmptyArray(parameter)) {
    let objParams = {};
    r.forEach((param: string) => {
      const splits = r.split(':', param);
      if (r.length(splits) === 2) {
        const path = r.split('.', splits[0]);
        const value = parseValue(splits[1]);
        objParams = r.assocPath(path, value, objParams);
      } else {
        functionArgs.push(parseValue(param));
      }
    })(parameter);

    if (ra.isNotNilOrEmpty(objParams)) {
      functionArgs.push(objParams);
    }
  }

  return functionArgs;
};
