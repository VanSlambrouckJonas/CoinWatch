'use strict';

let htmlada, htmlbtc, htmlxrp, htmlsol, htmleth;
let htmlchart_ada, html_grid;
let html_addbutton, colloring;
var price, lastprice = 0;
var cryptolist = ["ADAUSD", "XXBTZUSD", "SOLUSD", "XETHZUSD", "XXRPZUSD", "USDTZUSD", "DOTUSD", "XDGUSD", "UNIUSD", "LINKUSD"];
var amount = 0;
var amount_assets = 0;
var asset_new = "";

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
            enabled: true,
            theme: "dark",
            colors: "",
            style: {
                fontSize: '14px',
            },
            x:{
                show: false,
            },
            y:{
                show: false,
            }
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
    amount += 1;
    if(amount == amount_assets){
        //console.log("yes???")
        button_listener();
    }
}
    
const showData = function(data, coin){
    let timestamp = [];
    let historicalData = [];
    for (const prices of data.result[coin]){
        timestamp.push(prices[0]);
        if(prices[5] != 0){
            historicalData.push(prices[5]);
        }
        else{
            historicalData.push(prices[4]);
        }
    }
    if (document.querySelector(".js-chart-" + coin)){
        drawChart(timestamp, historicalData, ".js-chart-" + coin);
    }
    else{
        setTimeout(() => {  showData(data, coin); }, 1000);
    }
}

function getHistoricalData(coinlist, state){
    setTimeout(function() {
        coinlist.forEach(element => {
            fetch('https://jonasvscryptoapi.azurewebsites.net/api/OHLC/' + element)
            .then(response => response.json())
            .then(data => {
                showData(data, element);
            });
        });
      }, 1000);
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

async function getCurrentData(coinlist, isnew){
    await coinlist.forEach(element => {
        fetch('https://jonasvscryptoapi.azurewebsites.net/api/ticker/' + element)
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
            asset_new = element;
            if(isnew == true){
                cryptolist.push(asset_new);
            }
            if(change > 0){
                change == "+" + change
            }

            if(change >= 0){
                colloring = "#70E000";
            }
            else if(change < 0){
                colloring = "red";
            }

            let changeperc = percIncrease(opening, price);
            console.log("price " + element + ": $" + price);

            if(lastprice != 0){

                if(price < lastprice){

                }
                else if(price > lastprice){

                }
            }
            lastprice = price;
            
            try {
                html_grid.innerHTML += `
                <div class="o-grid-item">
                    <img class="c-logo" src='svg/${element}.svg' alt="some file"  height='100'width='100' style="color:green;" onerror="this.onerror=null; this.src='svg/safari-pinned-tab.svg'"/>
                    <div class="c-assetNamePrice">
                        <h1 class="c-card__title js-assetname">
                            ${element}
                        </h1>
                        <h3 class="c-card__price" style="color:${colloring}">
                            ${price}
                        </h3>
                    </div>
                    <div class="c-assetinfo">
                        <h1 class="c-card__fullname">
                            ${element.slice(0, element.length-3)}
                        </h1>
                        <h3 class="c-card__change" style="color:${colloring}">
                            vol: ${convertToInternationalCurrencySystem (vol)}
                        </h3>
                        <h3 class="c-card__change" style="color:${colloring}">
                            chg: ${change.toFixed(6)}
                        </h3>
                        <h3 class="c-card__change" style="color:${colloring}">
                            chg%: ${changeperc}%
                        </h3>
                    </div>
                    <div style="position:relative; left: -32px; " id="chart" class="js-chart-${element}" c-chart></div>
                </div>`
            }
            catch(err) {
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
                    <div class="c-assetinfo">
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
    if(isnew == true){
        cryptolist.push(asset_new);
    }
}

function button_listener(){
    html_addbutton = document.querySelector('.js-add-asset');
    let asset;
    html_addbutton.addEventListener("click", function(){
        asset = prompt("Please enter the Kraken ticker symbol of your choice:", "XLTCZ");
        let assetname = document.querySelectorAll('.js-assetname');
        let isonpage = false;
        for(const name of assetname){
            if(name.innerHTML.includes(asset)){
                isonpage = true;
            }
        }
        
        if(asset == null){
            console.log("retuned null");
            window.alert("Canceled");
        }
        else if(isonpage == true){
            window.alert("This ticker symbol already is on this page!");
        }
        else{
            amount_assets += 1;
            console.log("adding asset: " + asset);
            var new_asset = [asset + "USD"];
            getCurrentData(new_asset);

            setTimeout(function(){
                //console.log("assets: " + cryptolist)
                var kraken_asset = [asset_new];
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
                getHistoricalData(kraken_asset, true);
            }, 1000);
        }
    });
} 

document.addEventListener('DOMContentLoaded', function () {
    console.log('Script loaded!');
    amount_assets = cryptolist.length;
    html_grid = document.querySelector('.js-grid');
    html_grid.innerHTML += `
                <div class="o-grid-item js-add-asset o-grid-item__add">
                    <svg class="c-add-asset o-grow" xmlns="http://www.w3.org/2000/svg" width="152" height="152" viewBox="0 0 152 152">
                        <g id="Group_18" data-name="Group 18" transform="translate(-8 -10)">
                        <g id="Ellipse_1" data-name="Ellipse 1" transform="translate(8 10)" fill="none" stroke="#03122c" stroke-width="15">
                            <circle cx="76" cy="76" r="76" stroke="none"/>
                            <circle cx="76" cy="76" r="68.5" fill="none"/>
                        </g>
                        <g id="Group_19" data-name="Group 19" transform="translate(76.244 76.822)">
                            <line id="Line_7" data-name="Line 7" y2="91" transform="translate(7.756 -35.822)" fill="none" stroke="#03122c" stroke-linecap="round" stroke-width="15"/>
                            <line id="Line_8" data-name="Line 8" x2="92" transform="translate(-38.244 9.178)" fill="none" stroke="#03122c" stroke-linecap="round" stroke-width="15"/>
                        </g>
                        </g>
                    </svg>  
                </div>`;
    button_listener();
    getCurrentData(cryptolist);
    getHistoricalData(cryptolist);
});