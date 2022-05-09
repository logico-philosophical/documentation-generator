var m42kup = require('m42kup'),
	hljs = require('highlight.js'),
	katex = require('katex');

m42kup.set({hljs, katex});

var styles = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@10.4.1/styles/tomorrow.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/m42kup@0.3.0/web/m42kup.default.css">`;

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