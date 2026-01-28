const rpcws = require('rpc-websockets').Server
let server = new rpcws({port: 4000, host: 'localhost'});

server.setAuth((b)=>{return (b.login == 'bybody' && b.password== '123')});

server.register('square',   (params)=>{ return square(params);  }).public();
server.register('sum',      (params)=>{ return sum(params);     }).public();
server.register('mul',      (params)=>{ return mul(params);     }).public();
server.register('fib',      (params)=>{ return fib(params);     }).protected();
server.register('fact',     (params)=>{ return fact(params);    }).protected();
    
function square (params) {
    return params.length == 1 ? Math.PI*params[0]**2 : params[0] * params[1];
} 
function sum (params) {
    let sum=0;
    params.forEach(element => {
        sum+=element;
    });
    return sum;
} 
function mul (params) {
    let mul=1;
    params.forEach(element => {
        mul*=element;
    });
    return mul;
} 
function fib (n) {
    if (n <= 1) return 1;
    return fib(n - 1) + fib(n - 2);
};
function fact (n) {
    return (n == 1 || n == 0) ? 1 : n * fact(n - 1);
};