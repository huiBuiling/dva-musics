import React, {Component} from 'react';
import {NavBar, Icon, List, Toast} from 'antd-mobile';
import {connect} from 'dva';
import { api } from "../../utils/api";

/**
 * @author hui
 * @date 2019/2/12
 * @Description: 最近播放歌曲（周|全部）
 * type=1 时只返回 weekData, type=0 时返回 allData
 */
class RecordLists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recordList: [],
        }
    }

    componentDidMount() {
        api.record_list(this.props.userId).then(res => {
            if (res.code === 200) {
                this.setState({
                    recordList: res.weekData
                });
            }
        }).catch(err => {
            Toast.fail('发生错误');
        })
    }

    render() {
        const Item = List.Item;
        const Brief = Item.Brief;
        return (
            <div className='m-my'>
                <div className="m-my-all">
                    {/*top*/}
                    <NavBar
                        mode="light"
                        icon={<Icon type="left"/>}
                        onLeftClick={() => this.props.history.push('/music')}
                        rightContent={<span onClick={() => {
                            this.props.history.push('playMusic')
                        }}><i className="icon-m-bfz"/></span>}
                    >最近播放</NavBar>

                    {/*tab*/}
                    <div className="m-my-tabs">
                        <List className="m-my-list">
                            {
                                this.state.recordList.map((item, index) => {
                                    item = item.song;
                                    let sizes = item.h !== null ? (item.h.size / 1024 / 1024).toFixed(1) : (item.m.size / 1024 / 1024).toFixed(2);
                                    return (
                                        <Item multipleLine key={index}
                                              extra={<span className="m-my-list-r">
                                {item.mv !== 0 && <i className="icon-list-sp"/>}
                                                  <i className="icon-more"/></span>}
                                              onClick={() => {
                                                  this.getCurrenturl(item)
                                              }}
                                        >
                                            <span>{item.name}</span>
                                            <Brief><span>{sizes}M</span> - <span>{item.ar[0].name}</span></Brief>
                                        </Item>
                                    )
                                })
                            }
                        </List>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, dispatch) => {
    return {
        playMusicList: state.playMusic.playMusicList,
        userId: state.users.userDetail.id
    }
}
export default connect(mapStateToProps)(RecordLists);
