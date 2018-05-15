<template>
	<div class="container">
		<div class='form-box'>
			<h3>确认查询信息</h3>
			<el-form :model="form" label-width="100px" class='form' label-position="right" :rules="rules" ref="form">
				<el-form-item label="学年学期">
					<el-input v-model="form.semester"  :disabled="true">
					</el-input>
				</el-form-item>
				<!-- <el-form-item label="学年学期">
					<el-input v-model="form.semester"  :disabled="true"></el-input>
				</el-form-item> -->
				<el-row :gutter="4" class='eliminate'>
					<el-col :span="12">
						<el-form-item label="校区">
							<el-input v-model="form.campus"  :disabled="true">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="教学楼">
							<el-select v-model="form.place" placeholder="请选择" class="xqOption" size="small">
								<el-option v-for="item in form.buildingOptions" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="3">
					<el-col :span="12">
						<el-form-item label="周次">
							<el-input-number size="small" v-model="form.zc" label="周次" :min="1" :max="24"></el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="节次">
							<el-input-number size="small" v-model="form.jc" :min="1" :max="11"></el-input-number>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="5">
					<el-col :span="10">
						<el-form-item label="星期" prop="xq">
							<el-select v-model="form.xq" placeholder="请选择" class="xqOption" @change="handleXq" size="small">
								<el-option v-for="item in form.xqOptions" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="14">
						<el-form-item class="btn">
							<el-button type="info" @click="onSearch('form')" :disabled="btnDisabled">查询</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<div class="showData" v-show="hasSearch">
				<el-table :data="searchData" stripe border class="showTable" v-loading="loading">
					<el-table-column prop="index" label="序号" width="60" align="center">
					</el-table-column>
					<el-table-column prop="region" label="校区" width="110" align="center">
					</el-table-column>
					<el-table-column prop="building" label="教学楼" width="120" align="center">
					</el-table-column>
					<el-table-column prop="classroom" label="教室" width="120" align="center">
					</el-table-column>
					<el-table-column prop="type" label="类型" width="120" align="center">
					</el-table-column>
					<el-table-column prop="seatNum" label="座位数" width="100" align="center">
					</el-table-column>
				</el-table>
				<el-pagination @current-change="handleCurrentChange" :page-size="3" layout="total, prev, pager, next" :total="dataTotal" :current-page.sync="currentPage" class="pageInation">
				</el-pagination>
		</div>
	</div>
</template>

<script type='text/ecmascript6'>
import {xqOptions,buildingOptions} from '@/assets/xqOptions';
import {getClassRoom} from 'api/api';
export default {
	data(){
		var validateXq = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('不能为空'));
			} 
          	callback();
		};
		return{
			form:{
				semester:'2017-2018学年第二学期',
				campus:'南昌校区',
				place:5,
				zc:1,
				jc:1,
				xq:'',
				xqOptions:xqOptions,
				buildingOptions:buildingOptions
			},
			rules:{
				xq: [
					{ validator:validateXq,trigger: 'change' }
				],
			},
			hasSearch:false,
			loading:false,
			searchData: [],
			dataTotal:0,
			currentPage:1,
			btnDisabled:false
		}
	},
	methods:{
		handle(index){
			console.log(index);
		},
		handleXq(val){
			console.log(this.form.xq);
		},
		handleCurrentChange(val){
			this.loading=true;
			var This=this;
			getClassRoom({
				place:this.form.place,
				zc:this.form.zc,
				xq:this.form.xq,
				jc:this.form.jc,
				pageIndex:val
			}).then(res=>{
				if(res.status=='ok'){
					this.loading=false;
					//console.log(res.resArr);
					res.resArr.forEach(function(item){
						item.index=(val-1)*3+item.index*1;
					})
					this.searchData=res.resArr;
				}else{
					console.log(1);
					this.btnDisabled=true;
					this.$message({
						message:res.msg,
						type:'error',
						duration:800,
						onClose:function(){
							This.btnDisabled=false;
						}
					});
				}
			})	
		},
		onSearch(formName){
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.hasSearch=true;
					this.loading=true;
					getClassRoom({
						place:this.form.place,
						zc:this.form.zc,
						xq:this.form.xq,
						jc:this.form.jc,
						pageIndex:1
					}).then(res=>{
						if(res.status=='ok'){
							this.loading=false;
							this.searchData=res.resArr;
							this.dataTotal=res.total;
							this.currentPage=1
						}else{
							var This=this;
							this.btnDisabled=true;
							this.$message({
								message:res.msg,
								type:'error',
								duration:800,
								onClose:function(){
									This.loading=false;
									This.btnDisabled=false;
								}
							});
						}
					})
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='stylus' rel='stylesheet/stylus'>
.container
	height:100%
	padding-top:10px
	box-sizing:border-box
	.form-box
		h3
			line-height:44px
		//position:absolute
		width:550px
		//left:50%
		//transform:translateX(-275px)
		margin:0px auto;
		box-shadow: 0 0 25px #cac6c6;
		box-sizing:border-box
		padding:10px 10px 0px 0px
		.eliminate
			.el-col
				line-height:44px
		.xqOption
			text-align:left
			width:140px
	.showData
		width:650px
		margin:20px auto 0px
		.pageInation
			line-height:30px
</style>

<style lang='stylus' rel='stylesheet/stylus'>
.showTable
	margin-bottom:5px
	thead
		tr
			line-height:32px
.btn
	.el-form-item__content
		text-align:left
.showData
	.el-loading-mask
			line-height:100px
</style>