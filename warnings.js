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
}
function format_time_min(min) {
    if (min <= 9) return "0" + min;
    else return min;
}
function format_time_hour(hour) {
    if (hour >= 13) return "下午 " + `${hour-12}`;
    else return "上午 " + `${hour}`;
}

async function load() {
    let url = 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=warningInfo&lang=tc';
    let obj = await (await fetch(url)).json();
    //console.log(obj);
    try {
        document.getElementById("summary").innerHTML = `現時有 ${obj["details"].length} 個生效警告`;
    }
    catch {
        document.getElementById("summary").innerHTML = `現時沒有生效警告`;
    }
    let now = new Date();
    document.getElementById("refresh").innerHTML = `頁面更新於${format_time_hour(now.getHours())} 時 ${format_time_min(now.getMinutes())} 分`;
    for (var i = 0; i < obj["details"].length; i++) {
        const warn_obj = obj["details"][i];

        const box = document.createElement("section");
        box.id = `box-${i}`;
        document.getElementById("icon").appendChild(box);

        //Icon image
        const icon = document.createElement("img");
        if (warn_obj["subtype"]) icon.src = `img/${warn_obj["subtype"]}.png`;
        else icon.src = `img/${warn_obj["warningStatementCode"]}.png`;
        document.getElementById(`box-${i}`).appendChild(icon);
        icon.classList.add("icon-img");

        //Warning name
        const node = document.createElement("div");
        var warning_name = warning_type(warn_obj["warningStatementCode"]);
        if (warning_name == -1) warning_name = warning_subtype(warn_obj["subtype"]);
        node.innerHTML = warning_name;
        document.getElementById(`box-${i}`).appendChild(node);
        node.id = i;
        node.classList.add("text");

        //Content
        for (var k = 0; k < warn_obj["contents"].length; k++) {
            const para = document.createElement("p");
            para.innerHTML = warn_obj["contents"][k];
            document.getElementById(i).appendChild(para);
        }

        //Update
        const update_time = new Date(warn_obj["updateTime"]);
        const update = document.createElement("p");
        update.innerHTML = `以上天氣稿由天文台於${format_time_hour(update_time.getHours())} 時 ${format_time_min(update_time.getMinutes())} 分發出`;
        document.getElementById(i).appendChild(update);
        update.id = "update-time";
    }
}
load();