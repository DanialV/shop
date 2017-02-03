/**
 * Created by esi on 10/3/16.
 */
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

// making schemas for inserting data in mongo
var usersSchema = Schema({
    first_name: String,
    last_name: String,
    username: String,
    password: String,
    email: String,
    address: String,
    number: String,
    shop_list: Array,
    shopped_list: Array,
    role: Number,
    credit: String,
    validation: Boolean
});
var goodsSchema = Schema({
    title: String,
    brand: String,
    category: String,
    model: String,
    code: String,
    count: Number,
    price: Number,
    img: {
        image: Buffer,
        contentType: String
    },
    cpu: String,
    ram: String,
    hdd: String,
    graphic: String,
    display: String,
    os: String,
    weight: String,
    features: String,
    sales_count: Number,
    time: Number
});

module.exports = (function() {
    var _return = {};
    _return.users = mongoose.model('users', usersSchema);
    _return.goods = mongoose.model('goods', goodsSchema);
    return _return;
})();
