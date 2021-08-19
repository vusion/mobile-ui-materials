const fs = require('fs');
const path = require('path');
const { argv } = require('argvs');
const pathDir = path.join(__dirname, '../src/components', argv.dir + '.vue', 'index.vue');
let content = fs.readFileSync(pathDir, { encoding: 'utf8' });

fs.writeFileSync(path.join(pathDir, '../content.txt'), content, "utf-8")
