var express = require('express');
var router = express.Router();
var debug = require('debug');
var moment = require('moment');
var { sequelize,Sequelize } = require("../dao/db");
var models = require('../model/')
var Admin = sequelize.import('../model/admin');
var Shop = sequelize.import('../model/shop');
// var Admin = require('../model/admin');

/* GET home page. */
router.get('/', function(req, res, next) {
    debug("======开始访问api路由=====");
    // res.send("-------------");
    //    访问数据库
    // db('select * from hello',function (data) {
    //     console.log(data);
    //     res.send(data);
    //     debug(data);
    // });

});


/**
 * 1.查询全部用户(分页查询)
 * @params:page 字典
 * @params:
 */
router.get('/queryadmin',function (req,res,next) {
    // 先经过校验，然后开始分页查询
    let page ,pageSize ='',query ='';
    if (req.query.pageIndex){
        // 判断page字典不为空
        page = req.query.pageIndex;
        pageSize = req.query.pageSize;
    }
    if (req.query.queryTerm)
    {
        ///如果有条件查询的情况
        query = req.query.queryTerm
    }
    Admin.findAndCountAll({
        attributes: ['id','phone','account','email','creating_date','update_date','role','shopId','image','name','card_no','card_type','gender','version','del_type'],
        where:query,//获取全部，也可以自己添加条件
        // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，
        // 则现在为索引为10，也就是从第11条开始返回数据条目
        offset:(page - 1)*pageSize,
        limit:parseInt(pageSize)  //每页限制返回的数据条数
    }).then(function (results) {
        let pages = {'pageIndex':page,'total':results.count,'pageSize':pageSize}
        res.json({
                status:1,
                data:results.rows,
                message:'success',
                page:pages
            }
        );
    }).then(function (error) {
        if (error)
        {
            res.json({
                    status:2,
                    data:'',
                    message:'访问错误，请稍后再试',
                    page:''
                }
            );
        }
    },).catch(next);
});

/**
 * 2.添加并修改用户
 * @params:page 字典
 * @params:
 */
router.post('/addadmin',function (req,res,next) {
    ///新添用户http://localhost:3000/api/addadmin?phone=13112345679&account=xz&pass_word=1
    if (req.body.phone &&
        req.body.account){
        // 查询账号是否唯一
        Admin.findAll({
            where:{
                account:req.body.account,
            }
        }).then(function (data) {
            if (data.length !== 0) {
                // 当前账号已经添加过了
                res.json({ status: 2, msg: '添加失败，账号已经被使用'});
            }
            else {
                // 数据库添加一条信息
                Admin.create({
                    phone:req.body.phone,
                    account:req.body.account,
                    pass_word:req.body.pass_word,
                    email:req.body.email,
                    creating_date:moment.now(),
                    update_date:moment.now(),
                    role:req.body.role,
                    image:req.body.image,
                    name:req.body.name,
                    gender:req.body.gender,
                    version:req.body.version,
                    shopId:req.body.shopId,
                    card_no:req.body.card_no,
                    caed_type:req.card_type,
                    del_type:1
                }).then(function (data) {
                    res.json({ status: 1, msg: '添加成功', result: data });
                }).catch(function (error) {
                    console.log(error);
                });
            }
        })
    }
    else {
        res.json({
            status:0,
            message:'添加失败'
        });
    }
})

/**
 * 3.登录用户
 * @params:page 字典
 * @params:
 */
router.post('/login',function (req,res,next) {
    if (req.body.account)
    {
        ///登陆请求 后期一定要把他迁移到其他接口上面去

        /*req.params获取pathinfo中参数 /api/users/:id
            req.query获取url的查询参数 /api/users?name=wwx 这个是get请求
            req.body获取form提交参数 这是post请求
        * */
        //当输入账号的时候才能进入
        //进行校验
        Admin.findAll({
            where:{
                account: req.body.account
            }
        }).then(function (results) {
            if (results.length !== 0)
            {
                let result = results[0].dataValues;
                console.log(req.body.ip);
                /*
                * 2018.6.7 日完成了对删除数据进行修订bug
                * 2.第二阶段考虑加密和解密
                * 3.第三阶段考虑增加定位信息
                * 4.第四阶段考虑增加权限
                * */
                if (result.del_type !== 1)
                {
                    res.json({
                        status:0,
                        message:'暂无此用户,请联系管理员'
                    });
                }
                else {
                    Admin.update({update_date : moment.now()},{
                        where:{
                            account: req.body.account
                        }}).then(function (updata_results) {
                        console.log(updata_results);
                        res.json({
                            status:1,
                            message:'查询成功',
                            data:{
                                id: result.id,
                                phone: result.phone,
                                account: result.account,
                                email: result.email,
                                // creating_date: result.creating_date,
                                // update_date: result.update_date,
                                role: result.role,
                                image: result.image,
                                gender: result.gender,
                                name: result.name,
                                card_no :result.card_no,
                                card_type: result.card_type
                            }
                        })
                    });
                }

            }
            else {
                res.json({
                    status:0,
                    message:'暂无此用户'
                });
            }
        }).catch(next)
    }

})

/**
 * 4.修改用户
 * 修改用户包含了修改和删除两种方式，为了方便数据的传输，特别设置了判别标志位
 * @params:type 1.修改用户信息 2.逻辑删除用户 3.逻辑回复该用户
 * @params:
 */
router.post('/editadmin',function (req,res,next) {
    //修改用户资料，并且逻辑删除用户资料
    if (req.body.type === 1)
    {
        // 整体更新
        Admin.update({phone: req.body.data.phone,
            pass_word:req.body.data.pass_word,
            email:req.body.data.email,
            update_date : moment.now(),
            name: req.body.data.name,
            card_no: req.body.data.card_no,
            card_type: req.body.data.card_type,
            gender: req.body.data.gender},{
            where:{
                id: req.body.data.id
            }}).then(function (updata_results) {
            res.json({
                status:1,
                message:'success'
            });
        }).catch(function (error) {
            res.json({
                status:0,
                message:'操作错误'
            });
        })
    }
    else if(req.body.type === 2){
        if (req.body.userId)
        {
            Admin.update({del_type: 2},{
                where:{
                    id: req.body.userId
                }}).then(function (updata_results) {
                res.json({
                    status:1,
                    message:'success'
                });
            }).catch(function (error) {
                res.json({
                    status:0,
                    message:'操作错误'
                });
            })
        }
        else {
            res.json({
                status:0,
                message:'操作错误'
            });
        }
    }
    else if(req.body.type === 3)
    {
        if (req.body.userId)
        {
            Admin.update({del_type: 1},{
                where:{
                    id: req.body.userId
                }}).then(function (updata_results) {
                res.json({
                    status:1,
                    message:'success'
                });
            }).catch(function (error) {
                res.json({
                    status:0,
                    message:'操作错误'
                });
            })
        }
    }
    else {
        res.json({
            status:0,
            message:'操作错误'
        });
    }
})
/**
 * 5.查询商户
 * 查询商户数据，支持符合查询商户(分页查询)
 * @params:pageIndex 当前页
 * @params:pageSize 分页大小
 */
router.get('/queryshop',function (req,res,next) {
    // 先经过校验，然后开始分页查询
    let page ,pageSize ='',query ='';
    if (req.query.pageIndex){
        // 判断page字典不为空
        page = req.query.pageIndex;
        pageSize = req.query.pageSize;
    }
    if (req.query.queryTerm)
    {
        ///如果有条件查询的情况
        query = req.query.queryTerm
    }
    Shop.findAndCountAll({
        attributes: ['id','shopAccount','shopName','shopAddress','leg','lng','zone_code','shopLab', 'shopType','shopTel','shopSouce','shopImg','shopRemark','creatTime','updateTime','cardImg','userId','dealTime','del_type'],
        where:query,//获取全部，也可以自己添加条件
        // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，
        // 则现在为索引为10，也就是从第11条开始返回数据条目
        offset:(page - 1)*pageSize,
        limit:parseInt(pageSize)  //每页限制返回的数据条数
    }).then(function (results) {
        let pages = {'pageIndex':page,'total':results.count,'pageSize':pageSize}
        res.json({
                status:1,
                data:results.rows,
                message:'success',
                page:pages
            }
        );
    }).then(function (error) {
        if (error)
        {
            res.json({
                    status:2,
                    data:'',
                    message:'访问错误，请稍后再试',
                    page:''
                }
            );
        }
    },).catch(next);
})
///-----------------------------------------------------------------------------------
///---------------------------------以下页面展示接口------------------------------------
///-----------------------------------------------------------------------------------


module.exports = router;