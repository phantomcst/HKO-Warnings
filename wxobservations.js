function parseCSV(str) {
    var arr = [];

    // Iterate over each character, keep track of current row and column (of the returned array)
    for (var row = 0, col = 0, c = 0; c < str.length; c++) {
        var cc = str[c], nc = str[c+1];        // Current character, next character
        arr[row] = arr[row] || [];             // Create a new row if necessary
        arr[row][col] = arr[row][col] || '';   // Create a new column (start with empty string) if necessary

        // If it's a comma and we're not in a quoted field, move on to the next column
        if (cc == ',') { ++col; continue; }

        // If it's a newline (CRLF) and we're not in a quoted field, skip the next character
        // and move on to the next row and move to column 0 of that new row
        if (cc == '\r' && nc == '\n') { ++row; col = 0; ++c; continue; }

        // If it's a newline (LF or CR) and we're not in a quoted field,
        // move on to the next row and move to column 0 of that new row
        if (cc == '\n') { ++row; col = 0; continue; }
        if (cc == '\r') { ++row; col = 0; continue; }

        // Otherwise, append the current character to the current column
        arr[row][col] += cc;
    }
    return arr;
}

function getType() {
    var type = document.getElementById("dataType").value;
    var url, cols;
    if (type == "temperature") { url = "latest_1min_temperature_uc"; cols = [1,2] }
    else if (type == "meanWind") { url = "latest_10min_wind_uc"; cols = [1,2,3] }
    else if (type == "maxGust") { url = "latest_10min_wind_uc"; cols = [1,4] }
    else if (type == "pressure") { url = "latest_1min_pressure_uc"; cols = [1,2] }
    else if (type == "humidity") { url = "latest_1min_humidity_uc"; cols = [1,2] }
    else if (type == "visibility") { url = "latest_10min_visibility_uc"; cols = [1,2] }
    else return;
    outputResult(url, cols);
}

function typeColour(type, num) {
    if (type == "temperature") {
        if (num <= 7) return "rgb(84,64,149)"; //嚴寒
        else if (num <= 12) return "rgb(63,170,216)"; //寒冷
        else if (num <= 17) return "rgb(50,226,150)"; //清涼
        else if (num <= 22) return "rgb(238,200,137)"; //和暖
        else if (num <= 27) return "rgb(234,170,30)"; //溫暖
        else if (num <= 32) return "rgb(204,50,50)"; //炎熱
        else return "rgb(100,20,20)" //酷熱
    } else if (type == "meanWind" || type == "maxGust") {
        if (num <= 40) return "black"; //清勁,和緩,輕微,無風
        else if (num <= 62) return "rgb(45,157,95)"; //強風
        else if (num <= 87) return "rgb(254,228,46)"; //烈風
        else if (num <= 117) return "rgb(255,175,35)"; //暴風
        else if (num >= 118) return "rgb(204,52,50)" //颶風
        else return "black";
    } else {
        return "black";
    }
}

function outputResult(url, cols) {
    // Clear previous results
    while (document.getElementsByTagName("td").length) { document.getElementsByTagName("td")[0].remove(); }
    while (document.getElementsByTagName("tr").length) { document.getElementsByTagName("tr")[0].remove(); }

    let target = `https://data.weather.gov.hk/weatherAPI/hko_data/regional-weather/${url}.csv`;
    var type = document.getElementById("dataType").value;
    fetch(target)
        .then((response) => response.text())
        .then((data) => {
            var resultArray = parseCSV(data);
            var resultRowLength = resultArray.length - 1;
            var resultColumnLength = cols.length;

            const resultDiv = document.getElementById("result");

            // Table head
            var resultRow = document.createElement("tr");
            resultDiv.appendChild(resultRow);
            for (c = 0; c < resultColumnLength; c++) {
                var resultColumn = document.createElement("th");
                resultRow.appendChild(resultColumn);
                resultColumn.innerHTML = resultArray[0][cols[c]];
            }

            for (r = 1; r <= resultRowLength; r++) {
                // Create row
                var resultRow = document.createElement("tr");
                resultDiv.appendChild(resultRow);

                // Create columns
                for (c = 0; c < resultColumnLength; c++) {
                    var resultColumn = document.createElement("td");
                    resultRow.appendChild(resultColumn);
                    resultColumn.innerHTML = resultArray[r][cols[c]];
                    if (resultArray[0][cols[c]] != "自動氣象站") {
                        resultColumn.style.color = typeColour(type, resultArray[r][cols[c]]);
                    }
                }
            }
        });
}
outputResult("latest_1min_temperature_uc", [1,2]) // Default when load page