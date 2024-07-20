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
    return -10;
}
function write(whole, type, start, end) {
    if (start < 0 || end < 0) return;
    const div = document.getElementById(type);
    for (var i = start; i <= end; i++) {
        var tag = document.createElement("p");
        tag.appendChild(document.createTextNode(whole[i]));
        div.appendChild(tag);
    }
}

async function load() {
    //let url = 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=warningInfo&lang=tc';
    let url = 'test_data/tc/tc08.json';
    let data = await (await fetch(url)).json();
    data = data["details"];

    var index = data.findIndex(obj => obj.warningStatementCode == "WTCSGNL");
    if (index != -1) {
        const text = data[index]["contents"];

        // flags
        var tc_detailed = true;
        var tc_issue = false;
        try {
            if (text[0].includes("\n")) tc_issue = true;
        } catch {}
        
        var tc_just_cancel = false;
        try {
            if (text[0].includes("取消")) tc_just_cancel = true;
        } catch {}

        var tc_cancel = false;
        try {
            if (text[1].includes("取消")) tc_cancel = true;
        } catch {}

        // name
        var name_start = 0;

        var name_end;
        if (tc_issue) name_end = 0;
        else if (tc_just_cancel) name_end = 0;
        else if (tc_cancel) name_end = 1;
        else name_end = 2;

        write(text, "name", name_start, name_end);

        // movement
        var movement_start;
        if (tc_issue) movement_start = -10;
        else if (tc_just_cancel) movement_start = 0;
        else if (tc_cancel) movement_start = 2;
        else movement_start = 3;

        var movement_end = find(text, ["集結在", "即在北緯", "東經"]);

        write(text, "movement", movement_start, movement_end);

        // announcement
        var announcement_start = movement_end + 1;
        var announcement_end = (tc_cancel) ? text.length - 1 : find(text, ["防風措施報告："]) - 1;
        write(text, "announcement", announcement_start, announcement_end);

        // measure
        var measure_start = announcement_end + 1;
        var measure_end = text.length - 1;
        write(text, "measure", measure_start, measure_end);
    }
}
load();

//Case 1: Issue
//Case 2: Short (Movement only)
//Case 3: Long (Movement + Announcemenet + Measure)


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
