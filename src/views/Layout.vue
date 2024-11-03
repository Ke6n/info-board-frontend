<script setup>
import {
    Management,
    Promotion,
    UserFilled,
    User,
    Crop,
    EditPen,
    SwitchButton,
    CaretBottom
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'

import { userInfoService } from '@/api/user.js'
import useUserInfoStore from '@/stores/userInfo.js'
import {useTokenStore} from '@/stores/token.js'
const tokenStore = useTokenStore();
const userInfoStore = useUserInfoStore();
const getUserInfo = async () => {
    let result = await userInfoService();
    userInfoStore.setInfo(result.data);
}

getUserInfo();

import {useRouter} from 'vue-router'
const router = useRouter();
import {ElMessage, ElMessageBox} from 'element-plus'
const handleCommand = (command) => {
    if(command === 'logout'){
        ElMessageBox.confirm(
        'Are you sure you want to sign out?',
        'Logout',
        {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            type: 'warning',
        }
    )
        .then(async () => {
            // 1. Clear the stored token and userinfo in Pinia
            tokenStore.removeToken();
            userInfoStore.removeInfo();
            // 2. Redirect to the Login Page
            router.push('/login')
            ElMessage({
                type: 'success',
                message: 'Signed out',
            })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: 'Logout canceled',
            })
        })
    }else{
        router.push('/user/'+command)
    }
}
</script>

<template>
    <el-container class="layout-container">
        <!-- left bar -->
        <el-aside width="200px">
            <div class="el-aside__logo"></div>
            <el-menu active-text-color="#ffd04b" background-color="#232323" text-color="#fff" router>
                <el-menu-item index="/flyer/category">
                    <el-icon>
                        <Management />
                    </el-icon>
                    <span>Flyer Categories</span>
                </el-menu-item>
                <el-menu-item index="/flyer/manage">
                    <el-icon>
                        <Promotion />
                    </el-icon>
                    <span>Flyer Management</span>
                </el-menu-item>
                <el-sub-menu>
                    <template #title>
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                        <span>User Center</span>
                    </template>
                    <el-menu-item index="/user/info">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>Profile</span>
                    </el-menu-item>
                    <el-menu-item index="/user/avatar">
                        <el-icon>
                            <Crop />
                        </el-icon>
                        <span>Change Avatar</span>
                    </el-menu-item>
                    <el-menu-item index="/user/resetPassword">
                        <el-icon>
                            <EditPen />
                        </el-icon>
                        <span>Reset Password</span>
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-aside>
        <!-- Right main area -->
        <el-container>
            <!-- Head area -->
            <el-header>
                <div>TestUser:<strong>{{ userInfoStore.info.nickname }}</strong></div>
                <el-dropdown placement="bottom-end" @command="handleCommand">
                    <span class="el-dropdown__box">
                        <el-avatar :src="userInfoStore.info.userPic ? userInfoStore.info.userPic : avatar" />
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="info" :icon="User">Profile</el-dropdown-item>
                            <el-dropdown-item command="avatar" :icon="Crop">Change Avatar</el-dropdown-item>
                            <el-dropdown-item command="resetPassword" :icon="EditPen">Reset Password</el-dropdown-item>
                            <el-dropdown-item command="logout" :icon="SwitchButton">Sign Out</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>
            <!-- Middle area -->
            <el-main>
                <router-view></router-view>
            </el-main>
            <!-- Bottom area -->
            <el-footer>Info-Board ©2024 Created by Kuo Li</el-footer>
        </el-container>
    </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
    height: 100vh;

    .el-aside {
        background-color: #232323;

        &__logo {
            height: 120px;
            background: url('@/assets/logo.png') no-repeat center / 240px auto;
        }

        .el-menu {
            border-right: none;
        }
    }

    .el-header {
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .el-dropdown__box {
            display: flex;
            align-items: center;

            .el-icon {
                color: #999;
                margin-left: 10px;
            }

            &:active,
            &:focus {
                outline: none;
            }
        }
    }

    .el-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #666;
    }
}
</style>