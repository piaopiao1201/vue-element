<template>
	<div class="box">
		<div class='toolTip'>
			<el-col :span="6" class='tool-col'>
				<el-checkbox v-model="checked" border class='editCheck' label="我的上传点" true-label="true" false-label="false" @change="handleMyMarker"></el-checkbox>
				<el-checkbox v-model="checkedMyEdit" border class='editCheck' label="编辑" true-label="true" false-label="false" @change="handleMyEditMarker" v-show="myEdit"></el-checkbox>
			</el-col>
			<el-col :span="10" class="tool-col gap">
				
			</el-col>
			<el-col :span="8" class='tool-col'>
					<el-checkbox v-model="layerMode.editChecked" border class='editCheck' label="编辑模式" true-label="true" false-label="false" @change="handleLayerEdit" v-if="loadComplete"></el-checkbox>
					<el-button type="success" round class="toolBtn" @click="removeOverlay" v-if="layerMode.isEdit">清除覆盖物</el-button>
					<el-button type="primary" round class="toolBtn" @click="getPointResult(paintManger.overlays)" v-if="hasOverlay">检索</el-button>
					<!-- <el-button type="primary" round class="toolBtn" @click="visual=true">显示</el-button> -->
				</el-col>
		</div>
		<div id="container" v-loading="loading"></div>
		<el-popover :value="visual" @show="handleShow" class="tableShow" @hide="handleHide" width="530">
			<i class="el-dialog__close el-icon el-icon-close" @click="visual=false"></i>
			<el-table :data="searchRes" stripe>
				<el-table-column width="90" property="name" label="名称"></el-table-column>
				<el-table-column width="100" property="description" label="描述"></el-table-column>
				<el-table-column width="170" property="date" label="时间"></el-table-column>
				<el-table-column width="70" property="userName" label="上传者"></el-table-column>
				<el-table-column label="操作" width="90" align="center">
					<template slot-scope="scope">
						<button class="stateBtn" @click.stop="handleState(scope.row,scope.$index)" type="text" :state="scope.row.state?'true':'false'" :arrIndex="scope.row.arrIndex===null?null:scope.row.arrIndex">
							{{scope.row.state?'显示':'隐藏'}}
						</button>
						<!-- <el-button @click="" type="text" size="small">
						移除
						</el-button> -->
					</template>
				</el-table-column>
				
			</el-table>
			<el-pagination background layout="total,prev, pager, next" :total="allSearchRes.length" :page-size="pageSize" @current-change="handlePageChange">
			</el-pagination>
		</el-popover>
	</div>
</template>

<script type='text/ecmascript6'>
import {createMap,loadPaintTool} from 'util/mapUtil';
import {getMyEditLost,getLostPoint} from 'api/api.js';
import {getDate} from 'common/js/getDateFormat.js'
export default {
	data(){
		return{
			map:null,
			loading:false,
			//map实例
			map:null,
			paintManger:null,
			loadComplete:false,
			checked:false,
			checkedMyEdit:false,
			myEditMarkerArr:[],
			myEdit:false,
			overlays:[],
			layerMode:{
				editChecked:false,
				isEdit:false,
				
			},
			hasOverlay:false,
			hasData:false,

			//popover部分
			visual:false,
			allSearchRes:[],
			searchRes:[],
			pageSize:4,
			markerSet:[]
		}
	},
	mounted(){
		this.createMap();
		console.log(this.map);
		
	},
	methods:{
		createMap(){
			this.loading=true;
	  		var This=this;
			//this.$nextTick(function(){
				
	  		setTimeout(function(){
				This.map=createMap("container");
				This.loadComplete=true;
				console.log(This.map);
				let params=This.$route.params;
				if(params.state=='modify'){
					console.log(1);
					This.checked=true;
					This.myEdit=true;
					This.loadMyMarker();
					console.log(This.map);
					// this.map.clearOverlays();
					// this.loadMyEditMarker();
				}
					// if(!This.checked){
					// }else{
					// 	This.loadEditMarker(This.map);
					// }
		  		This.map.addEventListener('tilesloaded',function(){
		  				console.log(1);
						This.loading=false;
		  			})
		  	},600)
				//})
	  		
	  		
  		},
  		handleMyMarker(val){
  			if(val=='true'){
  				var This=this;
  				this.loadMyMarker();
  				this.myEdit=true;
	  			// this.map.setDefaultCursor("crosshair");
	  			// this.map.addEventListener('click',this.clickEvent);
  			}else{
  				this.map.clearOverlays();
  				this.myEditMarkerArr=[];
  				this.myEdit=false;
  			}
  		},
  		handleMyEditMarker(val){
  			if(val=='true'){
  				var This=this;
  				this.map.clearOverlays();
  				this.loadMyEditMarker();
	  			this.map.setDefaultCursor("crosshair");
	  			this.map.addEventListener('click',this.clickEvent);
  			}else{
  				this.map.clearOverlays();
  				this.loadMyMarker();
  				this.map.setDefaultCursor('url("../common/image/openhand.cur")');
	  			this.map.removeEventListener('click',this.clickEvent);
  			}
  		},
  		clickEvent(e){
	  		this.addBounceMarker(e.point);
	  	},
	  	addBounceMarker(pointSet){
			var point = new BMap.Point(pointSet.lng, pointSet.lat);
			var marker = new BMap.Marker(point);  // 创建标注
			//marker.id=2+Math.round(4*Math.random());
			this.map.addOverlay(marker);// 将标注添加到地图中
			var This=this;
			var removeMarker_edit = function(e,ee,marker){
				This.map.removeOverlay(marker);
			}
			var addMarker_edit = function(e,ee,marker){
				//console.log(ee);
				This.$router.push({
					name:'uploadLost',
					params:{
						point:e,
						mode:'upload'
					}
				})
			}
		//创建右键菜单
			var markerMenu=new BMap.ContextMenu();
			markerMenu.addItem(new BMap.MenuItem('删除',removeMarker_edit.bind(marker)));
			markerMenu.addItem(new BMap.MenuItem('添加至图层',addMarker_edit.bind(marker)));
			marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
			marker.addContextMenu(markerMenu);
	  	},
	  	loadMyMarker(){
	  		let myUser=JSON.parse(sessionStorage.getItem('user')).user;
	  		let map=this.map;
	  		console.log(map);
	  		getMyEditLost({
	  			user:myUser
	  		}).then(res=>{
	  			for(var i=0;i<res.length;i++){
	  				let point=new BMap.Point(res[i].lng,res[i].lat);
	  				let marker = new BMap.Marker(point);
	  				marker.info=res[i];
	  				let opts = {
						width : 200,     // 信息窗口宽度
						height: 100,     // 信息窗口高度
						title : '<p id="info_label">'+res[i].name+'</p>' , // 信息窗口标题
						enableMessage:true,//设置允许信息窗发送短息
						message:"亲耐滴，晚上一起吃个饭吧？戳下面的链接看下地址喔~"
					}
					var sContent =
	"<img style='float:right;margin:4px' id='imgDemo' src='"+res[i].imgUrl+"' width='100' height='80' title='"+res[i].name+"'/>" + 
	"<p style='margin:0;line-height:1.5;font-size:13px;text-indent:2em'>"+res[i].description+"</p>" + 
	"</div>";
					let infoWindow = new BMap.InfoWindow(sContent, opts);
					marker.addEventListener("click", function(){          
						map.openInfoWindow(infoWindow,point); //开启信息窗口
						document.getElementById('imgDemo').onload = function (){
							console.log(1);
		   				infoWindow.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
	   }
					});
					map.addOverlay(marker);
					this.myEditMarkerArr.push(marker);
	  			}
	  			
	  		})
	  	},
	  	loadMyEditMarker(){
	  		let map=this.map;
	  		var This=this;
	  		for(let i=0;i<this.myEditMarkerArr.length;i++){
					var removeMarker = function(e,ee,marker){
						//3个参数，前两个是百度api传入的
						//bind方法返回一个函数参数值为要传入的参数，第一个改变this指向
						//console.log(this.info.id);
						
						
					}
					var updateMarker = function(e,ee,marker){
						This.$router.push({
							name:'uploadLost',
							params:{
								info:this.info,
								mode:'modify'
							}
				})
					}
					var markerMenu=new BMap.ContextMenu();
					markerMenu.addItem(new BMap.MenuItem('删除',removeMarker.bind(this.myEditMarkerArr[i])));
					markerMenu.addItem(new BMap.MenuItem('修改信息',updateMarker.bind(this.myEditMarkerArr[i])));
					map.addOverlay(this.myEditMarkerArr[i]);
					this.myEditMarkerArr[i].addContextMenu(markerMenu);
	  			}
	  	},
	  	handleLayerEdit(state){
	  		if(state=='true'){
  				if(this.paintManger===null){
  					this.paintManger=new loadPaintTool(this.map,this);
  					//this.drawingTool=this.paintManger._drawingTool;
  				}else{
  					// this.map.addControl(this.drawingTool);
  					this.paintManger.load();
  				}
  				this.layerMode.isEdit=true;
  			}else{
  				// this.map.removeControl(this.drawingTool);
  				// this.paintManger.close();
  				// this.paintManger._opts.enableDrawingTool=false;
  				//console.log(this.paintManger);
  				this.paintManger.remove();
  				this.layerMode.isEdit=false;
  				//this.removeAllMarker();
  			}
	  	},
	  	getPointResult(arr){
	  		if(!this.hasData){
	  			this.allSearchRes=this.searchRes=[];
  				let pts=[];
	  			let pointSet=arr[0].uo;
	  			pointSet.forEach(item=>{
	  				pts.push(new BMap.Point(item.lng,item.lat));
	  			});
	  			let ply=new BMap.Polygon(pts);
	  			var This=this;
	  			this.searchRes=[];
	  			//这边写api函数
	  			getLostPoint().then(res=>{
	  				if(res.state=='ok'){
	  					// this.allSearchRes=res.data;
	  					this.hasData=true;
	  					console.log(res);
	  					res.data.forEach(item=>{
	  						let point=new BMap.Point(item.lng,item.lat);
	  						let result=BMapLib.GeoUtils.isPointInPolygon(point, ply);
	  						if(result){
	  							item.state=true;
	  							item.date=getDate(item.date);
	  							This.allSearchRes.push(item);
	  							//This.searchRes.push(item);
	  						}
	  					})
	  					this.searchRes=this.allSearchRes.slice(0,this.pageSize);
	  					this.visual=true;
	  				}
	  			})
  			}else{
  				this.visual=true;
  			}
	  	},
	  	handleShow(){
  			let e_X,e_Y,box_X,box_Y,del_X,del_Y;
  			let asideWidth,topHeight;
  			let mainWidth,popoverWidth,mainHeight,popoverHeight;
  			this.$nextTick(function() {
	    		let $tableBox=$('.tableShow .el-popper');
	    		$tableBox.on('mousedown',function(e){
  					mainWidth=$('.box').width();
  					mainHeight=$('.box').height();
  					//console.log(mainHeight);
  					popoverWidth=$tableBox.outerWidth();
  					popoverHeight=$tableBox.outerHeight();
  					box_X=$tableBox.position().left;
		    		box_Y=$tableBox.position().top-40;
		    		console.log(box_X+':'+box_Y);
		    		asideWidth=$tableBox.offset().left-box_X;
		    		topHeight=$tableBox.offset().top-$tableBox.position().top+40;
	  				e_X=e.clientX-asideWidth;
	  				e_Y=e.clientY-topHeight;
	  				del_X=e_X-box_X;
	  				del_Y=e_Y-box_Y;
	  				//console.log($tableBox.position().top);
	  				//console.log(del_X+":"+del_Y);
	  				$(document).on('mousemove',function(e){
	  					//console.log(1);
	  					e.preventDefault();
	  					e_X=e.clientX-asideWidth;
						e_Y=e.clientY-topHeight;
						var nowBox_X=e_X-del_X;
						var nowBox_Y=e_Y-del_Y;
						nowBox_X=Math.max(0,nowBox_X);
						nowBox_X=Math.min(mainWidth-popoverWidth,nowBox_X);
						nowBox_Y=Math.max(0,nowBox_Y);
						nowBox_Y=Math.min(mainHeight-popoverHeight-40,nowBox_Y);
						//console.log(nowBox_X+":"+nowBox_Y);
						$tableBox.css({
							left:nowBox_X+'px',
							top:nowBox_Y+40+'px'
						})
	  					
	  				})
	  				$(document).on('mouseup',function(){
	  					$(document).off('mousemove');
	  					$(document).off('mouseup');
	  				})
  				})
	    		//console.log(topHeight);
  			}
  			

  			)
  		},
  		handleHide(){
  			let $tableBox=$('.tableShow .el-popper');
  			$tableBox.off('mousedown');
  		},
  		handleState(row,index){
  			let lng=row.lng,lat=row.lat;
  			let domObj=event.target;
  			let state=domObj.getAttribute('state');
  			if(state=='true'){
  				let arrIndex=domObj.getAttribute('arrIndex');
  				if(arrIndex===null){
  					arrIndex=this.addMarker(row,domObj);
  					domObj.setAttribute('arrIndex',arrIndex);
  					row.arrIndex=arrIndex;
  				}else{
  					this.map.addOverlay(this.markerSet[arrIndex].marker);
  				}
  				domObj.setAttribute('state','false');
  				row.state=false;
  				//domObj.innerText='隐藏';
  			}else{
  				let arrIndex=domObj.getAttribute('arrIndex');
  				this.map.removeOverlay(this.markerSet[arrIndex].marker);
  				domObj.setAttribute('state','true');
  				row.state=true;
  				//domObj.innerText='显示';
  			}
  		},
  		addMarker(row,domObj){
  			var This=this;
  			var point = new BMap.Point(row.lng, row.lat);
  			var marker = new BMap.Marker(point);
  			//console.log(point);
  			this.markerSet.push({
  				marker:marker,
  				dom:domObj
  			});
  			let opts = {
						width : 200,     // 信息窗口宽度
						height: 100,     // 信息窗口高度
						title : '<p id="info_label">'+row.name+'</p>' , // 信息窗口标题
						enableMessage:true,//设置允许信息窗发送短息
						message:"亲耐滴，晚上一起吃个饭吧？戳下面的链接看下地址喔~"
					}
					var sContent =
	"<img style='float:right;margin:4px' id='imgDemo' src='"+row.imgUrl+"' width='100' height='80' title='"+row.name+"'/>" + 
	"<p style='margin:0;line-height:1.5;font-size:13px;text-indent:2em'>"+row.description+"</p>" + 
	"</div>";
					let infoWindow = new BMap.InfoWindow(sContent, opts);
					marker.addEventListener("click", function(){          
						this.openInfoWindow(infoWindow,point); //开启信息窗口
						document.getElementById('imgDemo').onload = function (){
		   				infoWindow.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
	   }
					});
  			this.map.addOverlay(marker);
  			return this.markerSet.length-1;
  		},
  		handlePageChange(val){
  			this.searchRes=this.allSearchRes.slice((val-1)*this.pageSize,val*this.pageSize);
  		},
  		removeOverlay(){
  			if(this.paintManger.overlays.length>0){
  				this.paintManger.clear();
  				console.log(this.hasData);
  				this.removeAllMarker();
  			}else{
  				this.$message({
					showClose: true,
					message: '还没绘制过图案哦',
					type: 'error'
				});
  			}
  		},
  		removeAllMarker(){
  			var This=this;
  			this.markerSet.forEach(function(item,index){
  				This.map.removeOverlay(item.marker);
  			})
  			this.markerSet=[];
  			this.visual=false;
  		},
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='stylus' rel='stylesheet/stylus'>
.box
	position:relative
.gap
	height:40px
.tool-col
	height:100%
	.toolBtn
		float:left
		margin-left:10px
.tableShow
	
	.el-popper
		top:10px
.stateBtn
	background:transparent
	color:#409EFF
	border-color:transparent
	cursor:pointer
	outline:none
</style>

<style lang='stylus' rel='stylesheet/stylus'>
.tableShow
	.el-dialog__close
		cursor:pointer
		float:right
		&:hover
			color:#409EFF
	.el-popper
		left:620px
		top:80px
</style>