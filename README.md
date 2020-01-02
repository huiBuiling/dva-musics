## 音乐播放器（dva -- antd-mobile）

- 非常感谢提供的音乐接口（仅供学习使用，如有侵权请联系）https://binaryify.github.io/NeteaseCloudMusicApi/#/?id=neteasecloudmusicapi
- 下载运行：
    1. git clone https://github.com/Binaryify/NeteaseCloudMusicApi.git
    2. set port=3636 && node app.js

- 启动：npm start

- 访问：http://localhost:8000/#/admin (建议启动手机模式查看，同时登录才可以查看哦）

- 近期运行若发现报错解决如下
    1. warning：Please use `require("history").createHashHistory` instead of ......

        ```
            解决：node_modules/dva/lib/index.js:
                 改为：var _createHashHistory = _interopRequireDefault(require("history").createHashHistory);
        ```

    2. Cannot find module "@babel/runtime/helpers/esm/extends"，已调整，不需要再更改

    ```
        package.json:
            "roadhog": "^2.0.0" -> "roadhog": "^2.5.0-beta.4",
    ```

> 已实现功能：

    1. 发现：
        - 个性推荐：
            - 每日推荐
            - 推荐动态：
                - 视频，音乐播放

        - 主播电台：
            - 推荐电台
            - 已关注电台
            - 电台详情|电台节目 （获取评论，订阅，播放单曲及全部播放）

    2. 音乐
        - 创建的歌单和收藏歌单
        - 歌单对应歌曲列表（播放单曲及全部播放）
        - 歌曲播放页（换肤：仅支持播放页，喜欢歌曲，切换歌曲，控制音量及播放进度，播放列表查看）

    3. 动态
        - 获取全部动态及已关注人的动态（目前控制10条内）
        - 类型：歌曲，视频，评论
        - 详情：查看评论，发表评论，评论点赞（由于接口未提供动态评论，此时获取的是对应资源的评论）

    4. 账户
        - 登录
        - 基础信息
        - 登录

> 动画
  ```
  npm install animate.css --save
  https://daneden.github.io/animate.css/
  https://github.com/daneden/animate.css
  ```

> isomorphic-fetch:https://github.com/matthew-andrews/isomorphic-fetch
  ```
  npm install --save isomorphic-fetch es6-promise
  import es6 from 'es6-promise';
  es6.polyfill();
  
  use:
    import feach from 'isomorphic-fetch';
  ```

> MP3文件计算公式：编码率(kbps)×歌曲全长(秒)/8=文件大小(kB)

> 跨域：fetch 带cookie跨域访问 {credentials: "include"}

> 新版本：获取歌曲url：song/url?id=xxxxx

> 发现调取某些接口成功后可能数据稍有延迟

> react-sticky ：TabBar sticky
  https://www.npmjs.com/package/react-sticky

- emmmmmm，还有很多功能未做，由于部分原因，先暂停一段时间，哈哈哈哈哈

> 效果图

![image](https://github.com/huiBuiling/dva-musics/blob/master/resultImg/%E5%B8%90%E5%8F%B7.png)
