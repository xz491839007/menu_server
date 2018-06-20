/*
* 这个js文件的方式是定制了一个消息这个消息
* */
/*
* 7位区位码
* 北上广深苏浙川陕 ->省位 2位
* 县 3位
*
* 未知地域码 9901000
* */
HanZhong = ['汉台','洋县','南郑','城固','留坝','勉县','佛坪','略阳','宁强','西乡','镇巴']
XiAn = ['雁塔','莲湖','未央','碑林','灞桥','阎良','临潼','长安','高陵','鄠邑','户县','蓝田','周至','新城']

return_zone_code = function (zone) {
    index = 0
    // 更新地域 只有汉中全境和西安全境
    for (let bin of HanZhong) {
        if (zone.indexOf(bin) !== -1) {
            if (index <10)
            {
                return '08'+'00'+index.toString()
            }
            else {
                return '08'+'0'+index.toString()
            }
        }
        index++
    }

    for (let bin of XiAn) {
        if (zone.indexOf(bin) !== -1) {
            return '08'+'0'+index.toString()
        }
        index++
    }
    return '99'+'010'
}

module.exports = return_zone_code;