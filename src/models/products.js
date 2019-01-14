/**
 * @author hui
 * @date 2019/1/14
 * @Description: reducers 操作
*/
export default {
  namespace: 'products',
  state: {
    products:[],
    count:0
  },
  reducers: {
    'delete'(state, { payload: id }) {
      return state.filter(item => item.id !== id);
    },
    'add'(state, { payload: newData }) {
      return  [...state, newData];
    },
  },
};
