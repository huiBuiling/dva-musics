/**
 * @author hui
 * @date 2019/2/13
 * @Description: userDetail用户基础信息(id:网易云id) | liveIDList 用户喜欢的音乐id列表
 */
import {getItem, setItem} from '../utils/storage';
const userDetail = JSON.parse(getItem('userDetail'));

export default {
    namespace: 'users',
    state: {
        userDetail: {
            ...userDetail,
            id: userDetail && userDetail.id || '448109360'
        },
        liveIDList: []
    },
    reducers: {
        'userMsg'(state, action) {
            setItem('userDetail', action.data);
            return {
                ...state,
                userDetail: action.data
            };
        },
        'userLiveIDList'(state, action) {
            return {
                ...state,
                liveList: action.data
            }
        }
    },
    effects: {
        //用户基础信息
        * getUserDetail({data}, {put}) {
            yield put({
                type: 'userMsg',
                data: data
            });
        },

        //用户喜欢的音乐id列表
        * getUserLiveIDList({data}, {put}) {
            yield put({
                type: 'userLiveIDList',
                data: data
            });
        }
    }
};
