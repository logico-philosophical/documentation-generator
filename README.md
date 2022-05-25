<h1 align="center">documentation-generator</h1>

<p align="center"><a href="https://logico-philosophical.github.io/documentation-generator/docs/build/introduction.html">docs</a></p>

[![npm](https://img.shields.io/npm/v/documentation-generator)](https://www.npmjs.com/package/documentation-generator)
[![Node.js CI](https://github.com/logico-philosophical/documentation-generator/actions/workflows/test-and-build.yml/badge.svg)](https://github.com/logico-philosophical/documentation-generator/actions/workflows/test-and-build.yml)
[![GitHub](https://img.shields.io/github/license/logico-philosophical/documentation-generator)](https://github.com/logico-philosophical/documentation-generator/blob/master/LICENSE)

Build documentation using a markup renderer like [yamd](https://github.com/logico-philosophical/yamd).

## Installation

```
npm install documentation-generator
```

## Example configuration using `yamd`

```
npm install yamd@0.4
```

**Example directory structure**

```
root/
├ build/
├ src/
│ ├ file1.yamd
│ └ dir1/
│   ├ file2.yamd
│   └ file3.yamd
├ documentation-generator.config.js
├ package.json
└ ...
```

**`documentation-generator.config.js`**

```js
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

var yamd = require('yamd');

var styles = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/yamd@${getVersion('yamd')}/web/yamd.default.css">`;

module.exports = {
    name: 'Example documentation',
    src: 'src',
    dst: 'build',
    render: text => yamd.render(text),
    templateData: {
        styles
    },
    list: [
        {
            name: 'File 1',
            file: 'file1.yamd'
        },
        {
            name: 'Directory 1',
            dir: 'dir1',
            list: [
                {
                    name: 'File 2',
                    file: 'file2.yamd'
                },
                {
                    name: 'File 3',
                    file: 'file3.yamd'
                }
            ]
        }
    ]
};
```

Finally, run
```
npx documentation-generator
```
at the root directory and open `build/index.html` to see the generated documentation.

Refer to the [documentation](https://logico-philosophical.github.io/documentation-generator/docs/build/introduction.html) for more information.
