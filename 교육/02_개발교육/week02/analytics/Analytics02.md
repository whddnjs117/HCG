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
                // ["radio"] 유사 배열 객체 중 input.attr2("type") 에 해당하는 값이 있는가?
                input.attr("checked", input.val() == str);
                // 존재한다면 input 객체의 checked 속성을 true로 변환한다.
            }else if ( array_indexOf(["checkbox"], input.attr2("type")  ) >=0 ){
                // ["checkbox"] 유사 배열 객체 중 input.attr2("type") 에 해당하는 값이 있는가?
                input.prop("checked", input.val() == str);
                // 존재한다면 input 객체의 checked 속성을 true로 변환한다.
            }else if ( input.attr2("data_format") ){
                inputSetFormatValue(input, str, input.attr2("data_format"));
                // input 객체 중 data_format의 값이 true라면 input의 값을 변환하는 함수를 실행한다.

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
        // 최초 #+form.prop("id")의 자식 input 개체 중 F_로 시작되는 모든 개체를 반복하며 수행
        s_name = s_ + $(this).attr("id").substr(f_.length);
        // this의 id 속성에서 f_의 길이부터 시작한 모든 문자열을 가져와 s_와 결합하여 저장
        if($("#" + s_name).length == 0){
        // s_name을 id로 가지는 개체가 존재하지 않으면
            var tmpHidden = $("<input type='hidden' id='" + s_name + "' name='" + s_name + "' />");
            // 해당 이름을 id로 가지는 hidden 타입의 input 태그 생성
            form.append(tmpHidden);
            // 생성된 input 태그를 form에 추가
        }

        $("#" + s_name).val(getNormalValue($(this)));
        // $(this) 객체의 format 전의 원 데이터로 재포맷을 거치고 저장함
        
        // getNormalValue 내부의 restoreValue는 data_format에 지정된 형태의 값이 존재하면
        // 정규표현식을 통해 문자열변환 후 반환한다.
        // data_format이 없거나 주어지는 나머지 파라미터도 존재하지 않으면 ""을 반환한다.
    });


    //multi-combobox F_ 의 value 가 아닌 val() 를 hidden에 2016.10.13
    // 위와 같음
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
  // input은 객체이므로 $(this)를 input 객체에 바인딩한다.
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
  // 입력받은 str 파라미터가 null이면 공백을 리턴한다.
  if(typeof str == "number") str = str.toString();
  // 입력받은 str 파라미터가 number 깁존 타입이라면 str을 String으로 변환해 반환한다.
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
    // case 라면, formatValueMask를 통해 숫자 문자열을 변환하여 저장하고 종료한다.
    case "dfNo":      rv = str.replace(/\D/g, ""); break;
    // case 라면, 정규표현식 적용, "문자열 내의 모든 숫자를 제외한 문자"를 공백으로 치환하고 저장 후 종료한다.
    case "dfInteger+":rv = formatComma(str.replace(/\D/g, "")); break;
    // 숫자 문자열에 , 를 붙인다.
    case "dfInteger1":rv = formatComma(str.replace(/\D/g, "")); break;
    case "dfInteger":
    {
      var sign = str.substr(0, 1) == "-" ? "-" : "";
      // str의 처음 문자가 - 라면 - 그대로 적용하고, 아니면 제거한다.
      rv = sign + formatComma(str.replace(/\D/g, ""));
      // rv는 sign값에 숫자 문자열에 , 를 붙여 반환한 값을 더하여 저장한다.
    }
    break;
    case "dfFloat+":
    // 실수형 값 변환
    {
      var pointidx = str.indexOf(".");
      // . 이 들어가는 인덱스의 값을 저장한다.
      var pointbelow = ( pointidx >= 0 ) ? "."+ str.substr(pointidx).replace(/\D/g, "") : "";
      // .이 음수가 아니라면 . 에 str을 변환하여 추가하고, 아니라면 비어있는 값을 반환한다.
      var numvalue = formatComma(str.substr(0, pointidx >= 0 ? pointidx : str.length).replace(/\D/g, ""));
      // 숫자 문자열에 , 를 더하는 함수를 수행한다.
      if ( point_count != null)
      {
        numvalue = numvalue == "" ? "0" : numvalue;
        pointbelow = rpad(pointbelow || ".", point_count+1, "0");
        // 문자열(str)의 길이가 (size)가 되도록 왼쪽부터 (padc)문자식으로 채운 표현식을 반환
        // (str)문자열을 (size)길이만큼 (padc)문자열로 (LR)좌우 패딩
      }
      rv = numvalue + pointbelow;
    }
    break;
    case "dfFloat":
    // 실수형 값 변환
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
  // # 의 갯수를 카운트하여 반환

  str = str.replace(/\D/g, "").substr(0, numcount);
  // 정규표현식 적용, "문자열 내의 모든 숫자를 제외한 문자"를 공백으로 치환하고
  // 문자열의 처음부터 numcount에 해당하는 인덱스를 잘라 str 변수에 저장한다.

  var chrAt;
  var validx = 0;
  for ( var n = 0; n < format.length; n++ )
  {
    chrAt = format.charAt(n);
    // 입력받은 format의 n에 해당하는 문자를 저장하고
    rv += ( chrAt == '#' ) ? str.charAt(validx++) : chrAt;
    // charAt이 #이라면 str의 validx에 해당하는 문자를 추가하고
    // 아니라면 숫자만 추가한다.

    if ( validx >= str.length ) break;
    // validx 가 str의 길이보다 커지면 해당 반복문을 종료한다.
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
        // 
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

## formatComma()
```js
/**
 * 숫자 문자열에 ,(콤마)
 * @param numstr
 * @return
 */
function formatComma(numstr)
{
  numstr = deletePrecedingZero(numstr.replace(/\D/g, ""));
  // 정규표현식 적용, "문자열 내의 모든 숫자를 제외한 문자"를 공백으로 치환한 후에 선행하는 0을 제거한다.
  var rv = "";
  var idx = 0;
  for ( var n = numstr.length - 1; n >= 0; n-- )
  {
    if ( idx != 0 && idx % 3 == 0 ) rv = "," + rv;
    // idx 가 0이 아니고 3으로 나누어 떨어지면 rv 앞에 콤마를 추가한다.
    rv = numstr.charAt(n) + rv;
    // rv는 numstr의 n번째 문자에 rv를 더하여 저장한다.
    idx++;
  }
  return rv;
}
```


## deletePrecedingZero()
```js
/**
 * 선행하는 0 제거
 * @param numstr
 * @return
 */
function deletePrecedingZero(numstr)
{
  var replaced = numstr.replace(/^0+/, "");
  // 입력받은 numstr 중에 0이 있다면 제거하고 저장한다.
  return numstr && ! replaced ? "0" : replaced;
  // numstr이 없고 replaced가 없다면 0을 반환하고, 둘 중에 하나라도 아니라면 replaced를 반환한다.
}
```


---



- 서버에서 온 포맷 안된 값을 element 에 지정할 때는 inputSetValueAuto 
함수를 사용한다. 자동으로 element 의 data_format 에 따라 포매팅 된 값을 
세팅해준다.
