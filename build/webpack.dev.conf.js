'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const http=require('http')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const express=require('express');
const app=express();
var apiRoutes = express.Router()
const axios=require('axios');
const querystring=require('querystring');
const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)
var dataSpider=require('./dataSpider.js')
const cheerio=require('cheerio')
const iconv = require('iconv-lite');

var server=http.createServer(app);
const io=require('socket.io')(server);
app.use('/api', apiRoutes);

server.listen(3030);

var mainSpace=io.of('mainSpace');
io.on('connection',function(socket){
  //console.log('主连接已生效');
})




const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    },
    before(app){
      apiRoutes.get("/getPosition",(req,res)=>{
        var url="https://ditu.baidu.com/?qt=ipLocation";
        axios.get(url,{
          headers:{
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'zh-CN,zh;q=0.9',
            'Cache-Control': 'max-age=0',
            'Connection': 'keep-alive',
            'Cookie': 'BAIDUID=B152025A84320EE59EB635C2065FB380:FG=1;',
            'Host': 'ditu.baidu.com',
            'Upgrade-Insecure-Requests': 1
            //User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36
          }
        }).then((response)=>{
          //console.log(response);
          res.json(response.data);
        }).catch((err)=>{
          console.log(err);
        })
      });
      apiRoutes.get("/getClassRoom",(req,res)=>{
        //dataSpider.update();
        // try{
        //console.log(dataSpider.sessionID);
        var queryParam=req.query;
        var FormData=querystring.stringify({
          zxxnxq:'2017-2018-2-1',
          zxXaq:'04',
          zxJxl:queryParam.place,
          zxZc:queryParam.zc,
          zxJc:queryParam.jc,
          zxxq:queryParam.xq,
          pageSize:'3',
          page:queryParam.pageIndex,
          currentPage:queryParam.pageIndex,
          pageNo:''
      });
          axios.post('http://jw.ecit.cn/xszxcxAction.do?oper=tjcx',FormData,{
          headers:{
            Cookie:'JSESSIONID='+dataSpider.sessionID,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length':Buffer.byteLength(FormData)
          },
          responseType:'arraybuffer'
        }).then(function(resData){
          var resArr=[];
          var titleArr=['index','region','building','classroom','type','seatNum'];
          var html = iconv.decode(resData.data, 'gb2312');
          var $ = cheerio.load(html, {decodeEntities: false});
          $('#user tbody tr').each(function(index,item){
            var tdSet=$(item).children('td');
            var res={};
            tdSet.each(function(index,item){
              if(index<6){
                res[titleArr[index]]=$(item).text().trim();
              }
            })
            resArr.push(res);
          })
          let text=$('.titleTop2').next().find('td').text();
          let total=text.match(/^共(\d+)项/)[1]*1;
          //console.log(resArr);
          //console.log(resArr);
          res.json({
            status:'ok',
            resArr:resArr,
            total:total
          });
        }).catch(function(err){
          if (err.response) {
      // 请求已发出，但服务器响应的状态码不在 2xx 范围内
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
          }else{
            dataSpider=require('./dataSpider.js');
            setTimeout(function(){
              res.json({
                status:'error',
                msg:'出了点问题,请再试一次'
              })
            },800)
          }
        })
        // }catch(err){
        //   console.log(1);
        //   logger.error(err);
        //   // dataSpider.update();
        // }
        
      })
      var numUsers = 0;
      mainSpace.on('connection',function(socket){
        console.log('mainSpace已成功连接');
        var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    socket.pic = data.pic;
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data.message,
      pic: socket.pic
    });
  });

  // when the client emits 'add user', this listens and executes
  // 有新用户进入时
  socket.on('add user', function (username) {
    if (addedUser) return;

    // we store the username in the socket session for this client
    // 将名字保存在socket的session中
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function (data) {
    socket.broadcast.emit('typing', {
      username: socket.username,
      pic: data.pic
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
      })


    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
