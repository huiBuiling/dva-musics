import { get } from './request';

// edit uid

//  登录
const admin_signin = ({phone, password}) => {
    return get(`login/cellphone?phone=${phone}&password=${password}`);
}

// 退出
const admin_signout = () => {
    return get('logout');
}

// 刷新登录状态
const login_refresh = () => {
    return get('login/refresh')
}

// 获取登录状态
const login_status = () => {
    return get('login/status');
}

// 个人信息
const admin_detail = (id) => {
    return get(`user/detail?uid=${id}`);
}

// 签到
const daily_signin = () => {
    return get('daily_signin');
}

/**
 * 动态
 * dynamic_list: 动态列表
 * dynamic_user_list: 获取对应用户动态
 * dynamic_liked: 动态点赞
 * dynamic_comments： 评论列表
 * dynamic_comments_liked: 点赞评论
 * dynamic_comments_send: 发送评论
 * dynamic_comments_del： 删除评论
 * dynamic_follows: 获取用户关注列表
 * user_follow: 用户关注，添加取消
 */
const dynamic_list = () => {
    return get('event');
}

const dynamic_user_list = (userId) => {
    return get(`user/event?uid=${userId}`);
}

const dynamic_liked = (id,followed,type) => {
    return get(`resource/like?t=${followed}&type=${type}&id=${id}`)
}

const dynamic_comments = (itemType, id) => {
    if(itemType === 5) {
        return get(`comment/video?id=${id}`)
    } else if(itemType === 0) {
        return get(`comment/music?id=${id}`)
    } else {
        return null;
    }
}

const dynamic_comments_liked = (id, commentId, like, itemType) => {
    return get(`comment/like?id=${id}&cid=${commentId}&t=${like}&type=${itemType}`);
}

const dynamic_comments_del = (followed, itemType, id, commentId) => {
    return get(`comment?t=${followed}&type=${itemType}&id=${id}&commentId=${commentId}`);
}

const dynamic_comments_send = (followed, itemType, id, val) => {
    return get(`comment?t=${followed}&type=${itemType}&id=${id}&content=${val}`);
}

const dynamic_follows = (userId) => {
    return get(`user/follows?uid=${userId}`);
}

const user_follow = (userId, follow) => {
    return get(`follow?id=${userId}&t=${follow}`);
}


/**
 * 推荐 
 * discovery_banner: 轮播图
 * discovery_recommend: 电台推荐
 * personalized_privatecontent: 独家放送
 * personalized_recommend: 每日歌单推荐
 * personalized_newsong: 新音乐推荐
 * personalized_songs: 每日歌曲推荐
 */

const discovery_banner = () => {
    return get('banner');
}

const discovery_recommend = () => {
    return get('dj/recommend');
}

const personalized_privatecontent = () => {
    return get('personalized/privatecontent');
}

const personalized_recommend = () => {
    return get('recommend/resource');
}

const personalized_newsong = () => {
    return get('personalized/newsong');
}

const personalized_songs = () => {
    return get('recommend/songs')
}

/**
 * 电台
 * djprogram_personalized: 电台推荐
 * djprogram_sublist: 已关注的电台
 * djprogram_detail: 详情 rid: 电台的id
 * djprogram_program: 节目
 * djprogram_sub: 订阅
 */
const djprogram_personalized = () => {
    return get('personalized/djprogram');
}

const djprogram_sublist = () => {
    return get('dj/sublist');
}

const djprogram_detail = (id) => {
    return get(`dj/detail?rid=${id}`);
}

const djprogram_program = (id) => {
    return get(`dj/program?rid=${id}&limit=10`);
}

const djprogram_sub = (radioId, t) => {
    return get(`dj/sub?rid=${radioId}&t=${t}`);
}


/**
 * 音乐
 * song_url: 获取歌曲MP3地址
 * video_url: 获取视频MP4地址
 * song_liked: 喜欢
 * song_lyric: 获取歌词
 * artist_list: 歌手列表
 * search_list: 搜索列表
 * play_list: 获取歌单
 * 262606203
 * playlist_liked: 获取喜欢音乐列表
 * playlist_detail_list: 对应歌单详情列表
 * record_list: 获取用户播放记录
 */
const song_url = (id) => {
    return get(`song/url?id=${id}`);
}

const video_url = (id) => {
    return get(`video/url?id=${id}`);
}

const song_liked = (id, live) => {
    return get(`like?id=${id}&like=${!live}`)
}

const song_lyric = (id) => {
    return get(`lyric?id=${id}`)
}

const artist_list = () => {
    return get('artist/sublist');
}

/**
 * 搜索列表
 * type: 搜索类型
    * 1(默认): 单曲, 10: 专辑, 100: 歌手, 
    * 1000: 歌单, 1002: 用户, 1004: MV, 
    * 1006: 歌词, 1009: 电台,
    * 1014: 视频, 1018:综合
 */
const search_list = (val, type = 1) => {
    return get(`search?keywords=${val}&type=${type}`)
}

const play_list = (userId) => {
    return get(`user/playlist?uid=${userId}`);
}

const playlist_liked = (id) => {
    return get(`playlist/detail?id=${id}`);
}

const playlist_detail_list = (id) => {
    return get(`playlist/detail?id=${id}`)
}

const record_list = (userId) => {
    //  type=1 时只返回 weekData, type=0 时返回 allData
    return get(`user/record?uid=${userId}&type=1`)
}


export const api = {
    admin_signin, admin_signout, login_refresh, 
    login_status, admin_detail, daily_signin,

    dynamic_list,  dynamic_user_list, dynamic_liked, 
    dynamic_comments, user_follow, 
    dynamic_comments_liked, dynamic_follows, 
    dynamic_comments_send, dynamic_comments_del,

    discovery_banner, discovery_recommend,

    personalized_privatecontent, personalized_recommend, 
    personalized_newsong, personalized_songs,

    djprogram_personalized, djprogram_sublist,
    djprogram_detail, djprogram_program, djprogram_sub, 

    song_url, video_url, song_liked, song_lyric,
    artist_list, search_list, play_list,
    playlist_liked, playlist_detail_list,
    record_list, 
}