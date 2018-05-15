import axios from 'axios';
import jsonp from 'common/js/jsonp'
//let base = '';

export const requestLogin = params => { return axios.get('/checkLogin', {
	params:params
}).then(res => res.data); 
};


export const checkLogin = params=>{
	return jsonp('http://www.mylaravel.com:8888/api/checkLogin',{
		user:params.user,
		password:params.password
	},{
		param:'callback'
	});
}

export const addMarker=item=>{
	return jsonp('http://www.mylaravel.com:8888/api/addMarker',{
		label:item.label,
		description:item.description,
		lng:item.trueLng,
		lat:item.trueLat
	},{
		param: 'callback'
	});
}

export const updateMarker=(item,id)=>{
	return jsonp('http://www.mylaravel.com:8888/api/updateMarker',{
		label:item.label,
		description:item.description,
		lng:item.lng,
		lat:item.lat,
		id:id
	},{
		param: 'callback'
	});
}

export const deleteMarker=id=>{
	return jsonp('http://www.mylaravel.com:8888/api/deleteMarker',{
		id:id
	},{
		param: 'callback'
	});
}

// export const getPos=()=>{
// 	return jsonp('https://ditu.baidu.com/',{
// 		qt:'ipLocation'
// 	});
// }

export const getPos=()=>{
	return axios.get('/api/getPosition').then(res=>{
  		return Promise.resolve(res.data);
  	});
}

//获取是否存有数据
export const getUserInfo=params=>{
	return jsonp('http://www.mylaravel.com:8888/api/checkInfo',{
		user:params.user
	},{
		param: 'callback'
	});
}

export const updateInfo=params=>{
	return jsonp('http://www.mylaravel.com:8888/api/updateInfo',{
		user:params.user,
		province:params.province,
		city:params.city,
		lng:params.lng,
		lat:params.lat,
		academy:params.academy,
		sex:params.sex
	},{
		param:'callback'
	});
}

export const deleteInfo=user=>{
	return jsonp('http://www.mylaravel.com:8888/api/deleteInfo',{
		user
	},{
		callback:'callback'
	});
}

export const createInfo=params=>{
	return jsonp('http://www.mylaravel.com:8888/api/createInfo',{
		user:params.user,
		province:params.province,
		city:params.city,
		lng:params.lng,
		lat:params.lat,
		academy:params.academy,
		sex:params.sex,
		name:params.name
	},{
		callback:'callback'
	});
}

export const getAll=(params)=>{
	return jsonp('http://www.mylaravel.com:8888/api/getAll',{
		province:params.province,
		city:params.city,
		academy:params.academy,
		sex:params.sex
	},{
		callback:'callback'
	});
}

//获取教室查询参数
export const getClassRoom=(params)=>{
	return axios.get('/api/getClassRoom',{
		params:params
	}).then(res=>{
		return Promise.resolve(res.data);
	})
}

//上传失物信息
export const submitLost=params=>{
	return axios.post('http://www.mylaravel.com:8888/api/submitLost',params,{
		headers: {
			'Content-Type':'multipart/form-data'
		},
		responseType: 'json'
	}).then(res=>{
		return Promise.resolve(res.data);
	})
}

export const getMyEditLost=params=>{
	return jsonp('http://www.mylaravel.com:8888/api/getMyEditLost',{
		user:params.user
	},{
		callback:'callback'
	});
}

export const updateLostInfo=params=>{
	return axios.post('http://www.mylaravel.com:8888/api/updateLostInfo',params,{
		headers: {
			'Content-Type':'multipart/form-data'
		},
		responseType: 'json'
	}).then(res=>{
		return Promise.resolve(res.data);
	})
}

// export const submitLost=(params)=>{
// 	return jsonp('http://www.mylaravel.com:8888/api/submitLost');
// }

//得到所有失物点
export const getLostPoint=()=>{
	return jsonp('http://www.mylaravel.com:8888/api/getLostPoint',{},{
		callback:'callback'
	});
}