(function() {

    function resize() {
        $('#main').height($(window).height() - $('#header').height());
    }

    $(window).resize(resize);
    resize();

    $(document).ready(function() {
        loadScript([
            'echarts-x-master/doc/lib/echarts-x/echarts-x.js',
            'echarts-x-master/doc/lib/echarts/echarts.js',
            'echarts-x-master/doc/lib/echarts/chart/map.js'
        ], function() {
            require.config({
                paths: {
                    "lib": 'echarts-x-master/doc/lib',
                    'echarts-x': 'echarts-x-master/doc/lib/echarts-x',
                    'echarts': 'echarts-x-master/doc/lib/echarts',
                    'text': 'echarts-x-master/doc/lib/text'
                }
            });
            boot();
        });
    });


    function boot() {
        require(['example']);
    }

    function loadScript(urlList, onload) {
        var count = urlList.length;;
        for (var i = 0; i < urlList.length; i++) {
            var script = document.createElement('script');
            script.async = true;

            script.src = urlList[i];
            script.onload = function() {
                count--;
                if (count === 0) {
                    onload && onload();
                }
            }

            document.getElementsByTagName('head')[0].appendChild(script);
        }
    }
})()
