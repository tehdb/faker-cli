declare const PACKAGE_NAME: string;
declare const PACKAGE_VERSION: string;

declare module 'faker-cli' {
  export type FnParameter = null | boolean | number | bigint | string | object;

  export type InputParams = {
    moduleName: string;
    functionName: string;
    functionArgs: FnParameter[];
    locale?: string;
  };
}




