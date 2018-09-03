/**
 * api接口(请求第一步,生成一个接口)
 * @Author   我贼帅
 * @DateTime 2018-08-02
 */

import {ajax} from '../utils'

export const login = ajax.fetchJSONByPost('/login')

export const register = ajax.fetchJSONByPost('/register')

export const logOut = ajax.fetchJSONByGet('/logOut')

export const addCate = ajax.fetchJSONByPost('/addCate')

export const cateList = ajax.fetchJSONByGet('/cateList')

export const delCate = ajax.fetchJSONByPost('/delCate')

export const cateDetail = ajax.fetchJSONByGet('/cateDetail')

export const editCate = ajax.fetchJSONByPost('/editCate')

export const labelList = ajax.fetchJSONByGet('/labelList')

export const addLabel = ajax.fetchJSONByPost('/addLabel')

export const editLabel = ajax.fetchJSONByPost('/editLabel')

export const labelDetail = ajax.fetchJSONByGet('/labelDetail')

export const delLabel = ajax.fetchJSONByPost('/delLabel')

