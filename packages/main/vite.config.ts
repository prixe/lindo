import { builtinModules } from 'module'
import { join } from 'path'
import { defineConfig } from 'vite'
import esmodule from 'vite-plugin-esmodule'
import pkg from '../../package.json'

const esModules = ['execa', 'get-port']
const nodeModules = Object.keys(pkg.dependencies || {}).filter((dep) => !esModules.includes(dep))

export default defineConfig({
  root: __dirname,
  plugins: [esmodule(esModules)],
  build: {
    outDir: '../../dist/main',
    emptyOutDir: true,
    minify: process.env./* from mode option */ NODE_ENV === 'production',
    sourcemap: true,
    lib: {
      entry: 'index.ts',
      formats: ['cjs'],
      fileName: () => '[name].cjs'
    },
    rollupOptions: {
      external: ['electron', ...builtinModules, ...nodeModules]
    }
  },
  resolve: {
    alias: {
      '@lindo/shared': join(__dirname, '../../packages/shared'),
      '@lindo/i18n': join(__dirname, '../../packages/i18n')
    }
  }
})
