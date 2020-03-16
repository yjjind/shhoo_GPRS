<template>
	<view class="main">
    <view class="clearBox title-box">
       <view class="title-box-title">尚禾基地</view>
       <view class="title-box-btn" @click="addEquipment()">
         <span class="iconfont icon-zengjiatianjiajiahao"></span>
       </view>
    </view>
<!--    #54BEB -->
		<view class="clearBox">
			<view v-bind:class="{sred: true, checked_border: pageTiele === true}" @click="equipment()">设备</view>
      <view v-bind:class="{sred: true, checked_border: pageTiele === false}" @click="strategy()">策略</view>
		</view>
    
    <view v-if="!groupState" class="clearBox">
      <view :class="{menu_title: true, checked_group_style: checkedGroup === 'all'}">全部</view>
      <view :class="{menu_title: true}">全部</view>
      <view :class="{menu_title: true}">全部</view>
      <view :class="{menu_title: true}">全部</view>
      <view :class="{menu_title: true}" @click="allGroupLayout()">...</view>
    </view>
    
    <view v-if="groupState">
      <view class="clearBox all-group">
        <view class="clearBox" style="width: 100%; float: left">
          <view class="group-item">
            <view class="group-item-content group-item-content-click">
              全部
            </view>
          </view>
        </view>
        
        <view class="group-item" v-for="(item, index) in 6" :key="index">
          <view class="group-item-content">
            九溪基地
          </view>
        </view>
        <view class="group-button" @click="groupAdmin()">
          分组管理 >
        </view>
      </view>
    </view>
   
    
    <view>
      <view class="clearBox" style="height: 28px; margin: 30px 0px 30px 10px;">
        <view class="float-left icon-style">
          <span class="icon iconfont icon-shujukongzhitai" ></span>
        </view>
        <view class="float-left">
          <span style="color: #999999; font-size: 14px;">速控（ 3个设备 ）</span>
        </view>
      </view>
      <view class="content-box" >
        <view class="font-fff-14px">灯光控制1</view>
        
       <view style="margin: 30px 0px 20px;">
          <van-radio-group :value="checked" @change="onChange">
            <van-row gutter="20">
              <van-col span="10">
                <van-radio name="1" checked-color="#54BEB6" icon-size="12px" shape="square" @click="onClick">
                  <span class="font-fff-12px">开启状态</span>
                </van-radio>
              </van-col>
              <van-col span="10">
                <van-radio name="0" checked-color="#54BEB6" icon-size="12px" shape="square" @click="onClick">
                  <span class="font-fff-12px">未开启状态</span>
                </van-radio>
              </van-col>
            </van-row>
          </van-radio-group>          
        </view>
        
        <view class="clearBox equipment-box">
         <view class="equipment-item" v-for="(item, index) in 16" :key="index">
           <view class="equipment-item-content">
             路数名称{{item}}路  
           </view>
         </view>
        </view>
      </view>
    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
        pageTiele: true,
        openState: true,
        groupState: false,
        checkedGroup: "all",
        checked: "1",
        
        obj: {
          arr: [1,2,3,4,5],
          str: "11111",
          bl: true
        },
        show: true
			}
		},
    
    // created () {
    //   console.log("start cnmmp: ", this.mqttConnStat);
    //   if (this.mqttConnStat === 1) {
    //     this.selectAllUserGPRS();
    //   } else if (this.mqttConnStat === 2) {
    //     //表明正在连接，显示loading
    //   } else if (this.mqttConnStat === 0) {
    //     //表明没有连接，进行连接
    //     this.$store.dispatch("connectMqttClient");     
    //   } else {
    //     //不可能的状态
    //   }
    //   // this.$store.dispatch("connectMqttClient"); 
    //   this.selectAllUserGPRS(); 
    // },
    
    onLoad() {
      if (this.mqttConnStat === 1) {
        this.selectAllUserGPRS();
      } else if (this.mqttConnStat === 2) {
        //表明正在连接，显示loading
      } else if (this.mqttConnStat === 0) {
        //表明没有连接，进行连接
        this.$store.dispatch("connectMqttClient");    
        // this.$store.dispatch('connectMqtt');
      } else {
        //不可能的状态 
      }
      this.selectAllUserGPRS();
    },
    
    computed: {
      mqttConnStat() {
        return this.$store.getters.mqttConnStat;
      },
      mqttClient() {
        return this.$store.state.mqttClient;
      },
      mqttMessage() {
        return this.$store.state.mqttMessage;
      },
      mqttBaseTopic() {
        return this.$store.state.mqttBaseTopic;
      }
    },
    
    watch: {
      mqttConnStat: {
        handler: function (newVal, oldVal) {
          if (newVal === 1 && oldVal === 2) {
            console.log("----调接口");
            this.selectAllUserGPRS();
          }
        },
        deep: true
      },
      
      mqttMessage () {
        console.log("what");
        // let _this = this;
        let data = JSON.parse(this.mqttMessage);
        // console.log("-----res data : ", this.mqttMessage);
        console.log("----------主页 data : ",  data);
      }
    },
    
		methods: {
      onChange (event) {
        console.log("------onChange: ", event.detail);
        this.checked = event.detail;
      },

      onClick (event) {
        this.checked = event.currentTarget.dataset;
      },
      
      equipment () {
        console.log("start -----");
        // let obj = JSON.stringify(this.obj)
        // wx.navigateTo({
        //   url: `../home/Equipment?id="222222"&obj=${obj}`,
        // });
      },
      
      strategy () {},
  
      allGroupLayout () {
        console.log("ssssss");
        this.groupState = true;
      },
      
      addEquipment () {
        uni.navigateTo({
          url: `../home/Equipment`,
        });
      },
      
      groupAdmin () {
        uni.navigateTo({
          url: `../home/GroupAdmin`,
        });
      },
      
      selectAllUserGPRS() {
        let _this = this;
        let animalVersionData = JSON.stringify({
          confTyp : "DEVICE",
          method : "QUERY",
          qryId : "135776125701583377509",
          para : {
            tel : "18788483951",
            deviceTyp:"GPRS_CTRL"
          }
        });
         this.$store.commit("PUBLISH", animalVersionData);
        // this.$store.commit("QUERY_DEVICE_INFO", animalVersionData);
      }
		}
	}
</script>

<style>
@import "../../public/css/basic.css";
  .main {
    background: #16181C;
    min-height: 1200upx;
    padding-bottom: 50px
  }
  
  .title-box, .title-box-btn, .title-box-title {
    background: #2E2E2E;
    height: 38px;
  }
  .title-box {
    position: relative
  }
  .title-box-btn, .title-box-title {
    /* float: left; */
    line-height: 38px;
    text-align: center;
    color: #ffffff;
    font-size: 16px;
    font-weight: bold;
    position: absolute;
  }
  .title-box-title {
    left: 41%;
  }
  .title-box-btn {
    width: 15%;
    right: 0px;
  } 
  
  .checked_border {
    border-bottom: 3px solid #54BEB6;
  }
  
  .all-group {
    padding-top: 8px;
   /* border: 1px solid red; */
    border-radius: 8px;
    margin: 0 10px 30px;
    background: #2D2F33;
  }
  
  .group-item {
    float: left;
    width: 33%;
  }
  
  .group-item-content {
    margin: 8px;
    color:#ffffff;
    font-size: 14px;
    border-radius: 19px;
    background: #424242;
    border: 1px solid #424242;
    height: 38px;
    line-height: 38px;
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .group-item-content:hover, .group-item-content-click {
    color: #54BEB6;
    border: 1px solid #54BEB6;
  }
  
  .group-button {
    float: left;
    width: 100%;
    height: 45px;
    line-height: 45px;
    text-align: center;
    font-size: 14px;
    color: #CCCCCC;
    border-top: 1px solid #424242;
    margin-top: 9px;
  }
  
  .menu_title {
    width: 20%;
    float: left;
    color: #ccc;
    font-size: 12px;
    padding: 10px 0px;
    text-align: center;
  }
  .checked_group_style {
    color: #54BEB6;
  }
  
  .icon-style {
    background: #ffffff;
    color: #2E2E2E;
    font-size: 29px;
    height:25px;
    width: 25px;
    line-height: 15px;
    font-weight:bold;
    margin-right: 15px;
    text-align: center;
    border-radius: 5px;
  }
  
  .content-box {
    background: #2E2E2E;
    padding: 15px 10px 50px;
    margin: 10px; 
    border-radius: 10px;
  }
  
  .equipment-box {
    /* margin-right: -30px; */
   margin: 0px -10px;
  }
  
  .equipment-item {
    float: left;
    width: 33%;
    height: 50px;
    margin: 5px 0px;
    color: #999999;
  }
  
  .equipment-item-content {
    margin: 12px 5px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background: #424242;
    font-size: 12px;
    border-radius: 8px;
    color: #999999;
  }
  
</style>
