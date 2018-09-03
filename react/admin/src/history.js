/**
 * 自定义历史
 * @authors 我贼帅
 * @date    2018-07-31 14:53:51
 */

import {useRouterHistory} from 'react-router';

import createHashHistory from 'history/lib/createHashHistory';

/**
 * [history]
 * [传送门](https://segmentfault.com/a/1190000007918058)
 * useRouterHistory is a history enhancer that configures a given createHistory factory 
 * to work with React Router. This allows using custom histories in addition to the bundled singleton histories.
 * @type {[type]}
 */
const history = useRouterHistory(createHashHistory)({});

export default history
