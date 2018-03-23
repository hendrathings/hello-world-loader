import compiler from './compiler.js';

test('Bundle all to one file', async () => {
  const stats = await compiler('case/index.scss');
  const output = stats.toJson().modules[0].source;

  expect(output).toBe(`export default __webpack_public_path__ + \"[hash].scss\";`);
});