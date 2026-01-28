var util = require('util');
var ee = require('events');

var db_data = [
        {id: 1, name: "мандрик", bdata:'2005-10-06'},
        {id: 2, name: "гулецкий", bdata:'2006-10-06'}
];

function DB()
{
    ee.EventEmitter.call(this);

    this.get = ()=>{return db_data;};

    this.post = (r)=> {db_data.push(r);};

    this.put = (id, newData) => {
        const i = db_data.findIndex(x => x.id === id);
        if (i !== -1) db_data[i] = { ...db_data[i], ...newData };
    };
    
    this.delete = (id) => {
        const i = db_data.findIndex(x => x.id === id);
        if (i !== -1) db_data.splice(i, 1);
    }
}

util.inherits(DB, ee.EventEmitter);
exports.DB = DB;