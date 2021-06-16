# 一个手机上面的键盘精灵  通过auto js这个软件可以在手机上面操作

### 一、编写代码环境
   1. 首先手机上面需要安装 auto js
   2. 在电脑上面安装vscode 插件 Auto.js-VSCodeExt
   3. 启动插件服务： ctrl + shift + p  选择 输入 auto.js:start server
   4. 手机电脑处于同一局域网 手机连接电脑
   5. 执行代码 ctrl + shift + p 选择  auto.js:run on dervice
   
   参考:https://www.cnblogs.com/sweetC/p/11807280.html

### 二、语法
   首先在vscode 中新建一个 js文件 在里面写代码 然后运行就行
   
   #### 2.1 应用类
   ```text
   //启动app
   app.launchPackage("com.eg.android.AlipayGphone");

```
   
   #### 2.1 弹出消息类
   ```text
   toast("s之后跳到下个视频！已经执行 ");

```

   #### 2.1 寻找坐标
   手机可以在  开发者选项-> 开启"指针位置" 可以直接获取指针位置了
   
   ```text
   //根据文字找第一个坐标
   var res = className("android.widget.TextView").text("京东活动").findOne();
   click(res.bounds().centerX(), res.bounds().centerY())
   
   //根据文字找第一个坐标很多个的坐标
   var res = className("android.widget.TextView").text("京东活动").find();
   if(!res.empty()){                
       res.forEach(function(item){   // 依次点击
           click(item.bounds().centerX(), item.bounds().centerY());
       });
       return MP_valid;
   }
   
   //根据某个图标来找坐标
   
```

   #### 2.1 点击滑动操作
   ```test
   //根据坐标点点击
   click(x,y)
   
   //长按
   press(x, y, 毫秒值)

   //滑动
   swipe(x1, y1, x2, y2, 毫秒值)
   
   //模拟手势操作
   gesture(毫秒值, [x1, y1], [x2, y2], …)

```
   
   #### 2.1 文件操作 files
   ```text
   

```

