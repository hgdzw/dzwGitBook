
   * 首先明白io 是什么 在java 里面就是java 和操作系统打交道的操作 也就是java 调用操作系统的api.
   * 这个阻塞是对于java 来说的 但是准确的说 是对于操作系统内核来说的 因为java 也是调用操作系统的api 比如 accept() java 进行再等待操作系统的返回.
   * 对于 BIO->NIO->多路复用 其实是系统态的提升  从开始的 accept() 阻塞的 可以变为非阻塞的 然后是将许多的链接遍历内核获取变为了批量获取(多路复用)链接的数据.

## 一 介绍
   java 对我们系统底层的IO进行了封装  我们不用关系底层是怎么操作io 的  只要做一个 API 调用师就行了  封装分为三个  BIO(同步阻塞io) NIO(同步非阻塞IO)  AIO(异步非阻塞)
   
   IO对我们来说是 input 和output，但是真正在考察的知识点是什么呢？  我觉得大概分为
   * 磁盘 IO: 很明显 Netty 不是磁盘IO 吧 这个IO 也就是我们通常和操作系统打交道的， 也是基础的范畴。 下面写的我觉得大部分还都是网络IO  
   * 网络 IO:  这个网络IO 就是 在网络间传输的 
   
   
同步和异步:
    同步: 指的是任务之间相互依赖 在A->B 模型中 b 必须等待 a执行完毕才可以执行 
    异步: 指的任务之间完全独立的 
    
阻塞和非阻塞(对于CPU来说的,java 指的就是**线程**):
   阻塞: 指的是cpu在这个时候不能处理别的请求 在这里阻塞了,就是线程在等待这个返回 不能做别的事
    非阻塞: 指的是 cpu 不用等待这个请求的返回 这个时候可以去做别的事情. 不用等待 这个返回了再回来处理 
##二 详解
### BIO(同步阻塞io):
   这个时候 请求是一个请求一个socket 也就是一个线程 多个请求就 多开了几个线程 可以使用线程池来改善. 根本原因就是accept 方法和获取客户端数据的方法是阻塞的
   缺点： 因为accept 是阻塞的 导致线程阻塞 为了不导致程序进行不下去 所以是单开线程去处理每一个链接的 所以 链接多了 线程就会多 这个时候线程就会浪费资源.
   优点: 当对于链接数不多的时候 每一个线程专注做自己的事. 其实我不觉得这是优点 从设计上这样就是有问题的 不考虑兼容以后
   ````java
    public class BioServer {
        public static void main(String[] args) throws IOException {
            // 服务端处理客户端连接请求
            ServerSocket serverSocket = new ServerSocket(3333);
            // 接收到客户端连接请求之后为每个客户端创建一个新的线程进行链路处理
            new Thread(() -> {
                while (true) {
                    try {
                        // 阻塞方法获取新的连接   这里是阻塞的 获取链接的 
                        Socket socket = serverSocket.accept();
                        // 每一个新的连接都创建一个线程，负责读取数据
                        new Thread(() -> {
                            try {
                                int len;
                                byte[] data = new byte[1024];
                                // 这里是阻塞获取输入流的
                                InputStream inputStream = socket.getInputStream();
                                // 按字节流方式读取数据
                                while ((len = inputStream.read(data)) != -1) {
                                    System.out.println(Thread.currentThread().getName()+new String(data, 0, len));
                                }
                            } catch (IOException e) {
                            }
                        }).start();
    
                    } catch (IOException e) {
                    }
    
                }
            }).start();
    
        }
    }
````
### NIO(同步非阻塞IO): 和传统io相比 他是非阻塞的 因为他有下面三个特征 所以和阻塞区分开
   英文释义有两个
        NEW IO：区分以前的io 他是一个新的io 包,里面是异步的非阻塞的包
        No-blocking io: 非阻塞io 值得是内核态的io 非阻塞的
   缓冲区(buffer): 和传统io 将数据读取 然后写入 nio 是把数据读到或者写到这个缓冲区的 
   通道(Channel): 通道是双向的，可读也可写，而流的读写是单向的。无论读写，通道只能和Buffer交互。因为 Buffer，通道可以异步地读写。
   选择器(Selecter): 这个是java 用户态的一个命令 又是IO多路复用的一个实现  一个线程管理多个 channel 是通过选择器来管理的 
   宗上所述  应该是:  一个线程 是通过选择器管理多个channel  channel 是和buffer 链接的  所以这个时候一个线程可以同时处理多个请求 在请求进行io 等待的时候处理别的请求 
    netty 是对这上面的操作的封装 
````java
public class NioServer {
    
        public static void main(String[] args) throws IOException {
            Selector serverSelector = Selector.open();
        
            //1.创建对应一个管道
            ServerSocketChannel listenerChannel = ServerSocketChannel.open();
            //2.绑定端口
            listenerChannel.socket().bind(new InetSocketAddress(3333));
            //3.设置为非阻塞
            listenerChannel.configureBlocking(false);
            //4. 将管道绑定到选择器上    结果就是 io 多路复用了 就是一个选择器监听多个管道了
            listenerChannel.register(serverSelector, SelectionKey.OP_ACCEPT);

            while (true) {
                // 5. 监测是否有新的连接，这里的1指的是阻塞的时间为 1ms
                if (serverSelector.select(1) > 0) {
                    Set<SelectionKey> set = serverSelector.selectedKeys();
                    Iterator<SelectionKey> keyIterator = set.iterator();

                    while (keyIterator.hasNext()) {
                        SelectionKey key = keyIterator.next();

                        if (key.isAcceptable()) {
                            try {
                                // (1) 每来一个新连接，不需要创建一个线程，而是直接注册到clientSelector
                                SocketChannel clientChannel = ((ServerSocketChannel) key.channel()).accept();
                                clientChannel.configureBlocking(false);
                                clientChannel.register(clientSelector, SelectionKey.OP_READ);
                            } finally {
                                keyIterator.remove();
                            }
                        }

                    }
                }
            }
        }
}
````    
### AIO(异步非阻塞): 
   虽然 NIO 在网络操作中，提供了非阻塞的方法，但是 NIO 的 IO 行为还是同步的。对于 NIO 来说，我们的业务线程是在 IO 操作准备好时，得到通知，
    接着就由这个线程自行进行 IO 操作，IO操作本身是同步的。
    
    
### Q: 多路复用器是什么,是直接执行的吗？
   在java中有一个叫做 Selecter，但是在内存态中是分为三个的 select poll 和epoll 这个是底层自己做的切换.作用是只能给你状态
   * select：内核提供一个api 可以将fds(文件描述符/后端链接)传递过来 返回哪些链接有数据 最多可以传1024 个连接大小
   * poll：想比较上面做了改进 传进来的是一个链式的 没有最大链接的限制
   * epoll: 现在最多使用的还是这个 相比较上面两个 每次传递给内核态 内核态都要遍历一遍 这个是在内核中存储一个 下次来就直接知道要遍历哪里了



    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    








