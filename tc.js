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
    if (index != -1) {
        const text = data[index]["contents"];
        const movement_index = find(text, ["集結在", "即在北緯", "東經", "預料向"]);
        const measure_index = text.indexOf(`${tc_warning_name(data[index]["subtype"])}－防風措施報告：`);

        /*const text = [
            "一號戒備信號在下午9時20分發出。\n\n表示有一熱帶氣旋，在香港約800公里內，可能影響本港。\n\n請在計劃活動時考慮天氣的轉變，並注意離岸海域可能有強風。"
        ];
        const measure_index = text.indexOf(`三號強風信號－防風措施報告：`);*/

        //Name
        const name_div = document.getElementById("name");
        if (movement_index == -1) {
            //Case 1
            var tag = document.createElement("p");
            tag.appendChild(document.createTextNode(text[0]));
            name_div.appendChild(tag);
        }
        else {
            for (var i = 0; i < movement_index; i++) {
                var tag = document.createElement("p");
                tag.appendChild(document.createTextNode(text[i]));
                name_div.appendChild(tag);
            }
        }

        //Movement
        if (movement_index != -1) {
            const movement_div = document.getElementById("movement");
            for (var i = movement_index; i <= movement_index; i++) {
                var tag = document.createElement("p");
                tag.appendChild(document.createTextNode(text[i]));
                movement_div.appendChild(tag);
            }
        }

        if (measure_index != -1) {
            //Case 3
            //Announcement
            const announcement_div = document.getElementById("announcement");
            for (var i = movement_index + 1; i <= measure_index - 1; i++) {
                var tag = document.createElement("p");
                tag.appendChild(document.createTextNode(text[i]));
                announcement_div.appendChild(tag);
            }

            //Measure
            const measure_div = document.getElementById("measure");
            for (var i = measure_index; i < text.length; i++) {
                var tag = document.createElement("p");
                tag.appendChild(document.createTextNode(text[i]));
                measure_div.appendChild(tag);
            }
        }
    }
}
load();

//Case 1: Issue
//Case 2: Short (Movement only)
//Case 3: Long (Movement + Announcemenet + Measure)