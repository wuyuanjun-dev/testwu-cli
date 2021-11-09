// lib/create.js

const path = require('path');
const fs = require('fs-extra')
const inquirer = require('inquirer');
const Genetator = require('./gennerator');

module.exports = async function (name, options) {
    // // 验证是否正常取到值
    console.log('>>> create.js', name, options)
    const cwd = process.cwd();
    // 需要创建的目录地址
    const targetAir = path.join(cwd, name);

    // 目录是否已经存在
    if (fs.existsSync(targetAir)) {
        if (options.force) {
            await fs.removeSync(targetAir)
        } else {
            let { action } = await inquirer.prompt([
                {
                    name: 'action',
                    type: 'list',
                    message: 'Target directory already exists pick an action',
                    choices: [
                        {
                            name: 'Overwirte',
                            value: 'overwirte'
                        },
                        {
                            name: 'Cannel',
                            value: false
                        }
                    ]
                }
            ])
            if (!action) {
                return;
            } else if (action == 'overwrite') {
                console.log('删除存在目录')
                await fs.removeSync(targetAir)
            }
        }
    } else {
        console.log('可以执行')
    }

    const generator = new Genetator(name, targetAir)
    generator.create()
}
