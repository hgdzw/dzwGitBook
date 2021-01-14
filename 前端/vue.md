

### vue 基础
   每个 Vue 应用都需要通过实例化 Vue 来实现。
   ```js
    var vm = new Vue({
        
     // 选项
    })
   ```
   ##### vue 语法
   函数 方法 

   

   ##### vue 组件

   

   

//es6 以及以后支持   这是模块化
#### import from 
   ```js
    // import会加载且仅加载一次导入的模块
    import Vue from 'vue';
    //等同于 
    import Vue from "../node_modules/vue/dist/vue.js";
    // 导入 Vue  来自 后面那个路径  如果没加具体路径 默认在 node_modules中查找
    // 这个.vue 后缀省略   .js、.vue、.less 都可以直接省略
    
    //当export 不是default 的时候 要加 {} 才能获取到
    import { Vue } from 'vue';
   ```
#### export 
   模块是独立的文件，该文件内部的所有的变量外部都无法获取。如果希望获取某个变量，必须通过export输出
   ```js
    //命名式导出  导入的时候 要以 {}  导入
    export { name1, name2, nameN };
    export let name1, name2,  nameN; // also var
    export let name1 = 1, name2 = 2, nameN = 3 ; // also var, const
    
    //默认导出  导入的时候可以随意起名字 不用加{}
    const str = "export default的内容";
    export default str  
    //这个时候可以  import StringName from xx
   ```