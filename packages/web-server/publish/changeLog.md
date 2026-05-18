<!--- @lang: en-us -->

### Added

- Added an **Online Resources** section under _Settings > Online Resources_. Disabled by default.
- Added an **Ignore Local Duplicate and Embedded Lyrics** option under _Settings > Playback Settings_. When enabled, the app ignores same-name local LRC files and embedded lyrics in local tracks, then attempts to fetch lyrics from other sources.
- Added an **Audio Output Device** setting under _Settings > Playback Settings_ ([#161](https://github.com/any-listen/any-listen/issues/161)).
- Added a **Disable Song Switching** option to the song switching mode ([#161](https://github.com/any-listen/any-listen/issues/161)).
- Added a **Preferred Playback Quality** option under _Settings > Playback Settings_, defaulting to **128k**.

### Improved

- Improved cover loading in the song list to display previously loaded covers faster ([#156](https://github.com/any-listen/any-listen/issues/156)).

### Fixed

- Fixed an issue where the currently playing **Play Later** track was unexpectedly removed from the playlist when the player was reloaded.
- Fixed an issue where proxy service validation failed for URLs with query parameters.
- Fixed an issue where extension translations were displayed incorrectly.
- Fixed an issue where local song covers were not re-read from local storage first when the cache was cleared.

---

<!--- @lang: zh-cn -->

### 新增

- 新增 **「在线资源」** 板块，位于 _设置 > 在线资源_，默认关闭。
- 新增 **「忽略本地歌曲的同名及内嵌歌词」** 选项，位于 _设置 > 播放设置_。启用后会忽略本地歌曲同名 LRC 歌词及文件内嵌歌词，并尝试从其他渠道获取歌词。
- 新增 **「音频输出设备」** 设置，位于 _设置 > 播放设置_（[#161](https://github.com/any-listen/any-listen/issues/161)）。
- 歌曲切换模式新增 **「禁用歌曲切换」** 选项（[#161](https://github.com/any-listen/any-listen/issues/161)）。
- 新增 **「优先播放音质」** 选项，位于 _设置 > 播放设置_，默认 **128k**。

### 优化

- 优化歌曲列表内封面加载机制，加快已加载过封面的显示速度 ([#156](https://github.com/any-listen/any-listen/issues/156))。

### 修复

- 修复正在播放的 **「稍后播放」** 歌曲在重新加载播放器时被意外从播放列表移除的问题。
- 修复代理服务校验带参数 URL 异常的问题。
- 修复扩展翻译显示问题。
- 修复缓存被清空时，本地歌曲封面未优先再次从本地读取的问题。
