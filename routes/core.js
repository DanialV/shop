/**
 * Created by esi on 10/3/16.
 */
var express = require('express');
var db = require("./mongoschema");
var multer = require('multer');
var storage = multer.memoryStorage()
var upload = multer({
    storage: storage
})
module.exports = function(app) {
    app.route('/*').get(function(req, res, next) {
        // console.log(req.session)
        next();
    });
    app.route('/chart').post(function(req, res) {
        var data = req.body;
        var result = {};
        if(data.chart_num == 1){
            if(data.chart_type == 0){
                result.shape = 0;
            }else{
                result.shape = 1;
            }
            if(data._type != 'تمام محصولات'){
                db.goods.aggregate([
                    { $match: { time: { $gte: parseInt(data.from_date), $lte: parseInt(data.to_date) }, category: data._type }},
                    {$group: {
                        _id: '$brand',
                        totalAmount: {
                            $sum: "$count"
                        }
                    }
                    }], function(err, info) {
                    if (err) {

                    } else {
                        res.json(info);
                    }
                });
            }
            else{
                db.goods.aggregate([
                    { $match: { time: { $gte: parseInt(data.from_date), $lte: parseInt(data.to_date) } }},
                    {$group: {
                        _id: '$brand',
                        totalAmount: {
                            $sum: "$count"
                        }
                    }
                    }], function(err, info) {
                    if (err) {

                    } else {
                        res.json(info);
                    }
                });
            }
        }
        else if(data.chart_num == 2){
            if(data._type != 'تمام محصولات'){
                db.goods.aggregate([
                    { $match: { time: { $gte: parseInt(data.from_date), $lte: parseInt(data.to_date) }, category: data._type }},
                    {$group: {
                        _id: "$brand",
                        totalAmount: {
                            $sum: { $multiply: [ "$price", "$count" ] }
                        }
                    }
                    }], function(err, info) {
                    if (err) {

                    } else {
                        res.json(info)
                    }
                });
            }
            else{
                db.goods.aggregate([
                    { $match: { time: { $gte: parseInt(data.from_date), $lte: parseInt(data.to_date) } }},
                    {$group: {
                        _id: "$brand",
                        totalAmount: {
                            $sum: { $multiply: [ "$price", "$count" ] }
                        }
                    }
                }], function(err, info) {
                    if (err) {

                    } else {
                        res.json(info)
                    }
                });
            }
        }
        else if(data.chart_num == 3){
            if(data._type != 'تمام محصولات'){
                db.goods.aggregate([
                    { $match: { time: { $gte: parseInt(data.from_date), $lte: parseInt(data.to_date) }, category: data._type }},
                    {$group: {
                            _id: "$brand",
                            totalAmount: {
                            $sum: "$sales_count"
                        }
                    }
                    }], function(err, info) {
                    if (err) {

                    } else {
                        res.json(info)
                    }
                });
            }
            else{
                db.goods.aggregate([
                    { $match: { time: { $gte: parseInt(data.from_date), $lte: parseInt(data.to_date) } }},
                    {$group: {
                        _id: "$brand",
                        totalAmount: {
                            $sum: "$sales_count"
                        }
                    }
                    }], function(err, info) {
                        if (err) {

                        } else {
                            res.json(info)
                        }
                    });
                }
        }
    });
    app.route('/').get(function(req, res) {
        db.goods.find({}).sort({
            $natural: -1
        }).limit(9).lean().exec(function(err, info) {
            if (err) {

            } else {
                if (typeof req.session.role == 'undefined') {
                    var _data = {};
                    _data.sess = 0;
                    _data['goods_data'] = info;
                    res.render('index', {
                        data: _data
                    });
                } else {
                    var _data = {};
                    _data.sess = req.session;
                    _data['goods_data'] = info;
                    res.render('index', {
                        data: _data
                    });
                }
            }
        });
    });

    var uniq_username = true;
    var login_validation;
    var admin_validation;
    app.route('/login').post(function(req, res) {
        login_validation = true;
        admin_validation = true;
        var data = req.body;
        var _username = data.username;
        db.users.findOne({
            username: _username
        }, {}).lean().exec(function(err, result) {
            if (err) {

            } else {
                if (result != null) {
                    if (result.password == data.password) {
                        if(result.validation){
                            req.session.first_name = result.first_name;
                            req.session.last_name = result.last_name;
                            req.session.username = result.username;
                            req.session.password = result.password;
                            req.session.number = result.number;
                            req.session.email = result.email;
                            req.session.address = result.address;
                            req.session.role = result.role;
                            req.session._id = result._id;
                            req.session.name = result.first_name + " " + result.last_name;
                            req.session.count = result.shop_list.length;
                            res.redirect('/');
                        }else{
                            admin_validation = false;
                            res.redirect('/login_msg');
                        }
                    } else {
                        login_validation = false;
                        res.redirect('/login_msg');
                    }
                } else {
                    login_validation = false;
                    res.redirect('/login_msg');
                }
            }
        });
    });
    app.route('/login_msg').get(function (req, res) {
        db.goods.find({}).sort({
            $natural: -1
        }).limit(9).lean().exec(function(err, info) {
            if (err) {

            } else {
                if(login_validation){
                    if(admin_validation){
                        var _data = {};
                        _data.sess = req.session;
                        _data['goods_data'] = info;
                        res.render('index', {
                            data: _data
                        });
                    }else{
                        var _data = {};
                        _data.enroll_res = "حساب شما هنوز تایید نشده!";
                        _data.sess = 0;
                        _data['goods_data'] = info;
                        res.render('index', {
                            data: _data
                        });
                    }
                }else{
                    var _data = {};
                    _data.enroll_res = "نام کاربری یا کلمه عبور اشتباه است!";
                    _data.sess = 0;
                    _data['goods_data'] = info;
                    res.render('index', {
                        data: _data
                    });
                }
            }
        });
    });
    app.route('/enroll').post(function(req, res) {
        var data = req.body;
        data.shop_list = [];
        data.shopped_list = [];
        data.role = 1;
        data.credit = "5000000";
        data.validation = false;
        db.users.findOne({
            username: data.username
        }, {}).lean().exec(function(err, resualt) {
            if (err) {

            } else {
                if (resualt == null) {
                    var temp = new db.users(data);
                    temp.save(function(err) {
                        if (err) {

                        } else {
                            res.redirect('/enroll_msg');
                        }
                    })
                } else {
                    uniq_username = false;
                    res.redirect('/enroll_msg');
                }
            }
        })

    });
    app.route('/enroll_msg').get(function (req, res) {
        db.goods.find({}).sort({
            $natural: -1
        }).limit(9).lean().exec(function(err, info) {
            if (err) {

            } else {
                var _data = {};
                if(uniq_username){
                    _data.enroll_res = "ثبت نام با موفقیت انجام شد. منتظر تایید مدیر باشید!";
                    _data.sess = 0;
                    _data['goods_data'] = info;
                    res.render('index', {
                        data: _data
                    });
                }else{
                    _data.enroll_res = "نام کاربری تکراری می باشد!";
                    _data.sess = 0;
                    _data['goods_data'] = info;
                    res.render('index', {
                        data: _data
                    });
                }
            }
        });
    });
    app.route("/logout").get(function(req, res) {
        req.session = null;
        res.redirect('/');
    });
    app.get('/img', function(req, res, next) {
        try {
            db.goods.findOne({}, function(err, doc) {
                if (err)
                    res.send(err);
                if (doc) {
                    res.contentType(doc.img.contentType);
                    res.send(doc.img.image);
                }
            });
        } catch (e) {
            res.send(e);
        }
    });

    app.get('/img/:id', function(req, res) {
        try {
            db.goods.findOne({
                _id: req.params.id
            }, function(err, doc) {
                if (err)
                    res.send(err);
                res.setHeader('Cache-Control', 'public, max-age=3000000');
                res.contentType(doc.img.contentType);
                res.send(doc.img.image);
            });
        } catch (e) {
            res.send(e);
        }
    });
    var type = upload.single('image');
    app.post('/add_goods', type, function(req, res) {
        var data = req.body;
        data.img = {};
        data.img.image = req.file.buffer;
        data.img.contentType = req.file.mimetype;
        if (data.code.trim() != '' && data.model.trim() != '') {
            db.goods.findOne({
                code: data.code
            }, {}).lean().exec(function(err, resualt) {
                if (err) {

                } else {
                    if (resualt == null) {
                        var temp = new db.goods(data);
                        temp.sales_count = 0;
                        var time = new Date().toDateString();
                        temp.time = Date.parse(time);
                        temp.save(function(err) {
                            if (err) {
                                res.sendStatus(500);
                            } else {
                                res.send('ok');
                            }
                        })
                    } else {
                        res.send('error');
                    }
                }
            })
        } else {
            res.send('blank');
        }
    });
    app.route('/search_goods').post(function(req, res) {
        if (req.body.search == '') {
            res.send([]);
        } else {
            var data = new RegExp(req.body.search, 'i');
            db.goods.find({
                $or: [{
                    'brand': data
                }, {
                    'category': data
                }, {
                    'model': data
                }, {
                    'code': data
                }]
            }, {}).lean().
            exec(function(err, result) {
                if (err) {
                    res.sendStatus(500);
                } else {
                    res.send(result);
                }

            })
        }
    });
    app.route('/delete_goods').post(function(req, res) {
        var data = req.body;
        // console.log(data);
        db.goods.findOneAndRemove({
            _id: data._id
        }, function(err) {
            if (err) {

            } else {
                res.send('ok');
            }
        });
    });
    app.route('/change_goods').post(function(req, res) {
        var data = req.body;
        var _code = data.code;
        // console.log(_code);
        db.goods.findOne({
            code: _code
        }, {}, function(err, result) {
            if (err) {

            } else {
                // console.log(data);
                result.brand = data.brand;
                result.category = data.category;
                result.model = data.model;
                // result.code = data.code;
                result.count = data.count;
                result.price = data.price;
                result.cpu = data.cpu;
                result.ram = data.ram;
                result.hdd = data.hdd;
                result.graphic = data.graphic;
                result.display = data.display;
                result.os = data.os;
                result.weight = data.weight;
                result.title = data.title;
                result.features = data.features;
                result.save(function(err) {
                    if (err) {

                    } else {
                        res.send('ok');
                    }
                })
            }
        });
    });

    app.route('/user_management').post(function(req, res) {
        if (req.body.search == '') {
            res.send([]);
        } else {
            var data = new RegExp(req.body.search, 'i');
            db.users.find({
                $or: [{
                    'first_name': data
                }, {
                    'last_name': data
                }, {
                    'username': data
                }]
            }, {}).lean().
            exec(function(err, result) {
                if (err) {
                    res.sendStatus(500);
                } else {
                    res.send(result);
                }

            })
        }
    });
    app.route('/delete_users').post(function(req, res) {
        var data = req.body;
        db.users.findOneAndRemove({
            _id: data._id
        }, function(err) {
            if (err) {

            } else {
                res.send('ok');
            }
        });
    });
    app.route('/users_edit_admin').post(function(req, res) {
        var data = req.body;
        //       console.log(data);
        db.users.findOne({
            _id: data._id
        }, {}, function(err, result) {
            if (err) {

            } else {
                result.first_name = data.first_name;
                result.last_name = data.last_name;
                result.username = data.username;
                result.number = data.number;
                result.email = data.email;
                result.address = data.address;
                result.credit = data.credit;
                result.save(function(err) {
                    if (err) {

                    } else {
                        res.send('ok');
                    }
                })
            }
        });
    });
    app.route('/user_valid_admin').post(function (req, res) {
        var data = req.body;
        db.users.findOne({_id: data._id}, {},function (err, result) {
            result.validation = data.valid;
            result.save(function (err) {
                if (err) {

                } else {
                    res.send('ok');
                }
            })
        });
    });
    app.route('/user_edit').post(function(req, res) {
        var data = req.body;
        var _username = data.username;
        db.users.findOne({
            username: _username
        }, {}, function(err, result) {
            if (err) {

            } else {
                result.first_name = data.first_name;
                result.last_name = data.last_name;
                result.password = data.password;
                result.number = data.number;
                result.email = data.email;
                result.address = data.address;
                result.save(function(err) {
                    if (err) {

                    } else {
                        req.session.first_name = result.first_name;
                        req.session.last_name = result.last_name;
                        req.session.username = result.username;
                        req.session.password = result.password;
                        req.session.number = result.number;
                        req.session.email = result.email;
                        req.session.address = result.address;
                        res.redirect('/');
                    }
                })
            }
        });
    });

    app.route('/apple').get(function(req, res) {
        db.goods.find({
            brand: 'apple'
        }).sort({
            $natural: -1
        }).limit(9).lean().exec(function(err, info) {
            if (err) {

            } else {
                if (typeof req.session.role == 'undefined') {
                    var _data = {};
                    _data.sess = 0;
                    _data['goods_data'] = info;
                    res.render('apple_goods', {
                        data: _data
                    });
                } else {
                    var _data = {};
                    _data.sess = req.session;
                    _data['goods_data'] = info;
                    // console.log(_data);
                    res.render('apple_goods', {
                        data: _data
                    });
                }
            }
        });
    });
    app.route('/samsung').get(function(req, res) {
        db.goods.find({
            brand: 'samsung'
        }).sort({
            $natural: -1
        }).limit(9).lean().exec(function(err, info) {
            if (err) {

            } else {
                if (typeof req.session.role == 'undefined') {
                    var _data = {};
                    _data.sess = 0;
                    _data['goods_data'] = info;
                    res.render('samsung_goods', {
                        data: _data
                    });
                } else {
                    var _data = {};
                    _data.sess = req.session;
                    _data['goods_data'] = info;
                    // console.log(_data);
                    res.render('samsung_goods', {
                        data: _data
                    });
                }
            }
        });
    });
    app.route('/lg').get(function(req, res) {
        db.goods.find({
            brand: 'lg'
        }).sort({
            $natural: -1
        }).limit(9).lean().exec(function(err, info) {
            if (err) {

            } else {
                if (typeof req.session.role == 'undefined') {
                    var _data = {};
                    _data.sess = 0;
                    _data['goods_data'] = info;
                    res.render('lg_goods', {
                        data: _data
                    });
                } else {
                    var _data = {};
                    _data.sess = req.session;
                    _data['goods_data'] = info;
                    // console.log(_data);
                    res.render('lg_goods', {
                        data: _data
                    });
                }
            }
        });
    });

    app.route('/add_cart').post(function(req, res) {
        var data = req.body;
        db.users.findOne({
            _id: data.user_id
        }, {}, function(err, result) {
            if (err) {

            } else {
                var check = false;
                for (var i in result.shop_list) {
                    if (data.good_id == result.shop_list[i])
                        check = true;
                }
                if (check == false && result.role != 2) {
                    result.shop_list.push(data.good_id);
                    // console.log(result.shop_list);
                    result.save(function(err) {
                        if (err) {

                        } else {
                            req.session.count = result.shop_list.length;
                            res.send("ok");
                        }
                    })
                } else {
                    res.send('nop!');
                }
            }
        });
    });
    app.route('/show_cart').post(function(req, res) {
        var data = req.body;
        var arr = [];
        db.users.findOne({
            _id: data.user_id
        }, {}, function(err, result) {
            if (err) {

            } else {

                var temp = 0;
                result.shop_list.forEach(function(element) {
                    db.goods.findOne({
                        _id: element
                    }, {}).lean().exec(function(err, g_result) {
                        if (err) {

                        } else {
                            var cart_object = {};
                            cart_object.information = g_result.category + " " + g_result.brand + " " + g_result.model;
                            cart_object.price = g_result.price;
                            cart_object.user_id = result.user_id;
                            cart_object.good_id = g_result._id;
                            cart_object.count = g_result.count;
                            cart_object.qty = 1;
                            arr.push(cart_object);
                            temp++;
                            if (temp === result.shop_list.length) {
                                req.session.count = result.shop_list.length;
                                res.send(arr);
                            } else {
                                // console.log("basket is empty!");
                            }
                        }
                    });
                });
            }
        });
    });
    app.route('/delete_cart').post(function(req, res) {
        var data = req.body;
        // console.log(data);
        db.users.findOne({
            _id: data.user_id
        }, {}, function(err, result) {
            if (err) {

            } else {
                var index = result.shop_list.indexOf(data.good_id);
                if (index > -1) {
                    result.shop_list.splice(index, 1);
                }
                result.save(function(err) {
                    if (err) {

                    } else {
                        req.session.count = result.shop_list.length;
                        res.send("ok");
                    }
                });
            }
        });
    });

    app.route('/credit').post(function (req, res) {
        var data = req.body;
        db.users.findOne({_id: data.user_id},{}).lean().exec( function (err, result) {
            if(err){

            }else{
                var data = result.credit;
                res.send(data);
            }
        });
    });
    app.route('/payment').post(function(req, res) {
        var g_i_index = 2;
        var count = 0;
        var cnt = 0;
        var data = req.body;
        Object.keys(data).forEach(function(value, index) {
            if (cnt == g_i_index) {
                db.goods.findOne({
                    _id: data[value]
                }, {}, function(err, result) {
                    // console.log(result);
                    if (err) {

                    } else {
                        count = result.count - parseInt(data[Object.keys(data)[index + 2]]);
                        result.count = count;
                        result.sales_count += parseInt(data[Object.keys(data)[index + 2]]);
                        result.save(function(err) {
                            if (err) {

                            } else {

                            }
                        });
                    }
                });
                g_i_index += 4;
            }
            cnt++;
        });
        db.users.findOne({
            _id: data.user_id
        }, {}, function(err, result) {
            if (err) {

            } else {
                result.shopped_list.push(result.shop_list);
                result.shop_list = [];
                result.credit = data.credit;
                result.save(function(err) {
                    if (err) {

                    } else {
                        req.session.count = 0;
                        res.send('ok');
                    }
                });
            }
        });
    });

    app.route('/show_goods_detail').post(function(req, res) {
        var data = req.body;
        db.goods.findOne({
            _id: data.goods_id
        }, {}, function(err, result) {
            if (err) {

            } else {
                res.send(result);
            }
        });
    });

    app.route('/search').post(function(req, res) {
        if (req.body.search_input.trim() == '') {

        } else {
            // console.log(req.body.search_input);
            var data = new RegExp(req.body.search_input.trim(), 'i');
            db.goods.find({
                $or: [{
                    'brand': data
                }, {
                    'category': data
                }, {
                    'model': data
                }, {
                    'cpu': data
                }, {
                    'ram': data
                }]
            }, {}).lean().
            exec(function(err, result) {
                if (err) {
                    res.sendStatus(500);
                } else {
                    result.search_input = req.body.search_input.trim();
                    if (typeof req.session.role == 'undefined') {
                        var _data = {};
                        _data.sess = 0;
                        _data['goods_data'] = result;
                        res.render('search', {
                            data: _data
                        });
                    } else {
                        var _data = {};
                        _data.sess = req.session;
                        _data['goods_data'] = result;
                        res.render('search', {
                            data: _data
                        });
                    }
                    // console.log(result);
                    // if (typeof req.session.role == 'undefined') {
                    //     res.render('search', {
                    //         data: {
                    //             role: 0,
                    //             goods_data: result
                    //         }
                    //     });
                    // } else {
                    //     let _data = req.session;
                    //     _data['goods_data'] = result;
                    //     // console.log(_data);
                    //     res.render('search', {
                    //         data: _data
                    //     });
                    // }
                }
            })
        }
    });

    app.route('/about').get(function (req, res) {
        if (typeof req.session.role == 'undefined') {
            res.render('about', {
                data: {
                    role: 0
                }
            });
        } else {
            res.render('about', {
                data: req.session
            });
        }
    });

    app.route('/product_page').post(function (req, res) {
        var data = req.body;
        // console.log(data);
        if(data._brand == 'apple'){
            if(data._type != 'تمام محصولات'){
                db.goods.find({
                    $and: [ { brand: 'apple' }, { category: data._type } ]
                        }).sort({
                    $natural: -1
                }).limit(9).skip(data._start).lean().exec(function(err, result) {
                    if (err) {

                    } else {
                        res.send(result);
                    }
                });
            }else{
                db.goods.find({
                    brand: 'apple'
                }).sort({
                    $natural: -1
                }).limit(9).skip(data._start).lean().exec(function(err, result) {
                    if (err) {

                    } else {
                        res.send(result);
                    }
                });
            }
        }
        else if(data._brand == 'samsung'){
            if(data._type != 'تمام محصولات'){
                db.goods.find({
                    $and: [ { brand: 'samsung' }, { category: data._type } ]
                }).sort({
                    $natural: -1
                }).limit(9).skip(data._start).lean().exec(function(err, result) {
                    if (err) {

                    } else {
                        res.send(result);
                    }
                });
            }else{
                db.goods.find({
                    brand: 'samsung'
                }).sort({
                    $natural: -1
                }).limit(9).skip(data._start).lean().exec(function(err, result) {
                    if (err) {

                    } else {
                        res.send(result);
                    }
                });
            }
        }
        else if(data._brand == 'lg'){
            if(data._type != 'تمام محصولات'){
                db.goods.find({
                    $and: [ { brand: 'lg' }, { category: data._type } ]
                }).sort({
                    $natural: -1
                }).limit(9).skip(data._start).lean().exec(function(err, result) {
                    if (err) {

                    } else {
                        res.send(result);
                    }
                });
            }else{
                db.goods.find({
                    brand: 'lg'
                }).sort({
                    $natural: -1
                }).limit(9).skip(data._start).lean().exec(function(err, result) {
                    if (err) {

                    } else {
                        res.send(result);
                    }
                });
            }
        }
    });

};
