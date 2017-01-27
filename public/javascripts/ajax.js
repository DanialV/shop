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

    $('#search_input').on('focus',function () {
        if (this.value == "جستجوی محصولات"){
            this.value = "";
        }
    });
    $('#search_input').on('blur',function () {
        if (this.value == ""){
            this.value = "جستجوی محصولات";
        }
    });

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
       // console.log($("#frm-addgoods").code);
        $.ajax({
            url:'/add_goods',
            method:'POST',
            data:formData,
            contentType: false,
            processData: false
        }).success(function(result){
            $("#frm-addgoods").find("input[type=text], textarea").val("");
            if(result == "ok"){
                toastr.success("کلا با موفقیت ثبت شد.");
            } else if(result == "error"){
                toastr.error("کلا در سیستم موجود است!");
            } else{
                toastr.error("فیلد کد و مدل نباید خالی باشد!")
            }
        }).error(function(err){
           // console.log(err);
            toastr.error("عکس باید انتخاب شده باشد!");
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
        // console.log($("#search_goods").val());
        $.ajax({
            url:'/search_goods',
            method:'POST',
            data:{search : $("#search_goods").val()}
        }).success(function(goods){
            goods_table_data = goods;
            var trHTML = '';
            $.each(goods, function (i, item) {
                trHTML += '<tr><td class="col-sm-3">' + item.brand + '</td><td class="col-sm-4">' + item.category + '</td><td style="width:50px;">' + item.code + '</td><td><button class="btn btn-primary btn-sm" type="button" data-toggle="modal" data-target="#edit_goods_pop">ویرایش</button></td></td><td><button class="btn btn-danger btn-sm" type="button">حذف</button></td><td class="hidden">'+i+'</td></tr>';
            });
            $("#goods_table").html(trHTML);
        }).error(function(){

        });
        $('#goods_table').on('click','tr td :button:contains(حذف)',function(e){
            var index = $(this).closest('tr').find('td:last').text();
            $.ajax({
                url:'/delete_goods',
                method:'POST',
                data: goods_table_data[$(this).closest('tr').find('td:last').text()]
            }).success(function(result){
                if(result == 'ok'){
                    toastr.success("کلا با موفقیت حذف شد.");
                }
                goods_table_data.splice(index,1);
                var trHTML = '';
                $.each(goods_table_data, function (i, item) {
                    trHTML += '<tr><td class="col-sm-3">' + item.brand + '</td><td>' + item.category + '</td><td style="width: 50px;">' + item.code + '</td><td><button class="btn btn-primary btn-sm" type="button" data-toggle="modal" data-target="#edit_goods_pop">ویرایش</button></td></td><td><button class="btn btn-danger btn-sm" type="button">حذف</button></td><td class="hidden">'+i+'</td></tr>';
                });
                $("#goods_table").html(trHTML);
            }).error(function(){

            })
        });
        $('#goods_table').on('click','tr td :button:contains(ویرایش)',function(e){
            var changable_data = goods_table_data[$(this).closest('tr').find('td:last').text()];
            var index = $(this).closest('tr').find('td:last').text();
            // console.log('edit');
            $("#brand").val(changable_data.brand);
            $("#category").val(changable_data.category);
            $("#model").val(changable_data.model);
            $("#cpu").val(changable_data.cpu);
            $("#ram").val(changable_data.ram);
            $("#hdd").val(changable_data.hdd);
            $("#graphic").val(changable_data.graphic);
            $("#display").val(changable_data.display);
            $("#os").val(changable_data.os);
            $("#weight").val(changable_data.weight);
            $("#count").val(changable_data.count);
            $("#price").val(changable_data.price);
            $("#title").val(changable_data.title);
            $("#features").val(changable_data.features);
            $("#change_goods_save").off('click').click(function(){
                var _data = {};
                _data.brand = $("#brand").val();
                _data.category = $("#category").val();
                _data.model = $("#model").val();
                _data.code = changable_data.code;
                _data.cpu =  $("#cpu").val();
                _data.ram = $("#ram").val();
                _data.hdd = $("#hdd").val();
                _data.graphic = $("#graphic").val();
                _data.display = $("#display").val();
                _data.os = $("#os").val();
                _data.weight = $("#weight").val();
                _data.count = $("#count").val();
                _data.price = $("#price").val();
                _data.title = $("#title").val();
                _data.features = $("#features").val();
                _data.image_address = changable_data.image_address;
                $("#change_goods_form").submit(function(event){
                    event.preventDefault();
                });
                // console.log(_data);
                $.ajax({
                    url:'/change_goods',
                    method:'POST',
                    data: _data
                }).success(function(result){
                    if(result == 'ok'){
                        toastr.success("تغییرات با موفقیت ثبت شد.");
                    }
                    goods_table_data.splice(index,1,_data);
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
                trHTML += '<tr><td class="col-sm-3">' + item.first_name + '</td><td class="col-sm-4">' + item.last_name + '</td><td style="width: 50px;">' + item.username + '</td><td><button class="btn btn-primary btn-sm" type="button" data-toggle="modal" data-target="#user_edit_management_pop">ویرایش</button></td></td><td><button class="btn btn-danger btn-sm" type="button">حذف</button></td><td class="hidden">'+i+'</td></tr>';
            });
            $("#users_table").html(trHTML);
        }).error(function(){

        });
        $('#users_table').on('click','tr td :button:contains(حذف)',function(e){
            var index = $(this).closest('tr').find('td:last').text();
            $.ajax({
                url:'/delete_users',
                method:'POST',
                data: users_table_data[$(this).closest('tr').find('td:last').text()]
            }).success(function(result){
                if(result == 'ok'){
                    toastr.success("کاربر با موفقیت حذف شد.");
                }
                users_table_data.splice(index,1);
                var trHTML = '';
                $.each(users_table_data, function (i, item) {
                    trHTML += '<tr><td class="col-sm-3">' + item.first_name + '</td><td>' + item.last_name + '</td><td style="width: 50px;">' + item.username + '</td><td><button class="btn btn-primary btn-sm" type="button" data-toggle="modal" data-target="#user_edit_management_pop">ویرایش</button></td></td><td><button class="btn btn-danger btn-sm" type="button">حذف</button></td><td class="hidden">'+i+'</td></tr>';
                });
                $("#users_table").html(trHTML);
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
            }).error(function(){

            })
        });

    });

    //for adding goods to basket
    $(document).on('click', 'button', function () {
        var val = this.getAttribute("value");
        if(val != null && val != "apple" && val != 'samsung' && val != 'lg'){
            var goods_id;
            goods_id = this.value;
            var _data = {};
            _data.good_id = goods_id;
            _data.user_id = $("#inp_user_id").val();
            console.log($("#inp_user_id").val());
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
        }
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
            // console.log(_data.good_id);
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
                    // console.log(user_shoplist);
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
            // console.log(user_shoplist.length);
            if(user_shoplist.length != 0){
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

    //for showing goods detail pop-up
    $(document).on('click', 'img, .goods-detail', function(){
        if(this.getAttribute("value") != null){
            var _data = {};
            _data.goods_id = this.getAttribute("value");
            $.ajax({
                url: '/show_goods_detail',
                method:'POST',
                data: _data
            }).success(function (result) {
                var tmHTML =
                    '<div class="pull-left" style="padding-bottom: 80px;">' +
                    '<a data-toggle="modal">' +
                    '<img class="img-responsive center-block panel-size good-img" src="'+result.image_address+'" alt="Image" style="max-height: 240px">' +
                    '</a>' +
                    '</div>' +
                    '<div>' +
                    '<p dir="ltr" style="text-align: left;">CPU:&nbsp;<strong>'+result.cpu+'&nbsp;</strong></p>' +
                    '<p dir="ltr" style="text-align: left;">Ram:<strong>&nbsp;'+result.ram+'&nbsp;</strong></p>' +
                    '<p dir="ltr" style="text-align: left;">Hard Disk:&nbsp;<strong>'+result.hdd+'</strong></p>' +
                    '<p dir="ltr" style="text-align: left;">Graphic:&nbsp;<strong>'+result.graphic+'</strong></p>' +
                    '<p dir="ltr" style="text-align: left;">Display:&nbsp;<strong>'+result.display+'</strong></p>' +
                    '<p dir="ltr" style="text-align: left;">Operating System:&nbsp;<strong>'+result.os+'</strong></p>' +
                    '<p dir="ltr" style="text-align: left;">Ports &amp;&nbsp;features:&nbsp;<strong>'+result.features+'</strong></p>' +
                    '<p dir="ltr" style="text-align: left;">Weight:&nbsp;<strong>'+result.weight+' kg</strong></p>' +
                    '</div>';
                var header = result.category + '  ' + result.brand + '  ' + result.model;
                $('#good_detail_header').text(header);
                $('#goods_detail_modal_body').html(tmHTML);
                $('#btn-basket').val(result._id) ;
            }).error(function () {

            })
        }
    });

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    $("#report_count").click(function(){
        $('#chart').html('');
        var _data = {};
        $('#draw_pie').click(function () {
            var from_date = $('#from_date').val();
            var to_date = $('#to_date').val();
            _data.from_date = Date.parse(from_date);
            _data.to_date = Date.parse(to_date);
            _data.chart_num = 1;
            $.ajax({
                url:'/chart',
                method:'POST',
                data: _data
            }).success(function(data){
                var chart_data = [];
                var each_data = [];
                each_data.push('Brand');
                each_data.push('تعداد');
                each_data.push( { role: 'style' } );
                chart_data.push(each_data);
                data.forEach(function(index){
                    each_data = [];
                    each_data.push(index._id);
                    each_data.push(index.totalAmount);
                    each_data.push('color: '+getRandomColor());
                    chart_data.push(each_data);
                });
                    function drawChart() {
                        var data = google.visualization.arrayToDataTable(chart_data);
                        var options = {
                            title: 'نمودار دایره ای موجودی انبار'
                        };
                        var chart = new google.visualization.PieChart(document.getElementById('chart'));
                        chart.draw(data, options);
                    }
                    google.charts.load('current', {'packages':['corechart']});
                    google.charts.setOnLoadCallback(drawChart);
            }).error(function(err){
                if(err){
                    console.log(err);
                }
            });
        });
        $('#draw_line').click(function () {
            var from_date = $('#from_date').val();
            var to_date = $('#to_date').val();
            _data.from_date = Date.parse(from_date);
            _data.to_date = Date.parse(to_date);
            _data.chart_num = 1;
            $.ajax({
                url:'/chart',
                method:'POST',
                data: _data
            }).success(function(data){
                var chart_data = [];
                var each_data = [];
                each_data.push('Brand');
                each_data.push('تعداد');
                each_data.push( { role: 'style' } );
                chart_data.push(each_data);
                data.forEach(function(index){
                    each_data = [];
                    each_data.push(index._id);
                    each_data.push(index.totalAmount);
                    each_data.push('color: '+getRandomColor());
                    chart_data.push(each_data);
                });
                    function drawBasic() {
                        var data = google.visualization.arrayToDataTable(chart_data);
                        var options = {
                            title: 'نمودار میله ای موجودی انبار'
                        };

                        var chart = new google.visualization.ColumnChart(document.getElementById('chart'));
                        chart.draw(data, options);
                    }
                    google.charts.load('current', {packages: ['corechart', 'bar']});
                    google.charts.setOnLoadCallback(drawBasic);
            }).error(function(err){
                if(err){
                    console.log(err);
                }
            });
        });
    });
    $("#report_value").click(function(){
        $('#chart').html('');
        var _data = {};
        $('#draw_pie').click(function () {
            var from_date = $('#from_date').val();
            var to_date = $('#to_date').val();
            _data.from_date = Date.parse(from_date);
            _data.to_date = Date.parse(to_date);
            _data.chart_num = 2;
            $.ajax({
                url:'/chart',
                method:'POST',
                data: _data
            }).success(function(data){
                var chart_data = [];
                var each_data = [];
                each_data.push('Brand');
                each_data.push('تعداد');
                each_data.push( { role: 'style' } );
                chart_data.push(each_data);
                data.forEach(function(index){
                    each_data = [];
                    each_data.push(index._id);
                    each_data.push(index.totalAmount);
                    each_data.push('color: '+getRandomColor());
                    chart_data.push(each_data);
                });
                function drawChart() {
                    var data = google.visualization.arrayToDataTable(chart_data);
                    var options = {
                        title: 'نمودار دایره ای موجودی انبار'
                    };
                    var chart = new google.visualization.PieChart(document.getElementById('chart'));
                    chart.draw(data, options);
                }
                google.charts.load('current', {'packages':['corechart']});
                google.charts.setOnLoadCallback(drawChart);
            }).error(function(err){
                if(err){
                    console.log(err);
                }
            });
        });
        $('#draw_line').click(function () {
            var from_date = $('#from_date').val();
            var to_date = $('#to_date').val();
            _data.from_date = Date.parse(from_date);
            _data.to_date = Date.parse(to_date);
            _data.chart_num = 2;
            $.ajax({
                url:'/chart',
                method:'POST',
                data: _data
            }).success(function(data){
                var chart_data = [];
                var each_data = [];
                each_data.push('Brand');
                each_data.push('تعداد');
                each_data.push( { role: 'style' } );
                chart_data.push(each_data);
                data.forEach(function(index){
                    each_data = [];
                    each_data.push(index._id);
                    each_data.push(index.totalAmount);
                    each_data.push('color: '+getRandomColor());
                    chart_data.push(each_data);
                });
                function drawBasic() {
                    var data = google.visualization.arrayToDataTable(chart_data);
                    var options = {
                        title: 'نمودار میله ای موجودی انبار'
                    };

                    var chart = new google.visualization.ColumnChart(document.getElementById('chart'));
                    chart.draw(data, options);
                }
                google.charts.load('current', {packages: ['corechart', 'bar']});
                google.charts.setOnLoadCallback(drawBasic);
            }).error(function(err){
                if(err){
                    console.log(err);
                }
            });
        });
    });
    $("#report_sale").click(function(){
        $('#chart').html('');
        var _data = {};
        $('#draw_pie').click(function () {
            var from_date = $('#from_date').val();
            var to_date = $('#to_date').val();
            _data.from_date = Date.parse(from_date);
            _data.to_date = Date.parse(to_date);
            _data.chart_num = 3;
            $.ajax({
                url:'/chart',
                method:'POST',
                data: _data
            }).success(function(data){
                var chart_data = [];
                var each_data = [];
                each_data.push('Brand');
                each_data.push('تعداد');
                each_data.push( { role: 'style' } );
                chart_data.push(each_data);
                data.forEach(function(index){
                    each_data = [];
                    each_data.push(index._id);
                    each_data.push(index.totalAmount);
                    each_data.push('color: '+getRandomColor());
                    chart_data.push(each_data);
                });
                function drawChart() {
                    var data = google.visualization.arrayToDataTable(chart_data);
                    var options = {
                        title: 'نمودار دایره ای موجودی انبار'
                    };
                    var chart = new google.visualization.PieChart(document.getElementById('chart'));
                    chart.draw(data, options);
                }
                google.charts.load('current', {'packages':['corechart']});
                google.charts.setOnLoadCallback(drawChart);
            }).error(function(err){
                if(err){
                    console.log(err);
                }
            });
        });
        $('#draw_line').click(function () {
            var from_date = $('#from_date').val();
            var to_date = $('#to_date').val();
            _data.from_date = Date.parse(from_date);
            _data.to_date = Date.parse(to_date);
            _data.chart_num = 3;
            $.ajax({
                url:'/chart',
                method:'POST',
                data: _data
            }).success(function(data){
                var chart_data = [];
                var each_data = [];
                each_data.push('Brand');
                each_data.push('تعداد');
                each_data.push( { role: 'style' } );
                chart_data.push(each_data);
                data.forEach(function(index){
                    each_data = [];
                    each_data.push(index._id);
                    each_data.push(index.totalAmount);
                    each_data.push('color: '+getRandomColor());
                    chart_data.push(each_data);
                });
                function drawBasic() {
                    var data = google.visualization.arrayToDataTable(chart_data);
                    var options = {
                        title: 'نمودار میله ای موجودی انبار'
                    };

                    var chart = new google.visualization.ColumnChart(document.getElementById('chart'));
                    chart.draw(data, options);
                }
                google.charts.load('current', {packages: ['corechart', 'bar']});
                google.charts.setOnLoadCallback(drawBasic);
            }).error(function(err){
                if(err){
                    console.log(err);
                }
            });
        });
    });

    var pnp_click_cnt = 1;
    $('#product_next_page').click(function () {
        var user_id = $('#inp_user_id').val();
        var type_select = $('#type_select').val();
        if(this.value == 'apple'){
            var _data = {};
            pnp_click_cnt++;
            var start = (pnp_click_cnt-1) * 9;
            _data._start = start;
            _data._brand = this.value;
            _data._type = type_select;
            $.ajax({
                url: '/product_page',
                method: 'POST',
                data: _data
            }).success(function (product) {
                // console.log(product);
                if(product.length > 0){
                    var tmHTML = '';
                    $.each(product, function (i, item){
                        tmHTML += '<div class="col-sm-4"><div class="panel panel-primary"><div class="panel-heading text-center">'+ item.title +'</div><input class="hidden" id="inp_good_id" value="'+ item._id +'"> </input><input class="hidden" id="inp_user_id" value="'+ user_id +'"> </input>' +
                            '<div class="panel-body"><a href="#show_goods_pop" data-toggle="modal"><img class="img-responsive center-block panel-size" id="goods-detail" src="'+ item.image_address +'"' + 'alt="Img" value="'+ item._id +'"></a></div><div class="panel-footer text-right">';
                        if(item.count != 0){
                            tmHTML += '<button class="btn btn-primary glyphicon glyphicon-shopping-cart basket" id="btn-basket" value="'+ item._id +'">اضافه کردن به</button>' +
                                '<span class="pull-left price_spn" id="price_spn">'+ item.price +' تومان</span>';
                        }else{
                            tmHTML += '<button disabled class="btn btn-primary glyphicon glyphicon-shopping-cart basket" id="btn-basket" value="'+ item._id +'">اضافه کردن به</button>' +
                                '<span class="pull-left price_spn" id="price_spn">'+ item.price +' ناموجود</span>';
                        }
                        tmHTML += '</div></div></div>';
                    });
                    // console.log(tmHTML);
                    $('.page-body').html(tmHTML);
                    if(product.length < 9){
                        pnp_click_cnt--;
                    }
                }else{
                    pnp_click_cnt--;
                }
            }).error(function () {

            });
        }
        else if(this.value == 'samsung'){
            var _data = {};
            pnp_click_cnt++;
            var start = (pnp_click_cnt-1) * 9;
            _data._start = start;
            _data._brand = this.value;
            _data._type = type_select;
            $.ajax({
                url: '/product_page',
                method: 'POST',
                data: _data
            }).success(function (product) {
                if(product.length > 0){
                    var tmHTML = '';
                    $.each(product, function (i, item){
                        tmHTML += '<div class="col-sm-4"><div class="panel panel-primary"><div class="panel-heading text-center">'+ item.title +'</div><input class="hidden" id="inp_good_id" value="'+ item._id +'"> </input><input class="hidden" id="inp_user_id" value="'+ user_id +'"> </input>' +
                            '<div class="panel-body"><a href="#show_goods_pop" data-toggle="modal"><img class="img-responsive center-block panel-size" id="goods-detail" src="'+ item.image_address +'"' + 'alt="Img" value="'+ item._id +'"></a></div><div class="panel-footer text-right">';
                        if(item.count != 0){
                            tmHTML += '<button class="btn btn-primary glyphicon glyphicon-shopping-cart basket" id="btn-basket" value="'+ item._id +'">اضافه کردن به</button>' +
                                '<span class="pull-left price_spn" id="price_spn">'+ item.price +' تومان</span>';
                        }else{
                            tmHTML += '<button disabled class="btn btn-primary glyphicon glyphicon-shopping-cart basket" id="btn-basket" value="'+ item._id +'">اضافه کردن به</button>' +
                                '<span class="pull-left price_spn" id="price_spn">'+ item.price +' ناموجود</span>';
                        }
                        tmHTML += '</div></div></div>';
                    });
                    // console.log(tmHTML);
                    $('.page-body').html(tmHTML);
                    if(product.length < 9){
                        pnp_click_cnt--;
                    }
                }else{
                    pnp_click_cnt--;
                }
            }).error(function () {

            });
        }
        else if(this.value == 'lg'){
            var _data = {};
            pnp_click_cnt++;
            var start = (pnp_click_cnt-1) * 9;
            _data._start = start;
            _data._brand = this.value;
            _data._type = type_select;
            $.ajax({
                url: '/product_page',
                method: 'POST',
                data: _data
            }).success(function (product) {
                if(product.length > 0){
                    var tmHTML = '';
                    $.each(product, function (i, item){
                        tmHTML += '<div class="col-sm-4"><div class="panel panel-primary"><div class="panel-heading text-center">'+ item.title +'</div><input class="hidden" id="inp_good_id" value="'+ item._id +'"> </input><input class="hidden" id="inp_user_id" value="'+ user_id +'"> </input>' +
                            '<div class="panel-body"><a href="#show_goods_pop" data-toggle="modal"><img class="img-responsive center-block panel-size" id="goods-detail" src="'+ item.image_address +'"' + 'alt="Img" value="'+ item._id +'"></a></div><div class="panel-footer text-right">';
                        if(item.count != 0){
                            tmHTML += '<button class="btn btn-primary glyphicon glyphicon-shopping-cart basket" id="btn-basket" value="'+ item._id +'">اضافه کردن به</button>' +
                                '<span class="pull-left price_spn" id="price_spn">'+ item.price +' تومان</span>';
                        }else{
                            tmHTML += '<button disabled class="btn btn-primary glyphicon glyphicon-shopping-cart basket" id="btn-basket" value="'+ item._id +'">اضافه کردن به</button>' +
                                '<span class="pull-left price_spn" id="price_spn">'+ item.price +' ناموجود</span>';
                        }
                        tmHTML += '</div></div></div>';
                    });
                    $('.page-body').html(tmHTML);
                    if(product.length < 9){
                        pnp_click_cnt--;
                    }
                }else{
                    pnp_click_cnt--;
                }
            }).error(function () {

            });
        }
    });
    $('#product_previous_page').click(function () {
        var user_id = $('#inp_user_id').val();
        var type_select = $('#type_select').val();
        if(this.value == 'apple'){
            var _data = {};
            pnp_click_cnt--;
            var start = (pnp_click_cnt-1) * 9;
            if(start < 0){
                _data._start = 0;
                pnp_click_cnt = 1;
            }else{
                _data._start = start;
            }
            _data._brand = this.value;
            _data._type = type_select;
            $.ajax({
                url: '/product_page',
                method: 'POST',
                data: _data
            }).success(function (product) {
                // console.log(product);
                if(product.length != 0){
                    var tmHTML = '';
                    $.each(product, function (i, item){
                        tmHTML += '<div class="col-sm-4"><div class="panel panel-primary"><div class="panel-heading text-center">'+ item.title +'</div><input class="hidden" id="inp_good_id" value="'+ item._id +'"> </input><input class="hidden" id="inp_user_id" value="'+ user_id +'"> </input>' +
                            '<div class="panel-body"><a href="#show_goods_pop" data-toggle="modal"><img class="img-responsive center-block panel-size" id="goods-detail" src="'+ item.image_address +'"' + 'alt="Img" value="'+ item._id +'"></a></div><div class="panel-footer text-right">';
                        if(item.count != 0){
                            tmHTML += '<button class="btn btn-primary glyphicon glyphicon-shopping-cart basket" id="btn-basket" value="'+ item._id +'">اضافه کردن به</button>' +
                                '<span class="pull-left price_spn" id="price_spn">'+ item.price +' تومان</span>';
                        }else{
                            tmHTML += '<button disabled class="btn btn-primary glyphicon glyphicon-shopping-cart basket" id="btn-basket" value="'+ item._id +'">اضافه کردن به</button>' +
                                '<span class="pull-left price_spn" id="price_spn">'+ item.price +' ناموجود</span>';
                        }
                        tmHTML += '</div></div></div>';
                    });
                    $('.page-body').html(tmHTML);
                    // if(pnp_click_cnt-1 == 0){
                    //     $('#product_next_page').show();
                    //     $('#product_previous_page').hide();
                    // }
                }
            }).error(function () {

            });
        }
        else if(this.value == 'samsung'){
            var _data = {};
            pnp_click_cnt--;
            var start = (pnp_click_cnt-1) * 9;
            if(start < 0){
                _data._start = 0;
                pnp_click_cnt = 1;
            }else{
                _data._start = start;
            }
            _data._brand = this.value;
            _data._type = type_select;
            $.ajax({
                url: '/product_page',
                method: 'POST',
                data: _data
            }).success(function (product) {
                if(product.length != 0){
                    var tmHTML = '';
                    $.each(product, function (i, item){
                        tmHTML += '<div class="col-sm-4"><div class="panel panel-primary"><div class="panel-heading text-center">'+ item.title +'</div><input class="hidden" id="inp_good_id" value="'+ item._id +'"> </input><input class="hidden" id="inp_user_id" value="'+ user_id +'"> </input>' +
                            '<div class="panel-body"><a href="#show_goods_pop" data-toggle="modal"><img class="img-responsive center-block panel-size" id="goods-detail" src="'+ item.image_address +'"' + 'alt="Img" value="'+ item._id +'"></a></div><div class="panel-footer text-right">';
                        if(item.count != 0){
                            tmHTML += '<button class="btn btn-primary glyphicon glyphicon-shopping-cart basket" id="btn-basket" value="'+ item._id +'">اضافه کردن به</button>' +
                                '<span class="pull-left price_spn" id="price_spn">'+ item.price +' تومان</span>';
                        }else{
                            tmHTML += '<button disabled class="btn btn-primary glyphicon glyphicon-shopping-cart basket" id="btn-basket" value="'+ item._id +'">اضافه کردن به</button>' +
                                '<span class="pull-left price_spn" id="price_spn">'+ item.price +' ناموجود</span>';
                        }
                        tmHTML += '</div></div></div>';
                    });
                    $('.page-body').html(tmHTML);
                    // if(pnp_click_cnt-1 == 0){
                    //     $('#product_next_page').show();
                    //     $('#product_previous_page').hide();
                    // }
                }
            }).error(function () {

            });
        }
        else if(this.value == 'lg'){
            var _data = {};
            pnp_click_cnt--;
            var start = (pnp_click_cnt-1) * 9;
            if(start < 0){
                _data._start = 0;
                pnp_click_cnt = 1;
            }else{
                _data._start = start;
            }
            _data._brand = this.value;
            _data._type = type_select;
            $.ajax({
                url: '/product_page',
                method: 'POST',
                data: _data
            }).success(function (product) {
                if(product.length != 0){
                    var tmHTML = '';
                    $.each(product, function (i, item){
                        tmHTML += '<div class="col-sm-4"><div class="panel panel-primary"><div class="panel-heading text-center">'+ item.title +'</div><input class="hidden" id="inp_good_id" value="'+ item._id +'"> </input><input class="hidden" id="inp_user_id" value="'+ user_id +'"> </input>' +
                            '<div class="panel-body"><a href="#show_goods_pop" data-toggle="modal"><img class="img-responsive center-block panel-size" id="goods-detail" src="'+ item.image_address +'"' + 'alt="Img" value="'+ item._id +'"></a></div><div class="panel-footer text-right">';
                        if(item.count != 0){
                            tmHTML += '<button class="btn btn-primary glyphicon glyphicon-shopping-cart basket" id="btn-basket" value="'+ item._id +'">اضافه کردن به</button>' +
                                '<span class="pull-left price_spn" id="price_spn">'+ item.price +' تومان</span>';
                        }else{
                            tmHTML += '<button disabled class="btn btn-primary glyphicon glyphicon-shopping-cart basket" id="btn-basket" value="'+ item._id +'">اضافه کردن به</button>' +
                                '<span class="pull-left price_spn" id="price_spn">'+ item.price +' ناموجود</span>';
                        }
                        tmHTML += '</div></div></div>';
                    });
                    // console.log(tmHTML);
                    $('.page-body').html(tmHTML);
                    // if(pnp_click_cnt-1 == 0){
                    //     $('#product_next_page').show();
                    //     $('#product_previous_page').hide();
                    // }
                }
            }).error(function () {

            });
        }
    });

    $('#type_select').on('change',function () {
        var _data = {};
        pnp_click_cnt = 1;
        var user_id = $('#inp_user_id').val();
        _data._brand = $('#brand_inp').val();
        _data._start = 0;
        _data._type = this.value;
        $.ajax({
            url: '/product_page',
            method: 'POST',
            data: _data
        }).success(function (product) {
            var tmHTML = '';
            $.each(product, function (i, item){
                tmHTML += '<div class="col-sm-4"><div class="panel panel-primary"><div class="panel-heading text-center">'+ item.title +'</div><input class="hidden" id="inp_good_id" value="'+ item._id +'"> </input><input class="hidden" id="inp_user_id" value="'+ user_id +'"> </input>' +
                    '<div class="panel-body"><a href="#show_goods_pop" data-toggle="modal"><img class="img-responsive center-block panel-size" id="goods-detail" src="'+ item.image_address +'"' + 'alt="Img" value="'+ item._id +'"></a></div><div class="panel-footer text-right">';
                if(item.count != 0){
                    tmHTML += '<button class="btn btn-primary glyphicon glyphicon-shopping-cart basket" id="btn-basket" value="'+ item._id +'">اضافه کردن به</button>' +
                        '<span class="pull-left price_spn" id="price_spn">'+ item.price +' تومان</span>';
                }else{
                    tmHTML += '<button disabled class="btn btn-primary glyphicon glyphicon-shopping-cart basket" id="btn-basket" value="'+ item._id +'">اضافه کردن به</button>' +
                        '<span class="pull-left price_spn" id="price_spn">'+ item.price +' ناموجود</span>';
                }
                tmHTML += '</div></div></div>';
            });
            $('.page-body').html(tmHTML);
        }).error(function () {

        });
    });

});