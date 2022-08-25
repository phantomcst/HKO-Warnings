function tc_warning_name(subcode) {
    if (subcode == "TC1") return "一號戒備信號";
    else if (subcode == "TC3") return "三號強風信號";
    else if (subcode == "TC8NE" || subcode == "TC8SE" || subcode == "TC8SW" || subcode == "TC8NW") return "八號烈風或暴風信號";
    else if (subcode == "TC9") return "九號烈風或暴風風力增強信號";
    else if (subcode == "TC10") return "十號颶風信號";
}
function find(whole, to_find) {
    var flag = false;
    for (var i = 0; i < whole.length; i++) {
        for (var j = 0; j < to_find.length; j++) {
            if (whole[i].includes(to_find[j])) flag = true;
            else {
                flag = false;
                break;
            }
        }
        if (flag) {
            return i;
        }
    }
    return -1;
}

async function load() {
    let url = 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=warningInfo&lang=tc';
    let data = await (await fetch(url)).json();
    data = data["details"];

    var index = data.findIndex(obj => obj.warningStatementCode == "WTCSGNL");
    const text = data[index]["contents"];
    // const text = [
    //     "香港天文台發出最新熱帶氣旋警報",
    //     "三號強風信號，現正生效。",
    //     "三號強風信號，現正生效。",
    //     "三號強風信號，現正生效。",
    //     "三號強風信號，現正生效。",
    //     "三號強風信號，現正生效。",
    //     "三號強風信號，現正生效。",
    //     "預料本港平均風速每小時41至62公里。",
    //     "在正午12時，強烈熱帶風暴馬鞍集結在香港之西南偏西約320公里，即在北緯21.6度，東經111.2度附近，預料向西或西北偏西移動，時速約28公里，橫過廣東西部。",
    //     "馬鞍已經在廣東茂名電白附近登陸。受馬鞍相關的外圍雨帶影響，間中會有狂風影響香港，初時本港西南部離岸及高地仍會間中吹烈風，海面有大浪及湧浪，市民應遠離岸邊並停止所有水上活動。",
    //     "三號強風信號，現正生效。",
    //     "三號強風信號，現正生效。",
    //     "三號強風信號，現正生效。",
    //     "三號強風信號，現正生效。",
    //     "三號強風信號，現正生效。",
    //     "隨著馬鞍遠離香港，本港普遍風力將逐漸減弱。天文台會視乎本港風力減弱的程度，考慮改發一號戒備信號，或取消所有熱帶氣旋警告信號。",
    //     "在過去一小時，長洲、昂坪及橫瀾島分別錄得的最高持續風速為每小時60、51及44公里，最高陣風分別為每小時88、80及51公里。",
    //     "三號強風信號，現正生效。",
    //     "三號強風信號－防風措施報告：",
    //     "1. 現時風力仍然強勁，請勿鬆懈防風措施。提防被風吹倒的物體墮下。切勿接觸被風吹倒的電線。",
    //     "2. 市民應避免身處當風地點。在高速公路或天橋上的駕車人士要提防猛烈陣風吹襲。",
    //     "3. 請留意電台、電視台或瀏覽香港天文台網頁及流動應用程式有關風暴的最新消息。"
    // ];

    const movement_index = find(text, ["集結在", "即在北緯", "東經", "預料向"]);
    const measure_index = text.indexOf(`${tc_warning_name(data[index]["subtype"])}－防風措施報告：`);

    //Movement
    if (movement_index != -1) {
        const movement_div = document.getElementById("movement");
        var movement_text = "";
        for (var i = 0; i <= movement_index; i++) {
            movement_text += text[i] + "\n";
        }
        movement_div.innerHTML = movement_text;
    }

    if (measure_index != -1) {
        //Announcement
        const announcement_div = document.getElementById("announcement");
        var announcement_text = "";
        for (var i = movement_index + 1; i <= measure_index - 1; i++) {
            announcement_text += text[i] + "\n";
        }
        announcement_div.innerHTML = announcement_text;

        //Measure
        const measure_div = document.getElementById("measure");
        var measure_text = "";
        for (var i = measure_index; i < text.length; i++) {
            measure_text += text[i] + "\n";
        }
        measure_div.innerHTML = measure_text;
    }
}
load();

//Case 1: Issue
//Case 2: Short (Movement only)
//Case 3: Long (Movement + Announcemenet + Measure)