function getWeatherIcon(num) {
    if (num == 50) return "fa-sun"; //陽光充沛
    else if (num >= 51 && num <= 52) return "fa-cloud-sun"; //間有陽光, 短暫陽光
    else if (num >= 53 && num <= 54) return "fa-cloud-sun-rain"; //間有陽光幾陣驟雨, 短暫陽光有驟雨
    else if (num >= 60 && num <= 61) return "fa-cloud"; //多雲, 密雲
    else if (num == 62) return "fa-cloud-rain"; //微雨
    else if (num == 63) return "fa-cloud-showers-heavy"; //雨
    else if (num == 64) return "fa-cloud-showers-water"; //大雨
    else if (num == 65) return "fa-cloud-bolt"; //雷暴
    else if (num >= 70 && num <= 75) return "fa-moon"; //天色良好(只在晚間使用)
    else if (num >= 76 && num <= 77) return "fa-cloud-moon"; //大致多雲(只在晚間使用), 天色大致良好(只在晚間使用)
    else if (num == 80) return "fa-wind"; //大風
    else if (num == 81) return "fa-droplet-slash"; //乾燥
    else if (num == 82) return "fa-droplet"; //潮濕
    else if (num >= 83 && num <= 85) return "fa-smog"; //霧, 薄霧, 煙霞
    else if (num >= 90 && num <= 91) return "fa-temperature-arrow-up"; //熱, 暖
    else if (num >= 92 && num <= 93) return "fa-temperature-arrow-down"; //涼, 冷
}

function weatherIconColour(num) {
    return "DarkSlateGray";
    if (num == 50) return "Crimson"; //陽光充沛
    else if (num >= 51 && num <= 52) return "DarkSalmon"; //間有陽光, 短暫陽光
    else if (num >= 53 && num <= 54) return "fa-cloud-sun-rain"; //間有陽光幾陣驟雨, 短暫陽光有驟雨
    else if (num >= 60 && num <= 61) return "Gray"; //多雲, 密雲
    else if (num == 62) return "SteelBlue"; //微雨
    else if (num == 63) return "SteelBlue"; //雨
    else if (num == 64) return "SteelBlue"; //大雨
    else if (num == 65) return "SteelBlue"; //雷暴
    else if (num >= 70 && num <= 75) return "fa-moon"; //天色良好(只在晚間使用)
    else if (num >= 76 && num <= 77) return "fa-cloud-moon"; //大致多雲(只在晚間使用), 天色大致良好(只在晚間使用)
    else if (num == 80) return "Gray"; //大風
    else if (num == 81) return "fa-droplet-slash"; //乾燥
    else if (num == 82) return "fa-droplet"; //潮濕
    else if (num >= 83 && num <= 85) return "fa-smog"; //霧, 薄霧, 煙霞
    else if (num >= 90 && num <= 91) return "FireBrick"; //熱, 暖
    else if (num >= 92 && num <= 93) return "CornflowerBlue"; //涼, 冷
}

async function nineDayForecast() {
    let url = 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=tc';
    let data = await (await fetch(url)).json();

    //9 day wx forecast
    const forecastArray = data["weatherForecast"];
    
    var minTemp = forecastArray[0]["forecastMintemp"]["value"], maxTemp = forecastArray[0]["forecastMaxtemp"]["value"];
    for (i = 1; i < 9; i++) {
        var loopMinTemp = forecastArray[i]["forecastMintemp"]["value"];
        var loopMaxTemp = forecastArray[i]["forecastMaxtemp"]["value"];
        if (loopMinTemp < minTemp) minTemp = loopMinTemp;
        if (loopMaxTemp > maxTemp) maxTemp = loopMaxTemp;
    }

    const eachBlockPercent = 100 / (maxTemp - minTemp);
    for (i = 0; i < 9; i++) {
        //date
        var forecastDate = forecastArray[i]["forecastDate"];
        var forecastWeekday = forecastArray[i]["week"];
        document.getElementById(`wx${i+1}-date`).innerHTML = `${forecastDate.substring(4, 6)}月${forecastDate.substring(6, 8)}日 (${forecastWeekday.substring(2, 3)})`;

        //icon
        document.getElementById(`wx${i+1}-icon`).classList.remove("fa-minus");
        document.getElementById(`wx${i+1}-icon`).classList.add(getWeatherIcon(forecastArray[i]["ForecastIcon"]));
        document.getElementById(`wx${i+1}-icon`).style.color = weatherIconColour(forecastArray[i]["ForecastIcon"]);

        //fill bar
        var dayMinTemp = forecastArray[i]["forecastMintemp"]["value"];
        var dayMaxTemp = forecastArray[i]["forecastMaxtemp"]["value"];
        var fillMinPercent = (dayMinTemp - minTemp) * eachBlockPercent;
        var fillMaxPercent = (dayMaxTemp - minTemp) * eachBlockPercent;
        document.getElementById(`wx${i+1}-tempBar`).style.backgroundImage = `linear-gradient(90deg, rgb(220,220,220) ${fillMinPercent}%, green ${fillMinPercent}%, green ${fillMaxPercent}%, rgb(220,220,220) ${fillMaxPercent}%)`;

        //temp number
        document.getElementById(`wx${i+1}-tempMin`).innerHTML = dayMinTemp + "°";
        document.getElementById(`wx${i+1}-tempMax`).innerHTML = dayMaxTemp + "°";

        //psr
        document.getElementById(`wx${i+1}-psr`).innerHTML = forecastArray[i]["PSR"];

        var psrIconColour;
        if (forecastArray[i]["PSR"] == "高") psrIconColour = "DarkTurquoise";
        else if (forecastArray[i]["PSR"] == "中高") psrIconColour = "rgba(0, 206, 209, 0.7)";
        else if (forecastArray[i]["PSR"] == "中") psrIconColour = "SkyBlue";
        else if (forecastArray[i]["PSR"] == "中低") psrIconColour = "rgb(176, 196, 222)";
        else if (forecastArray[i]["PSR"] == "低") psrIconColour = "rgba(176, 196, 222, 0.5)";
        document.getElementById(`wx${i+1}-psrIcon`).style.color = psrIconColour;
    }
}
nineDayForecast();

async function load() {
    let url = 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=flw&lang=tc';
    let data = await (await fetch(url)).json();
    
    if (data["generalSituation"] != "")
        document.getElementById(`generalSituation`).innerHTML = data["generalSituation"];
    else
        document.getElementById(`generalSituationBox`).style.display = "none";
    
    if (data["tcInfo"] != "")
        document.getElementById(`tcInfo`).innerHTML = data["tcInfo"];
    else
        document.getElementById(`tcInfoBox`).style.display = "none";

    document.getElementById(`nineDayForecastSummary`).innerHTML = data["outlook"];
    document.getElementById(`forecast`).innerHTML = data["forecastDesc"];
    document.getElementById(`forecastTitle`).innerHTML = data["forecastPeriod"];
}
load();

async function swt() {
    let url = 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=tc';
    let data = await (await fetch(url)).json();
    
    var warningMessageCount = 0;
    try {
        warningMessageCount = data["warningMessage"].length;
    } catch {}
    var specialWxTipsCount = 0;
    try {
        specialWxTipsCount = data["specialWxTips"].length;
    } catch {}
    var tcmessageCount = 0;
    try {
        tcmessageCount = data["tcmessage"].length;
    } catch {}

    var totalCount = warningMessageCount + specialWxTipsCount + tcmessageCount;

    if (totalCount == 0) {
        document.getElementById(`alertBox`).style.display = "none";
    }
    else {
        for (var i = 1; i <= totalCount; i++) {
            var message = "";
            if (i <= warningMessageCount) message = data["warningMessage"][i-1];
            else if (i <= warningMessageCount + specialWxTipsCount) message = data["specialWxTips"][i-1-warningMessageCount];
            else message = data["tcmessage"][i-1-warningMessageCount-specialWxTipsCount];
        
            const messageElement = document.createElement("li");
            document.getElementById("alertList").appendChild(messageElement);
            messageElement.innerHTML = message;
        }
    }
}
swt();