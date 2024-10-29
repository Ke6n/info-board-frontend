<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'

import { ref } from 'vue'


const categorys = ref()
const categoryId = ref('')

const state = ref('')
const flyers = ref()

//Pagination data model
const pageNum = ref(1)
const total = ref(20)
const pageSize = ref(3)

const onSizeChange = (size) => {
    pageSize.value = size
    flyerList()
}

const onCurrentChange = (num) => {
    pageNum.value = num
    flyerList()
}

import { flyerCategoryListService, flyerListService } from '@/api/flyer.js'
const flyerCategoryList = async () => {
    let result = await flyerCategoryListService();
    categorys.value = result.data;
}

const flyerList = async () => {
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        categoryId: categoryId.value ? categoryId.value : null,
        state: state.value ? state.value : null
    }
    let result = await flyerListService(params);
    total.value = result.data.total;
    flyers.value = result.data.items;

    for(let i=0;i<flyers.value.length;i++){
        let flyer = flyers.value[i];
        for(let j=0; j<categorys.value.length;j++){
            if(flyer.categoryId == categorys.value[j].id){
                flyer.categoryName = categorys.value[j].categoryName;
            }
        }
        
    }
}
flyerCategoryList();
flyerList();
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>Flyer Management</span>
                <div class="extra">
                    <el-button type="primary">Add Flyer</el-button>
                </div>
            </div>
        </template>
        <!-- Search Form -->
        <el-form inline>
            <el-form-item label="Category：">
                <el-select placeholder="Please select" v-model="categoryId" style="width: 200px">
                    <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="Status：">
                <el-select placeholder="Please select" v-model="state" style="width: 200px">
                    <el-option label="Published" value="Published"></el-option>
                    <el-option label="Draft" value="Draft"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="flyerList">Search</el-button>
                <el-button @click="categoryId=''; state=''">Reset</el-button>
            </el-form-item>
        </el-form>
        <!-- Flyer list -->
        <el-table :data="flyers" style="width: 100%">
            <el-table-column label="Title" width="400" prop="title"></el-table-column>
            <el-table-column label="Category" prop="categoryName"></el-table-column>
            <el-table-column label="Creation Time" prop="createTime"> </el-table-column>
            <el-table-column label="State" prop="state"></el-table-column>
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
        <!-- Pagination -->
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5, 10, 15]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
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