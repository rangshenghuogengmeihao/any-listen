# Any Listen

[English](README.md) | [中文](README_zh.md)

一个跨平台的私人歌曲播放服务。

注意：项目仍在积极开发中，目前仅提供网页版服务。您可以直接部署到服务器上或使用 Docker。

## 使用方法

### Docker 部署

[https://hub.docker.com/r/lyswhut/any-listen-web-server](https://hub.docker.com/r/lyswhut/any-listen-web-server)

### 直接部署

下载最新的版本，解压到相应目录：[https://github.com/any-listen/any-listen-web-server/releases](https://github.com/any-listen/any-listen-web-server/releases)

参考 [https://github.com/lyswhut/lx-music-sync-server?tab=readme-ov-file](https://github.com/lyswhut/lx-music-sync-server?tab=readme-ov-file) 的使用方式，配置文件看下面

---

**使用示例**：

1. 创建配置文件 `data/config.cjs`

```js
const config = {
  // port: '9500', // 绑定端口
  // bindIp: '127.0.0.1', // 绑定IP
  // httpLog: true, // 是否启用HTTP请求日志
  // 'cors.enabled': false, // 是否启用跨域
  // 'cors.whitelist': [ // 允许跨域的域名，空数组表示允许所有域名
  //   // 'www.xxx.com',
  // ],
  // 'upstreamProxy.enabled': false, // 是否使用代理转发请求
  // 'upstreamProxy.header': '', // 代理转发请求头（如 `x-real-ip`）
  // 'extension.ghMirrorHosts': [], // 扩展商店 Github 镜像地址

  // 允许访问的本地目录
  // allowPublicDir: ['G:', 'E:\\music'], // Windows 示例
  // allowPublicDir: ['/music'], // Linux 示例
  password: '123456a', // 登录密码
}

module.exports = config
```

2. 运行 Docker 容器

**注意：以下命令只是例子，并不能直接使用！**
```bash
docker run --volume=/home/music:/music --volume=/data:/server/data -p 8080:9500 -d test:latest
```

环境变量说明

| 变量名                      | 描述                                                                                |
| --------------------------- | ----------------------------------------------------------------------------------- |
| `PORT`                      | 绑定端口，默认 `9500`                                                               |
| `BIND_IP`                   | 绑定IP，默认 `127.0.0.1`，设为 `0.0.0.0` 接受所有IPv4请求，设为 `::` 接受所有IP请求 |
| `UPSTREAM_PROXY_HEADER`     | 代理转发请求头（如 `x-real-ip`），设置后自动启用代理                                |
| `ALLOW_PUBLIC_DIR`          | 允许访问的本地目录，多个目录用英文逗号分隔                                          |
| `DATA_PATH`                 | 数据存储路径，默认 `./data`                                                         |
| `LOGIN_PWD`                 | 登录密码                                                                            |
| `CONFIG_PATH`               | 配置文件路径，默认 `./data/config.js`                                               |
| `LOG_PATH`                  | 日志存储路径，默认 `./data/logs`                                                    |
| `EXTENSION_GH_MIRROR_HOSTS` | 扩展商店 Github 镜像地址，多个地址使用英文逗号分隔                                  |

### 源码编译

```bash
pnpm install
pnpm run build:web
cd build
mkdir data
# 创建配置文件 config.cjs
node index.cjs
```

## 许可证

本项目基于 Affero 通用公共许可证 (AGPL) v3.0，附加条款如下：

- 禁止商业使用（除非获得原作者书面授权）
- 完整条款请参阅 [LICENSE 文件](LICENSE)
