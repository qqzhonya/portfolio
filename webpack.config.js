const glob = require('glob');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const HtmlBeautifyPlugin = require('@nurminen/html-beautify-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');

const projectPackage = require('./package.json');

const VERSION = projectPackage.version;

// For assets path in build folder:
const PROJECT_NAME = projectPackage.name;

function generatePages() {
	// find all the pug files in the pages directory
	let pages = glob.sync('*.pug', {
		cwd: path.join(__dirname, 'src/components/pages/'),
	});

	return pages.map((page) => {
		return new HtmlWebpackPlugin({
			inject: true,
			filename: `${page.replace('.pug', '')}.html`,
			template: path.resolve(__dirname, 'src/components/pages/', page),
			minify: false
		});
	});
}

module.exports = {
	entry: [
		'./src/index.js',
	],

	output: {
		filename: `assets/js/[name]-${VERSION}.js`,
		path: path.resolve(__dirname, 'build'),
		publicPath: `/${PROJECT_NAME}/`,
		assetModuleFilename: (pathData) => {
			const filepath = path.dirname(pathData.filename)
				.replace('src/', '');
      return `${filepath}/[name][ext]`;
    },
	},

	devServer: {
		static: {
			directory: path.join(__dirname, 'build'),
		},
		port: 9000,
	},

	watch: false,

	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
			'styles': path.resolve(__dirname, 'src/assets/styles'),
			'fonts': path.resolve(__dirname, 'src/assets/fonts'),
			'images': path.resolve(__dirname, 'src/assets/images'),
			'videos': path.resolve(__dirname, 'src/assets/videos'),
			'components': path.resolve(__dirname, 'src/components'),
			'js': path.resolve(__dirname, 'src/js'),
		},
	},

	plugins: [
		...generatePages(),
		new HtmlBeautifyPlugin(),
		new MiniCssExtractPlugin({
			filename: `assets/css/[name]-${VERSION}.css`,
		}),
		new CopyWebpackPlugin({
			patterns: [
				{from:'src/assets/images',to:'assets/images'} 
			]
		}), 
		new SVGSpritemapPlugin('src/assets/images/svg/*.svg', {
			output: {
				filename: 'assets/images/svg/svg-sprite.svg',
				svg4everybody: {
					polyfill: true,
				},
				svgo: {
					plugins: [
						{
							name: 'inlineStyles',
							params: { onlyMatchedOnce: false }
						},
						{
							name: 'cleanupIDs',
							params: { minify: false }
						},
						{
							name: 'removeAttrs',
							params: {attrs: '*:(stroke|fill)*'}
						}
					]
				}
			},
			sprite: {
				generate: {title: false},
				prefix: false,
				gutter: 5,
			},
		}),
	],

	optimization: {
		minimize: true,
		moduleIds: 'deterministic',
		innerGraph: true,
		concatenateModules: true,
		minimizer: [
			new CssMinimizerPlugin({}),
			new TerserPlugin({
				extractComments: false,
			})
		],
		splitChunks: {
			minChunks: 1,
			cacheGroups: {
				defaultVendors: {
					name: "vendors",
					test: /[\\/]node_modules[\\/]/,
					chunks: 'all',
					enforce: true,
				}
			}
		}
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			},
			{
				test: /\.[cs][ac]?ss$/i,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									[
										'postcss-preset-env',
										{
											browsers: 'last 10 versions',
										},
									],
								],
							},
						},
					},
					'sass-loader',
				],
			},
			{
				test: /\.(png|jpe?g|svg|ico|gif|webmanifest|mp4|webp|webm|woff|woff2)/,
				type: 'asset/resource',
			},
			{
				test: /\.pug$/,
				loader: '@webdiscus/pug-loader',
			},
		],
	}
};
