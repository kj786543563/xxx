var http = require('http');
var MyReq = (function () {
    function MyReq() {
        
    }
    MyReq.prototype.get = function (fun) {
        var http = require('http');
        //var $ = require('jquery');
        var cheerio = require('cheerio');
        //http://44fuck.com/albums
        var options = [
        {
            host: '44fuck.com',
            path: '/videos?c=1',
        },
        {
            host: '44fuck.com',
            path: '/albums?page=1',
        }
        ];
        var baseUrl = 'http://44fuck.com'
        var urls = [];
        var req = http.request(options[1], function (res) {
            res.setEncoding('utf8');
            var html;
            res.on('data', function (data) {
                html += data;
                //console.log(data);
            }).on('end', function () {
                var $ = cheerio.load(html);
                var $div = $('div.album_box_new').each(function (i, elem) {
                    var imgHref = baseUrl + $(this).children('a').children('img').attr('src');
                    var href = baseUrl + $(this).children('a').attr('href');
                    urls.push({
                        img: imgHref,
                        href: href
                    });
                });
                fun(urls);
            });
        }
        );
        req.end();  //不能漏掉，结束请求，否则服务器将不会收到信息。
        return urls;
    }
    return MyReq;
})();
var PORT = 10280;

var server = http.createServer(function (req, res) {
    res.writeHeader(200, {
        'Content-Type': 'text/html;charset=utf-8'  // 添加charset=utf-8
    });
    var myreq = new MyReq();
    var urls = myreq.get(function (urls) {
        //console.log(urls);
        var s = '';
        for (var i = 0; i < urls.length; i++) {
            s += '<a href="' + urls[i].href + '">' + '<img src="' + urls[i].img + '"/>' + '</a>';
        }
        res.write(s);
        res.end();
    });

});
server.listen(PORT);
console.log('server start up!port:' + PORT);
// var fs=require("fs"); 
// var data = fs.readFileSync("./addressList.txt",'utf8');
// console.log(data);
// console.log("data");