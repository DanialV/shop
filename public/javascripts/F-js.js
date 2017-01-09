var inp = document.getElementById("search-input");
inp.onfocus = function () {
    if (inp.value == "جستجوی محصولات"){
        inp.value = "";
    }
};
inp.onblur = function () {
    if (inp.value == "") {
        inp.value = "جستجوی محصولات";
    }
};
