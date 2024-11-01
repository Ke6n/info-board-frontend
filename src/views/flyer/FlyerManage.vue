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

import {
    flyerCategoryListService,
    flyerListService,
    flyerAddService,
    flyerUpdateService,
    flyerDeleteService
} from '@/api/flyer.js'
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

    for (let i = 0; i < flyers.value.length; i++) {
        let flyer = flyers.value[i];
        for (let j = 0; j < categorys.value.length; j++) {
            if (flyer.categoryId == categorys.value[j].id) {
                flyer.categoryName = categorys.value[j].categoryName;
            }
        }

    }
}
flyerCategoryList();
flyerList();

//Drawer
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { Plus } from '@element-plus/icons-vue'

const visibleDrawer = ref(false)
const drawerTitle = ref('')
const flyerModel = ref({
    title: '',
    categoryId: '',
    coverImg: '',
    content: '',
    state: ''
})

import { useTokenStore } from '@/stores/token.js'
const tokenStore = useTokenStore();

const uploadSuccess = (result) => {
    flyerModel.value.coverImg = result.data;
    console.log(result.data);
}

import { ElMessage } from 'element-plus'
const addFlyer = async (clickState) => {
    flyerModel.value.state = clickState;
    let result = await flyerAddService(flyerModel.value);

    ElMessage.success(result.msg ? result.msg : 'Addition completed');
    visibleDrawer.value = false;
    flyerList();
}

const showDrawer = (row) => {
    visibleDrawer.value = true
    drawerTitle.value = 'Edit Flyer'
    flyerModel.value = {
        ...row
    }
}

const quillInstance = ref();
const onEditorReady = (quill) => {
    quillInstance.value = quill;
};
const clearData = () => {
    flyerModel.value = {
        title: '',
        categoryId: '',
        coverImg: '',
        content: '',
        state: ''
    }
    if (quillInstance.value) {
        quillInstance.value.setContents([]);
    }
}

const updateFlyer = async (clickState) => {
    flyerModel.value.state = clickState
    await flyerUpdateService(flyerModel.value);
    ElMessage.success("Update completed")
    visibleDrawer.value = false
    await flyerList()
}

import {ElMessageBox} from 'element-plus'
const deleteFlyer = (row) => {
  ElMessageBox.confirm(
      'Are you sure you want to delete this flyer?',
      'Warning',
      {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
  ).then(
      async () => {
        await flyerDeleteService(row.id)
        ElMessage.success("Delete completed")
        await flyerList()
      }
  )
}
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>Flyer Management</span>
                <div class="extra">
                    <el-button type="primary" @click="visibleDrawer = true; clearData(); drawerTitle = 'Add Flyer'">Add
                        Flyer</el-button>
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
                <el-button @click="categoryId = ''; state = ''">Reset</el-button>
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
                    <el-button :icon="Edit" circle plain type="primary" @click="showDrawer(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteFlyer(row)"></el-button>
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
        <!-- Add Flyer Drawer -->
        <el-drawer v-model="visibleDrawer" :title="drawerTitle" direction="rtl" size="50%">
            <el-form :model="flyerModel" label-width="100px">
                <el-form-item label="Title">
                    <el-input v-model="flyerModel.title" placeholder="Please input a title"></el-input>
                </el-form-item>
                <el-form-item label="Category">
                    <el-select placeholder="Please select" v-model="flyerModel.categoryId">
                        <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Image">

                    <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false" action="/api/upload"
                        name="file" :headers="{ 'Authorization': tokenStore.token }" :on-success="uploadSuccess">
                        <img v-if="flyerModel.coverImg" :src="flyerModel.coverImg" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item label="Content">
                    <div class="editor">
                        <quill-editor theme="snow" v-model:content="flyerModel.content" contentType="html"
                            @ready="onEditorReady">
                        </quill-editor>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="drawerTitle==='Add Flyer'?addFlyer('Published'):updateFlyer('Published')">Publish</el-button>
                    <el-button type="info" @click="drawerTitle==='Add Flyer'?addFlyer('Draft'):updateFlyer('Draft')">Draft</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
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

.avatar-uploader {
    :deep() {
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            text-align: center;
        }
    }
}

.editor {
    width: 100%;

    :deep(.ql-editor) {
        min-height: 200px;
    }
}
</style>