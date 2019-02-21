## 音乐播放器（dva -- antd-mobile）

> 功能：
    
    - 发现
    - 我的
      - 列表
      - 播放界面
    - 消息
    - 帐号

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

>访问：http://localhost:8000/#/discover

> MP3文件计算公式：编码率(kbps)×歌曲全长(秒)/8=文件大小(kB)

> 跨域：fetch 带cookie跨域访问 {credentials: "include"}

> 新版本：获取歌曲url：song/url?id=xxxxx
