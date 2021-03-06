/**
 * Created by King Lee on 2014/7/21.
 */
var redis_statistics_wrapper = require('../nosql/redis_statistics_wrapper');
var pomelo = require('pomelo');
var cluster = require('cluster');

var statistics_wrapper = function() {
    this.time_interval = 1000*60;
    this.trigger_time_hour = 9;
    this.trigger_time_minutes = 0;
    this.requests_in_all = 0;
    this.requests_per_day = 0;
    this.requests_per_hour = 0;
    this.requests_per_minute = 0;
    this.requests_sign_in_all = 0;
    this.requests_sign_per_day = 0;
    this.requests_rank_in_all = 0;
    this.requests_rank_per_day = 0;
    this.requests_rank_in_all_for_running_man = 0;
    this.requests_rank_per_day_for_running_man = 0;
    this.tick();
};

statistics_wrapper.prototype.tick = function(){
    var self = this;
    setInterval(function(){
        // Fetch the computer's mac address
        require('getmac').getMac(function(err,mac_address){
            if (err)  {
                console.log(err);
            }
            var date = new Date();
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var work_id = 0;
            if (cluster.isMaster) {
                work_id = 0;
            } else if (cluster.isWorker) {
                work_id = cluster.worker.id;
            }
            if(hours == self.trigger_time_hour && minutes == self.trigger_time_minutes)
            {
                //  in all & per day
                redis_statistics_wrapper.set(mac_address + ":" + "requests_in_all" +  ":" + work_id,self.requests_in_all);
                redis_statistics_wrapper.set(mac_address + ":" + "requests_sign_in_all"+  ":" + work_id,self.requests_sign_in_all);
                redis_statistics_wrapper.set(mac_address + ":" + "requests_rank_in_all"+  ":" + work_id,self.requests_rank_in_all);
                redis_statistics_wrapper.set(mac_address + ":" + "requests_rank_in_all_for_running_man"+  ":" + work_id,self.requests_rank_in_all_for_running_man);

                redis_statistics_wrapper.set(mac_address + ":" + "requests_per_day"+  ":" + work_id,self.requests_per_day);
                self.requestsPerDayClear();

                redis_statistics_wrapper.set(mac_address + ":" + "requests_sign_per_day"+  ":" + work_id,self.requests_sign_per_day);
                self.requestsSignPerDayClear();

                redis_statistics_wrapper.set(mac_address + ":" + "requests_rank_per_day"+  ":" + work_id,self.requests_rank_per_day);
                self.requestsRankPerDayClear();

                redis_statistics_wrapper.set(mac_address + ":" + "requests_rank_per_day_for_running_man"+  ":" + work_id,self.requests_rank_per_day_for_running_man);
                self.requestsRankPerDayClearForRunningMan();
            }
            if(minutes == self.trigger_time_minutes)
            {
                //  per hour
                redis_statistics_wrapper.set(mac_address + ":" + "requests_per_hour"+  ":" + work_id,self.requests_per_hour);
                self.requestsPerHourClear();
            }
            redis_statistics_wrapper.set(mac_address + ":" + "requests_per_minute"+  ":" + work_id,self.requests_per_minute);
            self.requestsPerMiniuteClear();

            redis_statistics_wrapper.set(mac_address + ":" + "redis_count_per_minute"+  ":" + work_id,redis_statistics_wrapper.get_redis_count_statistics());
            redis_statistics_wrapper.reset_redis_count_statistics();
        });
    },this.time_interval);
};

statistics_wrapper.prototype.requestsInAllInc = function() {
    ++this.requests_in_all;
};

statistics_wrapper.prototype.requestsInAll = function() {
    return this.requests_in_all;
};

statistics_wrapper.prototype.requestsPerDayInc = function() {
    ++this.requests_per_day;
};

statistics_wrapper.prototype.requestsPerDay = function() {
    return this.requests_per_day;
};

statistics_wrapper.prototype.requestsPerDayClear = function() {
    this.requests_per_day = 0;
};

statistics_wrapper.prototype.requestsPerHourInc = function() {
    ++this.requests_per_hour;
};
statistics_wrapper.prototype.requestsPerHour = function() {
    return this.requests_per_hour;
};

statistics_wrapper.prototype.requestsPerHourClear = function() {
    this.requests_per_hour = 0;
};

statistics_wrapper.prototype.requestsPerMinuteInc = function() {
    ++this.requests_per_minute;
};

statistics_wrapper.prototype.requestsPerMinute = function() {
    return this.requests_per_minute;
};

statistics_wrapper.prototype.requestsPerMiniuteClear = function() {
    this.requests_per_minute = 0;
};

statistics_wrapper.prototype.requestsSignInAllInc = function() {
    ++this.requests_sign_in_all;
};

statistics_wrapper.prototype.requestsSignInAll = function() {
    return this.requests_sign_in_all;
};

statistics_wrapper.prototype.requestsSignPerDayInc = function() {
    ++this.requests_sign_per_day;
};

statistics_wrapper.prototype.requestsSignPerDay = function() {
    return this.requests_sign_per_day;
};

statistics_wrapper.prototype.requestsSignPerDayClear = function() {
    this.requests_sign_per_day = 0;
};

statistics_wrapper.prototype.requestsRankInAllInc = function() {
    ++this.requests_rank_in_all;
};

statistics_wrapper.prototype.requestsRankPerDayInc = function() {
    ++this.requests_rank_per_day;
};

statistics_wrapper.prototype.requestsRankInAllIncForRunningMan = function() {
    ++this.requests_rank_in_all_for_running_man;
};

statistics_wrapper.prototype.requestsRankPerDayIncForRunningMan = function() {
    ++this.requests_rank_per_day_for_running_man;
};

statistics_wrapper.prototype.requestsRankInAllIncForRunningMan = function() {
    ++this.requests_rank_in_all_for_running_man;
};

statistics_wrapper.prototype.requestsRankPerDayIncForRunningMan = function() {
    ++this.requests_rank_per_day_for_running_man;
};

statistics_wrapper.prototype.requestsRankPerDayClear = function() {
    this.requests_rank_per_day = 0;
};

statistics_wrapper.prototype.requestsRankPerDayClearForRunningMan = function() {
    this.requests_rank_per_day_for_running_man = 0;
};

statistics_wrapper.prototype.statistics_device = function(device_guid) {
    redis_statistics_wrapper.statistics_device(device_guid);
};
module.exports = statistics_wrapper;