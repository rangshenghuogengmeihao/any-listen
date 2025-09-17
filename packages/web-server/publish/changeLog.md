### Added

- Added a **"Swap translated lyrics and romanized lyrics"** option in _Settings > Playback Settings_.
- Added a **"Bold lyrics font"** option in _Settings > Playback Details_. Enabled by default.
- Added support for reading and playing Any Listen lyrics tag data.
- Added the creation of **"Remote Playlist"**.
- Added basic support for reading and playing songs from **"WebDAV services"**. You can use this feature via _Playlist right-click menu > New Playlist > Remote Playlist_.

### Improved

- Improved the update notification mechanism. Now shows error messages when update checks or downloads fail ([#59](https://github.com/any-listen/any-listen/issues/59)).
- Improved lyrics display on the song details page for better readability.
- Improved the lyric scrolling speed when lyric scrolling is not delayed.
- Reset extension store cache on each page load.

### Fixed

- Fixed an issue where lyrics from the previous song may still display when switching to a song without lyrics.
- Fixed a potential playlist synchronization issue.

### Changed

- Swapped the positions of **"Translated lyrics"** and **"Romanized lyrics"**. If you prefer the original order, you can enable the **"Swap translated lyrics and romanized lyrics"** option to revert.

---

### 新增

- 新增 **「调换翻译歌词与罗马音歌词位置」** 选项，位于 _设置 > 播放设置_
- 新增 **「加粗歌词字体」** 选项，位于 _设置 > 播放详情页设置_，默认启用
- 新增 Any Listen 歌词标签数据读取与播放
- 新增 **「远程列表」** 的创建
- 新增对 **「WebDAV 服务」** 内歌曲基本的读取与播放支持，可以在 _列表右键菜单 > 新建列表 > 远程列表_ 使用

### 优化

- 优化版本更新提示机制，增加检查和下载更新失败时的错误信息提示（[#59](https://github.com/any-listen/any-listen/issues/59)）
- 优化歌曲详情页的歌词显示效果，提升可读性
- 优化不延迟歌词滚动时的歌词滚动速度
- 每次加载页面时重置扩展商店缓存

### 修复

- 修复从有歌词的歌曲切到无歌词的歌曲时，可能出现仍然显示上一首歌曲的歌词的问题
- 修复潜在播放列表同步问题

### 变更

- 调换 **「翻译歌词」** 和 **「罗马音歌词」** 的位置，若你想要恢复默认的行为，可开启 **「调换翻译歌词与罗马音歌词位置」** 选项
