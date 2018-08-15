var express = require('express');
var router = express.Router();
var { sequelize,Sequelize } = require("../dao/db");
var Task = sequelize.import('../model/task');
var utils = require('../utils/messageJson');
// const {gt, lte, ne, in: opIn} = Sequelize.Op;
var Op = Sequelize.Op;
// var models = require('../model/')
// var Admin = sequelize.import('../model/admin');
// 任务列表
/**
 * 1.添加一个任务
 * @params:page 字典
 * @params:
 */
router.post('/addtask',function (req,res,next) {
    if (req.body.task_name)
    {
        if (!req.body.user_id || !req.body.score || !req.body.is_repeat) {
            res.json({
                status:2,
                message:'参数异常'
            })
        }
        else {
            //
            let type
            let beginTime = new Date(req.body.begin_time)
            let endTime = new Date(req.body.end_time)
            if (!beginTime || !endTime) {
                res.json({
                    status:2,
                    message:'参数异常'
                })
            }
            let nowTime = new Date()
            let duration = nowTime.getTime() - beginTime.getTime()
            let leater = nowTime.getTime() - endTime.getTime()
            let dur = endTime.getTime() - beginTime.getTime()
            dur = dur / 1000
            if (duration < 0){
                // 准备执行 当前时间 小于 开始时间
                type = 1
            } else {
                if (leater > 0)
                {
                    // 超时
                    type = 3
                }
                else {
                    // 正在执行
                    type = 2
                }
            }
            // 数据库添加一条信息
            Task.create({
                task_name:req.body.task_name,
                task_introduce:req.body.task_introduce,
                begin_time:beginTime,
                end_time:endTime,
                duration:dur,
                is_repeat:req.body.is_repeat,
                repeat_rate:req.body.repeat_rate,
                score:req.body.score,
                important:req.body.important,
                category:req.body.category,
                user_id:req.body.user_id,
                del_type:type
            }).then(function (data) {
                res.json({
                    status:1,
                    message:'获取成功'
                })
            }).catch(function (error) {
                res.json({
                    status:3,
                    message:'添加失败'
                })
            });

        }
    }
    else {
        res.json({
            status:2,
            message:'参数异常'
        })
    }

});

/**
 * 2.修改一个任务
 * @params:page 字典
 * @params:
 */
router.post('/eaittask',function (req,res,next) {
    if (req.body.id) {
        let now_time = new Date();
        let last_time = new Date(req.body.end_time);
        Task.update({
            task_name:req.body.task_name,
            task_introduce:req.body.task_introduce,
            begin_time:req.body.begin_time,
            end_time:req.body.end_time,
            duration:req.body.duration,
            is_repeat:req.body.is_repeat,
            repeat_rate:req.body.repeat_rate,
            score:req.body.score,
            important:req.body.important,
            category:req.body.category,
            user_id:req.body.user_id,
            del_type:req.body.del_type,
        },{
            where:{
                id: req.body.id
            }
        }).then(function (updata_results) {
            res.json({
                status:1,
                message:'获取成功'
            })
        }).catch(function (error) {
            res.json({
                status:0,
                message:'操作错误'
            });
        })
    }else {
        res.json({
            status:2,
            message:'修改失败'
        })
    }
});

/**
 * 3.查询用户的能量数
 * */
router.get('/getUserScore',function (req,res,next) {
    if (req.query.userId) {
        Task.sum('result',{
            where:{
                user_id:req.query.userId
            }
        }).then(function (data) {
            Task.findAndCountAll({
                where:{
                    user_id:req.query.userId
                }
            }).then(function (find_data) {
                res.json({
                    status:1,
                    message:'查询成功',
                    score:data,
                    count:find_data.count,
                    data:find_data.rows
                })
            })
        })

    }else {
        res.json({
            status:2,
            message:'查询失败'
        })
    }

})

/**
 * 4.查询全部任务
 * @params:page 任务
 * @params:
 */
router.get('/querytask',function (req,res,next) {
    // 按时间排序
    if (req.query.userId) {
        let type
        if (req.query.isAll) {
            type = {
                user_id:req.query.userId
            }
        } else {
            type = {
                user_id:req.query.userId,
                del_type: {
                    [Op.notBetween]: [4,5]
                }
            }
        }
        // 按结束时间从近到远->排序
        Task.findAll({
            order:[
                ['important','DESC'],
                ['end_time','ASC']
            ],
            where: type
        }).then(function (data) {
            res.json({
                status:1,
                message:'查询成功',
                data:data
            })
        }).then(function (erro) {
            if (erro) {
                res.json({
                    status:2,
                    message:'查询错误'
                })
            }
        })

    }else {
        res.json({
            status:2,
            message:'查询失败'
        })
    }
})

/**
 * 5.完成任务
 * @params:page 任务
 * @params:
 */
router.post('/finishtask',function (req,res,next){

    if (req.body.id) {
        let now_time = new Date();
        let last_time = new Date(req.body.end_time);
        let result = return_result(now_time,last_time,req.body.score,req.body.assess);
        Task.update({
            task_remark:req.body.task_remark,
            assess:req.body.assess*2,
            del_type:4,
            result_time:now_time,
            result: result
        },{
            where:{
                id: req.body.id
            }
        }).then(function (updata_results) {
            res.json({
                status:1,
                message:'完成任务成功'
            })
        }).catch(function (error) {
            res.json({
                status:0,
                message:'操作错误'
            });
        })
    }else {
        res.json({
            status:2,
            message:'完成失败'
        })
    }
})
/**
 * 6.删除任务
 * @params:page 任务对象
 * @params:
 */
router.post('/deltask',function (req,res,next){
    if (req.body.id) {
        let now_time = new Date();
        let last_time = new Date(req.body.end_time);
        // 删除时会自动默认评分为0分
        let result = return_result(now_time,last_time,req.body.score,0);
        Task.update({
            assess:0,
            del_type:5,
            result_time:now_time,
            result: result
        },{
            where:{
                id: req.body.id
            }
        }).then(function (updata_results) {
            res.json({
                status:1,
                message:'删除任务成功'
            })
        }).catch(function (error) {
            res.json({
                status:0,
                message:'操作错误'
            });
        })
    }else {
        res.json({
            status:2,
            message:'完成失败'
        })
    }
})

module.exports = router;
