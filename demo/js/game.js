var childcom = {
    data: function () {
        return {
            roomId: "",
            isOpen: false,
            openStr: "展开",
            closeStr: "收起",
            buttonName: "展开",
            userListOne: [],
            userListTwo: [],
        }
    },
    template: `
    <div style="border: 1px solid #999;width: calc(100% - 2px);height: calc(100% - 2px);">
        <div style="width: calc(100% - 2px);height: calc(80% - 2px);">
            <template v-for="item in userListOne">
                <div style="border: 1px solid #999;width: calc(25% - 2px);height: calc(100% - 2px);float: left;">
                    {{item.role_china_name}}
                </div>
            </template>

            <template v-if="isOpen">
                 <template v-for="item in userListTwo">
                    <div style="border: 1px solid #999;width: calc(25% - 2px);height: calc(100% - 2px);float: left;background-color: yellow;">
                        {{item.role_china_name}}
                    </div>
                </template>
            </template>
        </div>
        <div style="width: calc(100% - 2px);height: calc(10% - 2px);">
            <button style="display: block;margin: 0 auto;" v-on:click="isOpenFunc()">{{buttonName}}</button>
        </div>
    </div>
    `,
    methods: {
        isOpenFunc() {
            this.isOpen = !this.isOpen
            if (this.isOpen === true) {
                this.getUserAndRole(this.roomId)
                this.buttonName = this.closeStr
            }
            if (this.isOpen === false) {
                this.buttonName = this.openStr
            }
        },
        getUserAndRole(roomId) {
            this.$http({
                method: "GET",
                url: "http://127.0.0.1:21853/wolfkill/game",
                headers: {
                    authorization: 'Bearer ' + localStorage.getItem("token")
                },
                params: {
                    "room_id": roomId
                },
            }).then(function (response) {
                var res = JSON.parse(response.body)
                var i = 0
                this.userListOne.splice(0, this.userListOne.length)
                this.userListTwo.splice(0, this.userListTwo.length)
                for (var val of res.data) {
                    if (i < 4) {
                        i++
                        this.userListOne.push(val)
                    } else {
                        this.userListTwo.push(val)
                    }
                }

                if (this.userListTwo.length % 4 != 0) {
                    var len = this.userListTwo.length % 4
                    for (i = 0; i < len + 12; i++) {
                        this.userListTwo.push({
                            role_china_name: "",
                            user_name: ""
                        })
                    }
                }
            },
                function (response) {
                    var res = JSON.parse(response.body)
                    alert(res.msg)
                }
            )
        },
    },
    created: function () {
        var url = decodeURI(window.location.href);
        var argsIndex = url.split("?room_id=");
        this.roomId = argsIndex[1];
        if (this.roomId === "") {
            this.roomId = localStorage.getItem("room_id")
            if (this.roomId === "") {
                alert("房间id创建异常")
                return
            }
        }
        this.getUserAndRole(this.roomId)
    },
}

var appGame = new Vue({
    el: "#game",
    data: {
        isMaster: true,
        roomId: "",
        roomCode: "",
        roomCodeStr:"房间号：",

        status : "",
        statusWait: "waiting",
        statusGaming: "gaming",
        statusOver: "over",

        statusStr: "",
        statusWaitStr:"等待中",
        statusGamingStr:"游戏中",
        statusOverStr:"已结束",

        gameOpBtn:"",
        gotoRoomStr:"回到房间",
        startGameStr:"开始游戏",
        endGameStr:"结束游戏",
    },
    methods: {
        //通过html传参有实时响应的bug
        updateRoom: function () {
            var self = this
            self.$http({
                method: "PUT",
                url: "http://127.0.0.1:21853/wolfkill/game/status",
                headers: {
                    authorization: 'Bearer ' + localStorage.getItem("token")
                },
                body: {
                    room_game_status: this.status,
                    room_id: this.roomId,
                }
            }).then(function (response) {
                // 应该去后端获取   不然数据不准确

                // 回到房间
                if(this.status === this.statusWait){
                    this.statusStr = this.statusWaitStr
                    this.status = this.statusGaming
                    this.gameOpBtn = this.startGameStr
                    return
                }

                // 开始游戏
                if(this.status === this.statusGaming){
                    this.statusStr = this.statusGamingStr
                    // 去下一个状态做传参和展示
                    this.status = this.statusOver
                    this.gameOpBtn = this.endGameStr
                    return
                }
                
                // 结束游戏
                if(this.status === this.statusOver){
                    this.statusStr = this.statusOverStr
                    this.status = this.statusWait
                    this.gameOpBtn = this.gotoRoomStr
                    return
                }

            }, function (response) {
                var res = JSON.parse(response.body)
                alert(res.msg)
            })
        },
        endGameFunc:function(){

        },
        startGameFunc:function(){

        },
        gotoRoomFunc:function(){

        },
    },
    components: {
        'com-btn': childcom,//调用这个组件
    },
    created: function () {
        this.roomId = localStorage.getItem("room_id")
        if (this.roomId === "") {
            alert("房间id创建异常")
            return
        }
        this.roomCode = localStorage.getItem("room_code")
        if (this.roomCode === ""){
            alert("房间号码为空")
            return
        }
        var self = this
        self.$http({
            method:"GET",
            url:"http://127.0.0.1:21853/wolfkill/room",
            headers: {
                authorization: 'Bearer ' + localStorage.getItem("token")
            },
            params:{
                room_id: this.roomId
                // room_id:tihs.roomId  这里的this指针搞事情
            }
        }).then(function(response){
            var res = JSON.parse(response.body)
            this.statusStr = res.data.room_game_status
            if(this.statusStr === this.statusWaitStr){
                // 去下一个状态做传参和展示
                this.status = this.statusGaming
                this.gameOpBtn = this.startGameStr
            }
            if(this.statusStr === this.statusGamingStr){
                this.status = this.statusOver
                this.gameOpBtn = this.endGameStr
            }
            if(this.statusStr === this.statusOverStr){
                this.status = this.statusWait
                this.gameOpBtn = this.gotoRoomStr
            }
        },function(response){
            var res = JSON.parse(response.body)
            alert(res.msg)
        })
    },
})
