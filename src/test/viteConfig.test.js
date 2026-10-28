import config from '../../vite.config.js';

describe('vite config', () => {
  it('GitHub Pages のサブパス配信に対応した base を持つ', () => {
    expect(config.base).toBe('/todo-app/');
  });
});
