'use strict';

let htmlada, htmlbtc, htmlxrp, htmlsol, htmleth;
let htmlchart_ada, html_grid;
let html_addbutton;
var price, lastprice1 = 0, lastprice2 = 0, lastprice3 = 0, lastprice4 = 0, lastprice5 = 0;
var cryptolist = ["ADAUSD", "XXBTZUSD", "SOLUSD", "XETHZUSD", "XXRPZUSD", "USDTZUSD", "DOTUSD", "XDGUSD", "UNIUSD", "LINKUSD"];
let stat = "";

function drawChart(labels, data, classchart) {
    var options = {
        series: [{
        name: 'Price',
        data: data
      }],
        chart: {
            height: 265,
            width: '100%',
            type: 'area',
            background: false,
            foreColor: "#ffffff",
            toolbar: {
                show: false
            }
        },
        tooltip: {
            theme: "dark",
            colors: "",
            style: {
                fontSize: '14px',
              },
            x:{
                show: false,
            },
        },
        colors: ["#BA42F1"],
        fill: {
            type: "gradient",
            gradient: {
              shadeIntensity: 0,
              opacityFrom: 0.8,
              opacityTo: 0.2,
              stops: [5, 95, 100]
            }
        },
        grid: {
            borderColor: "#555",
            clipMarkers: false,
            yaxis: {
            lines: {
                show: false
            }
            }
        },
        dataLabels: {
            enabled: false
        },
        labels: labels,
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth', 
            colors: "#fff",
            lineCap: 'square'
        },
        yaxis: {
            show: false,
        },
        xaxis: {
            labels: {
                show: false
            },
            axisBorder: {
                show: false,
            },
            type: "datetime"
        },
        grid:{
            show:false
        }
      };

    var chart = new ApexCharts(document.querySelector(classchart), options);
    chart.render();
}

const showData = function(data, coin){
    let timestamp = [];
    let historicalData = [];
    console.log("coin: " + coin);
    for (const prices of data.result[coin]){
        timestamp.push(prices[0]);
        if(prices[5] != 0){
            historicalData.push(prices[5]);
        }
        else{
            historicalData.push(prices[4]);
        }
    }
    drawChart(timestamp, historicalData, ".js-chart-" + coin);
}

function getHistoricalData(coinlist){
    coinlist.forEach(element => {
        fetch('https://api.kraken.com/0/public/OHLC?pair=' + element + '&interval=60')
        .then(response => response.json())
        .then(data => {
            showData(data, element);
        });
    });
}

function convertToInternationalCurrencySystem (labelValue) {

    // Nine Zeroes for Billions
    return Math.abs(Number(labelValue)) >= 1.0e+9

    ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2) + "B"
    // Six Zeroes for Millions 
    : Math.abs(Number(labelValue)) >= 1.0e+6

    ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2) + "M"
    // Three Zeroes for Thousands
    : Math.abs(Number(labelValue)) >= 1.0e+3

    ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2) + "K"

    : Math.abs(Number(labelValue));

}

function percIncrease(a, b) {
    let percent;
    if(b !== 0) {
        if(a !== 0) {
            percent = (b - a) / a * 100;
        } else {
            percent = b * 100;
        }
    } else {
        percent = - a * 100;            
    }       
    return percent.toFixed(4);
}

function getCurrentData(coinlist){
    coinlist.forEach(element => {
        fetch('https://api.kraken.com/0/public/Ticker?pair=' + element)
        .then(response => response.json())
        .then(data => {
            if(Object.keys(data.result)[0] != element){
                element = "X" + element.slice(0, 3) + "Z" + element.slice(3, 6);
                cryptolist.splice(cryptolist.length - 1, 1, element);
            }
            price = data.result[element].c[0];
            let vol = data.result[element].v[1];
            let opening = data.result[element].o;
            let change = (price - opening);
            if(change > 0){
                change == "+" + change
            }

            let colloring
            if(change >= 0){
                colloring = "#70E000";
            }
            else if(change < 0){
                colloring = "red";
            }

            let changeperc = percIncrease(opening, price);
            console.log("price " + element + ": " + price);

            if(lastprice1 != 0){

                if(price < lastprice1){

                }
                else if(price > lastprice1){

                }
            }
            lastprice1 = price;
            
            try {
                console.log("element: " + element);
                html_grid.innerHTML += `
                <div class="o-grid-item">
                    <img class="c-logo" src='svg/${element}.svg' alt="some file"  height='100'width='100' style="color:green;"/>
                    <div style="text-align: right; float: right; margin: 0 16px 0 0;">
                        <h1 class="c-card__title">
                            ${element}
                        </h1>
                        <h3 class="c-card__price" style="color:${colloring}">
                            ${price}
                        </h3>
                    </div>
                    <div style="text-align: right; float: left; margin: 0 0 0 0;">
                        <h1 class="c-card__fullname">
                            ${element.slice(0, element.length-3)}
                        </h1>
                        <h3 class="c-card__change" style="color:${colloring}">
                            vol: ${convertToInternationalCurrencySystem (vol)}
                        </h3>
                        <h3 class="c-card__change" style="color:${colloring}">
                            ${change.toFixed(6)}
                        </h3>
                        <h3 class="c-card__change" style="color:${colloring}">
                            ${changeperc}%
                        </h3>
                    </div>
                    <div style="position:absolute; left: -10px; bottom: -15px; width: 104%;" id="chart" class="js-chart-${element}"></div>
                </div>`
            }
            catch(err) {
                console.log("no svg found");
                html_grid.innerHTML += `
                <div class="o-grid-item">
                    <img class="c-logo" src='svg/ADAUSD.svg' alt="some file"  height='100'width='100' style="color:green;"/>
                    <div style="text-align: right; float: right; margin: 0 16px 0 0;">
                        <h1 class="c-card__title">
                            ${element}
                        </h1>
                        <h3 class="c-card__price" style="color:${colloring}">
                            ${price}
                        </h3>
                    </div>
                    <div style="text-align: right; float: left; margin: 0 0 0 0;">
                        <h1 class="c-card__fullname">
                            Cardano
                        </h1>
                        <h3 class="c-card__change" style="color:${colloring}">
                            vol: ${convertToInternationalCurrencySystem (vol)}
                        </h3>
                        <h3 class="c-card__change" style="color:${colloring}">
                            ${change.toFixed(6)}
                        </h3>
                        <h3 class="c-card__change" style="color:${colloring}">
                            ${changeperc}%
                        </h3>
                    </div>
                    <div style="position:absolute; left: -10px; bottom: -15px; width: 104%;" id="chart" class="js-chart-${element}"></div>
                </div>`
            }
        });
    });
    

    console.log("done loading data, now waiting 5 sec for reload!")
    stat = "done";
}

function button_listener(){
    html_addbutton = document.querySelector('.js-add-asset');
    let asset;
    html_addbutton.addEventListener("click", function(){
        asset = prompt("Please enter the ticker symbol of your choice:", "LTC");
        if(asset == null){
            console.log("retuned null");
            window.alert("sometext");
        }
        else if(cryptolist.indexOf(asset + "USD") !== -1){
            window.alert("This ticker symbol already is on this page!");
        }
        else{
            console.log("asset: " + asset);
            cryptolist.push(asset + "USD");
            var new_asset = [asset + "USD"];
            getCurrentData(new_asset);
            var kraken_asset = [cryptolist[cryptolist.length - 1]];
            setTimeout(() => {button_listener(); }, 500);
            setTimeout(() => {getHistoricalData(kraken_asset); }, 1000);
        }
    });
} 

document.addEventListener('DOMContentLoaded', function () {
    console.log('Script loaded!');
    html_grid = document.querySelector('.js-grid');
    html_grid.innerHTML += `
                <div class="o-grid-item js-add-asset" style="display: flex;">
                    <svg class="c-add-asset o-grow" xmlns="http://www.w3.org/2000/svg" width="152" height="152" viewBox="0 0 152 152">
                        <g id="Group_18" data-name="Group 18" transform="translate(-8 -10)">
                        <g id="Ellipse_1" data-name="Ellipse 1" transform="translate(8 10)" fill="none" stroke="#223154" stroke-width="15">
                            <circle cx="76" cy="76" r="76" stroke="none"/>
                            <circle cx="76" cy="76" r="68.5" fill="none"/>
                        </g>
                        <g id="Group_19" data-name="Group 19" transform="translate(76.244 76.822)">
                            <line id="Line_7" data-name="Line 7" y2="91" transform="translate(7.756 -35.822)" fill="none" stroke="#223154" stroke-linecap="round" stroke-width="15"/>
                            <line id="Line_8" data-name="Line 8" x2="92" transform="translate(-38.244 9.178)" fill="none" stroke="#223154" stroke-linecap="round" stroke-width="15"/>
                        </g>
                        </g>
                    </svg>                  
                </div>`;
    setTimeout(() => {button_listener(); }, 500);
    getCurrentData(cryptolist);
    setTimeout(() => {getHistoricalData(cryptolist); }, 1000);
    setInterval(function(){ 
        html_grid.innerHTML = ``
        html_grid.innerHTML += `
                <div class="o-grid-item js-add-asset" style="display: flex;">
                    <svg class="c-add-asset o-grow" xmlns="http://www.w3.org/2000/svg" width="152" height="152" viewBox="0 0 152 152">
                        <g id="Group_18" data-name="Group 18" transform="translate(-8 -10)">
                        <g id="Ellipse_1" data-name="Ellipse 1" transform="translate(8 10)" fill="none" stroke="#223154" stroke-width="15">
                            <circle cx="76" cy="76" r="76" stroke="none"/>
                            <circle cx="76" cy="76" r="68.5" fill="none"/>
                        </g>
                        <g id="Group_19" data-name="Group 19" transform="translate(76.244 76.822)">
                            <line id="Line_7" data-name="Line 7" y2="91" transform="translate(7.756 -35.822)" fill="none" stroke="#223154" stroke-linecap="round" stroke-width="15"/>
                            <line id="Line_8" data-name="Line 8" x2="92" transform="translate(-38.244 9.178)" fill="none" stroke="#223154" stroke-linecap="round" stroke-width="15"/>
                        </g>
                        </g>
                    </svg>                  
                </div>`;
    setTimeout(() => {button_listener(); }, 500);
    getCurrentData(cryptolist);
    setTimeout(() => {getHistoricalData(cryptolist); }, 1000);
    }, 30000);
});