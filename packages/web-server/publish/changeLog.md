### Improved

- Optimized the insertion position when creating a new list: when creating a new list by clicking an existing list, the new list will be inserted immediately after the target list.
- Optimized the connection logic between the front-end and back-end, and improved error messages shown on login failure.
- Docker image no longer runs the service as the root user ([#79](https://github.com/any-listen/any-listen/issues/79)).

### Fixed

- Fixed an issue where residual callbacks were not properly unregistered when observing changes to local lists.

---

### 优化

- 优化新列表创建位置，创建列表时若点击某个列表来创建新列表时，新列表将插入到目标列表位置之后
- 优化前端与后端的连接逻辑，并增强登录失败时的错误提示信息
- Docker 镜像不再以 root 用户运行服务（[#79](https://github.com/any-listen/any-listen/issues/79)）

### 修复

- 修复本地列表监听变更时的残留回调注销问题
