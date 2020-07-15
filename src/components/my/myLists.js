import React, {Component} from 'react';
import {Badge, Icon, List, NavBar, SearchBar, Tabs, Toast} from 'antd-mobile';
import {connect} from 'dva';
import { api } from "../../utils/api";

/**
 * @author hui
 * @date 2019/1/16
 * @Description: Lists
 */
class MyLists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: [
                {
                    name: '打上花火',
                    size: '11.0M',
                    singer: 'DAOKO/米津玄师',
                },
                {
                    name: 'Minions Pick up Right Now',
                    size: '0.4M',
                    singer: 'The Funny Tone Guy',
                },
                {
                    name: '当你',
                    size: '9.5M',
                    singer: '回音哥',
                },
            ],
            searchList: [],    //查詢結果
            val: "",           //查詢內容
        }
    }

    componentDidMount() {
        //刷新后至 -> music
        if (this.props.songSheetList.length === 0) {
            this.props.history.push('/music');
        }
    }

    //搜索音樂
    searchMusic = (val) => {
        api.search_list(val).then(res => {
            if (res.code === 200) {
                this.setState({
                    searchList: res.result.songs,
                    val
                })
            }
        })
    }

    //获取歌曲MP3地址
    getCurrentUrl = (item) => {
        let live = this.props.liveList.filter(itemL =>itemL.id === item.id).length > 0 ? true : false;
        api.song_url(item.id).then(res => {
            if (res.code === 200) {
                this.props.dispatch({
                    type: 'playMusic/getPlayMusicCurrent',
                    data: {
                        url: res.data[0].url,
                        id: item.id,
                        name: item.name,
                        imgUrl: item.al.picUrl,
                        live: live,
                        isPlay:true
                    }
                });
                this.props.history.push('/playMusic');
            }
        }).catch(err => {
            Toast.fail('发生错误');
        });
    }

    //播放全部
    playAll = ()=>{
        const { songSheetList } = this.props;
        this.props.dispatch({
            type:'playMusic/getPlayMusicList',
            data:songSheetList
        });

        this.getCurrentUrl(songSheetList[0])
    }

    render() {
        const Item = List.Item;
        const Brief = Item.Brief;
        const {searchList, val} = this.state;
        const dataList = val === "" ? this.props.songSheetList : searchList;
        const tabs = [
            {title: <Badge text={dataList.length}>歌曲</Badge>},
            {title: <Badge dot>歌手</Badge>},
            {title: <Badge dot>专辑</Badge>},
        ]
        return (
            <div className='m-my'>
                <div className="m-my-all" style={{overflow: 'hidden'}}>
                    {/*top*/}
                    <NavBar
                        mode="light"
                        icon={<Icon type="left"/>}
                        onLeftClick={() => this.props.history.push('/music')}
                        rightContent={<span onClick={() => {
                            this.props.history.push('playMusic')
                        }}><i className="icon-m-bfz"/></span>}
                    >我的音乐</NavBar>

                    {/*tab*/}
                    <div className="m-my-tabs m-my-tabs-list">
                        <Tabs tabs={tabs}
                              initialPage={0}
                            /*onChange={(tab, index) => {
                              console.log('onChange', index, tab);
                            }}
                            onTabClick={(tab, index) => {
                              console.log('onTabClick', index, tab);
                            }}*/
                        >
                            <div className="m-my-tabs-search">
                                <List className="m-my-list" renderHeader={
                                    <SearchBar
                                        placeholder="Search"
                                        maxLength={8}
                                        onChange={this.searchMusic}
                                        onClear={() => this.setState({searchList: [], val: ""})}
                                    />}>
                                    <div className="m-my-list-top">
                                        <span className="m-my-list-top-num">共 {dataList.length} 首</span>
                                        <span style={{float:'right'}} onClick={this.playAll}><i className="icon-s-all-bg"/> 播放全部</span>
                                    </div>
                                    {dataList.length > 0 && dataList.map((item, index) => {
                                        return (
                                            <Item multipleLine key={index}
                                                  extra={<span className="m-my-list-r">
                                                  {item.mv !== 0 && <i className="icon-list-sp"/>}
                                                  <i className="icon-more"/></span>}
                                                  onClick={() => {
                                                      this.getCurrentUrl(item)
                                                  }}
                                            >
                                                <span>{item.name}</span>
                                                <Brief>{val === "" ? item.ar[0].name : item.artists[0].name}<span></span> - <span>{item.al.name}</span></Brief>
                                            </Item>
                                        )
                                    })}
                                </List>
                            </div>
                            <div className="m-my-tabs-search">
                                <List className="m-my-list"
                                      renderHeader={<SearchBar placeholder="Search" maxLength={8}/>}>
                                    {
                                        this.state.listData.map((item, index) => {
                                            return (
                                                <Item multipleLine key={index}
                                                      extra={<span className="m-my-list-r"><i className="icon-list-sp"/><i
                                                          className="icon-more"/></span>}
                                                      onClick={() => {
                                                          this.getCurrentUrl(item)
                                                      }}
                                                >
                                                    <span>{item.name}</span>
                                                    <Brief><span>{item.size}</span> - <span>{item.singer}</span></Brief>
                                                </Item>
                                            )
                                        })
                                    }
                                </List>
                            </div>
                            <div className="m-my-tabs-search">
                                <List className="m-my-list"
                                      renderHeader={<SearchBar placeholder="Search" maxLength={8}/>}>
                                    {
                                        this.state.listData.map((item, index) => {
                                            return (
                                                <Item multipleLine key={index}
                                                      extra={<span className="m-my-list-r"><i className="icon-list-sp"/><i
                                                          className="icon-more"/></span>}>
                                                    <span>{item.name}</span>
                                                    <Brief><span>{item.size}</span> - <span>{item.singer}</span></Brief>
                                                </Item>
                                            )
                                        })
                                    }
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
        songSheetList: state.playMusic.songSheetList,
        liveList: state.users.liveList
    }
}
export default connect(mapStateToProps)(MyLists);
