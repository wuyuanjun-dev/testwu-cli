// lib/Generator.js
const { getRepoList , getTagList} = require('./http');
const ora = require('ora');
const path = require('path')
const chalk = require('chalk')
const inquirer = require('inquirer');
const util = require('util');
const downloadGitRepo = require('download-git-repo');


// 添加加载动画
async function wrapLoading(fn, message, ...args) {
    const spinner = ora(message);
    spinner.start();
    try {
        const result = await fn(...args);
        spinner.succeed()
        return result
    } catch (err) {
        spinner.fail('Request failed, refetch')
    }
}


class Generator {
    constructor(name, targetDir) {
        // 目录名称
        this.name = name;
        // 创建位置
        this.targetDir = targetDir;
        this.downloadGitRepo = util.promisify(downloadGitRepo);
    }

    async getRepo() {
        const repolist = await wrapLoading(getRepoList, 'wating fetch tempalte')
        if (!repolist) return;
        const repos = repolist.map(item => item.name)
        const { repo } = await inquirer.prompt([
            {
                name: 'repo',
                type: 'list',
                choices: repos,
                message: 'Please choose a template to create project'
            }
        ])
        return repo;
    }

    // 获取用户选择的版本
    // 1）基于 repo 结果，远程拉取对应的 tag 列表
    // 2）用户选择自己需要下载的 tag
    // 3）return 用户选择的 tag

    async getTag(repo) {
        // 1）基于 repo 结果，远程拉取对应的 tag 列表
        const tags = await wrapLoading(getTagList, 'waiting fetch tag', repo);
        if (!tags) return;

        // 过滤我们需要的 tag 名称
        const tagsList = tags.map(item => item.name);

        // 2）用户选择自己需要下载的 tag
        const { tag } = await inquirer.prompt({
            name: 'tag',
            type: 'list',
            choices: tagsList,
            message: 'Place choose a tag to create project'
        })

        // 3）return 用户选择的 tag
        return tag
    }
    // 下载远程模板 1) 拼接下载地址 2)调用下载方法
    async download(repo, tag) {
        const requestUrl = `zhurong-cli/${repo}${tag ? '#' + tag : ''}`;
        await wrapLoading(this.downloadGitRepo,
            'waiting download template', // 加载提示信息
            requestUrl,
            path.resolve(process.cwd(), this.targetDir)
        )
    }
    // 核心创建逻辑
    async create() {
        // 1）获取模板名称
        const repo = await this.getRepo()
        // 2) 获取 tag 名称
        const tag = await this.getTag(repo)
        // 3）下载模板到模板目录
        await this.download(repo, tag)


        // 4）模板使用提示
        console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`)
        console.log(`\r\n  cd ${chalk.cyan(this.name)}`)
        console.log('  npm run dev\r\n')

    }
}

module.exports = Generator;