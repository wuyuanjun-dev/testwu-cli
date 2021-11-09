#! /usr/bin/env node

const program = require('commander');
const chalk = require('chalk')
const figlet = require('figlet');
program
    .command('create <app-name>')
    .description('create a new project')
    .option('-f, --force', '强制创建，存在则覆盖')
    .action((name, options) => {
        // console.log('name:', name, 'options：', options)
        require('../lib/create')(name, options);
    })

program
    .command('config [value]')
    .description('配置选项')
    .option('-g, --get <path>', 'get value from option')
    .option('-s, --set <path> <value>')
    .option('-d, --delete <path>', 'delete option from config')
    .action((value, options) => {
        console.log(value, options)
    })


program
    .command('ui')
    .description('start add open rol-cli ui')
    .option('-p, --port <port>', 'Port used for the UI Server')
    .action((option) => {
        console.log(option)
    })

// 配置版本号信息
program.version(`v${require('../package.json').version}`).usage('<command> [option]')

program.on('--help', () => {
    // console.log(`\r\nRun ${chalk.cyan(`zr <command> --help`)} for detailed usage of given command\r\n`)
    console.log('\r\n' + figlet.textSync('zhurong-cli', {
        font: 'Ghost',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 80,
        whitespaceBreak: true
    }));
})

// 解析用户输入的参数
program.parse(process.argv)
