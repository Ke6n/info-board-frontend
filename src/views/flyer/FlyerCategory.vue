<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { ref } from 'vue'
const categorys = ref()

import { flyerCategoryListService, flyerCategoryAddService, flyerCategoryUpdateService, flyerCategoryDeleteService } from '@/api/flyer.js'
const flyerCategoryList = async () => {
    let result = await flyerCategoryListService();
    categorys.value = result.data;
}
flyerCategoryList();

// Pop-up window for Add Category
const dialogVisible = ref(false)
const categoryModel = ref({
    categoryName: '',
    categoryAlias: ''
})
const rules = {
    categoryName: [
        { required: true, message: 'Please input the category name', trigger: 'blur' },
    ],
    categoryAlias: [
        { required: true, message: 'Please input the category alias', trigger: 'blur' },
    ]
}

import { ElMessage } from 'element-plus'
const addCategory = async () => {
    let result = await flyerCategoryAddService(categoryModel.value);
    ElMessage.success(result.msg ? result.msg : 'Addition completed');
    flyerCategoryList();
    dialogVisible.value = false;
}

const title = ref('')

const showDialog = (row) => {
    dialogVisible.value = true;
    title.value = 'Edit Category';
    categoryModel.value.categoryName = row.categoryName;
    categoryModel.value.categoryAlias = row.categoryAlias;
    categoryModel.value.id = row.id
}

const updateCategory = async () => {
    let result = await flyerCategoryUpdateService(categoryModel.value);
    ElMessage.success(result.msg ? result.msg : 'Update completed');
    flyerCategoryList();
    dialogVisible.value = false;
}

const clearDate = () => {
    categoryModel.value.categoryName = '';
    categoryModel.value.categoryAlias = '';
}

import {ElMessageBox} from 'element-plus'
const deleteCategory = (row) => {
    ElMessageBox.confirm(
        'Are you sure you want to delete this category?',
        'Warning',
        {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            type: 'warning',
        }
    )
        .then(async () => {
            let result = await flyerCategoryDeleteService(row.id);
            ElMessage({
                type: 'success',
                message: 'Delete completed',
            })
            flyerCategoryList();
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: 'Delete canceled',
            })
        })
}
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>FlyerCategory</span>
                <div class="extra">
                    <el-button type="primary" @click="dialogVisible = true; title = 'Add Category'; clearDate()">Add
                        Category</el-button>
                </div>
            </div>
        </template>
        <el-table :data="categorys" style="width: 100%">
            <el-table-column label="ID" width="100" type="index"> </el-table-column>
            <el-table-column label="Category name" prop="categoryName"></el-table-column>
            <el-table-column label="Category alias" prop="categoryAlias"></el-table-column>
            <el-table-column label="Operation" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="showDialog(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteCategory(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="There is no data." />
            </template>
        </el-table>
        <el-dialog v-model="dialogVisible" :title="title" width="30%">
            <el-form :model="categoryModel" :rules="rules" label-width="100px" style="padding-right: 30px">
                <el-form-item label="Cat. Name" prop="categoryName" label-position="left">
                    <el-input v-model="categoryModel.categoryName" minlength="1" maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="Cat. Alias" prop="categoryAlias" label-position="left">
                    <el-input v-model="categoryModel.categoryAlias" minlength="1" maxlength="15"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="title == 'Add Category' ? addCategory() : updateCategory()">
                        Confirm
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </el-card>
</template>

<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
</style>