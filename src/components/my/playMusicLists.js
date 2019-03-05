import React, {Component} from 'react';
import {connect} from 'dva';
import {withRouter} from 'dva/router';
import cricle from '../../assets/images/cricle.png';
import cricleUn from '../../assets/images/uncricle.png';

/**
 * @author hui
 * @date 2019/1/22
 * @Description: playMusic lists
 */
@withRouter
class PlayMusicLists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            percent: 50
        }
    }

    //移除某一首歌曲
    delList = (id) => {
        //判断是否全部清空或最后一个
        if (this.props.playMusicList.length === 1) {
            const audio = document.getElementById('audio');
            audio.pause();
            audio.src = null;
            this.props.history.push(`/lists`);
        }

        this.props.dispatch({
            type: 'playMusic/delsPlayMusicList',
            id: id,
            flag: false
        })
    }

    //清空全部
    delListAll = () => {
        const audio = document.getElementById('audio');
        audio.pause();
        audio.src = null;
        this.props.history.push(`/lists`);

        //清空数据
        this.props.dispatch({
            type: 'playMusic/delsPlayMusicList',
            id: null,
            flag: true
        })
    }

    render() {
        const {current, playMusicCurrent} = this.props;
        const dataList = this.props.playMusicList;
        let currentMusic = 0;
        dataList.filter((item, index) => {
            if (item.id === current.id) {
                currentMusic = index;
            }
        });
        return (
            <div className="m-my-play-list">
                <div className="m-my-play-list-t">
                    <div className="m-my-play-list-t-t">
                        <span className="fl"><i className="icon-bf-list-xh"/>列表循环</span>
                        <span className="fr">
                            <span><i className="icon-bf-list-sc"/>收藏</span>
                            <span onClick={this.delListAll}><i className="icon-bf-list-del"/></span>
                        </span>
                    </div>
                    <div className="m-my-play-list-t-b">
                        <ul>
                            {dataList.map((item, index) => {
                                return <li key={index}
                                           className={currentMusic === index ? "active" : ""}
                                >
                                    <div onClick={() => {
                                        this.props.checkMusic(null, item.id);
                                        this.setState({isActive: index});
                                    }}>
                                        <span><img src={currentMusic === index ? cricle : cricleUn} alt=""/>{item.name}</span>
                                        {/*{playMusicCurrent.station === null || playMusicCurrent.station === undefined &&
                                           <span className="singer"> - {item.ar[0].name}</span>
                                        }*/}
                                    </div>
                                    <span onClick={() => {
                                        this.delList(item.id)
                                    }}>
                                        <i className="icon-close2"/>
                                    </span>
                                </li>
                            })}
                        </ul>
                    </div>
                </div>

                <div className="m-my-play-list-close" onClick={this.props.close}>
                    <span>关闭</span>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, dispatch) => {
    return {
        playMusicList: state.playMusic.playMusicList,
        playMusicCurrent: state.playMusic.playMusicCurrent
    }
}
export default connect(mapStateToProps)(PlayMusicLists);
