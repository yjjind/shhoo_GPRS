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
        <view class="p-t-page-router" style="color: #54BEB6" @click="saveEditEquipment()">保存</view>
      </view>
    </view>
    
    <view class="page_background_16181C" style="border: 1px solid #16181C;">
      <view class="group-name clearBox" @click="editEquipmentName()">
        <view class="group-name-box">分组名称</view>
        <view class="group-name-box">
          <view class="group-name-box-btn">未填写 &gt;</view>
        </view>
      </view>
      
      <!-- 当前分组的设备 -->
      <view>
        <view class="font-ccc-14px" style="border: 1px solid #16181C;">当前分组的设备</view>
        <view class="now-equipment-box clearBox">
          <view :class="{now_equipment_item: true, 'float-left': index % 2 === 0, 'float-right': index % 2 === 1}" v-for="(item,index) in 5" :key="index">
            <view class="now-equipment-item-name">分组名称</view>
            <view class="now-equipment-item-btn">
              <span class="iconfont icon-shanchu" style="color: red"></span>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 已绑定的设备 -->
      <view>
        <view class="font-ccc-14px" style="border: 1px solid #16181C;">已绑定的设备</view>
        <view class="now-equipment-box clearBox">
          <view :class="{now_equipment_item: true, 'float-left': index % 2 === 0, 'float-right': index % 2 === 1}" v-for="(item,index) in 5" :key="index">
            <view class="now-equipment-item-name">分组名称</view>
            <view class="now-equipment-item-btn">
              <span class="iconfont icon-zengjiatianjiajiahao" style="color: #54BEB6"></span>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    
    <view class="dialog-box" v-show="showDaialog" style="width: 90%">
      <view class="dialog-box-title">分组名称</view>
      <view class="dialog-box-content">
        <input type="text" maxlength="10" placeholder="请输入分组名称,最多10个汉字" />
      </view>
      <view class="prompt">* 名称仅支持汉字，最多10个汉字</view>
      <view class="dialog-btn-box clearBox">
        <view class="dialog-btn">
          <view class="d-btn" @click="showDaialog = false">取消</view>
        </view>
        <view class="dialog-btn">
          <view class="d-btn" @click="confirmDelete()">删除</view>
        </view>
      </view>
    </view>
  
  </view>
</template>

<script>
  export default {
    data () {
      return {
        editState: false,
        showDaialog: false
      }
    },
    
    methods: {
      returnAgo () {
        wx.navigateTo({
          url: `../home/GroupAdmin`,
        });
      },
      
      saveEditEquipment () {},
      
      editEquipmentName () {
        this.showDaialog = true;
      }
    }
  }
</script>

<style>
  @import "../../public/css/basic.css";
  .group-name {
    background: #2E2E2E;
    color: #ffffff;
    height: 47px;
    border-radius: 8px;
    font-size: 12px;
    padding: 0px 10px;
    margin: 20px 0px;
  }
  .group-name-box {
    float: left;
    width: 50%;
    height: 47px;
    line-height: 47px;
  }
  .group-name-box-btn {
    height: 47px;
    line-height: 47px;
    float: right;
  }
  
  .now-equipment-box {
    width: 100%;
    margin: 20px 0px;
  }
  .now_equipment_item {
    /* float: left; */
    width: 48%;
    height: 46px;
    line-height: 46px;
    margin: 7px 0px;
    background: #2E2E2E;
    border-radius: 8px;
  }
  .now-equipment-item-name, .now-equipment-item-btn {
    margin: 0px 10px;
    height: 46px;
    line-height: 46px;
  }
  .now-equipment-item-name {
    float: left;
    font-size: 12px;
    color: #ffffff
  }
  .now-equipment-item-btn {
    float: right;
    font-size: 18px;
  }
  .dialog-box{
    width: 95%;
    margin: 0px 10px;
    padding: 0px 10px 20px;
  }
  .dialog-box-title {
    height: 50px;
    line-height:50px;
    font-size: 18px;
    font-weight: bold;
    color: #ffffff;
    padding-left: 10px;
  }
  .dialog-box-content {
    height: 22px;
    line-height:22px;
    background: #3B3D41;
    border-radius: 5px;
    padding: 10px 15px 12px;
    font-size: 12px;
    color: #ffffff;
  }
  
  .prompt {
    font-size: 12px;
    color: #ffffff;
    margin: 20px 0px;
    padding-left: 10px;
  }
</style>
