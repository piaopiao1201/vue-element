import jsonp from 'common/js/jsonp'; 
import {getDate} from 'common/js/getDateFormat';
import {getPos} from 'api/api';
import $ from 'jquery';
import axios from 'axios';
export function createMap(container){
	var map = new BMap.Map(container,{minZoom:15,maxZoom:20,enableMapClick:false});
	map.centerAndZoom(new BMap.Point(115.834, 28.724), 17);
	map.addControl(new BMap.MapTypeControl({
		mapTypes:[
            BMAP_NORMAL_MAP,
            BMAP_HYBRID_MAP,
            BMAP_SATELLITE_MAP
        ]}));
	 // 添加带有定位的导航控件
	var navigationControl = new BMap.NavigationControl({
	    // 靠左上角位置
		anchor: BMAP_ANCHOR_TOP_LEFT,
	    // LARGE类型
		type: BMAP_NAVIGATION_CONTROL_LARGE,
	    // 启用显示定位
	});
	map.addControl(navigationControl);   
	 // 添加定位控件
	// var geolocationControl = new BMap.GeolocationControl();
	// geolocationControl.addEventListener("locationSuccess", function(e){
	//   	console.log(e.addressComponent);
	//     // 定位成功事件
	//     var address = '';
	//     address += e.addressComponent.province;
	//     address += e.addressComponent.city;
	//     address += e.addressComponent.district;
	//     address += e.addressComponent.street;
	//     address += e.addressComponent.streetNumber;
	//     //alert("当前定位地址为：" + address);
	// });
	// geolocationControl.addEventListener("locationError",function(e){
 //    // 定位失败事件
 //    alert(e.message);
 //  });

	//自定义还原控件

	// 定义一个控件类,即function
	function ZoomControl(){
	  // 默认停靠位置和偏移量
	  this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
	  this.defaultOffset = new BMap.Size(15, 150);
	}

	// 通过JavaScript的prototype属性继承于BMap.Control
	ZoomControl.prototype = new BMap.Control();

	// 自定义控件必须实现自己的initialize方法,并且将控件的DOM元素返回
	// 在本方法中创建个div元素作为控件的容器,并将其添加到地图容器中
	ZoomControl.prototype.initialize = function(map){
	  // 创建一个DOM元素
	  	var str1=require('../common/image/location.png');
	  	var str2=require('../common/image/location2.png');
		var div = document.createElement("div");
		div.style.backgroundImage="url("+str2+")";
		div.style.backgroundColor = "white";
	  // 添加文字说明
	  //div.appendChild(document.createTextNode("放大2级"));
	  // 设置样式
		
		div.style.width="32px";
		div.style.height="32px";
		div.style.backgroundSize="20px 20px";
		div.style.backgroundRepeat="no-repeat";
		div.style.backgroundPosition="6px 7px";
		div.style.boxShadow="0 0 25px #cac6c6";
	  	div.style.cursor = "pointer";
	  // 绑定事件,点击一次放大两级
	  div.onclick = function(e){
	  	this.style.backgroundImage="url("+require('../common/image/loading.gif')+")";
	  	getPos().then(res=>{
	  		console.log(res);
	  		let location=res.rgc.result.location;
	  		let lng=location.lng;
	  		let lat=location.lat;
	  		let description=res.rgc.result.pois[0].name;
	  		console.log(lng+":"+lat);
	  		var pt = new BMap.Point(lng, lat);
	  		var myIcon = new BMap.Icon(require('../common/image/marker2.png'), new BMap.Size(40,40));
	  		var marker = new BMap.Marker(pt,{icon:myIcon,title:'我在'+description});
	  		let opts = {
				width : 200,     // 信息窗口宽度
				height: 100,     // 信息窗口高度
				title : '<p id="info_label">我的位置</p>' , // 信息窗口标题
				enableMessage:true,//设置允许信息窗发送短息
				message:"亲耐滴，晚上一起吃个饭吧？戳下面的链接看下地址喔~"
			}
			let infoWindow = new BMap.InfoWindow('我在<span style="color:#f00">'+description, opts+'</span>');
			marker.info=infoWindow;
			marker.addEventListener("click", function(){          
				map.openInfoWindow(infoWindow,pt); //开启信息窗口
					// console.log(document.getElementById('info_label').parentNode);
					// console.log(document.getElementById('ds').parentNode);
			});
	  		// map.panTo(pt);
	  		// map.setZoom(17);
	  		map.centerAndZoom(pt,17);
			map.addOverlay(marker);
			this.style.backgroundImage="url("+require('../common/image/location2.png')+")";
	  	})
		//map.setZoom(map.getZoom() + 2);
		// map.panTo(new BMap.Point(115.834, 28.724));
		// map.setZoom(17);
		// getPos().then(res=>{

		// })
		// $.getJSON('https://ditu.baidu.com/?qt=ipLocation',function(data){
		// 	console.log(data);
		// })
		// $.ajax({
		// 	type:'GET',
		// 	url:'https://ditu.baidu.com/?qt=ipLocation',
		// 	headers:{
		// 		Referer:'https://ditu.baidu.com/',
		// 		Host:'ditu.baidu.com'
		// 	},
		// 	dataType: "json",
		// 	success:function(data){
		// 		console.log(data);
		// 	}
		// })
	  }
	  div.onmouseover = function(e){
		this.style.backgroundImage="url("+str1+")";
	  }
	  div.onmouseout = function(e){
		this.style.backgroundImage="url("+str2+")";
	  }
	  // 添加DOM元素到地图中
	  map.getContainer().appendChild(div);
	  // 将DOM元素返回
	  return div;
	}
	// 创建控件
	var myZoomCtrl = new ZoomControl();
	// 添加到地图当中
	map.addControl(myZoomCtrl);

	map.setCurrentCity("南昌");        // 设置地图显示的城市 此项是必须设置的
	map.enableScrollWheelZoom(true);

	// map.addEventListener("click",function(e){
	// 	alert(e.point.lng + "," + e.point.lat);
	// });
	return map;   // 创建Map实例
}

export function loadMarker(map){
	jsonp('http://www.mylaravel.com:8888/api/getmarkerList',{
		},{
			param: 'callback'
		}).then(res=>{
			let arr=res;
			//getDate(Number(res[1].created_at)*1000);
			let length=arr.length;
			for(let i=0;i<length;i++){
				let point=new BMap.Point(arr[i].lng,arr[i].lat);
				let marker = new BMap.Marker(point,{title:arr[i].label});
				let opts = {
					width : 200,     // 信息窗口宽度
					height: 100,     // 信息窗口高度
					title : '<p id="info_label">'+arr[i].label+'</p>' , // 信息窗口标题
					enableMessage:true,//设置允许信息窗发送短息
					message:"亲耐滴，晚上一起吃个饭吧？戳下面的链接看下地址喔~"
				}
				let infoWindow = new BMap.InfoWindow(arr[i].description, opts);
				marker.info=infoWindow;
				marker.addEventListener("click", function(){          
					map.openInfoWindow(infoWindow,point); //开启信息窗口
					// console.log(document.getElementById('info_label').parentNode);
					// console.log(document.getElementById('ds').parentNode);
				});
				map.addOverlay(marker);
			}
	})
}

export function loadPaintTool(map,vueObj){
	// var overlays = [];
	// var styleOptions = {
 //        strokeColor:"red",    //边线颜色。
 //        fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
 //        strokeWeight: 3,       //边线的宽度，以像素为单位。
 //        strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
 //        fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
 //        strokeStyle: 'solid' //边线的样式，solid或dashed。
 //    }
 //    //实例化鼠标绘制工具
    // var drawManager = new BMapLib.DrawingManager(map, {
    //     isOpen: false, //是否开启绘制模式
    //     enableDrawingTool: isShow, //是否显示工具栏
    //     drawingToolOptions: {
    //         anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
    //         offset: new BMap.Size(5, 5), //偏离值
    //         scale:0.7,
    //         drawingModes:[
	   //          BMAP_DRAWING_CIRCLE,
	   //          BMAP_DRAWING_POLYGON,
	   //          BMAP_DRAWING_RECTANGLE 
    //     	],
    //     },
    //     polygonOptions: styleOptions,//多边形的样式
    //     circleOptions: styleOptions, //圆的样式
    //     rectangleOptions: styleOptions //矩形的样式
    // });
 //    return drawManager;
 	this.vueObj=vueObj;
 	this.map=map;
 	this.overlays = [];
 	var styleOptions = {
        strokeColor:"red",    //边线颜色。
        //fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3,       //边线的宽度，以像素为单位。
        strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
        fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' //边线的样式，solid或dashed。
    };
    this.drawManager = new BMapLib.DrawingManager(map, {
        isOpen: false, //是否开启绘制模式
        enableDrawingTool: true, //是否显示工具栏
        drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
            offset: new BMap.Size(5, 5), //偏离值
            scale:0.7,
            drawingModes:[
	            BMAP_DRAWING_CIRCLE,
	            BMAP_DRAWING_POLYGON,
	            BMAP_DRAWING_RECTANGLE 
        	],
        },
        polygonOptions: styleOptions,//多边形的样式
        circleOptions: styleOptions, //圆的样式
        rectangleOptions: styleOptions //矩形的样式
    });
    var This=this;
    this.drawManager.addEventListener('overlaycomplete', function(e){
    	if(This.overlays.length>=1){
    		This.map.removeOverlay(e.overlay);
    		alert('只能绘制一块区域');
    	}else{
    		This.overlays.push(e.overlay);
    		This.vueObj.hasOverlay=true;
    	}
		
		//This.overlays.push(e.overlay);
    });
    // this.remove=()=>{
    // 	console.log(this);
    // }
}
//这里不能用箭头函数因为箭头函数里的this取决于上下文，具体见浏览器，收藏过的
loadPaintTool.prototype.remove=function(){
	//console.log(this);
	this.map.removeControl(this.drawManager._drawingTool);
	this.drawManager.close();
	// this.overlays.forEach((item)=>{
	// 	this.map.removeOverlay(item);
	// })
	// this.overlays=[];
	// this.vueObj.hasOverlay=false;
	//this.vueObj.hasCondition=false;
	this.clear();
}

loadPaintTool.prototype.load=function(){
	this.map.addControl(this.drawManager._drawingTool);
}

loadPaintTool.prototype.clear=function(){
	this.overlays.forEach((item)=>{
		this.map.removeOverlay(item);
	})
	this.overlays=[];
	this.vueObj.hasOverlay=false;
	this.vueObj.hasData=false;
}

