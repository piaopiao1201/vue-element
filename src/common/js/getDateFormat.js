export function getDate(str){
	let date=new Date(str*1000);
	let year=date.getFullYear();
	let month=date.getMonth()+1;
	let day=date.getDate();
	let hour=date.getHours();
	hour=hour.toString();
	hour=new Array(3-hour.length).join("0")+hour;
	let minute=date.getMinutes();
	minute=minute.toString();
	minute=new Array(3-minute.length).join("0")+minute;
	let seconds=date.getSeconds();
	seconds=minute.toString();
	seconds=new Array(3-seconds.length).join("0")+seconds;
	let res=year+'年'+month+'月'+day+'日 '+hour+':'+minute;
	return res;
}