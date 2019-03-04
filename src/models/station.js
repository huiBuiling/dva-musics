/**
 * @author hui
 * @date 2019/3/4
 * @Description: curRadio：电台 id,flag 是否订阅
 */
export default {
    namespace: 'stations',
    state: {
        curRadio: {}
    },
    reducers: {
        'curRadio'(state, action) {
            return {
                ...state,
                curRadio: action.data
            };
        }
    },
    effects: {
        //电台对应信息
        * getCurRadio({data}, {put}) {
            yield put({
                type: 'curRadio',
                data: data
            });
        }
    }
};
