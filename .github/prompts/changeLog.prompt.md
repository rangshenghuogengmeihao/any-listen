---
mode: edit
---

翻译并格式化更新日志

- 翻译时无需逐字逐句，只需尽量采用目标语言的专业术语和常用表达，符合目标语言的语法和表达习惯
- 内容需使用 markdown 语法编写
- 确保更新日志中同时包含英文和中文版本。如果某条变更项仅有中文或英文，请补充对应的翻译
- 确保中英文日志的描述方式和格式均类似于下方例子。若原始日志未遵循此格式，请调整为类似格式，例如对功能名称加粗、功能路径使用斜体等
- 使用分隔线（---）分隔中英文内容
- 英文日志始终置于文档开头

参考例子：

```markdown
### Added

- Added a **"Bold lyrics font"** option in _Settings > Play Details Page Settings_. Enabled by default.

### Improved

- Improved the update notification mechanism. Now shows error messages when update checks or downloads fail ([#59](https://github.com/any-listen/any-listen/issues/59)).

### Fixed

- Fixed an issue where ambient sound effects failed to load.

### Changed

- Swapped the positions of **"Translated lyrics"** and **"Romanized lyrics"**. If you prefer the original order, you can enable the **"Swap translated lyrics and romanized lyrics"** option to revert.

---

### 新增

- 新增 **「加粗歌词字体」** 选项，位于 _设置 > 播放详情页设置_，默认开启

### 优化

- 优化版本更新提示机制，增加检查和下载更新失败时的错误信息提示（[#59](https://github.com/any-listen/any-listen/issues/59)）

### 修复

- 修复环境音效加载失败的问题

### 变更

- 调换 **「翻译歌词」** 和 **「罗马音歌词」** 的位置，若你想要恢复默认的行为，可开启 **「调换翻译歌词与罗马音歌词位置」** 选项
```
