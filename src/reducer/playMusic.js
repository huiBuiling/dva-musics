/**
 * @author hui
 * @date 2019/1/24
 * @Description: playMusic
*/
export default {
  namespace: 'playMusic',
  state: {
    playMusicList:[],
    playMusicCurrent:null,
    musicLyrics:[]
  },
  reducers: {
    'playMusicList'(state, data) {
      return {
        playMusicList:data.playMusicList,
      };
    },
    'playMusicCurrent'(state,data){
      return{
        ...state,
        playMusicCurrent:data.data
      }
    },
    'musicLyrics'(state,data){
      return {
        ...state,
        musicLyrics:data.data
      }
    }
  },
  effects: { //这里是做异步处理的
    //音樂列表
    *getPlayMusicList({ data}, { call, put }) {
      yield put({
        type: 'playMusicList',   //这个就是调用reducers中的方法进行跟新当前命名空间state的数据
        playMusicList:data
      });
    },
    //當前播放音樂：id,url
    *getPlayMusicCurrent({data}, { put }) {
      yield put({
        type: 'playMusicCurrent',
        data:data
      });
    },

    //当前音乐歌词
    *getMusicLyrics({data},{put}){
      yield put({
        type: 'musicLyrics',
        data:data
      });
    }
  },
  /*subscriptions: {
    setup({ dispatch, history }) {  // 订阅:表示监听当前state的变化
    },
  }*/
};
