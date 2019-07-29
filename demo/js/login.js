var appLogin = new Vue({
    el: "#login",
    data: {
        user_name: '',
        pass_word: ''
    },
    methods: {
        getToken: function () {
            this.$http({
                method: "POST",
                url: "http://127.0.0.1:21853/wolfkill/user/token",
                body: { user_name: this.user_name, pass_word: this.pass_word }
            }).then(function (response) {
                // 通过 result.body 拿到服务器返回的成功的数据
                var res = JSON.parse(response.body)
                if (res.code===200){
                    localStorage.setItem("user_id",res.data.user_id)
                    localStorage.setItem("user_name",res.data.user_name)
                    localStorage.setItem("token","Bearer " + res.data.token)
                    setTimeout("javascript:location.href='./index.html'", 0);                                     
                }
            },function (response){
                var res = JSON.parse(response.body)
                alert(res.msg)
            })
        }
    }
})
