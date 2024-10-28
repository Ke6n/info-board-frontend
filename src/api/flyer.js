import request from '@/utils/request.js'

export const flyerCategoryListService = ()=>{
    return request.get('/category')
}