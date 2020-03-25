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
                <view class="group-name-box">分组名称 {{ groupName }}</view>
                <view class="group-name-box">
                    <view class="group-name-box-btn">{{ btnState ? '未填写' : '修改' }} &gt;</view>
                </view>
            </view>

            <view v-if="groupName === ''" class="font-fff-12px">还未未添加分组名称，请先添加分组</view>

            <!-- 当前分组的设备 -->
            <view v-show="groupName !== ''">
                <view class="font-ccc-14px" style="border: 1px solid #16181C;">当前分组的设备</view>
                <view class="now-equipment-box clearBox"
                    v-if="itemGroupDeviveList !== null && itemGroupDeviveList.length > 0">
                    <view :class="{
              now_equipment_item: true,
              'float-left': index % 2 === 0,
              'float-right': index % 2 === 1
            }" v-for="(item, index) in itemGroupDeviveList" :key="index">
                        <view class="now-equipment-item-name">{{ item.name }}</view>
                        <view class="now-equipment-item-btn" @click="reduceEdit(item)">
                            <span class="iconfont icon-shanchu" style="color: red"></span>
                        </view>
                    </view>
                </view>
                <view class="img_box" v-if="itemGroupDeviveList === null || itemGroupDeviveList.length === 0">
                    <image src="../../static/null.png" class="img_style"></image>
                </view>
            </view>

            <!-- 已绑定的设备 -->
            <view v-show="groupName !== ''">
                <view class="font-ccc-14px" style="border: 1px solid #16181C;">已绑定的设备</view>
                <view class="now-equipment-box clearBox">
                    <view :class="{
              now_equipment_item: true,
              'float-left': index % 2 === 0,
              'float-right': index % 2 === 1
            }" v-for="(item, index) in haveBindingList" :key="index">
                        <view class="now-equipment-item-name">{{ item.name }}</view>
                        <view class="now-equipment-item-btn" @click="addEquipment(item)">
                            <span class="iconfont icon-zengjiatianjiajiahao" style="color: #54BEB6"></span>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <view class="dialog-box" v-show="showDaialog">
            <view class="dialog-box-title">分组名称</view>
            <view class="dialog-box-content">
                <input type="text" maxlength="10" placeholder="请输入分组名称,最多10个汉字" v-model="groupName" />
            </view>
            <view class="prompt">* 名称仅支持汉字，最多10个汉字</view>
            <view class="dialog-btn-box clearBox">
                <view class="dialog-btn">
                    <view class="d-btn" @click="showDaialog = false">取消</view>
                </view>
                <view class="dialog-btn">
                    <view class="d-btn" @click="commitSave()">确定</view>
                </view>
            </view>
        </view>

        <view class="dialog-box" v-show="messageDaialog">
            <view class="dialog-box-title">提示</view>
            <view class="font-fff-14px" style="padding: 0px 15px">
                {{ messageContent }}
            </view>
            <view class="dialog-btn-box clearBox" v-show="deleteBtn === true">
                <view class="dialog-btn">
                    <view class="d-btn" @click="messageDaialog = false">取消</view>
                </view>
                <view class="dialog-btn">
                    <view class="d-btn" @click="reduceEquipment()">确定</view>
                </view>
            </view>
            <view class="dialog-btn-box clearBox" v-show="deleteBtn === false">
                <view class="d-btn" @click="saveFinifsh()">关闭</view>
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
                deviceIdArray: [],
                groupName: '',
                groupId: '',
                groupItem: {},
                editState: false,
                showDaialog: false,
                itemGroupDeviveList: [],
                allGroupDeviveList: [],
                haveBindingList: [],
                messageDaialog: false,
                messageContent: '删除成功',
                messageBtn: false,
                deleteBtn: false,
                deleteItem: {},
                loginShow: false,
                btnState: false
            };
        },

        created() {
            // console.log('start created: ', this.mqttConnStat);
            let _this = this;
            // this.loginShow = true;
            this.haveBindingList = [];
            // if (this.mqttConnStat === 1) {
            //     // this.selectAllGroupEquipment();
            //     console.log("cccccccccccccccccccccc: ", this.groupItem, JSON.stringify(_this.groupItem));
            //     if (this.groupItem !== null && JSON.stringify(_this.groupItem) !== "{}") {
            //         this.selectAllGroupEquipment();
            //         this.selectSomeOneGroupEquipment();
            //     }
            //     // this.selectSomeOneGroupEquipment();
            //     // if (this.groupId !== '') {
            //     // 	this.selectSomeOneGroupEquipment();
            //     // }
            // } else if (this.mqttConnStat === 2) {
            //     //表明正在连接，显示loading
            // } else if (this.mqttConnStat === 0) {
            //     //表明没有连接，进行连接
            //     this.$store.dispatch('connectMqttClient');
            // } else {
            //     //不可能的状态
            // }
        },

        onLoad: function (option) {
            let _this = this;
            //option为object类型，会序列化上个页面传递的参数
            // console.log(option.id); //打印出上个页面传递的参数。
            // this.groupId = option.groupId;
            this.groupItem = JSON.parse(option.group);
            this.groupId = this.groupItem !== null ? this.groupItem.groupId : '';
            this.groupName = this.groupItem !== null ? this.groupItem.groupName : '';
            this.btnState = this.groupItem !== null ? false : true;
            if (this.mqttConnStat === 1) {
                if (this.groupItem !== null && JSON.stringify(_this.groupItem) !== "{}") {
                    this.loginShow = true;
                    this.selectAllGroupEquipment();
                    this.selectSomeOneGroupEquipment();
                }
            } else if (this.mqttConnStat === 2) {
                //表明正在连接，显示loading
            } else if (this.mqttConnStat === 0) {
                //表明没有连接，进行连接
                this.$store.dispatch('connectMqttClient');
            } else {
                //不可能的状态
            }

            // if (this.groupItem !== null && JSON.stringify(_this.groupItem) !== "{}") {
            //     this.loginShow = true;
            //     this.selectAllGroupEquipment();
            //     this.selectSomeOneGroupEquipment();
            // }

            console.log('=====>666: ', option, this.groupItem, JSON.stringify(_this.groupItem));
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
            },
            userTel() {
                return this.$store.state.userTel;
            }
        },

        watch: {
            mqttConnStat: {
                handler: function (newVal, oldVal) {
                    let _this = this;
                    if (newVal === 1) {
                        if (this.groupItem !== null && JSON.stringify(_this.groupItem) !== "{}") {
                            this.selectAllGroupEquipment();
                            this.selectSomeOneGroupEquipment();
                        }
                    }
                },
                deep: true
            },

            mqttMessage: {
                handler: function () {
                    let _this = this;
                    let data = JSON.parse(this.mqttMessage);
                    if (
                        data.confTyp === 'GROUP' &&
                        data.method === 'ADD_GROUP' &&
                        data.status === 'success' &&
                        data.qryId === _this.userTel + _this.userTel
                    ) {
                        this.loginShow = false;
                        this.messageDaialog = true;
                        this.messageContent = '添加组成功';
                        this.messageBtn = false;
                        this.showDaialog = false;
                        if (this.groupId === '') {
                            this.selectAllGroup();
                        }
                    }

                    if (
                        data.confTyp === 'GROUP' &&
                        data.method === 'ADD_GROUP' &&
                        data.status !== 'success' &&
                        data.qryId === _this.userTel + _this.userTel
                    ) {
                        this.loginShow = false;
                        this.messageDaialog = true;
                        this.messageContent = '添加组失败, 该组名已经存在，请重新填写组名';
                        this.messageBtn = false;
                        this.showDaialog = false;
                        this.groupName = "";
                        console.log("---->添加组失败: ", data);
                    }

                    if (
                        data.confTyp === 'GROUP' &&
                        data.method === 'QUERY_GROUP' &&
                        data.status === 'success' &&
                        data.qryId === _this.userTel + _this.userTel
                    ) {
                        this.loginShow = false;
                        data.para.forEach(item => {
                            if (item.groupName === _this.groupName) {
                                _this.groupItem = item;
                                _this.groupId = item.groupId;
                            }
                        });
                        this.selectAllGroupEquipment();
                        this.selectSomeOneGroupEquipment();
                    }

                    if (
                        data.confTyp === 'GROUP' &&
                        data.method === 'UPDATE_GROUP' &&
                        data.status === 'success' &&
                        data.qryId === _this.userTel + _this.userTel
                    ) {
                        this.showDaialog = false;
                        this.messageDaialog = true;
                        this.messageContent = '修改组名成功';
                        this.messageBtn = false;
                        this.loginShow = false;
                    }

                    if (
                        data.confTyp === 'GROUP' &&
                        data.method === 'UPDATE_GROUP' &&
                        data.status !== 'success' &&
                        data.qryId === _this.userTel + _this.userTel
                    ) {
                        this.showDaialog = false;
                        this.messageDaialog = true;
                        this.messageContent = '修改组名失败';
                        this.messageBtn = false;
                        this.loginShow = false;
                    }

                    if (
                        data.confTyp === 'DEVICE' &&
                        data.method === 'QUERY' &&
                        data.status === 'success' &&
                        data.qryId === _this.userTel + _this.userTel
                    ) {
                        // let setData = new Set();
                        // let lastArr = [];
                        this.loginShow = true;
                        this.allGroupDeviveList = Array.isArray(data.para) ? data.para : [];

                        // if (this.allGroupDeviveList.length > 0) {
                        //     this.allGroupDeviveList.forEach(item => {
                        //         // setData.add(JSON.stringify(item));
                        //         setData.add(item.IMEI);
                        //     });
                        //     setData = Array.from(setData);
                        // }
                        // setData.forEach(item => {
                        //     let i = 0;
                        //     this.allGroupDeviveList.forEach(items => {
                        //         console.log("wcccccccccccccccccccccc:", i, item, items.IMEI, item === items
                        //             .IMEI && i === 0);
                        //         if (item === items.IMEI && i === 0) {
                        //             console.log("22222cccccccccccccccccc:", i);
                        //             lastArr.push(items);
                        //             i++
                        //         }
                        //     });
                        // });
                        // this.allGroupDeviveList = [];
                        // this.allGroupDeviveList = lastArr;

                        console.log('=====>所有组设备: ', this.allGroupDeviveList);
                        // console.log('=====>所有组设备lastArr: ', lastArr.length, lastArr);
                        this.computedArr();
                    }

                    if (
                        data.confTyp === 'GROUP' &&
                        data.method === 'QUERY_DEVICE' &&
                        data.status === 'success' &&
                        data.qryId === _this.userTel + _this.userTel
                    ) {
                        this.loginShow = true;
                        this.itemGroupDeviveList = Array.isArray(data.para) ? data.para : [];
                        if (Array.isArray(data.para) && this.itemGroupDeviveList.length > 0) {
                            this.itemGroupDeviveList.forEach(item => {
                                _this.deviceIdArray.push(item.deviceId);
                            });
                        }
                        console.log('=====>某个组设备: ', data);
                        this.computedArr();
                    }

                    if (
                        data.confTyp === 'GROUP' &&
                        data.method === 'QUERY_DEVICE' &&
                        data.status !== 'success' &&
                        data.qryId === _this.userTel + _this.userTel
                    ) {
                        this.itemGroupDeviveList = Array.isArray(data.para) ? data.para : [];
                    }

                    if (
                        data.confTyp === 'GROUP' &&
                        data.method === 'ADD_DEVICE' &&
                        data.status === 'success' &&
                        data.qryId === _this.userTel + _this.userTel
                    ) {
                        this.messageDaialog = true;
                        this.messageContent = '添加设备成功';
                        this.messageBtn = true;
                        this.loginShow = false;
                        // this.selectAllGroupEquipment();
                        // this.selectSomeOneGroupEquipment();
                    }

                    if (
                        data.confTyp === 'GROUP' &&
                        data.method === 'REMOVE_DEVICE' &&
                        data.status === 'success' &&
                        data.qryId === _this.userTel + _this.userTel
                    ) {
                        this.loginShow = false;
                        this.messageDaialog = true;
                        this.messageContent = '删除设备成功';

                        this.itemGroupDeviveList.splice(
                            this.itemGroupDeviveList.indexOf(this.deleteItem),
                            1
                        );

                        this.haveBindingList.push(this.deleteItem);
                        this.deviceIdArray.splice(
                            this.deviceIdArray.indexOf(_this.deleteItem.deviceId),
                            1
                        );
                        this.messageBtn = false;
                        this.deleteBtn = false;
                        // this.selectAllGroupEquipment()
                        // this.selectSomeOneGroupEquipment()
                    }
                    if (
                        data.confTyp === 'GROUP' &&
                        data.method === 'REMOVE_DEVICE' &&
                        data.status !== 'success' &&
                        data.qryId === _this.userTel + _this.userTel
                    ) {
                        this.loginShow = false;
                        this.messageDaialog = true;
                        this.messageContent = '删除设备失败';
                        this.messageBtn = false;
                    }
                },
                deep: true
            }
        },

        methods: {
            returnAgo() {
                uni.redirectTo({
                    url: `../home/GroupAdmin`
                });
            },

            computedArr() {
                let _this = this;
                this.loginShow = true;
                this.haveBindingList = []
                if (
                    (Array.isArray(_this.allGroupDeviveList) &&
                        this.itemGroupDeviveList.length === 0) ||
                    this.itemGroupDeviveList === null
                ) {
                    this.haveBindingList = this.allGroupDeviveList;
                    // return // return this.allGroupDeviveList
                } else {
                    this.allGroupDeviveList.forEach((item, index) => {
                        let have = 0;
                        have = _this.itemGroupDeviveList.filter((haveItem, haveIndex) => {
                            return item.IMEI === haveItem.IMEI;
                        }).length;
                        if (have === 0) {
                            this.haveBindingList.push(item);
                        }
                    });
                    // return this.haveBindingList
                }
                this.loginShow = false;
            },

            saveFinifsh() {
                if (this.messageBtn) {
                    this.messageDaialog = false;
                    this.returnAgo();
                } else {
                    this.messageDaialog = false;
                }
            },

            selectAllGroup() {
                let _this = this;
                let data = JSON.stringify({
                    confTyp: 'GROUP',
                    method: 'QUERY_GROUP',
                    qryId: _this.userTel + _this.userTel,
                    para: {
                        tel: _this.userTel
                    }
                });
                this.loginShow = true;
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
                        deviceTyp: _this.groupItem.deviceType,
                    }
                });
                this.loginShow = true;
                console.log("============>item: ", data, this.groupItem);
                this.$store.commit('PUBLISH', data);
            },

            selectSomeOneGroupEquipment() {
                let _this = this;
                let data = JSON.stringify({
                    confTyp: 'GROUP',
                    method: 'QUERY_DEVICE',
                    qryId: _this.userTel + _this.userTel,
                    para: {
                        tel: _this.userTel,
                        deviceTyp: _this.groupItem.deviceType,
                        groupId: _this.groupId
                    }
                });
                this.loginShow = true;
                // console.log('-------->: ', this.groupItem, data);
                this.$store.commit('PUBLISH', data);
            },

            saveEditEquipment() {
                let _this = this;
                let data = JSON.stringify({
                    confTyp: 'GROUP',
                    method: 'ADD_DEVICE',
                    qryId: _this.userTel + _this.userTel,
                    para: {
                        tel: _this.userTel,
                        groupId: _this.groupItem.groupId,
                        deviceTyp: _this.groupItem.deviceType,
                        deviceIdArray: _this.deviceIdArray
                    }
                });
                this.loginShow = true;
                console.log('---------------saveEditEquipment', data);
                this.$store.commit('PUBLISH', data);
            },

            editEquipmentName() {
                this.showDaialog = true;
            },

            commitSave() {
                let _this = this;
                let data;
                if (this.btnState) {
                    data = JSON.stringify({
                        confTyp: 'GROUP',
                        method: 'ADD_GROUP',
                        qryId: _this.userTel + _this.userTel,
                        para: {
                            tel: _this.userTel,
                            deviceTyp: "GPRS_CTRL",
                            groupName: _this.groupName
                        }
                    });
                } else {
                    data = JSON.stringify({
                        confTyp: 'GROUP',
                        method: 'UPDATE_GROUP',
                        qryId: _this.userTel + _this.userTel,
                        para: {
                            tel: _this.userTel,
                            groupId: _this.groupItem.groupId,
                            deviceTyp: "GPRS_CTRL",
                            groupName: _this.groupName
                        }
                    });
                }
                console.log('======>commitSave:', this.btnState, data);
                this.loginShow = true;
                this.$store.commit('PUBLISH', data);
            },

            reduceEdit(item) {
                this.messageDaialog = true;
                this.messageContent = `确定删除设备${item.name}`;
                this.deleteBtn = true;
                this.deleteItem = item;
            },

            reduceEquipment() {
                let _this = this;
                let data = JSON.stringify({
                    confTyp: 'GROUP',
                    method: 'REMOVE_DEVICE',
                    qryId: _this.userTel + _this.userTel,
                    para: {
                        tel: _this.userTel,
                        groupId: _this.groupId,
                        deviceTyp: 'GPRS_CTRL',
                        deviceId: _this.deleteItem.deviceId
                    }
                });
                this.loginShow = true;
                this.$store.commit('PUBLISH', data);
            },

            addEquipment(item) {
                this.deviceIdArray.push(item.deviceId);
                this.itemGroupDeviveList.push(item);
                this.haveBindingList.splice(this.haveBindingList.indexOf(item), 1);
                // let _this = this;
                // let data = JSON.stringify({
                // 	confTyp: 'GROUP',
                // 	method: 'ADD_DEVICE',
                // 	qryId: '187884839511583377509',
                // 	para: {
                // 		tel: '18788483951',
                // 		groupId: _this.groupId,
                // 		deviceTyp: 'GPRS_CTRL',
                // 		deviceIdArray: [1, 2]
                // 	}
                // });
                console.log('addEquipment', item);
                // this.$store.commit('PUBLISH', data);
            }
        }
    };
</script>

<style>
    @import '../../public/css/basic.css';

    .group-name {
        background: #2e2e2e;
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
        background: #2e2e2e;
        border-radius: 8px;
    }

    .now-equipment-item-name,
    .now-equipment-item-btn {
        margin: 0px 10px;
        height: 46px;
        line-height: 46px;
    }

    .now-equipment-item-name {
        float: left;
        font-size: 12px;
        color: #ffffff;
    }

    .now-equipment-item-btn {
        float: right;
        font-size: 18px;
    }

    /* .dialog-box-title {
	height: 50px;
	line-height: 50px;
	font-size: 18px;
	font-weight: bold;
	color: #ffffff;
	padding-left: 10px;
} */
    /* .dialog-box-content {
	height: 22px;
	line-height: 22px;
	background: #3b3d41;
	border-radius: 5px;
	padding: 10px 15px 12px;
	font-size: 12px;
	color: #ffffff;
	margin: 0px 10px;
} */

    .prompt {
        font-size: 12px;
        color: #ffffff;
        margin: 20px 0px;
        padding-left: 10px;
    }

    .img_box {
        border: 1px solid #2E2E2E;
        background: #2E2E2E;
        margin: 20px 0px;
        border-radius: 8px;
    }

    .img_style {
        width: 50%;
        height: 120px;
        margin: 0px auto;
        display: block;
    }
</style>