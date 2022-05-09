var fs = require('fs'),
	path = require('path');

// Finds out the version of a module.
function getVersion(name) {
	var dir = path.dirname(require.resolve(name));

	while (!fs.existsSync(path.join(dir, 'package.json'))) {
		dir = path.resolve(dir, '..');
	}
	
	return require(path.join(dir, 'package')).version;
}

var m42kup = require('m42kup'),
	hljs = require('highlight.js'),
	katex = require('katex');

m42kup.set({hljs, katex});

var styles = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@${getVersion('highlight.js')}/styles/tomorrow.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@${getVersion('katex')}/dist/katex.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/m42kup@${getVersion('m42kup')}/web/m42kup.default.css">`;

module.exports = {
	name: 'documentation-generator 설명서',
	src: 'src',
	dst: 'build',
	render: text => m42kup.render(text),
	templateData: {
		styles
	},
	list: [
		{
			name: '소개',
			file: 'introduction.m42kup'
		},
		{
			name: '설정 파일',
			file: 'config-file.m42kup'
		},
		{
			name: '커스텀 템플릿',
			file: 'templates.m42kup'
		},
		{
			name: '꿀팁',
			file: 'honeytip.m42kup'
		},
	]
};