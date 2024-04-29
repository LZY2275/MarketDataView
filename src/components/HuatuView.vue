<template>
    <div>
        <div class="chart" id="chart"></div>
    </div>
</template>

<script>
import Vue from 'vue';
import * as echarts from "echarts/core";
// import $ from 'jquery';
import axios from 'axios';
// import axios from 'axios';

Vue.prototype.echarts = echarts;

export default{
    data(){
        return{
            chart_data:[],
            options:{
                animation: false,
                legend: {
                    bottom: 10,
                    left: 'center',
                    data: ['Dow-Jones index', 'MA5', 'MA10', 'MA20', 'MA30']
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    },
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 10,
                    textStyle: {
                        color: '#000'
                    },
                    position: function (pos, params, el, elRect, size) {
                        const obj = {
                            top: 10
                        };
                        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                        return obj;
                    }
                    // extraCssText: 'width: 170px'
                },
                axisPointer: {
                    link: [
                    {
                        xAxisIndex: 'all'
                    }
                    ],
                    label: {
                    backgroundColor: '#777'
                    }
                },
                toolbox: {
                    feature: {
                    dataZoom: {
                        yAxisIndex: false
                    },
                    brush: {
                        type: ['lineX', 'clear']
                    }
                    }
                },
                brush: {
                    xAxisIndex: 'all',
                    brushLink: 'all',
                    outOfBrush: {
                        colorAlpha: 0.1
                    }
                },
                visualMap: {
                    show: false,
                    seriesIndex: 5,
                    dimension: 2,
                    pieces: [
                    {
                        value: 1,
                        color: '#ec0000'
                    },
                    {
                        value: -1,
                        color: '#00da3c'
                    }
                    ]
                },
                grid: [
                    {
                    left: '10%',
                    right: '8%',
                    height: '50%'
                    },
                    {
                    left: '10%',
                    right: '8%',
                    top: '63%',
                    height: '16%'
                    }
                ],
                xAxis: [
                    {
                    type: 'category',
                    data: "",
                    boundaryGap: false,
                    axisLine: { onZero: false },
                    splitLine: { show: false },
                    min: 'dataMin',
                    max: 'dataMax',
                    axisPointer: {
                        z: 100
                    }
                    },
                    {
                    type: 'category',
                    gridIndex: 1,
                    data: "",
                    boundaryGap: false,
                    axisLine: { onZero: false },
                    axisTick: { show: false },
                    splitLine: { show: false },
                    axisLabel: { show: false },
                    min: 'dataMin',
                    max: 'dataMax'
                    }
                ],
                yAxis: [
                    {
                    scale: true,
                    splitArea: {
                        show: true
                    }
                    },
                    {
                    scale: true,
                    gridIndex: 1,
                    splitNumber: 2,
                    axisLabel: { show: false },
                    axisLine: { show: false },
                    axisTick: { show: false },
                    splitLine: { show: false }
                    }
                ],
                dataZoom: [
                    {
                    type: 'inside',
                    xAxisIndex: [0, 1],
                    start: 98,
                    end: 100
                    },
                    {
                    show: true,
                    xAxisIndex: [0, 1],
                    type: 'slider',
                    top: '85%',
                    start: 98,
                    end: 100
                    }
                ],
                series:[
                    {
                        name: 'Dow-Jones index',
                        type: 'candlestick',
                        data: "",
                        itemStyle: {
                            color: '#00da3c',
                            color0: '#ec0000',
                            borderColor: undefined,
                            borderColor0: undefined
                        }
                    },
                    {
                        name: 'MA5',
                        type: 'line',
                        data: "",
                        smooth: true,
                        lineStyle: {
                            opacity: 0.5
                        }
                    },
                    {
                        name: 'MA10',
                        type: 'line',
                        data: "",
                        smooth: true,
                        lineStyle: {
                            opacity: 0.5
                        }
                    },
                    {
                        name: 'MA20',
                        type: 'line',
                        data: "",
                        smooth: true,
                        lineStyle: {
                            opacity: 0.5
                        }
                    },
                    {
                        name: 'MA30',
                        type: 'line',
                        data: "",
                        smooth: true,
                        lineStyle: {
                            opacity: 0.5
                        }
                    },
                    {
                        name: 'Volume',
                        type: 'bar',
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        data: ""
                    }

                ]
            },
        }
    },
    async mounted(){
        await this.getChartData();
    },
    methods:{
        async getChartData(){
            axios.get('/api/examples/data/asset/data/stock-DJI.json')
            .then((res) => {
                var rawData = res.data;
                var data = this.splitData(rawData);
                this.chart_data = data
                console.log('chart_data',this.chart_data);
            })
            .catch((err) => {
                console.log(err);
            })
        },

        drawChart(){
            this.options.xAxis[0].data = this.chart_data.categoryData;
            this.options.xAxis[1].data = this.chart_data.categoryData;
            this.options.series[0].data = this.chart_data.values;
            this.options.series[1].data = this.calculateMA(5, this.chart_data);
            this.options.series[2].data = this.calculateMA(10, this.chart_data);
            this.options.series[3].data = this.calculateMA(20, this.chart_data);
            this.options.series[4].data = this.calculateMA(30, this.chart_data);
            this.options.series[5].data = this.chart_data.volumes;

            var myChart = this.echarts.init(document.getElementById('chart'));
            myChart.setOption(this.options, true);
        },

        splitData(rawData) {
            let categoryData = [];
            let values = [];
            let volumes = [];
            for (let i = 0; i < rawData.length; i++) {
                categoryData.push(rawData[i].splice(0, 1)[0]);
                values.push(rawData[i]);
                volumes.push([i, rawData[i][4], rawData[i][0] > rawData[i][1] ? 1 : -1]);
            }
            return {
                categoryData: categoryData,
                values: values,
                volumes: volumes
            };
        },

        calculateMA(dayCount, data) {
            var result = [];
            for (var i = 0, len = data.values.length; i < len; i++) {
                if (i < dayCount) {
                result.push('-');
                continue;
                }
                var sum = 0;
                for (var j = 0; j < dayCount; j++) {
                sum += data.values[i - j][1];
                }
                result.push(+(sum / dayCount).toFixed(3));
            }
            return result;
        }
    },

    watch:{
        chart_data:{
            handler(){
                this.drawChart();
            },
            deep:true
        }
    }
}

</script>

<style scoped>

.chart{
    height: calc(100vh - 136px);
    width: 100vw;
}

</style>