<template>
	<div class="box">
		<div class='toolTip'>
				<el-col :span="6" class='tool-col'>
					<el-button type="info" round class="toolBtn" @click="showCondition('haha')">设置条件</el-button>
				</el-col>
				<el-col :span="10" class='tool-col'>
					<p class="info-box" v-show="hasCondition">性别:{{form.sex?form.sex:'不限'}}&nbsp;&nbsp;&nbsp;学院:{{form.optionVal?form.optionVal:'不限'}}&nbsp;&nbsp;&nbsp;家乡:{{hometown}}</p>
				</el-col>
				<el-col :span="8" class='tool-col'>
					<el-checkbox v-model="checked" border class='editCheck' label="编辑" true-label="true" false-label="false" @change="changeHandle" v-if="hasCondition"></el-checkbox>
					<el-button type="success" round class="toolBtn" @click="removeOverlay" v-if="isEdit">清除覆盖物</el-button>
					<el-button type="primary" round class="toolBtn" @click="getPointResult(paintManger.overlays)" v-if="hasOverlay">检索</el-button>
					<!-- <el-button type="primary" round class="toolBtn" @click="visual=true">显示</el-button> -->
				</el-col>
		</div>
		<div id="container" v-loading="loading"></div>
		<el-dialog title="设置条件" :visible.sync="infoVisual" width="500px">
			<el-form :model="form" label-position="right" label-width="80px">
				<el-form-item label="性别">
					<el-radio-group v-model="form.sex">
						<el-radio label="男"></el-radio>
						<el-radio label="女"></el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="学院" prop="optionVal">
					<el-select v-model="form.optionVal" clearable placeholder="请选择">
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
				</el-form-item>
				<el-form-item label="家乡" prop="region">
					<el-cascader :options="regionOptions" v-model="form.region" clearable>
	 				</el-cascader>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<!-- <el-button @click="dialogFormVisible = false">取 消</el-button> -->
				<el-button type="primary" @click="handleSure">确 定</el-button>
			</div>
		</el-dialog>
		<el-popover :value="visual" @show="handleShow" class="tableShow" @hide="handleHide" width="450">
			<i class="el-dialog__close el-icon el-icon-close" @click="visual=false"></i>
			<el-table :data="searchRes" stripe>
				<el-table-column width="60" property="name" label="姓名"></el-table-column>
				<el-table-column width="60" property="sex" label="性别"></el-table-column>
				<el-table-column width="80" property="province" label="省份"></el-table-column>
				<el-table-column width="60" property="city" label="城市"></el-table-column>
				<el-table-column width="120" property="academy" label="学院" align="center"></el-table-column>
				<el-table-column label="操作" width="80" align="center">
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
import {createMap,loadMarker,loadPaintTool} from 'util/mapUtil';
import {haha} from 'util/tool';
import options from '@/assets/options';
import regionOptions from '@/assets/regionOptions';
import {getAll} from 'api/api';
export default {
	created(){
  	//console.log(this.$route);
  		this.options=options;
		this.regionOptions=regionOptions;
  		this.createMap();
	},
	mounted(){
		
		this.$nextTick(function () {
	    	//this.draggable();
  		})
	},
	computed:{
		hometown(){
			if(this.form.region.length>0){
				return this.form.region[0]+this.form.region[1];
			}else{
				return '不限';
			}
			
		}
	},
	data(){
		return {
			loading:false,
			haveData:false,
			infoVisual:false,
			form: {
				// name: '',
				region: [],
				sex:'',
				optionVal: '',
			},
			options:[],
			regionOptions:[],
			hasCondition:false,
			isEdit:false,
			checked:false,
			paintManger:null,
			hasOverlay:false,
			hasData:false,
			allSearchRes:[],
			searchRes:[],
			visual:false,
			markerSet:[],
			pageSize:4
		}
	},
	methods:{
  		createMap(){
	  		this.loading=true;
	  		var This=this;
	  		setTimeout(function(){
				This.map=createMap("container");
					// if(!This.checked){
					// }else{
					// 	This.loadEditMarker(This.map);
					// }
		  		This.map.addEventListener('tilesloaded',function(){
						This.loading=false;
		  			})
	  		},600)
  		},
  		showCondition(str){
  			this.infoVisual=true;
  		},
  		handleSure(){
  			this.infoVisual=false;
  			if(this.form.region.length==0&&this.form.sex==''&&this.form.optionVal==''){

  			}else{
  				this.hasCondition=true;
  			}
  			
  		},
  		changeHandle(state){
  			if(state=='true'){
  				if(this.paintManger===null){
  					this.paintManger=new loadPaintTool(this.map,this);
  					//this.drawingTool=this.paintManger._drawingTool;
  				}else{
  					// this.map.addControl(this.drawingTool);
  					this.paintManger.load();
  				}
  				this.isEdit=true;
  			}else{
  				// this.map.removeControl(this.drawingTool);
  				// this.paintManger.close();
  				// this.paintManger._opts.enableDrawingTool=false;
  				//console.log(this.paintManger);
  				this.paintManger.remove();
  				this.isEdit=false;
  				this.removeAllMarker();
  			}
  			
  		},
  		removeOverlay(){
  			if(this.paintManger.overlays.length>0){
  				this.paintManger.clear();
  				this.removeAllMarker();
  			}else{
  				this.$message({
					showClose: true,
					message: '还没绘制过图案哦',
					type: 'error'
				});
  			}
  			
  		},
  		getPointResult(arr){
  			if(!this.hasData){
  				let pts=[];
	  			let pointSet=arr[0].uo;
	  			pointSet.forEach(item=>{
	  				pts.push(new BMap.Point(item.lng,item.lat));
	  			});
	  			let ply=new BMap.Polygon(pts);
	  			var This=this;
	  			this.searchRes=this.allSearchRes=[];
	  			getAll({
	  				province:this.form.region[0],
	  				city:this.form.region[1],
	  				academy:this.form.optionVal,
	  				sex:this.form.sex
	  			}).then(res=>{
	  				if(res.state){
	  					// this.allSearchRes=res.data;
	  					this.hasData=true;
	  					res.data.forEach(item=>{
	  						let point=new BMap.Point(item.lng,item.lat);
	  						let result=BMapLib.GeoUtils.isPointInPolygon(point, ply);
	  						if(result){
	  							item.state=true;
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
  			console.log(row);
  			let lng=row.lng,lat=row.lat;
  			let domObj=event.target;
  			let state=domObj.getAttribute('state');
  			if(state=='true'){
  				let arrIndex=domObj.getAttribute('arrIndex');
  				if(arrIndex===null){
  					arrIndex=this.addMarker(row.lng,row.lat,domObj);
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
  		addMarker(lng,lat,domObj){
  			var point = new BMap.Point(lng, lat);
  			var marker = new BMap.Marker(point);
  			//console.log(point);
  			this.markerSet.push({
  				marker:marker,
  				dom:domObj
  			});
  			this.map.addOverlay(marker);
  			return this.markerSet.length-1;
  		},
  		removeAllMarker(){
  			var This=this;
  			this.markerSet.forEach(function(item,index){
  				This.map.removeOverlay(item.marker);
  			})
  			this.markerSet=[];
  			this.visual=false;
  		},
  		handlePageChange(val){
  			this.searchRes=this.allSearchRes.slice((val-1)*this.pageSize,val*this.pageSize);
  		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='stylus' rel='stylesheet/stylus'>
.box
	position:relative
.tool-col
	height:100%
	.toolBtn
		float:left
		margin-left:10px
.info-box
	line-height:40px
	text-align:left
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
.el-form-item__content
	text-align:left
	margin-left:105px !important
.tableShow
	.el-dialog__close
		cursor:pointer
		float:right
		&:hover
			color:#409EFF
	.el-popper
		left:620px
		top:80px
		// padding-top:30px
		// box-sizing:border-box
// .tool-col
// 	height:100%
// 	.toolBtn
// 		float:left
</style>