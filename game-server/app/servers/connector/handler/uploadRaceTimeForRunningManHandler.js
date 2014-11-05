/**
 * Created by King Lee on 2014/10/17.
 */
var handlerMgr = require("./../handlerMgr");
var consts = require("../../../util/consts");
var pomelo = require('pomelo');
var util = require('../../../util/util');

handlerMgr.handler(consts.TYPE_MSG.TYPE_UPLOAD_RACE_TIME_FOR_RUNNING_MAN, function(msg, session, next) {
    var channel = msg.channel;
    var version = msg.version;
    var device_guid = msg.deviceid;
    var phone_number = msg.phone_number;
    var boss_rank = parseInt(msg.boss_rank);
    var mine_rank = parseInt(msg.my_rank);
    var is_increase_level = msg.is_increase_level;
    //  distance_ahead_2nd meters in front of the second when i was no.1,else the value distance_ahead_2nd is 0
    var distance_ahead_2nd = parseInt(msg.distance_ahead_2nd);
    var is_add_score = msg.is_add_score;
    var championship_id = util.getWeek(new Date());
    var rank_info = {
        channel:channel,
        version:version,
        phone_number:phone_number,
        championship_id:championship_id
    };
    pomelo.app.get('statistics_wrapper').requestsRankInAllIncForRunningMan();
    pomelo.app.get('statistics_wrapper').requestsRankPerDayIncForRunningMan();

    var activity = {};
    var activity_wrapper = pomelo.app.get('activity_wrapper');
    activity_wrapper.get(channel,version,function(activity_json) {
        for (var v in activity_json) {
            if (consts.TYPE_ACTIVITY.RIVAL_SEOUL == parseInt(activity_json[v].type)) {
                activity = activity_json[v];
                var rival_score = activity.rival_score;
                var rival_score_boss = activity.rival_score_boss;
                var finally_score = 0;
                if(0 == boss_rank || mine_rank > boss_rank){
                    finally_score  = rival_score.length >= mine_rank ? rival_score[mine_rank - 1]:0;
                }else{
                    finally_score  = rival_score_boss.length >= mine_rank ? rival_score_boss[mine_rank - 1]:0;
                }

                //  calc increase_level_num
                var increase_level_num = 0;
                increase_level_num = activity.level_step_increase[mine_rank - 1];
                if(1 == mine_rank){
                    increase_level_num += Math.floor(distance_ahead_2nd/activity.level_step_value);
                }
                var rank_running_man_wrapper = pomelo.app.get('rank_running_man_wrapper');
                if("true" == is_increase_level){
                    rank_running_man_wrapper.increase_level(championship_id,device_guid,increase_level_num);
                }
                rank_running_man_wrapper.add_rank_info(championship_id,device_guid,is_add_score,finally_score,rank_info,function(result){
                    rank_running_man_wrapper.get_rank(championship_id,device_guid,function(reply){
                        next(null, {
                            code: 0,
                            msg_id: msg.msg_id,
                            flowid: msg.flowid,
                            championship_id:championship_id,
                            rank:reply[0] != null ? parseInt(reply[0]) + 1: reply[0],
                            score:reply[1] != null ? parseInt(reply[1]): reply[1],
                            player_number:reply[3] != null ? reply[3]: 0,
                            time: Math.floor(Date.now() / 1000)
                        });
                    });
                });
            }
        }
    });
});
