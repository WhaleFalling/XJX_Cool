const dq = require("./db_query");
const ho = require("./http_output");
const async = require("async");

module.exports = function (req, res, next) {
    //收集参数
    const { token } = req.cookies;
    //收集pathname
    const pathname = req.baseUrl;
    //收集用户信息
    async.waterfall([
        //如果权限列表中无地址则不需验证
        (callback) => {
            $sql_find_url = `SELECT access_id FROM admin_access WHERE url=?`;

            dq($sql_find_url, [pathname]).then((result) => {
                if (result.length) {
                    //有这条需权限
                    callback(null, false);
                } else {
                    //没有不管
                    callback(null, true);
                }
            }).catch((error) => {
                callback(error);
            })
        },
        //收集用户信息
        (pass, callback) => {
            if (!pass) {
                const $sql_find = `SELECT * FROM admin_user WHERE token=?`;
                dq($sql_find, [token]).then((result) => {
                    if (result.length) {
                        //找到返回用户信息
                        callback(null, { pass: false, user_info: result[0] });
                    } else {
                        callback({ status: 401, message: '身份凭证无效' });
                    }
                }).catch((error) => {
                    callback(error);
                })
            } else {
                callback(null, { pass: true });
            }

        },
        //有用户，分析权限
        ({ pass, user_info }, callback) => {
            if (!pass) {
                //将用户信息放入req 方便后续使用
                req.userInfo = user_info;
                //若是超管不需分析权限
                if (user_info.is_administrator) {
                    callback(null);
                } else {
                    //验证权限
                    const $sql_get_access = `
                    SELECT * FROM admin_access
                    WHERE INSTR(
                        (
                            SELECT concat(",",access_list,",") AS access_list FROM admin_role
                            WHERE role_id IN(SELECT role_id from admin_user WHERE user_id=?)
                        ),
                        concat(",",access_id,",")
                    )
                    AND url=?
                `;
                    dq($sql_get_access, [user_info.user_id, pathname]).then((result) => {
                        if (result.length) {
                            //有权限过
                            callback(null);
                        } else {
                            //没权限403
                            callback({ status: 403, message: '您没有权限进行此操作' });
                        }
                    }).catch((error) => {
                        callback(error);
                    })
                }
            }else{
                callback(null);
            }

        }
    ], (error, result) => {
        if (error) {
            //根据error状态返回状态
            switch (error.status) {
                case 401:
                    ho(res).unauthorized(error).send();
                    break;
                case 403:
                    ho(res).forbidden(error).send();
                    break;
                default:
                    ho(res).internal_error(error).send();
            }
        } else {
            next();
        }
    })
}