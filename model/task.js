var moment = require('moment');
/**
 * 任务类
 * */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define("task",{
        id:{
            type:DataTypes.INTEGER,
            allowNull:false,///非空
            autoIncrement:true,//自动递增
            primaryKey:true//主键
        },
        task_name:{
            type:DataTypes.STRING(100),
            // validate: {min: 7, max: 15}
        },
        task_remark:{
            type:DataTypes.STRING(100),
        },
        task_introduce:{
            type:DataTypes.STRING(200),
        },
        begin_time:{
            type:DataTypes.DATE,
            get(){
                return moment(this.getDataValue('begin_time')).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        end_time:{
            type:DataTypes.DATE,
            get(){
                return moment(this.getDataValue('end_time')).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        result_time:{
            type:DataTypes.DATE,
            get(){
                return moment(this.getDataValue('result_time')).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        is_repeat:{
            type:DataTypes.INTEGER
        },
        repeat_rate:{
            type:DataTypes.INTEGER
        },
        duration:{
            type:DataTypes.STRING(11)
        },
        score:{
            type:DataTypes.INTEGER
        },
        result:{
            type:DataTypes.INTEGER
        },
        important:{
            type:DataTypes.INTEGER
        },
        category:{
            type:DataTypes.STRING(50)
        },
        user_id:{
            type:DataTypes.INTEGER
        },
        assess:{
            // 完成后评分
            type:DataTypes.INTEGER
        },
        del_type:{
            type:DataTypes.INTEGER
        }
    }, {
        tableName: 'task',
        timestamps: false,
        validate: {

        }
    });

}