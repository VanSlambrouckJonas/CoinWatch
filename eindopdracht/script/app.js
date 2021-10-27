'use strict';

let htmlada, htmlbtc, htmlxrp, htmlsol, htmleth;
let htmlchart_ada, html_grid;
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

async function getCurrentData(coinlist){
    coinlist.forEach(element => {
        fetch('https://api.kraken.com/0/public/Ticker?pair=' + element)
        .then(response => response.json())
        .then(data => {
            price = data.result[element].c[0];
            console.log("price " + element + ": " + price);

            if(lastprice1 != 0){

                if(price < lastprice1){

                }
                else if(price > lastprice1){

                }
            }
            lastprice1 = price;
            
            if(element == "ADAUSD"){
                html_grid.innerHTML += `
                <div class="o-grid-item o-grid-bigitem">
                    <img class="c-logo" src='svg/${element}.svg' alt="some file"  height='100'width='100' style="color:green;"/>
                    <div style="text-align: right; float: right; margin: 0 16px 0 0;">
                        <h1 class="c-card__title">
                            ${element}
                        </h1>
                        <h3 class="c-card__price">
                            ${price}
                        </h3>
                    </div>
                    <div style="text-align: right; float: left; margin: 0 0 0 0;">
                        <h1 class="c-card__fullname">
                            Cardano
                        </h1>
                        <h3 class="c-card__change">
                            vol: 152M
                        </h3>
                        <h3 class="c-card__change">
                            +0.2565
                        </h3>
                        <h3 class="c-card__change">
                            +5.6%
                        </h3>
                    </div>
                    <div style="position:absolute; left: -10px; bottom: -15px; width: 104%;" id="chart" class="js-chart-${element}"></div>
                </div>`
            }
            else{
                html_grid.innerHTML += `
                <div class="o-grid-item">
                    <img class="c-logo" src='svg/${element}.svg' alt="some file"  height='100'width='100' style="color:green;"/>
                    <div style="text-align: right; float: right; margin: 0 16px 0 0;">
                        <h1 class="c-card__title">
                            ${element}
                        </h1>
                        <h3 class="c-card__price">
                            ${price}
                        </h3>
                    </div>
                    <div style="text-align: right; float: left; margin: 0 0 0 0;">
                        <h1 class="c-card__fullname">
                            Cardano
                        </h1>
                        <h3 class="c-card__change">
                            vol: 152M
                        </h3>
                        <h3 class="c-card__change">
                            +0.2565
                        </h3>
                        <h3 class="c-card__change">
                            +5.6%
                        </h3>
                    </div>
                    <div style="position:absolute; left: -10px; bottom: -15px; width: 104%;" id="chart" class="js-chart-${element}"></div>
                </div>`
            }
            
        });
        stat = "done"
    });
    

    console.log("done loading data, now waiting 5 sec for reload!")
    return("done");
}

document.addEventListener('DOMContentLoaded',async function () {
    console.log('Script loaded!');
    html_grid = document.querySelector('.js-grid');
    getCurrentData(cryptolist);
    setTimeout(() => {getHistoricalData(cryptolist); }, 1000);
});