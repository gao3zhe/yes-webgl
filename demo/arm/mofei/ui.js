$(function() {
    var city = $('<div style="position:absolute; right:10px; top:10px; color:#ccc;"></div>');
    $('body').append(city);

    var citys = ['北京', '海口'];

    var html = "<ul class='citylist' style='line-height:1.6em; background:rgba(255,255,255,0.4); padding-right:10px; padding-bottom:10px; padding-top:10px;'>";
    html += '<div>请选择城市<div>';
    for (var i = 0; i < citys.length; i++) {
        html += "<li style='cursor:pointer;'>" + citys[i] + "</li>";
    }
    html += "</ul>";
    city.html(html);

    var list = $('.citylist').find('li');
    $('body').on('click', '.citylist li', function(e) {
        var index = list.index($(this));
        curves(pointsToPlace(window['points' + index]));
        e.preventDefault();
        return false;
    });

    //hover
    
})
