import {userArr} from './data/data';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter'

export default{
	bootstrap(){
		let mock =new MockAdapter(axios);

		// mock.onGet('/checkLogin').reply(config=>{
		// 	return new Promise((resolve,reject)=>{
		// 		resolve(config);
		// 	});
		// });
		mock.onGet('/checkLogin').reply(config=>{
			//setTimeout(function(){
				let param={
					user:config.params.user,
					password:config.params.password
				};

			return new Promise((resolve,reject)=>{
				setTimeout(function(){
					let AdminUser={};
				var state=userArr.some(value=>{
					if(value.user==param.user&&value.password==param.password){
						//AdminUser=Object.assign({},value);//无法深拷贝
						AdminUser=JSON.parse(JSON.stringify(value));
						return true;
					}
				});
				if(state){
					AdminUser.password=null;
					resolve([200,{
						state,
						AdminUser,
						msg:'登陆成功'
					}])
				}else{
					resolve([200,{
						state,
						AdminUser,
						msg:'用户名或密码错误'
					}])
				}
				},500)		
			})
		//},1000)
			
			
			// return [200,{
			// 	state,
			// 	User
			// }];
		});
	}
}
