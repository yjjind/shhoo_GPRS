<template>
  <!-- 添加设备扫码页面 -->
  <view class="background_16181C">
    <view class="clearBox page-title-box">
      <view class="p-title-box clearBox">
        <view class="p-title-box-return" @click="returnAgo()">
          <span class="iconfont icon-zuozhankai" style="color: #ffffff; font-size: 32px"></span>
        </view>
      </view>
      <view class="p-title-box font-fff-16px" style="text-align: center;">添加设备</view>
      <view class="p-title-box clearBox">
        <view class="p-t-page-router" style="color: #54BEB6" @click="photoAlbum()">相册</view>
      </view>
    </view>
    <view class="code_box">
      hello this is  eqipment
      <view class="code"></view>
    </view>
    
    <view class="control_background">
      <view class="message_style">
        请于产品包装盒找到 IMEI 二维码，并开始扫描
      </view>
      <view class="IMEI_input_box">
        <input type="text" v-model="IMEIcode" placeholder="点击此处手动输入设备 IMEI 码" />
      </view>
      <view class="IMEI_input_box">
        <input type="text" v-model="masterName" placeholder="点击此处手动输入基地名称" />
      </view>
      <view class="nuxt_button" @click="nextPage()">下 一 步</view>
      <view class="prompt">扫码直接到下一步，手动输入点击下一步</view>
    </view>
  </view>
  
</template>

<script>
  export default {
    data () {
      return {
        IMEIcode: "",
        wxResult: [],
        equipmentChannel: 0,
        masterName,
        channelNameArray,
      }
    },
    
    created(){
      this.saoma();
      this.$store.dispatch("connectMqttClient"); 
    },
    
    // onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
    //   // console.log(option.id); //打印出上个页面传递的参数。
    //   // // const item = JSON.parse(decodeURIComponent(option.item)); 
    //   // console.log(JSON.parse(option.obj));
    //   if (this.mqttConnStat === 1 && IMEIcode !== "") {
    //     // this.selectAllUserGPRS();
    //   } else if (this.mqttConnStat === 2) {
    //     //表明正在连接，显示loading
    //   } else if (this.mqttConnStat === 0) {
    //     //表明没有连接，进行连接
    //     this.$store.dispatch("connectMqttClient");     
    //   } else {
    //     //不可能的状态 
    //   }
    //   this.$store.dispatch("connectMqttClient"); 
    // },

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
      // mqttConnStat:{
      //   handler: function (newVal, oldVal) {
      //     if (newVal === 1 && oldVal === 2 && this.IMEIcode !== "") {
      //       this.selectSomeOneGPRS();
      //     }
      //   },
      //   deep: true
      // },
      
      mqttMessage: {
        handler: function () {
          console.log("what");
          let _this = this;
          let data = JSON.parse(this.mqttMessage);
          // console.log("-----res data : ", this.mqttMessage);
          console.log("-----res data : ",  data);
          if (data.confTyp === "DEVICE" && data.method === "QUERY_ONE") {
            console.log("-----扫码res data : ",  data);
            this.equipmentChannel = data.para.channel;
            for(let i=0; i < this.equipmentChannel - 1; i++){
              this.channelNameArray.push( i + 1 + "路");
            }
          }
        },
        // deep: true
      },

      wxResult: {
        handler: function(val, oldVal) {
          let _this = this;
          val.forEach((item, index) => {
            if(item.indexOf("IMEI") !== -1){
              _this.IMEIcode = item.substr(item.indexOf(":") + 1);
              console.log("====>IMEIcode: ", _this.IMEIcode);
              // _this.selectSomeOneGPRS();
            }
          });
        },
        deep: true
      }
    },
    
    methods: {
      saoma(){
        let _this = this;
        uni.scanCode({
          success: function (res) {
            console.log('条码类型：' + res.scanType);
            console.log('条码内容：' + res.result, typeof res.result);
            _this.wxResult = res.result.split(";");
            console.log("====>c: ", _this.wxResult);
          }
        });
      },
      
      returnAgo () {
        uni.navigateTo({
          url: `../index/index`,
        });
      },
      
      photoAlbum () {},
      
      nextPage () {
        let _this = this;
        let data = JSON.stringify({
          confTyp:"DEVICE",
          method: "BIND",
          qryId: "135776125701583377509",
          para:{
              tel: "18788483951",
              deviceTyp:"GPRS_CTRL",
              IMEI:"867857035021067",
              masterName:"龙街",
              channelNameArray: [
                  "1",
                  "2"
              ],
              local: "玉溪XX镇",
              bindCode: "shhoo2020"
          }
        });
      },

      selectSomeOneGPRS () {
        let _this = this;
        let data = JSON.stringify({
          confTyp:"DEVICE",
          method:"QUERY_ONE",
          qryId:"135776125701583377509",
          para:{
              deviceTyp:"GPRS_CTRL",
              IMEI: _this.IMEIcode
          }
        });
        console.log("------- start -------", data);
        this.$store.commit("PUBLISH", data);
      }
    }
  }
</script>

<style>
  @import "../../public/css/basic.css";
  .background_16181C {
    background: #16181C;
    min-height: 1250upx;
  }
  .code_box {
    background: #16181C;
    min-height: 300px;
    padding: 0px 10px;
    border: 1px solid #16181C;
  }
  .control_background {
    background: #2E2E2E;
    min-height: 400px;
    padding: 5px 20px;
  }
  .message_style {
    font-size: 12px;
    color: #ffffff;
    text-align: center;
    border: 1px solid #2E2E2E;
    margin-bottom: 40px;
  }
  .IMEI_input_box {
    background: #3B3D41;
    font-size: 12px;
    color: #ffffff;
    padding: 10px 16px;
    height: 22px;
    line-height:22px;
    border-radius: 5px;
    border: 1px solid #3B3D41;
    margin-top: 10px;
  }
  .nuxt_button {
    background: #54BEB6;
    font-size: 12px;
    color: #ffffff;
    padding: 10px 16px;
    height: 22px;
    line-height:22px;
    border-radius: 5px;
    text-align: center;
    margin-top: 18px;
  }
  .prompt {
    font-size: 12px;
    color: #FF3399;
    padding-top: 15px;
  }
</style>
