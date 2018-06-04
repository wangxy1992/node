var http = require("http");
var url = require("url");
var qs = require("querystring");
var superagent = require("superagent");
var cheerio = require("cheerio");
var mongodbUrl = "mongodb://localhost:27017";
var MongoClient = require("mongodb").MongoClient;

MongoClient.connect(mongodbUrl,function(err,db){
	if (err) return err;
	var dbs = db.db("wxy");
	var site = dbs.collection("site");
	var news = dbs.collection("news");
	var isFind = false;
	var datalist = [];
//	数据抓取
	superagent.get("http://sports.sina.com.cn/global/").end(function(err,cb){
		if (err) return next(err);
		var $ = cheerio.load(cb.text);
		$(".col380 .blk2 .ul-type1 li a").each(function(index,ele){
			news.update({index : index},{index : index, message : $(ele).text(),href : $(ele).attr("href")})
		})
	})
//	获取数据
	news.find(function(err,d){
		d.forEach(function(data){
			datalist.push(data)
			if (datalist.length == 50){
			datalist = JSON.stringify(datalist)
//			console.log(datalist)	
			}
		})
	})
	http.createServer(function(req,res){
		res.setHeader("Access-Control-Allow-Origin","*");
		if (req.method == "POST"){
			var result = "",
				username = "",
				password = "";
//			登录注册
			req.on("data",function(chunk){
				result += chunk;
				username = qs.parse(result).username;
				password = qs.parse(result).password;
				site.find({"username":username},function(err,d){
					d.each(function(err,data){
						if (data){
							isFind= true;
							if (data.password == password){
								res.write(JSON.stringify({message : "登录成功",status : 1,data:datalist}));
								res.end();
							}else{
								site.update({"username":username},{"username":username,"password" : password},function(){
									res.write(JSON.stringify({message : "密码修改",status : 2}));	
									res.end()
								})
							}
							return false;
						}else{
							if (!isFind){
								site.insert({"username":username,"password":password})
								res.write(JSON.stringify({message : "注册成功",status : 2}));
								res.end();
							}
						}
					})
				})
			})
		}
	}).listen(8003,function(){
		console.log("开始")
	})
})