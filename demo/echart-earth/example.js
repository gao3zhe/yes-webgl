define(function(require) {
    var CodeMirror = require('lib/codemirror/codemirror');
    var ec = require('echarts');
    require('echarts-x');
    require('echarts/chart/map');
    require('echarts/chart/bar');
    require('echarts-x/chart/map3d');
    require('lib/codemirror/mode/javascript');





    myChart = ec.init(document.getElementById('chart'));

    var options = {
        title: {
            text: 'Map with texture',
            x: 'center',
            textStyle: {
                color: 'white'
            }
        },
        tooltip: {
            formatter: '{b}'
        },
        series: [{
            type: 'map3d',
            mapType: 'china',
            autoRotate: false,
            baseLayer: {
                backgroundColor: '',
                backgroundImage: 'asset/earth.jpg',
                quality: 'high',
            },

            itemStyle: {
                normal: {
                    label: {
                        show: true
                    },
                    borderWidth: 1,
                    borderColor: 'yellow',
                    areaStyle: {
                        color: 'rgba(0, 0, 0, 0)'
                    }
                }
            },

            markLine: {
                effect: {
                    show: true,
                    // scaleSize: 2
                },
                distance:10,
                data: [

                ],
                itemStyle: {
                    normal: {
                        // 线的颜色默认是取 legend 的颜色
                        color: 'blue',
                        // 线宽，这里线宽是屏幕的像素大小
                        width: 2,
                        // 线的透明度
                        opacity: 0.5
                    }
                }
            },
            data: [{}]
        }]
    };

    //

    var city = "济南";
    $.ajax({
        "url": 'http://renqi.baidu.com/qianxi/api/city-migration.php?type=migrate_in&sort_by=low_index&limit=10&city_name=' + city + '&date_start=20150205&date_end=20150205',
        "dataType": 'jsonp',
        "success": function(data) {
            // console.log('@@@@@@', data);
            var tem = [];
            for (var i = 0, len = data.length; i < len; i++) {
                var temA = [];
                temA.push({
                    geoCoord: citys[city]
                });
                temA.push({
                    geoCoord: citys[data[i].city_name]
                });
                // console.log(citys[city],)
                tem.push(temA);
                options.series[0].markLine.data.push(temA);


                // console.log('#', temA);
            }
            // JSON.st
            console.log(JSON.stringify(options));
            myChart.setOption(options);
        }
    })

    // console.log([{
    //     geoCoord: [-2.197778, 57.201944]
    // }, {
    //     geoCoord: [-100.190278, 51.148056]
    // }])

    // console.log(options.series[0].markLine.data.push([{
    //     geoCoord: [-2.197778, 57.201944]
    // }, {
    //     geoCoord: [-100.190278, 51.148056]
    // }]));

    // console.log(options.series[0].markLine.data.push([{
    //     geoCoord: [-2.197778, 57.201944]
    // }, {
    //     geoCoord: [-100.190278, 51.148056]
    // }]));

    // setTimeout(function() {

    // }, 3000);

});
