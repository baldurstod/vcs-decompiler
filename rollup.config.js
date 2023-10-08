import {nodeResolve} from '@rollup/plugin-node-resolve';

export default [
	{
		input: './src/js/index.js',
		output: {
			file: './dist/index.js',
			format: 'esm'
		},
		plugins: [
			nodeResolve(),
		],
	},
];
