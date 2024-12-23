import path from 'path';
import { describe, it, expect } from 'vitest';
import { $ } from 'execa';

const rootDir = path.resolve(__dirname, '..');
const fakerPath = path.resolve(rootDir, 'dist/index.js');

const countWords = (str: string): number => str.trim().split(/\s+/).length;

describe('Faker CLI command', () => {
  it('should return the version number when the --version flag is provided', async () => {
    const { stdout } = await $`node ${fakerPath} --version`;
    expect(stdout).toMatch(/\d+\.\d+\.\d+/);
  });

  it('should return the version number when the -V flag is provided', async () => {
    const { stdout } = await $`node ${fakerPath} -V`;
    expect(stdout).toMatch(/\d+\.\d+\.\d+/);
  });

  it('should accept long format of arguments', async () => {
    const { stdout } =
      await $`node ${fakerPath} --module-name=lorem --function-name=words`;
    expect(stdout).toBeTypeOf('string');
    expect(stdout).not.toBe('');
  });

  it('should accept short format of arguments', async () => {
    const { stdout } = await $`node ${fakerPath} -m lorem -f words`;
    expect(stdout).toBeTypeOf('string');
    expect(stdout).not.toBe('');
  });

  it('should accept additional arguments', async () => {
    const { stdout } = await $`node ${fakerPath} -m lorem -f words -p 3`;
    const wordsCount = countWords(stdout);
    expect(wordsCount).toBe(3);
  });

  it('should accept locale argument', async () => {
    const { stdout } = await $`node ${fakerPath} -m lorem -f word -l ru`;
    expect(stdout).toMatch(/[А-Яа-я]/);
  });

  it('should accept a mix of short and long argument formats', async () => {
    const { stdout } =
      await $`node ${fakerPath} -m lorem --function-name=word -l ru`;
    expect(stdout).toMatch(/[А-Яа-я]/);
  });

  it('should accept multiple additional arguments with key-value pairs separated by colon', async () => {
    const { stdout } =
      await $`node ${fakerPath} -m lorem -f words -p min:3 -p max:5`;
    const wordsCount = countWords(stdout);
    expect(wordsCount).toBeGreaterThanOrEqual(3);
    expect(wordsCount).toBeLessThanOrEqual(5);
  });

  it('should accept shortcuts to pass the arguments', async () => {
    const { stdout } = await $`node ${fakerPath} lorem words 3`;
    const wordsCount = countWords(stdout);
    expect(wordsCount).toBe(3);
  });

  it('should correctly parse and handle dot notation shortcuts to pass arguments', async () => {
    const { stdout } = await $`node ${fakerPath} lorem.words 3`;
    const wordsCount = countWords(stdout);
    expect(wordsCount).toBe(3);
  });

  it('should accept last argument as locale in shortcuts', async () => {
    const { stdout } = await $`node ${fakerPath} lorem word ru`;
    expect(stdout).toMatch(/[А-Яа-я]/);
  });

  it('should exit with error when required arguments missing', async () => {
    try {
      await $`node ${fakerPath}`;
    } catch (error) {
      const { stderr } = error;
      expect(stderr).toContain(`error: missing required argument 'moduleName'`);
    }
  });

  it('should exit with error when faker module not found', async () => {
    try {
      expect(await $`node ${fakerPath} not-existing-module`);
    } catch (error) {
      const { stderr } = error;
      expect(stderr).toBe(
        `error: function 'faker.not-existing-module.undefined' not found`,
      );
    }
  });

  it('should exit with error when faker function not found', async () => {
    try {
      expect(await $`node ${fakerPath} lorem not-existing-function`);
    } catch (error) {
      const { stderr } = error;
      expect(stderr).toBe(
        `error: function 'faker.lorem.not-existing-function' not found`,
      );
    }
  });

  it('should exit with error when faker function parameters are invalid', async () => {
    try {
      expect(await $`node ${fakerPath} lorem words foo:bar`);
    } catch (error) {
      const { stderr } = error;
      expect(
        stderr.startsWith(
          `error: calling 'faker.lorem.words' with args '[{"foo": "bar"}]' failed`,
        ),
      ).toBeTruthy();
    }
  });

  it('should exit with error when passed locale not supported', async () => {
    try {
      expect(await $`node ${fakerPath} -m lorem -f words -l xx`);
    } catch (error) {
      const { stderr } = error;
      expect(
        stderr.startsWith(`error: locale 'xx' not supported`),
      ).toBeTruthy();
    }
  });

  it('should exit with error when passed shortcut args are invalid', async () => {
    try {
      expect(await $`node ${fakerPath} lorem words xx`);
    } catch (error) {
      const { stderr } = error;
      console.log(stderr);
      expect(
        stderr.startsWith(
          `error: calling 'faker.lorem.words' with args '["xx"]' failed`,
        ),
      ).toBeTruthy();
    }
  });

  it('should exit with error when passed unknown args', async () => {
    try {
      expect(await $`node ${fakerPath} --unknonwn`);
    } catch (error) {
      const { stderr } = error;
      console.log(stderr);
      expect(
        stderr.startsWith(`error: unknown option '--unknonwn'`),
      ).toBeTruthy();
    }
  });
});
