var appGameParam = new Vue({
    el: "#gameParam",
    data: {
        title: "创建房间",
        playerNumStr: "人数:",
        playerNum: 1,
        passWordStr: "房间密码:",
        passWord: "",
        goodMan: "好人:",
        wolfMan: "狼人:",
        otherMan: "其他:",
        goodManNum: 0,
        wolfManNum: 0,
        otherManNum: 0,
        villagerNum: 0,
        wolfNum: 0,
        villager: {},
        wolf: {},
        villagerType: "good_man",
        wolfType: "bad",
        roleList: [],
        roleTypes: {
            other: "other",
            good_man: "good_man",
            good_god: "good_god",
            bad: "bad",
            bad_god: "bad_god",
            unkown: "unkown"
        },
        // roleTypes:new Map([['other', ""], ['good_man', ""], ['good_god', ""],["bad", ""],["bad_god",""],["unkown",""]])
        roleSelectMap: new Map()
    },
    methods: {
        changeGodMan(role_type, role_id) {
            if (role_type === "") {
                return
            }
            var isAdd = this.roleSelectMap.get(role_id)
            if (!isAdd === true) {
                this.addGodMan(role_type)
            }
            if (!isAdd === false) {
                this.lessGodMan(role_type)
            }
            this.roleSelectMap.set(role_id, !isAdd)
        },
        addGoodMan: function () {
            this.goodManNum++;
            this.villagerNum++;
        },
        addWolfMan: function () {
            this.wolfManNum++;
            this.wolfNum++;
        },
        lessGoodMan: function () {
            if (this.goodManNum > 0) {
                this.goodManNum--;
            }
            if (this.villagerNum > 0) {
                this.villagerNum--;
            }
        },
        lessWolfMan: function () {
            if (this.wolfManNum > 0) {
                this.wolfManNum--;
            }
            if (this.wolfNum > 0) {
                this.wolfNum--;
            }
        },
        addGodMan: function (role_type, role_id) {
            if (role_type === this.roleTypes.good_man || role_type === this.roleTypes.good_god) {
                this.goodManNum++;
                return
            }
            if (role_type === this.roleTypes.bad || role_type === this.roleTypes.bad_god) {
                this.wolfManNum++;
                return
            }
            this.otherManNum++
            return
        },
        lessGodMan: function (role_type, role_id) {
            if (role_type == this.roleTypes.good_man || role_type == this.roleTypes.good_god) {
                if (this.goodManNum > 0) {
                    this.goodManNum--;
                }
                return
            }
            if (role_type == this.roleTypes.bad || role_type == this.roleTypes.bad_god) {
                if (this.badManNum > 0) {
                    this.badManNum--;
                }
                return
            }
            if (this.otherManNum > 0) {
                this.otherManNum--;
            }
            return
        },
        createGame: function () {
            var roleIds = []
            for (var key of this.roleSelectMap) { // 遍历Map
                if (key[1] === true) {
                    roleIds.push(key[0])
                }
            }
            for (i = 0; i < this.villagerNum; i++) {
                roleIds.push(this.villager.role_id)
            }

            for (i = 0; i < this.wolfNum; i++) {
                roleIds.push(this.wolf.role_id)
            }

            alert(roleIds)

            var self = this;
            self.$http({
                method: "POST",
                url: "http://127.0.0.1:21853/wolfkill/game",
                headers: {
                    authorization: 'Bearer ' + localStorage.getItem("token")
                },
                body: {
                    user_id: localStorage.getItem("user_id"),
                    room_owner: localStorage.getItem("user_id"),
                    room_pass_word: this.passWord,
                    role_ids: roleIds
                }
            }).then(function (response) {
                var res = JSON.parse(response.body)
                localStorage.setItem("playerRole", "master")
                localStorage.setItem("room_id", res.data.room_id)
                localStorage.setItem("room_code", res.data.room_code)
                this.gotoRoom(res.data.room_id)
            }, function (response) {
                var res = JSON.parse(response.body)
                alert(res.msg)
            }
            )
        },
        gotoRoom: function (room_id) {
            // setTimeout("javascript:location.href='./game.html?name=1'", 0);
            var url = './game.html?room_id=' + room_id;
            url = encodeURI(url);
            // window.open(url, "", "width=600,height=400");
            window.open(url, "_self");
        }
    },
    created: function () {
        this.$http({
            method: "POST",
            url: "http://127.0.0.1:21853/wolfkill/roles",
            headers: {
                authorization: 'Bearer ' + localStorage.getItem("token")
            },
            body: { page: 1, perpage: -1, role_type: "", user_id: localStorage.getItem("user_id") }
        }).then(function (response) {
            var res = JSON.parse(response.body)
            // var good,bad = []
            for (i = 0; i < res.data.result.length; i++) {
                var obj = {
                    role_id: res.data.result[i].role_id,
                    role_type: res.data.result[i].role_type,
                    role_china_name: res.data.result[i].role_china_name
                }
                if (obj.role_type === this.villagerType) {
                    this.villager = obj
                    continue
                }
                if (obj.role_type === this.wolfType) {
                    this.wolf = obj
                    continue
                }
                this.roleList.push(obj)
                this.roleSelectMap.set(res.data.result[i].role_id, false)
            }
            for (i = 0; i < 3; i++) {
                var obj = {
                    role_id: i,
                    role_type: "",
                    role_china_name: ""
                }
                this.roleList.push(obj)
            }
            alert(JSON.stringify(this.roleList))
        }, function (response) {
            var res = JSON.parse(response.body)
            alert(res.data)
        })
    }
})
