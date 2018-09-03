<template>
<div class="login">
    <div class="left-box">
        <h1 class="title title-top">次元壁纸</h1><br/>
        <h1 class="title title-bottom">管理后台</h1>
    </div>
    <div class="right-box">
        <div class="form-box">
            <div class="form-head">
                <p class="bar">用户登录</p>
                <p class="bar">用户注册</p>
            </div>
            <div class="form-login">
                <div class="form-item">
                    <label class="label" for="loginName"></label>
                    <input class="input" type="text" name="loginName" id="loginName">
                </div>

                <div class="form-item">
                    <label class="label" for="loginPsd"></label>
                    <input class="input" type="text" name="loginPsd" id="loginPsd">
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import '../css/reset.css';
    export default {
        name: 'login',
        data(){
            return {

            }
        }
    }
</script>

<style scoped lang="scss">

.login {
    font-size: 0;
    width: 100%;
    min-width: 1000px;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
    // background: url(../assets/login-bg.png) center center no-repeat;
    // 左边
    .left-box {
        display: inline-block;
        width: 50%;
        margin-top: 30%;

        .title {
            display: inline-block;
            font-size: 50px;
            color: pink;
            line-height: 2;
            opacity: 0.8;
            transition: all 0.3s linear;

            &:after {
                content: '';
                display: block;
                width: 0px;
                height: 10px;
                background: pink;
                transition: all 0.3s linear;
            }

            &:hover {
                opacity: 1;

                &:after {
                    width: 100%;
                }
            }
        }

        .title-bottom {
            padding-left: 100px;
        }
    }
    // 右边
    .right-box {
        display: inline-block;
        width: 50%;
        height: 100%;
        // 表单
        .form-box {
            width: 350px;
            margin: 100px auto 0;
            box-sizing: border-box;
            background: #fff;
            box-shadow: 0 0 10px pink;

            .form-head {
                width: 100%;
                height: 35px;
                line-height: 35px;
                display: flex;
                border: 1px solid pink;
                border-bottom: none;
                border-radius: 5px;
                .bar {
                    flex: 1;
                    text-align: center;
                    color: pink;
                    font-size: 15px;
                    border-bottom: 1px solid pink;
                }
            }

            .form-login {
                width: 100%;
                border: 1px solid pink;
                border-top: none;
                background: #fff;
            }

            .form-item {
                margin: 20px 30px;
                font-size: 0;
                border-bottom: 1px solid #eee;
                * {
                    display: inline-block;
                    vertical-align: middle;
                }

                .label {
                    width: 20%;
                    height: 35px;
                    text-align: center;
                    line-height: 35px;
                    font-size: 20px;
                    color: #999;
                    
                }

                .input {
                    width: 80%;
                    height: 35px;
                    border: none;
                }
            }
        }

    }

}
    
</style>