
var xhrRequest = function (url, type, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    callback(this.responseText);
  };
  xhr.open(type, url);
  xhr.send();
};

function getCcyPolo() {
  // Construct URL
  var url = 'https://poloniex.com/public?command=returnTicker';

  // Send request to Poloneix
  xhrRequest(url, 'GET', 
    function(responseText) {
      var json = JSON.parse(responseText);
      var ccy1_last = floatFormat(json.USDT_BTC.last,2);
			var ccy1_volume= volFormat(json.USDT_BTC.baseVolume);
      var ccy2_last = floatFormat(json.BTC_LTC.last,5);
			var ccy2_volume= volFormat(json.BTC_LTC.baseVolume);
      var ccy3_last = floatFormat(json.BTC_XMR.last,5);
			var ccy3_volume= volFormat(json.BTC_XMR.baseVolume);
      var ccy4_last = floatFormat(json.USDT_XMR.last,2);
			var ccy4_volume= volFormat(json.USDT_XMR.baseVolume);
      var ccy5_last = floatFormat(json.USDT_BCH.last,2);
			var ccy5_volume= volFormat(json.USDT_BCH.baseVolume);
      console.log("USDT_BTC is " + ccy5_last);


      // Assemble dictionary using our keys
      var dictionary = {
				"Ccy_1_last": ccy1_last,
				"Ccy_2_last": ccy2_last,
				"Ccy_3_last": ccy3_last,
				"Ccy_4_last": ccy4_last,
				"Ccy_5_last": ccy5_last,
			  "Ccy_5_volume": ccy5_volume,	
			  "Ccy_1_volume": ccy1_volume,	
			  "Ccy_2_volume": ccy2_volume,	
			  "Ccy_3_volume": ccy3_volume,	
			  "Ccy_4_volume": ccy4_volume
			};
			

      // Send to Pebble
      Pebble.sendAppMessage(dictionary,
        function(e) {
          console.log("Polo info sent to Pebble successfully!");
        },
        function(e) {
          console.log("Error sending Polo info to Pebble!");
        }
      );
    }
  );
}

// Listen for when the watchface is opened
Pebble.addEventListener('ready',
  function(e) {
    console.log("PebbleKit JS ready!");

    // Get the initial weather
    // getWeather();
		getCcyPolo();
		//getCcyYahoo();
  }
);

// Listen for when an AppMessage is received
Pebble.addEventListener('appmessage',
  function(e) {
    console.log("AppMessage received!");
    // getWeather();
		getCcyPolo();
		//getCcyYahoo();
  }
);


function zeroFill(num, fill) {
  var padd = "0000000000";
  return (padd + num).slice(-fill);
}

function floatFormat(number, n) {
  var _number = parseFloat(number);
  var _pow = Math.pow(10, n);
  return (Math.round(_number * _pow) / _pow).toFixed(n);
}

function volFormat(number){
  var _number = parseInt(number);
  if(_number>=1000*1000){
    _number=floatFormat(_number/(1000*1000),1);
    _number= _number + 'M';
  }else if(_number>=1000){
    _number=floatFormat(_number/(1000),1);
    _number= _number + 'K';
  }else{
    _number=floatFormat(_number/(1),1);
    _number=  String(_number) ;
  }
  return _number;
}