/**
 * Created by esi on 10/3/16.
 */
var express = require('express');
var db = require("./mongoschema");
var multer  = require('multer')
var upload = multer({ dest: './public/goods_data/' })
module.exports = function(app) {
    app.route('/*').get(function(req, res, next) {
        next();
    });
    app.route('/').get(function(req, res) {
        db.goods.find({}).sort({$natural: -1}).limit(9).lean().exec(function(err,info){
          if(err){

          }
          else{
              // console.log(info);
            if (typeof req.session.role == 'undefined') {
              res.render('index', {
                  data: {
                      role: 0,
                      goods_data:info
                  }
              });
            }
            else{
              let _data = req.session;
              _data['goods_data'] = info;
              res.render('index', {
                  data: _data
              });
            }
          }
        });
    });

    app.route('/login').post(function(req, res) {
        var data = req.body;
        var _username = data.username;
        db.users.findOne({
            username: _username
        }, {}).lean().exec(function(err, result) {
            if (err) {

            } else {
                if (result != null) {
                    if (result.password == data.password) {

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

                    } else {

                    }
                }
            }
        });
    });
    app.route('/enroll').post(function(req, res) {
        var data = req.body;
        data.shop_list = [];
        data.shopped_list = [];
        data.role = 1;
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
                            var _data = req.session;
                            _data.enroll_res = "ok";
                            res.render("index", {
                                data: _data
                            });
                        }
                    })
                } else {
                    //errorr for uniqe username
                }
            }
        })

    });
    app.route("/logout").get(function(req, res) {
        req.session = null;
        res.redirect('/');
    });

    var type = upload.single('image');
    app.post('/add_goods',type,function(req, res) {
        var data = req.body;
        data.image_address = 'goods_data/' + req.file.filename;
        db.goods.findOne({
            code: data.code
        }, {}).lean().exec(function(err, resualt) {
            if (err) {

            } else {
                if (resualt == null) {
                    var temp = new db.goods(data);
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
                }, {
                    'count': data
                }]
            }, {}).lean().
            exec(function(err, result) {
                if (err) {
                    res.sendStatus(500);
                } else {
                    //                 console.log(result);
                    res.send(result);
                }

            })
        }


    });
    app.route('/delete_goods').post(function(req, res) {
        var data = req.body;
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
        console.log(_code);
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
                result.save(function(err) {
                    if (err) {

                    } else {
                        res.send('ok');
                    }
                })
            }
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

    app.route('/apple').get(function (req,res) {
            db.goods.find({brand:'apple'}).lean().exec(function(err,info){
               if(err){

               }
               else{
                   if (typeof req.session.role == 'undefined') {
                       res.render('apple_goods', {
                           data: {
                               role: 0,
                               goods_data:info
                           }
                       });
                   }
                   else{
                       // console.log(req.session)
                       let _data = req.session;
                       _data['goods_data'] = info;
                       res.render('apple_goods', {
                           data: _data
                       });
                   }
               }
            });
    });
    app.route('/samsung').get(function (req,res) {
        db.goods.find({brand:'samsung'}).lean().exec(function(err,info){
            if(err){

            }
            else{
                if (typeof req.session.role == 'undefined') {
                    res.render('samsung_goods', {
                        data: {
                            role: 0,
                            goods_data:info
                        }
                    });
                }
                else{
                    // console.log(req.session)
                    let _data = req.session;
                    _data['goods_data'] = info;
                    res.render('samsung_goods', {
                        data: _data
                    });
                }
            }
        });
    });
    app.route('/lg').get(function (req,res) {
        db.goods.find({brand:'lg'}).lean().exec(function(err,info){
            if(err){

            }
            else{
                if (typeof req.session.role == 'undefined') {
                    res.render('lg_goods', {
                        data: {
                            role: 0,
                            goods_data:info
                        }
                    });
                }
                else{
                    let _data = req.session;
                    _data['goods_data'] = info;
                    res.render('lg_goods', {
                        data: _data
                    });
                }
            }
        });
    });

    app.route('/add_cart').post(function (req,res) {
       var data = req.body;
       // console.log(data);
       db.users.findOne({_id : data.user_id},{},function (err,result) {
           if(err){

           }else {
               var check = false;
               for (var i in result.shop_list)
               {
                   if(data.good_id == result.shop_list[i])
                       check = true;
               }
               if(check == false){
                   result.shop_list.push(data.good_id);
                   // console.log(result.shop_list);
                   result.save(function (err) {
                       if (err) {

                       } else {
                           req.session.count = result.shop_list.length;
                           res.send("ok");
                       }
                   })
               }
               else{
                   res.send('nop!');
               }
           }
       });
    });
    app.route('/show_cart').post(function (req,res) {
       var data = req.body;
       var arr = [];
       db.users.findOne({_id:data.user_id},{},function (err,result) {
           if(err){

           }else{

               var temp = 0;
               result.shop_list.forEach(function (element) {
                   db.goods.findOne({_id:element},{}).lean().exec(function(err,g_result){
                       if(err){

                       }else{
                           var cart_object = {};
                               cart_object.information = g_result.category +" "+ g_result.brand +" "+ g_result.model;
                               cart_object.price = g_result.price;
                               cart_object.user_id = result.user_id;
                               cart_object.good_id = g_result._id;
                               cart_object.qty = 1;
                               arr.push(cart_object);
                               temp++;
                               if(temp === result.shop_list.length){
                                   req.session.count = result.shop_list.length;
                                   res.send(arr);
                               }else{
                                   // console.log("basket is empty!");
                               }
                       }
                   });
               });
           }
       });
    });
    app.route('/delete_cart').post(function (req,res) {
        var data = req.body;
        // console.log(data);
        db.users.findOne({_id:data.user_id},{},function (err,result) {
            if(err){

            }else{
                var index = result.shop_list.indexOf(data.good_id);
                if(index > -1){
                    result.shop_list.splice(index, 1);
                }
                result.save(function (err) {
                    if(err){

                    }else{
                        req.session.count = result.shop_list.length;
                        res.send("ok");
                    }
                });
            }
        });
    });

    app.route('/payment').post(function (req,res) {
        var g_i_index = 2;
        var count = 0;var cnt = 0;
        var data = req.body;
        Object.keys(data).forEach(function (value, index) {
          if(cnt == g_i_index){
              db.goods.findOne({_id: data[value]}, {},function (err,result) {
                      if (err) {

                      }
                      else {
                          // console.log(data[value]);
                          // console.log(data[Object.keys(data)[index+1]]);
                          count = parseInt(result.count) - parseInt(data[Object.keys(data)[index+1]]);
                          result.count = count;
                          result.save(function (err) {
                              if(err){

                              }
                              else{

                              }
                          });
                      }
              });
              g_i_index += 4;
          }
          cnt++;
        });
        db.users.findOne({_id: data.user_id},{},function (err,result) {
            if(err){

            }
            else{
                result.shopped_list.push(result.shop_list);
                result.shop_list = [];
                result.save(function (err) {
                    if(err){

                    }
                    else{
                        req.session.count = 0;
                        res.send('ok');
                    }
                });
            }
        });
    });

    app.route('/show_goods_detail').post(function (req,res) {
        var data = req.body;
        db.goods.findOne({_id: data.goods_id}, {},function (err,result) {
            if(err){

            }
            else{
                res.send(result);
            }
        });
    });
};
