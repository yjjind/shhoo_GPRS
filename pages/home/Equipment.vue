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
      <view class="code" @click="saoma()">点击此处重新扫码</view>
    </view>

    <view class="control_background">
      <view class="message_style">
        请于产品包装盒找到 IMEI 二维码，并开始扫描
      </view>
      <view class="IMEI_input_box">
        <input type="text" v-model="IMEIcode" placeholder="点击此处手动输入设备 IMEI 码" />
      </view>
      <!-- <view class="IMEI_input_box">
				<input
					type="text"
					v-model="masterName"
					placeholder="点击此处手动输入基地名称"
				/>
			</view> -->
      <view class="nuxt_button" v-show="success" @click="nextPage()">下 一 步</view>
      <view v-show="success" class="prompt">扫码直接到下一步，手动输入点击下一步</view>
    </view>

    <view class="dialog-box" v-show="messageDaialog">
      <view class="dialog-box-title">提示</view>
      <view class="font-fff-14px" style="padding: 0px 15px">
        {{ messageContent }}
      </view>
      <view class="dialog-btn-box clearBox">
        <view class="d-btn" @click="messageDaialog = false">关闭</view>
      </view>
    </view>

    <view>
      <van-cell title="正在加载，请等待" is-link />
      <van-popup :show="loginShow">
        <van-loading type="spinner" color="#1989fa" />
      </van-popup>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        IMEIcode: '',
        wxResult: [],
        equipmentChannel: 0,
        masterName: '',
        channelNameArray: [],
        success: false,
        loginShow: true,
        messageDaialog: false,
        messageContent: ''
      };
    },

    created() {
      this.saoma();
      this.loginShow = false;
      // this.$store.dispatch('connectMqttClient')
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
      },
      userTel() {
        return this.$store.state.userTel;
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

      mqttMessage() {
        console.log('what');
        let _this = this;
        let data = JSON.parse(this.mqttMessage);
        // console.log("-----res data : ", this.mqttMessage);
        if (
          data.confTyp === 'DEVICE' &&
          data.method === 'QUERY_ONE' &&
          data.status === 'success' &&
          data.qryId === _this.userTel + _this.userTel
        ) {
          console.log('-----扫码res data : ', data);
          this.equipmentChannel = data.para.channel;
          // this.messageDaialog = true
          // this.messageContent = '扫码成功，手动输入点击下一步'
          // for (let i = 0; i < this.equipmentChannel - 1; i++) {
          // 	this.channelNameArray.push(i + 1 + '路');
          // }

          this.selectAllGroupEquipment();
        }
        if (
          data.confTyp === 'DEVICE' &&
          data.method === 'QUERY_ONE' &&
          data.status !== 'success' &&
          data.qryId === _this.userTel + _this.userTel
        ) {
          this.messageDaialog = true;
          this.messageContent = '扫码失败，请重试';
          this.loginShow = false;
          console.log('-----扫码失败 data : ', data);
        }

        if (
          data.confTyp === 'DEVICE' &&
          data.method === 'QUERY' &&
          data.status === 'success' &&
          data.qryId === _this.userTel + _this.userTel
        ) {
          this.loginShow = true;
          this.allGroupDeviveList = Array.isArray(data.para) ? data.para : [];
          let have = this.allGroupDeviveList.filter(item => {
            return item.IMEI === _this.IMEIcode
          }).length;
          if (have > 0) {
            this.messageDaialog = true;
            this.messageContent = '扫码失败，该设备已经绑定，不能重复绑定';
          } else {
            this.messageDaialog = true
            this.messageContent = '扫码成功，手动输入点击下一步'
            this.success = true;
          }
          this.loginShow = false;
        }
      }

      // wxResult: {
      //   handler: function(val, oldVal) {
      //     let _this = this;
      //     val.forEach((item, index) => {
      //       if(item.indexOf("IMEI") !== -1){
      //         _this.IMEIcode = item.substr(item.indexOf(":") + 1);
      //         console.log("====>IMEIcode: ", _this.IMEIcode);
      //         // _this.selectSomeOneGPRS();
      //       }
      //     });
      //   },
      //   deep: true
      // }
    },

    methods: {
      saoma() {
        let _this = this;
        uni.scanCode({
          success: function (res) {
            console.log('条码类型：' + res.scanType);
            console.log('条码内容：' + res.result, typeof res.result);
            // _this.wxResult = res.result.split(";");
            let wxResult = res.result.split(';');
            wxResult.forEach((item, index) => {
              if (item.indexOf('IMEI') !== -1) {
                _this.IMEIcode = item.substr(item.indexOf(':') + 1);
                console.log('====>IMEIcode: ', _this.IMEIcode);
                _this.selectSomeOneGPRS();
              }
            });
            console.log('====>c: ', _this.wxResult);
          }
        });
      },

      returnAgo() {
        uni.redirectTo({
          url: `../home/MainPage`
        });
      },

      photoAlbum() {},

      nextPage() {
        uni.redirectTo({
          url: `../home/AddFinishEquipment?IMEIcode=${this.IMEIcode}&channel=${this.equipmentChannel}`
        });
      },

      selectSomeOneGPRS() {
        let _this = this;
        let data = JSON.stringify({
          confTyp: 'DEVICE',
          method: 'QUERY_ONE',
          qryId: _this.userTel + _this.userTel,
          para: {
            deviceTyp: 'GPRS_CTRL',
            IMEI: _this.IMEIcode
          }
        });
        this.loginShow = true;
        console.log('------- start -------', data);
        this.$store.commit('PUBLISH', data);
      },

      selectAllGroupEquipment() {
        let _this = this;
        let data = JSON.stringify({
          confTyp: 'DEVICE',
          method: 'QUERY',
          qryId: _this.userTel + _this.userTel,
          para: {
            tel: _this.userTel,
            deviceTyp: 'GPRS_CTRL'
          }
        });
        this.loginShow = true;
        console.log("============>item: ", data);
        this.$store.commit('PUBLISH', data);
      },
    }
  };
</script>

<style>
  @import '../../public/css/basic.css';

  .background_16181C {
    background: #16181c;
    min-height: 1250upx;
  }

  .code_box {
    background: #16181c;
    min-height: 300px;
    padding: 0px 10px;
    border: 1px solid #16181c;
  }

  .code {
    width: 200px;
    height: 200px;
    color: #ffffff;
    line-height: 200px;
    text-align: center;
    border-radius: 50%;
    margin: 30px auto;
    border: 1px solid #0000FC;
    box-shadow: 0px 1px 28px 10px #0000FC;
  }

  .control_background {
    background: #2e2e2e;
    min-height: 400px;
    padding: 5px 20px;
  }

  .message_style {
    font-size: 12px;
    color: #ffffff;
    text-align: center;
    border: 1px solid #2e2e2e;
    margin-bottom: 40px;
  }

  .IMEI_input_box {
    background: #3b3d41;
    font-size: 12px;
    color: #ffffff;
    padding: 10px 16px;
    height: 22px;
    line-height: 22px;
    border-radius: 5px;
    border: 1px solid #3b3d41;
    margin-top: 10px;
  }

  .nuxt_button {
    background: #54beb6;
    font-size: 12px;
    color: #ffffff;
    padding: 10px 16px;
    height: 22px;
    line-height: 22px;
    border-radius: 5px;
    text-align: center;
    margin-top: 18px;
  }

  .prompt {
    font-size: 12px;
    color: #ff3399;
    padding-top: 15px;
  }
</style>