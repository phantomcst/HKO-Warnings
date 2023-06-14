// 1. Ready translated locale messages
const messages = {
    en: {
        summary: {
            warning_count: 'There is no warning in force | There is {count} warning in force | There are {count} warnings in force'
        },
        toolbar: {
            refresh: 'Refresh',
            language: '中文'
        },
        swt: {
            title: 'Special Weather Tips'
        },
        warnings_name: {
            WFROST: 'Frost Warning',
            WHOT: 'Very Hot Weather Warning',
            WCOLD: 'Cold Weather Warning',
            WMSGNL: 'Strong Monsoon Signal',
            TC1: 'Standby Signal No. 1',
            TC3: 'Strong Wind Signal No. 3',
            WTCPRE8: 'Pre-No. 8 Special Announcement',
            TC8NE: 'No. 8 Northeast Gale or Storm Signal',
            TC8SE: 'No. 8 Southeast Gale or Storm Signal',
            TC8SW: 'No. 8 Southwest Gale or Storm Signal',
            TC8NW: 'No. 8 Northwest Gale or Storm Signal',
            TC9: 'Increasing Gale or Storm Signal No. 9',
            TC10: 'Hurricane Signal No. 10',
            CANCEL: 'All tropical cyclone warnings have been cancelled',
            WFNTSA: 'Special Announcement on Flooding in the Northern New Territories',
            WL: 'Landslip Warning',
            WTMW: 'Tsunami Warning',
            WTS: 'Thunderstorm Warning',
            WFIREY: 'Yellow Fire Danger Warning',
            WFIRER: 'Red Fire Danger Warning',
            WRAINA: 'Amber Rainstorm Warning Signal',
            WRAINR: 'Red Rainstorm Warning Signal',
            WRAINB: 'Black Rainstorm Warning Signal',
        },
    },
    tc: {
        summary: {
            warning_count: '現時沒有生效警告 | 現時有 {count} 個生效警告 | 現時有 {count} 個生效警告'
        },
        toolbar: {
            refresh: '更新頁面',
            language: 'English'
        },
        swt: {
            title: '特別天氣提示'
        },
        warnings_name: {
            WFROST: '霜凍警告',
            WHOT: '酷熱天氣警告',
            WCOLD: '寒冷天氣警告',
            WMSGNL: '強烈季候風信號',
            TC1: '一號戒備信號',
            TC3: '三號強風信號',
            WTCPRE8: '預警八號熱帶氣旋警告信號之特別報告',
            TC8NE: '八號東北烈風或暴風信號',
            TC8SE: '八號東南烈風或暴風信號',
            TC8SW: '八號西南烈風或暴風信號',
            TC8NW: '八號西北烈風或暴風信號',
            TC9: '九號烈風或暴風風力增強信號',
            TC10: '十號颶風信號',
            CANCEL: '所有熱帶氣旋警告信號取消',
            WFNTSA: '新界北部水浸特別報告',
            WL: '山泥傾瀉警告',
            WTMW: '海嘯警告',
            WTS: '雷暴警告',
            WFIREY: '黃色火災危險警告',
            WFIRER: '紅色火災危險警告',
            WRAINA: '黃色暴雨警告信號',
            WRAINR: '紅色暴雨警告信號',
            WRAINB: '黑色暴雨警告信號',
        },
    }
}
  
// 2. Create i18n instance with options
const i18n = VueI18n.createI18n({
    locale: lang, // set locale
    fallbackLocale: 'tc', // set fallback locale
    messages, // set locale messages
})

// 3. Create a vue root instance
const app = Vue.createApp({})
  
// 4. Install i18n instance to make the whole app i18n-aware
app.use(i18n)
  
// 5. Mount
app.mount('body')