# any-listen-web-server change log

All notable changes to this project will be documented in this file.

Project versioning adheres to [Semantic Versioning](http://semver.org/).
Commit convention is based on [Conventional Commits](http://conventionalcommits.org).
Change log format is based on [Keep a Changelog](http://keepachangelog.com/).

## [0.3.0](https://github.com/any-listen/any-listen-web-server/compare/v0.2.0...v0.3.0) - 2025-07-06

### Added

- Added lyric alignment setting on the playback details page
- Added Karaoke lyrics setting

### Optimized

- Adjusted the layout of control buttons on the playback bar
- Optimized the display effect of the changelog

### Fixed

- Fixed the issue where ambient sound effects failed to load

### Changed

- Updated default values for the playback details page, playback bar, and other default settings

---

### 新增

- 添加设置-播放详情页设置-歌词对齐方式设置
- 添加设置-播放设置-是否启用卡拉OK歌词设置

### 优化

- 调整播放栏控制按钮布局
- 优化更新日志显示效果

### 修复

- 修复环境音效加载失败的问题

### 变更

- 更新播放详情页、播放栏等默认设置的默认值

## [0.2.0](https://github.com/any-listen/any-listen-web-server/compare/v0.1.0...v0.2.0) - 2025-06-22

### Added

- Added the ability to add songs by selecting a folder, which will scan the selected directory and its subdirectories for songs
- Added extension management
- Added version checking
- Added icons to the navigation menu
- Improved proxy handling
- Added playback bar style settings
- Added extension icon display
- Added online extension store list loading and online extension installation/upgrading
- Added basic playback details page
- Added settings for playback details, playback settings for displaying lyric translations and romaji

### Improved

- Improved version check popup UI and fixed new version content display issues
- Improved virtual scrollbar appearance
- Updated scroll handling for better performance

### Fixed

- Fixed Flac file lyric reading issues
- Fixed issues when `allowPublicDir` is set to `/`
- Fixed music cover size issue in playback bar on Safari browser
- Fixed notification bubbles being covered by popups
- Fixed playlist synchronization issues
- Fixed played list update issues

---

### 新增

- 新增选择文件夹的方式添加歌曲，将会扫描所选目录及子目录内的歌曲
- 添加扩展管理
- 添加版本检查
- 为导航菜单添加图标
- 完善代理处理
- 新增播放栏样式设置
- 添加扩展图标显示
- 添加在线扩展商店列表加载与在线扩展安装、升级
- 添加基础的播放详情页
- 添加设置-播放详情设置，播放设置-显示歌词翻译、罗马音设置

### 优化

- 优化版本检查弹窗 UI 及修复新版本内容显示问题
- 优化虚拟滚动条显示效果
- 更新滚动处理以提高性能

### 修复

- 修复 Flac 文件歌词读取问题
- 修复 `allowPublicDir` 为 `/` 时出现的问题
- 修复 Safari 浏览器播放栏音乐图片大小问题
- 修复通知气泡被弹出层遮挡的问题
- 修复播放列表同步问题
- 修复已播放列表更新问题

## 0.1.0 - 2025-01-26

First version 🎉
