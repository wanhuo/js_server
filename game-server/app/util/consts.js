/**
 * Created by King Lee on 14-4-15.
 */
module.exports = {
    //  the message type communicated with server,client must define something similar.
    TYPE_MSG:{
        TYPE_MSG_BEGIN :1,
        TYPE_MSG_GET_SRV_TIME:3,
        TYPE_MSG_MAIL:4,
        TYPE_GET_ACTIVITY:5,
        TYPE_GET_NOTICE:6,
        TYPE_UPLOAD_RACE_TIME:7,
        TYPE_GET_RACE_RANK:8,
        TYPE_GET_UPLOAD_PLAYER_SCORES:9,
        TYPE_GET_OPPONENT_INFO:10,
        TYPE_NAMING:11,
        TYPE_GET_PLAYER_INFO:12,
        TYPE_MSG_END:100
    },
    TYPE_ACTIVITY:{
        TYPE_DAILY_SIGN:1, 	    //// 每日签到
        TYPE_DROP_ITEM:2,		//// 物品掉落
        TYPE_TASK:3			    //// 每日任务
    }
};