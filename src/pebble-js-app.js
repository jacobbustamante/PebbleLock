
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
          var mac = new sjcl.misc.hmac(user_param_dict.S);
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
          var host_mac = new sjcl.misc.hmac(user_param_dict.S);
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







"use strict";function q(a){throw a;}var s=void 0,t=!1;var sjcl={srp_user:{},cipher:{},hash:{},keyexchange:{},mode:{},misc:{},codec:{},exception:{corrupt:function(a){this.toString=function(){return"CORRUPT: "+this.message};this.message=a},invalid:function(a){this.toString=function(){return"INVALID: "+this.message};this.message=a},bug:function(a){this.toString=function(){return"BUG: "+this.message};this.message=a},notReady:function(a){this.toString=function(){return"NOT READY: "+this.message};this.message=a}}};
"undefined"!==typeof module&&module.exports&&(module.exports=sjcl);"function"===typeof define&&define([],function(){return sjcl});
sjcl.cipher.aes=function(a){this.o[0][0][0]||this.J();var b,c,d,e,f=this.o[0][4],g=this.o[1];b=a.length;var h=1;4!==b&&(6!==b&&8!==b)&&q(new sjcl.exception.invalid("invalid aes key size"));this.b=[d=a.slice(0),e=[]];for(a=b;a<4*b+28;a++){c=d[a-1];if(0===a%b||8===b&&4===a%b)c=f[c>>>24]<<24^f[c>>16&255]<<16^f[c>>8&255]<<8^f[c&255],0===a%b&&(c=c<<8^c>>>24^h<<24,h=h<<1^283*(h>>7));d[a]=d[a-b]^c}for(b=0;a;b++,a--)c=d[b&3?a:a-4],e[b]=4>=a||4>b?c:g[0][f[c>>>24]]^g[1][f[c>>16&255]]^g[2][f[c>>8&255]]^g[3][f[c&
255]]};
sjcl.cipher.aes.prototype={encrypt:function(a){return v(this,a,0)},decrypt:function(a){return v(this,a,1)},o:[[[],[],[],[],[]],[[],[],[],[],[]]],J:function(){var a=this.o[0],b=this.o[1],c=a[4],d=b[4],e,f,g,h=[],k=[],l,n,m,p;for(e=0;0x100>e;e++)k[(h[e]=e<<1^283*(e>>7))^e]=e;for(f=g=0;!c[f];f^=l||1,g=k[g]||1){m=g^g<<1^g<<2^g<<3^g<<4;m=m>>8^m&255^99;c[f]=m;d[m]=f;n=h[e=h[l=h[f]]];p=0x1010101*n^0x10001*e^0x101*l^0x1010100*f;n=0x101*h[m]^0x1010100*m;for(e=0;4>e;e++)a[e][f]=n=n<<24^n>>>8,b[e][m]=p=p<<24^p>>>8}for(e=
0;5>e;e++)a[e]=a[e].slice(0),b[e]=b[e].slice(0)}};
function v(a,b,c){4!==b.length&&q(new sjcl.exception.invalid("invalid aes block size"));var d=a.b[c],e=b[0]^d[0],f=b[c?3:1]^d[1],g=b[2]^d[2];b=b[c?1:3]^d[3];var h,k,l,n=d.length/4-2,m,p=4,u=[0,0,0,0];h=a.o[c];a=h[0];var r=h[1],y=h[2],z=h[3],A=h[4];for(m=0;m<n;m++)h=a[e>>>24]^r[f>>16&255]^y[g>>8&255]^z[b&255]^d[p],k=a[f>>>24]^r[g>>16&255]^y[b>>8&255]^z[e&255]^d[p+1],l=a[g>>>24]^r[b>>16&255]^y[e>>8&255]^z[f&255]^d[p+2],b=a[b>>>24]^r[e>>16&255]^y[f>>8&255]^z[g&255]^d[p+3],p+=4,e=h,f=k,g=l;for(m=0;4>
m;m++)u[c?3&-m:m]=A[e>>>24]<<24^A[f>>16&255]<<16^A[g>>8&255]<<8^A[b&255]^d[p++],h=e,e=f,f=g,g=b,b=h;return u}
sjcl.bitArray={bitSlice:function(a,b,c){a=sjcl.bitArray.W(a.slice(b/32),32-(b&31)).slice(1);return c===s?a:sjcl.bitArray.clamp(a,c-b)},extract:function(a,b,c){var d=Math.floor(-b-c&31);return((b+c-1^b)&-32?a[b/32|0]<<32-d^a[b/32+1|0]>>>d:a[b/32|0]>>>d)&(1<<c)-1},concat:function(a,b){if(0===a.length||0===b.length)return a.concat(b);var c=a[a.length-1],d=sjcl.bitArray.getPartial(c);return 32===d?a.concat(b):sjcl.bitArray.W(b,d,c|0,a.slice(0,a.length-1))},bitLength:function(a){var b=a.length;return 0===
b?0:32*(b-1)+sjcl.bitArray.getPartial(a[b-1])},clamp:function(a,b){if(32*a.length<b)return a;a=a.slice(0,Math.ceil(b/32));var c=a.length;b&=31;0<c&&b&&(a[c-1]=sjcl.bitArray.partial(b,a[c-1]&2147483648>>b-1,1));return a},partial:function(a,b,c){return 32===a?b:(c?b|0:b<<32-a)+0x10000000000*a},getPartial:function(a){return Math.round(a/0x10000000000)||32},equal:function(a,b){if(sjcl.bitArray.bitLength(a)!==sjcl.bitArray.bitLength(b))return t;var c=0,d;for(d=0;d<a.length;d++)c|=a[d]^b[d];return 0===
c},W:function(a,b,c,d){var e;e=0;for(d===s&&(d=[]);32<=b;b-=32)d.push(c),c=0;if(0===b)return d.concat(a);for(e=0;e<a.length;e++)d.push(c|a[e]>>>b),c=a[e]<<32-b;e=a.length?a[a.length-1]:0;a=sjcl.bitArray.getPartial(e);d.push(sjcl.bitArray.partial(b+a&31,32<b+a?c:d.pop(),1));return d},p:function(a,b){return[a[0]^b[0],a[1]^b[1],a[2]^b[2],a[3]^b[3]]},byteswapM:function(a){var b,c;for(b=0;b<a.length;++b)c=a[b],a[b]=c>>>24|c>>>8&0xff00|(c&0xff00)<<8|c<<24;return a}};
sjcl.codec.utf8String={fromBits:function(a){var b="",c=sjcl.bitArray.bitLength(a),d,e;for(d=0;d<c/8;d++)0===(d&3)&&(e=a[d/4]),b+=String.fromCharCode(e>>>24),e<<=8;return decodeURIComponent(escape(b))},toBits:function(a){a=unescape(encodeURIComponent(a));var b=[],c,d=0;for(c=0;c<a.length;c++)d=d<<8|a.charCodeAt(c),3===(c&3)&&(b.push(d),d=0);c&3&&b.push(sjcl.bitArray.partial(8*(c&3),d));return b}};
sjcl.codec.hex={fromBits:function(a){var b="",c;for(c=0;c<a.length;c++)b+=((a[c]|0)+0xf00000000000).toString(16).substr(4);return b.substr(0,sjcl.bitArray.bitLength(a)/4)},toBits:function(a){var b,c=[],d;a=a.replace(/\s|0x/g,"");d=a.length;a+="00000000";for(b=0;b<a.length;b+=8)c.push(parseInt(a.substr(b,8),16)^0);return sjcl.bitArray.clamp(c,4*d)}};
sjcl.codec.base32={t:"0123456789abcdefghjkmnpqrstvwxyz",BITS:32,BASE:5,REMAINING:27,fromBits:function(a){var b=sjcl.codec.base32.BASE,c=sjcl.codec.base32.REMAINING,d="",e,f=0,g=sjcl.codec.base32.t,h=0,k=sjcl.bitArray.bitLength(a);for(e=0;d.length*b<=k;)d+=g.charAt((h^a[e]>>>f)>>>c),f<b?(h=a[e]<<b-f,f+=c,e++):(h<<=b,f-=b);return d},toBits:function(a){var b=sjcl.codec.base32.BITS,c=sjcl.codec.base32.BASE,d=sjcl.codec.base32.REMAINING,e=[],f,g=0,h=sjcl.codec.base32.t,k=0,l;for(f=0;f<a.length;f++)l=h.indexOf(a.charAt(f)),
0>l&&q(new sjcl.exception.invalid("this isn't base32!")),g>d?(g-=d,e.push(k^l>>>g),k=l<<b-g):(g+=c,k^=l<<b-g);g&56&&e.push(sjcl.bitArray.partial(g&56,k,1));return e}};
sjcl.codec.base64={t:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",fromBits:function(a,b,c){var d="",e=0,f=sjcl.codec.base64.t,g=0,h=sjcl.bitArray.bitLength(a);c&&(f=f.substr(0,62)+"-_");for(c=0;6*d.length<h;)d+=f.charAt((g^a[c]>>>e)>>>26),6>e?(g=a[c]<<6-e,e+=26,c++):(g<<=6,e-=6);for(;d.length&3&&!b;)d+="=";return d},toBits:function(a,b){a=a.replace(/\s|=/g,"");var c=[],d,e=0,f=sjcl.codec.base64.t,g=0,h;b&&(f=f.substr(0,62)+"-_");for(d=0;d<a.length;d++)h=f.indexOf(a.charAt(d)),
0>h&&q(new sjcl.exception.invalid("this isn't base64!")),26<e?(e-=26,c.push(g^h>>>e),g=h<<32-e):(e+=6,g^=h<<32-e);e&56&&c.push(sjcl.bitArray.partial(e&56,g,1));return c}};sjcl.codec.base64url={fromBits:function(a){return sjcl.codec.base64.fromBits(a,1,1)},toBits:function(a){return sjcl.codec.base64.toBits(a,1)}};sjcl.hash.sha256=function(a){this.b[0]||this.J();a?(this.f=a.f.slice(0),this.d=a.d.slice(0),this.c=a.c):this.reset()};sjcl.hash.sha256.hash=function(a){return(new sjcl.hash.sha256).update(a).finalize()};
sjcl.hash.sha256.prototype={blockSize:512,reset:function(){this.f=this.A.slice(0);this.d=[];this.c=0;return this},update:function(a){"string"===typeof a&&(a=sjcl.codec.utf8String.toBits(a));var b,c=this.d=sjcl.bitArray.concat(this.d,a);b=this.c;a=this.c=b+sjcl.bitArray.bitLength(a);for(b=512+b&-512;b<=a;b+=512)this.s(c.splice(0,16));return this},finalize:function(){var a,b=this.d,c=this.f,b=sjcl.bitArray.concat(b,[sjcl.bitArray.partial(1,1)]);for(a=b.length+2;a&15;a++)b.push(0);b.push(Math.floor(this.c/
4294967296));for(b.push(this.c|0);b.length;)this.s(b.splice(0,16));this.reset();return c},A:[],b:[],J:function(){function a(a){return 0x100000000*(a-Math.floor(a))|0}var b=0,c=2,d;a:for(;64>b;c++){for(d=2;d*d<=c;d++)if(0===c%d)continue a;8>b&&(this.A[b]=a(Math.pow(c,0.5)));this.b[b]=a(Math.pow(c,1/3));b++}},s:function(a){var b,c,d=a.slice(0),e=this.f,f=this.b,g=e[0],h=e[1],k=e[2],l=e[3],n=e[4],m=e[5],p=e[6],u=e[7];for(a=0;64>a;a++)16>a?b=d[a]:(b=d[a+1&15],c=d[a+14&15],b=d[a&15]=(b>>>7^b>>>18^b>>>3^
b<<25^b<<14)+(c>>>17^c>>>19^c>>>10^c<<15^c<<13)+d[a&15]+d[a+9&15]|0),b=b+u+(n>>>6^n>>>11^n>>>25^n<<26^n<<21^n<<7)+(p^n&(m^p))+f[a],u=p,p=m,m=n,n=l+b|0,l=k,k=h,h=g,g=b+(h&k^l&(h^k))+(h>>>2^h>>>13^h>>>22^h<<30^h<<19^h<<10)|0;e[0]=e[0]+g|0;e[1]=e[1]+h|0;e[2]=e[2]+k|0;e[3]=e[3]+l|0;e[4]=e[4]+n|0;e[5]=e[5]+m|0;e[6]=e[6]+p|0;e[7]=e[7]+u|0}};sjcl.hash.sha1=function(a){a?(this.f=a.f.slice(0),this.d=a.d.slice(0),this.c=a.c):this.reset()};sjcl.hash.sha1.hash=function(a){return(new sjcl.hash.sha1).update(a).finalize()};
sjcl.hash.sha1.prototype={blockSize:512,reset:function(){this.f=this.A.slice(0);this.d=[];this.c=0;return this},update:function(a){"string"===typeof a&&(a=sjcl.codec.utf8String.toBits(a));var b,c=this.d=sjcl.bitArray.concat(this.d,a);b=this.c;a=this.c=b+sjcl.bitArray.bitLength(a);for(b=this.blockSize+b&-this.blockSize;b<=a;b+=this.blockSize)this.s(c.splice(0,16));return this},finalize:function(){var a,b=this.d,c=this.f,b=sjcl.bitArray.concat(b,[sjcl.bitArray.partial(1,1)]);for(a=b.length+2;a&15;a++)b.push(0);
b.push(Math.floor(this.c/0x100000000));for(b.push(this.c|0);b.length;)this.s(b.splice(0,16));this.reset();return c},A:[1732584193,4023233417,2562383102,271733878,3285377520],b:[1518500249,1859775393,2400959708,3395469782],s:function(a){var b,c,d,e,f,g,h=a.slice(0),k=this.f;c=k[0];d=k[1];e=k[2];f=k[3];g=k[4];for(a=0;79>=a;a++)16<=a&&(h[a]=(h[a-3]^h[a-8]^h[a-14]^h[a-16])<<1|(h[a-3]^h[a-8]^h[a-14]^h[a-16])>>>31),b=19>=a?d&e|~d&f:39>=a?d^e^f:59>=a?d&e|d&f|e&f:79>=a?d^e^f:s,b=(c<<5|c>>>27)+b+g+h[a]+this.b[Math.floor(a/
20)]|0,g=f,f=e,e=d<<30|d>>>2,d=c,c=b;k[0]=k[0]+c|0;k[1]=k[1]+d|0;k[2]=k[2]+e|0;k[3]=k[3]+f|0;k[4]=k[4]+g|0}};
sjcl.mode.ccm={name:"ccm",encrypt:function(a,b,c,d,e){var f,g=b.slice(0),h=sjcl.bitArray,k=h.bitLength(c)/8,l=h.bitLength(g)/8;e=e||64;d=d||[];7>k&&q(new sjcl.exception.invalid("ccm: iv must be at least 7 bytes"));for(f=2;4>f&&l>>>8*f;f++);f<15-k&&(f=15-k);c=h.clamp(c,8*(15-f));b=sjcl.mode.ccm.Q(a,b,c,d,e,f);g=sjcl.mode.ccm.u(a,g,c,b,e,f);return h.concat(g.data,g.tag)},decrypt:function(a,b,c,d,e){e=e||64;d=d||[];var f=sjcl.bitArray,g=f.bitLength(c)/8,h=f.bitLength(b),k=f.clamp(b,h-e),l=f.bitSlice(b,
h-e),h=(h-e)/8;7>g&&q(new sjcl.exception.invalid("ccm: iv must be at least 7 bytes"));for(b=2;4>b&&h>>>8*b;b++);b<15-g&&(b=15-g);c=f.clamp(c,8*(15-b));k=sjcl.mode.ccm.u(a,k,c,l,e,b);a=sjcl.mode.ccm.Q(a,k.data,c,d,e,b);f.equal(k.tag,a)||q(new sjcl.exception.corrupt("ccm: tag doesn't match"));return k.data},Q:function(a,b,c,d,e,f){var g=[],h=sjcl.bitArray,k=h.p;e/=8;(e%2||4>e||16<e)&&q(new sjcl.exception.invalid("ccm: invalid tag length"));(0xffffffff<d.length||0xffffffff<b.length)&&q(new sjcl.exception.bug("ccm: can't deal with 4GiB or more data"));
f=[h.partial(8,(d.length?64:0)|e-2<<2|f-1)];f=h.concat(f,c);f[3]|=h.bitLength(b)/8;f=a.encrypt(f);if(d.length){c=h.bitLength(d)/8;65279>=c?g=[h.partial(16,c)]:0xffffffff>=c&&(g=h.concat([h.partial(16,65534)],[c]));g=h.concat(g,d);for(d=0;d<g.length;d+=4)f=a.encrypt(k(f,g.slice(d,d+4).concat([0,0,0])))}for(d=0;d<b.length;d+=4)f=a.encrypt(k(f,b.slice(d,d+4).concat([0,0,0])));return h.clamp(f,8*e)},u:function(a,b,c,d,e,f){var g,h=sjcl.bitArray;g=h.p;var k=b.length,l=h.bitLength(b);c=h.concat([h.partial(8,
f-1)],c).concat([0,0,0]).slice(0,4);d=h.bitSlice(g(d,a.encrypt(c)),0,e);if(!k)return{tag:d,data:[]};for(g=0;g<k;g+=4)c[3]++,e=a.encrypt(c),b[g]^=e[0],b[g+1]^=e[1],b[g+2]^=e[2],b[g+3]^=e[3];return{tag:d,data:h.clamp(b,l)}}};
sjcl.mode.ocb2={name:"ocb2",encrypt:function(a,b,c,d,e,f){128!==sjcl.bitArray.bitLength(c)&&q(new sjcl.exception.invalid("ocb iv must be 128 bits"));var g,h=sjcl.mode.ocb2.M,k=sjcl.bitArray,l=k.p,n=[0,0,0,0];c=h(a.encrypt(c));var m,p=[];d=d||[];e=e||64;for(g=0;g+4<b.length;g+=4)m=b.slice(g,g+4),n=l(n,m),p=p.concat(l(c,a.encrypt(l(c,m)))),c=h(c);m=b.slice(g);b=k.bitLength(m);g=a.encrypt(l(c,[0,0,0,b]));m=k.clamp(l(m.concat([0,0,0]),g),b);n=l(n,l(m.concat([0,0,0]),g));n=a.encrypt(l(n,l(c,h(c))));d.length&&
(n=l(n,f?d:sjcl.mode.ocb2.pmac(a,d)));return p.concat(k.concat(m,k.clamp(n,e)))},decrypt:function(a,b,c,d,e,f){128!==sjcl.bitArray.bitLength(c)&&q(new sjcl.exception.invalid("ocb iv must be 128 bits"));e=e||64;var g=sjcl.mode.ocb2.M,h=sjcl.bitArray,k=h.p,l=[0,0,0,0],n=g(a.encrypt(c)),m,p,u=sjcl.bitArray.bitLength(b)-e,r=[];d=d||[];for(c=0;c+4<u/32;c+=4)m=k(n,a.decrypt(k(n,b.slice(c,c+4)))),l=k(l,m),r=r.concat(m),n=g(n);p=u-32*c;m=a.encrypt(k(n,[0,0,0,p]));m=k(m,h.clamp(b.slice(c),p).concat([0,0,0]));
l=k(l,m);l=a.encrypt(k(l,k(n,g(n))));d.length&&(l=k(l,f?d:sjcl.mode.ocb2.pmac(a,d)));h.equal(h.clamp(l,e),h.bitSlice(b,u))||q(new sjcl.exception.corrupt("ocb: tag doesn't match"));return r.concat(h.clamp(m,p))},pmac:function(a,b){var c,d=sjcl.mode.ocb2.M,e=sjcl.bitArray,f=e.p,g=[0,0,0,0],h=a.encrypt([0,0,0,0]),h=f(h,d(d(h)));for(c=0;c+4<b.length;c+=4)h=d(h),g=f(g,a.encrypt(f(h,b.slice(c,c+4))));c=b.slice(c);128>e.bitLength(c)&&(h=f(h,d(h)),c=e.concat(c,[-2147483648,0,0,0]));g=f(g,c);return a.encrypt(f(d(f(h,
d(h))),g))},M:function(a){return[a[0]<<1^a[1]>>>31,a[1]<<1^a[2]>>>31,a[2]<<1^a[3]>>>31,a[3]<<1^135*(a[0]>>>31)]}};
sjcl.mode.gcm={name:"gcm",encrypt:function(a,b,c,d,e){var f=b.slice(0);b=sjcl.bitArray;d=d||[];a=sjcl.mode.gcm.u(!0,a,f,d,c,e||128);return b.concat(a.data,a.tag)},decrypt:function(a,b,c,d,e){var f=b.slice(0),g=sjcl.bitArray,h=g.bitLength(f);e=e||128;d=d||[];e<=h?(b=g.bitSlice(f,h-e),f=g.bitSlice(f,0,h-e)):(b=f,f=[]);a=sjcl.mode.gcm.u(t,a,f,d,c,e);g.equal(a.tag,b)||q(new sjcl.exception.corrupt("gcm: tag doesn't match"));return a.data},ga:function(a,b){var c,d,e,f,g,h=sjcl.bitArray.p;e=[0,0,0,0];f=
b.slice(0);for(c=0;128>c;c++){(d=0!==(a[Math.floor(c/32)]&1<<31-c%32))&&(e=h(e,f));g=0!==(f[3]&1);for(d=3;0<d;d--)f[d]=f[d]>>>1|(f[d-1]&1)<<31;f[0]>>>=1;g&&(f[0]^=-0x1f000000)}return e},l:function(a,b,c){var d,e=c.length;b=b.slice(0);for(d=0;d<e;d+=4)b[0]^=0xffffffff&c[d],b[1]^=0xffffffff&c[d+1],b[2]^=0xffffffff&c[d+2],b[3]^=0xffffffff&c[d+3],b=sjcl.mode.gcm.ga(b,a);return b},u:function(a,b,c,d,e,f){var g,h,k,l,n,m,p,u,r=sjcl.bitArray;m=c.length;p=r.bitLength(c);u=r.bitLength(d);h=r.bitLength(e);g=
b.encrypt([0,0,0,0]);96===h?(e=e.slice(0),e=r.concat(e,[1])):(e=sjcl.mode.gcm.l(g,[0,0,0,0],e),e=sjcl.mode.gcm.l(g,e,[0,0,Math.floor(h/0x100000000),h&0xffffffff]));h=sjcl.mode.gcm.l(g,[0,0,0,0],d);n=e.slice(0);d=h.slice(0);a||(d=sjcl.mode.gcm.l(g,h,c));for(l=0;l<m;l+=4)n[3]++,k=b.encrypt(n),c[l]^=k[0],c[l+1]^=k[1],c[l+2]^=k[2],c[l+3]^=k[3];c=r.clamp(c,p);a&&(d=sjcl.mode.gcm.l(g,h,c));a=[Math.floor(u/0x100000000),u&0xffffffff,Math.floor(p/0x100000000),p&0xffffffff];d=sjcl.mode.gcm.l(g,d,a);k=b.encrypt(e);
d[0]^=k[0];d[1]^=k[1];d[2]^=k[2];d[3]^=k[3];return{tag:r.bitSlice(d,0,f),data:c}}};sjcl.misc.hmac=function(a,b){this.S=b=b||sjcl.hash.sha256;var c=[[],[]],d,e=b.prototype.blockSize/32;this.r=[new b,new b];a.length>e&&(a=b.hash(a));for(d=0;d<e;d++)c[0][d]=a[d]^909522486,c[1][d]=a[d]^1549556828;this.r[0].update(c[0]);this.r[1].update(c[1]);this.L=new b(this.r[0])};
sjcl.misc.hmac.prototype.encrypt=sjcl.misc.hmac.prototype.mac=function(a){this.Y&&q(new sjcl.exception.invalid("encrypt on already updated hmac called!"));this.update(a);return this.digest(a)};sjcl.misc.hmac.prototype.reset=function(){this.L=new this.S(this.r[0]);this.Y=t};sjcl.misc.hmac.prototype.update=function(a){this.Y=!0;this.L.update(a)};sjcl.misc.hmac.prototype.digest=function(){var a=this.L.finalize(),a=(new this.S(this.r[1])).update(a).finalize();this.reset();return a};
sjcl.misc.pbkdf2=function(a,b,c,d,e){c=c||1E3;(0>d||0>c)&&q(sjcl.exception.invalid("invalid params to pbkdf2"));"string"===typeof a&&(a=sjcl.codec.utf8String.toBits(a));"string"===typeof b&&(b=sjcl.codec.utf8String.toBits(b));e=e||sjcl.misc.hmac;a=new e(a);var f,g,h,k,l=[],n=sjcl.bitArray;for(k=1;32*l.length<(d||1);k++){e=f=a.encrypt(n.concat(b,[k]));for(g=1;g<c;g++){f=a.encrypt(f);for(h=0;h<f.length;h++)e[h]^=f[h]}l=l.concat(e)}d&&(l=n.clamp(l,d));return l};
sjcl.prng=function(a){this.h=[new sjcl.hash.sha256];this.m=[0];this.K=0;this.B={};this.I=0;this.P={};this.V=this.i=this.n=this.da=0;this.b=[0,0,0,0,0,0,0,0];this.k=[0,0,0,0];this.G=s;this.H=a;this.w=t;this.F={progress:{},seeded:{}};this.q=this.ca=0;this.C=1;this.D=2;this.$=0x10000;this.O=[0,48,64,96,128,192,0x100,384,512,768,1024];this.aa=3E4;this.Z=80};
sjcl.prng.prototype={randomWords:function(a,b){var c=[],d;d=this.isReady(b);var e;d===this.q&&q(new sjcl.exception.notReady("generator isn't seeded"));if(d&this.D){d=!(d&this.C);e=[];var f=0,g;this.V=e[0]=(new Date).valueOf()+this.aa;for(g=0;16>g;g++)e.push(0x100000000*Math.random()|0);for(g=0;g<this.h.length&&!(e=e.concat(this.h[g].finalize()),f+=this.m[g],this.m[g]=0,!d&&this.K&1<<g);g++);this.K>=1<<this.h.length&&(this.h.push(new sjcl.hash.sha256),this.m.push(0));this.i-=f;f>this.n&&(this.n=f);
this.K++;this.b=sjcl.hash.sha256.hash(this.b.concat(e));this.G=new sjcl.cipher.aes(this.b);for(d=0;4>d&&!(this.k[d]=this.k[d]+1|0,this.k[d]);d++);}for(d=0;d<a;d+=4)0===(d+1)%this.$&&w(this),e=x(this),c.push(e[0],e[1],e[2],e[3]);w(this);return c.slice(0,a)},setDefaultParanoia:function(a,b){0===a&&"Setting paranoia=0 will ruin your security; use it only for testing"!==b&&q("Setting paranoia=0 will ruin your security; use it only for testing");this.H=a},addEntropy:function(a,b,c){c=c||"user";var d,e,
f=(new Date).valueOf(),g=this.B[c],h=this.isReady(),k=0;d=this.P[c];d===s&&(d=this.P[c]=this.da++);g===s&&(g=this.B[c]=0);this.B[c]=(this.B[c]+1)%this.h.length;switch(typeof a){case "number":b===s&&(b=1);this.h[g].update([d,this.I++,1,b,f,1,a|0]);break;case "object":c=Object.prototype.toString.call(a);if("[object Uint32Array]"===c){e=[];for(c=0;c<a.length;c++)e.push(a[c]);a=e}else{"[object Array]"!==c&&(k=1);for(c=0;c<a.length&&!k;c++)"number"!==typeof a[c]&&(k=1)}if(!k){if(b===s)for(c=b=0;c<a.length;c++)for(e=
a[c];0<e;)b++,e>>>=1;this.h[g].update([d,this.I++,2,b,f,a.length].concat(a))}break;case "string":b===s&&(b=a.length);this.h[g].update([d,this.I++,3,b,f,a.length]);this.h[g].update(a);break;default:k=1}k&&q(new sjcl.exception.bug("random: addEntropy only supports number, array of numbers or string"));this.m[g]+=b;this.i+=b;h===this.q&&(this.isReady()!==this.q&&B("seeded",Math.max(this.n,this.i)),B("progress",this.getProgress()))},isReady:function(a){a=this.O[a!==s?a:this.H];return this.n&&this.n>=
a?this.m[0]>this.Z&&(new Date).valueOf()>this.V?this.D|this.C:this.C:this.i>=a?this.D|this.q:this.q},getProgress:function(a){a=this.O[a?a:this.H];return this.n>=a?1:this.i>a?1:this.i/a},startCollectors:function(){this.w||(this.a={loadTimeCollector:C(this,this.ja),mouseCollector:C(this,this.ka),keyboardCollector:C(this,this.ia),accelerometerCollector:C(this,this.ba),touchCollector:C(this,this.ma)},window.addEventListener?(window.addEventListener("load",this.a.loadTimeCollector,t),window.addEventListener("mousemove",
this.a.mouseCollector,t),window.addEventListener("keypress",this.a.keyboardCollector,t),window.addEventListener("devicemotion",this.a.accelerometerCollector,t),window.addEventListener("touchmove",this.a.touchCollector,t)):document.attachEvent?(document.attachEvent("onload",this.a.loadTimeCollector),document.attachEvent("onmousemove",this.a.mouseCollector),document.attachEvent("keypress",this.a.keyboardCollector)):q(new sjcl.exception.bug("can't attach event")),this.w=!0)},stopCollectors:function(){this.w&&
(window.removeEventListener?(window.removeEventListener("load",this.a.loadTimeCollector,t),window.removeEventListener("mousemove",this.a.mouseCollector,t),window.removeEventListener("keypress",this.a.keyboardCollector,t),window.removeEventListener("devicemotion",this.a.accelerometerCollector,t),window.removeEventListener("touchmove",this.a.touchCollector,t)):document.detachEvent&&(document.detachEvent("onload",this.a.loadTimeCollector),document.detachEvent("onmousemove",this.a.mouseCollector),document.detachEvent("keypress",
this.a.keyboardCollector)),this.w=t)},addEventListener:function(a,b){this.F[a][this.ca++]=b},removeEventListener:function(a,b){var c,d,e=this.F[a],f=[];for(d in e)e.hasOwnProperty(d)&&e[d]===b&&f.push(d);for(c=0;c<f.length;c++)d=f[c],delete e[d]},ia:function(){D(1)},ka:function(a){var b,c;try{b=a.x||a.clientX||a.offsetX||0,c=a.y||a.clientY||a.offsetY||0}catch(d){c=b=0}0!=b&&0!=c&&sjcl.random.addEntropy([b,c],2,"mouse");D(0)},ma:function(a){a=a.touches[0]||a.changedTouches[0];sjcl.random.addEntropy([a.pageX||
a.clientX,a.pageY||a.clientY],1,"touch");D(0)},ja:function(){D(2)},ba:function(a){a=a.accelerationIncludingGravity.x||a.accelerationIncludingGravity.y||a.accelerationIncludingGravity.z;if(window.orientation){var b=window.orientation;"number"===typeof b&&sjcl.random.addEntropy(b,1,"accelerometer")}a&&sjcl.random.addEntropy(a,2,"accelerometer");D(0)}};function B(a,b){var c,d=sjcl.random.F[a],e=[];for(c in d)d.hasOwnProperty(c)&&e.push(d[c]);for(c=0;c<e.length;c++)e[c](b)}
function D(a){"undefined"!==typeof window&&window.performance&&"function"===typeof window.performance.now?sjcl.random.addEntropy(window.performance.now(),a,"loadtime"):sjcl.random.addEntropy((new Date).valueOf(),a,"loadtime")}function w(a){a.b=x(a).concat(x(a));a.G=new sjcl.cipher.aes(a.b)}function x(a){for(var b=0;4>b&&!(a.k[b]=a.k[b]+1|0,a.k[b]);b++);return a.G.encrypt(a.k)}function C(a,b){return function(){b.apply(a,arguments)}}sjcl.random=new sjcl.prng(6);
a:try{var E,F,G,H;if(H="undefined"!==typeof module){var I;if(I=module.exports){var J;try{J=require("crypto")}catch(K){J=null}I=(F=J)&&F.randomBytes}H=I}if(H)E=F.randomBytes(128),E=new Uint32Array((new Uint8Array(E)).buffer),sjcl.random.addEntropy(E,1024,"crypto['randomBytes']");else if("undefined"!==typeof window&&"undefined"!==typeof Uint32Array){G=new Uint32Array(32);if(window.crypto&&window.crypto.getRandomValues)window.crypto.getRandomValues(G);else if(window.msCrypto&&window.msCrypto.getRandomValues)window.msCrypto.getRandomValues(G);
else break a;sjcl.random.addEntropy(G,1024,"crypto['getRandomValues']")}}catch(L){"undefined"!==typeof window&&window.console&&(console.log("There was an error collecting entropy from the browser:"),console.log(L))}
sjcl.json={defaults:{v:1,iter:1E3,ks:128,ts:64,mode:"ccm",adata:"",cipher:"aes"},fa:function(a,b,c,d){c=c||{};d=d||{};var e=sjcl.json,f=e.j({iv:sjcl.random.randomWords(4,0)},e.defaults),g;e.j(f,c);c=f.adata;"string"===typeof f.salt&&(f.salt=sjcl.codec.base64.toBits(f.salt));"string"===typeof f.iv&&(f.iv=sjcl.codec.base64.toBits(f.iv));(!sjcl.mode[f.mode]||!sjcl.cipher[f.cipher]||"string"===typeof a&&100>=f.iter||64!==f.ts&&96!==f.ts&&128!==f.ts||128!==f.ks&&192!==f.ks&&0x100!==f.ks||2>f.iv.length||
4<f.iv.length)&&q(new sjcl.exception.invalid("json encrypt: invalid parameters"));"string"===typeof a?(g=sjcl.misc.cachedPbkdf2(a,f),a=g.key.slice(0,f.ks/32),f.salt=g.salt):sjcl.ecc&&a instanceof sjcl.ecc.elGamal.publicKey&&(g=a.kem(),f.kemtag=g.tag,a=g.key.slice(0,f.ks/32));"string"===typeof b&&(b=sjcl.codec.utf8String.toBits(b));"string"===typeof c&&(c=sjcl.codec.utf8String.toBits(c));g=new sjcl.cipher[f.cipher](a);e.j(d,f);d.key=a;f.ct=sjcl.mode[f.mode].encrypt(g,b,f.iv,c,f.ts);return f},encrypt:function(a,
b,c,d){var e=sjcl.json,f=e.fa.apply(e,arguments);return e.encode(f)},ea:function(a,b,c,d){c=c||{};d=d||{};var e=sjcl.json;b=e.j(e.j(e.j({},e.defaults),b),c,!0);var f,g;f=b.adata;"string"===typeof b.salt&&(b.salt=sjcl.codec.base64.toBits(b.salt));"string"===typeof b.iv&&(b.iv=sjcl.codec.base64.toBits(b.iv));(!sjcl.mode[b.mode]||!sjcl.cipher[b.cipher]||"string"===typeof a&&100>=b.iter||64!==b.ts&&96!==b.ts&&128!==b.ts||128!==b.ks&&192!==b.ks&&0x100!==b.ks||!b.iv||2>b.iv.length||4<b.iv.length)&&q(new sjcl.exception.invalid("json decrypt: invalid parameters"));
"string"===typeof a?(g=sjcl.misc.cachedPbkdf2(a,b),a=g.key.slice(0,b.ks/32),b.salt=g.salt):sjcl.ecc&&a instanceof sjcl.ecc.elGamal.secretKey&&(a=a.unkem(sjcl.codec.base64.toBits(b.kemtag)).slice(0,b.ks/32));"string"===typeof f&&(f=sjcl.codec.utf8String.toBits(f));g=new sjcl.cipher[b.cipher](a);f=sjcl.mode[b.mode].decrypt(g,b.ct,b.iv,f,b.ts);e.j(d,b);d.key=a;return 1===c.raw?f:sjcl.codec.utf8String.fromBits(f)},decrypt:function(a,b,c,d){var e=sjcl.json;return e.ea(a,e.decode(b),c,d)},encode:function(a){var b,
c="{",d="";for(b in a)if(a.hasOwnProperty(b))switch(b.match(/^[a-z0-9]+$/i)||q(new sjcl.exception.invalid("json encode: invalid property name")),c+=d+'"'+b+'":',d=",",typeof a[b]){case "number":case "boolean":c+=a[b];break;case "string":c+='"'+escape(a[b])+'"';break;case "object":c+='"'+sjcl.codec.base64.fromBits(a[b],0)+'"';break;default:q(new sjcl.exception.bug("json encode: unsupported type"))}return c+"}"},decode:function(a){a=a.replace(/\s/g,"");a.match(/^\{.*\}$/)||q(new sjcl.exception.invalid("json decode: this isn't json!"));
a=a.replace(/^\{|\}$/g,"").split(/,/);var b={},c,d;for(c=0;c<a.length;c++)(d=a[c].match(/^\s*(?:(["']?)([a-z][a-z0-9]*)\1)\s*:\s*(?:(-?\d+)|"([a-z0-9+\/%*_.@=\-]*)"|(true|false))$/i))||q(new sjcl.exception.invalid("json decode: this isn't json!")),d[3]?b[d[2]]=parseInt(d[3],10):d[4]?b[d[2]]=d[2].match(/^(ct|salt|iv)$/)?sjcl.codec.base64.toBits(d[4]):unescape(d[4]):d[5]&&(b[d[2]]="true"===d[5]);return b},j:function(a,b,c){a===s&&(a={});if(b===s)return a;for(var d in b)b.hasOwnProperty(d)&&(c&&(a[d]!==
s&&a[d]!==b[d])&&q(new sjcl.exception.invalid("required parameter overridden")),a[d]=b[d]);return a},oa:function(a,b){var c={},d;for(d in a)a.hasOwnProperty(d)&&a[d]!==b[d]&&(c[d]=a[d]);return c},na:function(a,b){var c={},d;for(d=0;d<b.length;d++)a[b[d]]!==s&&(c[b[d]]=a[b[d]]);return c}};sjcl.encrypt=sjcl.json.encrypt;sjcl.decrypt=sjcl.json.decrypt;sjcl.misc.la={};
sjcl.misc.cachedPbkdf2=function(a,b){var c=sjcl.misc.la,d;b=b||{};d=b.iter||1E3;c=c[a]=c[a]||{};d=c[d]=c[d]||{firstSalt:b.salt&&b.salt.length?b.salt.slice(0):sjcl.random.randomWords(2,0)};c=b.salt===s?d.firstSalt:b.salt;d[c]=d[c]||sjcl.misc.pbkdf2(a,c,b.iter);return{key:d[c].slice(0),salt:c.slice(0)}};sjcl.bn=function(a){this.initWith(a)};
sjcl.bn.prototype={radix:24,maxMul:8,e:sjcl.bn,copy:function(){return new this.e(this)},initWith:function(a){var b=0,c;switch(typeof a){case "object":this.limbs=a.limbs.slice(0);break;case "number":this.limbs=[a];this.normalize();break;case "string":a=a.replace(/^0x/,"");this.limbs=[];c=this.radix/4;for(b=0;b<a.length;b+=c)this.limbs.push(parseInt(a.substring(Math.max(a.length-b-c,0),a.length-b),16));break;default:this.limbs=[0]}return this},equals:function(a){"number"===typeof a&&(a=new this.e(a));
var b=0,c;this.fullReduce();a.fullReduce();for(c=0;c<this.limbs.length||c<a.limbs.length;c++)b|=this.getLimb(c)^a.getLimb(c);return 0===b},getLimb:function(a){return a>=this.limbs.length?0:this.limbs[a]},greaterEquals:function(a){"number"===typeof a&&(a=new this.e(a));var b=0,c=0,d,e,f;for(d=Math.max(this.limbs.length,a.limbs.length)-1;0<=d;d--)e=this.getLimb(d),f=a.getLimb(d),c|=f-e&~b,b|=e-f&~c;return(c|~b)>>>31},toString:function(){this.fullReduce();var a="",b,c,d=this.limbs;for(b=0;b<this.limbs.length;b++){for(c=
d[b].toString(16);b<this.limbs.length-1&&6>c.length;)c="0"+c;a=c+a}return"0x"+a},addM:function(a){"object"!==typeof a&&(a=new this.e(a));var b=this.limbs,c=a.limbs;for(a=b.length;a<c.length;a++)b[a]=0;for(a=0;a<c.length;a++)b[a]+=c[a];return this},doubleM:function(){var a,b=0,c,d=this.radix,e=this.radixMask,f=this.limbs;for(a=0;a<f.length;a++)c=f[a],c=c+c+b,f[a]=c&e,b=c>>d;b&&f.push(b);return this},halveM:function(){var a,b=0,c,d=this.radix,e=this.limbs;for(a=e.length-1;0<=a;a--)c=e[a],e[a]=c+b>>
1,b=(c&1)<<d;e[e.length-1]||e.pop();return this},subM:function(a){"object"!==typeof a&&(a=new this.e(a));var b=this.limbs,c=a.limbs;for(a=b.length;a<c.length;a++)b[a]=0;for(a=0;a<c.length;a++)b[a]-=c[a];return this},mod:function(a){var b=!this.greaterEquals(new sjcl.bn(0));a=(new sjcl.bn(a)).normalize();var c=(new sjcl.bn(this)).normalize(),d=0;for(b&&(c=(new sjcl.bn(0)).subM(c).normalize());c.greaterEquals(a);d++)a.doubleM();for(b&&(c=a.sub(c).normalize());0<d;d--)a.halveM(),c.greaterEquals(a)&&
c.subM(a).normalize();return c.trim()},inverseMod:function(a){var b=new sjcl.bn(1),c=new sjcl.bn(0),d=new sjcl.bn(this),e=new sjcl.bn(a),f,g=1;a.limbs[0]&1||q(new sjcl.exception.invalid("inverseMod: p must be odd"));do{d.limbs[0]&1&&(d.greaterEquals(e)||(f=d,d=e,e=f,f=b,b=c,c=f),d.subM(e),d.normalize(),b.greaterEquals(c)||b.addM(a),b.subM(c));d.halveM();b.limbs[0]&1&&b.addM(a);b.normalize();b.halveM();for(f=g=0;f<d.limbs.length;f++)g|=d.limbs[f]}while(g);e.equals(1)||q(new sjcl.exception.invalid("inverseMod: p and x must be relatively prime"));
return c},add:function(a){return this.copy().addM(a)},sub:function(a){return this.copy().subM(a)},mul:function(a){"number"===typeof a&&(a=new this.e(a));var b,c=this.limbs,d=a.limbs,e=c.length,f=d.length,g=new this.e,h=g.limbs,k,l=this.maxMul;for(b=0;b<this.limbs.length+a.limbs.length+1;b++)h[b]=0;for(b=0;b<e;b++){k=c[b];for(a=0;a<f;a++)h[b+a]+=k*d[a];--l||(l=this.maxMul,g.cnormalize())}return g.cnormalize().reduce()},square:function(){return this.mul(this)},power:function(a){"number"===typeof a?
a=[a]:a.limbs!==s&&(a=a.normalize().limbs);var b,c,d=new this.e(1),e=this;for(b=0;b<a.length;b++)for(c=0;c<this.radix;c++)a[b]&1<<c&&(d=d.mul(e)),e=e.square();return d},mulmod:function(a,b){return this.mod(b).mul(a.mod(b)).mod(b)},powermod:function(a,b){for(var c=new sjcl.bn(1),d=new sjcl.bn(this),e=new sjcl.bn(a);;){e.limbs[0]&1&&(c=c.mulmod(d,b));e.halveM();if(e.equals(0))break;d=d.mulmod(d,b)}return c.normalize().reduce()},trim:function(){var a=this.limbs,b;do b=a.pop();while(a.length&&0===b);
a.push(b);return this},reduce:function(){return this},fullReduce:function(){return this.normalize()},normalize:function(){var a=0,b,c=this.placeVal,d=this.ipv,e,f=this.limbs,g=f.length,h=this.radixMask;for(b=0;b<g||0!==a&&-1!==a;b++)a=(f[b]||0)+a,e=f[b]=a&h,a=(a-e)*d;-1===a&&(f[b-1]-=c);return this},cnormalize:function(){var a=0,b,c=this.ipv,d,e=this.limbs,f=e.length,g=this.radixMask;for(b=0;b<f-1;b++)a=e[b]+a,d=e[b]=a&g,a=(a-d)*c;e[b]+=a;return this},toBits:function(a){this.fullReduce();a=a||this.exponent||
this.bitLength();var b=Math.floor((a-1)/24),c=sjcl.bitArray,d=[c.partial((a+7&-8)%this.radix||this.radix,this.getLimb(b))];for(b--;0<=b;b--)d=c.concat(d,[c.partial(Math.min(this.radix,a),this.getLimb(b))]),a-=this.radix;return d},bitLength:function(){this.fullReduce();for(var a=this.radix*(this.limbs.length-1),b=this.limbs[this.limbs.length-1];b;b>>>=1)a++;return a+7&-8}};
sjcl.bn.fromBits=function(a){var b=new this,c=[],d=sjcl.bitArray,e=this.prototype,f=Math.min(this.bitLength||0x100000000,d.bitLength(a)),g=f%e.radix||e.radix;for(c[0]=d.extract(a,0,g);g<f;g+=e.radix)c.unshift(d.extract(a,g,e.radix));b.limbs=c;return b};sjcl.bn.prototype.ipv=1/(sjcl.bn.prototype.placeVal=Math.pow(2,sjcl.bn.prototype.radix));sjcl.bn.prototype.radixMask=(1<<sjcl.bn.prototype.radix)-1;
sjcl.bn.pseudoMersennePrime=function(a,b){function c(a){this.initWith(a)}var d=c.prototype=new sjcl.bn,e,f;e=d.modOffset=Math.ceil(f=a/d.radix);d.exponent=a;d.offset=[];d.factor=[];d.minOffset=e;d.fullMask=0;d.fullOffset=[];d.fullFactor=[];d.modulus=c.modulus=new sjcl.bn(Math.pow(2,a));d.fullMask=0|-Math.pow(2,a%d.radix);for(e=0;e<b.length;e++)d.offset[e]=Math.floor(b[e][0]/d.radix-f),d.fullOffset[e]=Math.ceil(b[e][0]/d.radix-f),d.factor[e]=b[e][1]*Math.pow(0.5,a-b[e][0]+d.offset[e]*d.radix),d.fullFactor[e]=
b[e][1]*Math.pow(0.5,a-b[e][0]+d.fullOffset[e]*d.radix),d.modulus.addM(new sjcl.bn(Math.pow(2,b[e][0])*b[e][1])),d.minOffset=Math.min(d.minOffset,-d.offset[e]);d.e=c;d.modulus.cnormalize();d.reduce=function(){var a,b,c,d=this.modOffset,e=this.limbs,f=this.offset,p=this.offset.length,u=this.factor,r;for(a=this.minOffset;e.length>d;){c=e.pop();r=e.length;for(b=0;b<p;b++)e[r+f[b]]-=u[b]*c;a--;a||(e.push(0),this.cnormalize(),a=this.minOffset)}this.cnormalize();return this};d.X=-1===d.fullMask?d.reduce:
function(){var a=this.limbs,b=a.length-1,c,d;this.reduce();if(b===this.modOffset-1){d=a[b]&this.fullMask;a[b]-=d;for(c=0;c<this.fullOffset.length;c++)a[b+this.fullOffset[c]]-=this.fullFactor[c]*d;this.normalize()}};d.fullReduce=function(){var a,b;this.X();this.addM(this.modulus);this.addM(this.modulus);this.normalize();this.X();for(b=this.limbs.length;b<this.modOffset;b++)this.limbs[b]=0;a=this.greaterEquals(this.modulus);for(b=0;b<this.limbs.length;b++)this.limbs[b]-=this.modulus.limbs[b]*a;this.cnormalize();
return this};d.inverse=function(){return this.power(this.modulus.sub(2))};c.fromBits=sjcl.bn.fromBits;return c};var M=sjcl.bn.pseudoMersennePrime;
sjcl.bn.prime={p127:M(127,[[0,-1]]),p25519:M(255,[[0,-19]]),p192k:M(192,[[32,-1],[12,-1],[8,-1],[7,-1],[6,-1],[3,-1],[0,-1]]),p224k:M(224,[[32,-1],[12,-1],[11,-1],[9,-1],[7,-1],[4,-1],[1,-1],[0,-1]]),p256k:M(0x100,[[32,-1],[9,-1],[8,-1],[7,-1],[6,-1],[4,-1],[0,-1]]),p192:M(192,[[0,-1],[64,-1]]),p224:M(224,[[0,1],[96,-1]]),p256:M(0x100,[[0,-1],[96,1],[192,1],[224,-1]]),p384:M(384,[[0,-1],[32,1],[96,-1],[128,-1]]),p521:M(521,[[0,-1]])};
sjcl.bn.random=function(a,b){"object"!==typeof a&&(a=new sjcl.bn(a));for(var c,d,e=a.limbs.length,f=a.limbs[e-1]+1,g=new sjcl.bn;;){do c=sjcl.random.randomWords(e,b),0>c[e-1]&&(c[e-1]+=0x100000000);while(Math.floor(c[e-1]/f)===Math.floor(0x100000000/f));c[e-1]%=f;for(d=0;d<e-1;d++)c[d]&=a.radixMask;g.limbs=c;if(!g.greaterEquals(a))return g}};
sjcl.keyexchange.srp={makeVerifier:function(a,b,c,d){a=sjcl.keyexchange.srp.makeX(a,b,c);a=sjcl.bn.fromBits(a);return d.g.powermod(a,d.N)},makeX:function(a,b,c){a=sjcl.hash.sha1.hash(a+":"+b);return sjcl.hash.sha1.hash(sjcl.bitArray.concat(c,a))},knownGroup:function(a){"string"!==typeof a&&(a=a.toString());sjcl.keyexchange.srp.R||sjcl.keyexchange.srp.ha();return sjcl.keyexchange.srp.U[a]},R:t,ha:function(){var a,b;for(a=0;a<sjcl.keyexchange.srp.T.length;a++)b=sjcl.keyexchange.srp.T[a].toString(),
b=sjcl.keyexchange.srp.U[b],b.N=new sjcl.bn(b.N),b.g=new sjcl.bn(b.g);sjcl.keyexchange.srp.R=!0},T:[1024,1536,2048],U:{1024:{N:"EEAF0AB9ADB38DD69C33F80AFA8FC5E86072618775FF3C0B9EA2314C9C256576D674DF7496EA81D3383B4813D692C6E0E0D5D8E250B98BE48E495C1D6089DAD15DC7D7B46154D6B6CE8EF4AD69B15D4982559B297BCF1885C529F566660E57EC68EDBC3C05726CC02FD4CBF4976EAA9AFD5138FE8376435B9FC61D2FC0EB06E3",g:2},1536:{N:"9DEF3CAFB939277AB1F12A8617A47BBBDBA51DF499AC4C80BEEEA9614B19CC4D5F4F5F556E27CBDE51C6A94BE4607A291558903BA0D0F84380B655BB9A22E8DCDF028A7CEC67F0D08134B1C8B97989149B609E0BE3BAB63D47548381DBC5B1FC764E3F4B53DD9DA1158BFD3E2B9C8CF56EDF019539349627DB2FD53D24B7C48665772E437D6C7F8CE442734AF7CCB7AE837C264AE3A9BEB87F8A2FE9B8B5292E5A021FFF5E91479E8CE7A28C2442C6F315180F93499A234DCF76E3FED135F9BB",
g:2},2048:{N:"AC6BDB41324A9A9BF166DE5E1389582FAF72B6651987EE07FC3192943DB56050A37329CBB4A099ED8193E0757767A13DD52312AB4B03310DCD7F48A9DA04FD50E8083969EDB767B0CF6095179A163AB3661A05FBD5FAAAE82918A9962F0B93B855F97993EC975EEAA80D740ADBF4FF747359D041D5C33EA71D281E446B14773BCA97B43A23FB801676BD207A436C6481F1D2B9078717461A5B9D32E688F87748544523B524B0D57D5EA77A2775D2ECFA032CFBDBF52FB3786160279004E57AE6AF874E7303CE53299CCC041C7BC308D82A5698F3A8D0C38271AE35F8E9DBFBB694B5C803D89F7AE435DE236D525F54759B65E372FCD68EF20FA7111F9E4AFF73",
g:2}}};
sjcl.srp_user = {
   init_exchange: function(params, username, password) {
    var group_size = [1024, 1536, 2048];
    params.group = sjcl.keyexchange.srp.knownGroup(group_size[0]);
    params.N = params.group.N;
    params.g = params.group.g;

    params.username = username;
    params.password = password;

    // "random" a
    params.a = 4815;
    params.A = params.g.powermod(params.a, params.N);
},

   send_to_host: function(params) {
    //params.A = params.g.powermod(params.a, params.N);

    // send username and public key
    //callback(params.username, params.A);
},

   get_from_host: function(params, salt, B) {
    // get from host somehow
    params.salt = sjcl.codec.hex.toBits(salt);
    params.B = new sjcl.bn(B);

    // fake B
    /*
    params.salt = "BEB25379D1A8581EB5A727673A2441EE";
    params.salt = sjcl.codec.hex.toBits(params.salt);
    params.B = 0;
    
    var b = 162342;
    var k = sjcl.bn.fromBits(sjcl.hash.sha1.hash(sjcl.bitArray.concat(params.N.toBits(), params.g.toBits())));
    var v = sjcl.keyexchange.srp.makeVerifier(params.username, params.password, params.salt, params.group);
    var B = k.mulmod(v, params.N).add(params.g.powermod(b, params.N)).mod(params.N).normalize();
    params.B = B;
    params.B = new sjcl.bn("0x34a79bcd0f4650dfd44dfeacdb8619977a8cf06919b02041a1d2d0aaa2bfa7aa5c134a05d10a23f2998a38b427dd7ae1fd01542d9c05ab6213dd19f159f8681608d525c5c1a46acb4ea772edd4db031d67f80c200931204ef7bca0785086d376aa1adeec01551a41da9fdca3a2f6dce7b733f5dce5b2df008260b8338cc0450e");
    */
},

   compute_u: function(params) {
    params.u = sjcl.bn.fromBits(sjcl.hash.sha1.hash(sjcl.bitArray.concat(params.A.toBits(), params.B.toBits())));
},

   compute_S: function(params) {
    var x = sjcl.bn.fromBits(sjcl.keyexchange.srp.makeX(params.username, params.password, params.salt));
    var k = sjcl.bn.fromBits(sjcl.hash.sha1.hash(sjcl.bitArray.concat(params.N.toBits(), params.g.toBits())));
      
    // takes a long time
    //var part_1_1 = params.g.powermod(x, params.N);
    var part_1_1 = new sjcl.bn("0x7e273de8696ffc4f4e337d05b4b375beb0dde1569e8fa00a9886d8129bada1f1822223ca1a605b530e379ba4729fdc59f105b4787e5186f5c671085a1447b52a48cf1970b4fb6f8400bbf4cebfbb168152e08ab5ea53d15c1aff87b2b9da6e04e058ad51cc72bfc9033b564e26480d78e955a5e29e7ab245db2be315e2099afb");
      console.log('part_1_1: ' + part_1_1.toString());
    var part_1_2 = k.mulmod(part_1_1, params.N);
      console.log('part_1_2: ' + part_1_2.toString());
    var part_1_3 = params.B.sub(part_1_2).normalize();
      console.log('part_1_3: ' + part_1_3.toString());
    var part_2_1 = params.u.mulmod(x, params.N);
      console.log('part_2_1: ' + part_2_1.toString());
    var part_2_2 = part_2_1.add(params.a).normalize();
      console.log('part_2_2: ' + part_2_2.toString());
    // this kills it too
    //var part_3 = part_1_2.powermod(part_2_2, params.N);
    var part_3 = new sjcl.bn("0x2a4cc7584b80e40048adacd2ccc82e48649f36c844f51dda2fd2237e5701cf43b76c8b3ed4230a4a759ea281aef062b1a66fada1839e138921e99e3f3040a4b44c910ca7d5b35762ad8f502750307fb8c382ecce32f7b48a5515fb11bc6661a0c687b63a898c0c9b882b370aa30cb2d8b21ef1f22f46105ade090d8c3b0ff96d");
      console.log('part_3: ' + part_3.toString());
   
    params.S = part_3
    params.K = sjcl.hash.sha1.hash(params.S.toBits());
      // gets 0xeec81ae135faf54dc7e771f12a30d54778a82c6d 
    
    //params.S = params.B.sub(k.mulmod(params.g.powermod(x, params.N), params.N)).normalize().powermod(params.u.mulmod(x, params.N).add(params.a).normalize(), params.N);
    //params.K = sjcl.hash.sha1.hash(params.S.toBits());

    //document.write("S=", params.S, "<br>");
    //document.write("K=", K, "<br><br>");
}

};



