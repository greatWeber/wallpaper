/**
 * reducers
 * @Author   我贼帅
 * @DateTime 2018-07-31
 */
import {routerReducer} from 'react-router-redux'

import {combineReducers} from 'redux'

const rootReducer = combineReducers({
    routerReducer,
    config: (state = {})=> state,
})

export default rootReducer;
