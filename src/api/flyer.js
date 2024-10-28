import request from '@/utils/request.js'

export const flyerCategoryListService = () => {
    return request.get('/category')
}

export const flyerCategoryAddService = (categoryData) => {
    return request.post('/category',categoryData)
}