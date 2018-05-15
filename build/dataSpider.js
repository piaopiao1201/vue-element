var axios=require('axios');
var http = require('http');
var https=require('https');
const querystring = require("querystring");
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
// 引入 events 模块
var events = require('events');
// 创建 eventEmitter 对象
var eventEmitter = new events.EventEmitter();
axios.defaults.withCredentials=true;
function dataSpider(){
	this.ticket='';
	//登录的url
	this.loginUrl='https://cas.ecit.cn/login?service=http%3A%2F%2Fjw.ecit.cn%2Flogin.jsp';
	this.mainUrl='http://jw.ecit.cn/login.jsp?ticket=';
	this.listUrl='http://jw.ecit.cn/xszxcxAction.do?oper=xszxcx_lb';
	this.sessionID='';
	this.init();
}

dataSpider.prototype.init=function(){
	var This=this;
	axios.get(this.loginUrl,{
		headers:{
			'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
			Connection: 'keep-alive'
		},
		httpsAgent: new https.Agent({rejectUnauthorized: false}),
		responseType:'arraybuffer'
	}).then(function(res){
		var html = iconv.decode(res.data, 'gb2312');
		var $ = cheerio.load(html, {decodeEntities: false});
		var lt=$('input[name="lt"]').attr('value');
		let sessionId=res.headers['set-cookie'][0].split(';')[0].split('=')[1];
		console.log(res.headers);
		eventEmitter.emit('getSessionId',sessionId,lt);
	});
	eventEmitter.on('getSessionId',function(sessionId,lt){
		var data=querystring.stringify({
			username:'201420310124',
			password:'piaopiao1201',
			lt:lt
		});
		axios.post(This.loginUrl,data,{
			headers:{
				'Cookie':'JSESSIONID='+sessionId,
				'User-Agent':"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
				//Connection: 'keep-alive',
				Referer: 'https://cas.ecit.cn/login?service=http%3A%2F%2Fjw.ecit.cn%2Flogin.jsp',
				'Content-Type':'application/x-www-form-urlencoded'
			},
		  	httpsAgent: new https.Agent({rejectUnauthorized: false})
		}).then(function(res){
			//console.log(res.headers);
			let castGC=res.headers['set-cookie'][0].split(';')[0].split('=')[1];
			eventEmitter.emit('enterMain',sessionId,castGC);
			//console.log(res.headers);
		})
	})
	eventEmitter.on('enterMain',function(id,cast){
		axios.get(This.loginUrl,{
			headers:{
				'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
				Cookie: 'JSESSIONID='+id+'; CASTGC='+cast,
				Connection: 'keep-alive'
			},
			httpsAgent: new https.Agent({rejectUnauthorized: false}),
			responseType:'arraybuffer'
		}).then(function(res){
			var html = iconv.decode(res.data, 'gb2312');
			var $=cheerio.load(html, {decodeEntities: false});
			let str=$('script').html();
			let ticket=str.match(/ticket=(.+)/)[1];
			This.ticket=ticket.substr(0,ticket.length-2);
			This.mainUrl+=This.ticket;
			eventEmitter.emit('getTicket');
		})
	})
	eventEmitter.on('getTicket',function(){
		console.log('执行getTicket');
		axios.get(This.mainUrl,{
			headers:{
				'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
				Connection: 'keep-alive',
				Host: 'jw.ecit.cn'
			},
			//httpAgent: new http.Agent({keepAlive:true})
		}).then(function(res){
			console.log(res.headers);
			let sessionId=res.headers['set-cookie'][0].split(';')[0].split('=')[1];
			This.sessionID=sessionId;
			eventEmitter.emit('getPreData');
		})
	})
	eventEmitter.on('getPreData',function(){
		console.log('执行getPreData');
		//var url='http://jw.ecit.cn/xszxcxAction.do?oper=xszxcx_lb';
		axios.get(This.listUrl,{
			headers:{
				'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
				Connection: 'keep-alive',
				//Host: 'jw.ecit.cn',
				//Referer:'http://jw.ecit.cn/menu/menu.jsp',
				'Cookie':'JSESSIONID='+This.sessionID
			},
			//httpAgent: new http.Agent({keepAlive:true})
		}).then(function(res){
			console.log('已经准备好');
		})
	})
}

dataSpider.prototype.update=function(){
	axios=require('axios');
	axios.get(this.loginUrl,{
		headers:{
			'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
			//Connection: 'keep-alive'
		},
		httpsAgent: new https.Agent({rejectUnauthorized: false}),
		responseType:'arraybuffer'
	}).then(function(res){
		console.log(res.headers);
		var html = iconv.decode(res.data, 'gb2312');
		var $ = cheerio.load(html, {decodeEntities: false});
		var lt=$('input[name="lt"]').attr('value');
		let sessionId=res.headers['set-cookie'][0].split(';')[0].split('=')[1];
		eventEmitter.emit('getSessionId',sessionId,lt);
	})
}

module.exports=new dataSpider();