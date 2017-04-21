import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import sourcemaps from 'rollup-plugin-sourcemaps';

const { name, version, author, license } = require('../package.json');

const banner = 
`/*!
  * ${name}
  * @version v${version}
  * @author ${author}
  * @license ${license}
  */`;

export default {
  moduleName: 'Dragger',
  entry: 'src/index.js',
  sourceMap: true,
  plugins: [
    sourcemaps(),
    babel(),
    uglify({
      output: {
        comments(node, { value, type }) {
          if (type === "comment2") {
            return /@preserve|@license|@cc_on/i.test(value);
          }
        }
      }
    })
  ],
  format: 'umd',
  dest: 'dist/index.min.js',
  banner
};