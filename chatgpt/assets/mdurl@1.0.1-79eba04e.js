var v={},P={};function R(a){var t,r,i=P[a];if(i)return i;for(i=P[a]=[],t=0;t<128;t++)r=String.fromCharCode(t),/^[0-9a-z]$/i.test(r)?i.push(r):i.push("%"+("0"+t.toString(16).toUpperCase()).slice(-2));for(t=0;t<a.length;t++)i[a.charCodeAt(t)]=a[t];return i}function F(a,t,r){var i,f,s,o,e,h="";for(typeof t!="string"&&(r=t,t=F.defaultChars),typeof r>"u"&&(r=!0),e=R(t),i=0,f=a.length;i<f;i++){if(s=a.charCodeAt(i),r&&s===37&&i+2<f&&/^[0-9a-f]{2}$/i.test(a.slice(i+1,i+3))){h+=a.slice(i,i+3),i+=2;continue}if(s<128){h+=e[s];continue}if(s>=55296&&s<=57343){if(s>=55296&&s<=56319&&i+1<f&&(o=a.charCodeAt(i+1),o>=56320&&o<=57343)){h+=encodeURIComponent(a[i]+a[i+1]),i++;continue}h+="%EF%BF%BD";continue}h+=encodeURIComponent(a[i])}return h}F.defaultChars=";/?:@&=+$,-_.!~*'()#";F.componentChars="-_.!~*'()";var Z=F,_={};function j(a){var t,r,i=_[a];if(i)return i;for(i=_[a]=[],t=0;t<128;t++)r=String.fromCharCode(t),i.push(r);for(t=0;t<a.length;t++)r=a.charCodeAt(t),i[r]="%"+("0"+r.toString(16).toUpperCase()).slice(-2);return i}function d(a,t){var r;return typeof t!="string"&&(t=d.defaultChars),r=j(t),a.replace(/(%[a-f0-9]{2})+/gi,function(i){var f,s,o,e,h,c,n,u="";for(f=0,s=i.length;f<s;f+=3){if(o=parseInt(i.slice(f+1,f+3),16),o<128){u+=r[o];continue}if((o&224)===192&&f+3<s&&(e=parseInt(i.slice(f+4,f+6),16),(e&192)===128)){n=o<<6&1984|e&63,n<128?u+="��":u+=String.fromCharCode(n),f+=3;continue}if((o&240)===224&&f+6<s&&(e=parseInt(i.slice(f+4,f+6),16),h=parseInt(i.slice(f+7,f+9),16),(e&192)===128&&(h&192)===128)){n=o<<12&61440|e<<6&4032|h&63,n<2048||n>=55296&&n<=57343?u+="���":u+=String.fromCharCode(n),f+=6;continue}if((o&248)===240&&f+9<s&&(e=parseInt(i.slice(f+4,f+6),16),h=parseInt(i.slice(f+7,f+9),16),c=parseInt(i.slice(f+10,f+12),16),(e&192)===128&&(h&192)===128&&(c&192)===128)){n=o<<18&1835008|e<<12&258048|h<<6&4032|c&63,n<65536||n>1114111?u+="����":(n-=65536,u+=String.fromCharCode(55296+(n>>10),56320+(n&1023))),f+=9;continue}u+="�"}return u})}d.defaultChars=";/?:@&=+$,#";d.componentChars="";var M=d,G=function(t){var r="";return r+=t.protocol||"",r+=t.slashes?"//":"",r+=t.auth?t.auth+"@":"",t.hostname&&t.hostname.indexOf(":")!==-1?r+="["+t.hostname+"]":r+=t.hostname||"",r+=t.port?":"+t.port:"",r+=t.pathname||"",r+=t.search||"",r+=t.hash||"",r};function p(){this.protocol=null,this.slashes=null,this.auth=null,this.port=null,this.hostname=null,this.hash=null,this.search=null,this.pathname=null}var J=/^([a-z0-9.+-]+:)/i,K=/:[0-9]*$/,N=/^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,Q=["<",">",'"',"`"," ","\r",`
`,"	"],T=["{","}","|","\\","^","`"].concat(Q),V=["'"].concat(T),y=["%","/","?",";","#"].concat(V),U=["/","?","#"],W=255,z=/^[+a-z0-9A-Z_-]{0,63}$/,X=/^([+a-z0-9A-Z_-]{0,63})(.*)$/,S={javascript:!0,"javascript:":!0},B={http:!0,https:!0,ftp:!0,gopher:!0,file:!0,"http:":!0,"https:":!0,"ftp:":!0,"gopher:":!0,"file:":!0};function Y(a,t){if(a&&a instanceof p)return a;var r=new p;return r.parse(a,t),r}p.prototype.parse=function(a,t){var r,i,f,s,o,e=a;if(e=e.trim(),!t&&a.split("#").length===1){var h=N.exec(e);if(h)return this.pathname=h[1],h[2]&&(this.search=h[2]),this}var c=J.exec(e);if(c&&(c=c[0],f=c.toLowerCase(),this.protocol=c,e=e.substr(c.length)),(t||c||e.match(/^\/\/[^@\/]+@[^@\/]+/))&&(o=e.substr(0,2)==="//",o&&!(c&&S[c])&&(e=e.substr(2),this.slashes=!0)),!S[c]&&(o||c&&!B[c])){var n=-1;for(r=0;r<U.length;r++)s=e.indexOf(U[r]),s!==-1&&(n===-1||s<n)&&(n=s);var u,x;for(n===-1?x=e.lastIndexOf("@"):x=e.lastIndexOf("@",n),x!==-1&&(u=e.slice(0,x),e=e.slice(x+1),this.auth=u),n=-1,r=0;r<y.length;r++)s=e.indexOf(y[r]),s!==-1&&(n===-1||s<n)&&(n=s);n===-1&&(n=e.length),e[n-1]===":"&&n--;var w=e.slice(0,n);e=e.slice(n),this.parseHost(w),this.hostname=this.hostname||"";var A=this.hostname[0]==="["&&this.hostname[this.hostname.length-1]==="]";if(!A){var m=this.hostname.split(/\./);for(r=0,i=m.length;r<i;r++){var l=m[r];if(l&&!l.match(z)){for(var g="",C=0,L=l.length;C<L;C++)l.charCodeAt(C)>127?g+="x":g+=l[C];if(!g.match(z)){var O=m.slice(0,r),b=m.slice(r+1),D=l.match(X);D&&(O.push(D[1]),b.unshift(D[2])),b.length&&(e=b.join(".")+e),this.hostname=O.join(".");break}}}}this.hostname.length>W&&(this.hostname=""),A&&(this.hostname=this.hostname.substr(1,this.hostname.length-2))}var I=e.indexOf("#");I!==-1&&(this.hash=e.substr(I),e=e.slice(0,I));var $=e.indexOf("?");return $!==-1&&(this.search=e.substr($),e=e.slice(0,$)),e&&(this.pathname=e),B[f]&&this.hostname&&!this.pathname&&(this.pathname=""),this};p.prototype.parseHost=function(a){var t=K.exec(a);t&&(t=t[0],t!==":"&&(this.port=t.substr(1)),a=a.substr(0,a.length-t.length)),a&&(this.hostname=a)};var H=Y;v.encode=Z;v.decode=M;v.format=G;v.parse=H;export{v as m};
