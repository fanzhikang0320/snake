
//获取整体区域
var wrap = document.getElementsByClassName('wrap')[0];
//获取开始按钮
var startBtn = document.getElementsByClassName('start')[0];
//获取暂停按钮
var pauseBtn = document.getElementsByClassName('pause')[0];
//获取分数区域
var scoreWrap = document.getElementsByClassName('score')[0];
//获取游戏区域
var gameBox = document.getElementsByClassName('gameBox')[0];
//获取游戏区域的宽高
var gameWidth = gameBox.offsetWidth;
var gameHeight = gameBox.offsetHeight;
//定义蛇的宽高
var snakeWidth = 20;
var snakeHeight = 20;

//定义食物的宽高
var foodWidth = 20;
var foodHeight = 20;



//定义蛇的身体的坐标
var snakeBody = [[2,0,'head'],[1,0,'body'],[0,0,'body']]

//初始化分数
var score = 0;
//定时器
var timer = null;
//初始化速度
var speed = 90;
scoreWrap.innerHTML = '分数为：'+score

//定义蛇的初始化方向
// var direction = right;
//这些是用于，当向某个方向运动时，相反方向就不能按下
var left = false;
var up = true;
var down = true;

var music = './music/gameStart.mp3';

var flag = true;


//获取吃食物的音效
var eat = document.getElementsByClassName('eat')[0];
eat.pause();

//获取静音按钮
var voice = document.getElementsByClassName('voice')[0];


init();
//入口函数
bindEvent();
triggerMusic();
function init(){
    
    snake();//创建蛇
    food();//创建食物

}
//绑定事件
function bindEvent(){
    //开始游戏
    startBtn.onclick = function(){
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'block';
        //控制蛇移动
        timer = setInterval(function(){
            move('right');//移动
        },speed)
         //键盘事件
        document.onkeydown = function(e){
            var e = e || event;
            //w键87  上
            if(e.keyCode == 87){
                if(up){
                    clearInterval(timer);
                    timer = setInterval(function(){
                        move('up');
                    },speed)
                    up = false;
                    left = true;
                    right = true;
                    down = false;
                }
            }
            //s键83   下
            if(e.keyCode == 83){
                if(down){
                    clearInterval(timer);
                    timer = setInterval(function(){
                        move('down');
                    },speed)
                    up = false;
                    left = true;
                    right = true;
                    down = false;
                }
            }
            //a键65    左
            if(e.keyCode == 65){
                if(left){
                    clearInterval(timer);
                    timer = setInterval(function(){
                        move('left');
                    },speed)
                    up = true;
                    left = false;
                    right = false;
                    down = true;
                }
            }
            //D键68   右
            if(e.keyCode == 68){
                if(right){
                    clearInterval(timer);
                    timer = setInterval(function(){
                        move('right');
                    },speed)
                    up = true;
                    left = false;
                    right = false;
                    down = true;
                }
            }
        }
        music = './music/bg_Music.mp3';
        
        if(flag){
            deleteDom('gameStart');
            GameMusic(music,'bgMusic');
        }
    }
    //暂停游戏
    pauseBtn.onclick = function(){
        flag = false;
        startBtn.style.display = 'block';
        pauseBtn.style.display = 'none';
        clearInterval(timer);
    }
    //静音
    var voiceFlag = true;
    var audioDom = document.getElementsByTagName('audio');
    voice.onclick = function(){
        if(voiceFlag){
            for(var i = 0 ; i < audioDom.length ; i++){
                audioDom[i].muted = true;
            }
            voice.style.backgroundColor = 'rgb(62, 226, 62)';
            voice.innerHTML = '播放'
            voiceFlag = false;
        }else{
            for(var i = 0 ; i < audioDom.length ; i++){
                audioDom[i].muted = false;
            }
            voice.style.backgroundColor = 'rgb(112, 106, 106)';
            voice.innerHTML = '静音'
            voiceFlag = true;
        }
    }
   

}

//创建snake
function snake(){
    for(var i = 0;i < snakeBody.length ; i++){
        var snakeDiv = document.createElement('div');
        snakeDiv.style.width = snakeWidth + 'px';
        snakeDiv.style.height = snakeHeight + 'px';
        snakeDiv.style.position = 'absolute';
        snakeDiv.style.boxSizing = 'border-box';
        snakeDiv.style.left = snakeBody[i][0] * snakeWidth +'px';
        snakeDiv.style.top = snakeBody[i][1] * snakeHeight +'px';
        snakeDiv.setAttribute('class',snakeBody[i][2]);
        snakeDiv.classList.add('snake');
        gameBox.appendChild(snakeDiv);
        snakeDiv.style.border = '1px solid #000';
    }
}
//创建食物
function food(){
    //在游戏区域内生成食物随机的x,y坐标
    var maxTop = Math.floor(gameHeight / foodHeight);
    var maxLeft = Math.floor(gameWidth /foodWidth);
    foodX = Math.floor(Math.random()*maxLeft) * foodWidth;
    foodY = Math.floor(Math.random()*maxTop) * foodHeight;
    var foodDiv = document.createElement('div');
    foodDiv.style.height = foodHeight + 'px';
    foodDiv.style.width = foodWidth + 'px';
    foodDiv.style.position = 'absolute';
    foodDiv.style.borderRadius = '50%';
    foodDiv.style.backgroundColor = 'blue';
    foodDiv.style.top = foodY + 'px';
    foodDiv.style.left = foodX + 'px';
    foodDiv.style.boxSizing = 'border-box';
    foodDiv.classList.add('food');
    gameBox.appendChild(foodDiv);
}

//移动
function move(direction){
    //这一步是根据蛇头，前后交换坐标点
    for(var i = snakeBody.length - 1;i > 0;i--){
        snakeBody[i][0] = snakeBody[i - 1][0];
        snakeBody[i][1] = snakeBody[i - 1][1];
    }

    switch (direction){
        case 'up':
            snakeBody[0][1] -= 1;
            break;
        case 'down':
            snakeBody[0][1] += 1;
            break;
        case 'left':
            snakeBody[0][0] -= 1;
            break;
        case 'right':
            snakeBody[0][0] += 1;
            break;
        default:
            break;
    }
    deleteDom('snake');//清除上一次的蛇
    snake();//创建蛇
   //判断蛇是否吃到食物
    if(snakeBody[0][0] * snakeWidth == foodX && snakeBody[0][1] * snakeHeight == foodY){
        eat.play();
        deleteDom('food');
        food();
        score++;
        scoreWrap.innerHTML = '分数为：'+score
        var snakeEndX = snakeBody[snakeBody.length - 1][0];
        var snakeEndY = snakeBody[snakeBody.length - 1][0];
        switch (direction){
            case 'up':
                snakeBody.push([snakeEndX,snakeEndY - 1,'body'])    
                break;
            case 'down':
                snakeBody.push([snakeEndX,snakeEndY + 1,'body'])   
                break;
            case 'left':
                snakeBody.push([snakeEndX - 1,snakeEndY,'body'])
                break;
            case 'right':
                snakeBody.push([snakeEndX + 1,snakeEndY,'body'])
                break;
            default:
                break;
        }
    }
    //判断蛇头是否到边界
    //判断x轴边界
    if(snakeBody[0][0] < 0 || snakeBody[0][0] >= gameWidth / snakeWidth){
        // clearInterval(timer);
     
            resetGame();
        alert('Mission Failed');
    }
    //判断y轴边界
    if(snakeBody[0][1] < 0 || snakeBody[0][1] >= gameHeight / snakeHeight){
        // clearInterval(timer);
      
            resetGame();
        alert('Mission Failed');
    }
    //判断蛇头是否碰到蛇身体
    var snakeHX  = snakeBody[0][0]; //取出蛇的x坐标
    var snakeHY = snakeBody[0][1];  //取出蛇的Y坐标
    for(var i = 1; i<snakeBody.length;i++){
        if(snakeHX == snakeBody[i][0] && snakeHY ==snakeBody[i][1]){
            // clearInterval(timer);
                resetGame();
            alert('Mission Failed');
        }
    }

}
//清除蛇
function deleteDom(className){
    var ele = document.getElementsByClassName(className);
    //如果有这个snake属性名，就找到父节点，然后清除下面得这个元素
    while(ele.length > 0){
        ele[0].parentNode.removeChild(ele[0]);
    }
}
//重置游戏
function resetGame(){
    deleteDom('snake');
    deleteDom('food');
    deleteDom('bgMusic');
    music = './music/gameStart.mp3';
    GameMusic(music,'gameStart');
    clearInterval(timer);
    startBtn.style.display = 'block';
    pauseBtn.style.display = 'none';
    score = 0;
    scoreWrap.innerHTML = '分数为：'+score;
    snakeBody = [[2,0,'head'],[1,0,'body'],[0,0,'body']];
    left = false;
    up = true;
    down = true;
    flag = true;
    init();
}
//创建ifarme触发播放音乐声音

function triggerMusic(){
    var ifarme = document.createElement('iframe');
    ifarme.classList.add('perch');
    ifarme.src = './music/perch.mp3';
    ifarme.width = 0 +'px';
    ifarme.height = 0 + 'px';
    wrap.appendChild(ifarme);
    ifarme.onload = function(){
        deleteDom('perch');
        GameMusic(music,'gameStart');
    }

}
//创建背景音乐
function GameMusic(music,_class){
    var audio = document.createElement('audio');
    audio.classList.add(_class);
    audio.src = music;
    audio.loop = 'loop';
    audio.autoplay = 'autoplay';
    wrap.appendChild(audio);
}








