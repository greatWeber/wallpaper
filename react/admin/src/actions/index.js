/**
 * action(请求第二步, 生成一个请求)
 * @authors 我贼帅
 * @date    2018-08-02 11:01:05
 * @version $Id$
 */


/**
 * createAction
 * [传送门](https://redux-actions.js.org/api/createaction)
 */
import {createAction} from 'redux-actions'

import * as api from '../api'

import {ajax} from '../utils'


export const fetchLogin =ajax.createAjaxAction(api.login)

export const fetchRegister = ajax.createAjaxAction(api.register)

export const fetchLogOut = ajax.createAjaxAction(api.logOut)

export const fetchAddCate = ajax.createAjaxAction(api.addCate)

export const fetchCateList = ajax.createAjaxAction(api.cateList)

export const fetchDelCate = ajax.createAjaxAction(api.delCate)

export const fetchCateDetail = ajax.createAjaxAction(api.cateDetail)

export const fetchEditCate = ajax.createAjaxAction(api.editCate)

export const fetchLabelList = ajax.createAjaxAction(api.labelList)

export const fetchAddLabel = ajax.createAjaxAction(api.addLabel)

export const fetchEditLabel = ajax.createAjaxAction(api.editLabel)

export const fetchLabelDetail = ajax.createAjaxAction(api.labelDetail)

export const fetchDelLabel = ajax.createAjaxAction(api.delLabel)






