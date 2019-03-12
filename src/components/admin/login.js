import React, {Component} from 'react';
import { connect } from 'dva';
import {List,InputItem} from 'antd-mobile';
import request from "../../utils/request";

/**
 * @author hui
 * @date 2019/3/12
 * @Description: 账户页 - 登录
 */
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phone:null,
            password:null
        }
    }

    componentDidMount() {}

    //获取用户详情
    getUserDetail = (id) => {
        request(`user/detail?uid=${id}`).then(res => {
            if (res.data.code === 200) {
                const detail = {
                    id:id,
                    name:res.data.profile.nickname,
                    gender:res.data.profile.gender,
                    level:res.data.level,
                    eventCount:res.data.profile.eventCount,
                    follows:res.data.profile.follows,
                    followeds:res.data.profile.followeds,
                };
                this.props.getUserDetail(detail);
                this.props.dispatch({
                    type:'users/getUserDetail',
                    data:detail
                })
            }
        })
    }

    //登录
    login = ()=>{
        const { phone,password } = this.state;
        request(`login/cellphone?phone=${phone}&password=${password}`).then(res =>{
            if(res.data.code === 200){
                this.getUserDetail(res.data.account.id);
            }
        })

    }

    render() {
        return (
            <div className="m-login">
                <div className="m-login-con">
                    <List renderHeader={() => '登录'}>
                        <InputItem
                            // type="phone"
                            placeholder="186 1234 1234"
                            onChange={(v) => { console.log(v);this.setState({phone:v}) }}
                        >手机号码</InputItem>
                        <InputItem
                            placeholder="****"
                            onChange={(v) => { console.log(v);this.setState({password:v}) }}
                        >
                            {/*<div style={{
                                backgroundImage: 'url(https://zos.alipayobjects.com/rmsportal/DfkJHaJGgMghpXdqNaKF.png)',
                                backgroundSize: 'cover', height: '22px', width: '22px' }}
                            />*/}
                            密码
                        </InputItem>
                        <List.Item>
                            <div
                                style={{ width: '100%', color: '#108ee9', textAlign: 'center' }}
                                onClick={this.login}
                            >
                                登录
                            </div>
                        </List.Item>
                    </List>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state,dispatch)=>{
    return {
        userDetail:state.users.userDetail
    }
}
export default connect(mapStateToProps)(Login);
