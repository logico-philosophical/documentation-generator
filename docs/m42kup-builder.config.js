var m42kup = require('m42kup'),
	hljs = require('highlight.js'),
	katex = require('katex');

m42kup.set({hljs, katex});

module.exports = {
	name: 'm42kup-builder 설명서',
	src: 'src',
	dst: 'build',
	render: text => m42kup.render(text),
	list: [
		{
			name: '소개',
			file: 'introduction'
		},
		{
			name: '설정 파일',
			file: 'config-file'
		},
		{
			name: '커스텀 템플릿',
			file: 'templates'
		},
		{
			name: '꿀팁',
			file: 'honeytip'
		}
	]
};