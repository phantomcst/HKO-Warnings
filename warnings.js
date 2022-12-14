function warning_type(code) {
    if (code == "WFIRE" || code == "WTCSGNL" || code == "WRAIN") return -1;
    else if (code == "WFROST") return "霜凍警告";
    else if (code == "WHOT") return "酷熱天氣警告";
    else if (code == "WCOLD") return "寒冷天氣警告";
    else if (code == "WMSGNL") return "強烈季候風信號";
    else if (code == "WTCPRE8") return "預警八號熱帶氣旋警告信號之特別報告";
    else if (code == "WFNTSA") return "新界北部水浸特別報告";
    else if (code == "WL") return "山泥傾瀉警告";
    else if (code == "WTMW") return "海嘯警告";
    else if (code == "WTS") return "雷暴警告";
}
function warning_subtype(subcode) {
    if (subcode == "WFIREY") return "黃色火災危險警告";
    else if (subcode == "WFIRER") return "紅色火災危險警告";
    else if (subcode == "WRAINA") return "黃色暴雨警告信號";
    else if (subcode == "WRAINR") return "紅色暴雨警告信號";
    else if (subcode == "WRAINB") return "黑色暴雨警告信號";
    else if (subcode == "TC1") return "一號戒備信號";
    else if (subcode == "TC3") return "三號強風信號";
    else if (subcode == "TC8NE") return "八號東北烈風或暴風信號";
    else if (subcode == "TC8SE") return "八號東南烈風或暴風信號";
    else if (subcode == "TC8SW") return "八號西南烈風或暴風信號";
    else if (subcode == "TC8NW") return "八號西北烈風或暴風信號";
    else if (subcode == "TC9") return "九號烈風或暴風風力增強信號";
    else if (subcode == "TC10") return "十號颶風信號";
    else if (subcode == "CANCEL") return "所有熱帶氣旋警告信號取消";
}
function format_time(timestamp, addDate) {
    var result = "";

    //day
    if (addDate) {
        var diffDays = new Date().getDate() - timestamp.getDate();
        var diffMonths = new Date().getMonth() - timestamp.getMonth();
        var diffYears = new Date().getFullYear() - timestamp.getFullYear();
        if (diffYears == 0 && diffDays == 0 && diffMonths == 0)
            result += "今天";
        else if (diffDays == 1)
            result += "昨天";
        else if (diffYears != 0)
            result += `${timestamp.getFullYear()} 年 ${timestamp.getMonth()+1} 月 ${timestamp.getDate()} 日`;
        else
            result += `${timestamp.getMonth()+1} 月 ${timestamp.getDate()} 日`;
    }

    //hour
    var hour = timestamp.getHours();
    if (hour >= 13)
        result += `下午 ${hour-12} 時 `;
    else if (hour == 12)
        result += "中午 12 時 ";
    else if (hour == 0)
        result += "上午 12 時 ";
    else
        result += `上午 ${hour} 時 `;

    //min
    var min = timestamp.getMinutes();
    if (min <= 9)
        result += `0${min} 分`;
    else
        result += `${min} 分`;

    return result;
}

async function warnings() {
    let warningDetailsURL = 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=warningInfo&lang=tc';
    let warningSummaryURL = 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=warnsum&lang=tc';
    //let warningDetailsURL = 'test_data/test_data_tc.json';
    let warningDetailsObject = await (await fetch(warningDetailsURL)).json();
    let warningSummaryObject = await (await fetch(warningSummaryURL)).json();


    // ---------- Warning Count ----------
    var warningCount = 0;
    for (var key in warningSummaryObject) {
        if (warningSummaryObject.hasOwnProperty(key) && warningSummaryObject[key]["actionCode"] != "CANCEL") {
            warningCount++;
        }
    }
    if (warningCount == 0) document.getElementById("summary").innerHTML = `現時沒有生效警告`;
    else document.getElementById("summary").innerHTML = `現時有 ${warningCount} 個生效警告`;
   

    // ---------- Page Refresh Time ----------
    document.getElementById("refresh").innerHTML = `頁面最後更新：${format_time(new Date(), false)}`;


    // ---------- Warning Details ----------
    // create in force warnings array
    const warningsArray = [];
    for (var key in warningSummaryObject) {
        if (warningSummaryObject.hasOwnProperty(key) && warningSummaryObject[key]["actionCode"] != "CANCEL") {
            warningsArray.push(key);
        }
    }

    for (var i = 0; i < warningCount; i++) {
        // get warning details object
        var loopWarningDetailsObj;
        for (var j = 0; j < warningDetailsObject["details"].length; j++) {
            if (warningDetailsObject["details"][j]["warningStatementCode"] == warningsArray[i]) {
                loopWarningDetailsObj = warningDetailsObject["details"][j];
            }
        }

        // create warning box
        const box = document.createElement("section");
        box.id = `warn-${i}`;
        box.classList.add("warn");
        document.getElementById("warn-wrap").appendChild(box);

        // set icon image
        const icon = document.createElement("img");
        if (loopWarningDetailsObj["subtype"]) icon.src = `img/${loopWarningDetailsObj["subtype"]}.jpeg`;
        else icon.src = `img/${loopWarningDetailsObj["warningStatementCode"]}.jpeg`;
        document.getElementById(`warn-${i}`).appendChild(icon);
        icon.classList.add("warn-icon-img");

        // create warning text box
        const node = document.createElement("div");
        document.getElementById(`warn-${i}`).appendChild(node);
        node.id = i;
        node.classList.add("warn-text");

        // set warning name
        const warn_name = document.createElement("span");
        var warning_name = warning_type(loopWarningDetailsObj["warningStatementCode"]);
        if (warning_name == -1) warning_name = warning_subtype(loopWarningDetailsObj["subtype"]);
        warn_name.innerHTML = warning_name;
        warn_name.classList.add("block-title");
        node.appendChild(warn_name);

        // set warning update time
        const update = document.createElement("p");
        update.innerHTML = `${format_time(new Date(loopWarningDetailsObj["updateTime"]), true)}更新`;
        document.getElementById(i).appendChild(update);
        update.classList.add("warn-update-time");

        // set warning content
        const warn_content_wrap = document.createElement("div");
        warn_content_wrap.classList.add("warn-content-wrap");
        node.appendChild(warn_content_wrap);
        //var collapsable_title = false;
        //const collapsable = document.createElement("details");
        for (var k = 0; k < loopWarningDetailsObj["contents"].length; k++) {
            // if (loopWarningDetailsObj["contents"][k].includes("－防風措施報告：") && !collapsable_title) {
            //     collapsable_title = true;
            //     const summary = document.createElement("summary");
            //     summary.innerHTML = loopWarningDetailsObj["contents"][k];
            //     collapsable.appendChild(summary);
            //     warn_content_wrap.appendChild(collapsable);
            // } else if (collapsable_title) {
            //     const para = document.createElement("p");
            //     para.innerHTML = loopWarningDetailsObj["contents"][k];
            //     collapsable.appendChild(para);
            // } else {
            //     const para = document.createElement("p");
            //     para.innerHTML = loopWarningDetailsObj["contents"][k];
            //     warn_content_wrap.appendChild(para);
            // }
            const para = document.createElement("p");
            para.innerHTML = loopWarningDetailsObj["contents"][k];
            warn_content_wrap.appendChild(para);
        }
    }
}
warnings();

async function swt() {
    let url = 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=swt&lang=tc';
    //let url = 'test_data/test_data_swt.json';
    let obj = await (await fetch(url)).json();
    //console.log(obj);

    if (obj["swt"].length != 0) {
        document.getElementById("swt-wrap").style.display = "block";
        for (var i = 0; i < obj["swt"].length; i++) {
            const swt_source = obj["swt"][i];
    
            const tips_wrap = document.createElement("p");
            document.getElementById("swt-list").appendChild(tips_wrap);

            const update = document.createElement("p");
            update.innerHTML = `${format_time(new Date(swt_source["updateTime"]), true)}更新`;
            tips_wrap.appendChild(update);
            update.classList.add("swt-update-time");

            const tips_text = document.createElement("li");
            tips_text.innerHTML = `${swt_source['desc']}`;
            tips_wrap.appendChild(tips_text);
        }
    }
}
swt();

//Dark Mode
//initial
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add("dark");
}
//watch for changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (event.matches) {
        document.body.classList.add("dark");
    } else {
        document.body.classList.remove("dark");
    }
});