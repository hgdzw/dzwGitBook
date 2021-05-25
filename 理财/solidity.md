> 以太坊世界计算机就像一台老旧的慢速计算机，可以运行简单的程序。 基于成本和安全性考虑，保持以太坊智能合约小而简单至关重要。

参考： http://www.guikeyun.com/m/news/309862.html

### 一、什么是 solidity
   是编写区块链上的合约和dapp 的一门语言  相当于传统的网站的  服务器上部署的  这个也不需要数据库了 自己就可以存储了  
   智能合约的读取在链上个免费的，但是每当更改的时候 就需要调用者支付一定的gas 费， 是以太坊虚拟机燃料费  
   
   
   
   
### 二、语法
   
   ### 变量
   声明一个变量： 类型   可见性  变量名  
   例如   ：  string public name;  
   例如  一个map ： mapping (address => uint256) private _rOwned;

   
   类型：
   * string： 字符串
   * uint8： unit  int  8 位
   * address : 我认为是一个 引用变量的样子  是一个地址类型的 
   * struct ：  结构体类型 保存数据 相当于一个表了 
   
   
   
   
   ### 函数
   声明一个函数: function  函数名(参数...) 可见性  关键字 返回值(类型)  
   例如：   function lock(string time) public view returns (address){}
   
   
   #### 全局函数/变量
   函数	                    含义  
   msg.sender 	 (address)当前调⽤发起⼈的地址  
   msg.value	 (uint)这个消息所附带的货币量，单位为wei，当使用的时候 修饰必须 payable   

   
   ### 可见性
   * public：   公开的 
   * private： 仅在当前状态使用 不能被派生合约使用
   * internal： 
   
   ### 关键字的含义
   * constant：  v4.17之前，只有constant  可以读取状态变量但是不能改；
   * view: 可以读取状态变量但是不能改；
   * pure : 不能改 也不能读状态变量
   * memory： 用在类型后面 代表值传递 
   * storage： 用在类型后面 代表引用传递
   
   ### 事件
   其实事件不是一个方法,日志功能之上的抽象。是应用程序通过eth的接口订阅和监听这些事件的。  
   创建事件: event 事件名(参数);  
   调用事件： emit  事件名;  
   当调用合约的方法 里面有事件的话 在返回的log里面可以看到的 

   ### require 
   加一个判断 判断调用者是不是合约的所属人 不用写 if else 之类的了  
   require(msg.sender  == owner());

   ### 函数 修改器  modify
   可以放在方法后面 说明在执行这个方法的时候必须先执行 函数修改器  
   一般统一用来权限验证  在 _;的时候 执行方法里面的代码  
    
   
   
   
   
   
### 和线上智能合约交互
   
   #### 通过web3.js 交互
   需要知道线上合约的 ABI 和线上合约的 id 来操作 
   ```javascript
   const Web3 = require('web3');
   const web3 = new Web3('http://192.168.75.129:8545');
   const abi = []
   //部署到链上的合约的地址
   const address = '0xd573A1f062751A4f947f1769B5D78c1815420bf9';
   //通过new web3.eth.Contract(abi, address)动态创建一个合约实例
   let MyContract = new web3.eth.Contract(abi, address);
   //getEthBalance方法是合约中的方法，methods为调取合约方法的内置方法
   MyContract.methods.getEthBalance('0x88ded3010c9e9b2b2d1914b07c0d674281952d19').call().then(console.log);
```

   #### 通过java 交互 
   
   #### 通过智能合约和链上交互 
   
   #### 通过python 调用合约 tronpy
   通过 tronpy 可以和合约交互  
   通过web3 和 合约交互  文档：https://web3py.readthedocs.io/en/stable/quickstart.html#quickstart 
     
   
   
   
### 需求：

   #### 创建一个合约 调用其他的智能合约
   

   #### 创建合约 提供一个 空投的功能
    
   
   #### 批量创建合约 包括用户名 密码 私钥
   https://cointool.catxs.com/eth/createWallet
   
   