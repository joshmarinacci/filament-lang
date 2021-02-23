import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import alias from '@rollup/plugin-alias';
import {string} from "rollup-plugin-string";


// https://rollupjs.org/guide/en/#configuration-files
export default {
  input: 'src/index.js',
  output: {
    file: 'dist/filament.js',
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
        { find: 'ohm-js', replacement: '../node_modules/ohm-js/dist/ohm.min.js' },
      ]
    }),
  	resolve({
      browser: true,  // Default: false
    }),
    commonjs(),
    string({
      include:"**/*.ohm"
    })
  ]
};
