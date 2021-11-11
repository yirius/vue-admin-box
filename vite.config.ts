import { ConfigEnv, UserConfigExport, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { viteMockServe } from 'vite-plugin-mock';
import { resolve } from 'path';
import { configHtmlPlugin } from './build/plugins/html';
import { parseEnv } from "./src/config/env";

const pathResolve = (dir: string): any => {
  return resolve(__dirname, ".", dir)
}

const alias: Record<string, string> = {
  '@': pathResolve("src")
}

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  const root = process.cwd();

  const env = parseEnv(loadEnv(mode, root));

  // 是否生产
  const isBuild = command === 'build';

  const prodMock = true;
  return {
    resolve: {
      alias
    },
    server: {
      port: env.VITE_PORT,
      host: true,
      open: true,
      proxy: env.VITE_PROXY || {},
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
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
