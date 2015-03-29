(function() {

    function resize() {
        $('#main').height($(window).height() - $('#header').height());
    }

    $(window).resize(resize);
    resize();

    var developMode = false;


    $(document).ready(function() {
        loadScript([
            'js/lib/echarts-x/echarts-x.js',
            'js/lib/echarts/echarts.js',
            'js/lib/echarts/chart/map.js'
        ], function() {
            require.config({
                paths: {
                    "lib": 'js/lib',
                    'echarts-x': 'js/lib/echarts-x',
                    'echarts': 'js/lib/echarts',
                    'text': 'js/lib/text'
                }
            });
            boot();
        });
    });


    function boot() {
        require(['js/example']);
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
