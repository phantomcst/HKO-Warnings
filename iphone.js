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
fetch('https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=warningInfo&lang=tc')
.then(res => res.json())
.then(jsonAsText => {
    if (Object.keys(jsonAsText).length === 0) {
        sendToWidgy("No warnings");
    } else {
        var result = warning_type(jsonAsText["details"][0]["warningStatementCode"]);
        if (result == -1) result = warning_subtype(jsonAsText["details"][0]["subtype"]);
        if (Object.keys(jsonAsText["details"]).length > 1) {
            result += ` +${Object.keys(jsonAsText["details"]).length - 1}`;
        }
        sendToWidgy(result);
    }
});