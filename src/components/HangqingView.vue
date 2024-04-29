<template>
    <div class="main-container">
        <div>
            <t-space>
                <t-radio-group variant="primary-filled" default-value="1" @change="onChangeData">
                    <t-radio-button value="1">全部</t-radio-button>
                    <t-radio-button value="2">股票</t-radio-button>
                    <t-radio-button value="3">基金</t-radio-button>
                    <t-radio-button value="4">期货</t-radio-button>
                    <t-radio-button value="5">外汇</t-radio-button>
                </t-radio-group>
            </t-space>
        </div>
        <div v-if="marketList.length == 0" style="width: 100%;height: 500px;display: flex;justify-content: center;align-items: center;">
            <t-space>
                <t-loading text="加载中..." size="small"></t-loading>
            </t-space>
        </div>

        <div style="gap: 16px;flex-wrap: wrap;display: inline-flex;margin-top: 20px;margin-bottom: 100px;">
            <div v-for="(item,index) in marketList" :key="index" v-dragging="{ item: item, list: marketList, group: 'market' }">
                <t-card header-bordered hover-shadow style="width:220px;">
                    <t-statistic :title="item.title" :value="item.value" :color="item.state==1?'red':item.state==-1?'green':'black'">
                    <template #extra>
                        <t-space direction="vertical" :size="0">
                            <!-- 非基金，看昨日价格和涨跌幅度 -->
                            <div style="display: flex;" v-if="item.is_fund == 0">
                                <t-space size="4px" align="center">
                                    <t-icon name="arrow-up" style="color: #d54941" v-if="item.state == 1"/>
                                    <t-icon name="arrow-down" style="color: #2ba471" v-if="item.state == -1"/>
                                    <t-icon name="arrow-right" style="color: #a5a5a5" v-if="item.state == 0"/>{{item.change_ratio}}%
                                </t-space>
                                <t-space size="small" align="center" style="margin-left: 8px;">
                                    <t-icon name="add" style="color: #d54941" v-if="item.state == 1"/>
                                    <t-icon name="minus" style="color: #2ba471" v-if="item.state == -1"/>
                                    <t-icon name="equal" style="color: #a5a5a5" v-if="item.state == 0"/>
                                    {{ item.change_value }}
                                </t-space>
                            </div>
                            <!-- 基金，看万分增减额 -->
                            <div style="display: flex;" v-if="item.is_fund == 1">
                                <t-space size="4px" align="center">
                                    <t-icon name="arrow-up" style="color: #d54941" v-if="item.state == 1"/>
                                    <t-icon name="arrow-down" style="color: #2ba471" v-if="item.state == -1"/>
                                    <t-icon name="arrow-right" style="color: #a5a5a5" v-if="item.state == 0"/>{{item.changed}}‰
                                </t-space>
                            </div>
                            <t-popup content="最后更新日期">
                            <t-space size="small" align="center" style="font-size: 12px;color: #a5a5a5;">
                                <t-icon name="calendar-event"></t-icon>{{item.last_update}}
                            </t-space>
                            </t-popup>
                        </t-space>
                    </template>
                    </t-statistic>
                </t-card>
            </div>
        </div>
    </div>

</template>

<script>
import axios from 'axios';
export default{
    data(){
        return{
            separator: () => <t-divider layout="vertical" style="height:80%" />,
            upColor:'#d54941',
            downColor:'#2ba471',
            stopColor:'#a5a5a5',
            // -1为跌，0为停，1为涨
            marketList:[]
        }
    },
    async mounted(){
        this.$dragging.$on('dragged', ({ value }) => {
            // console.log(value.item)
            // list为排序后的list
            console.log(value.list)
            // console.log(value.otherData)
        })
        this.$dragging.$on('dragend', () => {
            // console.log(value);
        })

        await this.getMarketList()
        console.log('market',this.marketList);
    },

    methods:{
        processMarketList(){
            // 处理行情列表
            var length = this.marketList.length
            for (let i =0;i<length;i++){
                var diff = this.marketList[i].value - this.marketList[i].yesterday_value
                // 涨跌状态
                if (diff > 0){
                    this.marketList[i].state = 1
                }else if (diff < 0){
                    this.marketList[i].state = -1
                }else{
                    this.marketList[i].state = 0
                }
                var diff_abs = Math.abs(diff)
                // 涨跌幅度
                this.marketList[i].change_ratio = (diff_abs / this.marketList[i].yesterday_value * 100).toFixed(2)
                // 涨跌额
                this.marketList[i].change_value = Math.round(diff_abs * 1000000) / 1000000;

                // 如果是基金，使用万分增减额changed，并将is_fund置为1
                if (this.marketList[i].changed != undefined){
                    this.marketList[i].is_fund = 1
                }else{
                    this.marketList[i].is_fund = 0
                }
            }
        },
        async getMarketList(){
            // 获取行情列表
            // this.marketList = await this.$api.getMarketList()
            // this.marketList = [
            //     {
            //         title:'沪深300',
            //         value:35145.0108,
            //         yesterday_value:35147.0108,
            //         last_update:"2024-04-24",//最后更新时间
            //     },
            //     {
            //         title:'沪深301',
            //         value:3514.0108,
            //         yesterday_value:4000.0,
            //         last_update:"2024-04-24",//最后更新时间
            //     },
            //     {
            //         title:'沪深302',
            //         value:3514.0108,
            //         yesterday_value:3514.0108,
            //         last_update:"2024-04-24",//最后更新时间
            //     },
            //     {
            //         title:'沪深304',
            //         value:3514.0108,
            //         yesterday_value:2000.0,
            //         last_update:"2024-04-24",//最后更新时间
            //         changed:0.45//如果是基金，万分增减额
            //     },
            //     {
            //         title:'沪深305',
            //         value:3514.0108,
            //         yesterday_value:4000.0,
            //         last_update:"2024-04-24",//最后更新时间
            //         changed:0.45//如果是基金，万分增减额
            //     },
            //     {
            //         title:'沪深306',
            //         value:3514.0108,
            //         yesterday_value:2000.0,
            //         last_update:"2024-04-24",//最后更新时间
            //         changed:0.45//如果是基金，万分增减额
            //     },
            //     {
            //         title:'沪深307',
            //         value:3514.0108,
            //         yesterday_value:3514.0108,
            //         last_update:"2024-04-24",//最后更新时间
            //         changed:0.45//如果是基金，万分增减额
            //     },
            // ]
            this.marketList = []
            var type = ''
            axios.get('/api/data?type='+type)
            .then((res) => {
                if(res.status == 200){
                    // console.log(res.data.data);
                    var data = res.data.data
                    var data_stock = data.Stock
                    var data_fund = data.Fund
                    var data_futures = data.Futures
                    var data_forex = data.Forex

                    for(let i =0;i<data_stock.length;i++){
                        var dataobj = this.translateResult(data_stock[i])
                        this.marketList.push(dataobj)
                    }
                    for(let i =0;i<data_fund.length;i++){
                         dataobj = this.translateResult(data_fund[i])
                        this.marketList.push(dataobj)
                    }
                    for(let i =0;i<data_futures.length;i++){
                         dataobj = this.translateResult(data_futures[i])
                        this.marketList.push(dataobj)
                    }
                    for(let i =0;i<data_forex.length;i++){
                         dataobj = this.translateResult(data_forex[i])
                        this.marketList.push(dataobj)
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            })

        },

        async getMarketListByType(type_str){
            var type = type_str
            this.marketList = []

            axios.get('/api/data?type='+type)
            .then((res) => {
                if(res.status == 200){
                    // console.log(res.data.data);
                    var data = res.data.data
                    for(let i =0;i<data.length;i++){
                        var dataobj = this.translateResult(data[i])
                        this.marketList.push(dataobj)
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            })

        },

        translateResult(object){
            var title = object.Name
            var value = object.Price
            var yesterday_value = object.YesterdayPrice
            var last_update = object.Date
            // 若object有changed属性，则为基金
            if(object.Changed){
                var changed = object.Changed
                return {
                    title:title,
                    value:value,
                    yesterday_value:yesterday_value,
                    last_update:last_update,
                    changed:changed
                }
            }else{
                return {
                    title:title,
                    value:value,
                    yesterday_value:yesterday_value,
                    last_update:last_update
                }
            }
        },

        async onChangeData(checked){
            console.log(checked);
            //全部
            if (checked == 1){
                await this.getMarketList()
            }else if(checked == 2){
                await this.getMarketListByType('stock')
            }else if(checked == 3){
                await this.getMarketListByType('fund')
            }else if(checked == 4){
                await this.getMarketListByType('futures')
            }else if(checked == 5){
                await this.getMarketListByType('forex')
            }
        }
    },

    watch:{
        marketList:{
            handler(){
                this.processMarketList()
            },
            deep:true
        }
    }
}

</script>

<style scoped>

.main-container{
    width: calc(100% - 64px);
    padding: 0 32px;
}
.card-zhang{
    background-color: antiquewhite;
}

</style>