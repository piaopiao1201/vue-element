<template>
	<el-container>
		<el-header>
			<el-row>
				<!--这里logo-width加引号是因为有-，如单个单词可不加引号-->
				<el-col :span="6" class='logo' :class="{'logo-width':!isCollapse,'logo-collapse-width': isCollapse }">
					{{isCollapse?'':projectName}}
				</el-col>
				<el-col :span="14" class='collapseBtn'>
					<div class='collapseToolBox' @click.prevent="handleCollapse">
						<i class='fa fa-align-justify'></i>
					</div>
				</el-col>
				<el-col :span="4" class='infoBox'>
					<el-dropdown trigger="click" class='info_img_box'>
				      <span class="el-dropdown-link user-info">
				        <img :src="avatarSrc"/>{{userName}}
				      </span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item divided @click.native='loginout'>退出登录</el-dropdown-item>
							
						</el-dropdown-menu>
				    </el-dropdown>
				</el-col>
			</el-row>
		</el-header>
		<el-container>
			<el-aside class='aside_region' :class="{'aside-width':!isCollapse,'aside-collapse-width':isCollapse}">
				<!--:default-openeds="['1']"-->
				<el-menu class="el-menu-vertical-demo el-menu-ul" @open="handleOpen" @close="handleClose" :collapse="isCollapse" router :unique-opened='true'>
					<template v-for="(item,index) in this.routeArr">
						<el-submenu v-if="!item.isLeaf" :index="index+1+''">
							<template slot="title">
								<i :class="item.iconName"></i>
								<span slot="title">{{item.navName}}</span>
							</template>
							<el-menu-item v-for="(child,sub_index) in item.children" :index="(index+1)+'-'+(sub_index+1)" :key="(index+1)+'-'+(sub_index+1)" :route="{name:child.name}" v-if="!child.hidden">{{child.navName}}</el-menu-item>
						</el-submenu>
						<!-- 如标签属性非字符串属性，则需要加冒号 -->
						<template v-if="item.isLeaf">
							<el-menu-item  v-for="(children,sub_index) in item.children" :index="index+1+''" :key="index+1+''" :route="{name:children.name}">
							<i :class="item.iconName"></i>
				    		<span slot="title">{{item.navName}}</span>
							</el-menu-item>
						</template>
						
					</template>
				<!--<el-submenu index="1">
				    <template slot="title">
				      <i class="el-icon-location"></i>
				      <span slot="title">导航一</span>
					</template>
				      <el-menu-item index="1-1">选项1</el-menu-item>
				      <el-menu-item index="1-2">选项2</el-menu-item>
				      <el-menu-item index="1-3">选项3</el-menu-item>
				    <el-submenu index="1-4">
				      <span slot="title">选项4</span>
				      <el-menu-item index="1-4-1">选项1</el-menu-item>
				    </el-submenu>
				  </el-submenu>
				  <el-menu-item index="2">
				    <i class="el-icon-menu"></i>
				    <span slot="title">导航二</span>
				  </el-menu-item>
				  <el-menu-item index="3" disabled>
				    <i class="el-icon-document"></i>
				    <span slot="title">导航三</span>
				  </el-menu-item>
				  <el-menu-item index="4">
				    <i class="el-icon-setting"></i>
				    <span slot="title">导航四</span>
				  </el-menu-item>-->
				</el-menu>
			</el-aside>
			<el-main>
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>


<script type='text/ecmascript-6'>
//搞懂@click.prevent...
	export default{
		created(){
			let user=JSON.parse(sessionStorage.getItem('user'));
			this.user=user;
			let routerArr=[];
			let nowPath=this.$route.path;
			//console.log(this.$router.options.routes);
			this.$router.options.routes.forEach((item,index)=>{
				if(item.path==nowPath){
					routerArr.push(item);
				}
			})
			this.routeArr=routerArr;
			console.log(routerArr);
//			console.log(this.$route);
//			console.log(this.$router.options);
			//console.log(this.user);
			//通过this创建的数据也能显示但不是响应式，必须挂载到data上
		},
		data(){
			return {
				projectName:'东理智慧校园',
				isCollapse: false
			}
		},
		computed:{
			avatarSrc(){
				return this.user.avatar;
			},
			userName(){
				return this.user.name;
			}
		},
		methods:{
			loginout(){	
				const h = this.$createElement;
				this.$confirm('确定退出登录么?', '提示',{
				showCancelButton: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				beforeClose: (action, instance, done) => {
					if (action === 'confirm') {
					instance.confirmButtonLoading = true;
					instance.confirmButtonText = '执行中...';
					setTimeout(() => {
						setTimeout(() => {
							instance.confirmButtonLoading = false;
							sessionStorage.removeItem('user');
							this.$router.push({
								name:'Login'
							});
							done();
						}, 100);
            	 	 }, 600);
					}else {
						done();
					}
				}
			}).then(action => {
				this.$message({
					type: 'success',
					message: '退出登录成功',
					duration:2000
				});
			}).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消退出',
		            duration:2000
		          });          
        	});	
			},
			handleOpen(key, keyPath) {
				//console.log(key, keyPath);
			},
			handleClose(key, keyPath) {
				//console.log(key, keyPath);
			},
			handleCollapse(){
				this.isCollapse=!this.isCollapse;
			}
		}
	}
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
.el-header, .el-footer
	background-color: #B3C0D1;
	color: #333;
	/*text-align: center;*/
	line-height: 60px;
.el-container
	height: 100%;
.el-main
	padding:0
.el-aside
	background-color: #eef1f6;
	color: #333;
	text-align: center;
	line-height: 200px;
	overflow-y: auto;
	overflow-x: hidden;
.el-main
	background-color: #E9EEF3;
	color: #333;
	text-align: center;
	line-height: 160px;
.logo
	color:#fff
	box-sizing:border-box
	padding-left:10px
	font-size:22px
	font-weight:normal
	letter-spacing:3px
	transition:width .2s linear
	white-space:nowrap
.logo-width
	width:210px
.logo-collapse-width
	width:44px
	height:60px
.user-info
	&>img	
		width:40px
		height:40px
		border-radius:50%
		vertical-align:middle
		//cursor:pointer
		margin-right:6px

/*旋转按钮*/

.collapseBtn
	color:#fff
	font-size:20px
	border-color:rgba(238, 241, 146, 0.3)
	border-left-width:1px
	border-style:solid
	.collapseToolBox
		width:60px
		box-sizing:border-box
		padding-left:20px
		cursor:pointer
.infoBox
	float:right
	box-sizing:border-box
	padding-left:110px
.info_img_box
	cursor:pointer
	&:hover
		color:#fff

/*侧边区域*/
.aside_region
	text-align:left
	transition:width .2s linear
	.el-menu-vertical-demo:not(.el-menu--collapse)
		width: 230px;
		min-height: 400px;
	.el-menu-ul
		background: #eef1f6;
.aside-width
	width:231px !important
.aside-collapse-width
	width:64px !important
		/*.el-menu-item:hover
			background:#d1dbe5;
	.el-menu-item:focus
		background: #eef1f6;
	.el-submenu:hover
		background:#d1dbe5;
		.el-submenu__title:focus, .el-submenu__title:hover
			background:#d1dbe5;*/
</style>

<style lang='stylus' rel='stylesheet/stylus'>
.el-submenu
	/*background-color:#e4e8f1*/
	.el-menu
		background-color:#e4e8f1
	.el-menu-item:hover
		background:#d1dbe5;
.el-submenu__title:hover
	background-color:#d1dbe5;
.el-menu-item:hover
	background-color:#d1dbe5;
.aside-collapse-width
	width:64px !important
</style>