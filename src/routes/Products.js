import React from 'react';
import { connect } from 'dva';
import {Button} from 'antd'
import ProductList from '../components/ProductList';

/**
 * @author hui
 * @date 2019/1/14
 * @Description: connect连接
*/
const Products = ({ dispatch, products, count }) => {
  function handleDelete(id) {
    dispatch({
      type: 'products/delete',
      payload: id,
    });
  }

  function handleAdd() {
    debugger
    dispatch({
      type: 'products/add',
      payload: { name: 'vue', id: count++ }
    });
  }
  return (
    <div>
      <h2>List of Products</h2>
      <Button type="primary" onClick={handleAdd}>新增</Button>
      <ProductList onDelete={handleDelete} products={products} />
    </div>
  );
};

// export default Products;
export default connect(({ products,count }) => ({
  products,count
}))(Products);
