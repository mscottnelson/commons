const fs = require('fs');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { NoEmitOnErrorsPlugin, SourceMapDevToolPlugin, NamedModulesPlugin } = require('webpack');
const { NamedLazyChunksWebpackPlugin, BaseHrefWebpackPlugin } = require('@angular/cli/plugins/webpack');
const { CommonsChunkPlugin } = require('webpack').optimize;
const { AngularCompilerPlugin } = require('@ngtools/webpack');

module.exports = {
	resolve: {
		extensions: [".ts",".js"],
		modules: [
			"./node_modules",
			path.resolve(__dirname, "../app1/node_modules"),
		],
		symlinks: true
	},
	resolveLoader: {
		modules: [
			"./node_modules",
			path.resolve(__dirname, "../app1/node_modules"),
		]
	},
	output: {
		path: path.join(process.cwd(), "../app1/"),
		publicPath: "/r1",
		filename: "[name].bundle.js",
		chunkFilename: "[id].chunk.js"
	},
	module: {
		rules: [{
			enforce: "pre",
			test: /\.js$/,
			loader: "source-map-loader",
			exclude: [/(\\|\/)node_modules(\\|\/)/]
		},
		{
			test: /\.html$/,
			loader: "raw-loader"
		},
		{
			test: /\.(eot|svg|cur)$/,
			loader: "file-loader?name=[name].[hash:20].[ext]"
		},
		{
			test: /\.(jpg|png|webp|gif|otf|ttf|woff|woff2|ani)$/,
			loader: "url-loader?name=[name].[hash:20].[ext]&limit=10000"
		},
		{
			exclude: [
				path.join(process.cwd(), "src/styles.css")
			],
			test: /\.css$/,
			use: [
				"exports-loader?module.exports.toString()",
				{
					loader: "css-loader",
					options: {
						sourceMap: false,
						importLoaders: 1
					}
				},
			]
		},
		{
			include: [
				path.join(process.cwd(), "src/styles.css")
			],
			test: /\.css$/,
			use: [
				"style-loader",
				{
					loader: "css-loader",
					options: {
						sourceMap: false,
						importLoaders: 1
					}
				},
			]
		},
		{
			test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
			loader: "@ngtools/webpack"
		}
		]
	},
	plugins: [
		new NoEmitOnErrorsPlugin(),
		new CopyWebpackPlugin([{
			context: "../app1/src",
			from: {
				glob: "../app1/src/assets/**/*",
				dot: true
			}
		},
		{
			context: "../app1/src",
			to: "",
			from: {
				glob: "favicon.ico",
				dot: true
			}
		}
		], {
			ignore: [
				".gitkeep"
			],
			debug: "warning"
		}),
		new ProgressPlugin(),
		new CircularDependencyPlugin({
			exclude: /(\\|\/)node_modules(\\|\/)/,
			failOnError: false
		}),
		new NamedLazyChunksWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: "../app1/src/index.html",
			filename: "../app1/index.html",
			hash: false,
			inject: true,
			compile: true,
			favicon: false,
			minify: false,
			cache: true,
			showErrors: true,
			chunks: "admin",
			excludeChunks: [],
			title: "Webpack App",
			xhtml: true
		}),
		new BaseHrefWebpackPlugin({}),
		new SourceMapDevToolPlugin({
			filename: "[file].map[query]",
			moduleFilenameTemplate: "[resource-path]",
			fallbackModuleFilenameTemplate: "[resource-path]?[hash]",
			sourceRoot: "webpack:///"
		}),
		new CommonsChunkPlugin({
			name: [
				"main"
			],
			minChunks: 2,
			async: "common"
		}),
		new NamedModulesPlugin({}),
		new AngularCompilerPlugin({
			tsConfigPath: '../app1/tsconfig.json',
			mainPath: '../app1/src/main.ts',
			sourceMap: true
		})
	]
};