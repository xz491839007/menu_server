var moment = require('moment');
/**
 * 管理用户类
 * */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define("shop",{
        id:{
            type:DataTypes.INTEGER,
            allowNull:false,///非空
            autoIncrement:true,//自动递增
            primaryKey:true//主键
        },
        shopAccount:{
            type:DataTypes.STRING(20),
            allowNull:false,///非空
            // validate: {min: 7, max: 15}
        },
        shopName:{
            type:DataTypes.STRING(50),
            allowNull:false,///非空
        },
        shopAddress:{
            type:DataTypes.STRING(100)
        },
        leg:{
            type:DataTypes.STRING(11)
        },
        lng:{
            type:DataTypes.STRING(11)
        },
        zone_code:{
            type:DataTypes.STRING(7)
        },
        shopLab:{
            type:DataTypes.STRING(200)
        },
        shopType:{
            type:DataTypes.STRING(5)
        },
        shopTel:{
            type:DataTypes.STRING(15)
        },
        shopSouce:{
            type:DataTypes.INTEGER
        },
        shopImg:{
            type:DataTypes.STRING(15)
        },
        shopRemark:{
            type:DataTypes.STRING(200)
        },
        creatTime:{
            type:DataTypes.DATE,
            get(){
                return moment(this.getDataValue('creatTime')).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        updateTime:{
            type:DataTypes.DATE,
            get(){
                return moment(this.getDataValue('updateTime')).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        dealTime:{
            type:DataTypes.DATE,
            get(){
                return moment(this.getDataValue('dealTime')).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        userId:{
            type:DataTypes.INTEGER
        },
        cardImg:{
            type:DataTypes.STRING(50)
        },
        del_type:{
            type:DataTypes.INTEGER
        }
    }, {
        tableName: 'shop',
        timestamps: false,
        validate: {

        }
    });

}