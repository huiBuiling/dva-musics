import React, {Component} from 'react';
import { connect } from 'dva';
import {List,InputItem} from 'antd-mobile';
import { api } from "../../utils/api";

/**
 * @author hui
 * @date 2019/3/12
 * @Description: 账户页 - 登录
 */
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: null,
            password: null,
        }
    }

    componentDidMount() {}

    //获取用户详情
    getUserDetail = (id) => {
        api.admin_detail(id).then(res => {
            const detail = {
                id,
                name: res.profile.nickname,
                gender: res.profile.gender,
                level: res.level,
                eventCount: res.profile.eventCount,
                follows: res.profile.follows,
                followeds: res.profile.followeds,
            };
            this.props.getUserDetail(detail);
            this.props.dispatch({
                type: 'users/getUserDetail',
                data: detail
            })
        })
    }

    //登录
    login = ()=>{
        const { phone,password } = this.state;
        api.admin_signin({phone, password}).then(res =>{
            if(res.code === 200){
                this.getUserDetail(res.account.id);
            }
        })

    }

    render() {
        const { phone, password} = this.state;
        return (
            <div className="m-login">
                <div className="m-login-con">
                    <List renderHeader={() => '登录'}>
                        <InputItem
                            // type="phone"
                            placeholder="186 1234 1234"
                            value={phone}
                            onChange={(v) => { this.setState({phone:v}) }}
                        >手机号码</InputItem>
                        <InputItem
                            placeholder="****"
                            value={password}
                            onChange={(v) => { this.setState({password:v}) }}
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
