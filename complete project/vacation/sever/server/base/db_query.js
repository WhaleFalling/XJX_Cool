//数据库链接
const connection_object = {
    host: `localhost`,
    user: 'root',
    password: '123456',
    database: 'c4_school',
    port: 3306
}
//数据库链接对像
const pool = require("mysql").createPool(connection_object)
//QUERY对像
module.exports = (queryString, params) => {
    return new Promise((resolve, reject) => {
        pool.query(queryString, params, (error, results, fields) => {
            if (error) {
                reject(error_translate(error))
            } else {
                resolve(results, fields);
            }
        });
    });
}

function error_translate(error){
    error = Object.assign({},error);
    error.OriginaMessage = error.message;
    switch(error.errno){
        case 'ECONNDEFUSED':
            error.message="无法连接数据库服务";
            break;
        case 1451:
            error.message="不能删除或修改关联数据";
        default:
            delete error.OriginaMessage;
    }
    return error;
}