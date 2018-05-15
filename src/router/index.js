import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/login'
import Main from '@/components/main'
import Table from '@/components/table'
import Table2 from '@/components/table2'
import Table3 from '@/components/table3'
import Table4 from '@/components/table4'

import findLost from '@/components/findLost'
import uploadLost from '@/components/uploadLost'
import SearchClassRoom from '@/components/SearchClassRoom'
import chat from '@/components/chat'

Vue.use(Router)

export default new Router({
  routes: [
  	{
  		path:'/',
      //component:HelloWorld
  		//redirect:'/login'
  	},
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/main',
      name: 'main',
      navName:'地书',
      isLeaf:false,
      iconName:'el-icon-location',
      component: Main,
      meta:{
      	keepAlive: true
      },
      children:[
      	{
      		path:'table',
      		name:'主表',
      		navName:'地图展示',
      		component:Table
      	},
      	{
      		path:'table2/:id',
      		name:'主表2',
      		navName:'主表2',
      		component:Table2
      	}
      ]
    },
    {
      path: '/main',
      name: 'main2',
      isLeaf:false,
      component: Main,
      navName:'搜索同城',
      iconName:"el-icon-menu",
      children:[
      	{
      		path:'table3',
      		name:'table3',
      		navName:'搜索同城',
      		component:Table3
      	},
      	{
      		path:'table4',
      		name:'table4',
      		navName:'上传信息',
      		component:Table4,
          children:[
            
          ]
      	}
      ]
    },
    {
      path: '/main',
      name: 'main2',
      isLeaf:false,
      component: Main,
      navName:'失物招领',
      iconName:"el-icon-menu",
      children:[
        {
          path:'findLost',
          name:'findLost',
          navName:'地图',
          component:findLost
        },
        {
          path:'uploadLost',
          name:'uploadLost',
          hidden:true,
          navName:'编辑信息',
          component:uploadLost,
        }
      ]
    },
    {
      path: '/main',
      relPath:'SearchClassRoom',
      name: 'main3',
      isLeaf:true,
      component: Main,
      navName:'自习教室查询',
      iconName:"el-icon-document",
      children:[
        {
          path:'/SearchClassRoom',
          name:'SearchClassRoom',
          //navName:'搜索同城',
          component:SearchClassRoom
        }
      ]
    },
    {
      path:'/chat',
      name:'chat',
      component:chat
    }
  ]
})
