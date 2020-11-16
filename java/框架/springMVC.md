
### 1.什么是spring mvc 这个框架是用来干嘛的？
   这是一个基于web的MVC开发模式 抽象出来的一个请求驱动类型的框架. 将我们的 Model View Controller分离.
   
### 2. spring mvc 的原理是什么？ 工作流程是什么？
   spring mvc 其实也是一个Servlet,它的顶层还是继承了Servlet 但是对过来的请求进行了优化和一系列的处理.  
   
![image](../image/spring%20mvc%20运行流程.png)
   1.请求到达 dispatchServlet, 调用HandlerMapper 解析对应的handler   
   2.解析到了handler 也就是常说的controller 控制器 然后交给 handlerAdepter适配器处理  
   3.handleradepter 会根据 handler 调用(.handler方法)对应的处理器来处理请求 返回一个mv(modelandview)
   
#### Q: 为什么请求会执行到DispatchServlet 的doDispatch?
   首先 看继承链 可以看到 最上面是继承 servlet 肯定会执行他的service 而 FrameworkServlet 的service 实现了 执行  processRequest 然后看到doService DispatchServelet 实现了  
   这个方法里面是  doDispatch 这就到这个方法了 

#### Q: 什么是 handlerMapping 和 HandlerAdapter 有啥用？
   
#### Q: handlerMapping 的实现方式,最常用的是哪种?
   断点可以看到 有五种实现方式 最常用的是 RequestMappingHandlerMapping 这个就是我们常用的@RequestMapping 注解注册的mapping 

#### Q: HandlerAdapter 有几种 常用的是哪一种？
   断点可以看到有三种  常用的是RequestMappingHandlerAdapter  就是加@Controller 这个注解的

#### Q: HandlerAdapter和 handlerMapping 什么时候初始化的？
   首先继承链中 继承servlet 肯定会先执行 init 方法 跟踪可得 执行FrameworkServlet类的 initServletBean 方法 最后进行初始化 ioc 容器
