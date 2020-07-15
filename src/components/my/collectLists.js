import React, {Component} from 'react';
import {Tabs, Toast, NavBar, Icon, List, SearchBar} from 'antd-mobile';
import {connect} from 'dva';
import { api } from "../../utils/api";

/**
 * @author hui
 * @date 2019/2/12
 * @Description: 我的收藏（歌手|mv）
 */
class CollectLists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            singerList: [],        //歌手列表
            mvList: [],             //mv列表
            searchSingerList: [],   //搜索 - 歌手列表
            searchMvList: [],   //搜索 - 歌手列表
            searchSingerVal: [],   //搜索 - 歌手列表
            searchMvVal: [],   //搜索 - 歌手列表
        }
    }

    componentDidMount() {
        // 获取歌手列表
        api.artist().then(res => {
            if (res.code === 200) {
                this.setState({
                    singerList: res.data
                });
            }
        }).catch(err => {
            Toast.fail('发生错误');
        })
    }

    // 搜索歌手
    searchList = (val, type) => {
        api.search_list(val, type).then(res => {
            if (res.code === 200) {
                if(type === 100) {
                    this.setState({
                        searchSingerList: res.result.songs,
                        searchSingerVal: val
                    })
                } else if(type ===1004) {
                    this.setState({
                        searchMvList: res.result.songs,
                        searchMvVal: val
                    })
                }
            }
        }).catch(err => {
            Toast.fail('发生错误');
        })
    };

    render() {
        // const Item = List.Item;
        // const Brief = Item.Brief;
        const tabs = [
            {title: '歌手'},
            {title: 'MV'}
        ]
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
                    >我的收藏</NavBar>

                    {/*tab*/}
                    <div className="m-my-tabs m-my-tabs-collect">
                        <Tabs tabs={tabs} initialPage={0}>
                            <div className="m-my-tabs-search">
                                <List className="m-my-list" renderHeader={
                                    <SearchBar
                                        placeholder="搜索歌手"
                                        maxLength={8}
                                        onChange={(val) => this.searchList(val, 100)}
                                        onClear={() => this.setState({searchSingerList: [], searchSingerVal: ""})}
                                    />}>
                                    {/*{
                    this.state.singerList.map((item, index) => {
                      return (
                        <Item multipleLine key={index}
                              extra={<span className="m-my-list-r"><i className="icon-list-sp"/><i className="icon-more"/></span>}
                              // onClick={() => {this.getCurrenturl(item)}}
                        >
                          <img src={item.picUrl}/><span>{item.name}({item.trans})</span>
                        </Item>
                      )
                    })
                  }*/}
                                    1111111111111111111111
                                </List>
                            </div>
                            <div className="m-my-tabs-search">
                                <List className="m-my-list" renderHeader={
                                    <SearchBar
                                        placeholder="搜索视频"
                                        maxLength={8}
                                        onChange={(val) => this.searchList(val, 1004)}
                                        onClear={() => this.setState({searchMvList: [], searchMvVal: ""})}
                                    />}>
                                    {/*{
                    this.state.listData.map((item, index) => {
                      return (
                        <Item multipleLine key={index}
                              extra={<span className="m-my-list-r"><i className="icon-list-sp"/><i className="icon-more"/></span>}
                              // onClick={() => {this.getCurrenturl(item)}}
                        >
                          <span>{item.name}({item.trans})</span>
                        </Item>
                      )
                    })
                  }*/}
                                    222222222
                                </List>
                            </div>
                        </Tabs>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, dispatch) => {
    return {
        playMusicList: state.playMusic.playMusicList
    }
}
export default connect(mapStateToProps)(CollectLists);
