<template>
  <view class="page_background_16181C content">
    <view class="login_button">
      <button lang="zh_CN" open-type="getUserInfo" @getuserinfo="bindGetUserInfo" withCredentials="true">
        微信授权登录
      </button>
    </view>

    <van-dialog :show="show" title="授权登录" message="是否授权关联您的电话号码?" confirm-button-text="欣然授权"
      confirm-button-color="#71AF65" cancel-button-text="残忍拒绝" show-cancel-button
      confirm-button-open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" @cancel="mobileNumAuthModalHandler">
    </van-dialog>

    <view class="login_button">
      <button lang="zh_CN" @click="showDaialog = true">电话号码登录</button>
    </view>

    <view class="dialog-box" v-show="showDaialog">
      <view class="dialog-box-title">电话号码登录</view>
      <view class="dialog-box-input margin_bottom_box">
        <input type="text" maxlength="5" placeholder="请输入你的名称" v-model="userName" />
      </view>
      <view class="dialog-box-input margin_bottom_box">
        <input type="text" maxlength="11" placeholder="请输入你的手机号码" v-model="userPhone" />
      </view>
      <view :class="{
        'font-fff-12px': true,
        margin_bottom_box: true,
        error_style: errorState
      }" style="padding-left: 15px">{{ errorMessage }}</view>
      <view class="dialog-box-input margin_bottom_box">
        <input type="password" maxlength="15" placeholder="请输入你的密码" v-model="userPwd" />
      </view>

      <view class="dialog-btn-box clearBox">
        <view class="dialog-btn">
          <view class="d-btn" @click="showDaialog = false">取消</view>
        </view>
        <view class="dialog-btn">
          <view class="d-btn" @click="loginGPRS()">确定</view>
        </view>
      </view>
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
  </view>
</template>

<script>
  export default {
    data() {
      return {
        show: false,
        loginRequestData: null,
        showDaialog: false,
        userName: '',
        userPhone: '',
        userPwd: '',
        errorState: false,
        errorMessage: '* 手机号码为必填项，请输入你的手机号码',
        messageDaialog: false,
        messageContent: '',
        myUuid: ''
      };
    },

    created() {},

    onLoad() {
      this.myUuid = this.autoGenerateUuid();
    },

    computed: {},

    watch: {
      userPhone: {
        handler() {
          if (
            this.userPhone.trim !== '' &&
            /^1[3|4|5|7|8|9][0-9]{9}$/.test(this.userPhone)
          ) {
            this.errorState = false;
            this.errorMessage = '* 手机号码为必填项，请输入你的手机号码';
          } else {
            this.errorState = true;
            this.errorMessage = '* 手机号码为必填项，请输入正确的手机号码';
          }
        },
        deep: true
      }
    },

    methods: {
      loginGPRS() {
        let _this = this;
        if (
          this.userPhone.trim !== '' &&
          /^1[3|4|5|7|8|9][0-9]{9}$/.test(this.userPhone)
        ) {
          // this.errorState = false;
          // this.errorMessage = '* 手机号码为必填项，请输入你的手机号码';
          this.$store.commit('SAVE_USER_TEL', this.userPhone);
          wx.request({
            url: 'https://yigrow.cn/api/v2/auth_related/login', //仅为示例，并非真实的接口地址
            method: 'POST',
            data: {
              mobile: _this.userPhone,
              password: _this.userPwd,
              uuid: this.myUuid,
              agent: ''
            },
            success(res) {
              if (res.data.msg === 'success' && res.data.status === 1) {
                uni.redirectTo({
                  url: `../home/MainPage`
                });
              } else {
                _this.messageDaialog = true;
                _this.messageContent = '登录失败，' + res.data.msg;
              }
              console.log('调张老师接口成功了： ', res, res.data.status);
            },
            fail(err) {
              console.log('------err------');
              console.log(err);
            }
          });
        } else {
          this.errorState = true;
          this.errorMessage = '* 手机号码为必填项，请输入正确的手机号码';
          return;
        }
      },

      autoGenerateUuid() {
        var s = [];
        var hexDigits = '0123456789abcdef';
        for (var i = 0; i < 36; i++) {
          s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = '-';

        var uuid = s.join('');
        return uuid;
      },

      bindGetUserInfo(e) {
        let _this = this;
        wx.showLoading({
          title: '加载中'
        });

        wx.login({
          success: function (loginRes) {
            // errMsg和code
            console.log(loginRes);
            if (loginRes.code) {
              wx.getUserInfo({
                success: function (userData) {
                  console.log('userData', userData);
                  _this.loginRequestData = {
                    code: loginRes.code,
                    wxNickName: userData.userInfo.nickName,
                    wxAvatarUrl: userData.userInfo.avatarUrl,
                    gender: userData.userInfo.gender,
                    city: userData.userInfo.city,
                    province: userData.userInfo.province,
                    country: userData.userInfo.country,
                    language: userData.userInfo.language
                  };
                  wx.hideLoading();
                  _this.show = true;
                  console.log(
                    '=====>微信授权成功: ',
                    _this.loginRequestData,
                    _this.show
                  );
                },
                fail: function (err) {
                  wx.hideLoading();
                  Toast.fail('获取用户信息错误');
                }
              });
            } else {
              console.log('登录失败' + loginRes.errMsg);
              wx.hideLoading();
              Toast.fail('登录失败');
            }
          },
          fail: function (err) {
            console.log('接口调用失败' + err);
          }
        });
      },

      getPhoneNumber(e) {
        console.log('获取电话号码: ', e);
        if (e.detail.errMsg === 'getPhoneNumber:ok') {
          this.show = false;
          // 如果获取用户电话号码正确
          console.log(e.detail.errMsg); //getPhoneNumber:fail user deny       getPhoneNumber:ok
          console.log(e.detail.iv);
          console.log(e.detail.encryptedData);
          this.loginRequestData.userEncryptedData = e.detail.encryptedData;
          this.loginRequestData.iv = e.detail.iv;
          this.loginRequest(this.loginRequestData); //调用向业务服务器登录请求
        } else {
          this.show = false;
          wx.hideLoading();
        }
      },

      loginRequest(requestData) {
        console.log('------requestdata------', requestData);
        console.log(requestData);
        let _this = this;
        this.show = false;
        // wx.showLoading({
        //   title: '加载中'
        // });

        wx.request({
          url: `https://yigrow.cn/api/v1/wxminiapp/easygrow_helper/login`,
          method: 'POST',
          data: requestData,
          success: function (userDetail) {
            console.log(' userDetail:', userDetail);
            if (userDetail.data.status === 1) {
              // 将登录成功并取到的用户信息保存到缓存中
              try {
                wx.setStorageSync('isLogin', true);
                if (
                  userDetail.data.data.mobile &&
                  userDetail.data.data.mobile !==
                  'notDefinedYetItsJustPreAllocatedStringTooMuchTooWasteful'
                ) {
                  // 把获取电话号码的标志位置为true
                  wx.setStorageSync('isMobileBind', true);
                } else {
                  console.log(userDetail.data.data.mobile);
                }

                let userInfo = {
                  // 需要存储的用户的基本信息
                  wxNickName: userDetail.data.data.nickName,
                  wxAvatarUrl: userDetail.data.data.avatarUrl,
                  // city: requestData.city,
                  // country: requestData.country,
                  // gender: requestData.gender,
                  // language: requestData.language,
                  // province: requestData.province,
                  mobile: userDetail.data.data.mobile,
                  token: userDetail.data.data.token
                };
                // 存储用户基本信息
                wx.setStorageSync('userInfo', userInfo);
                // 存储用户对应的服务器信息列表
                wx.setStorageSync('userServers', userDetail.data.data.servers);

                // 获取到的服务器信息列表
                if (Array.isArray(userDetail.data.data.servers)) {
                  if (userDetail.data.data.servers.length > 0) {
                    if (
                      typeof userDetail.data.data.servers[0].mqttBaseTopic ===
                      'string'
                    ) {
                      // 默认把第一个topic存储起来
                      // let newTopic = userDetail.data.data.servers[0].mqttBaseTopic
                      // console.log(newTopic)
                      // wx.setStorageSync('mqttBaseTopic', newTopic)
                      // 获取topic
                      // _this.$store.commit('MQTT_BASE_TOPIC', newTopic)
                      console.log('ccccccccccccccccccccccccccccccccccccccccccc');
                    } else {
                      console.log(
                        typeof userDetail.data.data.servers[0].mqttBaseTopic
                      );
                      console.log('服务器列表中获取到的mqttBaseTopic格式错误');
                    }
                  } else {
                    console.log('绑定的列表为空');
                  }
                } else {
                  console.log('服务器列表不是一个数组');
                }
                _this.show = false;
                wx.hideLoading();
                console.log('======= start ========');
                uni.reLaunch({
                  url: '../home/MainPage'
                });
              } catch (e) {
                //TODO handle the exception
                console.log(e);
                _this.show = false;
                wx.hideLoading();
                Toast.fail('缓存信息错误');
              }
            } else {
              _this.messageDaialog = true;
              _this.messageContent = '授权失败，请重试或改用手机号码登录';
              return;
              console.log('========>错误: ', userDetail.data.status);
            }
          },
          fail: function (failReason) {
            console.log(failReason);
            _this.show = false;
            wx.hideLoading();
            Toast.fail('请求服务器失败');
          }
        });
      },

      onConfirm() {
        this.showLogin = false;
        let _this = this;
        let phone;
        let pwd;
        // 使用正则校验输入的是否是正确的电话号码
        if (/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.username)) {
          phone = this.username;
        } else {
          // this.errPhone = '输入的手机号码格式错误，请重新输入'
        }

        if (this.password == '123456') {
          pwd = this.password;
        } else {
          // this.errPwd = '输入的密码错误，请重新输入'
        }

        if (typeof pwd == 'undefined') {
          pwd = '123456';
        } else {
          console.log(pwd);
        }

        wx.request({
          url: 'https://yigrow.cn/api/v2/auth_related/login', //仅为示例，并非真实的接口地址
          method: 'POST',
          data: {
            mobile: phone,
            password: pwd,
            uuid: this.myUuid,
            agent: ''
          },
          success(res) {},
          fail(err) {
            console.log('------err------');
            console.log(err);
          }
        });
      }
    }
  };
</script>

<style>
  @import '../../public/css/basic.css';

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  button {
    color: #ffffff !important;
    background-color: #424242 !important;
  }

  .login_button {
    margin: 10px 0px;
  }

  .margin_bottom_box {
    margin-bottom: 10px;
  }

  .dialog-box {
    margin: 0px;
  }

  .van-dialog__message--has-title {
    color: #ffffff;
    background: #2d2f33;
  }

  .error_style {
    color: red;
  }
</style>