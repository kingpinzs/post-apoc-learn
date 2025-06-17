import { scriptTemplates } from '../lib/scriptTemplates';

test('basicScan template starts with START and ends with END', () => {
  const tmpl = scriptTemplates.basicScan;
  expect(tmpl[0].type).toBe('START');
  expect(tmpl[tmpl.length - 1].type).toBe('END');
});

test('all templates have required block fields', () => {
  Object.values(scriptTemplates).forEach(template => {
    template.forEach(block => {
      expect(block).toEqual(
        expect.objectContaining({
          type: expect.any(String),
          x: expect.any(Number),
          y: expect.any(Number),
          parameters: expect.any(Object),
        })
      );
    });
  });
});
