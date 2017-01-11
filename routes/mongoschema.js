/**
 * Created by esi on 10/3/16.
 */
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

// making schemas for inserting data in mongo
var warehouse_schema = Schema({
    total_supply_count: String,
    total_supply_cost: String,
    total_sell_count: String,
    total_sell_cost: String
});
var users_schema = Schema({
    first_name: String,
    last_name: String,
    username: String,
    password: String,
    email: String,
    address:String,
    number:String,
    shop_list:Array,
    shopped_list: Array,
    role: Number
});
var goods = Schema({
    title:String,
    brand:String,
    category:String,
    model:String,
    code : String,
    count:String,
    price:Number,
    image_address:String,
    cpu: String,
    ram: String,
    hdd: String,
    graphic: String,
    display: String,
    os: String,
    weight: String,
    features: String
});
var report_schema = Schema({
    user_id : String,
    header : String,
    content : String
});
var logs_schema = Schema({
    log : String
});



module.exports = (function () {
    var _return = {};
    _return.warehouse_schema = mongoose.model('warehouse', warehouse_schema);
    _return.users = mongoose.model('users', users_schema);
    _return.logs = mongoose.model('log', logs_schema);
    _return.goods = mongoose.model('goods', goods);
    _return.reports =  mongoose.model('reports', report_schema);
    return _return;
})();
