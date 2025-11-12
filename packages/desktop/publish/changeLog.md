### Added

- Added a **cover style** option for the *Play Details* page. Now supports **CD** and **Square** styles. You can switch styles in _Settings > Play Details Page Settings > Cover Style_.
- Added a **"Show lyrics in status bar"** option (MacOS only), located in _Settings > Playback Settings_. Disabled by default; can be enabled via _Settings > Playback Settings > Show lyrics in status bar_.
- Added a **"Show lyrics in title bar"** option in _Settings > Playback Settings_. Disabled by default; can be enabled via _Settings > Playback Settings > Show lyrics in title bar_.
- Added a **"Show lyrics in media control bar"** option in _Settings > Playback Settings_. Disabled by default; can be enabled via _Settings > Playback Settings > Show lyrics in media control bar_.

### Improved

- Optimized the position for new list creation: when creating a new list by clicking an existing list, the new list will be inserted immediately after the target list.
- Improved **WebDAV data reading logic** for better compatibility with various *WebDAV* services.
- Enhanced the **WebDAV service list creation** process: when adding a new WebDAV service list, you no longer need to set the password manually. The app will prompt you to set a password and automatically save it to extension settings.
- Improved the system tray menu.

### Fixed

- Fixed an issue where the update reminder did not reappear after an update was downloaded.
- Fixed an issue where residual callbacks were not properly unregistered when observing changes to local lists.
- Fixed an issue where internal extension logs did not update in real time.

---

### 新增

- 新增 **「播放详情页封面样式」** 选项，现支持 **CD** 与 **正方形** 两种样式，可在 _设置 > 播放详情页设置 > 封面样式_ 中切换。
- 新增 **「显示状态栏歌词」** 选项（仅限 MacOS 版本），位于 _设置 > 播放设置_，默认关闭，可在 _设置 > 播放设置 > 显示状态栏歌词_ 启用。
- 新增 **「显示标题栏歌词」** 选项，位于 _设置 > 播放设置_，默认关闭，可在 _设置 > 播放设置 > 显示标题栏歌词_ 启用。
- 新增 **「显示媒体控制栏歌词」** 选项，位于 _设置 > 播放设置_，默认关闭，可在 _设置 > 播放设置 > 显示媒体控制栏歌词_ 启用。

### 优化

- 优化新建列表的插入位置：通过点击已有列表创建新列表时，新列表将插入到目标列表之后。
- 优化 **WebDAV 数据读取逻辑**，提升与多种 *WebDAV* 服务的兼容性。
- 优化 **WebDAV 服务列表创建流程**：添加新 WebDAV 服务列表时无需手动设置密码，应用会弹窗提示设置密码并自动保存至扩展设置中。
- 优化系统托盘菜单。

### 修复

- 修复更新下载完成后，更新提醒未再次弹出的问题。
- 修复本地列表变更监听时残留回调未正确注销的问题。
- 修复内部扩展日志未能实时更新的问题。
