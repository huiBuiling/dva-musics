import React from 'react';
import { connect } from 'dva';
import {Button} from 'antd'
import ProductList from '../components/ProductList';

/**
 * @author hui
 * @date 2019/1/14
 * @Description: connect连接
*/
const Products = ({ dispatch, lists }) => {
  function handleDelete(id) {
    dispatch({
      type: 'lists/delete',   //lists 对应 namespace: 'lists',
      payload: id,
    });
  }

  function handleAdd() {
    dispatch({
      type: 'lists/add',
      payload: { name: `新增数据${lists.count + 1}`, id: lists.count + 1 }
    });
  }

  return (
    <div>
      <h2>List of Products</h2>
      <Button type="primary" onClick={handleAdd}>新增{lists.count}</Button>
      <ProductList onDelete={handleDelete} products={lists.products} />
    </div>
  );
};

// export default Products;
export default connect(({ lists }) => ({
  lists
}))(Products);
