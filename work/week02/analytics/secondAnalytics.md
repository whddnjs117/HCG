# 2주차 분석과제 목차

# inputSetValueAuto
## 코드
```js
/**
 * element 에 포맷에 맞게 값을 세팅
 */
function inputSetValueAuto(input, str, data_format, default_value, deReplaceXssYn)
{
    var orgInput = input;
    input = returnjQueryObj(input);
    // (typeof element == "string" && element != "") ?  $("#"+element) : $(element);

    if ( input.length == 0 ) alert("inputSetValueAuto: input("+input+","+orgInput+") is not defined...");
    if ( default_value != null && (str == null || str == "")) str = default_value;
    str = String(str);

    if(deReplaceXssYn=="Y")
    {
        str = deReplaceXss(str);
        // var valueRst = value;
        // valueRst = valueRst.replaceAll("&#35;", "#");
        // return valueRst;
    }

    switch ( input.prop("tagName") )
    // tagName의 속성값을 가져온다.
    {
        case "SELECT": input.val(str).attr2("selected", true); break;
        case "INPUT":
        {
            if ( array_indexOf(["radio"], input.attr2("type")  ) >=0 ){
                input.attr("checked", input.val() == str);
            }else if ( array_indexOf(["checkbox"], input.attr2("type")  ) >=0 ){
                input.prop("checked", input.val() == str);
            }else if ( input.attr2("data_format") ){
                inputSetFormatValue(input, str, input.attr2("data_format"));
            }else{
                input.val(str);
            }
        }
            break;
        default: input.val(str); break;
    }

}
```


# inputAutoUnformat
## 코드
```js
/**
 * F_ format element 를 자동으로 원래값이 들어간 S_ hidden element 생성
 */
function inputAutoUnformat(form, f, s)
{
    form = ($(form).length > 0)? $(form) : $("form").first();
    f = f == null ? "F" : f;
    s = s == null ? "S" : s;
    var f_ = f + "_";
    var s_ = s + "_";
    var s_name;

    $("#"+form.prop("id")+" input[id^='" + f_ + "']").each(function(index){
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