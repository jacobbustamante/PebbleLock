
//var sjcl = require('sjcl');



var user_param_dict = {};
  

Pebble.addEventListener('ready', function(e) {
  console.log('PebbleKit JS Ready!');
  //console.log(sjcl.codec.hex.fromBits(shcl.hash.sha1.hash('abc')));
});


Pebble.addEventListener('appmessage',
  function(e) {
    var func_name = e.payload.FUNC_DATA;
    var dict;
     
    console.log('Received message: ' + func_name);
     
    switch(func_name) {
       case "send_B":
          dict = {
             'FUNC_DATA':"sent_B",
             'SALT_DATA':"BEB25379D1A8581EB5A727673A2441EE",
             'B_DATA':"0x34a79bcd0f4650dfd44dfeacdb8619977a8cf06919b02041a1d2d0aaa2bfa7aa5c134a05d10a23f2998a38b427dd7ae1fd01542d9c05ab6213dd19f159f8681608d525c5c1a46acb4ea772edd4db031d67f80c200931204ef7bca0785086d376aa1adeec01551a41da9fdca3a2f6dce7b733f5dce5b2df008260b8338cc0450e"
          };
          Pebble.sendAppMessage(dict,
             function(e) {
                console.log('send_B: Send successful.');
             },
             function(e) {
                console.log('send_B: Send failed!');
             }
          );
          break;
       case "send_heartbeat":
          dict = {
             'FUNC_DATA':"heartbeat"
          };
          Pebble.sendAppMessage(dict,
             function(e) {
                console.log('send_heartbeat: Send successful.');
             },
             function(e) {
                console.log('send_heartbeat: Send failed!');
             }
          );
          break;
       case "sent_B":
          console.log("sent_B received");
          sjcl.srp_user.init_exchange(user_param_dict, "alice", "password123");
             console.log('srp init_exchange ' + user_param_dict.a);
          sjcl.srp_user.get_from_host(user_param_dict, e.payload.SALT_DATA, e.payload.B_DATA);
             console.log('srp get_from_host ' + user_param_dict.B.toString());
          sjcl.srp_user.compute_u(user_param_dict);
          sjcl.srp_user.compute_S(user_param_dict);
          
          dict = {
             'FUNC_DATA':"send_A",
             'A_DATA':user_param_dict.A.toString()
          };
          Pebble.sendAppMessage(dict,
             function(e) {
                console.log('send_A: Send successful.');
             },
             function(e) {
                console.log('send_A: Send failed!');
             }
          );
          
          break;
       case "sent_A":
          console.log("sent_A sent");
          break;
       case "heartbeat":
          var time_str = e.payload.TIME_DATA;
          var mac = new sjcl.misc.hmac(user_param_dict.K);
          var out = sjcl.codec.hex.fromBits(mac.encrypt(time_str));
          
          dict = {
             'FUNC_DATA':"beat",
             'BEAT_DATA':out
          };
          Pebble.sendAppMessage(dict,
             function(e) {
                console.log('heartbeat: Send successful.');
             },
             function(e) {
                console.log('heartbeat: Send failed!');
             }
          );
          break;
       case "beat":
          var host_mac = new sjcl.misc.hmac(user_param_dict.K);
          var beat = e.payload.BEAT_DATA;
          var seconds = Math.floor(new Date() / 1000);
          console.log('beat received on host: ' + beat);
          for (var i = seconds - 3; i <= seconds; i++) {
             console.log('time: ' + i.toString());
             console.log('hmac time: ' + sjcl.codec.hex.fromBits(host_mac.encrypt(i.toString())));
          }
    }
  }
);