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
        <view class="p-t-page-router" @click="routerEditEquipment()">添加分组</view>
      </view>
    </view>
    
    <view class="page_background_16181C">
      <view class="clearBox title_box">
        <view class="title_box_name">3个分组</view>
        <view class="clearBox title_box_btn ">
          <view class="title_box float-right font-color-54BEB" @click="editGroupEquipment()">编辑</view>
        </view>
      </view>
      
      <view :class="{group_equipment: true, group_equipment_border_top: index === 0, group_equipment_border_bottom: index === 2}" v-for="(item, index) in 3" :key="index">
        <view class="float-left btn_box" v-if="editState" @click="removeEquipment()">
          <span class="iconfont icon-shanchu"></span>
        </view>
        <view class="float-left">九溪基地</view>
        <view class="float-right">有 1 个设备 ></view>
      </view> 
    </view>
    
    <view class="dialog-box" v-show="showDaialog">
      <view class="dialog-box-title">提示</view>
      <view class="dialog-box-content">
        您要删除 “ 龙街基地 ” 吗？删除后此分组的设备将会被移除，您可以在全部分组种查看 
      </view>
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
      editGroupEquipment () {
        this.editState = true;
      },
      
      removeEquipment () {
        this.showDaialog = true
      },
      confirmDelete () {
        this.showDaialog = false;
      },
      
      returnAgo () {
        uni.navigateTo({
          url: `../index/index`,
        });
      },
      
      routerEditEquipment() {
        uni.navigateTo({
          url: `../home/EditEquipment`,
        });
      }
    }
  }
</script>

<style>
  @import "../../public/css/basic.css";  
  .title_box {
    height: 50px;
    line-height: 50px;
    font-size: 14px;
  }
  .title_box_name, .title_box_btn {
    float: left;
    width: 50%;
    height: 50px;
    color: #999999;
  }
  .title_box_btn {
    text-align: right;
    color: #54BEB6;
  }
  
  .group_equipment {
    background: #2E2E2E;
    color: #ffffff;
    font-size: 12px;
    height: 50px;
    line-height: 50px;
    padding: 0px 15px;
    margin: 2px 0px;
  }
  
  .btn_box {
    height: 50px;
    line-height: 50px;
    margin-right: 12px;
    font-size: 18px;
    font-weight: bold;
    color: red;
  }
  
  .group_equipment_border_top {
    border-radius: 8px 8px 0px 0px;
  }
  .group_equipment_border_bottom {
    border-radius: 0px 0px 8px 8px;
  }
  
  .dialog-box-title {
    height: 50px;
    line-height:50px;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: #ffffff;
  }
  
  .dialog-box-content {
    line-height:18px;
    padding: 13px 20px 30px;
    text-align: center;
    color: #ffffff;
    font-size: 12px
  }

</style>
