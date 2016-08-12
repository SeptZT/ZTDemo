/*----------------------------------------

     * 使用 js 标记高亮关键词

     * 参数说明:

     * obj: jquery对象, 要进行高亮显示的html标签节点.

     * keywords: 字符串, 要进行高亮的关键词词, 使用 竖杠(|)或空格 分隔多个词 .

     * cssClass: 字符串, 定义关键词突出显示风格的css伪类.

     * 参考资料: javascript HTML DOM 高亮显示页面特定字词 By shawl.qiu

----------------------------------------*/

function MarkHighLight(obj,keywords,cssClass){



    keywords=AnalyzeHighLightWords(keywords);



    if(obj==null || keywords.length==0)

        return;

    if(cssClass==null)

        cssClass="highlight";

    //遍历jquery对象
    $.each(obj, function(k,v){
        // console.log(v);
        MarkHighLightCore(v,keywords);
    })

    //------------执行高亮标记的核心方法----------------------------

    function MarkHighLightCore(obj,keyWords){

        var re=new RegExp(keyWords, "i");



        //console.log(obj.childNodes);

        for(var i=0; i<obj.childNodes.length; i++){

            var childObj=obj.childNodes[i];

            if(childObj.nodeType==3){

                if(childObj.data.search(re)==-1)continue;



                var reResult=new RegExp("("+keyWords+")", "gi");

                var objResult=document.createElement("span");

                objResult.innerHTML=childObj.data.replace(reResult,"<span class='highlight'>$1</span>");

                // console.log('found:' + RegExp.$1);



                if(childObj.data==objResult.innerHTML) continue;

                obj.replaceChild(objResult,childObj);

            }else if(childObj.nodeType==1){

                MarkHighLightCore(childObj,keyWords);

            }

        }

    }

}

//----------分析关键词----------------------

function AnalyzeHighLightWords(keywords){

    if(keywords==null || keywords=='') return "";

    //keywords=keywords.replace(/\s+/g,"|").replace(/\|+/g,"|");//替换不可见字符为|

    //keywords=keywords.replace(/(^\|*)|(\|*$)/g, "");

    keywords=keywords.replace(/(^ +)|( +$)/g, "").replace(/ +/g, " ");//去掉首位空格，然后去掉关键词直接的多余空格，只保留一个

    //if(keywords.length==0) return "";

    var wordsArr=keywords.split(" ");

    if(wordsArr.length>1){

        var resultArr=wordsArr;

        var result="";

        for(var i=0;i<resultArr.length;i++){

            result += "|"+resultArr[i];

        }

        return result.replace(/(^\|*)|(\|*$)/g, "");

    }else{

        return keywords;

    }

}



/*************关键词匹配**********************************/

function key_middle(str, keywords){

    var keyWords = AnalyzeHighLightWords(keywords);

    var re = new RegExp("("+keyWords+")", "gi");

    var m = str.search(re);

    if((m >= 0) && (m - 100 > 0)){

            return str = '...' + str.substr(m - 100);

    } else {

        return str;

    }

}
/*使用
 * MarkHighLight($('#wapper'),$('.search input').val());
 * */

// function MarkHighLight(obj,keyword)

// {

//     var pucl = obj;//document.getElementById(idVal);

//     if("" == keyword) return;

//     var temp=pucl.innerHTML;

//     var htmlReg = new RegExp("\<.*?\>","i");

//     var arrA = new Array();

//     //替换HTML标签

//     // for(var i=0;true;i++)

//     // {

//     //     var m=htmlReg.exec(temp);

//     //     if(m)

//     //     {

//     //         arrA[i]=m;

//     //     }

//     //     else

//     //     {

//     //         break;

//     //     }

//     //     temp=temp.replace(m,"{[("+i+")]}");

//     // }

//     words = decodeURI(keyword.replace(/\+/g,' ')).split(/\s+/);

//     //替换关键字

//     for (w=0;w<words.length;w++)

//     {

//         var r = new RegExp("("+words[w].replace(/[(){}.+*?^$|\\\[\]]/g, "\\$&")+")","ig");

//         temp = temp.replace(r,"<span style='background:yellow;'>$1</span>");

//     }

//     //恢复HTML标签

//     // for(var i=0;i<arrA.length;i++)

//     // {

//     //     temp=temp.replace("{[("+i+")]}",arrA[i]);

//     // }

//         pucl.innerHTML=temp;

// }