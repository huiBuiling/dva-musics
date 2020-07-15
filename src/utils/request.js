import fetch from 'dva/fetch';
import { Toast } from 'antd-mobile';
import { getUrlFix } from './storage';

const get = (url, msg = '数据获取成功！') => {
    return new Promise((resolve, reject) => {
        fetch(`${getUrlFix}/${url}`,{
            credentials: "include",  // 跨域处理
        })
            .then(res => res.json())
            .then(data => {
                if(data.code === 200) {
                    // Toast.success(msg);
                    resolve(data)
                }

                if(data.code === 301) {
                    Toast.info('您还未登录，部分功能无法体验哦！');
                }
            })
            .catch(err => {
                Toast.fail('发生错误');
                return reject(err)
            });
    })
}

const post = (url, data) => {
    data = {
        ...data,
        methods: 'POST',
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(data),
        credentials: "include",  // 跨域处理
    }
    return new Promise((resolve, reject) => {
        fetch(`${getUrlFix}/${url}`, data)
            .then(res => res.json())
            .then(data => resolve(data))
            .catch(err => reject(err));
    })
}

export {
    get,
    post
}