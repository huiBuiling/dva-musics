import React from 'react';
import PropTypes from 'prop-types';
import { Table, Popconfirm, Button } from 'antd';

/**
 * @author hui
 * @date 2019/1/14
 * @Description: 页面组件
*/
const ProductList = ({ onDelete, products }) => {
  const columns = [{
      title: 'Name',
      dataIndex: 'name',
  }, {
      title: 'Actions',
      render: (text, record) => {
          return (
              <div>
                  <Popconfirm title="Delete?" onConfirm={() => onDelete(record.id)}>
                      <Button>Delete</Button>
                  </Popconfirm>
              </div>
          );
      },
  }];
  return (
      <Table
          dataSource={products}
          columns={columns}
          rowKey={record => record.id}
          pagination={false}
      />
  );
};

ProductList.propTypes = {
  onDelete: PropTypes.func.isRequired,
  products: PropTypes.array.isRequired,
};

export default ProductList;
