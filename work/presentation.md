```js
function applyElementSessionCon()
{
    var $parentDocument = $(parent.document);
    if($parentDocument.find("iframe[processIframe=Y]").length <= 0)
    {
        return;
    }

    $("input, select").filter("[sessionCondition=Y]").each(function(index)
    {
        var id = $(this).attr("id");
        setSearchConditionValue($parentDocument, id);
        var moduleId = Page.MODULE_ID;
        var html = "<input class='btn_auto_cal' type='button' targetId='"+$(this).attr("id")+"' onclick=\"SessionConditionUtil.add('"+id+"','"+moduleId+"');\" ></input>";
        if($("#"+id).next().is("img") || $("#"+id).next().is("input[type=button]") || $("#"+id).attr("multiple") == "multiple")
        {
            $(html).insertAfter($(this).next());
        }
        else
        {
            $(html).insertAfter(this);
        }
    });
}
```