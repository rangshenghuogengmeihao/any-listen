### Added

- Added a **cover style** option for the *Play Details* page. Two styles are available now: **CD** and **Square**. You can change it at _Settings > Play Details Page Settings > Cover Style_.

### Improved

- Improved the connection logic between the frontend and backend, and enhanced the error messages shown when login attempts fail.
- The Docker image no longer runs the service as the root user ([#79](https://github.com/any-listen/any-listen/issues/79)).
- Improved the **WebDAV data reading logic** to enhance compatibility with various *WebDAV* services.

### Fixed

- Fixed an issue where internal extension logs did not update in real time.

---

### 新增

- 新增 **播放详情页封面样式** 选项，当前提供 **CD** 与 **正方形** 两种样式。可在 _设置 > 播放详情页设置 > 封面样式_ 中进行切换。

### 优化

- 优化前端与后端的连接逻辑，并增强登录失败时的错误提示信息。
- Docker 镜像不再以 root 用户运行服务（[#79](https://github.com/any-listen/any-listen/issues/79)）。
- 优化 **WebDAV 数据读取逻辑**，提高与多种 *WebDAV* 服务的兼容性。

### 修复

- 修复内部扩展日志未实时更新的问题。
