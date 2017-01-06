/*
 * 这是一个类jQuery的dom库
*/

(function(){

// 通用的绑定事件方法

	var addEvent = function(element,type,fn){
		if(element.addEventListener){
			element.addEventListener(type,fn,false);
		}else{
			element.attachEvent("on" + type,fn);
		}
	}

	var removeEvent = function(element,type,fn){
		if(element.removeEventListener){
			element.removeEventListener(type,fn,false);
		}else{
			element.detachEvent("on" + type,fn);
		}
	}


//查找元素的方法
	function searchElements(selector){


		//声明一个空数组，最后返回的结果
		var result = [];

		if(typeof selector == "string"){  //类型是否是字符串

			// 匹配第一个字符的正则（#id .class 元素名）
			var reg = /^[#\.a-zA-Z]/;		

			// 匹配第一个字符
			if(reg.test(selector)){  //.test()是正则的方法，匹配字符串selector正确返回true

				var first = selector[0];
	//  查找id名，通过id查找元素		
				if(first == "#"){

					var elem = document.getElementById(selector.slice(1));//截取第一位字符(如# .)
					result = elem ? [elem] : [];
	//  查找class名，通过class查找元素				
				}else if(first == "."){

					var elems = document.getElementsByTagName("*");
					var len = elems.length;

					for(var i = 0; i < len; i++) {

						var name = elems[i].className;
						var string = "###" + name.split(" ").join("###") + "###";

						if(string.search("###" + selector.slice(1) + "###") != -1){
							result.push(elems[i]);
						}
					}
	//  查找元素名	通过元素查找元素			
				}else{
					var elems = document.getElementsByTagName(selector);

					// 把集合转换数组
					result = [].slice.call(elems,0);//相当于复制一份
				}

			}

			// return result;
		}else if(selector.nodeType === 1){
			result.push(selector);
		}else if(selector instanceof HTMLCollection || 
			selector instanceof Init){
			result = selector;
		}
		return result;
	}

	//获取样式表的样式兼容性
	function getStyle(elem,style){
		if(elem.currentStyle){
			return elem.currentStyle[style];
		}else{
			return window.getComputedStyle(elem,false)[style];
		}
	}

	//除这以外的数字加px
	function addPx(property,value){
		var object = {
			"z-index" : 1, 
			"opacity" : 1
		}
		if(!object[property]){
			value += "px";
		}
		return value;
	}

	//存储事件的对象
	var events = {};//储存事件
	var only = 0;//标记


//构造函数
	function Init(selector){
		//查找元素
		var arr = searchElements(selector);
		var len = arr.length;

		this.length = len;
		for(var i = 0; i < len;i++){
			this[i] = arr[i];
		}

	}
//构造函数的方法
	Init.prototype = {

		//循环操作当前this对象下的每一个元素（this对象是一个类数组）
		each : function(callback){
			for(var i = 0; i < this.length; i++){
				callback.call(this[i],i,this[i]);
			}
		},
		//增加class
		addClass : function(name){
			this.each(function(i,e){
				if($(e).hasClass(name) == false){
					e.className += " " + name;
				}
			})
		},
		//删除class
		removeClass : function(name){
		//-----------------------------------
		//一种方法	
			// this.each(function(i,e){
			// 	var names = e.className;
			// 	if($(e).hasClass(name) == true){
			// 		var name1 = names.replace(name," ");
			// 		e.className = name1;
			// 	}
			// });
		//-----------------------------------
		//2种方法	
		
			var reg_str = " " + name + " ";
			var reg = new RegExp(reg_str);

			this.each(function(i,e){

				if($(e).hasClass(name)){
					var className = " " + e.className + " ";
					if(reg.test(className)){
						var new_name = className.replace(" " + name, "");
						e.className = new_name;
					}	
				}
			});

		},
		//如果有该class名就删除，没有就添加
		toggleClass : function(name){
			this.each(function(i,e){
				var names = e.className;
				if($(e).hasClass(name) == true){
					var name1 = names.replace(name," ");
					e.className = name1;
				}else{
					e.className += " " + name;
				}
			});



		},
		//有返回true，没有返回flash
		hasClass : function(name){
			var arr = this[0].className.split(" ");
			var isExist = false;

			for(var i = 0; i < arr.length; i++){
				if(arr[i] == name){
					isExist = true;
				}
			}
			return isExist;
		},

		//插入元素最后一个位置
		append : function(element){
			this.first_child(element,"beforeend");
		},	
		//parent必须是一个节点//插入元素最后一个位置
		appendTo : function(parent){
			this.last_child(parent,"beforeend");	
		},
		//插入元素第一个位置
		prepend : function(element){
			this.first_child(element,"afterbegin")
		},
		prependTo : function(parent){
			this.last_child(parent,"afterbegin");
		},
		last_child : function(parent,type){
			var self = this;
			if(parent instanceof Init){//parent必须是Init构造出来的对象
				parent.each(function(i,e){
					if(e.nodeType == 1){
						var elem = self[0].cloneNode(true);
						e.insertAdjacentElement(type,elem);//在指定位置插入元素
					}
				})
			}
		},
		first_child : function(element,type){
			this.each(function(i,e){                          
				if(typeof element == "string"){
					e.insertAdjacentHTML(type,element);
				}else if(element.nodeType == 1){
					var elem = element.cloneNode(true);
					/*e.appendChild(elem);*/
					e.insertAdjacentElement(type,elem);
				}
			})
		},

		css : function(property,value){
			var arg_len = arguments.length;

			//获取css属性
			if(arg_len == 1 && typeof property == "string"){
				//返回当前元素的样式
				return getStyle(this[0],property);			
			}
			//设置
			if(arg_len == 2 && typeof property == "string"){

				if(typeof value == "number"){
					value = addPx(property,value);
				}

				this[0].style[property] = value;
			}
			//设置多个class
			if(typeof property == "object"){
				var value;
				for(var key in property){
					if(typeof property[key] == "number"){
						value = addPx(key,property[key]);
					}else{
						value = property[key];
					}
					this[0].style[key] = value;
				}
			}
		},	
		//添加属性(添加行内样式)
		attr : function(property,value){
			var arg_len = arguments.length;
			//获取属性
			if(arg_len == 1 && typeof property == "string"){
				return this[0].getAttribute(property);	
			}
			//设置
			if(arg_len == 2 && typeof property == "string"){
				this[0].setAttribute(property,value);
			}
			//设置多个style
			if(typeof property == "object"){
				for(var key in property){
					this[0].setAttribute(key,property[key]);
				}
			}
		},
		//获取同级元素(同级除自身)
		sbilings : function(){
			//var arr = [];
			var newDom = $("");
			var all = this[0].parentNode.children;//父节点所有子元素
			var index = 0;
			// for(var i = 0; i < all.length; i++){
			// 	if(all[i] != this[0]){
			// 		arr.push(all[i])
			// 	}
			// }
			// for(var i = 0; i < arr.length; i++){
			// 	newDom[i] = arr[i];
			// 	newDom.length = i+1;
			// }
			for(var i = 0; i < all.length; i++){
				if(all[i] != this[0]){
					newDom[index] = all[i]
					index++;
				}
			}
			newDom.length = index;
			return newDom;
			//return arr;
		},
		//删除单个元素(删除自身并且返回自身)
		remove : function(){
			this.each(function(i,e){
				var parent = e.parentNode;
				parent.removeChild(e);
			})
			return this;
		},

		//下一个元素
		next : function(){
			var arr = $("");
			var parent = this[0].parentNode;
			var childs = parent.children;
			for(var i = 0; i<childs.length;i++){
					if(this[0] == childs[i] && i < childs.length - 1){
						arr.push(childs[(i+1)])
					}
				}
			return arr;
		},
		//上一个元素
		prev : function(){
			var arr = $("");
			var parent = this[0].parentNode;
			var childs = parent.children;
			for(var i = 0; i<childs.length;i++){
					if(this[0] == childs[i] && i > 0){
						arr.push(childs[(i-1)])
					}
				}
			return arr;
		},

		//事件绑定	
		on : function(type,fn){
			this.each(function(i,e){

				//事件名唯一
				only++;
				var name = "handle" + only;

				//把事件和事件类型添加到events对象
				events[name] = fn;

				//绑定事件
				addEvent(e,type,fn);
				if(!e.eventName){
					e.eventName = {};
				}
				if(!e.eventName[type]){
					e.eventName[type] = [];
				}
				/*把事件名添加到该元素的eventName属性上
				   eventName是一个对象

				   eventName = {
					"click" : ["handle1"]	
				   }*/
				e.eventName[type].push(name);
				console.log(e.eventName);
			})
			console.log(events);
			
		},
		//解除事件绑定
		off : function(type){

			this.each(function(i,e){
				if(e.eventName){

					//找到该元素要删除的事件类型的事件名
					var arr = e.eventName[type];
					

					for(var i = 0; i < arr.length; i++){

						//匹配events对象的函数
						removeEvent(e,type,events[arr[i]]);	
					}
				}
			})
		},


		//把Dom对象转换成类数组
		push: [].push,
		sort: [].sort,
		splice: [].splice
	}

//内部函数
	function Dom(selector){
		return new Init(selector);
	}

	window.$ = Dom;
}())

