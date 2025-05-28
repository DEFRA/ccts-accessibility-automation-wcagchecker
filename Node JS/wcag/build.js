import esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['src/index.js'], // Include all your files
  bundle: true,
  platform: 'node',
  format: 'esm',
  minify: true,
  outfile: 'dist/wcagchecker.js'
}).catch(() => process.exit(1));