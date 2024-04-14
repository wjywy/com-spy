import cac from 'cac'
import ora from "ora";
import { blue, green, yellow } from "chalk";
import analysis from '@com-spy/core';
import { confirmOptions } from "./confirmOptions";
import { createServer } from './createServer';

const cli = cac();
cli
  .command("[analysis,ana]", "解析本地组件依赖关系图")
  .option("--graph <graph>", "输出依赖图的文件路径", {
    type: ["string"],
  })
  .action(async (_, options: {
    '--': any[];
    comName: string[];
    ui: boolean[];
  }) => {
    const { Confirm, Input } = require("enquirer");

    options.comName = [
      String(
        await new Input({
          name: "comName",
          message: "请输入你要查询的组件名称",
          initial: '',
        }).run(),
      ),
    ];

    options.ui = [
      await new Confirm({
        name: "ui",
        message: "是否启动可视化界面?",
        initial: true,
      }).run(),
    ];

    const option = await confirmOptions(options);

    const spinner = ora(blue("🕵️ 正在潜入\n")).start();
    const startTime = Date.now();
    const ana = new analysis(option);
    await ana.OutputFile();

    spinner.stop();
    console.log(green(`破解完成,耗时 ${yellow(Date.now() - startTime)} ms`));

    // 如果开启 ui，则启动可视化界面
    if (options.ui) {
      createServer();
    }
  });

cli.help();
cli.parse();

