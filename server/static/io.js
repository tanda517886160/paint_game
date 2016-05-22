/**
 * Created by Yc on 2016/5/22.
 */
var socket = io.connect();
socket.on('server msg',function (data) {
    var ele = document.createElement('p');
    ele.innerHTML = data;
    msg.appendChild(ele);
})
socket.on('login',function () {
    socket.emit('login',prompt('输入你的姓名'));
    btnIn.in = false;
    btnIn.innerText='上场！';
    canvas.isMe = false;
    btnIn.disabled = false;
});
socket.on('paint paths',function (paths) {
    paths = JSON.parse(paths)
    if(!paths || !paths.length) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(var k in paths)
        Ctl.drawPts(ctx, paths[k]);
})
socket.on('paint pts',function (pts) {
    //canvas.paths = paths;
    pts = JSON.parse(pts)
    if(!pts) return;
    Ctl.drawPts(ctx, pts);
});
socket.on('cmd',function (data) {
    console.log(JSON.parse(data));
});
socket.on('reset in users',function (data) {
    data = JSON.parse(data);
    /*
        [
            {name: '', in:true}
        ]
     */
    users.innerHTML = '';
    data.forEach(x=>{
        users.appendChild(utils.makeUserP(x));
    });
})
socket.on('new in user',function (data) {
    users.appendChild(utils.makeUserP(JSON.parse(data)));
});
socket.on('out user',function (id) {
    var x = users.querySelector('#p'+id);
    if(x) x.outerHTML='';
})
socket.on('in',function (data) {
    users.appendChild(utils.makeUserP(JSON.parse(data)));
    users.scrollTop = users.scrollHeight;
    btnIn.in = true;
    btnIn.innerText = '下场';
});
socket.on('out',function (id) {
    var x = users.querySelector('#p'+id);
    if(x){
        x.outerHTML='';
        btnIn.in = false;
        btnIn.innerText = '上场！';
    }
});

socket.on('mytime',function (data) {
    data = JSON.parse(data);// name,word:,time
    btnIn.disabled = true;
    info.player.innerText = data.name + '(自己)';
    info.time.innerText = data.time +'s';
    info.word.innerText = data.word;
    canvas.isMe = true;
});
socket.on('othertime',function (data) {
    data = JSON.parse(data);// name,word:,time
    info.player.innerText = data.name;
    info.time.innerText = data.time +'s';
    canvas.isMe = false;
});
socket.on('update time',function (data) {
    data = JSON.parse(data);
    info.player.innerText = data.name;
    info.time.innerText = data.time +'s';
    info.word.innerText = data.word;
});
socket.on('update my time',function (data) {
    data = JSON.parse(data);
    info.time.innerText = data.time +'s';
});
socket.on('mytimeout',function (id) {
    var t = users.querySelector('#p'+id);
    if(t) t.outerHTML='';
    info.time.innerText = '时间到了！';
    canvas.isMe = false;
    btnIn.disabled = false;
    btnIn.in = false;
    btnIn.innerText = '上场！';
});
socket.on('timeout',function (d) {
    d = JSON.parse(d);
    var t = users.querySelector('#p'+d.id);
    if(t) t.outerHTML='';
    info.time.innerText = '时间到了！';
    info.word = '正确答案为：'+d.word;
});
socket.on('clear paint',function () {
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
})
utils = {
    makeUserP : function (x) {
        var p = document.createElement('p'); p.id = 'p'+x.id;
        p.innerText = x.name;
        return p;
    }
}
