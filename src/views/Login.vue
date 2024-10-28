<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const isRegister = ref(false)

const registerData = ref({
    username: '',
    password: '',
    rePassword: ''
})

// Form Validation
const checkRePassword = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('Please input the password again'))
    } else if (value !== registerData.value.password) {
        callback(new Error("Two inputs don't match!"))
    } else {
        callback()
    }
}

const rules = {
    username: [
        { required: true, message: 'Please enter your username', trigger: 'blur' },
        { min: 5, max: 16, message: 'It should be 5-16 non-empty characters', trigger: 'blur' }
    ],
    password: [
        { required: true, message: 'Please enter your password', trigger: 'blur' },
        { min: 5, max: 16, message: 'It should be 5-16 non-empty characters', trigger: 'blur' }
    ],
    rePassword: [
        { validator: checkRePassword, trigger: 'blur' }
    ]
}

import { userRegisterService, userLoginService } from '@/api/user.js'
const register = async () => {
    let result = await userRegisterService(registerData.value);
    ElMessage.success(result.msg ? result.msg : 'Registration succeeded')
}

import {useRouter} from 'vue-router'
import {useTokenStore} from '@/stores/token.js'
const router = useRouter()
const tokenStore = useTokenStore();
const login = async () => {
    let result = await userLoginService(registerData.value);
    ElMessage.success(result.msg ? result.msg : 'Login succeeded')
    tokenStore.setToken(result.data)
    router.push('/')
}

const clearRegisterData = () => {
    registerData.value = {
        username: '',
        password: '',
        rePassword: ''
    }
}
</script>

<template>
    <el-row class="login-page">
        <el-col :span="12" class="bg"></el-col>
        <el-col :span="6" :offset="3" class="form">
            <!-- Registration form -->
            <el-form ref="form" size="large" autocomplete="off" v-if="isRegister" :model="registerData" :rules="rules">
                <el-form-item>
                    <h1>Sign up</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="Username" v-model="registerData.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input :prefix-icon="Lock" type="password" placeholder="Password"
                        v-model="registerData.password"></el-input>
                </el-form-item>
                <el-form-item prop="rePassword">
                    <el-input :prefix-icon="Lock" type="password" placeholder="Confirm password"
                        v-model="registerData.rePassword"></el-input>
                </el-form-item>
                <!-- Buttons for sign up -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="register">
                        Submit
                    </el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = false; clearRegisterData()">
                        ← Back
                    </el-link>
                </el-form-item>
            </el-form>
            <!-- Login form -->
            <el-form ref="form" size="large" autocomplete="off" v-else :model="registerData" :rules="rules">
                <el-form-item>
                    <h1>Sign in</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="Username" v-model="registerData.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input name="password" :prefix-icon="Lock" type="password" placeholder="Password"
                        v-model="registerData.password"></el-input>
                </el-form-item>
                <el-form-item class="flex">
                    <div class="flex">
                        <el-checkbox>Remember me</el-checkbox>
                        <el-link type="primary" :underline="false">Forgot password?</el-link>
                    </div>
                </el-form-item>
                <!-- Login Buttons -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="login">Sign in</el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = true; clearRegisterData()">
                        Sign up →
                    </el-link>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<style lang="scss" scoped>
/* css */
.login-page {
    height: 100vh;
    background-color: #fff;

    .bg {
        background: url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
            url('@/assets/login_bg.jpg') no-repeat center / cover;
        border-radius: 0 20px 20px 0;
    }

    .form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        user-select: none;

        .title {
            margin: 0 auto;
        }

        .button {
            width: 100%;
        }

        .flex {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>