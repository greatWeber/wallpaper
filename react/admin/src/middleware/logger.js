/**
 * 自定义打印中间件
 * @Author   我贼帅
 * @DateTime 2018-07-31
 */


/**
 * This is a cool function
 * @Author   我贼帅
 * @DateTime 2018-07-31
 * 多重箭头，如果看不懂，可以转成es5来理解，其实就是一层套一层的执行
 * "use strict";
 * (function (store) {
 *     return function (next) {
 *         return function (action) {
 *             return next(action);
 *         };
 *    };
 * });
 */
export default store => next => action => {
    return next(action);
}