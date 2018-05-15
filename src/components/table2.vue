<template>
  <!-- <ul>
  	<li v-for="(item,index) in items" @click="handle($refs.rLi[index])" ref="rLi" :state="true">{{item}}</li>
  </ul> -->
  <button @click="handleClick">跳转</button>
</template>

<script type='text/ecmascript6'>
export default {
	created(){
		console.log(this.$route);
	},
	data(){
		return{
			items:[0,1,2,3]
		}
	},
	methods:{
		handle(index){
			console.log(index);
		},
		handleClick(){
			const id=3;
			this.$router.push({
				path:'/main/table2/'+id,
				params:{
					name:'缪苗'
				}
			})
		}
	},
	beforeRouteUpdate (to, from, next) {
    	console.log(to);
    	next();
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>