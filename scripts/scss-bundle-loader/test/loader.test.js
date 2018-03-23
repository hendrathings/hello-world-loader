import compiler from './compiler.js';

test('Bundle all to one file', async () => {
  const stats = await compiler('case/index.scss');
  debugger;
  const output = stats.toJson().modules[0].source;
  console.log(output);
debugger;
  expect(output).toBe(`export default "Hey Alice!\\n"`);
});