/**
 * 模型关联类
 */

var { sequelize,Sequelize } = require("../dao/db");
var admin = sequelize.import('admin')
var shop = sequelize.import('shop')

//创建表
sequelize.sync({ force: false });