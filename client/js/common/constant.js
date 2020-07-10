/* 常量 */
var CONSTANT = {
	DATA_TABLES : {
		DEFAULT_OPTION : { // DataTables初始化选项
			language : {
				"sProcessing" : "处理中...",
				"sLengthMenu" : "每页 _MENU_ 项",
				"sZeroRecords" : "没有匹配结果",
				"sInfo" : "当前显示第 _START_ 至 _END_ 项，共 _TOTAL_ 项。",
				"sInfoEmpty" : "当前显示第 0 至 0 项，共 0 项",
				"sInfoFiltered" : "(由 _MAX_ 项结果过滤)",
				"sInfoPostFix" : "",
				"sSearch" : "当前页中搜索:",
				"sUrl" : "",
				"sEmptyTable" : "表中数据为空",
				"sLoadingRecords" : "载入中...",
				"sInfoThousands" : ",",
				"oPaginate" : {
					"sFirst" : "首页",
					"sPrevious" : "上页",
					"sNext" : "下页",
					"sLast" : "末页",
					"sJump" : "跳转"
				},
				"oAria" : {
					"sSortAscending" : ": 以升序排列此列",
					"sSortDescending" : ": 以降序排列此列"
				}
			},
			ordering : false, // 禁用自定义排序.
			autoWidth : true, // 禁用自动调整列宽
			stripeClasses : ["odd", "even"],// 为奇偶行加上样式，兼容不支持CSS伪类的场合
			order : [], // 取消默认排序查询,否则复选框一列会出现小箭头
			processing : false, // 隐藏加载提示,自行处理
			serverSide : true, // 启用服务器端分页
			searching : false, // 禁用原生搜索
			iDisplayLength : 20, // 默认每页显示多少条记录.
			aLengthMenu : [[20, 30, 50], ["20", "30", "50"]]
			// 允许用户选择每页显示多少条记录.
		},
        CLIENT_MODEL_OPTION : { // DataTables初始化选项
            language : {
                "sProcessing" : "处理中...",
                "sLengthMenu" : "每页 _MENU_ 项",
                "sZeroRecords" : "没有匹配结果",
                "sInfo" : "当前显示第 _START_ 至 _END_ 项，共 _TOTAL_ 项。",
                "sInfoEmpty" : "当前显示第 0 至 0 项，共 0 项",
                "sInfoFiltered" : "(由 _MAX_ 项结果过滤)",
                "sInfoPostFix" : "",
                "sSearch" : "当前页中搜索:",
                "sUrl" : "",
                "sEmptyTable" : "表中数据为空",
                "sLoadingRecords" : "载入中...",
                "sInfoThousands" : ",",
                "oPaginate" : {
                    "sFirst" : "首页",
                    "sPrevious" : "上页",
                    "sNext" : "下页",
                    "sLast" : "末页",
                    "sJump" : "跳转"
                },
                "oAria" : {
                    "sSortAscending" : ": 以升序排列此列",
                    "sSortDescending" : ": 以降序排列此列"
                }
            },
            ordering : true, // 禁用自定义排序.
            autoWidth : true, // 禁用自动调整列宽
            stripeClasses : ["odd", "even"],// 为奇偶行加上样式，兼容不支持CSS伪类的场合
            order : [], // 取消默认排序查询,否则复选框一列会出现小箭头
            processing : false, // 隐藏加载提示,自行处理
            serverSide : false, // 启用服务器端分页
            searching : true, // 禁用原生搜索
            iDisplayLength : 500, // 默认每页显示多少条记录.
            aLengthMenu : [[500], ["500"]]
            // 允许用户选择每页显示多少条记录.
        },
		COLUMN : {
			CHECKBOX : { // 复选框单元格
				className : "td-checkbox",
				orderable : false,
				width : "20px",
				data : null,
				render : function(data, type, row, meta) {
					return '<input type="checkbox" class="iCheck">';
				}
			}
		},
		RENDER : { // 常用render可以抽取出来，如日期时间、头像等
			ELLIPSIS : function(data, type, row, meta) {
				data = data || "";
				return '<span title="' + data + '">' + data + '</span>';
			}
		}
	}
};

if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (prefix){
    return this.slice(0, prefix.length) === prefix;
  };
}

if (typeof String.prototype.endsWith != 'function') {
  String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
  };
}

String.format = function() {
    if( arguments.length == 0 )
        return null;

    var str = arguments[0]; 
    for(var i=1;i<arguments.length;i++) {
        var re = new RegExp('\\{' + (i-1) + '\\}','gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
}
// 国邦erp公共方法
var __gberp = {
		// 前端模板相关方法
		tmpl: {
			/**
			 * 依赖loadash.js
			 * tmplStr: 模板字符串
			 * dataObj: 渲染的数据对象。如：{result: data}
			 * data是需要传入的数据，result就是在模板字符串中使用的变量（其值是对象或者是数组）
			 * options可以自定义模板符号
			 */
			render: function (tmplStr, dataObj, options) {
				var compiled
				if (options) {
					var defaultOptions = {
						// 输出变量的分隔符
						interpolate: /<\$=([\s\S]+?)\$>/g,
						// 转义分隔符
						escape: /<\$-([\s\S]+?)\$>/g,
						// 可执行语句的分隔符
						evaluate: /<\$([\s\S]+?)\$>/g
					}
					options = Object.assign({}, defaultOptions, options)
					compiled = _.template(tmplStr, options)
				} else {
					compiled = _.template(tmplStr)
				}
				
				return compiled(dataObj)
			}
		},
		// 正则相关
		regexp: {
			// 创建一个匹配指定字符之前的位置的正则
			createBeforeCharReg: function (str) {
				if (!(str && String(str).trim())) {
					return
				}
				let regexp = new RegExp('(?=' + str + ')')
				
				return regexp
			}
		},
		url: {
			// 给请求地址添加随机时间戳
			addRandomTimeToUrl: function (pathname) {
				/**
				 * timestamp
				 * 1、abc：添加？和gberptimestamp
				 * 2、/abc 添加？和gberptimestamp
				 * 3、/abc?d=xxx 添加&和gberptimestamp
				 * 4、/abc?d=xxx&e=xxx 添加&和gberptimestamp
				 * 5、abc#anchor 需要在#号前添加?和gberptimestamp
				 * 6、/abc?d=xxx&e=xxx#hash 需要在#号前添加&和gberptimestamp
				 * 
				 * 
				 * 小结：有#号 —— 问号？没有问号？
				 *      没有#号 —— 问号？没有问号？
				 */
				// 是否有?号
				let hasQuestionMark = isIndexExist(pathname.lastIndexOf('?'))
				// 是否有&号？
				let hasAmpersand = isIndexExist(pathname.lastIndexOf('&'))
				// 时间戳
				let hashIndex = pathname.lastIndexOf('#')
				let hasHash = isIndexExist(hashIndex)
				let timestamp = (Date.now && Date.now()) || new Date().getTime()
				function isIndexExist(index) {
					return index >= 0 ? true : false
				}
				// 在请求链接里新增的属性名
				let paramName = 'gberptimestamp'
				
				// 没有#号的情况
				if (!hasHash) {
					if (!hasQuestionMark) {
						// 没有问号的情况
						pathname += '?' + paramName + '=' + timestamp
					} else {
						// 只有问号 以及 同时有问号和和好
						pathname += '&' + paramName + '=' + timestamp
					}
				} else {
					
					if (!hasQuestionMark) {
						
						pathname = pathname.replace(__gberp.regexp.createBeforeCharReg('#'), '?' + paramName + '=' + timestamp)
					} else {
						
						pathname = pathname.replace(__gberp.regexp.createBeforeCharReg('#'), '&' + paramName + '=' + timestamp)
					}					
				}
				return pathname
			}
		}
	
	
}

function openLayerPhotos(url) {
	  layer.photos({
		    photos: {
		    	  "title": "电子收据查看", //相册标题
		    	  "id": 1, //相册id
		    	  "start": 0, //初始显示的图片序号，默认0
		    	  "data": [   //相册包含的图片，数组格式
		    	    {
		    	      "alt": "",
		    	      "pid": 0, //图片id
		    	      "src": url, //原图地址
		    	      "thumb": "" //缩略图地址
		    	    }
		    	  ]
		    	},
		    	closeBtn: 1,
		    	shade: 0.6,
		    	area: ['500px','auto'],
		    	full: true
		    	
		  });
}

