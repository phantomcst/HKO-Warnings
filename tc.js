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
var trackEachTextAppear = "";
function write(whole, type, start, end) {
    if (start < 0 || end < 0) return;
    const div = document.getElementById(type);
    for (var i = start; i <= end; i++) {
        var tag = document.createElement("p");
        tag.appendChild(document.createTextNode(whole[i]));
        div.appendChild(tag);
        trackEachTextAppear = trackEachTextAppear + ".";
    }
}

async function load() {
    let url = 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=warningInfo&lang=tc';
    //let url = 'test_data/tc/tc09.json';
    let data = await (await fetch(url)).json();
    data = data["details"];

    var index = data.findIndex(obj => obj.warningStatementCode == "WTCSGNL");
    if (index != -1) {
        const text = data[index]["contents"];
        const textLength = Object.keys(text).length;

        try {
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

            // movement
            var movement_start = find(text, ["集結在", "即在北緯", "東經"]);
            var movement_end = movement_start;

            if (movement_start - 1 >= 0) {
                if (text[movement_start-1].search("增強") != -1 || text[movement_start-1].search("減弱") != -1) movement_start--; // have 增強 or 減弱
            }

            if (tc_issue) {
                movement_start = -10;
                movement_end = -10;
            }

            write(text, "movement", movement_start, movement_end);

            // name
            var name_start = 0;
            var name_end = movement_start - 1;

            if (tc_issue || tc_just_cancel) name_end = 0;

            write(text, "name", name_start, name_end);

            // announcement
            var announcement_start = movement_end + 1;
            var announcement_end = (tc_cancel) ? text.length - 1 : find(text, ["防風措施報告"]) - 1;
            write(text, "announcement", announcement_start, announcement_end);

            // measure
            var measure_start = announcement_end + 1;
            var measure_end = text.length - 1;
            write(text, "measure", measure_start, measure_end);

            // check if all texts are present, if not go fallback
            if (trackEachTextAppear.length != textLength) {
                write(text, "fallback", 0, textLength-1);
                document.getElementById("name").style.display = "none";
                document.getElementById("movement").style.display = "none";
                document.getElementById("announcement").style.display = "none";
                document.getElementById("measure").style.display = "none";
                document.getElementById("movementHeader").style.display = "none";
                document.getElementById("announcementHeader").style.display = "none";
                document.getElementById("measureHeader").style.display = "none";
            }
        }
        catch {
            write(text, "fallback", 0, textLength-1);
        }
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
