/**
 * 中间件首页
 * @Author   我贼帅
 * @DateTime 2018-07-31
 */

import {routerMiddleware} from 'react-router-redux';

import logger from './logger'; //打印信息

import router from './router'; //路由for store

import history from '../history'; //增强版历史

/**
 * [reduxRouterMiddleware]
 * [传送门](https://www.npmjs.com/package/react-router-redux)
 * A middleware you can apply to your Redux store to capture dispatched actions 
 * created by the action creators. It will redirect those actions to the provided history instance.
 * 
 */
const reduxRouterMiddleware = routerMiddleware(history);



export {
    reduxRouterMiddleware,
    logger,
    router,
}

