<template>
	<div class='infoContainer'>
		<h3 class='info-title'>{{mode=="upload"?title1:title2}}</h3>
		<el-form label-position="right" label-width="80px" :model="infoForm" ref='infoForm' :rules="rules" id="lostForm">
			<el-form-item label="失物" prop="name">
				<el-input v-model="infoForm.name" name="name"></el-input>
			</el-form-item>
			<el-form-item label="地点">
				<el-col :span="18">
						纬度:{{infoForm.lng}}&nbsp;&nbsp;-&nbsp;&nbsp;经度:{{infoForm.lat}}
				</el-col>
				<el-col :span="6">
				</el-col>
			</el-form-item>
			<el-form-item label="时间" prop="date">
				<el-date-picker v-model="infoForm.date" type="datetime" placeholder="选择日期时间" value-format="timestamp" @change="dateChange" name="date">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="描述" prop="description">
				<el-input v-model="infoForm.description" name="description"></el-input>
			</el-form-item>
			<el-form-item label="图片" prop="image" ref='imageInfo'>
				<img :src="imgUrl" v-if="mode!='upload'" width="60px" height="60px">
				<el-upload class="upload-demo" ref="upload" action="" :on-change="handleFileChange" :file-list="infoForm.fileList" :auto-upload="false" :limit="1" :on-exceed="handleExceed" :on-remove="handleFileRemove" name="image">
					<el-button slot="trigger" size="small" type="primary">{{mode=="upload"?'选取文件':'修改文件'}}</el-button>
					<!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="">上传到服务器</el-button> -->
					<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
				</el-upload>
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
import {getDate} from 'common/js/getDateFormat.js'
import {submitLost,updateLostInfo} from 'api/api.js'
export default {
	created(){
		let param=this.$route.params;

		this.mode=param.mode;
		console.log(this.mode);
		if(this.mode=="upload"){
			this.infoForm.lng=param.point.lng;
			this.infoForm.lat=param.point.lat;
		}else{
			this.infoForm.name=param.info.name;
			this.infoForm.description=param.info.description;
			this.infoForm.lng=param.info.lng;
			this.infoForm.lat=param.info.lat;
			this.infoForm.date=param.info.date*1000;
			this.infoForm.imgUrl=param.info.imgUrl;
		}
	},
	computed:{
		imgUrl:function(){
			return this.infoForm.imgUrl;
		}
	},
	mounted(){
		// var oField=this.$refs.imageInfo.$el;
		// 	var $error=$(oField).find('.el-form-item__error');
		// 	console.log($error.length);
	},
	data(){
		var This=this;
		var validateName=function(rule,val,callback){
			if(val==''){
				return callback(new Error('不得为空'));
			}
			callback();
		}
		var validateDescription=function(rule,val,callback){
			if(val==''){
				return callback(new Error('不得为空'));
			}
			callback();
		}
		var validateDate=function(rule,val,callback){
			if(val==null){

				return callback(new Error('请选择时间'));
			}
			callback();
		}
		var validateImage=function(rule,val,callback){
			//console.log('validateImage启动');
			if(This.mode!='upload'){
				//console.log(this.mode);
				callback();
			}
			if(This.infoForm.fileList.length==0){
				var error=new Error('请选择图片上传');
				return callback(error);
			}
			callback();
		}
		return{
			mode:'upload',
			title1:'上传失物信息',
			title2:'修改失物信息',
			btnInfo1:'上传',
			btnInfo2:'修改',
			rules:{
				name:[
				{ validator: validateName, trigger: 'blur'}
				],
				description:[
					{
						validator: validateDescription, 
						trigger: 'blur'
					}
				],
				date:[
					{
						validator: validateDate, 
						trigger: 'blur'
					}
				],
				image:[
					{
						validator: validateImage, 
						trigger: 'change'
					}
				]
			},
			infoForm:{
				name:'',
				lng:0,
				lat:0,
				description:'',
				pickOptions:{
					format:'HH:mm:ss'
				},
				date:null,
				fileList:[],
				imgUrl:''
			},
			loading:false
		}
	},
	methods:{
		dateChange(val){
			console.log(getDate(this.infoForm.date/1000));
		},
		handleFileChange(file, fileList){
			console.log($('input[name=image]')[0].files);
			this.infoForm.fileList=fileList.slice(-1);
			//console.log(this.infoForm.fileList);
			let fileRaw=file.raw;
			if(fileRaw.type!='image/jpeg'){
				this.$message({
                    message:'只能上传jpg格式',
                    type:'error',
                    duration:800
                  });
				this.infoForm.fileList.pop();
				return;
			}
			var oField=this.$refs.imageInfo.$el;
			var $error=$(oField).find('.el-form-item__error');
			if($error.length>0){
				$error.empty();
			}
			//console.log(fileList);
		},
		handleFileRemove(file, fileList){
			this.infoForm.fileList=fileList.slice(-1);
			var oField=this.$refs.imageInfo.$el;
			var $error=$(oField).find('.el-form-item__error');
			console.log($error);
			$error.text('请选择图片上传');
			//console.log(this.infoForm.fileList);
		},
		handleExceed(files, fileList){
			this.$message({
                message:'最多只能选一张',
               	type:'error',
                duration:800
            });
		},
		submitForm(formName){
			
			let This=this;
			let userName=JSON.parse(sessionStorage.getItem('user')).user;
			this.$refs[formName].validate((valid) => {
				if(valid){
					this.loading=true;
					var oLostForm=document.getElementById('lostForm');
					var formData=new FormData(oLostForm);
					formData.append('lng',this.infoForm.lng);
					formData.append('lat',this.infoForm.lat);
					
					formData.set('date',This.infoForm.date/1000);
					
					if(This.mode=='upload'){
						formData.append('userName',userName);
						console.log(document.getElementsByName('image')[0].files);
						submitLost(formData).then(res=>{
							if(res.state=='ok'){
								This.$message({
									message:res.msg,
									type:'success',
									duration:800,
									onClose:function(){
										This.loading=false;
										This.$router.push({
											name:'findLost',
											params:{
												state:'modify'
											}
										})
									}
								});
							}
						});
					}else{
						//要加id以唯一标识
						//两种模式视图应该不同
						this.loading=false;
						formData.append('id',this.$route.params.info.id);
						console.log(formData.get('image'));
						console.log(document.getElementsByName('image')[0].files)
						updateLostInfo(formData).then(res=>{
							if(res.state=='ok'){
								This.$message({
									message:res.msg,
									type:'success',
									duration:800,
								});
								this.infoForm.imgUrl=res.data.imgUrl;
								this.infoForm.fileList=[];
								var file=document.getElementsByName('image')[0];
								//重新初始化了file的html
								this.$router.push({
									name:'findLost',
									params:{
										state:'modify'
									}
								})

							}else{
								This.$message({
									message:res.msg,
									type:'warning',
									duration:800,
								});
							}
						})
					}
					
				}else {
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
.infoContainer
	width:470px;
	box-sizing:border-box;
	padding:20px 20px;
	margin:30px auto;
	box-shadow: 0 0 25px #cac6c6;
	.info-title
		line-height:45px
		margin-bottom:15px
</style>

<style lang='stylus' rel='stylesheet/stylus'>

</style>
     