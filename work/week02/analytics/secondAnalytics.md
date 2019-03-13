# 2주차 분석과제 목차

# inputSetValueAuto
- 서버에서 받아온 값을 form element 에 지정할 경우 `inputSetValueAuto` 함수를 사용한다.
## 코드
```js
/**
 * element 에 포맷에 맞게 값을 세팅
 */
function inputSetValueAuto(input, str, data_format, default_value, deReplaceXssYn)
{
    var orgInput = input;
    // input의 ID를 받아 저장함

    input = returnjQueryObj(input);
    // (typeof element == "string" && element != "") ?  $("#"+element) : $(element);
    // input 태그는 객체이므로 input 자신을 가리킨다.
    // $(this)

    if ( input.length == 0 ) alert("inputSetValueAuto: input("+input+","+orgInput+") is not defined...");
    // input 태그가 없다면 경고창을 띄운다.

    if ( default_value != null && (str == null || str == "")) str = default_value;
    // default_value에 값이 있고 str에 값이 없으면 str은 default_value로 대치한다.

    if(deReplaceXssYn=="Y")
    // deReplaceXssYn 값을 받고 해당 값이 Y이면 str을 replaceAll 하는 함수를 실행하여 반환한다.
    {
        str = deReplaceXss(str);
        // var valueRst = value;
        // valueRst = valueRst.replaceAll("&#35;", "#");
        // return valueRst;
    }

    switch ( input.prop("tagName") )
    // 태그명을 가져온다. 임의의 태그명을 가져오는 것은 불가능하나, prop() 함수를 사용하면 가능하다.
    {
        case "SELECT": input.val(str).attr2("selected", true); break;
        // 태그명이 SELECT라면 val이 str인 input 태그의 "selected" 속성값을 true로 바꾸고 switch 문을 종료한다.

        case "INPUT":
        {
            if ( array_indexOf(["radio"], input.attr2("type")  ) >=0 ){
                input.attr("checked", input.val() == str);
                // 
            }else if ( array_indexOf(["checkbox"], input.attr2("type")  ) >=0 ){
                input.prop("checked", input.val() == str);
                // 
            }else if ( input.attr2("data_format") ){
                inputSetFormatValue(input, str, input.attr2("data_format"));
                // 
            }else{
                input.val(str);
                // input의 value를 str로 설정하고 종료한다.
            }
        }
            break;
        default: input.val(str); break;
        // SELECT, INPUT이 아니라면 input의 value는 str로 설정하고 종료한다.
    }

}
```


# inputAutoUnformat
- 화면에는 포맷된 상태로 보이지만 서버에서는 포맷 안된 형태로 데이터가 저장되어야 한다. 서버 전송 이벤트 전에 inputAutoUnformat 함수로 F_ 로 시작되는 엘리먼트 값을 S_ 로 시작되는 동일 이름의 엘리먼트를 만들어 포맷 안된 값을 저장하고 전송한다. S_ 시작되는 엘리먼트가 없으면 inputAutoUnformat 함수에서 자동으로 생성한다.
- `F_`로 시작한 element는 서버에 데이터 전송전에 unformat하는 inputAutoUnformat() 함수를 호출하여, 서버에 `S_`로 시작하는 데이터를 전송한다. 따라서 inputAutoUnformat() 함수를 사용할땐 doAction() 함수 최상단에서 호출한다.
- Sheet의 savename과 구분하기 위해 [S_]첨자를 붙인다.
  - > 예) `<input type=text id="S_EMP_ID" name="S_EMP_ID">`
- 날짜, 금액처럼 포멧이 지정된 Input element는 [F_]로 시작한다.
- [F_]로 시작한 element는 서버에 데이터 전송전에 unformat하는 inputAutoUnformat() 함수를 호출하여, 서버에 [S_]로 시작하는 데이터를 전송한다. 따라서 inputAutoUnformat() 함수를 사용할땐 doAction() 함수 최상단에서 호출한다.
- 서버에서 온 포맷 안된 값을 element 에 지정할 때는 inputSetValueAuto 함수를 사용한다. 자동으로 element 의 data_format 에 따라 포매팅 된 값을 세팅해준다.

<br>

## 코드
```js
/**
 * F_ format element 를 자동으로 원래값이 들어간 S_ hidden element 생성
 */
function inputAutoUnformat(form, f, s)
// doAction이 실행되면 거의 같이 동작함.

{
    form = ($(form).length > 0)? $(form) : $("form").first();
    // form 파라미터 값이 없다면 첫번째 form을 대입한다.
    f = f == null ? "F" : f;
    // f 파라미터 값이 없다면 "F"를 대입한다.
    s = s == null ? "S" : s;
    // s 파라미터 값이 없다면 "S"를 대입한다.
    var f_ = f + "_";
    // f 변수 값을 "F_"로 변환한다.
    var s_ = s + "_";
    // s 변수 값을 "S_"로 변환한다.
    var s_name;

    $("#"+form.prop("id")+" input[id^='" + f_ + "']").each(function(index){
        // 
        s_name = s_ + $(this).attr("id").substr(f_.length);

        if($("#" + s_name).length == 0){
            var tmpHidden = $("<input type='hidden' id='" + s_name + "' name='" + s_name + "' />");
            form.append(tmpHidden);
        }

        $("#" + s_name).val(getNormalValue($(this)));
    });


    //multi-combobox F_ 의 value 가 아닌 val() 를 hidden에 2016.10.13
    $("#"+form.prop("id")+" select[id^='" + f_ + "']").each(function(index){

        s_name = s_ + $(this).attr("id").substr(f_.length);
        if($("#" + s_name).length == 0){
            var tmpHidden = $("<input type='hidden' id='" + s_name + "' name='" + s_name + "' />");
            form.append(tmpHidden);
        }
        $("#" + s_name).val($(this).val());
    });
}
```

<br>

# 부록
## attr2() 함수
```js
  attr2: function( name ) {
    var $tmp;
    if(name!=undefined && name!=null )
    {
      $tmp = $(this).attr(name);
    }
    return ($tmp == undefined)? "" : $tmp;
```
- attr2(name)의 name이라는 속성 키가 가지는 값을 반환하는 함수

<br>

## array_indexof()
```js
/**
 * 배열(array)내의 (val)값의 index 위치를 반환
 */
function array_indexOf(array, val)
{
    // array 속성과 비교 값을 받음
    for ( var n = 0; n < array.length; n++ )
    {
    // 태그 속성의 값들만큼 반복문을 돌림
        if ( array[n] == val )
        // 반복 중 비교 값과 일치하는 태그 속성의 값이 있다면
        {
            return n;
            // 해당 인덱스를 반환
        }
    }

    return -1;
    // 없다면 -1을 반환
}
```

## inputSetFormatValue()
```js
/**
 * element 에 str 을 data_format 에 맞게 세팅한다.
 * @param input
 * @param str
 * @param data_format default 는 input 의 data_format
 * @return
 */
function inputSetFormatValue(input, str, data_format)
{
  input = returnjQueryObj(input);
  input.val( formatValue(str, data_format || input.attr2("data_format")) );
}
```

## formatValue()
```js
/**
 * 문자열 포매팅
 * @param str
 * @param data_format
 * @param point_count
 * @return
 */
function formatValue(str, data_format, point_count)
{
  if(str == null) return "";
  if(typeof str == "number") str = str.toString();
  
  var rv = "";
  switch ( data_format )
  {
    case "dfDateYy":  rv = formatValueMask(str, "####"); break;
    case "dfDateMm":  rv = formatValueMask(str, "##"); break;
    case "dfDateYmd": rv = formatValueMask(str, "####.##.##"); break;
    case "dfDateYmd1": rv = formatValueMask(str, "####.##.##"); break;
    case "dfDateYm":  rv = formatValueMask(str, "####.##"); break;
    case "dfDateMd":  rv = formatValueMask(str, "##.##"); break;
    case "dfTimeHms": rv = formatValueMask(str, "##:##:##"); break;
    case "dfTimeHm":  rv = formatValueMask(str, "##:##"); break;
    case "dfTimeYmdhms":  rv = formatValueMask(str, "####.##.## ##:##:##"); break;
    case "dfIdNo":    rv = formatValueMask(str, "######-#######"); break;
    case "dfSaupNo":  rv = formatValueMask(str, "###-##-#####"); break;
    case "dfCardNo":  rv = formatValueMask(str, "####-####-####-####"); break;
    case "dfPostNo":  rv = formatValueMask(str, "###-###"); break;
    case "dfCorpNo":  rv = formatValueMask(str, "######-#######"); break;
    case "dfIssueNo": rv = formatValueMask(str, "####-######"); break;
    case "dfNo":      rv = str.replace(/\D/g, ""); break;
    case "dfInteger+":rv = formatComma(str.replace(/\D/g, "")); break;
    case "dfInteger1":rv = formatComma(str.replace(/\D/g, "")); break;
    case "dfInteger":
    {
      var sign = str.substr(0, 1) == "-" ? "-" : "";
      rv = sign + formatComma(str.replace(/\D/g, ""));
    }
    break;
    case "dfFloat+":
    {
      var pointidx = str.indexOf(".");
      var pointbelow = ( pointidx >= 0 ) ? "."+ str.substr(pointidx).replace(/\D/g, "") : "";
      var numvalue = formatComma(str.substr(0, pointidx >= 0 ? pointidx : str.length).replace(/\D/g, ""));
      if ( point_count != null)
      {
        numvalue = numvalue == "" ? "0" : numvalue;
        pointbelow = rpad(pointbelow || ".", point_count+1, "0");
      }
      rv = numvalue + pointbelow;
    }
    break;
    case "dfFloat":
    {
      var sign = str.substr(0, 1) == "-" ? "-" : "";
      var pointidx = str.indexOf(".");
      var pointbelow = ( pointidx >= 0 ) ? "."+str.substr(pointidx).replace(/\D/g, "") : "";
      var numvalue = formatComma(str.substr(0, pointidx >= 0 ? pointidx : str.length).replace(/\D/g, ""));
      if ( point_count != null)
      {
        numvalue = numvalue == "" ? "0" : numvalue;
        pointbelow = rpad(pointbelow || ".", point_count+1, "0");
      }
      rv = sign + (sign && pointbelow && ! numvalue ? "0" : numvalue) + pointbelow;
    }
    break;
    //case "dfEmail":
    default:          rv = str; break;
  }
  return rv;
}
```
## formatValueMask()
```js
/**
 * 형식화된 숫자 문자열을 포매팅
 * @param str
 * @param format
 * @return
 */
function formatValueMask(str, format)
{
  var rv = "";
  var numcount = countChr(format, '#');
  str = str.replace(/\D/g, "").substr(0, numcount);
  var chrAt;
  var validx = 0;
  for ( var n = 0; n < format.length; n++ )
  {
    chrAt = format.charAt(n);
    rv += ( chrAt == '#' ) ? str.charAt(validx++) : chrAt;
    if ( validx >= str.length ) break;
  }
  return rv;
}
```


## countChr()
```js
/**
 * 문자열에서 chr 포함 갯수
 * @param str
 * @param chr
 * @return
 */
function countChr(str, chr)
{
  var count = 0;
  var length = str.length;
  for ( var n = 0; n < length; n++ )
  {
    if ( chr == str.charAt(n) ) count++;
  }
  return count;
}
```
## val2()
```js
  /**
   * 
   * @member jQuery
   * @method val2
   * @param 
   * @return 
   */
  val2: function( value ) {
    var hooks, ret, isFunction,
      elem = this[0];
    var rreturn = /\r/g;

    if ( !arguments.length ) {
      if ( elem ) {
        hooks = jQuery.valHooks[ elem.nodeName.toLowerCase() ] || jQuery.valHooks[ elem.type ];

        if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined && (ret = hooks.get( elem, "value" )) !== "undefined" ) {
          return ret;
        }

        ret = elem.value;

        return typeof ret === "string" ?
          // handle most common string cases
          ret == "undefined" ? "" : ret.replace(rreturn, "") :
          // handle cases where value is null/undef or number
          ret == null ? "" : ret;
      }

      return "";
    }


    isFunction = jQuery.isFunction( value );

    return this.each(function( i ) {
      var self = jQuery(this), val;

      if ( this.nodeType !== 1 ) {
        return "";
      }

      if ( isFunction ) {
        val = value.call( this, i, self.val() );
      } else {
        val = value;
      }

      // Treat null/undefined as ""; convert numbers to string
      if ( val == null ) {
        val = "";
      } else if ( typeof val === "number" ) {
        val += "";
      } else if ( jQuery.isArray( val ) ) {
        val = jQuery.map(val, function ( value ) {
          return value == null ? "" : value + "";
        });
      }

      

      hooks = jQuery.valHooks[ this.nodeName.toLowerCase() ] || jQuery.valHooks[ this.type ];

      // If set returns undefined, fall back to normal setting
      if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
        this.value = val;
      }
    });
  }
```


---



- 서버에서 온 포맷 안된 값을 element 에 지정할 때는 inputSetValueAuto 
함수를 사용한다. 자동으로 element 의 data_format 에 따라 포매팅 된 값을 
세팅해준다.
