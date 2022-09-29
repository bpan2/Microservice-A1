var count_get = 0

var plugin = function (options) {
    var seneca = this;

    seneca.add({ role: 'product', cmd: 'add' }, function (msg, respond) {
        this.make('product').data$(msg.data).save$(respond);
    });

    seneca.add({ role: 'product', cmd: 'get' }, function (msg, respond) {
        this.make('product').load$(msg.data.product_id, respond);
    });

    seneca.add({ role: 'product', cmd: 'get-all' }, function (msg, respond) {
        this.make('product').list$({}, respond);
    });

    seneca.add({ role: 'product', cmd: 'delete' }, function (msg, respond) {
        this.make('product').remove$(msg.data.product_id, respond);
    });

    seneca.add(
        { role: 'product', cmd: 'delete-all' }, function (msg, respond) {
            var product_entity = this.make('product');

            var product_idList = []

            product_entity.list$({}, function(err,list){
                list.forEach(function(item){
                    if ( typeof(item.id) !== "undefined" && item.id !== null ){
                        console.log("--------------")
                        console.log(item.productname)
                        console.log(item.id)
                        console.log("--------------")
                        product_entity.remove$(item.id);
                    }
                })
            })            
        }
    );
}

module.exports = plugin;



var seneca = require("seneca")();
seneca.use(plugin);
seneca.use('seneca-entity');

seneca.add('role:api, cmd:add-product', function (args, done) {
    count_get += 1
    console.log(" Processed Request Count: " +  " GET: " + count_get);
    console.log("--> cmd:add-product ");
   
    var product = {
        productname: args.productname,
        price: args.price,
        category: args.category
    }
    console.log("--> product: " + JSON.stringify(product));
    seneca.act({ role: 'product', cmd: 'add', data: product }, function (err, msg) {
        console.log(msg);
        done(err, msg);
    });
});

seneca.add('role:api, cmd:get-all-products', function (args, done) {
    count_get += 1
    console.log(" Processed Request Count: " +  " GET: " + count_get);
    console.log("--> cmd:get-all-products");
    seneca.act({ role: 'product', cmd: 'get-all' }, function (err, msg) {
        console.log(msg);
        done(err, msg);
    });
});

seneca.add('role:api, cmd:get-product', function (args, done) {
    count_get += 1
    console.log(" Processed Request Count: " +  " GET: " + count_get);
    console.log("--> cmd:get-product, args.user_id: " + args.product_id);
    seneca.act({ role: 'product', cmd: 'get', data: { product_id: args.product_id } }, function (err, msg) {
        console.log(msg);
        done(err, msg);
    });
});


seneca.add('role:api, cmd:delete-product', function (args, done) {
    count_get += 1
    console.log(" Processed Request Count: " +  " GET: " + count_get);
    console.log("--> cmd:delete-product, args.product_id: " + args.product_id );
    seneca.act({ role: 'product', cmd: 'delete', data: { product_id: args.product_id } }, function (err, msg) {
        console.log(msg);
        done(err, msg);
    });
});

seneca.add('role:api, cmd:delete-all-products', function (args, done) {
    count_get += 1;
    console.log(" Processed Request Count: " +  " GET: " + count_get);
    console.log("--> cmd:delete-all-products");
    seneca.act({ role: 'product', cmd: 'delete-all'}, function (err, msg) {
        console.log(msg);
        done(err, msg);
    });
});


seneca.act('role:web', {
    use: {
        prefix: '/bpan4service',
        pin: { role: 'api', cmd: '*' },
        map: {
            'add-product': { GET: true },
            'get-all-products': { GET: true },
            'get-product': { GET: true, },
            'delete-product': { GET: true, },
            'delete-all-products' : { GET: true, }
        }
    }
})


var express = require('express');
var app = express();
app.use(require("body-parser").json())
app.use(seneca.export('web'));



app.listen(8000)
console.log("Server listening on localhost:8000 ...");
console.log("----- Requests -------------------------");
console.log("http://localhost:8000/bpan4service/add-product?productname=Laptop&price=1599&category=PC");
console.log("http://localhost:8000/bpan4service/get-all-products");
console.log("http://localhost:8000/bpan4service/get-product?product_id=1245");
console.log("http://localhost:8000/bpan4service/delete-product?product_id=1245");
console.log("http://localhost:8000/bpan4service/delete-all-products");





