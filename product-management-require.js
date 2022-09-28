var seneca = require('seneca')().use('products-storage')
var product =  {
    name: "Laptop",
    price: "201.99",
    category: "PC"
}

function add_product() {
    seneca.act({role: 'product', cmd: 'add', data: product}, function (err, msg) {
        console.log(msg);
    });
}

add_product();