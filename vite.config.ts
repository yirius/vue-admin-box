import { ConfigEnv, UserConfigExport, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { viteMockServe } from 'vite-plugin-mock';
import { resolve } from 'path';
import { configHtmlPlugin } from './build/plugins/html';

const pathResolve = (dir: string): any => {
  return resolve(__dirname, ".", dir)
}

const alias: Record<string, string> = {
  '@': pathResolve("src")
}

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  const root = process.cwd();

  const env = loadEnv(mode, root);

  // 找到几个参数
  let VITE_PORT = env.VITE_PORT ? env.VITE_PORT : "3100";

  // 是否生产
  const isBuild = command === 'build';

  const prodMock = true;
  return {
    resolve: {
      alias
    },
    server: {
      port: parseInt(VITE_PORT),
      host: true,
      open: true,
      proxy: { // 代理配置
        '/dev': 'https://www.fastmock.site/mock/48cab8545e64d93ff9ba66a87ad04f6b/'
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'echarts': ['echarts']
          }
        }
      }
    },
    plugins: [
      vue(),
      viteMockServe({
        mockPath: 'mock',
        localEnabled: command === 'serve',
        prodEnabled: command !== 'serve' && prodMock,
        watchFiles: true,
        injectCode: `
          import { setupProdMockServer } from '../mockProdServer';
          setupProdMockServer();
        `,
        logger: true,
      }),
      configHtmlPlugin(env, isBuild)
    ]
  };
}
