<template>
	<el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="80px" label-position="left" class="demo-ruleForm">
  <h3 class="title">系统登录</h3>
  <el-form-item label="用户名" prop="user">
    <el-input type="text" v-model="loginForm.user" auto-complete="off"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input type="password" v-model="loginForm.password" auto-complete="off"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitForm('loginForm')" :loading="loading" :disabled='disabled'>登录</el-button>
    <el-button @click="resetForm('loginForm')" :disabled='disabled'>重置</el-button>
  </el-form-item>
</el-form>
</template>

<script type='text/ecmascript-6'>
import axios from 'axios';
import {requestLogin,checkLogin} from '@/api/api'
	export default {
    created(){
      //this.loading=false;
      //console.log(this.$route.params.name);
    },
    data() {
      var checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('年龄不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
          } else {
            if (value < 18) {
              callback(new Error('必须年满18岁'));
            } else {
              callback();
            }
          }
        }, 1000);
      };
      var validateUser = (rule, value, callback) => {
        console.log(rule);
        if (value === '') {
          callback(new Error('请输入用户名'));
        } 
        // else {
        //   if (this.loginForm.checkPass !== '') {
        //     this.$refs.loginForm.validateField('checkPass');
        //   }
          callback();
        //}
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('密码不能为空'));
        }
          callback();

        // else if (value !== this.ruleForm2.pass) {
        //   callback(new Error('两次输入密码不一致!'));
        // } else {
        //   callback();
        // }
      };
      return {
        loading:false,
        disabled:false,
        loginForm: {
          user: 'admin',
          password: '123',
          age: ''
        },
        rules: {
          user: [
            { validator: validateUser, trigger: 'blur' }
          ],
          password: [
            { validator: validatePass, trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading=true;
            checkLogin({
                user:this.loginForm.user,
                password:this.loginForm.password
            }).then(res=>{
              if(res.state){
                sessionStorage.setItem('user',JSON.stringify(res.AdminUser));
                this.loading=false;
                this.disabled=true;
                  setTimeout(()=>{
                    this.$router.push({
                      name:'main'
                    })
                  },100);
                  setTimeout(()=>{
                    this.$message({
                    message:res.msg,
                    type:'success',
                    duration:1000
                  });
                  },300)
              }else{
                this.$message({
                  message:res.msg,
                  type:'error',
                  duration:1000
                });
                this.loading=false;
              }
            }
            )
           
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
@import "~common/stylus/variable";
//这里的~是webpack的语法，因为配置了alias的common,~common会去自动匹配里面的路径
.demo-ruleForm
    position:absolute;
    left:50%;
    transform:translateX(-211px);
    border-radius:5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
</style>
