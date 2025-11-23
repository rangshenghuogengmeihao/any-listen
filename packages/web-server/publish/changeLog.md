### Added

- Added a **Cover Style** option for the Now Playing page under _Settings > Now Playing Page Settings > Cover Style_, offering **CD** and **Square** layouts.
- Added a **Show Title Bar Lyrics** toggle under _Settings > Playback Settings > Show Title Bar Lyrics_. Disabled by default.
- Added a **Show Media Control Bar Lyrics** toggle under _Settings > Playback Settings > Show Media Control Bar Lyrics_. Disabled by default.
- Added **Font Settings** under _Settings > General_.

### Improved

- Improved playlist insertion so a new playlist created via an existing one is placed immediately after the target.
- Improved frontend-backend connection logic and enhanced error messages when login fails.
- Docker images no longer run services as the root user ([#79](https://github.com/any-listen/any-listen/issues/79)).
- Improved WebDAV data reading logic for better compatibility with more WebDAV services.
- Streamlined WebDAV service list creation so the app prompts for a password and saves it automatically to extension settings when adding a new service.

### Fixed

- Fixed lingering callbacks not being deregistered when observing local list changes.
- Fixed internal extension logs not refreshing in real time.
- Fixed karaoke lyrics rendering issues on older browsers.

---

### 新增

- 新增 **播放详情页封面样式** 选项，位于 _设置 > 播放详情页设置 > 封面样式_，可选择 **CD** 或 **正方形** 样式。
- 新增 **「显示标题栏歌词」** 选项，位于 _设置 > 播放设置 > 显示标题栏歌词_，默认关闭。
- 新增 **「显示媒体控制栏歌词」** 选项，位于 _设置 > 播放设置 > 显示媒体控制栏歌词_，默认关闭。
- 新增 **「字体设置」**，位于 _设置 > 基本设置_。

### 优化

- 优化新列表创建位置，通过点击已有列表创建新列表时，新列表会立即插入到目标列表之后。
- 优化前端与后端的连接逻辑，并改进登录失败时的错误提示信息。
- Docker 镜像不再以 root 用户运行服务（[#79](https://github.com/any-listen/any-listen/issues/79)）。
- 优化 WebDAV 数据读取逻辑，改进与更多 WebDAV 服务的兼容性。
- 优化 WebDAV 服务列表创建流程，添加新 WebDAV 服务列表时应用会弹窗提示设置密码并自动保存至扩展设置。

### 修复

- 修复本地列表变更监听时残留回调未正确注销的问题。
- 修复内部扩展日志未实时更新的问题。
- 修复在低版本浏览器下卡拉 OK 歌词显示异常的问题。
