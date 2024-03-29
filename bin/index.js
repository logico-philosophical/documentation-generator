#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var ajv = new require('ajv')({
	useDefaults: true
});
var ejs = require('ejs');
var commander = require('commander');

var version = require('../package').version;
var configSchema = require('../config-schema');

var program = new commander.Command();
program
	.name('documentation-generator')
	.version(version)
	.option('--config <path>', 'location of the configuration file', './documentation-generator.config.js')
	.parse(process.argv);

function getRelativeDir(srcTree, dstTree) {
	var srcDirs = srcTree.dir ? srcTree.dirs.concat(srcTree.dir) : srcTree.dirs;
	var dstDirs = dstTree.dir ? dstTree.dirs.concat(dstTree.dir) : dstTree.dirs;

	var i;
	for (i = 0; i < srcDirs.length; i++) {
		if (srcDirs[i] != dstDirs[i]) break;
	}

	return (i == srcDirs.length ? './' : '../'.repeat(srcDirs.length - i))
		+ dstDirs.slice(i).map(e => e + '/').join('');
}

function getHtmlFilename(filename) {
	return filename.replace(/\.[^.]*$/, '.html');
}

try {
	var signature = ` documentation-generator v${version} `
	console.log(`${'='.repeat(signature.length)}\n${signature}\n${'='.repeat(signature.length)}\n`);
	var startTime = Date.now();

	var config = require(path.resolve(program.config));

	if (!ajv.validate(configSchema, config)) {
		throw Error('Invalid configuration file\n'
			+ ajv.errors.map(err => `    at <config>${err.dataPath}: ${err.message}`).join('\n'));
	}

	if (!(config.render instanceof Function))
		throw Error('<config>.render is not a function');

	var render = config.render;

	var templatePath = config.template || path.join(__dirname, '../templates/default.ejs');

	if (!fs.existsSync(templatePath) || fs.lstatSync(templatePath).isDirectory())
		throw Error(`Template file not found at "${path.resolve(templatePath)}"`);

	var templateFile = fs.readFileSync(templatePath, 'utf-8');
	var templateData = config.templateData;
	var template = ejs.compile(templateFile);

	var name = config.name;
	var src = config.src;

	if (!fs.existsSync(src) || !fs.lstatSync(src).isDirectory())
		throw Error(`Source directory "${path.resolve(src)}" is not a directory`);

	var dst = config.dst;

	if (fs.existsSync(dst) && !fs.lstatSync(dst).isDirectory())
		throw Error(`Destination directory "${path.resolve(dst)}" is not a directory`);

	console.log(`Source directory:       ${path.resolve(src)}`);
	console.log(`Destination directory:  ${path.resolve(dst)}`);
	console.log(`Using template:         ${config.template ? path.resolve(templatePath) : 'default'}\n`);

	var root = (function walk(dirs, tree) {
		if (tree.dir) {
			var srcpath = path.resolve(src, ...dirs, tree.dir);

			if (!fs.existsSync(srcpath))
				throw Error(`Directory ${srcpath} does not exist`);

			if (!fs.lstatSync(srcpath).isDirectory())
				throw Error(`${srcpath} is not a directory`);

			var dstdirpath = path.resolve(dst, ...dirs, tree.dir);

			if (!fs.existsSync(dstdirpath))
				fs.mkdirSync(dstdirpath);

			if (!fs.lstatSync(dstdirpath).isDirectory())
				throw Error(`${dstdirpath} is not a directory`);

			return {
				name: tree.name,
				srcpath,
				dstpath: path.resolve(dstdirpath, 'index.html'),
				dir: tree.dir,
				dirs,
				list: tree.list.map(t => walk(dirs.concat(tree.dir), t))
			};
		} else if (tree.file) {
			if (tree.file == 'index')
				throw Error('Name "index" is reserved');

			var file = path.resolve(src, ...dirs, tree.file);

			if (!fs.existsSync(file))
				throw Error(`File ${file} does not exist`);

			if (!fs.lstatSync(file).isFile())
				throw Error(`${file} is not a file`);

			return {
				name: tree.name,
				dirs,
				file: tree.file,
				srcpath: file,
				dstpath: path.resolve(dst, ...dirs, getHtmlFilename(tree.file))
			};
		} else {
			throw Error('Assertion failed');
		}
	})([], {
		name,
		dir: '.',
		list: config.list
	});

	var getToc = (root, srcTree) => (function walk(tree) {
		if (tree.list) {
			return {
				name: tree.name,
				relativeLink: getRelativeDir(srcTree, tree) + 'index.html',
				list: tree.list.map(walk)
			};
		} else {
			return {
				name: tree.name,
				relativeLink: getRelativeDir(srcTree, tree) + getHtmlFilename(tree.file)
			};
		}
	})(root);

	(function walk(tree) {
		if (tree.list) {
			let globaltoc = getToc(root, tree);
			let localtoc = getToc(tree, tree);

			let html = template(Object.assign({
				toc: {
					global: globaltoc,
					local: localtoc
				},
				title: tree.name,
				file: false
			}, templateData));

			fs.writeFileSync(tree.dstpath, html);

			console.log(`[  ${chalk.green('OK')}  ] ${path.join(src, ...tree.dirs, tree.dir)} -> ${path.join(dst, ...tree.dirs, tree.dir, 'index.html')}`);
			tree.list.map(t => walk(t));
		} else {
			let content = render(fs.readFileSync(tree.srcpath, 'utf-8'));
			let globaltoc = getToc(root, tree);
			let localtoc = getToc(tree, tree);

			let html = template(Object.assign({
				toc: {
					global: globaltoc,
					local: localtoc
				},
				title: tree.name,
				file: {
					content
				}
			}, templateData));

			fs.writeFileSync(tree.dstpath, html);

			console.log(`[  ${chalk.green('OK')}  ] ${path.join(src, ...tree.dirs, tree.file)} -> ${path.join(dst, ...tree.dirs, getHtmlFilename(tree.file))}`);
		}
	})(root);

	let endTime = Date.now();
	console.log('\nBuild '  + chalk.black.bgGreen(' successful ') + ` (took ${endTime - startTime} ms)`);
} catch (err) {
	console.log(`[ ${chalk.red('FAIL')} ] ${err.stack}`);

	let endTime = Date.now();
	console.log('\nBuild ' + chalk.bgRed(' failed ') + ` (took ${endTime - startTime} ms)`);
	process.exit(1);
}