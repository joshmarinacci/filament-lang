import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import alias from '@rollup/plugin-alias';
import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript"
import dts from "rollup-plugin-dts"


// https://rollupjs.org/guide/en/#configuration-files
export default [
    {
      input: 'src/index.ts',
      output: {
        dir:'dist',
        format: 'umd',
        name: 'Filament'
      },
      plugins: [
        alias({
          entries: [
            // This alias is a workaround necessary because the ohm-js
            // package.json does not include a 'browser: "dist/ohm.min.js" entry'
            // which would point to the browser-safe bundle for ohm-js. So instead,
            // we use rollup's alias plugin to do the job.
            //
            // { find: 'ohm-js', replacement: '../node_modules/ohm-js/dist/ohm.min.js' },
          ]
        }),
        resolve({
          browser: true,  // Default: false
        }),
        commonjs(), json(), typescript()
    ]
  },
  {
    input: 'dist/dts/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts()],
  }
];
