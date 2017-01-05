/**
 * Created by esi on 11/28/16.
 */
$(document).ready(function(){
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": true,
        "progressBar": true,
        "positionClass": "toast-bottom-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    $.fn.serializeObject = function() {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

    $("#frm-addgoods").submit(function(event){
        event.preventDefault();
    });

    $("#goods_submit").click(function(){
        var formData = new FormData($("#frm-addgoods")[0]);
        $.ajax({
            url:'/add_goods',
            method:'POST',
            data:formData,
            contentType: false,
            processData: false
        }).success(function(result){
            $("#frm-addgoods").find("input[type=text], textarea").val("");
            if(result == "ok"){
                toastr.success("با موفقیت کلا ثبت شد.");
            }
            else{
                toastr.error("کلا در سیستم موجود است.");
            }

        }).error(function(err){
            console.log(err);
            toastr.error("اشکال داخلی سرور");
        })
    });

    var goods_table_data = null;
    $("#close_goods").click(function(){
       $("#goods_table").html("");
       $("#search_goods").val("");
    });

    $("#search_goods").on("keyup",function(){
        if($("#search_goods").val() == ''){
            $("#goods_table").append('');
        }
        $.ajax({
            url:'/search_goods',
            method:'POST',
            data:{search : $("#search_goods").val()}
        }).success(function(goods){
            goods_table_data = goods;
            var trHTML = '';
            $.each(goods, function (i, item) {
                trHTML += '<tr><td class="col-sm-3">' + item.brand + '</td><td>' + item.category + '</td><td style="width: 50px;">' + item.code + '</td><td><button class="btn btn-primary btn-sm" type="button" data-toggle="modal" data-target="#edit_goods_pop">ویرایش</button></td></td><td><button class="btn btn-danger btn-sm" type="button">حذف</button></td><td class="hidden">'+i+'</td></tr>';
            });
            $("#goods_table").html(trHTML);
        }).error(function(){

        });
        $('#goods_table').on('click','tr td :button:contains(حذف)',function(e){
            $.ajax({
                url:'/delete_goods',
                method:'POST',
                data: goods_table_data[$(this).closest('tr').find('td:last').text()]
            }).success(function(result){
                if(result == 'ok'){
                    toastr.success("کلا با موفقیت حذف شد.");
                }
            }).error(function(){

            })
        });
        $('#goods_table').on('click','tr td :button:contains(ویرایش)',function(e){
            var changable_data = goods_table_data[$(this).closest('tr').find('td:last').text()]
            $("#brand").val(changable_data.brand);
            $("#category").val(changable_data.category);
            $("#model").val(changable_data.model);
            $("#code").val(changable_data.code);
            $("#count").val(changable_data.count);
            $("#price").val(changable_data.price);
            $("#change_goods_save").click(function(){
                var _data = {};
                _data.brand = $("#brand").val();
                _data.category = $("#category").val();
                _data.model = $("#model").val();
                _data.code = $("#code").val();
                _data.count = $("#count").val();
                _data.price = $("#price").val();
                $("#change_goods_form").submit(function(event){
                    event.preventDefault();
                });
                $.ajax({
                    url:'/change_goods',
                    method:'POST',
                    data: _data
                }).success(function(result){
                    if(result == 'ok'){
                        toastr.success("تغییرات با موفقیت ثبت شد.");
                    }
                  //
                    //  _data._id = goods_table_data[$(this).closest('tr').find('td:last').text()]._id;
                    goods_table_data[$(this).closest('tr').find('td:last').text()] = _data;
                    var trHTML = '';
                    $.each(goods_table_data, function (i, item) {
                        trHTML += '<tr><td class="col-sm-3">' + item.brand + '</td><td>' + item.category + '</td><td style="width: 50px;">' + item.code + '</td><td><button class="btn btn-primary btn-sm" type="button" data-toggle="modal" data-target="#edit_goods_pop">ویرایش</button></td></td><td><button class="btn btn-danger btn-sm" type="button">حذف</button></td><td class="hidden">'+i+'</td></tr>';
                    });
                    $("#goods_table").html(trHTML);
                }).error(function(error){

                });
            });
        });
    });

    var users_table_data = null;
    $('#user_management_close').click(function () {
        $('#users_table').html("");
        $('#search_user').val('');
    });

    $('#search_user').on("keyup",function () {
        if($("#search_user").val() == ''){
            $("#users_table").append('');
        }
        $.ajax({
            url: '/user_management',
            method:'POST',
            data:{search : $("#search_user").val()}
        }).success(function(users){
            users_table_data = users;
            var trHTML = '';
            $.each(users, function (i, item) {
                trHTML += '<tr><td class="col-sm-3">' + item.first_name + '</td><td>' + item.last_name + '</td><td style="width: 50px;">' + item.username + '</td><td><button class="btn btn-primary btn-sm" type="button" data-toggle="modal" data-target="#user_edit_management_pop">ویرایش</button></td></td><td><button class="btn btn-danger btn-sm" type="button">حذف</button></td><td class="hidden">'+i+'</td></tr>';
            });
            $("#users_table").html(trHTML);
        }).error(function(){

        });
        $('#users_table').on('click','tr td :button:contains(حذف)',function(e){
            $.ajax({
                url:'/delete_users',
                method:'POST',
                data: users_table_data[$(this).closest('tr').find('td:last').text()]
            }).success(function(result){
                if(result == 'ok'){
                    toastr.success("کاربر با موفقیت حذف شد.");
                }
            }).error(function(){

            })
        });
        var edit_data;
        $('#users_table').on('click','tr td :button:contains(ویرایش)',function(e){
            var changable_data = users_table_data[$(this).closest('tr').find('td:last').text()]
            edit_data = changable_data;
            $('#first_name').val(changable_data.first_name);
            $('#last_name').val(changable_data.last_name);
            $('#username').val(changable_data.username);
            $('#number').val(changable_data.number);
            $('#email').val(changable_data.email);
            $('#address').val(changable_data.address);
        });
        $('#change_users_save').click(function () {

            var _data = {};
            _data.first_name = $('#first_name').val();
            _data.last_name = $('#last_name').val();
            _data.username = $('#username').val();
            _data.number = $('#number').val();
            _data.email = $('#email').val();
            _data.address = $('#address').val();
            _data._id = edit_data._id;
            $("#change_users_form").submit(function(event){
                event.preventDefault();
            });
            $.ajax({
                url:'/users_edit_admin',
                method:'POST',
                data: _data
            }).success(function(result){
                if(result == 'ok'){
                    toastr.success("تغییرات با موفقیت ثبت شد.");
                }
                $.ajax({
                    url: '/user_management',
                    method:'POST',
                    data:{search : $("#search_user").val()}
                }).success(function(users){
                    users_table_data = users;
                    var trHTML = '';
                    $.each(users, function (i, item) {
                        trHTML += '<tr><td class="col-sm-3">' + item.first_name + '</td><td>' + item.last_name + '</td><td style="width: 50px;">' + item.username + '</td><td><button class="btn btn-primary btn-sm" type="button" data-toggle="modal" data-target="#user_edit_management_pop">ویرایش</button></td></td><td><button class="btn btn-danger btn-sm" type="button">حذف</button></td><td class="hidden">'+i+'</td></tr>';
                    });
                    $("#users_table").html(trHTML);
                }).error(function(){

                });
                // users_table_data[$(this).closest('tr').find('td:last').text()] = _data;
                // var trHTML = '';
                // $.each(users_table_data, function (i, item) {
                //     trHTML += '<tr><td class="col-sm-3">' + item.brand + '</td><td>' + item.category + '</td><td style="width: 50px;">' + item.code + '</td><td><button class="btn btn-primary btn-sm" type="button" data-toggle="modal" data-target="#user_edit_management_pop">ویرایش</button></td></td><td><button class="btn btn-danger btn-sm" type="button">حذف</button></td><td class="hidden">'+i+'</td></tr>';
                // });
                // $("#users_table").html(trHTML);
            }).error(function(){

            })
        });

    });

    $(".basket").click(function () {
        var good_id;
           good_id = this.value;
           var _data = {};
           _data.good_id = good_id;
           _data.user_id = $("#inp_user_id").val();
            // console.log(_data);
           $.ajax({
               url:'/add_cart',
               method:'POST',
               data:_data
           }).success(function (result) {
               if(result == "ok"){
                   var count = $("#cart_count").text();
                   count++;
                   $("#cart_count").text(count);
                   console.log("Done!");
               }else{
                   console.log(result);
               }
           }).error(function () {
               
           })
    });

    var user_shoplist = [];
    $('#cart-btn').click(function () {
        var totalcost = 0;
        var quantity = 0;
        var _data = {};
        _data.user_id = $("#cart_user_id").val();
        $.ajax({
            url: '/show_cart',
            method: 'POST',
            data: _data
        }).success(function (product) {
            $("#cart_count").text(product.length);
            user_shoplist = product.slice();
            console.log(user_shoplist);
            var trHTML = '';
            $.each(product, function (i, item) {
                trHTML += '<tr><td class="col-sm-3">' + item.information + '</td><td class="col-sm-3">' + item.price + '</td><td><input class="text-center" id="quantity_inp" size="2" value=' + item.qty + ' /></td><td><button class="btn btn-danger btn-sm" type="button"><span class="glyphicon glyphicon-remove"></span></button></td><td class="hidden">'+i+'</td></tr>';
                totalcost += item.price;
            });
            $("#cart_table").html(trHTML);
            $('#totalcost_spn').text(totalcost);
        }).error(function () {
            
        })
        $('#cart_table').off('click').on('click','tr td :button:contains()',function(e){
            totalcost = 0;
            // console.log($(this).closest('tr').find('td:last').text());
            var index = $(this).closest('tr').find('td:last').text();
            _data.good_id = user_shoplist[$(this).closest('tr').find('td:last').text()].good_id;
            console.log(_data.good_id);
            $.ajax({
                url:'/delete_cart',
                method:'POST',
                data: _data
            }).success(function(result){
                if(result == "ok"){
                    // toastr.success("سبد به روز رسانی شد.");
                    var count = $("#cart_count").text();
                    count--;
                    $("#cart_count").text(count);
                    user_shoplist.splice(index, 1);
                    console.log(user_shoplist);
                    var check = false;
                    var trHTML = '';
                    let temp;
                    $.each(user_shoplist, function (i, item) {
                        trHTML += '<tr><td class="col-sm-3">' + item.information + '</td><td class="col-sm-3">' + item.price + '</td><td><input class="text-center" id="quantity_inp" size="2" value=' + item.qty + ' /></td><td><button class="btn btn-danger btn-sm" type="button"><span class="glyphicon glyphicon-remove"></span></button></td><td class="hidden">'+i+'</td></tr>';
                        totalcost += item.price * item.qty;
                        check = true;
                        console.log(item.qty);
                    });
                    $("#cart_table").html(trHTML);
                    if(check){
                        $('#totalcost_spn').text(totalcost);
                    }
                    else{
                        $('#totalcost_spn').text('');
                    }
                }
            }).error(function(){

            })
        }).on('keydown','tr td :input:contains()',function (e) {
            let temp;
            $(this).closest('tr').find("input").each(function() {
                quantity = this.value;
                temp = quantity * parseInt($(this).closest('tr').find('td:nth-last-child(4)').text());
                totalcost = totalcost - temp;
            });
        }).on('keyup','tr td :input:contains()',function (e) {
            let temp;
            $(this).closest('tr').find("input").each(function() {
                if(this.value < 1 || this.value == ''){
                    this.value = 1;
                }
                if(this.value > 5){
                    this.value = 5;
                }
                quantity = this.value;
                user_shoplist[$(this).closest('tr').find('td:last').text()].qty = quantity;
                temp= quantity * parseInt($(this).closest('tr').find('td:nth-last-child(4)').text());
                totalcost = totalcost + temp;
                $('#totalcost_spn').text(totalcost);
            });
        });
        $('#payment_btn').unbind().click(function () {
            var _data = user_shoplist.reduce(function(o, v, i) {
                o[i] = v;
                return o;
            }, {});
            _data.user_id = $("#cart_user_id").val();
            _data.len = user_shoplist.length;
            console.log(_data);
            if(_data.len != 0){
                $.ajax({
                    url: '/payment',
                    method: 'POST',
                    data: _data
                }).success(function (result) {
                    if(result == 'ok'){
                        toastr.success("خرید با موفقیت انجام شد.");
                        $("#cart_count").text(0);
                        $('#cart_table').html("");
                        $('#totalcost_spn').text('');
                    }
                }).error(function () {

                })
            }
        });

    });

});