<template>
  <view>
    <view class="clearBox page-title-box">
      <view class="p-title-box clearBox">
        <view class="p-title-box-return" @click="returnAgo()">
          <span class="iconfont icon-zuozhankai" style="color: #ffffff; font-size: 32px"></span>
        </view>
      </view>
      <view class="p-title-box font-fff-16px" style="text-align: center;">分组管理</view>
      <view class="p-title-box clearBox">
        <view class="p-t-page-router" @click="saveEditEquipment()">保存</view>
      </view>
    </view>
    
    <view class="page_background_16181C">  
      <view class="title_style">IMEI：{{ imei_code }}</view>
      <view class="font-ccc-12px" style="padding-bottom: 10px;">输入设备名称</view>
      
      <view class="input_box" style="background: #3B3D41;">
        <input type="text" maxlength="10" placeholder="输入设备名称" />
      </view>
      
      <view class="way_box">
        <view class="way_box_title clearBox">
          <view class="float-left way_box_name">
            <span class="font-fff-16px">路数</span>
          </view>
          <view class="float-left way_box_other_name">
            <span class="font-fff-16px" style="margin-right: 20px;">别名</span>
            <span class="font-ccc-12px">* 不输入默认为路数名称</span>
          </view>
        </view>
        
        <view class="input_box clearBox">
          <view class="float-left font-ccc-12px way_input_name">一路</view>
          <view class="float-left way_input">
            <input type="text" maxlength="10" placeholder="输入别名" />
          </view>
        </view>
      </view>
      
    </view>

  </view>

</template>

<script>
  export default {
    data(){
      return {
        imei_code: ""
      }
    },

    onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
      // console.log(option.id); //打印出上个页面传递的参数。
      this.imei_code = JSON.parse(decodeURIComponent(option.IMEIcode));

      // console.log(JSON.parse(option.obj));
    },

    watch: {

    },
    
    methods: {
      returnAgo () {
        uni.navigateTo({
          url: `../home/Equipment`,
        });
      },
      
      saveEditEquipment () {
        
      }
    }
  }
</script>

<style>
  @import "../../public/css/basic.css";
  .input_box {
    height: 40px;
    background: #424242;
    border-radius: 8px;
    border: 1px solid #424242;
    font-size: 12px;
    color: #ffffff;
    padding: 10px 16px;
    height: 22px;
    line-height:22px;
  }
  .title_style {
    height: 50px;
    line-height:60px;
    font-size: 14px;
    font-weight: bold;
    color: #54BEB6;
  }
  .way_box {
    border: 1px solid #16181C;
    padding-top: 60px;
    
  }
  .way_box_title {
    margin-bottom: 20px;
  }
  .way_box_name {
    width: 30%;
  }
  .way_box_other_name {
    width: 70%
  }
  .way_input_name {
    width: 20%;
    border-right: 1px solid #cFcFcF;
  }
  .way_input {
    width: 60%;
    padding: 0px 5%;
  }
</style>
