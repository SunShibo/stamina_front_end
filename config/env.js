//根据不同的环境更改不同的baseUrl
let baseURL = '';

//开发环境下
if (process.env.NODE_ENV == 'development') {
    baseURL = ' http://at.sia-edu.com/api';

} else if (process.env.NODE_ENV == 'production') {
    baseURL =  ' http://at.sia-edu.com/api';
}

export {
    baseURL,//导出baseUrl
}
