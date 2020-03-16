<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
      this.$store.dispatch("connectMqttClient");
      // this.$store.dispatch('connectMqtt');
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
  @font-face {font-family: "iconfont";
    src: url('//at.alicdn.com/t/font_1676755_hbu7kol263.eot?t=1584083309423'); /* IE9 */
    src: url('//at.alicdn.com/t/font_1676755_hbu7kol263.eot?t=1584083309423#iefix') format('embedded-opentype'), /* IE6-IE8 */
    url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAQEAAsAAAAACIgAAAO3AAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDMgqECINpATYCJAMUCwwABCAFhG0HZxuUB8guCmyHyxsi38s6JSr5TfBAeflvkO12Uhibr5N0BcyjrJOLrNrykVvtHqYSTYQT7tadA+RX3ikVTm8CBCA2QICZ+YtL09ROwbp2FpdaqiaUCWCoAsVipX5r+J3sH6SC2S+yOwK16PshAEOSAqJu/dePxgCNsU8Aom8vjY1Byo6uaRV4EXhKztWIhVh45Sx5DVjgf774SoW8ILEUxtGGu6sbl8/7cEVNdCdq66JQDOcFuItAAQVAgxhc6u+rHeYLKIyyukNNDQxeJHKoRVU+jP5wxXURqzdkNKaeIf7xJBqEB6M5AICauKDhQ56NQMGHKggEfBiNQMKHK8oHcy8LAAOEgo3ABygtwzKBQuMfHRAQYoUyhMadA1ZMimq+fFJ0C//6y6OWRjRdOjG22TJ7RacHD5o/fNji/v1m9+6NJtqmgTT5hz140Cpg9nIhJq2wA+csg4lLIcsMK3caMXt3nDCOFHzzPbYt1uzJFtt2xWLP2QUTd5oWNqaNje7E725L0wPbnI3pgO72Mo3GHYdW3rxlROSI9etHRP/YOLHr0aM/814dPjzc3MKtUZeW6uOmxJU66rjDfmvPV8eOKayZT6VYTasrTZkZ4Aawlf4JuNXqkhJ9TB8v+X+ckTBajZeVlASojFXq/FW1yuSev7hK2q5djJdfuxq/ePp0OTOc8GVACZ+lC89xUki5UdjKcBG2Koz1Zy84F0oanvedF/Ocaxy463vj+/vaGeeU9XWmOv+7+Mzt/+c5pxws3wUfIxmdsoWsAO4phS+uScM9o06oGgCqi7z6D3wNfoti7Q7BVX95bQ3Ak0WN+/kx95Smm/xFGgAr3rgC2KdVleGwtNxty+VNFtX4AyC5EQO853CYF8MYI8FZEHhTCg4kfiSCwksGWuMLwMKmEnjwUgMM+RpcbBNusDZC+wN5piEQhDgAkiBOgiLEdbTGPweLKN/BQ0gKDM0Lv6ZNVr1MncGEQjV0HgW9unBSlktGQesb6RIwJ1U+74vyxqbAKfJlSw+UKA9xwpDh+mDoUAXdB3OE+uhhFALDwMHsqJKdnkNlfVFc3L3snXa6DIiNEXVkBAlSA539Ab1UWKLc4WKU+/g3RCsClGt6KuJfSLZh5weOIj4A+kGfQD2X8pghvmkHhhIK6C5jEaiPvCSYeQYGlm9ySEXs6Nkhu3ahmAzqDtXvTG+M93gGMBg3t4QUSmhhCQ9m9DD+N5g82v4Qf2llyvbobkk7i2JpkyfFtzPI8yE9iyuek/43VtA2GgA=') format('woff2'),
    url('//at.alicdn.com/t/font_1676755_hbu7kol263.woff?t=1584083309423') format('woff'),
    url('//at.alicdn.com/t/font_1676755_hbu7kol263.ttf?t=1584083309423') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
    url('//at.alicdn.com/t/font_1676755_hbu7kol263.svg?t=1584083309423#iconfont') format('svg'); /* iOS 4.1- */
  }

  .iconfont {
    font-family: "iconfont" !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
