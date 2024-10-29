import request from '@/utils/request.js'

export const flyerCategoryListService = () => {
    return request.get('/category')
}

export const flyerCategoryAddService = (categoryData) => {
    return request.post('/category', categoryData)
}

export const flyerCategoryUpdateService = (categoryData) => {
    return request.put('/category', categoryData)
}

export const flyerCategoryDeleteService = (id) => {
    return request.delete('/category?id=' + id)
}

export const flyerListService = (params) => {
    return request.get('/info-article', { params: params })
}