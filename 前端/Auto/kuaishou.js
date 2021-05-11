
let kuaishou = {//快手快捷版
    run: function (runTimes) {
        toast('这是一个快手刷视频脚本,1s之后打开APP');
        sleep(1000);
        var launchResult = app.launchApp("快手极速版");//app.launchApp("com.kuaishou.nebula");
        if (!launchResult) {
            toast('你还没有安装快手极速版！');
            sleep(1000)
            return;
        }
        toast('等待软件打开，3s之后进入下个动作！');
        sleep(3000);
        var sleepTime = 10;
        // 统计运行次数
        var flagTime = 0;
        while (true) {
            flagTime++;
            // 超过次数终止程序
            if (flagTime > runTimes) {
                break;
            }
            sleepTime = randNum(5, 20);
            toast(sleepTime.toString() + 's之后跳到下个视频！已经执行 ' + flagTime.toString() + "次");
            sleep(sleepTime * 1000);
            nextVideo();
        }
        home();
        sleep(1000);

        function nextVideo() {
            //获得手机分辨率
            var width = device.width;
            var height = device.height;
            swipe(width / 2, height / 2, width / 2, height / 3, 10);
        };
        //获取范围内的随机数
        function randNum(minnum, maxnum) {
            return Math.floor(minnum + Math.random() * (maxnum - minnum));
        };
    }
};




function fastClick() {
    var i = 1200
    toast(device.width + ' ' + device.height);
    while (i > 0) {
        press(540, 960, 1);
        sleep(2)
        i--;
    }
}

var isRedmi = true

function main() {
    home();
    sleep(3000);
    var i = 10;//程序在各个app之间循环的次数
    while (i > 0) {
        kuaishou.run(100)//参数为每次循环刷动的次数
        i--;
    }
        douyin.run(10000)//参数为每次循环刷动的次数
    qkk.open()//打开趣看看短视频
        .article(50, 10)//阅读文章数，每篇文章滑动次数
        .video(1000)//看的短视频数量
};

main();

