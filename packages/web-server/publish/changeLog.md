### Improved

- Optimized the insertion position when creating a new list: when creating a new list by clicking an existing list, the new list will be inserted immediately after the target list.
- Optimized the connection logic between the front-end and back-end, and improved error messages shown on login failure.
- Docker image no longer runs the service as the root user ([#79](https://github.com/any-listen/any-listen/issues/79)).
- Improved the **WebDAV data reading logic** to enhance compatibility with various *WebDAV* services.

### Fixed

- Fixed an issue where residual callbacks were not properly unregistered when observing changes to local lists.

---

### 优化

- 优化新列表创建位置：在通过点击已有列表创建新列表时，新列表将插入到目标列表之后。
- 优化 **前端与后端的连接逻辑**，并提升登录失败时的错误提示信息。
- Docker 镜像不再以 **root** 用户运行服务（[#79](https://github.com/any-listen/any-listen/issues/79)）。
- 优化 **WebDAV 数据读取逻辑**，提高与多种 *WebDAV* 服务的兼容性。

### 修复

- 修复本地列表变更监听时残留回调未正确注销的问题。
