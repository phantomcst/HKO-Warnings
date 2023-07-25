function format_time(timestamp, addDate) {
    var result = "";

    if (lang == "en") result += "Updated ";

    //day
    if (addDate) {
        var diffDays = new Date().getDate() - timestamp.getDate();
        var diffMonths = new Date().getMonth() - timestamp.getMonth();
        var diffYears = new Date().getFullYear() - timestamp.getFullYear();
        if (diffYears == 0 && diffDays == 0 && diffMonths == 0)
            result += lang == "en" ? "Today " : "今天";
        else if (diffDays == 1)
            result += lang == "en" ? "Yesterday " : "昨天";
        else if (diffYears != 0)
            result += lang == "en" ? `${timestamp.getDate()}/${timestamp.getMonth()+1}/${timestamp.getFullYear()} ` : `${timestamp.getFullYear()} 年 ${timestamp.getMonth()+1} 月 ${timestamp.getDate()} 日`;
        else
            result += lang == "en" ? `${timestamp.getDate()}/${timestamp.getMonth()+1} ` : `${timestamp.getMonth()+1} 月 ${timestamp.getDate()} 日`;
    }

    var hour = timestamp.getHours();
    var min = timestamp.getMinutes();

    //min add zero
    if (min <= 9) min = `0${min}`;
    
    //time
    if (lang == "en") {
        if (hour >= 13) result += `${hour-12}:${min} pm`;
        else if (hour == 12) result += `12:${min} pm`;
        else if (hour == 0) result += `12:${min} am`;
        else result += `${hour}:${min} am`;
    } else if (lang == "tc") {
        if (hour >= 13) result += `下午 ${hour-12} 時 ${min} 分`;
        else if (hour == 12) result += `中午 12 時 ${min} 分`;
        else if (hour == 0) result += `上午 12 時 ${min} 分`;
        else result += `上午 ${hour} 時 ${min} 分`;
    }

    if (lang == "tc") result += "更新";

    return result;
}

// Block 1: warnings
async function warnings() {
    let warningDetailsURL = `https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=warningInfo&lang=${lang}`;
    let warningSummaryURL = `https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=warnsum&lang=${lang}`;
    //let warningDetailsURL = 'test_data/test_data_warnings.json';
    //let warningSummaryURL = 'test_data/test_data_warnings_summary.json';
    let warningDetailsObject = await (await fetch(warningDetailsURL)).json();
    let warningSummaryObject = await (await fetch(warningSummaryURL)).json();


    // ---------- Warning Count ----------
    var warningCount = 0;
    for (var key in warningSummaryObject) {
        if (warningSummaryObject.hasOwnProperty(key) && warningSummaryObject[key]["actionCode"] != "CANCEL") {
            warningCount++;
        }
    }


    // ---------- Page Refresh Time ----------
    document.getElementById("refresh").innerHTML = `${format_time(new Date(), false)}`;


    // ---------- Warning Details ----------
    // create in force warnings array
    const warningsArray = [];
    for (var key in warningSummaryObject) {
        if (warningSummaryObject.hasOwnProperty(key) && warningSummaryObject[key]["actionCode"] != "CANCEL") {
            warningsArray.push(key);
        }
    }

    var page_title_string = "";

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
        var warning_code = loopWarningDetailsObj["warningStatementCode"];
        if (warning_code == "WFIRE" || warning_code == "WTCSGNL" || warning_code == "WRAIN") warning_code = loopWarningDetailsObj["subtype"];
        warn_name.innerHTML = i18n.global.t(`warnings_name.${warning_code}`);
        warn_name.classList.add("block-title");
        node.appendChild(warn_name);

        // set warning update time
        const update = document.createElement("p");
        update.innerHTML = `${format_time(new Date(loopWarningDetailsObj["updateTime"]), true)}`;
        document.getElementById(i).appendChild(update);
        update.classList.add("warn-update-time");

        // set warning content
        const warn_content_wrap = document.createElement("div");
        warn_content_wrap.classList.add("warn-content-wrap");
        node.appendChild(warn_content_wrap);
        // var collapsable_title = false;
        // const collapsable = document.createElement("details");
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

        // add to title string
        console.log(`${i}: ${i18n.global.t(`warnings_name.${warning_code}`)}`);
        page_title_string += i18n.global.t(`warnings_name.${warning_code}`);
        if (i < warningCount - 2) page_title_string += i18n.global.t("title.comma");
        else if (i == warningCount - 2) page_title_string += i18n.global.t("title.and");
    }
    console.log(warningCount)
    document.getElementById("summary").innerHTML = `${page_title_string}${i18n.global.t('title.in_force', {count: warningCount})}`;
}
try {
    warnings();
} catch(err) {
    console.log("weather warnings error:" + err);
}

// Block 2: special weather tips
async function swt() {
    let url = `https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=swt&lang=${lang}`;
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
            update.innerHTML = `${format_time(new Date(swt_source["updateTime"]), true)}`;
            tips_wrap.appendChild(update);
            update.classList.add("swt-update-time");

            const tips_text = document.createElement("li");
            tips_text.innerHTML = `${swt_source['desc']}`;
            tips_wrap.appendChild(tips_text);
        }
    }
}
try {
    swt();
} catch(err) {
    console.log("swt error:" + err);
}

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