$(function(){
	var datalist = [];
	$(".btn").on("click",function(){
		var user = $(".user").val(),
			pass = $(".pass").val();
		$.ajax({
			type:"post",
			url:"http://localhost:8003",
			data : {username : user,password:pass},
			success : function(data){
				var data = JSON.parse(data)
				alert(data.message);
				if (data.status == 1){
					$(".login").css("display","none")
					datalist = JSON.parse(data.data);
					var len = datalist.length;
					var temp = {};
					for(var i = 0; i < len; i++) {
						for(var j = i + 1; j < len - 1; j++) {
							if(datalist[i].index > datalist[j].index) {
								temp = datalist[i];
								datalist[i] = datalist[j];
								datalist[j] = temp;
							}
						}
					}
					datalist.forEach(function(d){
						var a = $("<a href=''></a>");
						$(a).text(d.message);
						$(a).attr("href" , d.href);
						var li = $("<li></li>")
						$(li).append(a);
						$(".main").append(li);
					})
				}		
			}
		});	
	})
})