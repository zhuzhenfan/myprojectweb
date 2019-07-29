var appIntroduct = new Vue({
    el:"#introduct",
    data:{
        introduct:"项目详情"
    }
})

var appTitle = new Vue({
    el:"#title",
    data:{
        title:"欢迎使用狼人sha游戏助手"
    }
})

var appUserName = new Vue({
    el:"#username",
    data:{
        user_name:localStorage.getItem("user_name")
    }
})

var appAgainConnect = new Vue({
    el:"#againConnect",
    data:{
        online:true,
        again:"检测到你有未完成的游戏=>>>>>",
        connetct:"重连"
    }
})

var appRoom = new Vue({
    el:"#room",
    data:{
        create:"创建房间",
        join:"加入房间"
    },
    methods: {
        createRoom: function(){
            setTimeout("javascript:location.href='./createGame.html'", 0); 
        }
    },
})

var appPresent = new Vue({
    el:"#present",
    data:{
        rule:"游戏规则",
        role:"角色介绍"
    }
})

var appVersion = new Vue({
    el:"#version",
    data:{
        version:"夏岚的工具箱 V1.0"
    }
})