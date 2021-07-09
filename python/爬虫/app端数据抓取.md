

### app端的数据抓取使用到了哪些技术，会遇到哪些难点？
   主要的抓包软件分为几种 
   * Fiddler: 抓包软件
   * WireShark : 
   * Charles:
   * mitmproxy:
   * AnyProxy:
   * burpsuite:
   
   #### 部分app 无法抓包的原因
   当 APP 启用了 SSL Pinning 的时候抓包软件是无法进行抓包的。  
   安装Xposed框架+ JustTruestMe组件 可以解决： 
   [Xposed](http://forum.xda-developers.com/showthread.php?t=3034811)  
   [JustTrustMe](https://github.com/Fuzion24/JustTrustMe/releases)
   
   安装完成之后将要抓包的app 安装进 xposed 里面，然后代理到电脑抓包 看到的包 就是可以看的了。
   
   
   
### 什么是 uiautomator2 ，主要用来做什么
   uiautomator2  是一个安卓自动化UI框架，其实就是和 浏览器的 selenium 差不多。 
   
   #### 多设备抓取 
   atxserver2
   
### 防抓包
   每次携带token到服务端， 如果过期了 返回一串状态码， 在客户端通过规则生成，然后请求， 这样可以防止模拟请求。