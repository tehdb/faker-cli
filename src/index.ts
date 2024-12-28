import { InputParams } from 'faker-cli';
import { inputParams$ } from './commander';
import { callFakerFunction } from './faker';

inputParams$
  .then((params: InputParams | string) => {
    if (typeof params === 'string') {
      return params;
    }

    return callFakerFunction(
      params.moduleName,
      params.functionName,
      params.functionArgs,
      params.locale,
    );
  })
  .then((result: string) => {
    console.log(result);
    process.exit(0);
  })
  .catch((err: Error) => {
    console.error(`error: ${err.message}`);
    process.exit(1);
  });
