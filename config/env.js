//根据不同的环境更改不同的baseUrl
let baseURL = '';

//开发环境下
if (process.env.NODE_ENV == 'development') {
    baseURL = ' http://192.168.1.106:8082';

} else if (process.env.NODE_ENV == 'production') {
    baseURL =  ' http://192.168.1.106:8082';
}

export {
    baseURL,//导出baseUrl
}
