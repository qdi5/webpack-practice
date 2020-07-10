// 默认索引
window.DEFAULT_INDEX = -1;
// 仪表索引
window.ybIndex = DEFAULT_INDEX;
// 物品索引
window.goodsIndex = DEFAULT_INDEX;
// 新增物品模板页的初始索引
window.initIndex = DEFAULT_INDEX;
// 新增物品模板页索引
window.tmplGoodsIndex = DEFAULT_INDEX;
// 标识是否传递id
window.isSendId = true;
// 这几个常量用于在删除DOM节点时，操作对应的索引
// 删除的是仪表项
window.DELETE_IS_YB_ITEM = 0;
// 删除的是资产交割页的物品
window.DELETE_IS_ZCJG_GOODS = 1;
// 删除的是新增物品模板页的物品
window.DELETE_IS_XZWPMB_GOODS = 2;
// 标识是否保存过模板了
window.hasSaved = null;

window.handleMinus = function handleMinus(_this) {
  // debugger;
  var $this = $(_this);
  var $input = $this.next();
  var inputValue = Number($input.val()) - 1;
  inputValue = inputValue < 1 ? 0 : inputValue;
  $input.val(inputValue);
}

window.handlePlus = function handlePlus(_this) {
  var $this = $(_this);
  var $input = $this.prev();
  var inputValue = Number($input.val()) + 1;
  inputValue = inputValue > Infinity ? Infinity : inputValue;
  $input.val(inputValue);
}

// 验证输入框只能输入数字
window.trimNotNumber = function trimNotNumber(_this) {
  debugger
  var val = _this.value;
  var number = matchNumber(val);
  $(_this).val(number)
  toggleError(isInteger(number), _this);
}

// 匹配数字
window.matchNumber = function matchNumber(str) {
  var numberReg = /(\d)/g;
  var matched = str.match(numberReg);
  var number = -1
  if (matched) {
    number = matched.join('');
  }
  return number;
}

// 是否是整数
window.isInteger = function isInteger(str) {
  return /^[1-9](\d+)?$|^0$/g.test(str);
}

// 切换错误提示
window.toggleError = function toggleError(isPassed, targetDom) {
  if (!isPassed) {
    $(targetDom).addClass("haserror");
  } else {
    $(targetDom).removeClass("haserror");
  }
}

// 验证表单的函数
window.validate = function validate(form) {
  debugger
  console.log('$(form).is("form"):\n', $(form).is("form"))
  if (!$(form).is("form")) {
    return;
  }
  return !$(form)
    .find(".haserror")
    .size();
}

window.updateRemark = function updateRemark(_this) {
  openAddRemarkDialog(_this);
}

// 打开弹框修改文本内容
window.openAddRemarkDialog = function openAddRemarkDialog(_this, type) {
  var $target = $(_this)
  var $remarkContent = $("#remarkContent")
  var isBrand = type === 'brand'
  var isModel = type === 'model'
  var title = ''
  var goodsName = $target.siblings('.goods-name').val() || $target.siblings('.goods-name').text()
  if (isBrand) {
    title = `修改${goodsName.trim()}品牌`
  } else if(isModel) {
    title = `修改${goodsName.trim()}型号`
  }
  layer.open({
    type: 1,
    title,
    //不显示标题
    content: $("#addRemark"), //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
    btn: ["保存", "取消"],
    // layero为当前弹层的jquery对象
    yes: function (index, layero) {
      //按钮【按钮一】的回调
      var remark = $("#remarkContent").val();
      $remarkContent.val("");
      var trimedRemark = $.trim(remark);
      if (trimedRemark !== '') {
        $(_this)
          .find(".js-remark-content")
          .val(trimedRemark);
      }
      layer.close(index);
    },
    btn2: function (index, layero) {
      //按钮【按钮二】的回调
      $remarkContent.val("");
      //return false 开启该代码可禁止点击该按钮关闭
    },
    cancel: function () {
      $remarkContent.val("");
    },
    success: function () {
      var oldRemark = $(_this).find(".js-remark-content").val()
      $remarkContent.val(oldRemark);
    }
  });
}

// 删除物品
window.deleteItem = function deleteItem(_this, id) {
  /* var idVal = $(_this)
    .parent()
    .attr("data-idvalue");
  //0为仪表接口 1为物品接口
  switch (id) {
    case 0:
      deletMrs(idVal, _this);
    case 1:
      deletGoods(idVal, _this);
    case 2:
      deletGoods(idVal, _this, "deleteIsTmplAdd");
  } */
}

// 新的删除
window.newDeleteItem = function newDeleteItem(_this) {
  if (!_this) return
  $(_this).closest('.goods').remove()
}

// 仪表读数，添加
window.ybAdd = function ybAdd() {
  $("#ybItem").append(
    __gberp.tmpl.render($("#ybTmpl").html(), {
      index: ++ybIndex
    },{})
  );
}

// 仪表读数和物品保存
window.saveListForm = function saveListForm() {
  validateListForm(function(){  
	$('#jsSaveBtn').attr('disabled', 'disabled')	  
    var params = compositeParams($("[data-name]", "#listForm"));
    var houseOrigin = $("body").data("houseOrigin");
    params["houseBillNo"] = houseOrigin.houseBillNo;
    params["houseName"] = decodeURI(houseOrigin.houseName);
    var serializedData = $('#listForm').serializeArray()
    var serializeObj = {}
    serializedData.forEach(function(item) {
      serializeObj[item.name] = item.value
    })
    var paramsTwo = {};
    if (isSendId) {
      paramsTwo = Object.assign({}, getIds("#hallWrapper"),getIds("#houseWrapper"),getIds("#chickenWrapper"))
    }
    debugger
    filterParams(params, paramsTwo)
    debugger
    // var ybParams = getIds("#ybItem");
    params = Object.assign({}, params, paramsTwo, serializeObj);
    let { houseBillNo } = $("body").data("houseOrigin")
    $.post("/hbHouseSale/saveMeteReadGood", params).then(
      function (result) {    	
    	  $("#jsSaveBtn").removeAttr('disabled');	   	
        console.log("保存结果：", result);
        if (result && result.success) {
          hasSaved = true
          layer.msg("保存成功", {
              icon: 1,
              time: 1000 //1秒关闭(如果不配置，默认是3秒)
          });
          window.location.href = `/hbHouse/toEdit/notout?billNo=${houseBillNo}`
        } else {
          layer.msg("保存失败", {
            icon: 2,
            time: 2000 //2秒关闭(如果不配置，默认是3秒)
          });
        }
      },
      function (err) {
    	  $("#jsSaveBtn").removeAttr('disabled');	
        console.log("保存出错：", err);
      }
    );
  })
}

// 过滤属性idvalue为空且数量为0的数据
/**
 * 
 * @param {所有data-name属性组成的参数} params 
 * @param {所有data-id属性组成的参数} paramsTwo 
 */
function filterParams (params, paramsTwo) {
  // 提取形如"a[0].b"的字符串
  const reg= /^.+\[(\d+)\]\.(.+)$/g
  // 存储可能需要删除的索引
  const mayDelIndexs = []
  // 找到id值为空的属性
  for (let prop in paramsTwo) {
    let val = paramsTwo[prop]
    if (reg.test(prop)) {
      prop.match(reg)
      let index = RegExp.$1
      let attrName = RegExp.$2
      if (attrName === 'id') {
        if (val.trim() === '') {
          mayDelIndexs.push(index)
        }
      }
    }
  }
  // 存储真正需要删除的索引
  let realDelArr = []
  for (let attr in params) {
    let val = params[attr]
    if (reg.test(attr)) {
      attr.match(reg)
      let index = RegExp.$1
      let attrName = RegExp.$2
      // 如果存在于删除数组里面，如果count也为0，则删除params和paramsTwo的属性
      // 不为-1，则进入判断
      if (~mayDelIndexs.indexOf(index) && attrName === 'count' && val === '0') {
        realDelArr.push(index)
      }
    }
  }

  for (let p in params) {
    if (reg.test(p)) {
      p.match(reg)
      let index = RegExp.$1
      if (~realDelArr.indexOf(index)) {
        delete params[p]
      }
    }
  }

  for (let p in paramsTwo) {
    if (reg.test(p)) {
      p.match(reg)
      let index = RegExp.$1
      if (~realDelArr.indexOf(index)) {
        delete paramsTwo[p]
      }
    }
  }
}


// 重新渲染仪表数据和物品数据
window.reRenderYbAndGoodsData = function reRenderYbAndGoodsData() {
  var houseBillNo = $("body").data("houseOrigin").houseBillNo;
  getYbInfo(houseBillNo);
  getGoodsInfo(houseBillNo);
}

// 组合保存的参数
window.compositeParams = function compositeParams($dataNames) {
  var params = {};
  $dataNames.each(function (index) {
    var attr,
      val,
      isInput,
      $el = $(this);
    attr = $el.data("name");
    console.log("属性：", attr);
    isInput = $el.is("input")
    if (isInput) {
      val = $.trim($el.val());

      if ($.trim(val) !== '') {
        params[attr] = val;
      }
    } else {
      val = $.trim($el.text());
      params[attr] = val;
    }
  });
  return params;
}

// 新增物品模板页添加物品
window.tmplAddGoods = function tmplAddGoods(flag) {
  addGoods(flag);
}

// 获取dom元素上data-id,data-idvalue的函数
window.getIds = function getIds(idStr) {
  var $ids = $("[data-id]", idStr);
  var paramsTwo = {};
  $ids.each(function (index) {
    var attr,
      val,
      $el = $(this);
    attr = $el.data("id");
    val = $.trim($el.data("idvalue"));
    paramsTwo[attr] = val;
  });
  return paramsTwo;
}

// 保存模板
window.saveTmplGoods = function saveTmplGoods(index) {
  var params = compositeParams($("[data-name]", "#goodsAdd"));
  var modelName = $.trim($("#modelAddName").val());
  params["modelName"] = modelName;
  var ly = layer.load(1, {
	  shade: [0.6,'#000']
  });
  $.post("/hbHouseSale/saveGoodsModel", params).then(
    function (result) {
      // 成功
      layer.close(ly);
      if (result.success === true) {
        setTimeout(function () {
          layer.close(index);
        });
        layer.msg("保存模板成功");
        $("#models").append(
          __gberp.tmpl.render($("#modelNames").html(), {
            data: {
              type: "append",
              data: [modelName]
            }
          }, {})
        );
      } else {
        layer.msg("保存模板失败", {
          icon: 2
        });
      }
      $("#modelAddName").val('')
    },
    function (err) {
      // 失败
      // console.log("保存模板出错：", err);
      layer.close(ly);
    }
  );
}

window.renderYbInfo = function renderYbInfo ($container, data) {
  $container.replaceWith(
    __gberp.tmpl.render($("#placeholderTmpl").html(), {
      data: data
    }, {})
  );

  $('.skin-minimal input[type="radio"]').iCheck({
    checkboxClass: 'icheckbox-blue',
    radioClass: 'iradio-blue',
    increaseArea: '20%'
  })
}


// 查询仪表读数
window.getYbInfo = function getYbInfo(houseBillNo) {
  var $ybItem = $("#placeholder");
  $.get("/hbHouseSale/findbyMeterReadingSale?houseBillNo=" + houseBillNo).then(
    function (result) {
      console.log("查询仪表读数:", result);
      var data = {}
      if (result && result.success) {
        data = (result.map && result.map.data) || {};
        if ($.isArray(data) && data.length) {
          data["_deleteFlag"] = DELETE_IS_YB_ITEM;
          ybIndex = getDomMaxIndex($ybItem, ".item-row");
        }
      }
      renderYbInfo($ybItem, data)
      bindEvent()
    },
    function (error) {
      renderYbInfo($ybItem, {})
      bindEvent()
      layer.msg("查询数据出错", {
        icon: 2
      });
      console.log("查询仪表读数error:", error);
    }
  );
}

// 绑定事件
function bindEvent() {
    $('#tv [name="television"]').change(function() {
      debugger
      var radioValue = this.value
      if (radioValue === '有') {
        $('#jsTvStatus').css('display','inline-block')
        console.log($('[name="televisionType"]:checked','#jsTvStatus').val())
        debugger
        if ($('[name="televisionType"]:checked','#jsTvStatus').val() === '未停') {
          $('#jsTvType').css('display','inline-block')
        }
      } else if (radioValue === '无') {
        // 隐藏		
        var $jsTvStatus = $('#jsTvStatus')
        var $jsTvType = $('#jsTvType')
        $jsTvStatus.hide()
        $jsTvStatus.find('input').iCheck('uncheck')
        $jsTvType.hide()
        $jsTvType.find('input').iCheck('uncheck')
      }
    })

    $('[name="televisionType"]',"#jsTvStatus").change(function() {
      var radioValue = this.value
      if (radioValue === '未停') {
        $('#jsTvType').css('display','inline-block')
      } else if (radioValue === '已停') {
        var $jsTvType = $('#jsTvType')
        // 隐藏		
        $jsTvType.hide()
        $jsTvType.find('input').iCheck('uncheck')
      }
    })

    $('[name="phone"]',"#phone").change(function() {
      var radioValue = this.value
      if (radioValue === '有') {
        $('#jsPhone').css('display','inline-block')
      } else if (radioValue === '无') {
        var $jsPhone = $('#jsPhone')
        // 隐藏		
        $jsPhone.hide()
        $jsPhone.find('input').iCheck('uncheck')
      }
    })

    $('[name="network"]',"#jsNet").change(function() {
      var radioValue = this.value
      if (radioValue === '有') {
        $('#jsNetType').css('display','inline-block')
      } else if (radioValue === '无') {
        var $jsNetType = $('#jsNetType')
        // 隐藏		
        $jsNetType.hide()
        $jsNetType.find('input').iCheck('uncheck')
      }
    })

    // 
    $('[name="paymentType"]', "#payment").change(function(){
      var radioValue = this.value
      if (radioValue === '物业卡缴费') {
        $('#wuyePay').show()
      } else if (radioValue === '自行缴费') {
        $('#wuyePay').hide()
        $('#wuyePay').find('input').each(function(index, elm) {
          debugger
          var $current = $(elm)
          var elmType = $current.attr('type')
          if (elmType === 'text') {
            $current.val('')
          } else if (elmType === 'radio') {
            debugger
            $current.iCheck('uncheck')
          }
        })
      }
    })
}



// 查询物品
window.getGoodsInfo = function getGoodsInfo(houseBillNo, houseType) {
  $.get(`/hbHouseSale/findbyGoods?houseBillNo=${houseBillNo}&houseType=${houseType}`).then(
    function (result) {
       var houseType = decodeURI($("body").data("houseOrigin").houseType)
       // 获取几房
       var allCount = houseType.match(/(\d)/g)
       var houseCount = allCount[0]
       var hallCount = allCount[1]
       var chickenCount = allCount[2]
       debugger
        // 后端有数据的情况，需要展示对应数据
        if (result && result.map && result.map.data && Object.keys(result.map.data).length) {
          debugger
          let { house, drawingRoom, kitchen } = result.map.data
          let houseArr = []
          let defaultHouseData = getHouseData()
          if (house && house.length) {
            let ftwTypeArr = house.map(item => {
              return item.ftwType
            })
            // 数组去重
            ftwTypeArr = [...new Set(ftwTypeArr)]
            // 按照房间序号排序数组
            ftwTypeArr.sort(function(a, b) {
              let reg = /(\d)/
              return Number(a.match(reg)[0]) - Number(b.match(reg)[0])
            })
            console.log('排序后的数组：\r\n',ftwTypeArr)
            let length = ftwTypeArr.length
            // 房间数据
            for (let i = 0; i < length; i++) {
              // 获取每个房间的数据
              let filterHouseData = house.filter(item => {
                return item.ftwType === ftwTypeArr[i]
              })
              houseArr.push(filterNeededDefaultData(filterHouseData, defaultHouseData))
            }
          } else {
            houseArr.push(defaultHouseData)
          }
          
          console.log('房间数组：\r\n', houseArr)
          
          let defaultHallData = getHallData()
          let hallArr = []
          if (drawingRoom && drawingRoom.length) {
            hallArr = [filterNeededDefaultData(drawingRoom, defaultHallData)]
          } else {
            hallArr.push(defaultHallData)
          }

          let defaultChickenData = getKitchenBathData()
          let chickenArr = []
          if (kitchen && kitchen.length) {
            chickenArr = [filterNeededDefaultData(kitchen,defaultChickenData)]
          } else {
            chickenArr.push(defaultChickenData)
          }
          // 渲染数据
          renderHouseHallKitchenData(hallArr,houseArr,chickenArr)
       } else {

        // 后端没数据时，使用前端默认的数据
        let hallData = getHallData()
        let hallArr = []
        hallArr.ftwType = '客厅'
        for (let i =0; i < hallCount; i++) {
          hallArr.push(simpleDeepCopy(hallData))    
        }

        let houseData = getHouseData()
        let houseArr = []
        houseArr.ftwType = '房间'
        for (let i =0; i < houseCount; i++) {
          houseArr.push(simpleDeepCopy(houseData))    
        }

        let chickenData = getKitchenBathData()
        let chickenArr = []
        chickenArr.ftwType = '厨卫'
        for (let i =0; i < chickenCount; i++) {
          chickenArr.push(simpleDeepCopy(chickenData))    
        }

        renderHouseHallKitchenData (hallArr, houseArr, chickenArr)
     }
    },
    function (error) {
      layer.msg("查询物品出错", {
        icon: 2
      });
    }
  );
}

// 筛选出后端数据中没有的所有默认数据
function filterNeededDefaultData(backendData, defaultData) {
  let goodsNameArr = backendData.map(item => {
    return item.goodsName
  })
  let filterData = defaultData.filter(item => {
    return !goodsNameArr.includes(item.goodsName)
  })
  return backendData.concat(filterData)
}





// 简单深拷贝
function simpleDeepCopy (obj) {
  return JSON.parse(JSON.stringify(obj))
}

// 渲染房间、大厅和厨卫数据
function renderHouseHallKitchenData (hallData, houseData, chickenData) {
     // 后端没数据时，使用前端默认的数据
     var $hallWrapper = $("#hallWrapper");
     hallData.ftwType = '客厅'
     $hallWrapper.html(
       __gberp.tmpl.render($("#goodsTmpl").html(), {
         data: hallData
       }, {})
     )
     
     var $houseWrapper = $("#houseWrapper");
     houseData.ftwType = '房间'
     $houseWrapper.html(
       __gberp.tmpl.render($("#goodsTmpl").html(), {
         data: houseData
       }, {})
     )

     var $chickenWrapper = $("#chickenWrapper");
     chickenData.ftwType = '厨卫'
     $chickenWrapper.html(
       __gberp.tmpl.render($("#goodsTmpl").html(), {
         data: chickenData
       }, {})
     )    
}


// 单独获取物品的API
window.goodsNamesOnlyApi = function goodsNamesOnlyApi() {
  return $.get("/hbHouseSale/ajaxGoods");
}

// 关闭当前弹框
window.btn_colse = function btn_colse() {
  var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
  parent.layer.close(index);
}

// 通过元素的data-name属性，获取最大索引
window.getDomMaxIndex = function getDomMaxIndex($wrapper, childSelectorStr) {
  debugger;
  var $target = getLastChild($wrapper, childSelectorStr);
  var dataName = processDom($target);
  return getIndexByStr(dataName);
}

// 获取dom元素属性为data-name对应的值包含的最大索引
window.getIndexByStr = function getIndexByStr(str) {
  if (!str) {
    return -1;
  }
  return Number(str.match(/\[(\d+)\]/)[1]);
}

// 处理dom
window.processDom = function processDom($target) {
  return $target
    .find("[data-name]")
    .eq(0)
    .data("name");
}

/**
 *
 * @param {父元素jquery对象} $wrapper
 * @param {子元素选择器字符串} childSelectorStr
 */
window.getLastChild = function getLastChild($wrapper, childSelectorStr) {
  return $wrapper.children(childSelectorStr).last();
}

// dom ready
$(function () {
  debugger
  var urlParams = window.location.search.substring(1);
  var obj = {};
  urlParams.split("&").forEach(function (item, index) {
    var pm = item.split("=");
    if ($.isArray(pm) && pm.length) {
      obj[pm[0]] = pm[1];
    }
  });
  var houseBillNo = obj.houseBillNo;
  var houseName = decodeURI(obj.houseName);
  var roomStatus = decodeURI(obj.roomStatus)
  // 获取当前房屋几房几厅
  var houseType = decodeURI(obj.houseType)
  var roomId = obj.roomId
  debugger
  if (roomStatus == 1 || roomStatus == 103 || roomStatus == 4) {
    $('#jsLastStepBtn').show()
  } else {
    $('#jsSaveBtn').show()
    $('#jsApprovalBtn').show()
  }
  // 将当前的房源编号,房源名称和房屋的几房几厅几卫存储到body元素里面
  $("body").data("houseOrigin", {
    houseBillNo,
    houseName,
    houseType,
    roomId,
    roomStatus
  });
  // getAllTmplNames();
  getYbInfo(houseBillNo);
  getGoodsInfo(houseBillNo, houseType);
});

// 定义默认的房间、大厅、厨卫数据
const DEFAULT_HOUSE_DATA = ['1.8米床','1.5米床','1.2米床','1.8米床垫','1.5米床垫','1.2米床垫','斗柜','床头柜','梳妆台','梳妆椅','衣柜','挂画','吊灯','台灯','电视机','电视遥控器','落地灯','挂壁式空调','空调遥控器','书桌','书架','书房椅子','窗帘','房间钥匙']
const DEFAULT_HALL_DATA = ['电视机','电视遥控器','电视柜','冷暖空调','挂壁式空调挂机','空调遥控器','二人沙发','三人沙发','二人转角沙发','三人转角沙发','茶几','边几','边椅','单人沙发','吊灯','落地灯','窗帘','挂画','鞋柜','客厅地毯','餐桌','餐桌椅','餐边柜','冰箱(三门)','冰箱(四门)','智能门锁','大门钥匙']
const DEFAULT_KITCHENBATH_DATA = ['抽油烟机','燃气灶','消毒柜','冰箱(四门)','冰箱(三门)','洗衣机(滚筒)','洗衣机(全自动)','晾衣架','强排式热水器']

// 获取房间物品数据
function getHouseData () {
  return getGoodsByType(DEFAULT_HOUSE_DATA, 1)    
}

// 获取大厅物品数据
function getHallData () {
  return getGoodsByType(DEFAULT_HALL_DATA, 2)     
}

// 获取厨卫物品数据
function getKitchenBathData () {
  return getGoodsByType(DEFAULT_KITCHENBATH_DATA, 3)    
}

// 公用获取物品数据
window.getGoodsByType = function getGoodsByType (data, type) {
  if (!Array.isArray(data)) {
    return
  }
  let result = []
  let ftwType = ''
  let houseBillNo = $('body').data('houseOrigin').houseBillNo
  let houseName = $('body').data('houseOrigin').houseName
  switch (type) {
    case 1:
      ftwType = '房间'
      break
    case 2:
      ftwType = '客厅'
      break
    case 3:
      ftwType = '厨卫'
      break
  }
  data.forEach((goodsName, index) => {
    const defaultObj = {
      houseBillNo,
      houseName,
      goodsName,
      count: 0,
      brand: '',
      modelNum: '',
      ftwType
    }
    result.push(defaultObj)
  })
  return result
}

// 新的添加物品
/**
 * 
 * @param {dom容器} $container 
 * @param {对应模板} $tmpl 
 */
window.addNewGoods = function addNewGoods(target, type) {
  let $target = $(target)
  let $container = $target.closest('.js-goods').siblings('.js-goods-wrapper')
  let $tmpl = $('#goodsSelectTmpl')
  let data = {
    index: ++DEFAULT_INDEX,
    ftwType: type
  }
  $container.append(
    __gberp.tmpl.render($tmpl.html(), {
      data: data
    },{})
  );          
}

// 提交审批
window.submitApproval = function submitApproval() {
  let { roomId:billNo, houseBillNo } = $("body").data("houseOrigin")
  $.post(`/hbHouseSale/saveSysSignedResult?billNo=${billNo}&houseBillNo=${houseBillNo}`).then(result => {
    // 跳转页面
    window.location.href = `/hbHouse/toEdit/notout?billNo=${houseBillNo}`
  }, error => {
    console.log('审批出错：\r\n', error)
  })
}

// 上一步
window.lastStep = function lastStep() {
  let { houseBillNo, roomStatus, houseName } = $("body").data("houseOrigin")
  window.location.href = `/hbHouseSale/toContrcatInfoSale?houseBillNo=${houseBillNo}&houseName=${encodeURI(houseName)}&roomStatus=${Number(roomStatus)}`
}
