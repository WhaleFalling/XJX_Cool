const router = require("express").Router();
const dq = require("../base/db_query");
const ho = require("../base/http_output");
const async = require("async");

module.exports = router;

router.get("/list", (req, res) => {
    const $sql = "SELECT * FROM admin_role ORDER BY role_id ASC";
    dq($sql).then((result) => {
        ho(res, result).send();
    }).catch((e) => {
        ho(res).internal_error(e)
    })
});

router.post("/create", (req, res) => {
    const { role_name, remark } = req.body;
    const $sql = `INSERT INTO admin_role(role_name,remark) VALUES(?,?)`;
    dq($sql,[ role_name, remark]).then((result) => {
        ho(res, result).send();
    }).catch((e) => {
        ho(res).internal_error(e)
    })
});

router.post("/update", (req, res) => {
    const { role_name, remark, access_list, role_id } = req.body;
    const $sql=`UPDATE admin_role SET role_name=?,remark=?, access_list=? WHERE role_id=?`
    dq($sql,[ role_name, remark,access_list, role_id]).then((result) => {
        ho(res, result).send();
    }).catch((e) => {
        ho(res).internal_error(e)
    })
});

router.post("/remove",(req,res)=>{
    const {role_id}=req.body;
    const $sql = `DELETE FROM admin_role WHERE role_id=?`;
    dq($sql,[role_id]).then((result) => {
        ho(res, result).send();
    }).catch((e) => {
        ho(res).internal_error(e)
    })
})