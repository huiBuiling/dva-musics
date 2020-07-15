/**
 * @author hui
 * @date 2019/1/24
 * @Description:
 * @param:
 *  songSheetList       歌单对应歌曲列表
 *  playMusicList       歌曲列表
 *  playMusicCurrent    当前歌曲id,name,imgUrl,url
 *  musicLyrics         当前歌曲歌词
 */
export default {
    namespace: 'playMusic',
    state: {
        songSheetList:[],
        playMusicList: [],
        playMusicCurrent: {
            id: null
        },
        musicLyrics: [],
    },
    reducers: {
        'songSheetList'(state, action) {
            return {
                ...state,
                songSheetList: action.songSheetList,
            };
        },
        'playMusicList'(state, action) {
            return {
                ...state,
                playMusicList: action.playMusicList,
            };
        },
        'delMusic'(state, action) {
            return {
                ...state,
                playMusicList: action.playMusicList,
            };
        },
        'playMusicCurrent'(state, action) {
            //是否有重复
            const len = [...state.playMusicList].filter(item => item.id === action.data.id).length;
            const datas = len > 0 ? [...state.playMusicList] : [...state.playMusicList,action.data];
            return {
                ...state,
                playMusicCurrent: action.data,
                playMusicList: datas
            };
        },
        'musicLyrics'(state, action) {
            return {
                ...state,
                musicLyrics: action.data
            };
        }
    },
    effects: { //这里是做异步处理的
        //歌单对应歌曲列表
        * getSongSheetList({data}, {call, put}) {
            yield put({
                type: 'songSheetList',   //这个就是调用reducers中的方法进行跟新当前命名空间state的数据
                songSheetList: data
            });
        },

        //音樂列表
        * getPlayMusicList({data}, {call, put}) {
            yield put({
                type: 'playMusicList',
                playMusicList: data
            });
        },

        //删除音乐列表某首歌曲
        * delsPlayMusicList({ id, flag }, {select, put}) {
            let data = [];
            if(!flag){
                //获取当前state中的数据 playMusicList
                const playMusicList = yield select(state => state.playMusic.playMusicList);
                data = playMusicList.filter(item => item.id !== id);
            }

            yield put({
                type: 'delMusic',
                playMusicList: data
            });
        },

        //当前播放音乐： id,url
        * getPlayMusicCurrent({data}, {put}) {
            yield put({
                type: 'playMusicCurrent',
                data: data
            });
        },

        //当前音乐歌词
        * getMusicLyrics({data}, {put}) {
            yield put({
                type: 'musicLyrics',
                data: data
            });
        }
    },
    /*subscriptions: {
      setup({ dispatch, history }) {  // 订阅:表示监听当前state的变化
      },
    }*/
};
