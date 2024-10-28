<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { ref } from 'vue'
const categorys = ref()

import { flyerCategoryListService } from '@/api/flyer.js'
const flyerCategoryList = async () => {
   let result = await flyerCategoryListService();
   categorys.value = result.data;
}
flyerCategoryList();
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>FlyerCategory</span>
                <div class="extra">
                    <el-button type="primary">Add Category</el-button>
                </div>
            </div>
        </template>
        <el-table :data="categorys" style="width: 100%">
            <el-table-column label="ID" width="100" type="index"> </el-table-column>
            <el-table-column label="Category name" prop="categoryName"></el-table-column>
            <el-table-column label="Category alias" prop="categoryAlias"></el-table-column>
            <el-table-column label="Operation" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary"></el-button>
                    <el-button :icon="Delete" circle plain type="danger"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="There is no data." />
            </template>
        </el-table>
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