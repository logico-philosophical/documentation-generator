<h1 align="center">documentation-generator</h1>

<p align="center"><a href="https://logico-philosophical.github.io/documentation-generator/docs/build/introduction.html">docs</a></p>

[![npm](https://img.shields.io/npm/v/documentation-generator)](https://www.npmjs.com/package/documentation-generator)
[![Build Status](https://img.shields.io/travis/com/logico-philosophical/documentation-generator)](https://app.travis-ci.com/github/logico-philosophical/documentation-generator)
[![GitHub](https://img.shields.io/github/license/logico-philosophical/documentation-generator)](https://github.com/logico-philosophical/documentation-generator/blob/master/LICENSE)

Build documentation using a markup renderer like [m42kup](https://github.com/logico-philosophical/m42kup).

## Installation

```
npm install documentation-generator
```

## Example configuration using `m42kup`

```
npm install m42kup@0.3
```

**Example directory structure**

```
root/
├ build/
├ src/
│ ├ file1.m42kup
│ └ dir1/
│   ├ file2.m42kup
│   └ file3.m42kup
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

var m42kup = require('m42kup');

var styles = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/m42kup@${getVersion('m42kup')}/web/m42kup.default.css">`;

module.exports = {
    name: 'Example documentation',
    src: 'src',
    dst: 'build',
    render: text => m42kup.render(text),
    templateData: {
        styles
    },
    list: [
        {
            name: 'File 1',
            file: 'file1.m42kup'
        },
        {
            name: 'Directory 1',
            dir: 'dir1',
            list: [
                {
                    name: 'File 2',
                    file: 'file2.m42kup'
                },
                {
                    name: 'File 3',
                    file: 'file3.m42kup'
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
