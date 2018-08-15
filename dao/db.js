const Sequelize = require('sequelize');
const defines = require('../config/define')

const sequelize = new Sequelize(defines.database,defines.user,defines.password,{
    host:defines.host,
    dialect:'mysql',
    timezone: '+08:00',///时区设成东
    operatorsAliases :false,
    port:63144,///端口
    pool:{
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 100000
    }
});

///测试连接
sequelize.authenticate().then(function () {
    console.log("数据库连接成功");
}).catch(function (err) {
    //数据库连接失败时打印输出
    console.error(err);
    throw err;
});

exports.sequelize = sequelize;
exports.Sequelize = Sequelize;