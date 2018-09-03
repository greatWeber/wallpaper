/**
 * 自定义路由中间件
 * @authors 我贼帅
 * @date    2018-07-31 14:49:02
 */

import {browserHistory} from 'react-router';

import {routerMiddleware} from 'react-router-redux';

export default routerMiddleware(browserHistory);


