// var viewModel = function () {
//     // These are the initial options
//     this.ways = ko.observableArray(['France', 'Germany', 'Spain']),
// }
//
// ko.applyBindings(new viewModel());

var map;
var markers = [];
// 创建默认标记样式和高亮标记样式
var defaultIcon = 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png';
var highlightedIcon = 'http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png';



function init() {
    // 创建地图对象
    map = new AMap.Map('map', {
        center: [113.280637, 23.125178],
        zoom: 11,
        mapStyle: 'amap://styles/637e4ed9f0ee707fc875535c5cc356d6'
    });

    // 添加 工具条
    map.plugin(["AMap.ToolBar"], function () {
        map.addControl(new AMap.ToolBar());
        map.addControl(new AMap.Scale());
        map.addControl(new AMap.Geolocation());
        map.addControl(new AMap.OverView({isOpen: true}));
    });

    //添加搜索插件
    AMap.service('AMap.PlaceSearch',function(){//回调函数
        //实例化PlaceSearch
        placeSearch= new AMap.PlaceSearch();
        //TODO: 使用placeSearch对象调用关键字搜索的功能
    })

    //添加输入提示插件
    AMap.plugin('AMap.Autocomplete',function(){//回调函数
        //实例化Autocomplete
        var autoOptions = {
            city: "020", //城市，默认全国
            input:"zoom-to-area-text"//使用联想输入的input的id
        };
        autocomplete= new AMap.Autocomplete(autoOptions);
        //TODO: 使用autocomplete对象调用相关功能
    });

    // 创建标记集合
    var locations = [
        {title: '中山纪念堂', position: [113.264672, 23.132868]},
        {title: '北京路', position: [113.268904, 23.124397]},
        {title: '西门口', position: [113.244261, 23.125981]},
        {title: '荔枝湾', position: [113.238155, 23.121639]},
        {title: '越秀山', position: [113.268062, 23.140349]}
    ];

    // 创建 默认信息窗体
    var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});

    AMap.service('AMap.PlaceSearch', function () {//回调函数
        //实例化PlaceSearch
        placeSearch = new AMap.PlaceSearch();
        //TODO: 使用placeSearch对象调用关键字搜索的功能
    })




    // 添加标记并绑定标记事件
    for (var i = 0; i < locations.length; i++) {
        var position = locations[i].position;
        var title = locations[i].title;
        var lat = position[0];
        let log = position[1];

        var marker = new AMap.Marker({
            map: map,
            position: position,
            title: title,
            offset: new AMap.Pixel(-12, -36)
        });

        markers.push(marker);
        markers[i].setMap(null);
        //调用foursquareAPI
        // var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll='+ lat + ',' + log + '&client_id=I35M5ZXXFUZTAMVQPV0BRTAC4O3PJ3NDVV4BHNID5Q2NDTLL' + '&client_secret=LTUSTS3QA4ZGOSJGG0M35FIXK4LYXTGLL2UYAXWGEZC50RUT' + '&v=20180325' + '&query=' + title + '&m=foursquare';
        var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll=' +
            log + ',' + lat + '&client_id=' + 'I35M5ZXXFUZTAMVQPV0BRTAC4O3PJ3NDVV4BHNID5Q2NDTLL' +
            '&client_secret=' + 'LTUSTS3QA4ZGOSJGG0M35FIXK4LYXTGLL2UYAXWGEZC50RUT' + '&query=' + title +
            '&v=20180325';

        $.getJSON(foursquareURL).done(
            function(data) {
                var results = data.response.venues[0];
                self.URL = results.url;
                if (typeof self.URL === 'undefined') {
                    self.URL = "";
                }
                self.street = results.location.formattedAddress[0];
                self.city = results.location.formattedAddress[1];
                self.phone = results.contact.phone;

            }).fail(function() {
            alert("There was an error with the Foursquare API call. Please refresh the page and try again to load Foursquare data.");
        });

        //     fetch(foursquareURL)
        //         .then(response => response.json())
        // .then(function(data) {
        //             var results = data.response.venues[0];
        //             self.URL = results.url;
        //             if (typeof self.URL === 'undefined'){
        //                 self.URL = "";
        //             }
        //             self.street = results.location.formattedAddress[0];
        //             self.city = results.location.formattedAddress[1];
        //             self.phone = results.contact.phone;
        //             if (typeof self.phone === 'undefined'){
        //                 self.phone = "";
        //             } else {
        //                 self.phone = formatPhone(self.phone);
        //             }
        //         })
        //         .catch();
// function addText(data) {
//     var results = data.response.venues[0];
//
//     self.name = results.name;
//     self.address = results.location.address;
//     self.city = results.location.formattedAddress[1];
//     self.phone = results.contact.phone;
// }
        marker.content =self.name + self.address;


        marker.on('click', markerClick);

        // 设置鼠标移入和移出标记的图标状态
        marker.on('mouseover', function() {
            this.setIcon(highlightedIcon);
        });
        marker.on('mouseout', function() {
            this.setIcon(defaultIcon);
        });



// 为标记设置动画
        marker.setAnimation('AMAP_ANIMATION_DROP');
        document.getElementById('show-listings').addEventListener('click', showListings);
        document.getElementById('hide-listings').addEventListener('click', hideListings);
    }
    document.getElementById('search').addEventListener('click', function () {
        goSearch();
    });


    AMap.plugin(['AMap.Autocomplete','AMap.PlaceSearch'],function(){
        var autoOptions = {
            city: "020", //城市，默认全国
            input: "zoom-to-area-text"//使用联想输入的input的id
        };
        autocomplete= new AMap.Autocomplete(autoOptions);
        var placeSearch = new AMap.PlaceSearch({
            city:'020',
            map:map
        })
        AMap.event.addListener(autocomplete, "select", function(e){
            //TODO 针对选中的poi实现自己的功能
            placeSearch.setCity(e.poi.adcode);
            placeSearch.search(e.poi.name)
        });
    });

    // 点击事件方法主体
    function markerClick(e) {
        infoWindow.setContent(e.target.content);
        infoWindow.open(map, e.target.getPosition());
    }
}




// 显示标记方法主体
function showListings() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
    map.setFitView();
}

// 隐藏标记方法主体
function hideListings() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}



//查找路线方法主体
function goSearch () {

    //加载出行方式插件
    AMap.service(["AMap.Transfer", "AMap.Walking", "AMap.Driving", "AMap.Riding"], function () {
        var transOptions = {
            map: map,
            city: '020',
            panel: 'panel',                            //公交城市
            cityd: '020'
            // policy: AMap.TransferPoldsicy.LEAST_TIME //乘车策略
        };
        //构造出行方式类
        var mode = document.getElementById('mode').value;
        if (mode === "Transfer") {
            var trans = new AMap.Transfer(transOptions);
        }
        if (mode === "Walking") {
            var trans = new AMap.Walking(transOptions);
        }
        if (mode === "Driving") {
            var trans = new AMap.Driving(transOptions);
        }
        if (mode === "Riding") {
            var trans = new AMap.Riding(transOptions);
        }

        var panelContent = document.getElementById('panel');
        var origin = document.getElementById('origin').value;
        var destination = document.getElementById('destination').value;
        //根据起、终点坐标查询路线
        if (origin == "" || destination == "") {
            window.alert('请输入起点及终点');
        } else {
            panelContent.innerHTML = "";
            trans.search([{keyword: origin}, {keyword: destination}], function (status, result) {
                if (status === "error") {
                    window.alert('Error was' + result.info);
                }
                if (status === "no_data") {
                    window.alert('暂时没有该路线的数据');
                }
                if (status === 'complete' && result.info === 'OK') {
                    this.autoRender({
                        data: result,
                        map: map,
                        panel: "panel"
                    });
                }
            });
        }
    })
}

//关键字搜索方法主体
// function zoomToArea() {
//     var address = document.getElementById('zoom-to-area-text').value;
//
//     AMap.service(["AMap.PlaceSearch",'AMap.Autocomplete'], function() {
//         var autoOptions = {
//             city: "北京", //城市，默认全国
//             input: "input"//使用联想输入的input的id
//         };
//         autocomplete= new AMap.Autocomplete(autoOptions);
//         var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
//             pageSize: 5,
//             pageIndex: 1,
//             city: "020", //城市
//             map: map,
//             panel: "panel"
//         });
//     // Make sure the address isn't blank.
//         if (address == '') {
//         window.alert('You must enter an area, or address.');
//     } else {
//             //关键字查询
//             placeSearch.search(address,function (sataus,result) {
//                 if (status === '1' && result.info === 'OK') {
//                     map.center(pois[0].poi.location);
//                     map.setZoom(15);
//                 } else {
//                     window.alert('We could not find that location - try entering a more' +
//                         ' specific place.');
//                 }
//             });
//      }
//     });
// }

