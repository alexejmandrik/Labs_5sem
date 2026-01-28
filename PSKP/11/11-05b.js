const async = require('async');
const rpcws = require('rpc-websockets').Client;
const ws = new rpcws('ws://localhost:4000');

const login = 'bybody';
const password = '123';

const call = (method, params) => cb =>
    ws.call(method, params)
      .then(r => cb(null, r))
      .catch(e => cb(e, null));

const authCall = (login, password, method, params) => cb =>
    ws.login({ login, password })
      .then(ok => ok
          ? ws.call(method, params).then(r => cb(null, r)).catch(e => cb(e, null))
          : cb({ loginError: true }, null)
      );

const tasks = {
    square1: call('square', [3]),
    square2: call('square', [5, 4]),
    sum1:    call('sum', [2]),
    sum2:    call('sum', [2,4,6,8,10]),
    mul1:    call('mul', [3]),
    mul2:    call('mul', [3,5,7,9,11,13]),
    fib1:    authCall(login, password, 'fib', [1]),
    fib2:    authCall(login, password, 'fib', [2]),
    fib3:    authCall(login, password, 'fib', [7]),
    fact1:   authCall(login, password, 'fact', [0]),
    fact2:   authCall(login, password, 'fact', [5]),
    fact3:   authCall(login, password, 'fact', [10])
};

ws.on('open', () => {
    async.parallel(tasks, (e, r) => {
        if (e) console.log('e =', e);
        else console.log('r =', r);
        ws.close();
    });
});
