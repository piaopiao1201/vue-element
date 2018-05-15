<template>
	<div class="box">
		<div class='toolTip'>
			<el-checkbox v-model="checked" border class='editCheck' label="编辑" true-label="true" false-label="false" @change="changeHandle"></el-checkbox>
		</div>
		<div class="table-content">
			<div id="container" v-loading="loading"></div>
			<div class="chat">
				<chat :userName="userName" :avatar="avatar"></chat>
			</div>
		</div>
		<el-dialog :title="dialogTitle" :visible.sync="editFormVisible" width="45%" class="editDialog">
			<el-form :model="editForm">
				<el-form-item label="地点" :label-width="formLabelWidth">
					<el-col :span="11">
						纬度:{{editForm.lng}}&nbsp;&nbsp;-&nbsp;&nbsp;经度:{{editForm.lat}}
					</el-col>
					<el-col :span="13">
					</el-col>
					<!-- <el-col class="line" :span="2">-</el-col>
					<el-col :span="11">
						经度:{{editForm.lat}}
					</el-col> -->
				</el-form-item>
				<el-form-item label="标签" :label-width="formLabelWidth">
					<el-input v-model="editForm.label" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="描述" :label-width="formLabelWidth">
					<el-input v-model="editForm.description" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="editFormSubmit" :loading="loading">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script type='text/ecmascript6'>
import {createMap,loadMarker} from 'util/mapUtil';
import axios from 'axios';
import jsonp from 'common/js/jsonp';
import {addMarker,updateMarker,deleteMarker} from 'api/api';
import chat from './chat';
export default {
	data(){
		return{
			loading:false,
			markerArr:[],
			checked:false,
			trueLabel:'可编辑',
			falseLabel:'编辑',
			map:null,
			editFormVisible:false,
			editState:'',
			dialogTitle:'',
			editForm:{
				label:'',
				description:'',
				lng:0,
				lat:0,
				trueLng:0,
				trueLat:0
			},
			formLabelWidth: '80px',
			loading:false,
			updateId:0,
			updateArrIndex:0
		}
	},
	created(){
		this.user=JSON.parse(sessionStorage.getItem('user'));
	},
	computed:{
		userName:function(){
			return this.user.name;
		},
		avatar:function(){
			return this.user.avatar;
		}
	},
  	mounted(){
	  	this.createMap();
	},
	methods:{
  		createMap(){
  			this.loading=true;
  			var This=this;
  			setTimeout(function(){
				This.map=createMap("container");
				// if(!This.checked){
				This.loadMarker(This.map);
				// }else{
				// 	This.loadEditMarker(This.map);
				// }
	  			This.map.addEventListener('tilesloaded',function(){
					This.loading=false;
	  			})
  			},600)
  		},
  		loadMarker(map){
  			jsonp('http://www.mylaravel.com:8888/api/getmarkerList',{
			},{
				param: 'callback'
			}).then(res=>{
				let arr=res;
				this.markerArr=res;
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
					//this.loading=false;
				}
			})
	  	},
	  	loadEditMarker(map){
	  		var arr=this.markerArr;
	  		let length=arr.length;
	  		var This=this;
				for(let i=0;i<length;i++){
					let point=new BMap.Point(arr[i].lng,arr[i].lat);
					let marker = new BMap.Marker(point,{title:arr[i].label});
					marker.info=arr[i];
					marker.arrIndex=i;
					var removeMarker = function(e,ee,marker){
						//3个参数，前两个是百度api传入的
						//bind方法返回一个函数参数值为要传入的参数，第一个改变this指向
						//console.log(this.info.id);
						deleteMarker(this.info.id).then(res=>{
							if(res.state){
								//console.log(this.arrIndex);
								This.markerArr.splice(this.arrIndex,1);
								map.removeOverlay(this);
								This.$message({
									message: '已从图层中删除',
									type: 'success',
									duration:1000
								});
							}
						})
						
					}
					var updateMarker = function(e,ee,marker){
						This.editState='update';
						This.editFormVisible=true;
						This.dialogTitle='更新信息';
						This.editForm.lng=this.info.lng.toFixed(3);
						This.editForm.lat=this.info.lat.toFixed(3);
						This.editForm.label=this.info.label;
						This.editForm.description=this.info.description;
						This.updateId=this.info.id;
						This.updateArrIndex=this.arrIndex;
					}
					//创建右键菜单
					var markerMenu=new BMap.ContextMenu();
					markerMenu.addItem(new BMap.MenuItem('删除',removeMarker.bind(marker)));
					markerMenu.addItem(new BMap.MenuItem('修改信息',updateMarker.bind(marker)));
					map.addOverlay(marker);
					marker.addContextMenu(markerMenu);
					//this.loading=false;
				}
	  	},
	  	changeHandle(val){
	  		if(val=='true'){
	  			this.map.clearOverlays();
	  			this.loadEditMarker(this.map);
	  			var This=this;
	  			this.map.setDefaultCursor("crosshair");
	  			this.map.addEventListener('click',this.clickEvent);
	  			//console.log(this.markerArr);
	  		}else{
	  			this.map.clearOverlays();
	  			this.loadMarker(this.map);
	  			this.map.setDefaultCursor('url("../common/image/openhand.cur")');
	  			this.map.removeEventListener('click',this.clickEvent);
	  		}
	  	},
	  	clickEvent(e){
	  		this.addBounceMarker(e.point);
	  	},
	  	addBounceMarker(pointSet){
	  		console.log(pointSet);
			var point = new BMap.Point(pointSet.lng, pointSet.lat);
			var marker = new BMap.Marker(point);  // 创建标注
			//marker.id=2+Math.round(4*Math.random());
			this.map.addOverlay(marker);// 将标注添加到地图中
			var This=this;
			var removeMarker_edit = function(e,ee,marker){
				This.map.removeOverlay(marker);
			}
			var addMarker_edit = function(e,ee,marker){
				This.editState='add';
				This.editFormVisible=true;
				This.dialogTitle='编辑信息';
				This.editForm.lng=e.lng.toFixed(3);
				This.editForm.lat=e.lat.toFixed(3);
				This.editForm.trueLng=e.lng;
				This.editForm.trueLat=e.lat;
				This.editForm.label='';
				This.editForm.description='';
			}
		//创建右键菜单
			var markerMenu=new BMap.ContextMenu();
			markerMenu.addItem(new BMap.MenuItem('删除',removeMarker_edit.bind(marker)));
			markerMenu.addItem(new BMap.MenuItem('添加至图层',addMarker_edit.bind(marker)));
			marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
			marker.addContextMenu(markerMenu);
	  	},
	  	editFormSubmit(){
	  		this.loading=true;
	  		var This=this;
	  		if(this.editState=='add'){
	  			setTimeout(function(){
		  			addMarker(This.editForm).then(res=>{
			  			if(res.state){
			  				This.loading=false;
			  				This.editFormVisible=false;
			  				This.$message({
								message: '已添加至图层',
								type: 'success',
								duration:1000
							});
			  				This.markerArr.push(res.data);
			  				This.map.clearOverlays();
			  				This.loadEditMarker(This.map);
			  			}
		  			})
		  		},500)
	  		}else if(this.editState=='update'){
	  			setTimeout(function(){
		  			addMarker(This.editForm,This.updateId).then(res=>{
			  			if(res.state){
			  				This.loading=false;
			  				This.editFormVisible=false;
							This.$message({
								message: '信息修改成功',
								type: 'success',
								duration:1000
							});
			  				This.markerArr[This.updateArrIndex].label=This.editForm.label;
			  				This.markerArr[This.updateArrIndex].description=This.editForm.description;
			  				This.map.clearOverlays();
			  				This.loadEditMarker(This.map);
			  			}
		  			})
		  		},500)
	  		}
	  		
	  		
	  		// this.editFormVisible=false;
	  	}
  	},
	components:{
		chat:chat
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='stylus' rel='stylesheet/stylus'>
.table-content
	//height:562px
	height:562px
	display:flex
	#container
		height:100%
		//width:600px
		flex:3
	.chat
		flex:2
// #container
// 	width:600px
// 	height:562px
.box
	height:100%
	
.toolTip
	height:40px
	background:#fff
	.editCheck
		float:left
		margin-left:20px


</style>

<style lang='stylus' rel='stylesheet/stylus'>
#container
	height:562px
.box
	height:100%
	
.toolTip
	height:40px
	background:#fff
	.editCheck
		float:left
		margin-left:20px
.el-dialog
	padding:10px 10px
	.el-dialog__header
		line-height:24px
	.el-dialog__footer
		line-height:40px
</style>