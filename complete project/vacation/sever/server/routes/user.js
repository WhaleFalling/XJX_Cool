const router = require("express").Router();
const dq = require("../base/db_query");
const ho = require("../base/http_output");
const async = require("async");
const md5 = require("md5");

module.exports = router;

router.get("/list", async (req, res) => {

    let { keyword, pageNumber, pageSize } = req.query;

    keyword = keyword ? `%${keyword}%` : "%";

    pageNumber = Number(pageNumber);
    pageSize = Number(pageSize);
    limitNumber = (pageNumber - 1) * pageSize;
    const $sql_query = `SELECT
    admin_user.user_id,
    admin_user.\`login_id\`,
    admin_user.password,
    admin_user.user_name,
    admin_role.role_name,
    admin_role.access_list,
    admin_user.last_login,
    admin_user.remark,
    admin_user.is_administrator,
    admin_user.token,
    admin_user.role_id,
    admin_user.access_list,
    admin_user.created_time
    FROM
    admin_role
    INNER JOIN admin_user ON admin_user.role_id = admin_role.role_id
    WHERE user_name LIKE ?
    ORDER BY user_id
    LIMIT ?,?
    `;

    const $sql_total = `SELECT COUNT(*) FROM admin_user WHERE user_name LIKE ?`;

    async.parallel({
        // 查询列表
        list: (callback) => {
            dq($sql_query, [keyword, limitNumber, pageSize]).then((result, fields) => {
                callback(null, result);
            }).catch((error) => {
                callback(error);
            });
        },
        // 查询总数
        total: (callback) => {
            dq($sql_total, [keyword]).then((result, fields) => {
                callback(null, result[0].total)
            }).catch((error) => {
                callback(error);
            });
        }
    }, (error, result) => {
        // 返回结果
        if (!error) {
            ho(res).send(result);
        } else {
            ho(res).internal_error(error).send();
        }
    });
});

router.post("/remove", async (req,res)=>{
    const {user_id} = req.body;

    const $sql=`DELETE FROM admin_user WHERE user_id=?`;

    dq($sql, [user_id]).then((result, fields) => {
        ho(res).send(result);
    }).catch((error) => {
        ho(res).internal_error().send(error);
    });
});

router.post("/create", async (req,res)=>{
    let {login_id,password,user_name,remark,role_id} = req.body;
    password = md5(password);

    const $sql_find = `SELECT login_id FROM admin_user WHERE login_id=?`;
    const $sql_create = `INSERT INTO admin_user
            (login_id,password,user_name,remark,role_id)
            VALUES(?,?,?,?,?)`;

    async.series([
        (callback)=>{
            dq($sql_find, [login_id]).then((result, fields) => {
                if(result.length){
                    callback({message:'这个登录ID已经被使用'});
                }else{
                    callback(null);
                }
            }).catch((error) => {
                callback(error);
            });
        },
        (callback)=>{
            dq($sql_create, [login_id,password,user_name,remark,role_id]).then((result, fields) => {
                callback(null,result)
            }).catch((error) => {
                callback(error)
            });
        }
    ],(error,result)=>{
        if(!error){
            ho(res).send(result);
        }else{
            ho(res).internal_error(error).send();
        }
    });

})

router.post("/update", async (req,res)=>{
    let {login_id,password,user_name,remark,role_id,user_id} = req.body;
    
    const update_password_str = password ? `,password=?` : '';

    const $sql_find = `SELECT user_id FROM admin_user WHERE login_id=?`;
    const $sql_update = `UPDATE admin_user SET
            login_id=?,user_name=?,remark=?,role_id=? ${update_password_str}
            WHERE user_id=?`;

    let params_arr = [login_id,user_name,remark,role_id];
    if(password){
        params_arr.push(md5(password));
    }

    params_arr.push(user_id);

    async.series([
        (callback)=>{
            dq($sql_find, [login_id]).then((result, fields) => {
                if(result.length && result[0].user_id != user_id){
                    callback({message:'这个登录ID已经被使用'});
                }else{
                    callback(null);
                }
            }).catch((error) => {
                callback(error);
            });
        },
        (callback)=>{
            dq($sql_update,params_arr).then((result, fields) => {
                callback(null,result)
            }).catch((error) => {
                callback(error)
            });
        }
    ],(error,result)=>{
        if(!error){
            ho(res).send(result);
        }else{
            ho(res).internal_error(error).send();
        }
    });
})