import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import router from './router'
import 'common/stylus/reset.styl'
import Mock from './mock/mock'
import 'font-awesome/css/font-awesome.min.css'

// import $ from 'jquery'
// $.getScript('common/js/DrawingManager.js');
//console.log($.getScript);
//require('common/js/DrawingManager.js');
Vue.config.productionTip = false
Vue.use(ElementUI);
// Mock.bootstrap();

router.beforeEach((to,from,next)=>{
	// if(to.path=='/'){
	// 	if(sessionStorage.getItem('user')===null){
	// 		next({
	// 			name:'Login',
	// 		});
	// 		return;
	// 	}else{
	// 		next({
	// 			name:'main',
	// 			params:{			
	// 			}
	// 		});
	// 	}
	// }
	// if(to.path=='/login'){
	// 	if(sessionStorage.getItem('user')!==null){
	// 		next({
	// 			name:'main',
	// 			params:{			
	// 			}
	// 		});
	// 	}
	// }
	// next();
	
	if(to.path=='/'){
		if(sessionStorage.getItem('user')===null){
			next({
				name:'Login'
			});
		}else{
			next({
				name:'main'
			});
		}
	}

	if(to.path=='/login'){
		if(sessionStorage.getItem('user')!==null){
			next({
				name:'main'
			});
		}else{
			next();
		}
	}

	if(to.path=='/main'){
		if(sessionStorage.getItem('user')===null){
			next({
				name:'Login'
			});
		}else{
			next();
		}
	}

	next();
	// else{
	// 	if(sessionStorage.getItem('user')!==null){
	// 		next({
	// 			name:'main'
	// 		});
	// 	}else{
	// 		next();
	// 	}
	// }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
