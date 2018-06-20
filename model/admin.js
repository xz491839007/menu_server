var moment = require('moment');
/**
 * 管理用户类
 * */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define("admin",{
        id:{
            type:DataTypes.INTEGER,
            allowNull:false,///非空
            autoIncrement:true,//自动递增
            primaryKey:true//主键
        },
        phone:{
            type:DataTypes.STRING(15),
            allowNull:false,///非空
            // validate: {min: 7, max: 15}
        },
        account:{
            type:DataTypes.STRING(50)
        },
        pass_word:{
            type:DataTypes.STRING(20)
        },
        email:{
            type:DataTypes.STRING(20)
        },
        creating_date:{
            type:DataTypes.DATE,
            get(){
                return moment(this.getDataValue('creating_date')).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        update_date:{
            type:DataTypes.DATE,
            get(){
                return moment(this.getDataValue('update_date')).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        role:{
            type:DataTypes.INTEGER
        },
        shopId:{
            type:DataTypes.INTEGER
        },
        image:{
            type:DataTypes.STRING(20)
        },
        name:{
            type:DataTypes.STRING(50)
        },
        card_no:{
            type:DataTypes.INTEGER
        },
        card_type:{
            type:DataTypes.STRING(10)
        },
        gender:{
            type:DataTypes.INTEGER
        },
        version:{
            type:DataTypes.STRING(50)
        },
        del_type:{
            type:DataTypes.INTEGER
        },
    }, {
        tableName: 'admin',
        timestamps: false,
        validate: {

        }
    });

}