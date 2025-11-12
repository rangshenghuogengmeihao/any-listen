### Added

- Added a **cover style** option for the *Play Details* page. Two styles are available now: **CD** and **Square**. You can change it at _Settings > Play Details Page Settings > Cover Style_.
- Added a **"Show lyrics in title bar"** option in _Settings > Playback Settings_. Disabled by default; can be enabled via _Settings > Playback Settings > Show lyrics in title bar_.

### Improved

- Optimized the insertion position when creating a new list: when creating a new list by clicking an existing list, the new list will be inserted immediately after the target list.
- Improved the connection logic between the front-end and back-end, and enhanced error messages shown on login failure.
- Docker image no longer runs the service as the root user ([#79](https://github.com/any-listen/any-listen/issues/79)).
- Improved the **WebDAV data reading logic** to enhance compatibility with various *WebDAV* services.
- Improved the **WebDAV service list creation** process: when adding a new WebDAV service list, you no longer need to set the password manually. The application will prompt you to set a password and automatically save it to the extension settings.

### Fixed

- Fixed an issue where residual callbacks were not properly unregistered when observing changes to local lists.
- Fixed an issue where internal extension logs did not update in real time.

---

### 新增

- 新增 **播放详情页封面样式** 选项，当前提供 **CD** 与 **正方形** 两种样式。可在 _设置 > 播放详情页设置 > 封面样式_ 中进行切换。
- 新增 **「显示标题栏歌词」** 设置项，默认关闭，可在 _设置 > 播放设置 > 显示标题栏歌词_ 启用。

### 优化

- 优化新列表创建位置：通过点击已有列表创建新列表时，新列表将插入到目标列表之后。
- 优化前端与后端的连接逻辑，并提升登录失败时的错误提示信息。
- Docker 镜像不再以 root 用户运行服务（[#79](https://github.com/any-listen/any-listen/issues/79)）。
- 优化 **WebDAV 数据读取逻辑**，提升与多种 *WebDAV* 服务的兼容性。
- 优化 **WebDAV 服务列表创建流程**：添加新 WebDAV 服务列表时无需手动设置密码，应用会弹窗提示设置密码并自动保存至扩展设置中。

### 修复

- 修复本地列表变更监听时残留回调未正确注销的问题。
- 修复内部扩展日志未实时更新的问题。
