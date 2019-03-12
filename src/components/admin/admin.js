import React, {Component} from 'react';
import { connect } from 'dva';
import {NavBar, Badge, List,Toast} from 'antd-mobile';
import admin from '../../assets/images/admin.png';
import request from "../../utils/request";
import Login from './login';

/**
 * @author hui
 * @date 2019/3/5
 * @Description: 账户页
 */
class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detail:{           //详情
                name:null,
                gender:null,
                level:null,
                eventCount:0,
                follows:0,
                followeds:0,
            },
            point:false,      //签到
            isLogin:false,     //显示登录
        }
    }

    componentDidMount() {}

    //获取用户详情
    getUserDetail = (data) => {
        this.setState({
            detail:data,
            isLogin:false
        });
    }

    //登录
    login = ()=>{
        this.setState({
            isLogin:true
        });
    }

    /**
     * 签到
     * 可选参数 : type: 签到类型 , 默认 0, 其中 0 为安卓端签到 ,1 为 web/PC 签到
     * */
    setPoint = () => {
        if(!this.state.point){
            request('daily_signin').then(res => {
                if (res.data.code === 200) {
                    this.setState({
                        point:true
                    });
                    Toast.success('签到成功！');
                }
                if (res.data.code === -2) {
                    Toast.info(res.data.msg);
                }
            })
        }else{
            Toast.info('重复签到');
        }
    }

    render() {
        const { detail,isLogin } = this.state;
        return (
            <div className="m-admin">
                <NavBar
                    mode="light"
                    rightContent={<span onClick={() => {
                        this.props.history.push('playMusic')
                    }}><i className="icon-m-bfz"/></span>}
                >帐号</NavBar>

                {isLogin && <Login getUserDetail={this.getUserDetail}/>}

                {/*top*/}
                <div className="m-admin-top">
                    {detail.name !== null ?
                        <div className="m-admin-top-msg">
                            <img src={admin} alt=""/>
                            <div>
                                {/*gender === 2 -> 女*/}
                                <p>{detail.name} <span><i className={detail.gender === 2 ? "" : ""}></i></span></p>
                                <Badge text={`lv.${detail.level}`}/>
                            </div>
                            <Badge
                                onClick={this.setPoint}
                                text={<span style={{fontWeight: 'bold'}}>
                                <i style={{fontSize: 14, marginRight: 4}} className="icon-admin-qd"/>签到</span>}
                                style={{
                                    width: 65,
                                    color: '#B74A46',
                                    border: '1px solid #B74A46',
                                    marginRight: 20
                                }}
                            />
                        </div>
                        :
                        <div className="m-admin-top-msg">
                            <img src={admin} alt=""/>
                            <div className="m-admin-login">
                                <span onClick={this.login}>请登录</span>
                            </div>
                        </div>
                    }

                    <div className="m-admin-top-opera">
                        <div>
                            <p>动态</p>
                            <p><span>{detail.eventCount}</span></p>
                        </div>
                        <div>
                            <p>关注</p>
                            <p><span>{detail.follows}</span></p>
                        </div>
                        <div>
                            <p>粉丝</p>
                            <p><span>{detail.followeds}</span></p>
                        </div>
                        <div style={{borderRight: 'none'}}>
                            <p><span><i className="icon-admin-edit"/></span></p>
                            <p>我的资料</p>
                        </div>
                    </div>
                </div>

                {/*con*/}
                <div className="m-admin-con">
                    <List>
                        <List.Item
                            thumb={<span><i className="icon-admin-msg"/></span>}
                            extra={<Badge text={22} overflowCount={10}/>}
                            arrow="horizontal"
                        >
                            我的消息
                        </List.Item>
                    </List>

                    <List>
                        <List.Item
                            thumb={<span><i className="icon-admin-setting"/></span>}
                            arrow="horizontal"
                            onClick={() => {
                            }}
                        >设置</List.Item>
                        <List.Item
                            thumb={<span><i className="icon-admin-sys"/></span>}
                            arrow="horizontal"
                        >扫一扫</List.Item>
                        <List.Item
                            thumb={<span><i className="icon-skin"/></span>}
                            arrow="horizontal"
                            extra="默认红"
                        >个性换肤</List.Item>
                        <List.Item
                            thumb={<span><i className="icon-admin-yhj"/></span>}
                            extra={<div>
                                <Badge text="券" style={{
                                    marginLeft: 12,
                                    padding: '0 3px',
                                    backgroundColor: '#f19736',
                                    borderRadius: 2
                                }}/>
                                <Badge text="NEW" style={{
                                    marginLeft: 12,
                                    padding: '0 3px',
                                    backgroundColor: '#21b68a',
                                    borderRadius: 2
                                }}/>
                            </div>}
                            arrow="horizontal"
                        >
                            优惠卷
                        </List.Item>
                        <List.Item
                            thumb={<span><i className="icon-admin-about"/></span>}
                            arrow="horizontal"
                        >关于</List.Item>
                    </List>
                </div>
            </div>
        )
    }
}
/*const mapStateToProps = (state,dispatch)=>{
    return {
        userDetail:state.users.userDetail
    }
}*/
// export default connect(mapStateToProps)(Admin);
export default Admin;
