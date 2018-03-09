const db_config=require("./db_config");
const mysql=require('mysql');

const pool = mysql.createPool(db_config);

function query(sql_str){
    return new Promise((resolve,reject)=>{
        pool.query(sql_str,(err,result)=>{
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        })
    })

};

module.exports = query;