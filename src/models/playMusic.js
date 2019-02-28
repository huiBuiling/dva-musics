/**
 * @author hui
 * @date 2019/1/24
 * @Description:
 * @param:
 *  playMusicList歌曲列表
 *  playMusicCurrent当前歌曲id,name,imgUrl,url
 *  musicLyrics当前歌曲歌词
*/
export default {
  namespace: 'playMusic',
  state: {
    playMusicList:[],
    playMusicCurrent:{
      id:null
    },
    musicLyrics:[]
  },
  reducers: {
    'playMusicList'(state, action) {
      return {
        playMusicList:action.playMusicList,
      };
    },
    'playMusicCurrent'(state,action){
      return{
        ...state,
        playMusicCurrent:action.data
      }
    },
    'musicLyrics'(state,action){
      return {
        ...state,
        musicLyrics:action.data
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
