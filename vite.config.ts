import { defineConfig,ConfigEnv, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

const pathResolve = (dir: string): any => {
  return resolve(__dirname, ".", dir)
}

const alias: Record<string, string> = {
  '@': pathResolve("src")
}

export default defineConfig (({ mode }:ConfigEnv): UserConfig => {
  return {
    base: './',
    resolve: {
      alias,
    },
    server: {
      port: 3001,
      host: '0.0.0.0',
      // open: true,
      proxy: {
        // 代理配置
        '/api': {
          target: 'http://jenkins-sz.lusterinc.com:8090',
          // target: 'https://localhost:44342',
          changeOrigin: true, //允许跨域
          secure: false, //解决自签名证书错误
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            echarts: ['echarts'],
          },
        },
      },
    },
    plugins: [vue()],
    css: {
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove()
                }
              },
            },
          },
        ],
      },
    },
  }
})
