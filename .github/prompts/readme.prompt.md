---
mode: agent
---

将 ${workspaceFolder}/docs 目录下的 README_zh.md 翻译为同目录下其他 README\_\*.md 文件，并同步翻译到 ${workspaceFolder} 目录下的 README.md，具体规则如下：

- 翻译内容需使用 markdown 语法编写
- ${workspaceFolder}/README.md 为英文版本，其他语言的 README 文件命名为 README\_\*.md，其中 \* 为对应语言缩写，如简体中文为 `zh`
- 顶部需包含语言导航，例如 `English | 中文`，当前语言无需链接，其他语言需添加对应链接。例如英文 README 顶部为 `English | [中文](./docs/README_zh.md)`，中文 README 顶部为 `[English](../README.md) | 中文`
- 确保所有语言版本的 README 文件都包含完整的语言导航，并保持一致
- 翻译时无需逐字逐句，只需尽量采用目标语言的专业术语和常用表达，符合目标语言的语法和表达习惯
- 不要修改英文版本的 License 内容，始终将英文 License 内容翻译到其他语言的 README 文件中
- 不要修改英文版本的 License 内容，总是将英文版本的 License 内容翻译到其他语言的 README 文件中。
