let data=require('./data.js');

let res=[];

for(let i=0;i<data.length;i++){
	var temp={
		label:data[i].name,
		value:data[i].name,
		children:[]
	};
	if(data[i].sub){
		for(let j=0;j<data[i].sub.length;j++){
			if(data[i].sub[j].name!='请选择'){
				temp.children.push({
					label:data[i].sub[j].name,
					value:data[i].sub[j].name
				})
			}	
		}
	}else{
		delete temp.children;
	}
	
	res.push(temp);
}

export default res;