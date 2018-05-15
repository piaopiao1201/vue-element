<template>
	<div class='infoContainer'>
		<h3 class='info-title'>{{mode=="upload"?title1:title2}}</h3>
		<el-form label-position="right" label-width="80px" :model="infoForm" ref='infoForm'>
			<el-form-item label="姓名" prop="name">
				<el-input v-model="infoForm.name"></el-input>
			</el-form-item>
			<el-form-item label="性别">
				<el-radio-group v-model="infoForm.sex" @change="handleChange3">
					<el-radio label="男"></el-radio>
					<el-radio label="女"></el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="所在学院" prop="optionVal">
				<el-select v-model="infoForm.optionVal" clearable placeholder="请选择" @change="handleChange2">
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="家乡" prop="region">
				<el-cascader :options="regionOptions" v-model="infoForm.region" @change="handleChange" clearable>
 				</el-cascader>
			</el-form-item>
			<el-form-item label="地点" prop="pos">
				<el-input v-model="infoForm.pos" disabled></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitForm('infoForm')" :loading="loading">{{mode=='upload'?btnInfo1:btnInfo2}}</el-button>
				<el-button type="info" @click="deleteInfoHandle()" :loading="loading" v-if="mode=='modified'">删除</el-button>
			</el-form-item>
		</el-form>
		<!-- <router-view></router-view> -->
	</div>
</template>

<script type='text/ecmascript6'>
import options from '@/assets/options';
import regionOptions from '@/assets/regionOptions';
import {getUserInfo,getPos,updateInfo,deleteInfo,createInfo} from 'api/api';
import {getDate} from 'common/js/getDateFormat';
export default {
	created(){
		this.options=options;
		this.regionOptions=regionOptions;
		this.checkInfo();
		//console.log(getDate(1524207441*1000));
	},
	data(){
		return {
			pos:{
				lng:0,
				lat:0
			},
			mode:'upload',
			title1:'您还没上传信息哦,快创建一个吧',
			title2:'您可以修改信息',
			btnInfo1:'立即创建',
			btnInfo2:'修改',
			infoForm:{
				name:'',
				optionVal:'',
				region:[],
				pos:'',
				sex:''
			},
			nowPosInfo:'',
			pos:{
				lng:0,
				lat:0
			},
			options:[],
			regionOptions:[],
			loading:false
		}
	},
	methods:{
		checkInfo(){
			let adminUser=JSON.parse(sessionStorage.getItem('user'));
			
			//console.log(adminUser);
			getUserInfo(adminUser).then(res=>{
				//let update_time=res.data.updated_at;

				if(!res.state){
					this.mode='upload';
					this.infoForm.name='';
					this.infoForm.optionVal='';
					this.infoForm.region=[],
					this.infoForm.sex="男";
				}else{
					this.mode='modified';
					this.infoForm.name=res.data.name;
					this.infoForm.optionVal=res.data.academy;
					this.infoForm.region=[res.data.province,res.data.city];
					this.infoForm.sex=res.data.sex;
				}
			})
			getPos().then(res=>{
				this.infoForm.pos=res.rgc.result.sematic_description;
				this.pos.lng=res.rgc.result.pois[0].point.x.toFixed(6);
				this.pos.lat=res.rgc.result.pois[0].point.y.toFixed(6);
			})
		},
		submitForm(formName){
			this.$confirm('确认操作么?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				let adminUser=JSON.parse(sessionStorage.getItem('user'));
				this.loading=true;
				if(this.mode=="modified"){
					updateInfo({
						user:adminUser.user,
						province:this.infoForm.region[0],
						city:this.infoForm.region[1],
						academy:this.infoForm.optionVal,
						lng:this.pos.lng,
						lat:this.pos.lat,
						sex:this.infoForm.sex
					}).then(res=>{
						if(res.state){
							this.$message({
			                    message:res.msg,
			                    type:'success',
			                    duration:600
							});
							this.loading=false;
							this.checkInfo();
						}
					})
				}else{
					createInfo({
						user:adminUser.user,
						name:adminUser.name,
						province:this.infoForm.region[0],
						city:this.infoForm.region[1],
						academy:this.infoForm.optionVal,
						lng:this.pos.lng,
						lat:this.pos.lat,
						sex:this.infoForm.sex
					}).then(res=>{
						if(res.state){
							this.$message({
			                    message:res.msg,
			                    type:'success',
			                    duration:600
							});
							this.loading=false;
							this.checkInfo();
						}
					})
				}
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消动作',
					duration:600
				});          
			});
		},
		resetForm(formName){
			
			this.$refs[formName].resetFields();
		},
		handleChange(val){
			console.log(this.infoForm.region);
		},
		handleChange2(val){
			console.log(this.infoForm.optionVal);
		},
		handleChange3(val){
			
		},
		deleteInfoHandle(){
			this.$confirm('确认操作么?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				let adminUser=JSON.parse(sessionStorage.getItem('user'));
				this.loading=true;
				deleteInfo(adminUser.user).then(res=>{
					if(res.state){
						this.loading=false;
						this.$message({
			                    message:res.msg,
			                    type:'success',
			                    duration:600
							});
						this.checkInfo();
					}
				})
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消动作',
					duration:600
				});          
			});
		}
	},
	beforeRouteUpdate (to, from, next) {
    	console.log(to);
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='stylus' rel='stylesheet/stylus'>
.infoContainer
	width:470px;
	box-sizing:border-box;
	padding:30px 20px;
	margin:70px auto;
	box-shadow: 0 0 25px #cac6c6;
	.info-title
		line-height:45px
		margin-bottom:15px
</style>

<style lang='stylus' rel='stylesheet/stylus'>
.el-form-item__content
	text-align:left;
</style>