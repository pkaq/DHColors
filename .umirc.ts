import { defineConfig } from 'umi';

export default defineConfig({
  title: '敦煌色 - DunHuang Colors',
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
  ],
});
