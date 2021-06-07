> https://blog.csdn.net/weixin_43236610/article/details/82866518

### vue 基础
   Vue 是单页面形式开发,所有组件(后缀名是.vue) 都会通过index.html 文件进行渲染  
   每个 Vue 应用都需要通过实例化 Vue 来实现。  
   vue 是一个只关注视图,一个自底向上的,是一个通过模板语法将数据渲染进dom的框架(双向绑定)
   
   ##### 结构
   ![image](image/vue项目结构.png)  
   * main.js: 入口文件,主要是引入vue框架，根组件及路由设置，并且定义vue实例。
   * route: 这个下面的index.js routes定义了路径为'/'的路由
   * package.json： 定义项目的各种模块, 相当于 pom文件
   * node_moudules:  这里面是通过 package.json 这个里面的依赖将这些下载下来放在这里, 然后项目里面就可以引用了
   * App.vue: 一个主vue的界面 包含三个主要区域
        - template 
          其中模板只能包含一个父节点，<router-view/>为<router-view></router-view>的简写，是子路由视图，后面的路由页面都显示在此处。
        - script
          vue通常用es6来写，用export default导出，其下面可以包含数据data，生命周期(mounted等)，方法(methods)等。
        - style
          样式通过style标签<style></style>包裹，默认是影响全局的，如需定义作用域只在该组件下起作用，需在标签上加scoped，<style scoped></style>
    
   一个vue的结构如下
   ```javascript
           Vue.use();      //vue 在使用别人的组件的时候 就通过这个引用
       // 在template 中使用 {{ msg }}  其中可以用 js 表达式 
   
       var vm = new Vue({
           el: '#app',    // 控制区域
           data: { },    // 定义数据
           data() {      // 如果是一个组件的话 data 选项必须是一个函数  是通过return 和数据相关联的  
                   return {
                       tagsList: [],
                       collapse: false
                   };
               },   
           methods: { },    // 定义事件方法
           filters: { },    // 定义私有的过滤器
           directives: { },    // 定义私有的指令
           components: { },    // 定义实例内部私有的组件
           watch:{ },    // 监听值的变化，然后执行相对应的函数（或者步骤）
           beforeCreate() { },    // 实例刚在内存中被创建出来，还没初始化好 data 和 methods 属性之前调用此函数
           created() { },    // 实例已经在内存中创建完成，此时 data 和 methods 属性初始化完成，页面（HTML）加载完成之前（未开始编译模板）调用此函数。执行顺序：父组件 -> 子组件
           beforeMount() { },    // 此时已经完成了模板的编译，但是还没有挂载到页面中，在挂载开始之前调用此函数
           mounted() { },    // 此时已经将编译好的模板，挂载到了页面指定的容器中显示。页面（HTML）加载完成之后调用此函数。执行顺序：子组件 -> 父组件
           beforeUpdate() { },    // 状态更新之前调用此函数，此时 data 中的状态值是最新的，但是界面上显示的数据还是旧的，因为此时还没有开始重新渲染 DOM 节点
           updated() { },    // 状态更新完成之后调用此函数，此时 data 中的状态值和界面上显示的数据，都已经完成了更新，界面已经被重新渲染好了
           beforeDestroy() { },    // 实例销毁之前调用此函数。在这一步，实例仍然完全可用
           destroyed() { },    // 实例销毁后调用此函数。该钩子被调用后，对应 Vue 实例的所有指令都被解绑，所有的事件监听器被移除，所有的子实例也都被销毁
   
       })
       
   ```

   ##### 指令
   我们将< 里面放的vue 通用格式是 **指令:参数**， 自定义方法称为指令常用的指令有
   ```text
        <p v-if="seen">现在你看到我了</p>   //可以 通过判断语句   简写形式 
        
        # v-bind 动态的绑定一个或者多个属性 比如用在引入的组件里面用来传别的值 <el-color :xl="12" > 
        # 这里 xl = 12 就是用传过去的参数(xl是要在 prop 里面声明的)  这里也可以写变量 在data 里面定义一下就可以 这样变量变了 传递过去的值也会动态变得
        <!-- 完整语法 -->
        <a v-bind:href="url">...</a>
        <!-- 缩写 -->
        <a :href="url">...</a>
    
        # v-on： 用来监听DOM事件  比如 <button @click="method()"> 后面可以跟方法 这样点击的时候 就会直接调用这个方法  这里的click 也可以在组件里面声明
        <!-- 完整语法 -->
        <a v-on:click="doSomething">...</a>
        <!-- 缩写 -->
        <a @click="doSomething">...</a>
```
   用户也可以自定义指令，也有全局注册 和局部注册 使用的时候还是用 v-指令名




   ##### vue 组件(重要)
   因为组件是 **可复用的 Vue 实例**，所以它们与 new Vue 接收相同的选项，可以接受methods，created 等函数  
   像这种<span></span>  span 就属于组件，在vue中 我们可以自己定义自己的组件，首先 我们要先定义它，定义的方法有两种
   * 全局定义: Vue.component('my-component-name', {  
             // ... 选项 ...  
           })   
           这样在整个项目中我们都可以用 <my-component-name></my-component-name> 来使用它
   * 局部定义： 当我们使用的时候并不是很通用 我们就可以在某一个文件中来将它注册成组件  
            在A 文件中将它作为一个组件导出，然后在其中的地方用  
            
            import ComponentA from './ComponentA.vue'
            export default {
              components: {
                ComponentA
              },
              // ...
            }
   
   当我们在当前这个页面用不是全局的时候 是要先 import 引入 在 components 里面添加这个组件 然后就可以直接 <名字 用了 
   
   #### 路由
   
   
   
   #### 对template 的代码进行渲染
   首先在template中的变量都会在 data 中进行声明 然后在别的生命周期或者方法中对这个 数据进行赋值，我们一般采用  
   1. this.变量名 = : 进行赋值
   2. this.$set() : 对list 进行设置
   
   #### 复用代码
   在日常的java 开发中 有一些共用的方法是抽取到一个utils 的文件夹下面的类中, 而前段中的方法也是会抽取到一个js 中的 这样用的时候直接引用就可以了.  
   在共用的方法中 用 export function 方法名(){} 引用进来就可以直接用了。  

   
   #### 启动流程
   1. 首先 npm  install  在路径下查找 package.json 这个文件 这个类似于 pom文件 将里面依赖的全都加载到 node_moudules 这个文件夹
   2. 执行 npm run dev  (这个其实是在package.json 中的scripts 配置的简写命令)
   3. 将 main.js 中的初次启动vue要加载的组件和vue 实例都创建了 
   4. 当访问/ 的时候 会自动给路由到 index.html 中
   

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
   模块是独立的文件，该文件内部的所有的变量外部都无法获取。如果希望获取某个变量，必须通过export输出 其实就是作为一个组件来输出了  
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