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

var yamd = require('yamd'),
	hljs = require('highlight.js'),
	katex = require('katex');

yamd.set({hljs, katex});

var styles = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@${getVersion('highlight.js')}/styles/tomorrow.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@${getVersion('katex')}/dist/katex.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/yamd@${getVersion('yamd')}/web/yamd.default.css">`;

module.exports = {
	name: 'documentation-generator 설명서',
	src: 'src',
	dst: 'build',
	render: text => yamd.render(text),
	templateData: {
		styles
	},
	list: [
		{
			name: '소개',
			file: 'introduction.yamd'
		},
		{
			name: '설정 파일',
			file: 'config-file.yamd'
		},
		{
			name: '커스텀 템플릿',
			file: 'templates.yamd'
		},
		{
			name: '꿀팁',
			file: 'honeytip.yamd'
		},
	]
};