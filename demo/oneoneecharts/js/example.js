define(function(require) {
    var CodeMirror = require('lib/codemirror/codemirror');
    var ec = require('echarts');
    require('echarts-x');
    require('echarts/chart/map');
    require('echarts/chart/bar');
    require('echarts-x/chart/map3d');
    require('lib/codemirror/mode/javascript');

    var myChart = null;

    if (myChart) {
        myChart.dispose();
    }
    myChart = ec.init(document.getElementById('chart'));

    var lines = getDate();
    // var lines = [
    //     [{
    //         // Source airport
    //         geoCoord: [145.391881, -6.081689]
    //     }, {
    //         // Destination Airport
    //         geoCoord: [133.323254, -25.630279]
    //     }]
    // ]
    // console.log(lines, lines2);
    var opt = {
        series: [{
            name: 'globe',
            type: 'map3d',
            // 底图配置
            baseLayer: {
                backgroundColor: '',
                backgroundImage: 'asset/earth.jpg',
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
            markPoint: {
                large: false,
                effect: {
                    show: true,
                    shadowBlur: 0.4
                },
                data: [{
                    geoCoord: [145.391881, -6.081689],
                    itemStyle: {
                        normal: {
                            color: 'red'
                        }
                    }
                }, {
                    geoCoord: [133.323254, -25.630279],
                    itemStyle: {
                        normal: {
                            color: 'red'
                        }
                    }
                }]
            },
            markLine: {
                effect: {
                    show: true,
                    scaleSize: 2
                },
                itemStyle: {
                    normal: {
                        // 线的颜色默认是取 legend 的颜色
                        color: 'red',
                        // 线宽，这里线宽是屏幕的像素大小
                        width: 200,
                        // 线的透明度
                        opacity: 1
                    }
                },
                data: lines
            }
        }]
    }

    function getDate() {
        var date = [24.9008, 6.66863, 24.36266, 4.542673, 24.36266, 4.542673, 23.55108, 8.590079, 23.55108, 8.590079, 35.9675, 1.378338, 35.9675, 1.378338, 39.98515, 2.760274, 39.98515, 2.760274, 31.77774, 5.059936, 31.77774, 5.059936, 30.14676, 1.2241, 30.14676, 1.2241, 29.2472, 7.96564, 29.2472, 7.96564, 33.35316, 4.35977, 33.35316, 4.35977, 25.30288, 1.424332, 25.30288, 1.424332, 32.00534, 5.903912, 32.00534, 5.903912, 33.8362, 5.627953, 33.8362, 5.627953, 26.21712, 0.55046, 26.21712, 0.55046, 15.49, 4.08841, 15.49, 4.08841, 33.5517, 6.306353, 33.5517, 6.306353, 31.77774, 5.059936, 31.77774, 5.059936, 52.24869, 0.999802, 52.24869, 0.999802, 44.49189, 6.105052, 44.49189, 6.105052, 50.18673, 4.441166, 50.18673, 4.441166, 48.32037, 7.237555, 48.32037, 7.237555, 42.78171, 3.308663, 42.78171, 3.308663, 47.5352, 9.095682, 47.5352, 9.095682, 56.8872, 3.998561, 56.8872, 3.998561, 54.73292, 5.249578, 54.73292, 5.249578, 46.10186, 4.634337, 46.10186, 4.634337, 59.33968, 4.697659, 59.33968, 4.697659, 45.81636, 5.968141, 45.81636, 5.968141, 41.35268, 9.813176, 41.35268, 9.813176, 44.82346, 0.374294, 44.82346, 0.374294, 42.09009, 1.478132, 42.09009, 1.478132, 43.95276, 8.387386, 43.95276, 8.387386, 42.45219, 9.252059, 42.45219, 9.252059, 50.89892, 0.598914, 50.89892, 0.598914, 41.26945, 9.347898, 41.26945, 9.347898, 38.04227, 8.383109, 38.04227, 8.383109, 43.06228, 4.719909, 43.06228, 4.719909, 38.76612, 8.906363, 38.76612, 8.906363, 47.95925, 6.888977, 47.95925, 6.888977, 55.72834, 7.641552, 55.72834, 7.641552, -6.23128, 6.66821, -6.23128, 6.66821, 13.74103, 0.537311, 13.74103, 0.537311, 3.15486, 1.710138, 3.15486, 1.710138, 21.04398, 5.858729, 21.04398, 5.858729, 1.35965, 3.802831, 1.35965, 3.802831, 14.58926, 21.183677, 14.58926, 21.183677, 19.73425, 6.402518, 19.73425, 6.402518, 11.5505, 4.96646, 11.5505, 4.96646, 18.0047, 2.680596, 18.0047, 2.680596, 4.94694, 14.965391, 4.94694, 14.965391, -8.5413, 25.706933, -8.5413, 25.706933, 50.45636, 0.390538, 50.45636, 0.390538, 53.91446, 7.575751, 53.91446, 7.575751, 41.71406, 4.758827, 41.71406, 4.758827, 40.34883, 9.818083, 40.34883, 9.818083, 40.20791, 4.547258, 40.20791, 4.547258, 47.00792, 8.835966, 47.00792, 8.835966, 28.58787, 7.211658, 28.58787, 7.211658, 33.75008, 3.053869, 33.75008, 3.053869, 23.73357, 0.420917, 23.73357, 0.420917, 7.05986, 0.063239, 7.05986, 0.063239, 34.53026, 9.153642, 34.53026, 9.153642, 27.699, 5.361661, 27.699, 5.361661, 5.43974, 3.642583, 5.43974, 3.642583, 27.46959, 9.666628];

        var retD = [];
        for (var i = 0; i < date.length; i = i + 4) {
            var tep = [];
            tep.push({
                geoCoord: [date[i], date[i + 1]]
            });
            tep.push({
                geoCoord: [date[i + 2], date[i + 3]]
            });
            retD.push(tep);
        }

        return retD;
    }

    myChart.setOption(opt);


});
