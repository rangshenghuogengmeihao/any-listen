### Improved

- Optimized the insertion position when creating a new list: when creating a new list by clicking on an existing list, the new list will be inserted immediately after the target list.
- Improved the **WebDAV data reading logic** to enhance compatibility with various *WebDAV* services.

### Fixed

- Fixed an issue where the update reminder did not reappear after an update was downloaded.
- Fixed an issue where residual callbacks were not properly unregistered when observing changes to local lists.
- Fixed an issue where internal extension logs did not update in real time.

---

### 优化

- 优化新列表创建位置：在通过点击已有列表创建新列表时，新列表将插入到目标列表之后。
- 优化 **WebDAV 数据读取逻辑**，提高与多种 *WebDAV* 服务的兼容性。

### 修复

- 修复更新下载完成后更新提醒未再次弹出的情况。
- 修复本地列表变更监听时残留回调未正确注销的问题。
- 修复内部扩展日志未实时更新的问题。
