/**
 * @author hui
 * @date 2019/1/14
 * @Description: reducers 操作
*/
export default {
  namespace: 'lists',
  state: {},
  reducers: {
    'delete'(state, { payload: id }) {
      return {
        products:state.products.filter(item => item.id !== id),
        count:state.count
      };
    },
    'add'(state, { payload: newData }) {
      return  {
                  products: [...state.products, newData],
                  count:state.count + 1
              }
    },
  },
};
