var ou={exports:{}},Ea={},su={exports:{}},ie={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var mr=Symbol.for("react.element"),Hf=Symbol.for("react.portal"),Wf=Symbol.for("react.fragment"),Uf=Symbol.for("react.strict_mode"),Vf=Symbol.for("react.profiler"),Yf=Symbol.for("react.provider"),Qf=Symbol.for("react.context"),Zf=Symbol.for("react.forward_ref"),qf=Symbol.for("react.suspense"),Kf=Symbol.for("react.memo"),Gf=Symbol.for("react.lazy"),kl=Symbol.iterator;function Xf(e){return e===null||typeof e!="object"?null:(e=kl&&e[kl]||e["@@iterator"],typeof e=="function"?e:null)}var lu={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},cu=Object.assign,uu={};function xi(e,t,n){this.props=e,this.context=t,this.refs=uu,this.updater=n||lu}xi.prototype.isReactComponent={};xi.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};xi.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function du(){}du.prototype=xi.prototype;function ys(e,t,n){this.props=e,this.context=t,this.refs=uu,this.updater=n||lu}var bs=ys.prototype=new du;bs.constructor=ys;cu(bs,xi.prototype);bs.isPureReactComponent=!0;var jl=Array.isArray,fu=Object.prototype.hasOwnProperty,ks={current:null},pu={key:!0,ref:!0,__self:!0,__source:!0};function hu(e,t,n){var i,r={},o=null,s=null;if(t!=null)for(i in t.ref!==void 0&&(s=t.ref),t.key!==void 0&&(o=""+t.key),t)fu.call(t,i)&&!pu.hasOwnProperty(i)&&(r[i]=t[i]);var c=arguments.length-2;if(c===1)r.children=n;else if(1<c){for(var l=Array(c),f=0;f<c;f++)l[f]=arguments[f+2];r.children=l}if(e&&e.defaultProps)for(i in c=e.defaultProps,c)r[i]===void 0&&(r[i]=c[i]);return{$$typeof:mr,type:e,key:o,ref:s,props:r,_owner:ks.current}}function Jf(e,t){return{$$typeof:mr,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function js(e){return typeof e=="object"&&e!==null&&e.$$typeof===mr}function ep(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var zl=/\/+/g;function Za(e,t){return typeof e=="object"&&e!==null&&e.key!=null?ep(""+e.key):t.toString(36)}function Yr(e,t,n,i,r){var o=typeof e;(o==="undefined"||o==="boolean")&&(e=null);var s=!1;if(e===null)s=!0;else switch(o){case"string":case"number":s=!0;break;case"object":switch(e.$$typeof){case mr:case Hf:s=!0}}if(s)return s=e,r=r(s),e=i===""?"."+Za(s,0):i,jl(r)?(n="",e!=null&&(n=e.replace(zl,"$&/")+"/"),Yr(r,t,n,"",function(f){return f})):r!=null&&(js(r)&&(r=Jf(r,n+(!r.key||s&&s.key===r.key?"":(""+r.key).replace(zl,"$&/")+"/")+e)),t.push(r)),1;if(s=0,i=i===""?".":i+":",jl(e))for(var c=0;c<e.length;c++){o=e[c];var l=i+Za(o,c);s+=Yr(o,t,n,l,r)}else if(l=Xf(e),typeof l=="function")for(e=l.call(e),c=0;!(o=e.next()).done;)o=o.value,l=i+Za(o,c++),s+=Yr(o,t,n,l,r);else if(o==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return s}function yr(e,t,n){if(e==null)return e;var i=[],r=0;return Yr(e,i,"","",function(o){return t.call(n,o,r++)}),i}function tp(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(n){(e._status===0||e._status===-1)&&(e._status=1,e._result=n)},function(n){(e._status===0||e._status===-1)&&(e._status=2,e._result=n)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var Ge={current:null},Qr={transition:null},np={ReactCurrentDispatcher:Ge,ReactCurrentBatchConfig:Qr,ReactCurrentOwner:ks};function gu(){throw Error("act(...) is not supported in production builds of React.")}ie.Children={map:yr,forEach:function(e,t,n){yr(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return yr(e,function(){t++}),t},toArray:function(e){return yr(e,function(t){return t})||[]},only:function(e){if(!js(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};ie.Component=xi;ie.Fragment=Wf;ie.Profiler=Vf;ie.PureComponent=ys;ie.StrictMode=Uf;ie.Suspense=qf;ie.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=np;ie.act=gu;ie.cloneElement=function(e,t,n){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var i=cu({},e.props),r=e.key,o=e.ref,s=e._owner;if(t!=null){if(t.ref!==void 0&&(o=t.ref,s=ks.current),t.key!==void 0&&(r=""+t.key),e.type&&e.type.defaultProps)var c=e.type.defaultProps;for(l in t)fu.call(t,l)&&!pu.hasOwnProperty(l)&&(i[l]=t[l]===void 0&&c!==void 0?c[l]:t[l])}var l=arguments.length-2;if(l===1)i.children=n;else if(1<l){c=Array(l);for(var f=0;f<l;f++)c[f]=arguments[f+2];i.children=c}return{$$typeof:mr,type:e.type,key:r,ref:o,props:i,_owner:s}};ie.createContext=function(e){return e={$$typeof:Qf,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:Yf,_context:e},e.Consumer=e};ie.createElement=hu;ie.createFactory=function(e){var t=hu.bind(null,e);return t.type=e,t};ie.createRef=function(){return{current:null}};ie.forwardRef=function(e){return{$$typeof:Zf,render:e}};ie.isValidElement=js;ie.lazy=function(e){return{$$typeof:Gf,_payload:{_status:-1,_result:e},_init:tp}};ie.memo=function(e,t){return{$$typeof:Kf,type:e,compare:t===void 0?null:t}};ie.startTransition=function(e){var t=Qr.transition;Qr.transition={};try{e()}finally{Qr.transition=t}};ie.unstable_act=gu;ie.useCallback=function(e,t){return Ge.current.useCallback(e,t)};ie.useContext=function(e){return Ge.current.useContext(e)};ie.useDebugValue=function(){};ie.useDeferredValue=function(e){return Ge.current.useDeferredValue(e)};ie.useEffect=function(e,t){return Ge.current.useEffect(e,t)};ie.useId=function(){return Ge.current.useId()};ie.useImperativeHandle=function(e,t,n){return Ge.current.useImperativeHandle(e,t,n)};ie.useInsertionEffect=function(e,t){return Ge.current.useInsertionEffect(e,t)};ie.useLayoutEffect=function(e,t){return Ge.current.useLayoutEffect(e,t)};ie.useMemo=function(e,t){return Ge.current.useMemo(e,t)};ie.useReducer=function(e,t,n){return Ge.current.useReducer(e,t,n)};ie.useRef=function(e){return Ge.current.useRef(e)};ie.useState=function(e){return Ge.current.useState(e)};ie.useSyncExternalStore=function(e,t,n){return Ge.current.useSyncExternalStore(e,t,n)};ie.useTransition=function(){return Ge.current.useTransition()};ie.version="18.3.1";su.exports=ie;var _=su.exports;/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ip=_,rp=Symbol.for("react.element"),ap=Symbol.for("react.fragment"),op=Object.prototype.hasOwnProperty,sp=ip.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,lp={key:!0,ref:!0,__self:!0,__source:!0};function mu(e,t,n){var i,r={},o=null,s=null;n!==void 0&&(o=""+n),t.key!==void 0&&(o=""+t.key),t.ref!==void 0&&(s=t.ref);for(i in t)op.call(t,i)&&!lp.hasOwnProperty(i)&&(r[i]=t[i]);if(e&&e.defaultProps)for(i in t=e.defaultProps,t)r[i]===void 0&&(r[i]=t[i]);return{$$typeof:rp,type:e,key:o,ref:s,props:r,_owner:sp.current}}Ea.Fragment=ap;Ea.jsx=mu;Ea.jsxs=mu;ou.exports=Ea;var a=ou.exports,xu={exports:{}},ft={},vu={exports:{}},_u={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(e){function t($,O){var Y=$.length;$.push(O);e:for(;0<Y;){var G=Y-1>>>1,te=$[G];if(0<r(te,O))$[G]=O,$[Y]=te,Y=G;else break e}}function n($){return $.length===0?null:$[0]}function i($){if($.length===0)return null;var O=$[0],Y=$.pop();if(Y!==O){$[0]=Y;e:for(var G=0,te=$.length,fe=te>>>1;G<fe;){var le=2*(G+1)-1,se=$[le],C=le+1,h=$[C];if(0>r(se,Y))C<te&&0>r(h,se)?($[G]=h,$[C]=Y,G=C):($[G]=se,$[le]=Y,G=le);else if(C<te&&0>r(h,Y))$[G]=h,$[C]=Y,G=C;else break e}}return O}function r($,O){var Y=$.sortIndex-O.sortIndex;return Y!==0?Y:$.id-O.id}if(typeof performance=="object"&&typeof performance.now=="function"){var o=performance;e.unstable_now=function(){return o.now()}}else{var s=Date,c=s.now();e.unstable_now=function(){return s.now()-c}}var l=[],f=[],x=1,v=null,g=3,b=!1,w=!1,j=!1,E=typeof setTimeout=="function"?setTimeout:null,p=typeof clearTimeout=="function"?clearTimeout:null,d=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function m($){for(var O=n(f);O!==null;){if(O.callback===null)i(f);else if(O.startTime<=$)i(f),O.sortIndex=O.expirationTime,t(l,O);else break;O=n(f)}}function y($){if(j=!1,m($),!w)if(n(l)!==null)w=!0,pe(R);else{var O=n(f);O!==null&&A(y,O.startTime-$)}}function R($,O){w=!1,j&&(j=!1,p(T),T=-1),b=!0;var Y=g;try{for(m(O),v=n(l);v!==null&&(!(v.expirationTime>O)||$&&!S());){var G=v.callback;if(typeof G=="function"){v.callback=null,g=v.priorityLevel;var te=G(v.expirationTime<=O);O=e.unstable_now(),typeof te=="function"?v.callback=te:v===n(l)&&i(l),m(O)}else i(l);v=n(l)}if(v!==null)var fe=!0;else{var le=n(f);le!==null&&A(y,le.startTime-O),fe=!1}return fe}finally{v=null,g=Y,b=!1}}var I=!1,N=null,T=-1,H=5,U=-1;function S(){return!(e.unstable_now()-U<H)}function q(){if(N!==null){var $=e.unstable_now();U=$;var O=!0;try{O=N(!0,$)}finally{O?ne():(I=!1,N=null)}}else I=!1}var ne;if(typeof d=="function")ne=function(){d(q)};else if(typeof MessageChannel<"u"){var ee=new MessageChannel,re=ee.port2;ee.port1.onmessage=q,ne=function(){re.postMessage(null)}}else ne=function(){E(q,0)};function pe($){N=$,I||(I=!0,ne())}function A($,O){T=E(function(){$(e.unstable_now())},O)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function($){$.callback=null},e.unstable_continueExecution=function(){w||b||(w=!0,pe(R))},e.unstable_forceFrameRate=function($){0>$||125<$?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):H=0<$?Math.floor(1e3/$):5},e.unstable_getCurrentPriorityLevel=function(){return g},e.unstable_getFirstCallbackNode=function(){return n(l)},e.unstable_next=function($){switch(g){case 1:case 2:case 3:var O=3;break;default:O=g}var Y=g;g=O;try{return $()}finally{g=Y}},e.unstable_pauseExecution=function(){},e.unstable_requestPaint=function(){},e.unstable_runWithPriority=function($,O){switch($){case 1:case 2:case 3:case 4:case 5:break;default:$=3}var Y=g;g=$;try{return O()}finally{g=Y}},e.unstable_scheduleCallback=function($,O,Y){var G=e.unstable_now();switch(typeof Y=="object"&&Y!==null?(Y=Y.delay,Y=typeof Y=="number"&&0<Y?G+Y:G):Y=G,$){case 1:var te=-1;break;case 2:te=250;break;case 5:te=1073741823;break;case 4:te=1e4;break;default:te=5e3}return te=Y+te,$={id:x++,callback:O,priorityLevel:$,startTime:Y,expirationTime:te,sortIndex:-1},Y>G?($.sortIndex=Y,t(f,$),n(l)===null&&$===n(f)&&(j?(p(T),T=-1):j=!0,A(y,Y-G))):($.sortIndex=te,t(l,$),w||b||(w=!0,pe(R))),$},e.unstable_shouldYield=S,e.unstable_wrapCallback=function($){var O=g;return function(){var Y=g;g=O;try{return $.apply(this,arguments)}finally{g=Y}}}})(_u);vu.exports=_u;var cp=vu.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var up=_,dt=cp;function P(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var wu=new Set,Xi={};function Dn(e,t){ui(e,t),ui(e+"Capture",t)}function ui(e,t){for(Xi[e]=t,e=0;e<t.length;e++)wu.add(t[e])}var Yt=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),zo=Object.prototype.hasOwnProperty,dp=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Nl={},Sl={};function fp(e){return zo.call(Sl,e)?!0:zo.call(Nl,e)?!1:dp.test(e)?Sl[e]=!0:(Nl[e]=!0,!1)}function pp(e,t,n,i){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return i?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function hp(e,t,n,i){if(t===null||typeof t>"u"||pp(e,t,n,i))return!0;if(i)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function Xe(e,t,n,i,r,o,s){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=i,this.attributeNamespace=r,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=o,this.removeEmptyString=s}var Be={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){Be[e]=new Xe(e,0,!1,e,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];Be[t]=new Xe(t,1,!1,e[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(e){Be[e]=new Xe(e,2,!1,e.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){Be[e]=new Xe(e,2,!1,e,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){Be[e]=new Xe(e,3,!1,e.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(e){Be[e]=new Xe(e,3,!0,e,null,!1,!1)});["capture","download"].forEach(function(e){Be[e]=new Xe(e,4,!1,e,null,!1,!1)});["cols","rows","size","span"].forEach(function(e){Be[e]=new Xe(e,6,!1,e,null,!1,!1)});["rowSpan","start"].forEach(function(e){Be[e]=new Xe(e,5,!1,e.toLowerCase(),null,!1,!1)});var zs=/[\-:]([a-z])/g;function Ns(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(zs,Ns);Be[t]=new Xe(t,1,!1,e,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(zs,Ns);Be[t]=new Xe(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(zs,Ns);Be[t]=new Xe(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(e){Be[e]=new Xe(e,1,!1,e.toLowerCase(),null,!1,!1)});Be.xlinkHref=new Xe("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(e){Be[e]=new Xe(e,1,!1,e.toLowerCase(),null,!0,!0)});function Ss(e,t,n,i){var r=Be.hasOwnProperty(t)?Be[t]:null;(r!==null?r.type!==0:i||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(hp(t,n,r,i)&&(n=null),i||r===null?fp(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):r.mustUseProperty?e[r.propertyName]=n===null?r.type===3?!1:"":n:(t=r.attributeName,i=r.attributeNamespace,n===null?e.removeAttribute(t):(r=r.type,n=r===3||r===4&&n===!0?"":""+n,i?e.setAttributeNS(i,t,n):e.setAttribute(t,n))))}var Kt=up.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,br=Symbol.for("react.element"),Yn=Symbol.for("react.portal"),Qn=Symbol.for("react.fragment"),Cs=Symbol.for("react.strict_mode"),No=Symbol.for("react.profiler"),yu=Symbol.for("react.provider"),bu=Symbol.for("react.context"),Es=Symbol.for("react.forward_ref"),So=Symbol.for("react.suspense"),Co=Symbol.for("react.suspense_list"),Ls=Symbol.for("react.memo"),nn=Symbol.for("react.lazy"),ku=Symbol.for("react.offscreen"),Cl=Symbol.iterator;function zi(e){return e===null||typeof e!="object"?null:(e=Cl&&e[Cl]||e["@@iterator"],typeof e=="function"?e:null)}var ze=Object.assign,qa;function Ri(e){if(qa===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);qa=t&&t[1]||""}return`
`+qa+e}var Ka=!1;function Ga(e,t){if(!e||Ka)return"";Ka=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(f){var i=f}Reflect.construct(e,[],t)}else{try{t.call()}catch(f){i=f}e.call(t.prototype)}else{try{throw Error()}catch(f){i=f}e()}}catch(f){if(f&&i&&typeof f.stack=="string"){for(var r=f.stack.split(`
`),o=i.stack.split(`
`),s=r.length-1,c=o.length-1;1<=s&&0<=c&&r[s]!==o[c];)c--;for(;1<=s&&0<=c;s--,c--)if(r[s]!==o[c]){if(s!==1||c!==1)do if(s--,c--,0>c||r[s]!==o[c]){var l=`
`+r[s].replace(" at new "," at ");return e.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",e.displayName)),l}while(1<=s&&0<=c);break}}}finally{Ka=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?Ri(e):""}function gp(e){switch(e.tag){case 5:return Ri(e.type);case 16:return Ri("Lazy");case 13:return Ri("Suspense");case 19:return Ri("SuspenseList");case 0:case 2:case 15:return e=Ga(e.type,!1),e;case 11:return e=Ga(e.type.render,!1),e;case 1:return e=Ga(e.type,!0),e;default:return""}}function Eo(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case Qn:return"Fragment";case Yn:return"Portal";case No:return"Profiler";case Cs:return"StrictMode";case So:return"Suspense";case Co:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case bu:return(e.displayName||"Context")+".Consumer";case yu:return(e._context.displayName||"Context")+".Provider";case Es:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case Ls:return t=e.displayName||null,t!==null?t:Eo(e.type)||"Memo";case nn:t=e._payload,e=e._init;try{return Eo(e(t))}catch{}}return null}function mp(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Eo(t);case 8:return t===Cs?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function vn(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function ju(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function xp(e){var t=ju(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),i=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var r=n.get,o=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return r.call(this)},set:function(s){i=""+s,o.call(this,s)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return i},setValue:function(s){i=""+s},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function kr(e){e._valueTracker||(e._valueTracker=xp(e))}function zu(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),i="";return e&&(i=ju(e)?e.checked?"true":"false":e.value),e=i,e!==n?(t.setValue(e),!0):!1}function ra(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function Lo(e,t){var n=t.checked;return ze({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function El(e,t){var n=t.defaultValue==null?"":t.defaultValue,i=t.checked!=null?t.checked:t.defaultChecked;n=vn(t.value!=null?t.value:n),e._wrapperState={initialChecked:i,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function Nu(e,t){t=t.checked,t!=null&&Ss(e,"checked",t,!1)}function Mo(e,t){Nu(e,t);var n=vn(t.value),i=t.type;if(n!=null)i==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(i==="submit"||i==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?$o(e,t.type,n):t.hasOwnProperty("defaultValue")&&$o(e,t.type,vn(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Ll(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var i=t.type;if(!(i!=="submit"&&i!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function $o(e,t,n){(t!=="number"||ra(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var Pi=Array.isArray;function ri(e,t,n,i){if(e=e.options,t){t={};for(var r=0;r<n.length;r++)t["$"+n[r]]=!0;for(n=0;n<e.length;n++)r=t.hasOwnProperty("$"+e[n].value),e[n].selected!==r&&(e[n].selected=r),r&&i&&(e[n].defaultSelected=!0)}else{for(n=""+vn(n),t=null,r=0;r<e.length;r++){if(e[r].value===n){e[r].selected=!0,i&&(e[r].defaultSelected=!0);return}t!==null||e[r].disabled||(t=e[r])}t!==null&&(t.selected=!0)}}function To(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(P(91));return ze({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Ml(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(P(92));if(Pi(n)){if(1<n.length)throw Error(P(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:vn(n)}}function Su(e,t){var n=vn(t.value),i=vn(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),i!=null&&(e.defaultValue=""+i)}function $l(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function Cu(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Io(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?Cu(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var jr,Eu=function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,i,r){MSApp.execUnsafeLocalFunction(function(){return e(t,n,i,r)})}:e}(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(jr=jr||document.createElement("div"),jr.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=jr.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function Ji(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var Oi={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},vp=["Webkit","ms","Moz","O"];Object.keys(Oi).forEach(function(e){vp.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),Oi[t]=Oi[e]})});function Lu(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||Oi.hasOwnProperty(e)&&Oi[e]?(""+t).trim():t+"px"}function Mu(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var i=n.indexOf("--")===0,r=Lu(n,t[n],i);n==="float"&&(n="cssFloat"),i?e.setProperty(n,r):e[n]=r}}var _p=ze({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Ro(e,t){if(t){if(_p[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(P(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(P(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(P(61))}if(t.style!=null&&typeof t.style!="object")throw Error(P(62))}}function Po(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Ao=null;function Ms(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Fo=null,ai=null,oi=null;function Tl(e){if(e=_r(e)){if(typeof Fo!="function")throw Error(P(280));var t=e.stateNode;t&&(t=Ia(t),Fo(e.stateNode,e.type,t))}}function $u(e){ai?oi?oi.push(e):oi=[e]:ai=e}function Tu(){if(ai){var e=ai,t=oi;if(oi=ai=null,Tl(e),t)for(e=0;e<t.length;e++)Tl(t[e])}}function Iu(e,t){return e(t)}function Ru(){}var Xa=!1;function Pu(e,t,n){if(Xa)return e(t,n);Xa=!0;try{return Iu(e,t,n)}finally{Xa=!1,(ai!==null||oi!==null)&&(Ru(),Tu())}}function er(e,t){var n=e.stateNode;if(n===null)return null;var i=Ia(n);if(i===null)return null;n=i[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(e=e.type,i=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!i;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(P(231,t,typeof n));return n}var Do=!1;if(Yt)try{var Ni={};Object.defineProperty(Ni,"passive",{get:function(){Do=!0}}),window.addEventListener("test",Ni,Ni),window.removeEventListener("test",Ni,Ni)}catch{Do=!1}function wp(e,t,n,i,r,o,s,c,l){var f=Array.prototype.slice.call(arguments,3);try{t.apply(n,f)}catch(x){this.onError(x)}}var Bi=!1,aa=null,oa=!1,Oo=null,yp={onError:function(e){Bi=!0,aa=e}};function bp(e,t,n,i,r,o,s,c,l){Bi=!1,aa=null,wp.apply(yp,arguments)}function kp(e,t,n,i,r,o,s,c,l){if(bp.apply(this,arguments),Bi){if(Bi){var f=aa;Bi=!1,aa=null}else throw Error(P(198));oa||(oa=!0,Oo=f)}}function On(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function Au(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Il(e){if(On(e)!==e)throw Error(P(188))}function jp(e){var t=e.alternate;if(!t){if(t=On(e),t===null)throw Error(P(188));return t!==e?null:e}for(var n=e,i=t;;){var r=n.return;if(r===null)break;var o=r.alternate;if(o===null){if(i=r.return,i!==null){n=i;continue}break}if(r.child===o.child){for(o=r.child;o;){if(o===n)return Il(r),e;if(o===i)return Il(r),t;o=o.sibling}throw Error(P(188))}if(n.return!==i.return)n=r,i=o;else{for(var s=!1,c=r.child;c;){if(c===n){s=!0,n=r,i=o;break}if(c===i){s=!0,i=r,n=o;break}c=c.sibling}if(!s){for(c=o.child;c;){if(c===n){s=!0,n=o,i=r;break}if(c===i){s=!0,i=o,n=r;break}c=c.sibling}if(!s)throw Error(P(189))}}if(n.alternate!==i)throw Error(P(190))}if(n.tag!==3)throw Error(P(188));return n.stateNode.current===n?e:t}function Fu(e){return e=jp(e),e!==null?Du(e):null}function Du(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=Du(e);if(t!==null)return t;e=e.sibling}return null}var Ou=dt.unstable_scheduleCallback,Rl=dt.unstable_cancelCallback,zp=dt.unstable_shouldYield,Np=dt.unstable_requestPaint,Se=dt.unstable_now,Sp=dt.unstable_getCurrentPriorityLevel,$s=dt.unstable_ImmediatePriority,Bu=dt.unstable_UserBlockingPriority,sa=dt.unstable_NormalPriority,Cp=dt.unstable_LowPriority,Hu=dt.unstable_IdlePriority,La=null,Pt=null;function Ep(e){if(Pt&&typeof Pt.onCommitFiberRoot=="function")try{Pt.onCommitFiberRoot(La,e,void 0,(e.current.flags&128)===128)}catch{}}var Ct=Math.clz32?Math.clz32:$p,Lp=Math.log,Mp=Math.LN2;function $p(e){return e>>>=0,e===0?32:31-(Lp(e)/Mp|0)|0}var zr=64,Nr=4194304;function Ai(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function la(e,t){var n=e.pendingLanes;if(n===0)return 0;var i=0,r=e.suspendedLanes,o=e.pingedLanes,s=n&268435455;if(s!==0){var c=s&~r;c!==0?i=Ai(c):(o&=s,o!==0&&(i=Ai(o)))}else s=n&~r,s!==0?i=Ai(s):o!==0&&(i=Ai(o));if(i===0)return 0;if(t!==0&&t!==i&&!(t&r)&&(r=i&-i,o=t&-t,r>=o||r===16&&(o&4194240)!==0))return t;if(i&4&&(i|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=i;0<t;)n=31-Ct(t),r=1<<n,i|=e[n],t&=~r;return i}function Tp(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Ip(e,t){for(var n=e.suspendedLanes,i=e.pingedLanes,r=e.expirationTimes,o=e.pendingLanes;0<o;){var s=31-Ct(o),c=1<<s,l=r[s];l===-1?(!(c&n)||c&i)&&(r[s]=Tp(c,t)):l<=t&&(e.expiredLanes|=c),o&=~c}}function Bo(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function Wu(){var e=zr;return zr<<=1,!(zr&4194240)&&(zr=64),e}function Ja(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function xr(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-Ct(t),e[t]=n}function Rp(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var i=e.eventTimes;for(e=e.expirationTimes;0<n;){var r=31-Ct(n),o=1<<r;t[r]=0,i[r]=-1,e[r]=-1,n&=~o}}function Ts(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var i=31-Ct(n),r=1<<i;r&t|e[i]&t&&(e[i]|=t),n&=~r}}var de=0;function Uu(e){return e&=-e,1<e?4<e?e&268435455?16:536870912:4:1}var Vu,Is,Yu,Qu,Zu,Ho=!1,Sr=[],un=null,dn=null,fn=null,tr=new Map,nr=new Map,an=[],Pp="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Pl(e,t){switch(e){case"focusin":case"focusout":un=null;break;case"dragenter":case"dragleave":dn=null;break;case"mouseover":case"mouseout":fn=null;break;case"pointerover":case"pointerout":tr.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":nr.delete(t.pointerId)}}function Si(e,t,n,i,r,o){return e===null||e.nativeEvent!==o?(e={blockedOn:t,domEventName:n,eventSystemFlags:i,nativeEvent:o,targetContainers:[r]},t!==null&&(t=_r(t),t!==null&&Is(t)),e):(e.eventSystemFlags|=i,t=e.targetContainers,r!==null&&t.indexOf(r)===-1&&t.push(r),e)}function Ap(e,t,n,i,r){switch(t){case"focusin":return un=Si(un,e,t,n,i,r),!0;case"dragenter":return dn=Si(dn,e,t,n,i,r),!0;case"mouseover":return fn=Si(fn,e,t,n,i,r),!0;case"pointerover":var o=r.pointerId;return tr.set(o,Si(tr.get(o)||null,e,t,n,i,r)),!0;case"gotpointercapture":return o=r.pointerId,nr.set(o,Si(nr.get(o)||null,e,t,n,i,r)),!0}return!1}function qu(e){var t=Cn(e.target);if(t!==null){var n=On(t);if(n!==null){if(t=n.tag,t===13){if(t=Au(n),t!==null){e.blockedOn=t,Zu(e.priority,function(){Yu(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Zr(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=Wo(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var i=new n.constructor(n.type,n);Ao=i,n.target.dispatchEvent(i),Ao=null}else return t=_r(n),t!==null&&Is(t),e.blockedOn=n,!1;t.shift()}return!0}function Al(e,t,n){Zr(e)&&n.delete(t)}function Fp(){Ho=!1,un!==null&&Zr(un)&&(un=null),dn!==null&&Zr(dn)&&(dn=null),fn!==null&&Zr(fn)&&(fn=null),tr.forEach(Al),nr.forEach(Al)}function Ci(e,t){e.blockedOn===t&&(e.blockedOn=null,Ho||(Ho=!0,dt.unstable_scheduleCallback(dt.unstable_NormalPriority,Fp)))}function ir(e){function t(r){return Ci(r,e)}if(0<Sr.length){Ci(Sr[0],e);for(var n=1;n<Sr.length;n++){var i=Sr[n];i.blockedOn===e&&(i.blockedOn=null)}}for(un!==null&&Ci(un,e),dn!==null&&Ci(dn,e),fn!==null&&Ci(fn,e),tr.forEach(t),nr.forEach(t),n=0;n<an.length;n++)i=an[n],i.blockedOn===e&&(i.blockedOn=null);for(;0<an.length&&(n=an[0],n.blockedOn===null);)qu(n),n.blockedOn===null&&an.shift()}var si=Kt.ReactCurrentBatchConfig,ca=!0;function Dp(e,t,n,i){var r=de,o=si.transition;si.transition=null;try{de=1,Rs(e,t,n,i)}finally{de=r,si.transition=o}}function Op(e,t,n,i){var r=de,o=si.transition;si.transition=null;try{de=4,Rs(e,t,n,i)}finally{de=r,si.transition=o}}function Rs(e,t,n,i){if(ca){var r=Wo(e,t,n,i);if(r===null)co(e,t,i,ua,n),Pl(e,i);else if(Ap(r,e,t,n,i))i.stopPropagation();else if(Pl(e,i),t&4&&-1<Pp.indexOf(e)){for(;r!==null;){var o=_r(r);if(o!==null&&Vu(o),o=Wo(e,t,n,i),o===null&&co(e,t,i,ua,n),o===r)break;r=o}r!==null&&i.stopPropagation()}else co(e,t,i,null,n)}}var ua=null;function Wo(e,t,n,i){if(ua=null,e=Ms(i),e=Cn(e),e!==null)if(t=On(e),t===null)e=null;else if(n=t.tag,n===13){if(e=Au(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return ua=e,null}function Ku(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Sp()){case $s:return 1;case Bu:return 4;case sa:case Cp:return 16;case Hu:return 536870912;default:return 16}default:return 16}}var ln=null,Ps=null,qr=null;function Gu(){if(qr)return qr;var e,t=Ps,n=t.length,i,r="value"in ln?ln.value:ln.textContent,o=r.length;for(e=0;e<n&&t[e]===r[e];e++);var s=n-e;for(i=1;i<=s&&t[n-i]===r[o-i];i++);return qr=r.slice(e,1<i?1-i:void 0)}function Kr(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Cr(){return!0}function Fl(){return!1}function pt(e){function t(n,i,r,o,s){this._reactName=n,this._targetInst=r,this.type=i,this.nativeEvent=o,this.target=s,this.currentTarget=null;for(var c in e)e.hasOwnProperty(c)&&(n=e[c],this[c]=n?n(o):o[c]);return this.isDefaultPrevented=(o.defaultPrevented!=null?o.defaultPrevented:o.returnValue===!1)?Cr:Fl,this.isPropagationStopped=Fl,this}return ze(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Cr)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Cr)},persist:function(){},isPersistent:Cr}),t}var vi={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},As=pt(vi),vr=ze({},vi,{view:0,detail:0}),Bp=pt(vr),eo,to,Ei,Ma=ze({},vr,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Fs,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Ei&&(Ei&&e.type==="mousemove"?(eo=e.screenX-Ei.screenX,to=e.screenY-Ei.screenY):to=eo=0,Ei=e),eo)},movementY:function(e){return"movementY"in e?e.movementY:to}}),Dl=pt(Ma),Hp=ze({},Ma,{dataTransfer:0}),Wp=pt(Hp),Up=ze({},vr,{relatedTarget:0}),no=pt(Up),Vp=ze({},vi,{animationName:0,elapsedTime:0,pseudoElement:0}),Yp=pt(Vp),Qp=ze({},vi,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Zp=pt(Qp),qp=ze({},vi,{data:0}),Ol=pt(qp),Kp={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Gp={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Xp={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Jp(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Xp[e])?!!t[e]:!1}function Fs(){return Jp}var e0=ze({},vr,{key:function(e){if(e.key){var t=Kp[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Kr(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Gp[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Fs,charCode:function(e){return e.type==="keypress"?Kr(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Kr(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),t0=pt(e0),n0=ze({},Ma,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Bl=pt(n0),i0=ze({},vr,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Fs}),r0=pt(i0),a0=ze({},vi,{propertyName:0,elapsedTime:0,pseudoElement:0}),o0=pt(a0),s0=ze({},Ma,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),l0=pt(s0),c0=[9,13,27,32],Ds=Yt&&"CompositionEvent"in window,Hi=null;Yt&&"documentMode"in document&&(Hi=document.documentMode);var u0=Yt&&"TextEvent"in window&&!Hi,Xu=Yt&&(!Ds||Hi&&8<Hi&&11>=Hi),Hl=" ",Wl=!1;function Ju(e,t){switch(e){case"keyup":return c0.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function ed(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Zn=!1;function d0(e,t){switch(e){case"compositionend":return ed(t);case"keypress":return t.which!==32?null:(Wl=!0,Hl);case"textInput":return e=t.data,e===Hl&&Wl?null:e;default:return null}}function f0(e,t){if(Zn)return e==="compositionend"||!Ds&&Ju(e,t)?(e=Gu(),qr=Ps=ln=null,Zn=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Xu&&t.locale!=="ko"?null:t.data;default:return null}}var p0={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Ul(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!p0[e.type]:t==="textarea"}function td(e,t,n,i){$u(i),t=da(t,"onChange"),0<t.length&&(n=new As("onChange","change",null,n,i),e.push({event:n,listeners:t}))}var Wi=null,rr=null;function h0(e){fd(e,0)}function $a(e){var t=Gn(e);if(zu(t))return e}function g0(e,t){if(e==="change")return t}var nd=!1;if(Yt){var io;if(Yt){var ro="oninput"in document;if(!ro){var Vl=document.createElement("div");Vl.setAttribute("oninput","return;"),ro=typeof Vl.oninput=="function"}io=ro}else io=!1;nd=io&&(!document.documentMode||9<document.documentMode)}function Yl(){Wi&&(Wi.detachEvent("onpropertychange",id),rr=Wi=null)}function id(e){if(e.propertyName==="value"&&$a(rr)){var t=[];td(t,rr,e,Ms(e)),Pu(h0,t)}}function m0(e,t,n){e==="focusin"?(Yl(),Wi=t,rr=n,Wi.attachEvent("onpropertychange",id)):e==="focusout"&&Yl()}function x0(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return $a(rr)}function v0(e,t){if(e==="click")return $a(t)}function _0(e,t){if(e==="input"||e==="change")return $a(t)}function w0(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Lt=typeof Object.is=="function"?Object.is:w0;function ar(e,t){if(Lt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),i=Object.keys(t);if(n.length!==i.length)return!1;for(i=0;i<n.length;i++){var r=n[i];if(!zo.call(t,r)||!Lt(e[r],t[r]))return!1}return!0}function Ql(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Zl(e,t){var n=Ql(e);e=0;for(var i;n;){if(n.nodeType===3){if(i=e+n.textContent.length,e<=t&&i>=t)return{node:n,offset:t-e};e=i}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Ql(n)}}function rd(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?rd(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function ad(){for(var e=window,t=ra();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=ra(e.document)}return t}function Os(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function y0(e){var t=ad(),n=e.focusedElem,i=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&rd(n.ownerDocument.documentElement,n)){if(i!==null&&Os(n)){if(t=i.start,e=i.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var r=n.textContent.length,o=Math.min(i.start,r);i=i.end===void 0?o:Math.min(i.end,r),!e.extend&&o>i&&(r=i,i=o,o=r),r=Zl(n,o);var s=Zl(n,i);r&&s&&(e.rangeCount!==1||e.anchorNode!==r.node||e.anchorOffset!==r.offset||e.focusNode!==s.node||e.focusOffset!==s.offset)&&(t=t.createRange(),t.setStart(r.node,r.offset),e.removeAllRanges(),o>i?(e.addRange(t),e.extend(s.node,s.offset)):(t.setEnd(s.node,s.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var b0=Yt&&"documentMode"in document&&11>=document.documentMode,qn=null,Uo=null,Ui=null,Vo=!1;function ql(e,t,n){var i=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Vo||qn==null||qn!==ra(i)||(i=qn,"selectionStart"in i&&Os(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),Ui&&ar(Ui,i)||(Ui=i,i=da(Uo,"onSelect"),0<i.length&&(t=new As("onSelect","select",null,t,n),e.push({event:t,listeners:i}),t.target=qn)))}function Er(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var Kn={animationend:Er("Animation","AnimationEnd"),animationiteration:Er("Animation","AnimationIteration"),animationstart:Er("Animation","AnimationStart"),transitionend:Er("Transition","TransitionEnd")},ao={},od={};Yt&&(od=document.createElement("div").style,"AnimationEvent"in window||(delete Kn.animationend.animation,delete Kn.animationiteration.animation,delete Kn.animationstart.animation),"TransitionEvent"in window||delete Kn.transitionend.transition);function Ta(e){if(ao[e])return ao[e];if(!Kn[e])return e;var t=Kn[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in od)return ao[e]=t[n];return e}var sd=Ta("animationend"),ld=Ta("animationiteration"),cd=Ta("animationstart"),ud=Ta("transitionend"),dd=new Map,Kl="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function wn(e,t){dd.set(e,t),Dn(t,[e])}for(var oo=0;oo<Kl.length;oo++){var so=Kl[oo],k0=so.toLowerCase(),j0=so[0].toUpperCase()+so.slice(1);wn(k0,"on"+j0)}wn(sd,"onAnimationEnd");wn(ld,"onAnimationIteration");wn(cd,"onAnimationStart");wn("dblclick","onDoubleClick");wn("focusin","onFocus");wn("focusout","onBlur");wn(ud,"onTransitionEnd");ui("onMouseEnter",["mouseout","mouseover"]);ui("onMouseLeave",["mouseout","mouseover"]);ui("onPointerEnter",["pointerout","pointerover"]);ui("onPointerLeave",["pointerout","pointerover"]);Dn("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Dn("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Dn("onBeforeInput",["compositionend","keypress","textInput","paste"]);Dn("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Dn("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Dn("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Fi="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),z0=new Set("cancel close invalid load scroll toggle".split(" ").concat(Fi));function Gl(e,t,n){var i=e.type||"unknown-event";e.currentTarget=n,kp(i,t,void 0,e),e.currentTarget=null}function fd(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var i=e[n],r=i.event;i=i.listeners;e:{var o=void 0;if(t)for(var s=i.length-1;0<=s;s--){var c=i[s],l=c.instance,f=c.currentTarget;if(c=c.listener,l!==o&&r.isPropagationStopped())break e;Gl(r,c,f),o=l}else for(s=0;s<i.length;s++){if(c=i[s],l=c.instance,f=c.currentTarget,c=c.listener,l!==o&&r.isPropagationStopped())break e;Gl(r,c,f),o=l}}}if(oa)throw e=Oo,oa=!1,Oo=null,e}function me(e,t){var n=t[Ko];n===void 0&&(n=t[Ko]=new Set);var i=e+"__bubble";n.has(i)||(pd(t,e,2,!1),n.add(i))}function lo(e,t,n){var i=0;t&&(i|=4),pd(n,e,i,t)}var Lr="_reactListening"+Math.random().toString(36).slice(2);function or(e){if(!e[Lr]){e[Lr]=!0,wu.forEach(function(n){n!=="selectionchange"&&(z0.has(n)||lo(n,!1,e),lo(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Lr]||(t[Lr]=!0,lo("selectionchange",!1,t))}}function pd(e,t,n,i){switch(Ku(t)){case 1:var r=Dp;break;case 4:r=Op;break;default:r=Rs}n=r.bind(null,t,n,e),r=void 0,!Do||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(r=!0),i?r!==void 0?e.addEventListener(t,n,{capture:!0,passive:r}):e.addEventListener(t,n,!0):r!==void 0?e.addEventListener(t,n,{passive:r}):e.addEventListener(t,n,!1)}function co(e,t,n,i,r){var o=i;if(!(t&1)&&!(t&2)&&i!==null)e:for(;;){if(i===null)return;var s=i.tag;if(s===3||s===4){var c=i.stateNode.containerInfo;if(c===r||c.nodeType===8&&c.parentNode===r)break;if(s===4)for(s=i.return;s!==null;){var l=s.tag;if((l===3||l===4)&&(l=s.stateNode.containerInfo,l===r||l.nodeType===8&&l.parentNode===r))return;s=s.return}for(;c!==null;){if(s=Cn(c),s===null)return;if(l=s.tag,l===5||l===6){i=o=s;continue e}c=c.parentNode}}i=i.return}Pu(function(){var f=o,x=Ms(n),v=[];e:{var g=dd.get(e);if(g!==void 0){var b=As,w=e;switch(e){case"keypress":if(Kr(n)===0)break e;case"keydown":case"keyup":b=t0;break;case"focusin":w="focus",b=no;break;case"focusout":w="blur",b=no;break;case"beforeblur":case"afterblur":b=no;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":b=Dl;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":b=Wp;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":b=r0;break;case sd:case ld:case cd:b=Yp;break;case ud:b=o0;break;case"scroll":b=Bp;break;case"wheel":b=l0;break;case"copy":case"cut":case"paste":b=Zp;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":b=Bl}var j=(t&4)!==0,E=!j&&e==="scroll",p=j?g!==null?g+"Capture":null:g;j=[];for(var d=f,m;d!==null;){m=d;var y=m.stateNode;if(m.tag===5&&y!==null&&(m=y,p!==null&&(y=er(d,p),y!=null&&j.push(sr(d,y,m)))),E)break;d=d.return}0<j.length&&(g=new b(g,w,null,n,x),v.push({event:g,listeners:j}))}}if(!(t&7)){e:{if(g=e==="mouseover"||e==="pointerover",b=e==="mouseout"||e==="pointerout",g&&n!==Ao&&(w=n.relatedTarget||n.fromElement)&&(Cn(w)||w[Qt]))break e;if((b||g)&&(g=x.window===x?x:(g=x.ownerDocument)?g.defaultView||g.parentWindow:window,b?(w=n.relatedTarget||n.toElement,b=f,w=w?Cn(w):null,w!==null&&(E=On(w),w!==E||w.tag!==5&&w.tag!==6)&&(w=null)):(b=null,w=f),b!==w)){if(j=Dl,y="onMouseLeave",p="onMouseEnter",d="mouse",(e==="pointerout"||e==="pointerover")&&(j=Bl,y="onPointerLeave",p="onPointerEnter",d="pointer"),E=b==null?g:Gn(b),m=w==null?g:Gn(w),g=new j(y,d+"leave",b,n,x),g.target=E,g.relatedTarget=m,y=null,Cn(x)===f&&(j=new j(p,d+"enter",w,n,x),j.target=m,j.relatedTarget=E,y=j),E=y,b&&w)t:{for(j=b,p=w,d=0,m=j;m;m=Bn(m))d++;for(m=0,y=p;y;y=Bn(y))m++;for(;0<d-m;)j=Bn(j),d--;for(;0<m-d;)p=Bn(p),m--;for(;d--;){if(j===p||p!==null&&j===p.alternate)break t;j=Bn(j),p=Bn(p)}j=null}else j=null;b!==null&&Xl(v,g,b,j,!1),w!==null&&E!==null&&Xl(v,E,w,j,!0)}}e:{if(g=f?Gn(f):window,b=g.nodeName&&g.nodeName.toLowerCase(),b==="select"||b==="input"&&g.type==="file")var R=g0;else if(Ul(g))if(nd)R=_0;else{R=x0;var I=m0}else(b=g.nodeName)&&b.toLowerCase()==="input"&&(g.type==="checkbox"||g.type==="radio")&&(R=v0);if(R&&(R=R(e,f))){td(v,R,n,x);break e}I&&I(e,g,f),e==="focusout"&&(I=g._wrapperState)&&I.controlled&&g.type==="number"&&$o(g,"number",g.value)}switch(I=f?Gn(f):window,e){case"focusin":(Ul(I)||I.contentEditable==="true")&&(qn=I,Uo=f,Ui=null);break;case"focusout":Ui=Uo=qn=null;break;case"mousedown":Vo=!0;break;case"contextmenu":case"mouseup":case"dragend":Vo=!1,ql(v,n,x);break;case"selectionchange":if(b0)break;case"keydown":case"keyup":ql(v,n,x)}var N;if(Ds)e:{switch(e){case"compositionstart":var T="onCompositionStart";break e;case"compositionend":T="onCompositionEnd";break e;case"compositionupdate":T="onCompositionUpdate";break e}T=void 0}else Zn?Ju(e,n)&&(T="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(T="onCompositionStart");T&&(Xu&&n.locale!=="ko"&&(Zn||T!=="onCompositionStart"?T==="onCompositionEnd"&&Zn&&(N=Gu()):(ln=x,Ps="value"in ln?ln.value:ln.textContent,Zn=!0)),I=da(f,T),0<I.length&&(T=new Ol(T,e,null,n,x),v.push({event:T,listeners:I}),N?T.data=N:(N=ed(n),N!==null&&(T.data=N)))),(N=u0?d0(e,n):f0(e,n))&&(f=da(f,"onBeforeInput"),0<f.length&&(x=new Ol("onBeforeInput","beforeinput",null,n,x),v.push({event:x,listeners:f}),x.data=N))}fd(v,t)})}function sr(e,t,n){return{instance:e,listener:t,currentTarget:n}}function da(e,t){for(var n=t+"Capture",i=[];e!==null;){var r=e,o=r.stateNode;r.tag===5&&o!==null&&(r=o,o=er(e,n),o!=null&&i.unshift(sr(e,o,r)),o=er(e,t),o!=null&&i.push(sr(e,o,r))),e=e.return}return i}function Bn(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function Xl(e,t,n,i,r){for(var o=t._reactName,s=[];n!==null&&n!==i;){var c=n,l=c.alternate,f=c.stateNode;if(l!==null&&l===i)break;c.tag===5&&f!==null&&(c=f,r?(l=er(n,o),l!=null&&s.unshift(sr(n,l,c))):r||(l=er(n,o),l!=null&&s.push(sr(n,l,c)))),n=n.return}s.length!==0&&e.push({event:t,listeners:s})}var N0=/\r\n?/g,S0=/\u0000|\uFFFD/g;function Jl(e){return(typeof e=="string"?e:""+e).replace(N0,`
`).replace(S0,"")}function Mr(e,t,n){if(t=Jl(t),Jl(e)!==t&&n)throw Error(P(425))}function fa(){}var Yo=null,Qo=null;function Zo(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var qo=typeof setTimeout=="function"?setTimeout:void 0,C0=typeof clearTimeout=="function"?clearTimeout:void 0,ec=typeof Promise=="function"?Promise:void 0,E0=typeof queueMicrotask=="function"?queueMicrotask:typeof ec<"u"?function(e){return ec.resolve(null).then(e).catch(L0)}:qo;function L0(e){setTimeout(function(){throw e})}function uo(e,t){var n=t,i=0;do{var r=n.nextSibling;if(e.removeChild(n),r&&r.nodeType===8)if(n=r.data,n==="/$"){if(i===0){e.removeChild(r),ir(t);return}i--}else n!=="$"&&n!=="$?"&&n!=="$!"||i++;n=r}while(n);ir(t)}function pn(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function tc(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var _i=Math.random().toString(36).slice(2),Rt="__reactFiber$"+_i,lr="__reactProps$"+_i,Qt="__reactContainer$"+_i,Ko="__reactEvents$"+_i,M0="__reactListeners$"+_i,$0="__reactHandles$"+_i;function Cn(e){var t=e[Rt];if(t)return t;for(var n=e.parentNode;n;){if(t=n[Qt]||n[Rt]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=tc(e);e!==null;){if(n=e[Rt])return n;e=tc(e)}return t}e=n,n=e.parentNode}return null}function _r(e){return e=e[Rt]||e[Qt],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function Gn(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(P(33))}function Ia(e){return e[lr]||null}var Go=[],Xn=-1;function yn(e){return{current:e}}function xe(e){0>Xn||(e.current=Go[Xn],Go[Xn]=null,Xn--)}function ge(e,t){Xn++,Go[Xn]=e.current,e.current=t}var _n={},Ye=yn(_n),nt=yn(!1),In=_n;function di(e,t){var n=e.type.contextTypes;if(!n)return _n;var i=e.stateNode;if(i&&i.__reactInternalMemoizedUnmaskedChildContext===t)return i.__reactInternalMemoizedMaskedChildContext;var r={},o;for(o in n)r[o]=t[o];return i&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=r),r}function it(e){return e=e.childContextTypes,e!=null}function pa(){xe(nt),xe(Ye)}function nc(e,t,n){if(Ye.current!==_n)throw Error(P(168));ge(Ye,t),ge(nt,n)}function hd(e,t,n){var i=e.stateNode;if(t=t.childContextTypes,typeof i.getChildContext!="function")return n;i=i.getChildContext();for(var r in i)if(!(r in t))throw Error(P(108,mp(e)||"Unknown",r));return ze({},n,i)}function ha(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||_n,In=Ye.current,ge(Ye,e),ge(nt,nt.current),!0}function ic(e,t,n){var i=e.stateNode;if(!i)throw Error(P(169));n?(e=hd(e,t,In),i.__reactInternalMemoizedMergedChildContext=e,xe(nt),xe(Ye),ge(Ye,e)):xe(nt),ge(nt,n)}var Bt=null,Ra=!1,fo=!1;function gd(e){Bt===null?Bt=[e]:Bt.push(e)}function T0(e){Ra=!0,gd(e)}function bn(){if(!fo&&Bt!==null){fo=!0;var e=0,t=de;try{var n=Bt;for(de=1;e<n.length;e++){var i=n[e];do i=i(!0);while(i!==null)}Bt=null,Ra=!1}catch(r){throw Bt!==null&&(Bt=Bt.slice(e+1)),Ou($s,bn),r}finally{de=t,fo=!1}}return null}var Jn=[],ei=0,ga=null,ma=0,mt=[],xt=0,Rn=null,Wt=1,Ut="";function zn(e,t){Jn[ei++]=ma,Jn[ei++]=ga,ga=e,ma=t}function md(e,t,n){mt[xt++]=Wt,mt[xt++]=Ut,mt[xt++]=Rn,Rn=e;var i=Wt;e=Ut;var r=32-Ct(i)-1;i&=~(1<<r),n+=1;var o=32-Ct(t)+r;if(30<o){var s=r-r%5;o=(i&(1<<s)-1).toString(32),i>>=s,r-=s,Wt=1<<32-Ct(t)+r|n<<r|i,Ut=o+e}else Wt=1<<o|n<<r|i,Ut=e}function Bs(e){e.return!==null&&(zn(e,1),md(e,1,0))}function Hs(e){for(;e===ga;)ga=Jn[--ei],Jn[ei]=null,ma=Jn[--ei],Jn[ei]=null;for(;e===Rn;)Rn=mt[--xt],mt[xt]=null,Ut=mt[--xt],mt[xt]=null,Wt=mt[--xt],mt[xt]=null}var ut=null,ct=null,_e=!1,St=null;function xd(e,t){var n=vt(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function rc(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,ut=e,ct=pn(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,ut=e,ct=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=Rn!==null?{id:Wt,overflow:Ut}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=vt(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,ut=e,ct=null,!0):!1;default:return!1}}function Xo(e){return(e.mode&1)!==0&&(e.flags&128)===0}function Jo(e){if(_e){var t=ct;if(t){var n=t;if(!rc(e,t)){if(Xo(e))throw Error(P(418));t=pn(n.nextSibling);var i=ut;t&&rc(e,t)?xd(i,n):(e.flags=e.flags&-4097|2,_e=!1,ut=e)}}else{if(Xo(e))throw Error(P(418));e.flags=e.flags&-4097|2,_e=!1,ut=e}}}function ac(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;ut=e}function $r(e){if(e!==ut)return!1;if(!_e)return ac(e),_e=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!Zo(e.type,e.memoizedProps)),t&&(t=ct)){if(Xo(e))throw vd(),Error(P(418));for(;t;)xd(e,t),t=pn(t.nextSibling)}if(ac(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(P(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){ct=pn(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}ct=null}}else ct=ut?pn(e.stateNode.nextSibling):null;return!0}function vd(){for(var e=ct;e;)e=pn(e.nextSibling)}function fi(){ct=ut=null,_e=!1}function Ws(e){St===null?St=[e]:St.push(e)}var I0=Kt.ReactCurrentBatchConfig;function Li(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(P(309));var i=n.stateNode}if(!i)throw Error(P(147,e));var r=i,o=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===o?t.ref:(t=function(s){var c=r.refs;s===null?delete c[o]:c[o]=s},t._stringRef=o,t)}if(typeof e!="string")throw Error(P(284));if(!n._owner)throw Error(P(290,e))}return e}function Tr(e,t){throw e=Object.prototype.toString.call(t),Error(P(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function oc(e){var t=e._init;return t(e._payload)}function _d(e){function t(p,d){if(e){var m=p.deletions;m===null?(p.deletions=[d],p.flags|=16):m.push(d)}}function n(p,d){if(!e)return null;for(;d!==null;)t(p,d),d=d.sibling;return null}function i(p,d){for(p=new Map;d!==null;)d.key!==null?p.set(d.key,d):p.set(d.index,d),d=d.sibling;return p}function r(p,d){return p=xn(p,d),p.index=0,p.sibling=null,p}function o(p,d,m){return p.index=m,e?(m=p.alternate,m!==null?(m=m.index,m<d?(p.flags|=2,d):m):(p.flags|=2,d)):(p.flags|=1048576,d)}function s(p){return e&&p.alternate===null&&(p.flags|=2),p}function c(p,d,m,y){return d===null||d.tag!==6?(d=_o(m,p.mode,y),d.return=p,d):(d=r(d,m),d.return=p,d)}function l(p,d,m,y){var R=m.type;return R===Qn?x(p,d,m.props.children,y,m.key):d!==null&&(d.elementType===R||typeof R=="object"&&R!==null&&R.$$typeof===nn&&oc(R)===d.type)?(y=r(d,m.props),y.ref=Li(p,d,m),y.return=p,y):(y=ia(m.type,m.key,m.props,null,p.mode,y),y.ref=Li(p,d,m),y.return=p,y)}function f(p,d,m,y){return d===null||d.tag!==4||d.stateNode.containerInfo!==m.containerInfo||d.stateNode.implementation!==m.implementation?(d=wo(m,p.mode,y),d.return=p,d):(d=r(d,m.children||[]),d.return=p,d)}function x(p,d,m,y,R){return d===null||d.tag!==7?(d=Tn(m,p.mode,y,R),d.return=p,d):(d=r(d,m),d.return=p,d)}function v(p,d,m){if(typeof d=="string"&&d!==""||typeof d=="number")return d=_o(""+d,p.mode,m),d.return=p,d;if(typeof d=="object"&&d!==null){switch(d.$$typeof){case br:return m=ia(d.type,d.key,d.props,null,p.mode,m),m.ref=Li(p,null,d),m.return=p,m;case Yn:return d=wo(d,p.mode,m),d.return=p,d;case nn:var y=d._init;return v(p,y(d._payload),m)}if(Pi(d)||zi(d))return d=Tn(d,p.mode,m,null),d.return=p,d;Tr(p,d)}return null}function g(p,d,m,y){var R=d!==null?d.key:null;if(typeof m=="string"&&m!==""||typeof m=="number")return R!==null?null:c(p,d,""+m,y);if(typeof m=="object"&&m!==null){switch(m.$$typeof){case br:return m.key===R?l(p,d,m,y):null;case Yn:return m.key===R?f(p,d,m,y):null;case nn:return R=m._init,g(p,d,R(m._payload),y)}if(Pi(m)||zi(m))return R!==null?null:x(p,d,m,y,null);Tr(p,m)}return null}function b(p,d,m,y,R){if(typeof y=="string"&&y!==""||typeof y=="number")return p=p.get(m)||null,c(d,p,""+y,R);if(typeof y=="object"&&y!==null){switch(y.$$typeof){case br:return p=p.get(y.key===null?m:y.key)||null,l(d,p,y,R);case Yn:return p=p.get(y.key===null?m:y.key)||null,f(d,p,y,R);case nn:var I=y._init;return b(p,d,m,I(y._payload),R)}if(Pi(y)||zi(y))return p=p.get(m)||null,x(d,p,y,R,null);Tr(d,y)}return null}function w(p,d,m,y){for(var R=null,I=null,N=d,T=d=0,H=null;N!==null&&T<m.length;T++){N.index>T?(H=N,N=null):H=N.sibling;var U=g(p,N,m[T],y);if(U===null){N===null&&(N=H);break}e&&N&&U.alternate===null&&t(p,N),d=o(U,d,T),I===null?R=U:I.sibling=U,I=U,N=H}if(T===m.length)return n(p,N),_e&&zn(p,T),R;if(N===null){for(;T<m.length;T++)N=v(p,m[T],y),N!==null&&(d=o(N,d,T),I===null?R=N:I.sibling=N,I=N);return _e&&zn(p,T),R}for(N=i(p,N);T<m.length;T++)H=b(N,p,T,m[T],y),H!==null&&(e&&H.alternate!==null&&N.delete(H.key===null?T:H.key),d=o(H,d,T),I===null?R=H:I.sibling=H,I=H);return e&&N.forEach(function(S){return t(p,S)}),_e&&zn(p,T),R}function j(p,d,m,y){var R=zi(m);if(typeof R!="function")throw Error(P(150));if(m=R.call(m),m==null)throw Error(P(151));for(var I=R=null,N=d,T=d=0,H=null,U=m.next();N!==null&&!U.done;T++,U=m.next()){N.index>T?(H=N,N=null):H=N.sibling;var S=g(p,N,U.value,y);if(S===null){N===null&&(N=H);break}e&&N&&S.alternate===null&&t(p,N),d=o(S,d,T),I===null?R=S:I.sibling=S,I=S,N=H}if(U.done)return n(p,N),_e&&zn(p,T),R;if(N===null){for(;!U.done;T++,U=m.next())U=v(p,U.value,y),U!==null&&(d=o(U,d,T),I===null?R=U:I.sibling=U,I=U);return _e&&zn(p,T),R}for(N=i(p,N);!U.done;T++,U=m.next())U=b(N,p,T,U.value,y),U!==null&&(e&&U.alternate!==null&&N.delete(U.key===null?T:U.key),d=o(U,d,T),I===null?R=U:I.sibling=U,I=U);return e&&N.forEach(function(q){return t(p,q)}),_e&&zn(p,T),R}function E(p,d,m,y){if(typeof m=="object"&&m!==null&&m.type===Qn&&m.key===null&&(m=m.props.children),typeof m=="object"&&m!==null){switch(m.$$typeof){case br:e:{for(var R=m.key,I=d;I!==null;){if(I.key===R){if(R=m.type,R===Qn){if(I.tag===7){n(p,I.sibling),d=r(I,m.props.children),d.return=p,p=d;break e}}else if(I.elementType===R||typeof R=="object"&&R!==null&&R.$$typeof===nn&&oc(R)===I.type){n(p,I.sibling),d=r(I,m.props),d.ref=Li(p,I,m),d.return=p,p=d;break e}n(p,I);break}else t(p,I);I=I.sibling}m.type===Qn?(d=Tn(m.props.children,p.mode,y,m.key),d.return=p,p=d):(y=ia(m.type,m.key,m.props,null,p.mode,y),y.ref=Li(p,d,m),y.return=p,p=y)}return s(p);case Yn:e:{for(I=m.key;d!==null;){if(d.key===I)if(d.tag===4&&d.stateNode.containerInfo===m.containerInfo&&d.stateNode.implementation===m.implementation){n(p,d.sibling),d=r(d,m.children||[]),d.return=p,p=d;break e}else{n(p,d);break}else t(p,d);d=d.sibling}d=wo(m,p.mode,y),d.return=p,p=d}return s(p);case nn:return I=m._init,E(p,d,I(m._payload),y)}if(Pi(m))return w(p,d,m,y);if(zi(m))return j(p,d,m,y);Tr(p,m)}return typeof m=="string"&&m!==""||typeof m=="number"?(m=""+m,d!==null&&d.tag===6?(n(p,d.sibling),d=r(d,m),d.return=p,p=d):(n(p,d),d=_o(m,p.mode,y),d.return=p,p=d),s(p)):n(p,d)}return E}var pi=_d(!0),wd=_d(!1),xa=yn(null),va=null,ti=null,Us=null;function Vs(){Us=ti=va=null}function Ys(e){var t=xa.current;xe(xa),e._currentValue=t}function es(e,t,n){for(;e!==null;){var i=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,i!==null&&(i.childLanes|=t)):i!==null&&(i.childLanes&t)!==t&&(i.childLanes|=t),e===n)break;e=e.return}}function li(e,t){va=e,Us=ti=null,e=e.dependencies,e!==null&&e.firstContext!==null&&(e.lanes&t&&(tt=!0),e.firstContext=null)}function yt(e){var t=e._currentValue;if(Us!==e)if(e={context:e,memoizedValue:t,next:null},ti===null){if(va===null)throw Error(P(308));ti=e,va.dependencies={lanes:0,firstContext:e}}else ti=ti.next=e;return t}var En=null;function Qs(e){En===null?En=[e]:En.push(e)}function yd(e,t,n,i){var r=t.interleaved;return r===null?(n.next=n,Qs(t)):(n.next=r.next,r.next=n),t.interleaved=n,Zt(e,i)}function Zt(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var rn=!1;function Zs(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function bd(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function Vt(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function hn(e,t,n){var i=e.updateQueue;if(i===null)return null;if(i=i.shared,ae&2){var r=i.pending;return r===null?t.next=t:(t.next=r.next,r.next=t),i.pending=t,Zt(e,n)}return r=i.interleaved,r===null?(t.next=t,Qs(i)):(t.next=r.next,r.next=t),i.interleaved=t,Zt(e,n)}function Gr(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var i=t.lanes;i&=e.pendingLanes,n|=i,t.lanes=n,Ts(e,n)}}function sc(e,t){var n=e.updateQueue,i=e.alternate;if(i!==null&&(i=i.updateQueue,n===i)){var r=null,o=null;if(n=n.firstBaseUpdate,n!==null){do{var s={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};o===null?r=o=s:o=o.next=s,n=n.next}while(n!==null);o===null?r=o=t:o=o.next=t}else r=o=t;n={baseState:i.baseState,firstBaseUpdate:r,lastBaseUpdate:o,shared:i.shared,effects:i.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function _a(e,t,n,i){var r=e.updateQueue;rn=!1;var o=r.firstBaseUpdate,s=r.lastBaseUpdate,c=r.shared.pending;if(c!==null){r.shared.pending=null;var l=c,f=l.next;l.next=null,s===null?o=f:s.next=f,s=l;var x=e.alternate;x!==null&&(x=x.updateQueue,c=x.lastBaseUpdate,c!==s&&(c===null?x.firstBaseUpdate=f:c.next=f,x.lastBaseUpdate=l))}if(o!==null){var v=r.baseState;s=0,x=f=l=null,c=o;do{var g=c.lane,b=c.eventTime;if((i&g)===g){x!==null&&(x=x.next={eventTime:b,lane:0,tag:c.tag,payload:c.payload,callback:c.callback,next:null});e:{var w=e,j=c;switch(g=t,b=n,j.tag){case 1:if(w=j.payload,typeof w=="function"){v=w.call(b,v,g);break e}v=w;break e;case 3:w.flags=w.flags&-65537|128;case 0:if(w=j.payload,g=typeof w=="function"?w.call(b,v,g):w,g==null)break e;v=ze({},v,g);break e;case 2:rn=!0}}c.callback!==null&&c.lane!==0&&(e.flags|=64,g=r.effects,g===null?r.effects=[c]:g.push(c))}else b={eventTime:b,lane:g,tag:c.tag,payload:c.payload,callback:c.callback,next:null},x===null?(f=x=b,l=v):x=x.next=b,s|=g;if(c=c.next,c===null){if(c=r.shared.pending,c===null)break;g=c,c=g.next,g.next=null,r.lastBaseUpdate=g,r.shared.pending=null}}while(!0);if(x===null&&(l=v),r.baseState=l,r.firstBaseUpdate=f,r.lastBaseUpdate=x,t=r.shared.interleaved,t!==null){r=t;do s|=r.lane,r=r.next;while(r!==t)}else o===null&&(r.shared.lanes=0);An|=s,e.lanes=s,e.memoizedState=v}}function lc(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var i=e[t],r=i.callback;if(r!==null){if(i.callback=null,i=n,typeof r!="function")throw Error(P(191,r));r.call(i)}}}var wr={},At=yn(wr),cr=yn(wr),ur=yn(wr);function Ln(e){if(e===wr)throw Error(P(174));return e}function qs(e,t){switch(ge(ur,t),ge(cr,e),ge(At,wr),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:Io(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=Io(t,e)}xe(At),ge(At,t)}function hi(){xe(At),xe(cr),xe(ur)}function kd(e){Ln(ur.current);var t=Ln(At.current),n=Io(t,e.type);t!==n&&(ge(cr,e),ge(At,n))}function Ks(e){cr.current===e&&(xe(At),xe(cr))}var ke=yn(0);function wa(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var po=[];function Gs(){for(var e=0;e<po.length;e++)po[e]._workInProgressVersionPrimary=null;po.length=0}var Xr=Kt.ReactCurrentDispatcher,ho=Kt.ReactCurrentBatchConfig,Pn=0,je=null,Te=null,Pe=null,ya=!1,Vi=!1,dr=0,R0=0;function He(){throw Error(P(321))}function Xs(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Lt(e[n],t[n]))return!1;return!0}function Js(e,t,n,i,r,o){if(Pn=o,je=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,Xr.current=e===null||e.memoizedState===null?D0:O0,e=n(i,r),Vi){o=0;do{if(Vi=!1,dr=0,25<=o)throw Error(P(301));o+=1,Pe=Te=null,t.updateQueue=null,Xr.current=B0,e=n(i,r)}while(Vi)}if(Xr.current=ba,t=Te!==null&&Te.next!==null,Pn=0,Pe=Te=je=null,ya=!1,t)throw Error(P(300));return e}function el(){var e=dr!==0;return dr=0,e}function It(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Pe===null?je.memoizedState=Pe=e:Pe=Pe.next=e,Pe}function bt(){if(Te===null){var e=je.alternate;e=e!==null?e.memoizedState:null}else e=Te.next;var t=Pe===null?je.memoizedState:Pe.next;if(t!==null)Pe=t,Te=e;else{if(e===null)throw Error(P(310));Te=e,e={memoizedState:Te.memoizedState,baseState:Te.baseState,baseQueue:Te.baseQueue,queue:Te.queue,next:null},Pe===null?je.memoizedState=Pe=e:Pe=Pe.next=e}return Pe}function fr(e,t){return typeof t=="function"?t(e):t}function go(e){var t=bt(),n=t.queue;if(n===null)throw Error(P(311));n.lastRenderedReducer=e;var i=Te,r=i.baseQueue,o=n.pending;if(o!==null){if(r!==null){var s=r.next;r.next=o.next,o.next=s}i.baseQueue=r=o,n.pending=null}if(r!==null){o=r.next,i=i.baseState;var c=s=null,l=null,f=o;do{var x=f.lane;if((Pn&x)===x)l!==null&&(l=l.next={lane:0,action:f.action,hasEagerState:f.hasEagerState,eagerState:f.eagerState,next:null}),i=f.hasEagerState?f.eagerState:e(i,f.action);else{var v={lane:x,action:f.action,hasEagerState:f.hasEagerState,eagerState:f.eagerState,next:null};l===null?(c=l=v,s=i):l=l.next=v,je.lanes|=x,An|=x}f=f.next}while(f!==null&&f!==o);l===null?s=i:l.next=c,Lt(i,t.memoizedState)||(tt=!0),t.memoizedState=i,t.baseState=s,t.baseQueue=l,n.lastRenderedState=i}if(e=n.interleaved,e!==null){r=e;do o=r.lane,je.lanes|=o,An|=o,r=r.next;while(r!==e)}else r===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function mo(e){var t=bt(),n=t.queue;if(n===null)throw Error(P(311));n.lastRenderedReducer=e;var i=n.dispatch,r=n.pending,o=t.memoizedState;if(r!==null){n.pending=null;var s=r=r.next;do o=e(o,s.action),s=s.next;while(s!==r);Lt(o,t.memoizedState)||(tt=!0),t.memoizedState=o,t.baseQueue===null&&(t.baseState=o),n.lastRenderedState=o}return[o,i]}function jd(){}function zd(e,t){var n=je,i=bt(),r=t(),o=!Lt(i.memoizedState,r);if(o&&(i.memoizedState=r,tt=!0),i=i.queue,tl(Cd.bind(null,n,i,e),[e]),i.getSnapshot!==t||o||Pe!==null&&Pe.memoizedState.tag&1){if(n.flags|=2048,pr(9,Sd.bind(null,n,i,r,t),void 0,null),Ae===null)throw Error(P(349));Pn&30||Nd(n,t,r)}return r}function Nd(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=je.updateQueue,t===null?(t={lastEffect:null,stores:null},je.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Sd(e,t,n,i){t.value=n,t.getSnapshot=i,Ed(t)&&Ld(e)}function Cd(e,t,n){return n(function(){Ed(t)&&Ld(e)})}function Ed(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Lt(e,n)}catch{return!0}}function Ld(e){var t=Zt(e,1);t!==null&&Et(t,e,1,-1)}function cc(e){var t=It();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:fr,lastRenderedState:e},t.queue=e,e=e.dispatch=F0.bind(null,je,e),[t.memoizedState,e]}function pr(e,t,n,i){return e={tag:e,create:t,destroy:n,deps:i,next:null},t=je.updateQueue,t===null?(t={lastEffect:null,stores:null},je.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(i=n.next,n.next=e,e.next=i,t.lastEffect=e)),e}function Md(){return bt().memoizedState}function Jr(e,t,n,i){var r=It();je.flags|=e,r.memoizedState=pr(1|t,n,void 0,i===void 0?null:i)}function Pa(e,t,n,i){var r=bt();i=i===void 0?null:i;var o=void 0;if(Te!==null){var s=Te.memoizedState;if(o=s.destroy,i!==null&&Xs(i,s.deps)){r.memoizedState=pr(t,n,o,i);return}}je.flags|=e,r.memoizedState=pr(1|t,n,o,i)}function uc(e,t){return Jr(8390656,8,e,t)}function tl(e,t){return Pa(2048,8,e,t)}function $d(e,t){return Pa(4,2,e,t)}function Td(e,t){return Pa(4,4,e,t)}function Id(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Rd(e,t,n){return n=n!=null?n.concat([e]):null,Pa(4,4,Id.bind(null,t,e),n)}function nl(){}function Pd(e,t){var n=bt();t=t===void 0?null:t;var i=n.memoizedState;return i!==null&&t!==null&&Xs(t,i[1])?i[0]:(n.memoizedState=[e,t],e)}function Ad(e,t){var n=bt();t=t===void 0?null:t;var i=n.memoizedState;return i!==null&&t!==null&&Xs(t,i[1])?i[0]:(e=e(),n.memoizedState=[e,t],e)}function Fd(e,t,n){return Pn&21?(Lt(n,t)||(n=Wu(),je.lanes|=n,An|=n,e.baseState=!0),t):(e.baseState&&(e.baseState=!1,tt=!0),e.memoizedState=n)}function P0(e,t){var n=de;de=n!==0&&4>n?n:4,e(!0);var i=ho.transition;ho.transition={};try{e(!1),t()}finally{de=n,ho.transition=i}}function Dd(){return bt().memoizedState}function A0(e,t,n){var i=mn(e);if(n={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null},Od(e))Bd(t,n);else if(n=yd(e,t,n,i),n!==null){var r=Ke();Et(n,e,i,r),Hd(n,t,i)}}function F0(e,t,n){var i=mn(e),r={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null};if(Od(e))Bd(t,r);else{var o=e.alternate;if(e.lanes===0&&(o===null||o.lanes===0)&&(o=t.lastRenderedReducer,o!==null))try{var s=t.lastRenderedState,c=o(s,n);if(r.hasEagerState=!0,r.eagerState=c,Lt(c,s)){var l=t.interleaved;l===null?(r.next=r,Qs(t)):(r.next=l.next,l.next=r),t.interleaved=r;return}}catch{}finally{}n=yd(e,t,r,i),n!==null&&(r=Ke(),Et(n,e,i,r),Hd(n,t,i))}}function Od(e){var t=e.alternate;return e===je||t!==null&&t===je}function Bd(e,t){Vi=ya=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Hd(e,t,n){if(n&4194240){var i=t.lanes;i&=e.pendingLanes,n|=i,t.lanes=n,Ts(e,n)}}var ba={readContext:yt,useCallback:He,useContext:He,useEffect:He,useImperativeHandle:He,useInsertionEffect:He,useLayoutEffect:He,useMemo:He,useReducer:He,useRef:He,useState:He,useDebugValue:He,useDeferredValue:He,useTransition:He,useMutableSource:He,useSyncExternalStore:He,useId:He,unstable_isNewReconciler:!1},D0={readContext:yt,useCallback:function(e,t){return It().memoizedState=[e,t===void 0?null:t],e},useContext:yt,useEffect:uc,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,Jr(4194308,4,Id.bind(null,t,e),n)},useLayoutEffect:function(e,t){return Jr(4194308,4,e,t)},useInsertionEffect:function(e,t){return Jr(4,2,e,t)},useMemo:function(e,t){var n=It();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var i=It();return t=n!==void 0?n(t):t,i.memoizedState=i.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},i.queue=e,e=e.dispatch=A0.bind(null,je,e),[i.memoizedState,e]},useRef:function(e){var t=It();return e={current:e},t.memoizedState=e},useState:cc,useDebugValue:nl,useDeferredValue:function(e){return It().memoizedState=e},useTransition:function(){var e=cc(!1),t=e[0];return e=P0.bind(null,e[1]),It().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var i=je,r=It();if(_e){if(n===void 0)throw Error(P(407));n=n()}else{if(n=t(),Ae===null)throw Error(P(349));Pn&30||Nd(i,t,n)}r.memoizedState=n;var o={value:n,getSnapshot:t};return r.queue=o,uc(Cd.bind(null,i,o,e),[e]),i.flags|=2048,pr(9,Sd.bind(null,i,o,n,t),void 0,null),n},useId:function(){var e=It(),t=Ae.identifierPrefix;if(_e){var n=Ut,i=Wt;n=(i&~(1<<32-Ct(i)-1)).toString(32)+n,t=":"+t+"R"+n,n=dr++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=R0++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},O0={readContext:yt,useCallback:Pd,useContext:yt,useEffect:tl,useImperativeHandle:Rd,useInsertionEffect:$d,useLayoutEffect:Td,useMemo:Ad,useReducer:go,useRef:Md,useState:function(){return go(fr)},useDebugValue:nl,useDeferredValue:function(e){var t=bt();return Fd(t,Te.memoizedState,e)},useTransition:function(){var e=go(fr)[0],t=bt().memoizedState;return[e,t]},useMutableSource:jd,useSyncExternalStore:zd,useId:Dd,unstable_isNewReconciler:!1},B0={readContext:yt,useCallback:Pd,useContext:yt,useEffect:tl,useImperativeHandle:Rd,useInsertionEffect:$d,useLayoutEffect:Td,useMemo:Ad,useReducer:mo,useRef:Md,useState:function(){return mo(fr)},useDebugValue:nl,useDeferredValue:function(e){var t=bt();return Te===null?t.memoizedState=e:Fd(t,Te.memoizedState,e)},useTransition:function(){var e=mo(fr)[0],t=bt().memoizedState;return[e,t]},useMutableSource:jd,useSyncExternalStore:zd,useId:Dd,unstable_isNewReconciler:!1};function zt(e,t){if(e&&e.defaultProps){t=ze({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function ts(e,t,n,i){t=e.memoizedState,n=n(i,t),n=n==null?t:ze({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Aa={isMounted:function(e){return(e=e._reactInternals)?On(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var i=Ke(),r=mn(e),o=Vt(i,r);o.payload=t,n!=null&&(o.callback=n),t=hn(e,o,r),t!==null&&(Et(t,e,r,i),Gr(t,e,r))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var i=Ke(),r=mn(e),o=Vt(i,r);o.tag=1,o.payload=t,n!=null&&(o.callback=n),t=hn(e,o,r),t!==null&&(Et(t,e,r,i),Gr(t,e,r))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=Ke(),i=mn(e),r=Vt(n,i);r.tag=2,t!=null&&(r.callback=t),t=hn(e,r,i),t!==null&&(Et(t,e,i,n),Gr(t,e,i))}};function dc(e,t,n,i,r,o,s){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(i,o,s):t.prototype&&t.prototype.isPureReactComponent?!ar(n,i)||!ar(r,o):!0}function Wd(e,t,n){var i=!1,r=_n,o=t.contextType;return typeof o=="object"&&o!==null?o=yt(o):(r=it(t)?In:Ye.current,i=t.contextTypes,o=(i=i!=null)?di(e,r):_n),t=new t(n,o),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=Aa,e.stateNode=t,t._reactInternals=e,i&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=r,e.__reactInternalMemoizedMaskedChildContext=o),t}function fc(e,t,n,i){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,i),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,i),t.state!==e&&Aa.enqueueReplaceState(t,t.state,null)}function ns(e,t,n,i){var r=e.stateNode;r.props=n,r.state=e.memoizedState,r.refs={},Zs(e);var o=t.contextType;typeof o=="object"&&o!==null?r.context=yt(o):(o=it(t)?In:Ye.current,r.context=di(e,o)),r.state=e.memoizedState,o=t.getDerivedStateFromProps,typeof o=="function"&&(ts(e,t,o,n),r.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(t=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),t!==r.state&&Aa.enqueueReplaceState(r,r.state,null),_a(e,n,r,i),r.state=e.memoizedState),typeof r.componentDidMount=="function"&&(e.flags|=4194308)}function gi(e,t){try{var n="",i=t;do n+=gp(i),i=i.return;while(i);var r=n}catch(o){r=`
Error generating stack: `+o.message+`
`+o.stack}return{value:e,source:t,stack:r,digest:null}}function xo(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function is(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var H0=typeof WeakMap=="function"?WeakMap:Map;function Ud(e,t,n){n=Vt(-1,n),n.tag=3,n.payload={element:null};var i=t.value;return n.callback=function(){ja||(ja=!0,ps=i),is(e,t)},n}function Vd(e,t,n){n=Vt(-1,n),n.tag=3;var i=e.type.getDerivedStateFromError;if(typeof i=="function"){var r=t.value;n.payload=function(){return i(r)},n.callback=function(){is(e,t)}}var o=e.stateNode;return o!==null&&typeof o.componentDidCatch=="function"&&(n.callback=function(){is(e,t),typeof i!="function"&&(gn===null?gn=new Set([this]):gn.add(this));var s=t.stack;this.componentDidCatch(t.value,{componentStack:s!==null?s:""})}),n}function pc(e,t,n){var i=e.pingCache;if(i===null){i=e.pingCache=new H0;var r=new Set;i.set(t,r)}else r=i.get(t),r===void 0&&(r=new Set,i.set(t,r));r.has(n)||(r.add(n),e=nh.bind(null,e,t,n),t.then(e,e))}function hc(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function gc(e,t,n,i,r){return e.mode&1?(e.flags|=65536,e.lanes=r,e):(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=Vt(-1,1),t.tag=2,hn(n,t,1))),n.lanes|=1),e)}var W0=Kt.ReactCurrentOwner,tt=!1;function qe(e,t,n,i){t.child=e===null?wd(t,null,n,i):pi(t,e.child,n,i)}function mc(e,t,n,i,r){n=n.render;var o=t.ref;return li(t,r),i=Js(e,t,n,i,o,r),n=el(),e!==null&&!tt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~r,qt(e,t,r)):(_e&&n&&Bs(t),t.flags|=1,qe(e,t,i,r),t.child)}function xc(e,t,n,i,r){if(e===null){var o=n.type;return typeof o=="function"&&!ul(o)&&o.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=o,Yd(e,t,o,i,r)):(e=ia(n.type,null,i,t,t.mode,r),e.ref=t.ref,e.return=t,t.child=e)}if(o=e.child,!(e.lanes&r)){var s=o.memoizedProps;if(n=n.compare,n=n!==null?n:ar,n(s,i)&&e.ref===t.ref)return qt(e,t,r)}return t.flags|=1,e=xn(o,i),e.ref=t.ref,e.return=t,t.child=e}function Yd(e,t,n,i,r){if(e!==null){var o=e.memoizedProps;if(ar(o,i)&&e.ref===t.ref)if(tt=!1,t.pendingProps=i=o,(e.lanes&r)!==0)e.flags&131072&&(tt=!0);else return t.lanes=e.lanes,qt(e,t,r)}return rs(e,t,n,i,r)}function Qd(e,t,n){var i=t.pendingProps,r=i.children,o=e!==null?e.memoizedState:null;if(i.mode==="hidden")if(!(t.mode&1))t.memoizedState={baseLanes:0,cachePool:null,transitions:null},ge(ii,lt),lt|=n;else{if(!(n&1073741824))return e=o!==null?o.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,ge(ii,lt),lt|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},i=o!==null?o.baseLanes:n,ge(ii,lt),lt|=i}else o!==null?(i=o.baseLanes|n,t.memoizedState=null):i=n,ge(ii,lt),lt|=i;return qe(e,t,r,n),t.child}function Zd(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function rs(e,t,n,i,r){var o=it(n)?In:Ye.current;return o=di(t,o),li(t,r),n=Js(e,t,n,i,o,r),i=el(),e!==null&&!tt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~r,qt(e,t,r)):(_e&&i&&Bs(t),t.flags|=1,qe(e,t,n,r),t.child)}function vc(e,t,n,i,r){if(it(n)){var o=!0;ha(t)}else o=!1;if(li(t,r),t.stateNode===null)ea(e,t),Wd(t,n,i),ns(t,n,i,r),i=!0;else if(e===null){var s=t.stateNode,c=t.memoizedProps;s.props=c;var l=s.context,f=n.contextType;typeof f=="object"&&f!==null?f=yt(f):(f=it(n)?In:Ye.current,f=di(t,f));var x=n.getDerivedStateFromProps,v=typeof x=="function"||typeof s.getSnapshotBeforeUpdate=="function";v||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(c!==i||l!==f)&&fc(t,s,i,f),rn=!1;var g=t.memoizedState;s.state=g,_a(t,i,s,r),l=t.memoizedState,c!==i||g!==l||nt.current||rn?(typeof x=="function"&&(ts(t,n,x,i),l=t.memoizedState),(c=rn||dc(t,n,c,i,g,l,f))?(v||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount()),typeof s.componentDidMount=="function"&&(t.flags|=4194308)):(typeof s.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=i,t.memoizedState=l),s.props=i,s.state=l,s.context=f,i=c):(typeof s.componentDidMount=="function"&&(t.flags|=4194308),i=!1)}else{s=t.stateNode,bd(e,t),c=t.memoizedProps,f=t.type===t.elementType?c:zt(t.type,c),s.props=f,v=t.pendingProps,g=s.context,l=n.contextType,typeof l=="object"&&l!==null?l=yt(l):(l=it(n)?In:Ye.current,l=di(t,l));var b=n.getDerivedStateFromProps;(x=typeof b=="function"||typeof s.getSnapshotBeforeUpdate=="function")||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(c!==v||g!==l)&&fc(t,s,i,l),rn=!1,g=t.memoizedState,s.state=g,_a(t,i,s,r);var w=t.memoizedState;c!==v||g!==w||nt.current||rn?(typeof b=="function"&&(ts(t,n,b,i),w=t.memoizedState),(f=rn||dc(t,n,f,i,g,w,l)||!1)?(x||typeof s.UNSAFE_componentWillUpdate!="function"&&typeof s.componentWillUpdate!="function"||(typeof s.componentWillUpdate=="function"&&s.componentWillUpdate(i,w,l),typeof s.UNSAFE_componentWillUpdate=="function"&&s.UNSAFE_componentWillUpdate(i,w,l)),typeof s.componentDidUpdate=="function"&&(t.flags|=4),typeof s.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof s.componentDidUpdate!="function"||c===e.memoizedProps&&g===e.memoizedState||(t.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&g===e.memoizedState||(t.flags|=1024),t.memoizedProps=i,t.memoizedState=w),s.props=i,s.state=w,s.context=l,i=f):(typeof s.componentDidUpdate!="function"||c===e.memoizedProps&&g===e.memoizedState||(t.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&g===e.memoizedState||(t.flags|=1024),i=!1)}return as(e,t,n,i,o,r)}function as(e,t,n,i,r,o){Zd(e,t);var s=(t.flags&128)!==0;if(!i&&!s)return r&&ic(t,n,!1),qt(e,t,o);i=t.stateNode,W0.current=t;var c=s&&typeof n.getDerivedStateFromError!="function"?null:i.render();return t.flags|=1,e!==null&&s?(t.child=pi(t,e.child,null,o),t.child=pi(t,null,c,o)):qe(e,t,c,o),t.memoizedState=i.state,r&&ic(t,n,!0),t.child}function qd(e){var t=e.stateNode;t.pendingContext?nc(e,t.pendingContext,t.pendingContext!==t.context):t.context&&nc(e,t.context,!1),qs(e,t.containerInfo)}function _c(e,t,n,i,r){return fi(),Ws(r),t.flags|=256,qe(e,t,n,i),t.child}var os={dehydrated:null,treeContext:null,retryLane:0};function ss(e){return{baseLanes:e,cachePool:null,transitions:null}}function Kd(e,t,n){var i=t.pendingProps,r=ke.current,o=!1,s=(t.flags&128)!==0,c;if((c=s)||(c=e!==null&&e.memoizedState===null?!1:(r&2)!==0),c?(o=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(r|=1),ge(ke,r&1),e===null)return Jo(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?(t.mode&1?e.data==="$!"?t.lanes=8:t.lanes=1073741824:t.lanes=1,null):(s=i.children,e=i.fallback,o?(i=t.mode,o=t.child,s={mode:"hidden",children:s},!(i&1)&&o!==null?(o.childLanes=0,o.pendingProps=s):o=Oa(s,i,0,null),e=Tn(e,i,n,null),o.return=t,e.return=t,o.sibling=e,t.child=o,t.child.memoizedState=ss(n),t.memoizedState=os,e):il(t,s));if(r=e.memoizedState,r!==null&&(c=r.dehydrated,c!==null))return U0(e,t,s,i,c,r,n);if(o){o=i.fallback,s=t.mode,r=e.child,c=r.sibling;var l={mode:"hidden",children:i.children};return!(s&1)&&t.child!==r?(i=t.child,i.childLanes=0,i.pendingProps=l,t.deletions=null):(i=xn(r,l),i.subtreeFlags=r.subtreeFlags&14680064),c!==null?o=xn(c,o):(o=Tn(o,s,n,null),o.flags|=2),o.return=t,i.return=t,i.sibling=o,t.child=i,i=o,o=t.child,s=e.child.memoizedState,s=s===null?ss(n):{baseLanes:s.baseLanes|n,cachePool:null,transitions:s.transitions},o.memoizedState=s,o.childLanes=e.childLanes&~n,t.memoizedState=os,i}return o=e.child,e=o.sibling,i=xn(o,{mode:"visible",children:i.children}),!(t.mode&1)&&(i.lanes=n),i.return=t,i.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=i,t.memoizedState=null,i}function il(e,t){return t=Oa({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function Ir(e,t,n,i){return i!==null&&Ws(i),pi(t,e.child,null,n),e=il(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function U0(e,t,n,i,r,o,s){if(n)return t.flags&256?(t.flags&=-257,i=xo(Error(P(422))),Ir(e,t,s,i)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(o=i.fallback,r=t.mode,i=Oa({mode:"visible",children:i.children},r,0,null),o=Tn(o,r,s,null),o.flags|=2,i.return=t,o.return=t,i.sibling=o,t.child=i,t.mode&1&&pi(t,e.child,null,s),t.child.memoizedState=ss(s),t.memoizedState=os,o);if(!(t.mode&1))return Ir(e,t,s,null);if(r.data==="$!"){if(i=r.nextSibling&&r.nextSibling.dataset,i)var c=i.dgst;return i=c,o=Error(P(419)),i=xo(o,i,void 0),Ir(e,t,s,i)}if(c=(s&e.childLanes)!==0,tt||c){if(i=Ae,i!==null){switch(s&-s){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=r&(i.suspendedLanes|s)?0:r,r!==0&&r!==o.retryLane&&(o.retryLane=r,Zt(e,r),Et(i,e,r,-1))}return cl(),i=xo(Error(P(421))),Ir(e,t,s,i)}return r.data==="$?"?(t.flags|=128,t.child=e.child,t=ih.bind(null,e),r._reactRetry=t,null):(e=o.treeContext,ct=pn(r.nextSibling),ut=t,_e=!0,St=null,e!==null&&(mt[xt++]=Wt,mt[xt++]=Ut,mt[xt++]=Rn,Wt=e.id,Ut=e.overflow,Rn=t),t=il(t,i.children),t.flags|=4096,t)}function wc(e,t,n){e.lanes|=t;var i=e.alternate;i!==null&&(i.lanes|=t),es(e.return,t,n)}function vo(e,t,n,i,r){var o=e.memoizedState;o===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:i,tail:n,tailMode:r}:(o.isBackwards=t,o.rendering=null,o.renderingStartTime=0,o.last=i,o.tail=n,o.tailMode=r)}function Gd(e,t,n){var i=t.pendingProps,r=i.revealOrder,o=i.tail;if(qe(e,t,i.children,n),i=ke.current,i&2)i=i&1|2,t.flags|=128;else{if(e!==null&&e.flags&128)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&wc(e,n,t);else if(e.tag===19)wc(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}i&=1}if(ge(ke,i),!(t.mode&1))t.memoizedState=null;else switch(r){case"forwards":for(n=t.child,r=null;n!==null;)e=n.alternate,e!==null&&wa(e)===null&&(r=n),n=n.sibling;n=r,n===null?(r=t.child,t.child=null):(r=n.sibling,n.sibling=null),vo(t,!1,r,n,o);break;case"backwards":for(n=null,r=t.child,t.child=null;r!==null;){if(e=r.alternate,e!==null&&wa(e)===null){t.child=r;break}e=r.sibling,r.sibling=n,n=r,r=e}vo(t,!0,n,null,o);break;case"together":vo(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function ea(e,t){!(t.mode&1)&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function qt(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),An|=t.lanes,!(n&t.childLanes))return null;if(e!==null&&t.child!==e.child)throw Error(P(153));if(t.child!==null){for(e=t.child,n=xn(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=xn(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function V0(e,t,n){switch(t.tag){case 3:qd(t),fi();break;case 5:kd(t);break;case 1:it(t.type)&&ha(t);break;case 4:qs(t,t.stateNode.containerInfo);break;case 10:var i=t.type._context,r=t.memoizedProps.value;ge(xa,i._currentValue),i._currentValue=r;break;case 13:if(i=t.memoizedState,i!==null)return i.dehydrated!==null?(ge(ke,ke.current&1),t.flags|=128,null):n&t.child.childLanes?Kd(e,t,n):(ge(ke,ke.current&1),e=qt(e,t,n),e!==null?e.sibling:null);ge(ke,ke.current&1);break;case 19:if(i=(n&t.childLanes)!==0,e.flags&128){if(i)return Gd(e,t,n);t.flags|=128}if(r=t.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),ge(ke,ke.current),i)break;return null;case 22:case 23:return t.lanes=0,Qd(e,t,n)}return qt(e,t,n)}var Xd,ls,Jd,ef;Xd=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};ls=function(){};Jd=function(e,t,n,i){var r=e.memoizedProps;if(r!==i){e=t.stateNode,Ln(At.current);var o=null;switch(n){case"input":r=Lo(e,r),i=Lo(e,i),o=[];break;case"select":r=ze({},r,{value:void 0}),i=ze({},i,{value:void 0}),o=[];break;case"textarea":r=To(e,r),i=To(e,i),o=[];break;default:typeof r.onClick!="function"&&typeof i.onClick=="function"&&(e.onclick=fa)}Ro(n,i);var s;n=null;for(f in r)if(!i.hasOwnProperty(f)&&r.hasOwnProperty(f)&&r[f]!=null)if(f==="style"){var c=r[f];for(s in c)c.hasOwnProperty(s)&&(n||(n={}),n[s]="")}else f!=="dangerouslySetInnerHTML"&&f!=="children"&&f!=="suppressContentEditableWarning"&&f!=="suppressHydrationWarning"&&f!=="autoFocus"&&(Xi.hasOwnProperty(f)?o||(o=[]):(o=o||[]).push(f,null));for(f in i){var l=i[f];if(c=r!=null?r[f]:void 0,i.hasOwnProperty(f)&&l!==c&&(l!=null||c!=null))if(f==="style")if(c){for(s in c)!c.hasOwnProperty(s)||l&&l.hasOwnProperty(s)||(n||(n={}),n[s]="");for(s in l)l.hasOwnProperty(s)&&c[s]!==l[s]&&(n||(n={}),n[s]=l[s])}else n||(o||(o=[]),o.push(f,n)),n=l;else f==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,c=c?c.__html:void 0,l!=null&&c!==l&&(o=o||[]).push(f,l)):f==="children"?typeof l!="string"&&typeof l!="number"||(o=o||[]).push(f,""+l):f!=="suppressContentEditableWarning"&&f!=="suppressHydrationWarning"&&(Xi.hasOwnProperty(f)?(l!=null&&f==="onScroll"&&me("scroll",e),o||c===l||(o=[])):(o=o||[]).push(f,l))}n&&(o=o||[]).push("style",n);var f=o;(t.updateQueue=f)&&(t.flags|=4)}};ef=function(e,t,n,i){n!==i&&(t.flags|=4)};function Mi(e,t){if(!_e)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var i=null;n!==null;)n.alternate!==null&&(i=n),n=n.sibling;i===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:i.sibling=null}}function We(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,i=0;if(t)for(var r=e.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags&14680064,i|=r.flags&14680064,r.return=e,r=r.sibling;else for(r=e.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags,i|=r.flags,r.return=e,r=r.sibling;return e.subtreeFlags|=i,e.childLanes=n,t}function Y0(e,t,n){var i=t.pendingProps;switch(Hs(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return We(t),null;case 1:return it(t.type)&&pa(),We(t),null;case 3:return i=t.stateNode,hi(),xe(nt),xe(Ye),Gs(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(e===null||e.child===null)&&($r(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,St!==null&&(ms(St),St=null))),ls(e,t),We(t),null;case 5:Ks(t);var r=Ln(ur.current);if(n=t.type,e!==null&&t.stateNode!=null)Jd(e,t,n,i,r),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!i){if(t.stateNode===null)throw Error(P(166));return We(t),null}if(e=Ln(At.current),$r(t)){i=t.stateNode,n=t.type;var o=t.memoizedProps;switch(i[Rt]=t,i[lr]=o,e=(t.mode&1)!==0,n){case"dialog":me("cancel",i),me("close",i);break;case"iframe":case"object":case"embed":me("load",i);break;case"video":case"audio":for(r=0;r<Fi.length;r++)me(Fi[r],i);break;case"source":me("error",i);break;case"img":case"image":case"link":me("error",i),me("load",i);break;case"details":me("toggle",i);break;case"input":El(i,o),me("invalid",i);break;case"select":i._wrapperState={wasMultiple:!!o.multiple},me("invalid",i);break;case"textarea":Ml(i,o),me("invalid",i)}Ro(n,o),r=null;for(var s in o)if(o.hasOwnProperty(s)){var c=o[s];s==="children"?typeof c=="string"?i.textContent!==c&&(o.suppressHydrationWarning!==!0&&Mr(i.textContent,c,e),r=["children",c]):typeof c=="number"&&i.textContent!==""+c&&(o.suppressHydrationWarning!==!0&&Mr(i.textContent,c,e),r=["children",""+c]):Xi.hasOwnProperty(s)&&c!=null&&s==="onScroll"&&me("scroll",i)}switch(n){case"input":kr(i),Ll(i,o,!0);break;case"textarea":kr(i),$l(i);break;case"select":case"option":break;default:typeof o.onClick=="function"&&(i.onclick=fa)}i=r,t.updateQueue=i,i!==null&&(t.flags|=4)}else{s=r.nodeType===9?r:r.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=Cu(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=s.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof i.is=="string"?e=s.createElement(n,{is:i.is}):(e=s.createElement(n),n==="select"&&(s=e,i.multiple?s.multiple=!0:i.size&&(s.size=i.size))):e=s.createElementNS(e,n),e[Rt]=t,e[lr]=i,Xd(e,t,!1,!1),t.stateNode=e;e:{switch(s=Po(n,i),n){case"dialog":me("cancel",e),me("close",e),r=i;break;case"iframe":case"object":case"embed":me("load",e),r=i;break;case"video":case"audio":for(r=0;r<Fi.length;r++)me(Fi[r],e);r=i;break;case"source":me("error",e),r=i;break;case"img":case"image":case"link":me("error",e),me("load",e),r=i;break;case"details":me("toggle",e),r=i;break;case"input":El(e,i),r=Lo(e,i),me("invalid",e);break;case"option":r=i;break;case"select":e._wrapperState={wasMultiple:!!i.multiple},r=ze({},i,{value:void 0}),me("invalid",e);break;case"textarea":Ml(e,i),r=To(e,i),me("invalid",e);break;default:r=i}Ro(n,r),c=r;for(o in c)if(c.hasOwnProperty(o)){var l=c[o];o==="style"?Mu(e,l):o==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&Eu(e,l)):o==="children"?typeof l=="string"?(n!=="textarea"||l!=="")&&Ji(e,l):typeof l=="number"&&Ji(e,""+l):o!=="suppressContentEditableWarning"&&o!=="suppressHydrationWarning"&&o!=="autoFocus"&&(Xi.hasOwnProperty(o)?l!=null&&o==="onScroll"&&me("scroll",e):l!=null&&Ss(e,o,l,s))}switch(n){case"input":kr(e),Ll(e,i,!1);break;case"textarea":kr(e),$l(e);break;case"option":i.value!=null&&e.setAttribute("value",""+vn(i.value));break;case"select":e.multiple=!!i.multiple,o=i.value,o!=null?ri(e,!!i.multiple,o,!1):i.defaultValue!=null&&ri(e,!!i.multiple,i.defaultValue,!0);break;default:typeof r.onClick=="function"&&(e.onclick=fa)}switch(n){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}}i&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return We(t),null;case 6:if(e&&t.stateNode!=null)ef(e,t,e.memoizedProps,i);else{if(typeof i!="string"&&t.stateNode===null)throw Error(P(166));if(n=Ln(ur.current),Ln(At.current),$r(t)){if(i=t.stateNode,n=t.memoizedProps,i[Rt]=t,(o=i.nodeValue!==n)&&(e=ut,e!==null))switch(e.tag){case 3:Mr(i.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&Mr(i.nodeValue,n,(e.mode&1)!==0)}o&&(t.flags|=4)}else i=(n.nodeType===9?n:n.ownerDocument).createTextNode(i),i[Rt]=t,t.stateNode=i}return We(t),null;case 13:if(xe(ke),i=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(_e&&ct!==null&&t.mode&1&&!(t.flags&128))vd(),fi(),t.flags|=98560,o=!1;else if(o=$r(t),i!==null&&i.dehydrated!==null){if(e===null){if(!o)throw Error(P(318));if(o=t.memoizedState,o=o!==null?o.dehydrated:null,!o)throw Error(P(317));o[Rt]=t}else fi(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;We(t),o=!1}else St!==null&&(ms(St),St=null),o=!0;if(!o)return t.flags&65536?t:null}return t.flags&128?(t.lanes=n,t):(i=i!==null,i!==(e!==null&&e.memoizedState!==null)&&i&&(t.child.flags|=8192,t.mode&1&&(e===null||ke.current&1?Ie===0&&(Ie=3):cl())),t.updateQueue!==null&&(t.flags|=4),We(t),null);case 4:return hi(),ls(e,t),e===null&&or(t.stateNode.containerInfo),We(t),null;case 10:return Ys(t.type._context),We(t),null;case 17:return it(t.type)&&pa(),We(t),null;case 19:if(xe(ke),o=t.memoizedState,o===null)return We(t),null;if(i=(t.flags&128)!==0,s=o.rendering,s===null)if(i)Mi(o,!1);else{if(Ie!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(s=wa(e),s!==null){for(t.flags|=128,Mi(o,!1),i=s.updateQueue,i!==null&&(t.updateQueue=i,t.flags|=4),t.subtreeFlags=0,i=n,n=t.child;n!==null;)o=n,e=i,o.flags&=14680066,s=o.alternate,s===null?(o.childLanes=0,o.lanes=e,o.child=null,o.subtreeFlags=0,o.memoizedProps=null,o.memoizedState=null,o.updateQueue=null,o.dependencies=null,o.stateNode=null):(o.childLanes=s.childLanes,o.lanes=s.lanes,o.child=s.child,o.subtreeFlags=0,o.deletions=null,o.memoizedProps=s.memoizedProps,o.memoizedState=s.memoizedState,o.updateQueue=s.updateQueue,o.type=s.type,e=s.dependencies,o.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return ge(ke,ke.current&1|2),t.child}e=e.sibling}o.tail!==null&&Se()>mi&&(t.flags|=128,i=!0,Mi(o,!1),t.lanes=4194304)}else{if(!i)if(e=wa(s),e!==null){if(t.flags|=128,i=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),Mi(o,!0),o.tail===null&&o.tailMode==="hidden"&&!s.alternate&&!_e)return We(t),null}else 2*Se()-o.renderingStartTime>mi&&n!==1073741824&&(t.flags|=128,i=!0,Mi(o,!1),t.lanes=4194304);o.isBackwards?(s.sibling=t.child,t.child=s):(n=o.last,n!==null?n.sibling=s:t.child=s,o.last=s)}return o.tail!==null?(t=o.tail,o.rendering=t,o.tail=t.sibling,o.renderingStartTime=Se(),t.sibling=null,n=ke.current,ge(ke,i?n&1|2:n&1),t):(We(t),null);case 22:case 23:return ll(),i=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==i&&(t.flags|=8192),i&&t.mode&1?lt&1073741824&&(We(t),t.subtreeFlags&6&&(t.flags|=8192)):We(t),null;case 24:return null;case 25:return null}throw Error(P(156,t.tag))}function Q0(e,t){switch(Hs(t),t.tag){case 1:return it(t.type)&&pa(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return hi(),xe(nt),xe(Ye),Gs(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 5:return Ks(t),null;case 13:if(xe(ke),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(P(340));fi()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return xe(ke),null;case 4:return hi(),null;case 10:return Ys(t.type._context),null;case 22:case 23:return ll(),null;case 24:return null;default:return null}}var Rr=!1,Ve=!1,Z0=typeof WeakSet=="function"?WeakSet:Set,V=null;function ni(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(i){Ne(e,t,i)}else n.current=null}function cs(e,t,n){try{n()}catch(i){Ne(e,t,i)}}var yc=!1;function q0(e,t){if(Yo=ca,e=ad(),Os(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var i=n.getSelection&&n.getSelection();if(i&&i.rangeCount!==0){n=i.anchorNode;var r=i.anchorOffset,o=i.focusNode;i=i.focusOffset;try{n.nodeType,o.nodeType}catch{n=null;break e}var s=0,c=-1,l=-1,f=0,x=0,v=e,g=null;t:for(;;){for(var b;v!==n||r!==0&&v.nodeType!==3||(c=s+r),v!==o||i!==0&&v.nodeType!==3||(l=s+i),v.nodeType===3&&(s+=v.nodeValue.length),(b=v.firstChild)!==null;)g=v,v=b;for(;;){if(v===e)break t;if(g===n&&++f===r&&(c=s),g===o&&++x===i&&(l=s),(b=v.nextSibling)!==null)break;v=g,g=v.parentNode}v=b}n=c===-1||l===-1?null:{start:c,end:l}}else n=null}n=n||{start:0,end:0}}else n=null;for(Qo={focusedElem:e,selectionRange:n},ca=!1,V=t;V!==null;)if(t=V,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,V=e;else for(;V!==null;){t=V;try{var w=t.alternate;if(t.flags&1024)switch(t.tag){case 0:case 11:case 15:break;case 1:if(w!==null){var j=w.memoizedProps,E=w.memoizedState,p=t.stateNode,d=p.getSnapshotBeforeUpdate(t.elementType===t.type?j:zt(t.type,j),E);p.__reactInternalSnapshotBeforeUpdate=d}break;case 3:var m=t.stateNode.containerInfo;m.nodeType===1?m.textContent="":m.nodeType===9&&m.documentElement&&m.removeChild(m.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(P(163))}}catch(y){Ne(t,t.return,y)}if(e=t.sibling,e!==null){e.return=t.return,V=e;break}V=t.return}return w=yc,yc=!1,w}function Yi(e,t,n){var i=t.updateQueue;if(i=i!==null?i.lastEffect:null,i!==null){var r=i=i.next;do{if((r.tag&e)===e){var o=r.destroy;r.destroy=void 0,o!==void 0&&cs(t,n,o)}r=r.next}while(r!==i)}}function Fa(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var i=n.create;n.destroy=i()}n=n.next}while(n!==t)}}function us(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function tf(e){var t=e.alternate;t!==null&&(e.alternate=null,tf(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[Rt],delete t[lr],delete t[Ko],delete t[M0],delete t[$0])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function nf(e){return e.tag===5||e.tag===3||e.tag===4}function bc(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||nf(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function ds(e,t,n){var i=e.tag;if(i===5||i===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=fa));else if(i!==4&&(e=e.child,e!==null))for(ds(e,t,n),e=e.sibling;e!==null;)ds(e,t,n),e=e.sibling}function fs(e,t,n){var i=e.tag;if(i===5||i===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(i!==4&&(e=e.child,e!==null))for(fs(e,t,n),e=e.sibling;e!==null;)fs(e,t,n),e=e.sibling}var De=null,Nt=!1;function en(e,t,n){for(n=n.child;n!==null;)rf(e,t,n),n=n.sibling}function rf(e,t,n){if(Pt&&typeof Pt.onCommitFiberUnmount=="function")try{Pt.onCommitFiberUnmount(La,n)}catch{}switch(n.tag){case 5:Ve||ni(n,t);case 6:var i=De,r=Nt;De=null,en(e,t,n),De=i,Nt=r,De!==null&&(Nt?(e=De,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):De.removeChild(n.stateNode));break;case 18:De!==null&&(Nt?(e=De,n=n.stateNode,e.nodeType===8?uo(e.parentNode,n):e.nodeType===1&&uo(e,n),ir(e)):uo(De,n.stateNode));break;case 4:i=De,r=Nt,De=n.stateNode.containerInfo,Nt=!0,en(e,t,n),De=i,Nt=r;break;case 0:case 11:case 14:case 15:if(!Ve&&(i=n.updateQueue,i!==null&&(i=i.lastEffect,i!==null))){r=i=i.next;do{var o=r,s=o.destroy;o=o.tag,s!==void 0&&(o&2||o&4)&&cs(n,t,s),r=r.next}while(r!==i)}en(e,t,n);break;case 1:if(!Ve&&(ni(n,t),i=n.stateNode,typeof i.componentWillUnmount=="function"))try{i.props=n.memoizedProps,i.state=n.memoizedState,i.componentWillUnmount()}catch(c){Ne(n,t,c)}en(e,t,n);break;case 21:en(e,t,n);break;case 22:n.mode&1?(Ve=(i=Ve)||n.memoizedState!==null,en(e,t,n),Ve=i):en(e,t,n);break;default:en(e,t,n)}}function kc(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new Z0),t.forEach(function(i){var r=rh.bind(null,e,i);n.has(i)||(n.add(i),i.then(r,r))})}}function jt(e,t){var n=t.deletions;if(n!==null)for(var i=0;i<n.length;i++){var r=n[i];try{var o=e,s=t,c=s;e:for(;c!==null;){switch(c.tag){case 5:De=c.stateNode,Nt=!1;break e;case 3:De=c.stateNode.containerInfo,Nt=!0;break e;case 4:De=c.stateNode.containerInfo,Nt=!0;break e}c=c.return}if(De===null)throw Error(P(160));rf(o,s,r),De=null,Nt=!1;var l=r.alternate;l!==null&&(l.return=null),r.return=null}catch(f){Ne(r,t,f)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)af(t,e),t=t.sibling}function af(e,t){var n=e.alternate,i=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(jt(t,e),Tt(e),i&4){try{Yi(3,e,e.return),Fa(3,e)}catch(j){Ne(e,e.return,j)}try{Yi(5,e,e.return)}catch(j){Ne(e,e.return,j)}}break;case 1:jt(t,e),Tt(e),i&512&&n!==null&&ni(n,n.return);break;case 5:if(jt(t,e),Tt(e),i&512&&n!==null&&ni(n,n.return),e.flags&32){var r=e.stateNode;try{Ji(r,"")}catch(j){Ne(e,e.return,j)}}if(i&4&&(r=e.stateNode,r!=null)){var o=e.memoizedProps,s=n!==null?n.memoizedProps:o,c=e.type,l=e.updateQueue;if(e.updateQueue=null,l!==null)try{c==="input"&&o.type==="radio"&&o.name!=null&&Nu(r,o),Po(c,s);var f=Po(c,o);for(s=0;s<l.length;s+=2){var x=l[s],v=l[s+1];x==="style"?Mu(r,v):x==="dangerouslySetInnerHTML"?Eu(r,v):x==="children"?Ji(r,v):Ss(r,x,v,f)}switch(c){case"input":Mo(r,o);break;case"textarea":Su(r,o);break;case"select":var g=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!o.multiple;var b=o.value;b!=null?ri(r,!!o.multiple,b,!1):g!==!!o.multiple&&(o.defaultValue!=null?ri(r,!!o.multiple,o.defaultValue,!0):ri(r,!!o.multiple,o.multiple?[]:"",!1))}r[lr]=o}catch(j){Ne(e,e.return,j)}}break;case 6:if(jt(t,e),Tt(e),i&4){if(e.stateNode===null)throw Error(P(162));r=e.stateNode,o=e.memoizedProps;try{r.nodeValue=o}catch(j){Ne(e,e.return,j)}}break;case 3:if(jt(t,e),Tt(e),i&4&&n!==null&&n.memoizedState.isDehydrated)try{ir(t.containerInfo)}catch(j){Ne(e,e.return,j)}break;case 4:jt(t,e),Tt(e);break;case 13:jt(t,e),Tt(e),r=e.child,r.flags&8192&&(o=r.memoizedState!==null,r.stateNode.isHidden=o,!o||r.alternate!==null&&r.alternate.memoizedState!==null||(ol=Se())),i&4&&kc(e);break;case 22:if(x=n!==null&&n.memoizedState!==null,e.mode&1?(Ve=(f=Ve)||x,jt(t,e),Ve=f):jt(t,e),Tt(e),i&8192){if(f=e.memoizedState!==null,(e.stateNode.isHidden=f)&&!x&&e.mode&1)for(V=e,x=e.child;x!==null;){for(v=V=x;V!==null;){switch(g=V,b=g.child,g.tag){case 0:case 11:case 14:case 15:Yi(4,g,g.return);break;case 1:ni(g,g.return);var w=g.stateNode;if(typeof w.componentWillUnmount=="function"){i=g,n=g.return;try{t=i,w.props=t.memoizedProps,w.state=t.memoizedState,w.componentWillUnmount()}catch(j){Ne(i,n,j)}}break;case 5:ni(g,g.return);break;case 22:if(g.memoizedState!==null){zc(v);continue}}b!==null?(b.return=g,V=b):zc(v)}x=x.sibling}e:for(x=null,v=e;;){if(v.tag===5){if(x===null){x=v;try{r=v.stateNode,f?(o=r.style,typeof o.setProperty=="function"?o.setProperty("display","none","important"):o.display="none"):(c=v.stateNode,l=v.memoizedProps.style,s=l!=null&&l.hasOwnProperty("display")?l.display:null,c.style.display=Lu("display",s))}catch(j){Ne(e,e.return,j)}}}else if(v.tag===6){if(x===null)try{v.stateNode.nodeValue=f?"":v.memoizedProps}catch(j){Ne(e,e.return,j)}}else if((v.tag!==22&&v.tag!==23||v.memoizedState===null||v===e)&&v.child!==null){v.child.return=v,v=v.child;continue}if(v===e)break e;for(;v.sibling===null;){if(v.return===null||v.return===e)break e;x===v&&(x=null),v=v.return}x===v&&(x=null),v.sibling.return=v.return,v=v.sibling}}break;case 19:jt(t,e),Tt(e),i&4&&kc(e);break;case 21:break;default:jt(t,e),Tt(e)}}function Tt(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(nf(n)){var i=n;break e}n=n.return}throw Error(P(160))}switch(i.tag){case 5:var r=i.stateNode;i.flags&32&&(Ji(r,""),i.flags&=-33);var o=bc(e);fs(e,o,r);break;case 3:case 4:var s=i.stateNode.containerInfo,c=bc(e);ds(e,c,s);break;default:throw Error(P(161))}}catch(l){Ne(e,e.return,l)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function K0(e,t,n){V=e,of(e)}function of(e,t,n){for(var i=(e.mode&1)!==0;V!==null;){var r=V,o=r.child;if(r.tag===22&&i){var s=r.memoizedState!==null||Rr;if(!s){var c=r.alternate,l=c!==null&&c.memoizedState!==null||Ve;c=Rr;var f=Ve;if(Rr=s,(Ve=l)&&!f)for(V=r;V!==null;)s=V,l=s.child,s.tag===22&&s.memoizedState!==null?Nc(r):l!==null?(l.return=s,V=l):Nc(r);for(;o!==null;)V=o,of(o),o=o.sibling;V=r,Rr=c,Ve=f}jc(e)}else r.subtreeFlags&8772&&o!==null?(o.return=r,V=o):jc(e)}}function jc(e){for(;V!==null;){var t=V;if(t.flags&8772){var n=t.alternate;try{if(t.flags&8772)switch(t.tag){case 0:case 11:case 15:Ve||Fa(5,t);break;case 1:var i=t.stateNode;if(t.flags&4&&!Ve)if(n===null)i.componentDidMount();else{var r=t.elementType===t.type?n.memoizedProps:zt(t.type,n.memoizedProps);i.componentDidUpdate(r,n.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var o=t.updateQueue;o!==null&&lc(t,o,i);break;case 3:var s=t.updateQueue;if(s!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}lc(t,s,n)}break;case 5:var c=t.stateNode;if(n===null&&t.flags&4){n=c;var l=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&n.focus();break;case"img":l.src&&(n.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var f=t.alternate;if(f!==null){var x=f.memoizedState;if(x!==null){var v=x.dehydrated;v!==null&&ir(v)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(P(163))}Ve||t.flags&512&&us(t)}catch(g){Ne(t,t.return,g)}}if(t===e){V=null;break}if(n=t.sibling,n!==null){n.return=t.return,V=n;break}V=t.return}}function zc(e){for(;V!==null;){var t=V;if(t===e){V=null;break}var n=t.sibling;if(n!==null){n.return=t.return,V=n;break}V=t.return}}function Nc(e){for(;V!==null;){var t=V;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{Fa(4,t)}catch(l){Ne(t,n,l)}break;case 1:var i=t.stateNode;if(typeof i.componentDidMount=="function"){var r=t.return;try{i.componentDidMount()}catch(l){Ne(t,r,l)}}var o=t.return;try{us(t)}catch(l){Ne(t,o,l)}break;case 5:var s=t.return;try{us(t)}catch(l){Ne(t,s,l)}}}catch(l){Ne(t,t.return,l)}if(t===e){V=null;break}var c=t.sibling;if(c!==null){c.return=t.return,V=c;break}V=t.return}}var G0=Math.ceil,ka=Kt.ReactCurrentDispatcher,rl=Kt.ReactCurrentOwner,wt=Kt.ReactCurrentBatchConfig,ae=0,Ae=null,Ee=null,Oe=0,lt=0,ii=yn(0),Ie=0,hr=null,An=0,Da=0,al=0,Qi=null,Je=null,ol=0,mi=1/0,Ot=null,ja=!1,ps=null,gn=null,Pr=!1,cn=null,za=0,Zi=0,hs=null,ta=-1,na=0;function Ke(){return ae&6?Se():ta!==-1?ta:ta=Se()}function mn(e){return e.mode&1?ae&2&&Oe!==0?Oe&-Oe:I0.transition!==null?(na===0&&(na=Wu()),na):(e=de,e!==0||(e=window.event,e=e===void 0?16:Ku(e.type)),e):1}function Et(e,t,n,i){if(50<Zi)throw Zi=0,hs=null,Error(P(185));xr(e,n,i),(!(ae&2)||e!==Ae)&&(e===Ae&&(!(ae&2)&&(Da|=n),Ie===4&&on(e,Oe)),rt(e,i),n===1&&ae===0&&!(t.mode&1)&&(mi=Se()+500,Ra&&bn()))}function rt(e,t){var n=e.callbackNode;Ip(e,t);var i=la(e,e===Ae?Oe:0);if(i===0)n!==null&&Rl(n),e.callbackNode=null,e.callbackPriority=0;else if(t=i&-i,e.callbackPriority!==t){if(n!=null&&Rl(n),t===1)e.tag===0?T0(Sc.bind(null,e)):gd(Sc.bind(null,e)),E0(function(){!(ae&6)&&bn()}),n=null;else{switch(Uu(i)){case 1:n=$s;break;case 4:n=Bu;break;case 16:n=sa;break;case 536870912:n=Hu;break;default:n=sa}n=hf(n,sf.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function sf(e,t){if(ta=-1,na=0,ae&6)throw Error(P(327));var n=e.callbackNode;if(ci()&&e.callbackNode!==n)return null;var i=la(e,e===Ae?Oe:0);if(i===0)return null;if(i&30||i&e.expiredLanes||t)t=Na(e,i);else{t=i;var r=ae;ae|=2;var o=cf();(Ae!==e||Oe!==t)&&(Ot=null,mi=Se()+500,$n(e,t));do try{eh();break}catch(c){lf(e,c)}while(!0);Vs(),ka.current=o,ae=r,Ee!==null?t=0:(Ae=null,Oe=0,t=Ie)}if(t!==0){if(t===2&&(r=Bo(e),r!==0&&(i=r,t=gs(e,r))),t===1)throw n=hr,$n(e,0),on(e,i),rt(e,Se()),n;if(t===6)on(e,i);else{if(r=e.current.alternate,!(i&30)&&!X0(r)&&(t=Na(e,i),t===2&&(o=Bo(e),o!==0&&(i=o,t=gs(e,o))),t===1))throw n=hr,$n(e,0),on(e,i),rt(e,Se()),n;switch(e.finishedWork=r,e.finishedLanes=i,t){case 0:case 1:throw Error(P(345));case 2:Nn(e,Je,Ot);break;case 3:if(on(e,i),(i&130023424)===i&&(t=ol+500-Se(),10<t)){if(la(e,0)!==0)break;if(r=e.suspendedLanes,(r&i)!==i){Ke(),e.pingedLanes|=e.suspendedLanes&r;break}e.timeoutHandle=qo(Nn.bind(null,e,Je,Ot),t);break}Nn(e,Je,Ot);break;case 4:if(on(e,i),(i&4194240)===i)break;for(t=e.eventTimes,r=-1;0<i;){var s=31-Ct(i);o=1<<s,s=t[s],s>r&&(r=s),i&=~o}if(i=r,i=Se()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*G0(i/1960))-i,10<i){e.timeoutHandle=qo(Nn.bind(null,e,Je,Ot),i);break}Nn(e,Je,Ot);break;case 5:Nn(e,Je,Ot);break;default:throw Error(P(329))}}}return rt(e,Se()),e.callbackNode===n?sf.bind(null,e):null}function gs(e,t){var n=Qi;return e.current.memoizedState.isDehydrated&&($n(e,t).flags|=256),e=Na(e,t),e!==2&&(t=Je,Je=n,t!==null&&ms(t)),e}function ms(e){Je===null?Je=e:Je.push.apply(Je,e)}function X0(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var i=0;i<n.length;i++){var r=n[i],o=r.getSnapshot;r=r.value;try{if(!Lt(o(),r))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function on(e,t){for(t&=~al,t&=~Da,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-Ct(t),i=1<<n;e[n]=-1,t&=~i}}function Sc(e){if(ae&6)throw Error(P(327));ci();var t=la(e,0);if(!(t&1))return rt(e,Se()),null;var n=Na(e,t);if(e.tag!==0&&n===2){var i=Bo(e);i!==0&&(t=i,n=gs(e,i))}if(n===1)throw n=hr,$n(e,0),on(e,t),rt(e,Se()),n;if(n===6)throw Error(P(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,Nn(e,Je,Ot),rt(e,Se()),null}function sl(e,t){var n=ae;ae|=1;try{return e(t)}finally{ae=n,ae===0&&(mi=Se()+500,Ra&&bn())}}function Fn(e){cn!==null&&cn.tag===0&&!(ae&6)&&ci();var t=ae;ae|=1;var n=wt.transition,i=de;try{if(wt.transition=null,de=1,e)return e()}finally{de=i,wt.transition=n,ae=t,!(ae&6)&&bn()}}function ll(){lt=ii.current,xe(ii)}function $n(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,C0(n)),Ee!==null)for(n=Ee.return;n!==null;){var i=n;switch(Hs(i),i.tag){case 1:i=i.type.childContextTypes,i!=null&&pa();break;case 3:hi(),xe(nt),xe(Ye),Gs();break;case 5:Ks(i);break;case 4:hi();break;case 13:xe(ke);break;case 19:xe(ke);break;case 10:Ys(i.type._context);break;case 22:case 23:ll()}n=n.return}if(Ae=e,Ee=e=xn(e.current,null),Oe=lt=t,Ie=0,hr=null,al=Da=An=0,Je=Qi=null,En!==null){for(t=0;t<En.length;t++)if(n=En[t],i=n.interleaved,i!==null){n.interleaved=null;var r=i.next,o=n.pending;if(o!==null){var s=o.next;o.next=r,i.next=s}n.pending=i}En=null}return e}function lf(e,t){do{var n=Ee;try{if(Vs(),Xr.current=ba,ya){for(var i=je.memoizedState;i!==null;){var r=i.queue;r!==null&&(r.pending=null),i=i.next}ya=!1}if(Pn=0,Pe=Te=je=null,Vi=!1,dr=0,rl.current=null,n===null||n.return===null){Ie=1,hr=t,Ee=null;break}e:{var o=e,s=n.return,c=n,l=t;if(t=Oe,c.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var f=l,x=c,v=x.tag;if(!(x.mode&1)&&(v===0||v===11||v===15)){var g=x.alternate;g?(x.updateQueue=g.updateQueue,x.memoizedState=g.memoizedState,x.lanes=g.lanes):(x.updateQueue=null,x.memoizedState=null)}var b=hc(s);if(b!==null){b.flags&=-257,gc(b,s,c,o,t),b.mode&1&&pc(o,f,t),t=b,l=f;var w=t.updateQueue;if(w===null){var j=new Set;j.add(l),t.updateQueue=j}else w.add(l);break e}else{if(!(t&1)){pc(o,f,t),cl();break e}l=Error(P(426))}}else if(_e&&c.mode&1){var E=hc(s);if(E!==null){!(E.flags&65536)&&(E.flags|=256),gc(E,s,c,o,t),Ws(gi(l,c));break e}}o=l=gi(l,c),Ie!==4&&(Ie=2),Qi===null?Qi=[o]:Qi.push(o),o=s;do{switch(o.tag){case 3:o.flags|=65536,t&=-t,o.lanes|=t;var p=Ud(o,l,t);sc(o,p);break e;case 1:c=l;var d=o.type,m=o.stateNode;if(!(o.flags&128)&&(typeof d.getDerivedStateFromError=="function"||m!==null&&typeof m.componentDidCatch=="function"&&(gn===null||!gn.has(m)))){o.flags|=65536,t&=-t,o.lanes|=t;var y=Vd(o,c,t);sc(o,y);break e}}o=o.return}while(o!==null)}df(n)}catch(R){t=R,Ee===n&&n!==null&&(Ee=n=n.return);continue}break}while(!0)}function cf(){var e=ka.current;return ka.current=ba,e===null?ba:e}function cl(){(Ie===0||Ie===3||Ie===2)&&(Ie=4),Ae===null||!(An&268435455)&&!(Da&268435455)||on(Ae,Oe)}function Na(e,t){var n=ae;ae|=2;var i=cf();(Ae!==e||Oe!==t)&&(Ot=null,$n(e,t));do try{J0();break}catch(r){lf(e,r)}while(!0);if(Vs(),ae=n,ka.current=i,Ee!==null)throw Error(P(261));return Ae=null,Oe=0,Ie}function J0(){for(;Ee!==null;)uf(Ee)}function eh(){for(;Ee!==null&&!zp();)uf(Ee)}function uf(e){var t=pf(e.alternate,e,lt);e.memoizedProps=e.pendingProps,t===null?df(e):Ee=t,rl.current=null}function df(e){var t=e;do{var n=t.alternate;if(e=t.return,t.flags&32768){if(n=Q0(n,t),n!==null){n.flags&=32767,Ee=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{Ie=6,Ee=null;return}}else if(n=Y0(n,t,lt),n!==null){Ee=n;return}if(t=t.sibling,t!==null){Ee=t;return}Ee=t=e}while(t!==null);Ie===0&&(Ie=5)}function Nn(e,t,n){var i=de,r=wt.transition;try{wt.transition=null,de=1,th(e,t,n,i)}finally{wt.transition=r,de=i}return null}function th(e,t,n,i){do ci();while(cn!==null);if(ae&6)throw Error(P(327));n=e.finishedWork;var r=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(P(177));e.callbackNode=null,e.callbackPriority=0;var o=n.lanes|n.childLanes;if(Rp(e,o),e===Ae&&(Ee=Ae=null,Oe=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||Pr||(Pr=!0,hf(sa,function(){return ci(),null})),o=(n.flags&15990)!==0,n.subtreeFlags&15990||o){o=wt.transition,wt.transition=null;var s=de;de=1;var c=ae;ae|=4,rl.current=null,q0(e,n),af(n,e),y0(Qo),ca=!!Yo,Qo=Yo=null,e.current=n,K0(n),Np(),ae=c,de=s,wt.transition=o}else e.current=n;if(Pr&&(Pr=!1,cn=e,za=r),o=e.pendingLanes,o===0&&(gn=null),Ep(n.stateNode),rt(e,Se()),t!==null)for(i=e.onRecoverableError,n=0;n<t.length;n++)r=t[n],i(r.value,{componentStack:r.stack,digest:r.digest});if(ja)throw ja=!1,e=ps,ps=null,e;return za&1&&e.tag!==0&&ci(),o=e.pendingLanes,o&1?e===hs?Zi++:(Zi=0,hs=e):Zi=0,bn(),null}function ci(){if(cn!==null){var e=Uu(za),t=wt.transition,n=de;try{if(wt.transition=null,de=16>e?16:e,cn===null)var i=!1;else{if(e=cn,cn=null,za=0,ae&6)throw Error(P(331));var r=ae;for(ae|=4,V=e.current;V!==null;){var o=V,s=o.child;if(V.flags&16){var c=o.deletions;if(c!==null){for(var l=0;l<c.length;l++){var f=c[l];for(V=f;V!==null;){var x=V;switch(x.tag){case 0:case 11:case 15:Yi(8,x,o)}var v=x.child;if(v!==null)v.return=x,V=v;else for(;V!==null;){x=V;var g=x.sibling,b=x.return;if(tf(x),x===f){V=null;break}if(g!==null){g.return=b,V=g;break}V=b}}}var w=o.alternate;if(w!==null){var j=w.child;if(j!==null){w.child=null;do{var E=j.sibling;j.sibling=null,j=E}while(j!==null)}}V=o}}if(o.subtreeFlags&2064&&s!==null)s.return=o,V=s;else e:for(;V!==null;){if(o=V,o.flags&2048)switch(o.tag){case 0:case 11:case 15:Yi(9,o,o.return)}var p=o.sibling;if(p!==null){p.return=o.return,V=p;break e}V=o.return}}var d=e.current;for(V=d;V!==null;){s=V;var m=s.child;if(s.subtreeFlags&2064&&m!==null)m.return=s,V=m;else e:for(s=d;V!==null;){if(c=V,c.flags&2048)try{switch(c.tag){case 0:case 11:case 15:Fa(9,c)}}catch(R){Ne(c,c.return,R)}if(c===s){V=null;break e}var y=c.sibling;if(y!==null){y.return=c.return,V=y;break e}V=c.return}}if(ae=r,bn(),Pt&&typeof Pt.onPostCommitFiberRoot=="function")try{Pt.onPostCommitFiberRoot(La,e)}catch{}i=!0}return i}finally{de=n,wt.transition=t}}return!1}function Cc(e,t,n){t=gi(n,t),t=Ud(e,t,1),e=hn(e,t,1),t=Ke(),e!==null&&(xr(e,1,t),rt(e,t))}function Ne(e,t,n){if(e.tag===3)Cc(e,e,n);else for(;t!==null;){if(t.tag===3){Cc(t,e,n);break}else if(t.tag===1){var i=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(gn===null||!gn.has(i))){e=gi(n,e),e=Vd(t,e,1),t=hn(t,e,1),e=Ke(),t!==null&&(xr(t,1,e),rt(t,e));break}}t=t.return}}function nh(e,t,n){var i=e.pingCache;i!==null&&i.delete(t),t=Ke(),e.pingedLanes|=e.suspendedLanes&n,Ae===e&&(Oe&n)===n&&(Ie===4||Ie===3&&(Oe&130023424)===Oe&&500>Se()-ol?$n(e,0):al|=n),rt(e,t)}function ff(e,t){t===0&&(e.mode&1?(t=Nr,Nr<<=1,!(Nr&130023424)&&(Nr=4194304)):t=1);var n=Ke();e=Zt(e,t),e!==null&&(xr(e,t,n),rt(e,n))}function ih(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),ff(e,n)}function rh(e,t){var n=0;switch(e.tag){case 13:var i=e.stateNode,r=e.memoizedState;r!==null&&(n=r.retryLane);break;case 19:i=e.stateNode;break;default:throw Error(P(314))}i!==null&&i.delete(t),ff(e,n)}var pf;pf=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||nt.current)tt=!0;else{if(!(e.lanes&n)&&!(t.flags&128))return tt=!1,V0(e,t,n);tt=!!(e.flags&131072)}else tt=!1,_e&&t.flags&1048576&&md(t,ma,t.index);switch(t.lanes=0,t.tag){case 2:var i=t.type;ea(e,t),e=t.pendingProps;var r=di(t,Ye.current);li(t,n),r=Js(null,t,i,e,r,n);var o=el();return t.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,it(i)?(o=!0,ha(t)):o=!1,t.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,Zs(t),r.updater=Aa,t.stateNode=r,r._reactInternals=t,ns(t,i,e,n),t=as(null,t,i,!0,o,n)):(t.tag=0,_e&&o&&Bs(t),qe(null,t,r,n),t=t.child),t;case 16:i=t.elementType;e:{switch(ea(e,t),e=t.pendingProps,r=i._init,i=r(i._payload),t.type=i,r=t.tag=oh(i),e=zt(i,e),r){case 0:t=rs(null,t,i,e,n);break e;case 1:t=vc(null,t,i,e,n);break e;case 11:t=mc(null,t,i,e,n);break e;case 14:t=xc(null,t,i,zt(i.type,e),n);break e}throw Error(P(306,i,""))}return t;case 0:return i=t.type,r=t.pendingProps,r=t.elementType===i?r:zt(i,r),rs(e,t,i,r,n);case 1:return i=t.type,r=t.pendingProps,r=t.elementType===i?r:zt(i,r),vc(e,t,i,r,n);case 3:e:{if(qd(t),e===null)throw Error(P(387));i=t.pendingProps,o=t.memoizedState,r=o.element,bd(e,t),_a(t,i,null,n);var s=t.memoizedState;if(i=s.element,o.isDehydrated)if(o={element:i,isDehydrated:!1,cache:s.cache,pendingSuspenseBoundaries:s.pendingSuspenseBoundaries,transitions:s.transitions},t.updateQueue.baseState=o,t.memoizedState=o,t.flags&256){r=gi(Error(P(423)),t),t=_c(e,t,i,n,r);break e}else if(i!==r){r=gi(Error(P(424)),t),t=_c(e,t,i,n,r);break e}else for(ct=pn(t.stateNode.containerInfo.firstChild),ut=t,_e=!0,St=null,n=wd(t,null,i,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(fi(),i===r){t=qt(e,t,n);break e}qe(e,t,i,n)}t=t.child}return t;case 5:return kd(t),e===null&&Jo(t),i=t.type,r=t.pendingProps,o=e!==null?e.memoizedProps:null,s=r.children,Zo(i,r)?s=null:o!==null&&Zo(i,o)&&(t.flags|=32),Zd(e,t),qe(e,t,s,n),t.child;case 6:return e===null&&Jo(t),null;case 13:return Kd(e,t,n);case 4:return qs(t,t.stateNode.containerInfo),i=t.pendingProps,e===null?t.child=pi(t,null,i,n):qe(e,t,i,n),t.child;case 11:return i=t.type,r=t.pendingProps,r=t.elementType===i?r:zt(i,r),mc(e,t,i,r,n);case 7:return qe(e,t,t.pendingProps,n),t.child;case 8:return qe(e,t,t.pendingProps.children,n),t.child;case 12:return qe(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(i=t.type._context,r=t.pendingProps,o=t.memoizedProps,s=r.value,ge(xa,i._currentValue),i._currentValue=s,o!==null)if(Lt(o.value,s)){if(o.children===r.children&&!nt.current){t=qt(e,t,n);break e}}else for(o=t.child,o!==null&&(o.return=t);o!==null;){var c=o.dependencies;if(c!==null){s=o.child;for(var l=c.firstContext;l!==null;){if(l.context===i){if(o.tag===1){l=Vt(-1,n&-n),l.tag=2;var f=o.updateQueue;if(f!==null){f=f.shared;var x=f.pending;x===null?l.next=l:(l.next=x.next,x.next=l),f.pending=l}}o.lanes|=n,l=o.alternate,l!==null&&(l.lanes|=n),es(o.return,n,t),c.lanes|=n;break}l=l.next}}else if(o.tag===10)s=o.type===t.type?null:o.child;else if(o.tag===18){if(s=o.return,s===null)throw Error(P(341));s.lanes|=n,c=s.alternate,c!==null&&(c.lanes|=n),es(s,n,t),s=o.sibling}else s=o.child;if(s!==null)s.return=o;else for(s=o;s!==null;){if(s===t){s=null;break}if(o=s.sibling,o!==null){o.return=s.return,s=o;break}s=s.return}o=s}qe(e,t,r.children,n),t=t.child}return t;case 9:return r=t.type,i=t.pendingProps.children,li(t,n),r=yt(r),i=i(r),t.flags|=1,qe(e,t,i,n),t.child;case 14:return i=t.type,r=zt(i,t.pendingProps),r=zt(i.type,r),xc(e,t,i,r,n);case 15:return Yd(e,t,t.type,t.pendingProps,n);case 17:return i=t.type,r=t.pendingProps,r=t.elementType===i?r:zt(i,r),ea(e,t),t.tag=1,it(i)?(e=!0,ha(t)):e=!1,li(t,n),Wd(t,i,r),ns(t,i,r,n),as(null,t,i,!0,e,n);case 19:return Gd(e,t,n);case 22:return Qd(e,t,n)}throw Error(P(156,t.tag))};function hf(e,t){return Ou(e,t)}function ah(e,t,n,i){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function vt(e,t,n,i){return new ah(e,t,n,i)}function ul(e){return e=e.prototype,!(!e||!e.isReactComponent)}function oh(e){if(typeof e=="function")return ul(e)?1:0;if(e!=null){if(e=e.$$typeof,e===Es)return 11;if(e===Ls)return 14}return 2}function xn(e,t){var n=e.alternate;return n===null?(n=vt(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function ia(e,t,n,i,r,o){var s=2;if(i=e,typeof e=="function")ul(e)&&(s=1);else if(typeof e=="string")s=5;else e:switch(e){case Qn:return Tn(n.children,r,o,t);case Cs:s=8,r|=8;break;case No:return e=vt(12,n,t,r|2),e.elementType=No,e.lanes=o,e;case So:return e=vt(13,n,t,r),e.elementType=So,e.lanes=o,e;case Co:return e=vt(19,n,t,r),e.elementType=Co,e.lanes=o,e;case ku:return Oa(n,r,o,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case yu:s=10;break e;case bu:s=9;break e;case Es:s=11;break e;case Ls:s=14;break e;case nn:s=16,i=null;break e}throw Error(P(130,e==null?e:typeof e,""))}return t=vt(s,n,t,r),t.elementType=e,t.type=i,t.lanes=o,t}function Tn(e,t,n,i){return e=vt(7,e,i,t),e.lanes=n,e}function Oa(e,t,n,i){return e=vt(22,e,i,t),e.elementType=ku,e.lanes=n,e.stateNode={isHidden:!1},e}function _o(e,t,n){return e=vt(6,e,null,t),e.lanes=n,e}function wo(e,t,n){return t=vt(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function sh(e,t,n,i,r){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Ja(0),this.expirationTimes=Ja(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Ja(0),this.identifierPrefix=i,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function dl(e,t,n,i,r,o,s,c,l){return e=new sh(e,t,n,c,l),t===1?(t=1,o===!0&&(t|=8)):t=0,o=vt(3,null,null,t),e.current=o,o.stateNode=e,o.memoizedState={element:i,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Zs(o),e}function lh(e,t,n){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Yn,key:i==null?null:""+i,children:e,containerInfo:t,implementation:n}}function gf(e){if(!e)return _n;e=e._reactInternals;e:{if(On(e)!==e||e.tag!==1)throw Error(P(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(it(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(P(171))}if(e.tag===1){var n=e.type;if(it(n))return hd(e,n,t)}return t}function mf(e,t,n,i,r,o,s,c,l){return e=dl(n,i,!0,e,r,o,s,c,l),e.context=gf(null),n=e.current,i=Ke(),r=mn(n),o=Vt(i,r),o.callback=t??null,hn(n,o,r),e.current.lanes=r,xr(e,r,i),rt(e,i),e}function Ba(e,t,n,i){var r=t.current,o=Ke(),s=mn(r);return n=gf(n),t.context===null?t.context=n:t.pendingContext=n,t=Vt(o,s),t.payload={element:e},i=i===void 0?null:i,i!==null&&(t.callback=i),e=hn(r,t,s),e!==null&&(Et(e,r,s,o),Gr(e,r,s)),s}function Sa(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function Ec(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function fl(e,t){Ec(e,t),(e=e.alternate)&&Ec(e,t)}function ch(){return null}var xf=typeof reportError=="function"?reportError:function(e){console.error(e)};function pl(e){this._internalRoot=e}Ha.prototype.render=pl.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(P(409));Ba(e,t,null,null)};Ha.prototype.unmount=pl.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Fn(function(){Ba(null,e,null,null)}),t[Qt]=null}};function Ha(e){this._internalRoot=e}Ha.prototype.unstable_scheduleHydration=function(e){if(e){var t=Qu();e={blockedOn:null,target:e,priority:t};for(var n=0;n<an.length&&t!==0&&t<an[n].priority;n++);an.splice(n,0,e),n===0&&qu(e)}};function hl(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Wa(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function Lc(){}function uh(e,t,n,i,r){if(r){if(typeof i=="function"){var o=i;i=function(){var f=Sa(s);o.call(f)}}var s=mf(t,i,e,0,null,!1,!1,"",Lc);return e._reactRootContainer=s,e[Qt]=s.current,or(e.nodeType===8?e.parentNode:e),Fn(),s}for(;r=e.lastChild;)e.removeChild(r);if(typeof i=="function"){var c=i;i=function(){var f=Sa(l);c.call(f)}}var l=dl(e,0,!1,null,null,!1,!1,"",Lc);return e._reactRootContainer=l,e[Qt]=l.current,or(e.nodeType===8?e.parentNode:e),Fn(function(){Ba(t,l,n,i)}),l}function Ua(e,t,n,i,r){var o=n._reactRootContainer;if(o){var s=o;if(typeof r=="function"){var c=r;r=function(){var l=Sa(s);c.call(l)}}Ba(t,s,e,r)}else s=uh(n,t,e,r,i);return Sa(s)}Vu=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=Ai(t.pendingLanes);n!==0&&(Ts(t,n|1),rt(t,Se()),!(ae&6)&&(mi=Se()+500,bn()))}break;case 13:Fn(function(){var i=Zt(e,1);if(i!==null){var r=Ke();Et(i,e,1,r)}}),fl(e,1)}};Is=function(e){if(e.tag===13){var t=Zt(e,134217728);if(t!==null){var n=Ke();Et(t,e,134217728,n)}fl(e,134217728)}};Yu=function(e){if(e.tag===13){var t=mn(e),n=Zt(e,t);if(n!==null){var i=Ke();Et(n,e,t,i)}fl(e,t)}};Qu=function(){return de};Zu=function(e,t){var n=de;try{return de=e,t()}finally{de=n}};Fo=function(e,t,n){switch(t){case"input":if(Mo(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var i=n[t];if(i!==e&&i.form===e.form){var r=Ia(i);if(!r)throw Error(P(90));zu(i),Mo(i,r)}}}break;case"textarea":Su(e,n);break;case"select":t=n.value,t!=null&&ri(e,!!n.multiple,t,!1)}};Iu=sl;Ru=Fn;var dh={usingClientEntryPoint:!1,Events:[_r,Gn,Ia,$u,Tu,sl]},$i={findFiberByHostInstance:Cn,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},fh={bundleType:$i.bundleType,version:$i.version,rendererPackageName:$i.rendererPackageName,rendererConfig:$i.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Kt.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=Fu(e),e===null?null:e.stateNode},findFiberByHostInstance:$i.findFiberByHostInstance||ch,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Ar=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Ar.isDisabled&&Ar.supportsFiber)try{La=Ar.inject(fh),Pt=Ar}catch{}}ft.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=dh;ft.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!hl(t))throw Error(P(200));return lh(e,t,null,n)};ft.createRoot=function(e,t){if(!hl(e))throw Error(P(299));var n=!1,i="",r=xf;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(i=t.identifierPrefix),t.onRecoverableError!==void 0&&(r=t.onRecoverableError)),t=dl(e,1,!1,null,null,n,!1,i,r),e[Qt]=t.current,or(e.nodeType===8?e.parentNode:e),new pl(t)};ft.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(P(188)):(e=Object.keys(e).join(","),Error(P(268,e)));return e=Fu(t),e=e===null?null:e.stateNode,e};ft.flushSync=function(e){return Fn(e)};ft.hydrate=function(e,t,n){if(!Wa(t))throw Error(P(200));return Ua(null,e,t,!0,n)};ft.hydrateRoot=function(e,t,n){if(!hl(e))throw Error(P(405));var i=n!=null&&n.hydratedSources||null,r=!1,o="",s=xf;if(n!=null&&(n.unstable_strictMode===!0&&(r=!0),n.identifierPrefix!==void 0&&(o=n.identifierPrefix),n.onRecoverableError!==void 0&&(s=n.onRecoverableError)),t=mf(t,null,e,1,n??null,r,!1,o,s),e[Qt]=t.current,or(e),i)for(e=0;e<i.length;e++)n=i[e],r=n._getVersion,r=r(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,r]:t.mutableSourceEagerHydrationData.push(n,r);return new Ha(t)};ft.render=function(e,t,n){if(!Wa(t))throw Error(P(200));return Ua(null,e,t,!1,n)};ft.unmountComponentAtNode=function(e){if(!Wa(e))throw Error(P(40));return e._reactRootContainer?(Fn(function(){Ua(null,null,e,!1,function(){e._reactRootContainer=null,e[Qt]=null})}),!0):!1};ft.unstable_batchedUpdates=sl;ft.unstable_renderSubtreeIntoContainer=function(e,t,n,i){if(!Wa(n))throw Error(P(200));if(e==null||e._reactInternals===void 0)throw Error(P(38));return Ua(e,t,n,!1,i)};ft.version="18.3.1-next-f1338f8080-20240426";function vf(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(vf)}catch(e){console.error(e)}}vf(),xu.exports=ft;var ph=xu.exports,_f,Mc=ph;_f=Mc.createRoot,Mc.hydrateRoot;const _t=1024*1024,qi=e=>e.includes(".")?e.split(".").pop().toLowerCase():"",Ca=1024*_t,Ht=new Intl.NumberFormat("en"),gr=e=>Number.isFinite(e)&&e>0?e:0,Mn=e=>{const t=gr(e);return t<1024?`${Math.round(t)} B`:t<_t?`${Ht.format(Math.round(t/1024))} KB`:t<Ca?`${(t/_t).toFixed(t<10*_t?1:0)} MB`:`${Ht.format(Number((t/Ca).toFixed(1)))} GB`},$c=(e,t)=>{const n=gr(t),i=Math.min(gr(e),n);return n<1024?`${Math.round(i)} of ${Mn(n)}`:n<_t?`${Ht.format(Math.round(i/1024))} of ${Mn(n)}`:n<Ca?`${(i/_t).toFixed(1)} of ${Mn(n)}`:`${(i/Ca).toFixed(1)} of ${Mn(n)}`},hh=e=>Number.isFinite(e)?e<1?"almost done":e<60?`${Math.ceil(e)}s left`:e<3600?`${Math.ceil(e/60)} min left`:e<86400?`${Math.ceil(e/3600)} h left`:`${Math.ceil(e/86400)} d left`:"starting",gh=e=>Number.isFinite(e)?Math.min(1,Math.max(0,e)):0,yo=e=>e.length>24&&!/[\u0590-\u08ff]/.test(e)?[e.slice(0,-14),e.slice(-14)]:null,mh=[{exts:["pdf"],color:"#e5484d"},{exts:["xls","xlsx","csv","numbers"],color:"#1a9a52"},{exts:["doc","docx","txt","md","pages","rtf"],color:"#0060e2"},{exts:["png","jpg","jpeg","gif","webp","svg","heic","avif"],color:"#5B5BD6"},{exts:["mp4","mov","webm","mp3","wav"],color:"#e8a20c"},{exts:["ppt","pptx","key"],color:"#e8590c"}],xs=e=>{var t;return((t=mh.find(n=>n.exts.includes(qi(e))))==null?void 0:t.color)??"#8f8f8f"},xh=e=>Math.min(9e3,Math.max(2600,e/(1.2*_t)*1e3));let vh=0;const _h=()=>`f${Date.now().toString(36)}${(vh++).toString(36)}`,Un=({d:e,solid:t,className:n})=>a.jsx("svg",{viewBox:t?"0 0 16 16":"0 0 24 24",className:["ui-dzc__glyph",n].filter(Boolean).join(" "),"data-solid":t||void 0,"aria-hidden":"true",children:a.jsx("path",{d:e})}),Vn={upload:"M12 15V4M7.5 8.5 12 4l4.5 4.5M5 15v3.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V15",close:"M7 7l10 10M17 7 7 17",retry:"M20 12a8 8 0 1 1-2.34-5.66L20 8.5M20 4v4.5h-4.5",checkCircle:"M1.5 8a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0Zm8.9-1.2a.5.5 0 0 0-.8-.6L7.44 9.23 6.35 8.15a.5.5 0 1 0-.7.7l1.5 1.5a.5.5 0 0 0 .76-.06l2.5-3.5Z",alertCircle:"M1.5 8a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0ZM8 4.6a.6.6 0 0 0-.6.6v3.2a.6.6 0 0 0 1.2 0V5.2a.6.6 0 0 0-.6-.6Zm0 6.9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"};function wh({name:e}){return a.jsxs("svg",{viewBox:"0 0 16 16",className:"ui-dzc__file","aria-hidden":"true",children:[a.jsx("path",{className:"ui-dzc__file-sheet",d:"M4 1.75h5l3.25 3.25v8A1.25 1.25 0 0 1 11 14.25H4A1.25 1.25 0 0 1 2.75 13V3A1.25 1.25 0 0 1 4 1.75Z"}),a.jsx("path",{className:"ui-dzc__file-fold",d:"M9 1.75V4a1 1 0 0 0 1 1h2.25"}),a.jsx("rect",{x:"1",y:"8.5",width:"9",height:"4.5",rx:"1.25",fill:xs(e)})]})}function Tc({name:e,end:t}){const n=(qi(e)||"file").slice(0,4).toUpperCase(),i=Math.max(18,n.length*5.2+8),r=t?30-i:0;return a.jsxs("svg",{viewBox:"0 0 30 36",className:"ui-dzc__badge","aria-hidden":"true",children:[a.jsx("path",{d:"M5 1h14l10 10v20a4 4 0 0 1-4 4H5a4 4 0 0 1-4-4V5a4 4 0 0 1 4-4z",className:"ui-dzc__badge-sheet"}),a.jsx("path",{d:"M19 1v6a4 4 0 0 0 4 4h6",className:"ui-dzc__badge-fold"}),a.jsx("rect",{x:r,y:"19",width:i,height:"11",rx:"3",fill:xs(e),fillOpacity:"0.12"}),a.jsx("text",{x:r+4,y:"27.2",className:"ui-dzc__badge-text",fill:xs(e),children:n})]})}function yh(){return a.jsxs("span",{className:"ui-dzc__stack","aria-hidden":"true",children:[a.jsx("span",{className:"ui-dzc__sheet ui-dzc__sheet-l",children:a.jsx(Tc,{name:"file.pdf"})}),a.jsx("span",{className:"ui-dzc__sheet ui-dzc__sheet-r",children:a.jsx(Tc,{name:"file.png",end:!0})}),a.jsx("span",{className:"ui-dzc__sheet ui-dzc__sheet-m",children:a.jsx(Un,{d:Vn.upload})})]})}const Ic=[{name:"Q3-Board-Report.pdf",size:4.2*_t},{name:"Hero-Shot.png",size:2.6*_t},{name:"Budget-2027.xlsx",size:1.3*_t,failAt:.62},{name:"Product-Demo.mp4",size:48*_t}];function bh({accept:e,maxSize:t=25*_t,onUpload:n,onChange:i,hint:r,autoplay:o=!1,className:s}){const[c,l]=_.useState([]),[f,x]=_.useState(0),[v,g]=_.useState(""),[,b]=_.useState(0),w=_.useRef(null),j=_.useRef(null),E=_.useRef(null),p=_.useRef(0),d=_.useRef(c);d.current=c;const m=_.useId(),y=e==null?void 0:e.map(h=>h.replace(/^\./,"").toLowerCase()),R=y!=null&&y.length?y.length<=3?y.map(h=>h.toUpperCase()).join(", "):`${y.slice(0,3).map(h=>h.toUpperCase()).join(", ")} and more`:"Any file",I=Number.isFinite(t)&&t>0?t:1/0,N=r??(I<1/0?`${R} · up to ${Mn(I)} each`:R);_.useEffect(()=>{i==null||i(c.filter(h=>!h.removing).map(({id:h,name:L,size:D,status:z,progress:X,error:ce,file:M})=>({id:h,name:L,size:D,status:z,progress:X,error:ce,file:M})))},[c]),_.useLayoutEffect(()=>{const h=j.current,L=E.current;if(!h||!L)return;const D=()=>h.style.height=`${L.offsetHeight}px`;D();const z=new ResizeObserver(D);return z.observe(L),()=>z.disconnect()},[]);const T=(h,L)=>l(D=>D.map(z=>z.id===h?{...z,...L}:z)),H=h=>{const L=_h();let D;y!=null&&y.length&&!y.includes(qi(h.name))?D=qi(h.name)?`.${qi(h.name)} files aren't supported`:"This file type isn't supported":h.size>I&&(D=`Too large – max ${Mn(I)}`);const z={id:L,name:h.name,size:gr(h.size),file:h.file,status:D?"error":"uploading",progress:0,error:D,failAt:h.failAt,startedAt:performance.now(),duration:xh(gr(h.size))};l(X=>[...X,z]),D?g(`${h.name}: ${D}`):n&&h.file&&U(z)},U=h=>{n(h.file,L=>l(D=>D.map(z=>z.id===h.id&&z.status==="uploading"?{...z,progress:Math.max(z.progress,gh(L))}:z))).then(()=>{T(h.id,{status:"done",progress:1}),g(`${h.name} uploaded`)}).catch(L=>{const D=L instanceof Error&&L.message?L.message:"Upload failed";T(h.id,{status:"error",error:D,retryable:!0}),g(`${h.name}: ${D}`)})},S=h=>Array.from(h).forEach(L=>H({name:L.name,size:L.size,file:L})),q=c.some(h=>h.status==="uploading"&&(!n||!h.file));_.useEffect(()=>{if(!q)return;const h=window.setInterval(()=>{const L=performance.now();l(D=>D.map(z=>{if(z.status!=="uploading"||n&&z.file)return z;const X=Math.min(1,(L-z.startedAt)/z.duration),ce=Math.max(z.progress,X<1?X*(.92+Math.random()*.08):1);return z.failAt!==void 0&&ce>=z.failAt?(g(`${z.name}: upload failed`),{...z,progress:z.failAt,status:"error",error:"Connection lost",retryable:!0}):ce>=1?(g(`${z.name} uploaded`),{...z,progress:1,status:"done"}):{...z,progress:ce}}))},90);return()=>clearInterval(h)},[q,n]),_.useEffect(()=>{if(!c.some(L=>L.status==="uploading"))return;const h=window.setInterval(()=>b(L=>L+1),500);return()=>clearInterval(h)},[c]),_.useEffect(()=>{if(!o)return;const h=[window.setTimeout(()=>x(Ic.length),700),window.setTimeout(()=>{x(0),Ic.forEach((L,D)=>window.setTimeout(()=>H(L),D*140))},1900)];return()=>h.forEach(clearTimeout)},[o]);const ne=h=>{T(h.id,{status:"uploading",progress:0,error:void 0,retryable:!1,failAt:void 0,startedAt:performance.now()}),n&&h.file&&U({...h})},ee=h=>{T(h,{removing:!0}),window.setTimeout(()=>l(L=>L.filter(D=>D.id!==h)),480)},re=()=>d.current.filter(h=>h.status!=="uploading").forEach(h=>ee(h.id)),pe=h=>Array.from(h.dataTransfer.types).includes("Files"),A=h=>{pe(h)&&(h.preventDefault(),p.current+=1,x(Math.max(1,h.dataTransfer.items.length)))},$=h=>{pe(h)&&(h.preventDefault(),h.dataTransfer.dropEffect="copy")},O=()=>{p.current=Math.max(0,p.current-1),p.current||x(0)},Y=h=>{pe(h)&&(h.preventDefault(),p.current=0,x(0),S(h.dataTransfer.files))},G=c.filter(h=>!h.removing),te=G.filter(h=>h.status==="uploading"),fe=G.filter(h=>h.status==="done"),le=G.filter(h=>h.status==="error"),se=performance.now();let C=null;if(G.length)if(te.length){const h=te.reduce((z,X)=>z+X.size,0),L=te.reduce((z,X)=>z+X.size*X.progress,0),D=`Uploading ${Ht.format(te.length)} of ${Ht.format(G.length)}`;C=a.jsxs("span",{className:"ui-dzc__summary",children:[a.jsx("span",{className:"ui-dzc__shimmer","data-text":D,children:D}),a.jsx("span",{className:"ui-dzc__dot",children:"·"}),$c(L,h)]})}else C=a.jsxs("span",{className:"ui-dzc__summary ui-dzc__summary-done",children:[le.length?a.jsx(Un,{d:Vn.alertCircle,solid:!0,className:"ui-dzc__warn"}):a.jsx(Un,{d:Vn.checkCircle,solid:!0,className:"ui-dzc__ok"}),le.length?`${Ht.format(fe.length)} of ${Ht.format(G.length)} uploaded`:`${Ht.format(fe.length)} ${fe.length===1?"file":"files"} uploaded`]});return a.jsxs("div",{className:["ui-dzc",s].filter(Boolean).join(" "),children:[a.jsx("style",{href:"ui-dropzone-clean",precedence:"default",children:kh}),a.jsxs("div",{className:"ui-dzc__card",children:[a.jsx("div",{ref:j,className:"ui-dzc__body",children:a.jsxs("div",{ref:E,className:"ui-dzc__inner",children:[a.jsx("input",{ref:w,id:m,type:"file",multiple:!0,accept:e==null?void 0:e.join(","),className:"ui-dzc__input",tabIndex:-1,onChange:h=>{h.target.files&&S(h.target.files),h.target.value=""}}),a.jsxs("button",{type:"button",className:"ui-dzc__area","data-dragging":f>0||void 0,"aria-describedby":`${m}-hint`,onClick:()=>{var h;return(h=w.current)==null?void 0:h.click()},onDragEnter:A,onDragOver:$,onDragLeave:O,onDrop:Y,children:[a.jsx(yh,{}),a.jsx("span",{className:"ui-dzc__title",children:f?`Release to upload ${f===1?"1 file":`${Ht.format(f)} files`}`:a.jsxs(a.Fragment,{children:[a.jsxs("span",{className:"ui-dzc__for-mouse",children:["Drop files here or ",a.jsx("span",{className:"ui-dzc__browse",children:"browse"})]}),a.jsxs("span",{className:"ui-dzc__for-touch",children:["Tap to ",a.jsx("span",{className:"ui-dzc__browse",children:"choose files"})]})]})},f?"drop":"idle"),a.jsx("span",{className:"ui-dzc__hint",id:`${m}-hint`,children:N})]}),a.jsx("ul",{className:"ui-dzc__list","aria-label":"Uploads",children:c.map(h=>{const L=h.status==="uploading"?(1-h.progress)*(se-h.startedAt)/Math.max(.05,h.progress)/1e3:0;return a.jsx("li",{className:"ui-dzc__row","data-status":h.status,"data-removing":h.removing||void 0,children:a.jsxs("div",{className:"ui-dzc__row-inner",children:[a.jsx(wh,{name:h.name}),a.jsxs("div",{className:"ui-dzc__info",children:[a.jsxs("div",{className:"ui-dzc__line",children:[a.jsx("span",{className:"ui-dzc__name",title:h.name,dir:"auto",children:yo(h.name)?a.jsxs(a.Fragment,{children:[a.jsx("span",{className:"ui-dzc__name-head",children:yo(h.name)[0]}),a.jsx("span",{className:"ui-dzc__name-tail",children:yo(h.name)[1]})]}):h.name}),h.status==="done"&&a.jsx("span",{className:"ui-dzc__done","aria-label":"Uploaded",children:a.jsx(Un,{d:Vn.checkCircle,solid:!0})})]}),a.jsxs("div",{className:"ui-dzc__meta",children:[h.status==="uploading"&&a.jsxs(a.Fragment,{children:[$c(h.size*h.progress,h.size),a.jsx("span",{className:"ui-dzc__dot",children:"·"}),h.progress<.04?"starting":hh(L)]}),h.status==="done"&&Mn(h.size),h.status==="error"&&a.jsx("span",{className:"ui-dzc__error",dir:"auto",children:h.error})]},h.status),(h.status!=="error"||h.retryable)&&a.jsx("div",{className:"ui-dzc__bar","data-hidden":h.status==="done"||void 0,role:"progressbar","aria-label":`${h.name} upload`,"aria-valuemin":0,"aria-valuemax":100,"aria-valuenow":Math.round(h.progress*100),children:a.jsx("span",{style:{transform:`scaleX(${h.progress})`}})})]}),a.jsxs("div",{className:"ui-dzc__actions",children:[h.status==="error"&&h.retryable&&a.jsx("button",{type:"button",className:"ui-dzc__icon-btn ui-dzc__retry","aria-label":`Retry ${h.name}`,onClick:()=>ne(h),children:a.jsx(Un,{d:Vn.retry})}),a.jsx("button",{type:"button",className:"ui-dzc__icon-btn","aria-label":`Remove ${h.name}`,onClick:()=>ee(h.id),children:a.jsx(Un,{d:Vn.close})})]})]})},h.id)})})]})}),a.jsxs("div",{className:"ui-dzc__foot",children:[C??a.jsx("span",{className:"ui-dzc__foot-idle",children:"No files yet"}),(fe.length>0||le.length>0)&&!te.length&&a.jsx("button",{type:"button",className:"ui-dzc__clear",onClick:re,children:"Clear"})]})]}),a.jsx("span",{className:"ui-dzc__live","aria-live":"polite",children:v})]})}const kh=`
/* Colors and motion as variables – override them on .ui-dzc */
.ui-dzc {
  --ui-dzc-card: #ffffff;
  --ui-dzc-ink: rgba(0, 0, 0, 0.88);
  --ui-dzc-strong: #000000;
  --ui-dzc-text: rgba(0, 0, 0, 0.61);
  --ui-dzc-muted: rgba(0, 0, 0, 0.45);
  --ui-dzc-faint: rgba(0, 0, 0, 0.27);
  --ui-dzc-icon: rgba(0, 0, 0, 0.447);
  --ui-dzc-line: rgba(0, 0, 0, 0.06);
  --ui-dzc-dash: rgba(0, 0, 0, 0.12);
  --ui-dzc-dash-hover: rgba(0, 0, 0, 0.2);
  --ui-dzc-sheet-line: rgba(0, 0, 0, 0.14);
  --ui-dzc-track: rgba(0, 0, 0, 0.06);
  --ui-dzc-wash: rgba(0, 0, 0, 0.03);
  --ui-dzc-wash-big: rgba(0, 0, 0, 0.015);
  --ui-dzc-flash: rgba(0, 0, 0, 0.06);
  --ui-dzc-accent: rgba(0, 96, 226, 0.765);
  --ui-dzc-accent-soft: rgba(0, 96, 226, 0.035);
  --ui-dzc-ok: #1a9a52;
  --ui-dzc-warn: #e8a20c;
  --ui-dzc-danger: #e5484d;
  --ui-dzc-shine: rgba(255, 255, 255, 0.82);
  /* Strokes are shadows: a 0.5px hairline plus a soft lift */
  --ui-dzc-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.06), 0 1px 1px -1px rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --ui-dzc-focus: rgba(0, 96, 226, 0.35);
  --ui-dzc-ease: cubic-bezier(0.22, 1, 0.36, 1);
  position: relative;
  box-sizing: border-box;
  container-type: inline-size;
  display: grid;
  width: 100%;
  max-width: 520px;
  font-family: "Inter", "InterVariable", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  font-size: 13px;
  line-height: 20px;
  font-weight: 400;
  color: var(--ui-dzc-ink);
  -webkit-font-smoothing: antialiased;
}
.ui-dzc *, .ui-dzc *::before, .ui-dzc *::after { box-sizing: border-box; }
:where(.ui-dzc) button { margin: 0; padding: 0; border: 0; background: none; font: inherit; color: inherit; cursor: pointer; }
:where(.ui-dzc) svg { display: block; flex: none; }
.ui-dzc button:focus-visible { outline: 2px solid var(--ui-dzc-focus); outline-offset: 1px; }
/* 16px icons with thin ~1.1px lines, or solid shapes */
.ui-dzc__glyph { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.65; stroke-linecap: round; stroke-linejoin: round; }
.ui-dzc__glyph[data-solid] { fill: currentColor; stroke: none; }

/* One white card – the edge is a shadow, not a border */
.ui-dzc__card { overflow: hidden; border-radius: 10px; background: var(--ui-dzc-card); box-shadow: var(--ui-dzc-shadow); }
.ui-dzc__body { overflow: hidden; transition: height 360ms var(--ui-dzc-ease); }
.ui-dzc__inner { display: flow-root; padding: 8px 8px 4px; }
.ui-dzc__input { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }

/* The drop area: white with a dashed hairline; blue dashes and a faint blue wash while files are dragged over */
.ui-dzc__area {
  position: relative;
  display: grid;
  justify-items: center;
  width: 100%;
  margin-bottom: 4px;
  padding: 24px 16px 20px;
  border: 1px dashed var(--ui-dzc-dash);
  border-radius: 10px;
  background: var(--ui-dzc-card);
  text-align: center;
  transition: background-color 160ms ease, border-color 160ms ease;
}
.ui-dzc__area:hover { border-color: var(--ui-dzc-dash-hover); background-color: var(--ui-dzc-wash-big); }
.ui-dzc__area[data-dragging] { border-color: var(--ui-dzc-accent); background-color: var(--ui-dzc-accent-soft); }
.ui-dzc__area:focus-visible { outline-offset: 2px; }

/* Three little documents that fan out while files are dragged over */
.ui-dzc__stack { position: relative; width: 64px; height: 44px; margin-bottom: 12px; }
.ui-dzc__sheet {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 30px;
  height: 36px;
  margin-left: -15px;
  border-radius: 6px;
  background: var(--ui-dzc-card);
  box-shadow: var(--ui-dzc-shadow);
  transition: transform 420ms var(--ui-dzc-ease);
}
/* The PDF and PNG behind */
.ui-dzc__sheet-l, .ui-dzc__sheet-r { background: none; box-shadow: none; filter: drop-shadow(0 1px 1.5px rgba(0, 0, 0, 0.05)); }
.ui-dzc__sheet .ui-dzc__badge { width: 100%; height: 100%; }
.ui-dzc__sheet-l { transform: translate(-12px, 2px) rotate(-10deg); }
.ui-dzc__sheet-r { transform: translate(12px, 2px) rotate(10deg); }
.ui-dzc__sheet-m { display: grid; place-items: center; transform: translateY(-2px); }
.ui-dzc__sheet-m .ui-dzc__glyph { color: var(--ui-dzc-icon); transition: color 160ms ease; }
.ui-dzc__area:hover .ui-dzc__sheet-m { transform: translateY(-4px); }
.ui-dzc__area:hover .ui-dzc__sheet-m .ui-dzc__glyph { color: var(--ui-dzc-ink); }
.ui-dzc__area[data-dragging] .ui-dzc__sheet-l { transform: translate(-28px, 0) rotate(-16deg); }
.ui-dzc__area[data-dragging] .ui-dzc__sheet-r { transform: translate(28px, 0) rotate(16deg); }
.ui-dzc__area[data-dragging] .ui-dzc__sheet-m { transform: translateY(-8px) scale(1.05); }
.ui-dzc__area[data-dragging] .ui-dzc__sheet-m .ui-dzc__glyph { color: var(--ui-dzc-accent); animation: ui-dzc-bob 900ms ease-in-out infinite; }

.ui-dzc__badge-sheet { fill: var(--ui-dzc-card); stroke: var(--ui-dzc-sheet-line); stroke-width: 0.9; }
.ui-dzc__badge-fold { fill: none; stroke: var(--ui-dzc-sheet-line); stroke-width: 0.9; stroke-linejoin: round; }
.ui-dzc__badge-text { font-family: inherit; font-size: 6.5px; font-weight: 500; letter-spacing: 0.04em; }

.ui-dzc__title { font-size: 13px; line-height: 20px; font-weight: 500; color: var(--ui-dzc-ink); animation: ui-dzc-in 260ms var(--ui-dzc-ease) both; }
.ui-dzc__browse { color: var(--ui-dzc-accent); }
.ui-dzc__hint { font-size: 12px; line-height: 16px; color: var(--ui-dzc-muted); overflow-wrap: anywhere; }

/* File rows: list rows that grow in and fold away when removed */
.ui-dzc__list { display: grid; margin: 0; padding: 0; list-style: none; }
/* A long list scrolls inside the card */
.ui-dzc__list { max-height: 360px; overflow-y: auto; overscroll-behavior: contain; }
.ui-dzc__row { display: grid; grid-template-rows: 1fr; animation: ui-dzc-grow 420ms var(--ui-dzc-ease) both; transition: grid-template-rows 260ms var(--ui-dzc-ease), opacity 200ms ease; }
/* Removing: the row flashes briefly, then folds away */
.ui-dzc__row[data-removing] { grid-template-rows: 0fr; opacity: 0; transition: grid-template-rows 260ms var(--ui-dzc-ease) 200ms, opacity 220ms ease 180ms; }
.ui-dzc__row-inner { position: relative; isolation: isolate; display: flex; align-items: center; gap: 10px; min-height: 0; overflow: hidden; padding: 8px 0 8px 8px; }
.ui-dzc__row-inner::before { content: ""; position: absolute; inset: 2px 0; border-radius: 6px; background: var(--ui-dzc-flash); opacity: 0; pointer-events: none; z-index: -1; }
.ui-dzc__row[data-removing] .ui-dzc__row-inner::before { animation: ui-dzc-flash 280ms ease-out both; }
/* A row on its way out no longer reacts – its buttons lose their hover fill right away */
.ui-dzc__row[data-removing] { pointer-events: none; }
.ui-dzc__row[data-removing] .ui-dzc__icon-btn { background: none; }
.ui-dzc__row + .ui-dzc__row .ui-dzc__row-inner { border-top: 0.5px solid var(--ui-dzc-line); }

/* The 16px file icon, aligned with the name */
.ui-dzc__file { align-self: flex-start; width: 16px; height: 16px; margin-top: 2px; overflow: visible; }
.ui-dzc__file-sheet, .ui-dzc__file-fold { fill: none; stroke: var(--ui-dzc-icon); stroke-width: 1.1; stroke-linecap: round; stroke-linejoin: round; }
.ui-dzc__file-sheet { fill: var(--ui-dzc-card); }

.ui-dzc__info { flex: 1; min-width: 0; }
.ui-dzc__line { display: flex; align-items: center; gap: 6px; min-width: 0; }
.ui-dzc__name { overflow: hidden; font-size: 13px; line-height: 20px; font-weight: 500; color: var(--ui-dzc-ink); white-space: nowrap; text-overflow: ellipsis; }
/* A long name shortens in the middle – the end with the extension stays */
.ui-dzc__name:has(> .ui-dzc__name-head) { display: flex; min-width: 0; }
.ui-dzc__name-head { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.ui-dzc__name-tail { flex: none; white-space: pre; }
.ui-dzc__done { display: grid; place-items: center; flex: none; color: var(--ui-dzc-ok); animation: ui-dzc-pop 420ms cubic-bezier(0.34, 1.56, 0.64, 1) both; }
.ui-dzc__done .ui-dzc__glyph { width: 14px; height: 14px; }
.ui-dzc__meta { font-size: 12px; line-height: 16px; font-variant-numeric: tabular-nums; color: var(--ui-dzc-muted); animation: ui-dzc-in 240ms var(--ui-dzc-ease) both; }
.ui-dzc__dot { margin: 0 5px; color: var(--ui-dzc-faint); }
.ui-dzc__error { color: var(--ui-dzc-danger); overflow-wrap: anywhere; }
.ui-dzc__row[data-status="error"] .ui-dzc__row-inner { animation: ui-dzc-shake 380ms ease both; }

/* A thin 2px progress bar in the accent blue */
.ui-dzc__bar {
  position: relative;
  height: 2px;
  margin-top: 6px;
  margin-bottom: 2px;
  overflow: hidden;
  border-radius: 1px;
  background: var(--ui-dzc-track);
  transition: height 320ms var(--ui-dzc-ease) 250ms, margin 320ms var(--ui-dzc-ease) 250ms, opacity 200ms ease 200ms;
}
.ui-dzc__bar[data-hidden] { height: 0; margin-top: 0; margin-bottom: 0; opacity: 0; }
.ui-dzc__bar > span {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--ui-dzc-accent);
  transform-origin: left;
  transition: transform 200ms linear, background-color 200ms ease;
}
.ui-dzc__row[data-status="error"] .ui-dzc__bar > span { background: var(--ui-dzc-danger); }

/* Ghost icon buttons – the hover fill fades in and out quickly */
.ui-dzc__actions { display: flex; flex: none; gap: 2px; }
.ui-dzc__icon-btn { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 6px; color: var(--ui-dzc-icon); transition: background-color 120ms ease, color 120ms ease; }
.ui-dzc__icon-btn:hover { background: var(--ui-dzc-wash); color: var(--ui-dzc-ink); }
.ui-dzc__retry:active .ui-dzc__glyph { transform: rotate(120deg); transition: transform 300ms var(--ui-dzc-ease); }

/* The last row inside the card */
.ui-dzc__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: 44px;
  padding: 0 8px 0 16px;
  border-top: 0.5px solid var(--ui-dzc-line);
  font-size: 12px;
  line-height: 16px;
  font-variant-numeric: tabular-nums;
  color: var(--ui-dzc-muted);
}
.ui-dzc__foot > span { min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; animation: ui-dzc-in 240ms var(--ui-dzc-ease) both; }
.ui-dzc__summary { color: var(--ui-dzc-text); }
.ui-dzc__summary .ui-dzc__dot { color: var(--ui-dzc-faint); }
.ui-dzc__summary-done { display: inline-flex; align-items: center; gap: 6px; color: var(--ui-dzc-ink); }
.ui-dzc__ok { color: var(--ui-dzc-ok); }
.ui-dzc__warn { color: var(--ui-dzc-warn); }
.ui-dzc__summary-done .ui-dzc__glyph { width: 16px; height: 16px; }
/* Clear: the white button with the hairline shadow */
.ui-dzc__clear {
  flex: none;
  height: 28px;
  padding: 0 10px;
  border-radius: 6px;
  background: var(--ui-dzc-card);
  box-shadow: var(--ui-dzc-shadow);
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;
  color: var(--ui-dzc-strong);
  transition: background-color 120ms ease;
  animation: ui-dzc-in 240ms var(--ui-dzc-ease) both;
}
.ui-dzc__clear:hover { background: #fafafa; }
.ui-dzc__live { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }

/* Shimmer over the working text – a lighter band runs through it */
.ui-dzc__shimmer { position: relative; }
.ui-dzc__shimmer::after {
  content: attr(data-text);
  content: attr(data-text) / "";
  position: absolute;
  inset: 0;
  white-space: nowrap;
  color: transparent;
  background: linear-gradient(90deg, transparent 38%, var(--ui-dzc-shine) 50%, transparent 62%) 100% 0 / 300% 100% no-repeat;
  -webkit-background-clip: text;
  background-clip: text;
  animation: ui-dzc-sweep 1.6s linear infinite;
  pointer-events: none;
}

@keyframes ui-dzc-in { from { opacity: 0; transform: translateY(3px); } to { opacity: 1; transform: none; } }
@keyframes ui-dzc-grow { from { grid-template-rows: 0fr; opacity: 0; } to { grid-template-rows: 1fr; opacity: 1; } }
@keyframes ui-dzc-pop { 0% { transform: scale(0.4); } 60% { transform: scale(1.15); } 100% { transform: scale(1); } }
@keyframes ui-dzc-bob { 50% { transform: translateY(-3px); } }
@keyframes ui-dzc-flash { 0% { opacity: 0; } 35% { opacity: 1; } 100% { opacity: 0; } }
@keyframes ui-dzc-shake { 20%, 60% { transform: translateX(-3px); } 40%, 80% { transform: translateX(3px); } }
@keyframes ui-dzc-sweep { from { background-position: 100% 0; } to { background-position: 0% 0; } }

/* Narrow (phones) */
@container (max-width: 420px) {
  .ui-dzc__area { padding: 20px 12px 16px; }
  .ui-dzc__foot { padding-left: 12px; }
}
.ui-dzc__for-touch { display: none; }
/* Touch screens: bigger buttons, and a title that fits tapping */
@media (hover: none) and (pointer: coarse) {
  .ui-dzc__for-mouse { display: none; }
  .ui-dzc__for-touch { display: inline; }
  .ui-dzc__icon-btn { width: 36px; height: 36px; }
  .ui-dzc__foot { height: 52px; }
  .ui-dzc__clear { height: 34px; padding: 0 12px; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-dzc *, .ui-dzc *::before, .ui-dzc *::after { animation: none !important; transition: none !important; }
}

/* Dark mode: follows a .dark class or data-theme="dark" on any ancestor, e.g. <html> */
:where(.dark, [data-theme="dark"]) .ui-dzc {
  --ui-dzc-card: #1c1c1e;
  --ui-dzc-ink: rgba(255, 255, 255, 0.9);
  --ui-dzc-strong: #ffffff;
  --ui-dzc-text: rgba(255, 255, 255, 0.62);
  --ui-dzc-muted: rgba(255, 255, 255, 0.46);
  --ui-dzc-faint: rgba(255, 255, 255, 0.3);
  --ui-dzc-icon: rgba(255, 255, 255, 0.5);
  --ui-dzc-line: rgba(255, 255, 255, 0.08);
  --ui-dzc-dash: rgba(255, 255, 255, 0.16);
  --ui-dzc-dash-hover: rgba(255, 255, 255, 0.26);
  --ui-dzc-sheet-line: rgba(255, 255, 255, 0.2);
  --ui-dzc-track: rgba(255, 255, 255, 0.08);
  --ui-dzc-wash: rgba(255, 255, 255, 0.05);
  --ui-dzc-wash-big: rgba(255, 255, 255, 0.02);
  --ui-dzc-flash: rgba(255, 255, 255, 0.08);
  --ui-dzc-accent: #4d8dff;
  --ui-dzc-accent-soft: rgba(77, 141, 255, 0.07);
  --ui-dzc-ok: #3ec27a;
  --ui-dzc-danger: #ff6369;
  --ui-dzc-shine: rgba(255, 255, 255, 0.82);
  --ui-dzc-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.4);
  --ui-dzc-focus: rgba(77, 141, 255, 0.5);
}
:where(.dark, [data-theme="dark"]) .ui-dzc__clear:hover { background: #232326; }
`,Rc=["blue","violet","green","amber","gray"],jh=e=>Rc[[...e].reduce((t,n)=>(t*31+n.charCodeAt(0))%997,7)%Rc.length],zh=e=>{if(!e)return"";try{return new URL(e).hostname.replace(/^www\./,"")}catch{return e}},tn=new Intl.NumberFormat("en"),Nh=(...e)=>{for(const t of e){const n=t.match(/[\p{L}\p{N}]/u);if(n)return n[0].toUpperCase()}return""},Pc=e=>e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),Sh=new Set(["about","after","again","their","there","these","those","which","while","would","could","should","every","other","being","still","where","until","since","under","first","people","thing","things"]);function Ch(e,t,n){let i=null;if(t!=null&&t.length){const r=t.filter(o=>o.trim()).map(Pc);r.length&&(i=new RegExp(`(${r.join("|")})`,"gi"))}else{const r=[...new Set((n.toLowerCase().match(/[a-z0-9%]+/g)??[]).filter(o=>(o.length>=5||/\d/.test(o))&&!Sh.has(o)))];r.length&&(i=new RegExp(`\\b(${r.map(Pc).join("|")})\\b`,"gi"))}return i?e.split(i).map((r,o)=>o%2?a.jsx("mark",{children:r},o):r):e}function Eh({id:e,tone:t,children:n}){const i=_.useRef({id:e,tone:t,node:n}),[r,o]=_.useState(e),[s,c]=_.useState(null);return r!==e&&(o(e),c(i.current)),i.current={id:e,tone:t,node:n},_.useEffect(()=>{if(!s)return;const l=window.setTimeout(()=>c(null),260);return()=>window.clearTimeout(l)},[s]),a.jsxs("span",{className:"ui-cac__swap",children:[s&&a.jsx("span",{className:"ui-cac__swap-item","data-out":"","data-tone":s.tone,"aria-hidden":"true",children:s.node},`out-${s.id}`),a.jsx("span",{className:"ui-cac__swap-item","data-tone":t,children:n},e)]})}const Ti=({d:e})=>a.jsx("svg",{viewBox:"0 0 16 16",className:"ui-cac__icon","aria-hidden":"true",children:a.jsx("path",{d:e})}),Hn={close:"M4.75 4.75l6.5 6.5m0-6.5-6.5 6.5",out:"M6.5 4.5h5v5M11.25 4.75 4.5 11.5",copy:"M6.75 5.5h5c.69 0 1.25.56 1.25 1.25v5c0 .69-.56 1.25-1.25 1.25h-5c-.69 0-1.25-.56-1.25-1.25v-5c0-.69.56-1.25 1.25-1.25ZM10.5 3.5A1.25 1.25 0 0 0 9.25 3h-5C3.56 3 3 3.56 3 4.25v5c0 .54.34 1 .82 1.17",done:"M3.75 8.4 6.6 11.2 12.25 5",arrow:"M3.5 8h9M8.75 4.25 12.5 8l-3.75 3.75"};function Fr({source:e}){const[t,n]=_.useState(!1);return a.jsx("span",{className:"ui-cac__glyph","data-tone":jh(e.site),"aria-hidden":"true",onErrorCapture:()=>n(!0),children:e.icon&&!t?e.icon:Nh(e.site,e.title)})}const Lh=_.memo(function({seg:t,index:n,marks:i,state:r,lit:o,openHere:s,previewId:c,api:l}){const[,f,x,v]=t.text.match(/^(\s*)([\s\S]*?)(\s*)$/)??["","",t.text,""],g=i.length?Math.max(0,x.search(/\S+$/)):x.length,b=x.length-g>24?x.length:g,w=j=>a.jsx("button",{type:"button",className:"ui-cac__marker","data-source":j.id,"data-lit":o===j.id?"":void 0,"aria-expanded":s===j.id,"aria-controls":c,"aria-label":`Source ${j.n}: ${j.label}`,onPointerEnter:E=>E.pointerType==="mouse"&&l.current.setHot({source:j.id,segment:n}),onPointerLeave:E=>E.pointerType==="mouse"&&l.current.setHot(null),onFocus:()=>l.current.setHot({source:j.id,segment:n}),onBlur:()=>l.current.setHot(null),onClick:()=>l.current.toggle(j.id),children:tn.format(j.n)},j.id);return a.jsxs("span",{children:[f,a.jsxs("span",{className:"ui-cac__seg","data-hl":r==="hl"?"":void 0,"data-dim":r==="dim"?"":void 0,children:[x.slice(0,b),a.jsxs("span",{className:"ui-cac__keep",children:[x.slice(b),i.slice(0,1).map(w)]}),i.slice(1).map(w)]}),v]})}),Ki=4;function Mh({segments:e,sources:t,pagesRead:n,defaultOpen:i,onOpenSource:r,onPreviewChange:o,action:s,className:c}){const l=_.useId(),[f,x]=_.useState(null),[v,g]=_.useState(i&&t.some(M=>M.id===i)?i:null),b=_.useRef(v);v&&(b.current=v);const[w,j]=_.useState(null),E=_.useRef(null),p=_.useRef(null),[d,m]=_.useState(t.length),[y,R]=_.useState(!1),I=_.useMemo(()=>new Map(t.map((M,K)=>[M.id,K])),[t]),N=M=>(I.get(M)??-1)+1,T=M=>M!=null&&I.has(M)?t[I.get(M)]:null,H=M=>I.has(M),U=_.useMemo(()=>e.map(M=>[...new Set(M.cite??[])].filter(K=>I.has(K)).map(K=>{const oe=t[I.get(K)];return{id:K,n:I.get(K)+1,label:`${oe.site} – ${oe.title}`}})),[e,t,I]);_.useLayoutEffect(()=>{var at;const M=E.current,K=p.current;if(!M||!K)return;const oe=()=>{var ot;const Qe=[...K.querySelectorAll("[data-chip]")].map(ht=>ht.offsetWidth),Ce=((ot=K.querySelector("[data-more]"))==null?void 0:ot.offsetWidth)??36,Gt=M.clientWidth;if(Qe.reduce((ht,wi)=>ht+wi,0)+Ki*Math.max(0,Qe.length-1)<=Gt+.5)return m(Qe.length);let Mt=0,Le=0;for(;Le<Qe.length;Le++){const ht=Mt+(Le?Ki:0)+Qe[Le];if(ht+Ki+Ce>Gt)break;Mt=ht}m(Math.max(1,Le))};oe();const we=new ResizeObserver(oe);return we.observe(M),(at=document.fonts)==null||at.ready.then(oe).catch(()=>{}),()=>we.disconnect()},[t]);const S=y?t.length:Math.min(d,t.length),q=t.length-S,ne=[];e.forEach((M,K)=>{(M.paragraph||ne.length===0)&&ne.push([]),ne[ne.length-1].push({seg:M,index:K})});const ee=e.filter(M=>M.text.trim()).length,re=e.filter(M=>{var K;return M.text.trim()&&((K=M.cite)==null?void 0:K.some(H))}).length,pe=M=>e.filter(K=>{var oe;return(oe=K.cite)==null?void 0:oe.includes(M)}),A=M=>{const K=v===M?null:M;g(K),o==null||o(K)},$=_.useRef({setHot:x,toggle:A});$.current={setHot:x,toggle:A};const O=()=>{var K,oe;if(!v)return;const M=v;g(null),o==null||o(null),(oe=(K=E.current)==null?void 0:K.querySelector(`[data-source="${CSS.escape(M)}"]`))==null||oe.focus({preventScroll:!0})},Y=M=>{var oe;const K=`“${M.quote??M.title}” – ${M.title}, ${M.site}${M.url?` (${M.url})`:""}`;(oe=navigator.clipboard)==null||oe.writeText(K).catch(()=>{}),j({id:Date.now(),source:M.id})};_.useEffect(()=>{if(!w)return;const M=window.setTimeout(()=>j(null),1800);return()=>window.clearTimeout(M)},[w]);const G=M=>{M.key==="Escape"&&v&&(M.stopPropagation(),O())},te=M=>{var Qe,Ce;const K=[...((Qe=E.current)==null?void 0:Qe.querySelectorAll(".ui-cac__chip, .ui-cac__more"))??[]],oe=K.indexOf(M.currentTarget),we=K.length-1,at=M.key==="ArrowRight"?Math.min(we,oe+1):M.key==="ArrowLeft"?Math.max(0,oe-1):M.key==="Home"?0:M.key==="End"?we:null;at===null||oe<0||(M.preventDefault(),(Ce=K[at])==null||Ce.focus())},fe=(f==null?void 0:f.source)??null,le=(M,K)=>{var oe,we;if(f)return f.segment!==void 0?f.segment===K?"hl":void 0:(oe=M.cite)!=null&&oe.includes(f.source)?"hl":"dim";if(v&&((we=M.cite)!=null&&we.includes(v)))return"hl"},se=T(fe),C=T(v);let h=a.jsxs(a.Fragment,{children:[a.jsx("b",{children:tn.format(re)})," of ",tn.format(ee)," ",ee===1?"sentence":"sentences"," backed by a source"]}),L="rest",D;if(w)h="Quote copied",L=`copied-${w.id}`,D="ok";else if(se&&(f==null?void 0:f.segment)!==void 0)h=a.jsxs(a.Fragment,{children:[a.jsx("b",{children:se.site})," ",a.jsx("span",{className:"ui-cac__dot",children:"·"})," ",se.title]}),L=`mark-${f.segment}-${se.id}`;else if(se){const M=pe(se.id).length;h=M?a.jsxs(a.Fragment,{children:[a.jsx("b",{children:se.site})," ",a.jsx("span",{className:"ui-cac__dot",children:"·"})," cited in ",tn.format(M)," ",M===1?"sentence":"sentences"]}):a.jsxs(a.Fragment,{children:[a.jsx("b",{children:se.site})," ",a.jsx("span",{className:"ui-cac__dot",children:"·"})," read, not cited"]}),L=`src-${se.id}`}else C&&(h=a.jsxs(a.Fragment,{children:["Quote from ",a.jsx("b",{children:C.site})]}),L=`open-${C.id}`);const z=T(v??b.current),X=`${l}-preview`,ce=[`${tn.format(t.length)} ${t.length===1?"source":"sources"}`,Number.isFinite(n)?`${tn.format(n)} ${n===1?"page":"pages"} read`:null].filter(Boolean);return a.jsxs("div",{className:["ui-cac",c].filter(Boolean).join(" "),role:"group","aria-label":"Answer with sources","data-hot":f?f.segment!==void 0?"mark":"source":void 0,onKeyDown:G,children:[a.jsx("style",{href:"ui-cited-answer-clean",precedence:"default",children:$h}),a.jsxs("div",{className:"ui-cac__body",children:[a.jsxs("div",{className:"ui-cac__head",children:[a.jsx("span",{className:"ui-cac__stack","aria-hidden":"true",children:t.slice(0,3).map(M=>a.jsx(Fr,{source:M},M.id))}),a.jsx("span",{className:"ui-cac__meta",children:ce.map((M,K)=>a.jsxs("span",{children:[K>0&&a.jsx("span",{className:"ui-cac__dot",children:" · "}),M]},M))})]}),a.jsx("div",{className:"ui-cac__text",onPointerLeave:()=>x(null),children:ne.map((M,K)=>a.jsx("p",{className:"ui-cac__p",dir:"auto",children:M.map(({seg:oe,index:we})=>{const at=U[we],Qe=f&&(f.segment===we||f.segment===void 0&&at.some(Ce=>Ce.id===f.source))?f.source:void 0;return a.jsx(Lh,{seg:oe,index:we,marks:at,state:le(oe,we),lit:Qe,openHere:v&&at.some(Ce=>Ce.id===v)?v:null,previewId:X,api:$},we)})},K))}),a.jsxs("div",{className:"ui-cac__chips","data-all":y?"":void 0,ref:E,role:"list","aria-label":"Sources",onPointerLeave:()=>x(null),children:[t.slice(0,S).map((M,K)=>{const oe=fe===M.id;return a.jsx("span",{role:"listitem",className:"ui-cac__chip-item",children:a.jsxs("button",{type:"button",className:"ui-cac__chip","data-source":M.id,"data-lit":oe?"":void 0,"data-dim":fe&&!oe?"":void 0,"aria-expanded":v===M.id,"aria-controls":X,"aria-label":`Source ${K+1}: ${M.site} – ${M.title}`,onPointerEnter:we=>we.pointerType==="mouse"&&x({source:M.id}),onFocus:()=>x({source:M.id}),onBlur:()=>x(null),onKeyDown:te,onClick:()=>A(M.id),children:[a.jsx(Fr,{source:M}),a.jsx("span",{className:"ui-cac__chip-name",dir:"auto",title:M.site,children:M.site}),a.jsx("span",{className:"ui-cac__chip-num",children:tn.format(K+1)})]})},M.id)}),q>0&&a.jsx("span",{role:"listitem",className:"ui-cac__chip-item",children:a.jsxs("button",{type:"button",className:"ui-cac__more","aria-label":`Show ${q} more ${q===1?"source":"sources"}`,onKeyDown:te,onClick:()=>R(!0),children:["+",q]})})]}),a.jsxs("div",{className:"ui-cac__ruler",ref:p,"aria-hidden":"true",children:[t.map((M,K)=>a.jsxs("span",{className:"ui-cac__chip","data-chip":"",children:[a.jsx(Fr,{source:M}),a.jsx("span",{className:"ui-cac__chip-name",children:M.site}),a.jsx("span",{className:"ui-cac__chip-num",children:K+1})]},M.id)),a.jsxs("span",{className:"ui-cac__more","data-more":"",children:["+",t.length]})]}),a.jsx("div",{id:X,className:"ui-cac__fold","data-open":v?"":void 0,inert:!v,role:"region","aria-label":z?`Source ${N(z.id)}: ${z.site}`:"Source",children:a.jsx("div",{className:"ui-cac__clip",children:z&&a.jsxs("div",{className:"ui-cac__preview",children:[a.jsxs("div",{className:"ui-cac__pv-head",children:[a.jsx(Fr,{source:z}),a.jsxs("span",{className:"ui-cac__pv-meta",children:[a.jsx("span",{className:"ui-cac__pv-domain",title:z.url||z.site,children:zh(z.url)||z.site}),z.date&&a.jsxs("span",{className:"ui-cac__pv-date",children:[a.jsx("span",{className:"ui-cac__dot",children:" · "}),z.date]})]}),a.jsx("span",{className:"ui-cac__pv-num",children:tn.format(N(z.id))}),a.jsx("button",{type:"button",className:"ui-cac__close","aria-label":"Close source",onClick:O,children:a.jsx(Ti,{d:Hn.close})})]}),a.jsx("div",{className:"ui-cac__pv-title",dir:"auto",title:z.title,children:z.title}),z.quote&&a.jsx("blockquote",{className:"ui-cac__quote",dir:"auto",children:Ch(z.quote,z.highlight,pe(z.id).map(M=>M.text).join(" "))}),a.jsxs("div",{className:"ui-cac__pv-actions",children:[z.url?a.jsxs("a",{className:"ui-cac__btn ui-cac__btn--main",href:z.url,target:"_blank",rel:"noreferrer noopener",onClick:M=>{r&&(M.preventDefault(),r(z))},children:[a.jsx(Ti,{d:Hn.out}),"Open source"]}):r&&a.jsxs("button",{type:"button",className:"ui-cac__btn ui-cac__btn--main",onClick:()=>r(z),children:[a.jsx(Ti,{d:Hn.out}),"Open source"]}),z.quote&&a.jsxs("button",{type:"button",className:"ui-cac__btn","data-done":(w==null?void 0:w.source)===z.id?"":void 0,"aria-label":"Copy quote",onClick:()=>Y(z),children:[a.jsx("span",{className:"ui-cac__btn-icon",children:a.jsx(Ti,{d:(w==null?void 0:w.source)===z.id?Hn.done:Hn.copy})},(w==null?void 0:w.source)===z.id?"done":"idle"),a.jsx("span",{className:"ui-cac__btn-text",children:(w==null?void 0:w.source)===z.id?"Copied":"Copy quote"})]})]})]},z.id)})})]}),a.jsxs("div",{className:"ui-cac__foot",children:[a.jsx("span",{className:"ui-cac__caption","aria-live":"polite",children:a.jsx(Eh,{id:L,tone:D,children:h})}),s&&a.jsxs("button",{type:"button",className:"ui-cac__action",title:s.label,onClick:s.onClick,children:[a.jsx("span",{className:"ui-cac__action-label",children:s.label}),a.jsx(Ti,{d:Hn.arrow})]})]})]})}const $h=`
/* Colors and motion as variables – override them on .ui-cac */
.ui-cac {
  --ui-cac-card: #ffffff;
  --ui-cac-ink: rgba(0, 0, 0, 0.88);
  --ui-cac-strong: #000000;
  --ui-cac-text: rgba(0, 0, 0, 0.61);
  --ui-cac-muted: rgba(0, 0, 0, 0.45);
  --ui-cac-faint: rgba(0, 0, 0, 0.27);
  --ui-cac-icon: rgba(0, 0, 0, 0.447);
  --ui-cac-line: rgba(0, 0, 0, 0.06);
  --ui-cac-fill: rgba(0, 0, 0, 0.06);
  --ui-cac-fill-strong: rgba(0, 0, 0, 0.1);
  --ui-cac-wash: rgba(0, 0, 0, 0.03);
  --ui-cac-hl: rgba(0, 96, 226, 0.07);
  --ui-cac-mark: rgba(0, 96, 226, 0.1);
  --ui-cac-ok: #1a9a52;
  --ui-cac-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.06), 0 1px 1px -1px rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --ui-cac-focus: rgba(0, 96, 226, 0.35);
  --ui-cac-ease: cubic-bezier(0.22, 1, 0.36, 1);
  position: relative;
  box-sizing: border-box;
  width: 100%;
  max-width: 460px;
  min-width: 0;
  container-type: inline-size;
  border-radius: 10px;
  background: var(--ui-cac-card);
  box-shadow: var(--ui-cac-shadow);
  font-family: "Inter", "InterVariable", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  font-size: 13px;
  line-height: 20px;
  font-weight: 400;
  color: var(--ui-cac-ink);
  text-align: left;
  -webkit-font-smoothing: antialiased;
}
.ui-cac *, .ui-cac *::before, .ui-cac *::after { box-sizing: border-box; }
:where(.ui-cac) button { margin: 0; padding: 0; border: 0; background: none; font: inherit; color: inherit; text-align: inherit; cursor: pointer; -webkit-tap-highlight-color: transparent; }
.ui-cac :is(button, a):focus-visible { outline: 2px solid var(--ui-cac-focus); outline-offset: 1px; }
.ui-cac svg { display: block; flex: none; }
.ui-cac b { font-weight: 500; color: var(--ui-cac-ink); }
.ui-cac__dot { color: var(--ui-cac-faint); }
.ui-cac__icon { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.1; stroke-linecap: round; stroke-linejoin: round; }

/* Letter glyphs on a light tint – stand-ins for favicons */
.ui-cac [data-tone="blue"] { --ui-cac-g: #1f5fd1; --ui-cac-g-bg: rgba(0, 96, 226, 0.08); }
.ui-cac [data-tone="violet"] { --ui-cac-g: #6a4fd0; --ui-cac-g-bg: rgba(110, 86, 230, 0.09); }
.ui-cac [data-tone="green"] { --ui-cac-g: #1a8a4a; --ui-cac-g-bg: rgba(26, 154, 82, 0.09); }
.ui-cac [data-tone="amber"] { --ui-cac-g: #a46a06; --ui-cac-g-bg: rgba(232, 162, 12, 0.12); }
.ui-cac [data-tone="gray"] { --ui-cac-g: rgba(0, 0, 0, 0.55); --ui-cac-g-bg: rgba(0, 0, 0, 0.06); }
.ui-cac__glyph { display: grid; flex: none; place-items: center; width: 16px; height: 16px; overflow: hidden; border-radius: 4px; background: var(--ui-cac-g-bg); font-size: 9.5px; font-weight: 500; line-height: 1; color: var(--ui-cac-g); }
.ui-cac__glyph > :is(img, svg) { width: 100%; height: 100%; object-fit: cover; }

/* Everything above the last row */
.ui-cac__body { padding: 16px 20px 16px; }

/* ----- Head ----- */
.ui-cac__head { display: flex; align-items: center; gap: 8px; height: 16px; }
.ui-cac__stack { display: flex; flex: none; }
.ui-cac__stack .ui-cac__glyph { box-shadow: 0 0 0 1.5px var(--ui-cac-card); }
.ui-cac__stack .ui-cac__glyph + .ui-cac__glyph { margin-left: -4px; }
.ui-cac__meta { min-width: 0; overflow: hidden; font-size: 12px; line-height: 16px; color: var(--ui-cac-muted); white-space: nowrap; text-overflow: ellipsis; font-variant-numeric: tabular-nums; }

/* ----- Answer ----- */
.ui-cac__text { margin-top: 12px; color: var(--ui-cac-ink); }
.ui-cac__p { margin: 0; overflow-wrap: anywhere; white-space: pre-line; text-align: start; font-size: 13px; line-height: 22px; }
.ui-cac__p + .ui-cac__p { margin-top: 10px; }
.ui-cac__seg { margin: 0 -2px; padding: 2px 2px; border-radius: 4px; -webkit-box-decoration-break: clone; box-decoration-break: clone; transition: background-color 200ms ease, color 200ms ease; }
.ui-cac__seg[data-hl] { background: var(--ui-cac-hl); color: var(--ui-cac-strong); }
.ui-cac__seg[data-dim] { color: var(--ui-cac-faint); }

.ui-cac__keep { white-space: nowrap; }
/* Every marker that isn't lit fades back while something is pointed at */
.ui-cac[data-hot] .ui-cac__marker:not([data-lit]):not([aria-expanded="true"]) { opacity: 0.5; }
/* Citation markers: the gray tab look; the linked one gets a touch darker */
.ui-cac__marker { position: relative; display: inline-grid; place-items: center; min-width: 16px; height: 16px; margin-left: 3px; padding: 0 4px; border-radius: 4px; background: var(--ui-cac-fill); box-shadow: inset 0 0 0 0.5px var(--ui-cac-line); font-size: 10px; font-weight: 500; line-height: 16px; color: var(--ui-cac-text); vertical-align: 1px; font-variant-numeric: tabular-nums; transition: background-color 160ms ease, color 160ms ease, opacity 200ms ease; }
.ui-cac__marker + .ui-cac__marker { margin-left: 2px; }
.ui-cac__marker::after { content: ""; position: absolute; inset: -4px -2px; }
.ui-cac__marker:hover, .ui-cac__marker[data-lit], .ui-cac__marker[aria-expanded="true"] { background: var(--ui-cac-fill-strong); color: var(--ui-cac-ink); }

/* ----- Sources: one row of tab chips ----- */
.ui-cac__chips { display: flex; gap: ${Ki}px; margin-top: 16px; min-width: 0; }
.ui-cac__chips[data-all] { flex-wrap: wrap; }
.ui-cac__chip-item { display: flex; flex: none; min-width: 0; max-width: 100%; }
.ui-cac__chip-item:only-child, .ui-cac__chips:not([data-all]) .ui-cac__chip-item:first-child:nth-last-child(2) { flex: 0 1 auto; }
.ui-cac__chip { display: inline-flex; align-items: center; gap: 6px; min-width: 0; max-width: 100%; height: 28px; padding: 0 8px 0 6px; border-radius: 6px; box-shadow: inset 0 0 0 0.5px var(--ui-cac-line); font-size: 12px; font-weight: 500; line-height: 16px; color: var(--ui-cac-text); white-space: nowrap; transition: background-color 140ms ease, color 140ms ease, opacity 200ms ease; }
.ui-cac__chip:hover, .ui-cac__chip[data-lit] { background: var(--ui-cac-wash); color: var(--ui-cac-ink); }
.ui-cac__chip[aria-expanded="true"] { background: var(--ui-cac-fill); color: var(--ui-cac-ink); }
.ui-cac__chip[data-dim]:not([aria-expanded="true"]) { opacity: 0.5; }
.ui-cac__chip-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.ui-cac__chip-num { flex: none; margin-left: -1px; font-size: 11px; font-weight: 400; color: var(--ui-cac-faint); font-variant-numeric: tabular-nums; }
.ui-cac__more { display: inline-grid; flex: none; place-items: center; height: 28px; padding: 0 8px; border-radius: 6px; box-shadow: inset 0 0 0 0.5px var(--ui-cac-line); font-size: 12px; font-weight: 500; line-height: 16px; color: var(--ui-cac-text); font-variant-numeric: tabular-nums; transition: background-color 140ms ease, color 140ms ease; }
.ui-cac__more:hover { background: var(--ui-cac-wash); color: var(--ui-cac-ink); }
.ui-cac__ruler { position: absolute; top: 0; left: 0; display: flex; gap: ${Ki}px; height: 0; overflow: hidden; visibility: hidden; pointer-events: none; }
.ui-cac__ruler > * { flex: none; }

/* ----- Preview: unfolds in place, nothing travels ----- */
.ui-cac__fold { display: grid; grid-template-rows: 0fr; opacity: 0; transition: grid-template-rows 420ms var(--ui-cac-ease), opacity 220ms ease; }
.ui-cac__fold[data-open] { grid-template-rows: 1fr; opacity: 1; transition: grid-template-rows 420ms var(--ui-cac-ease), opacity 320ms ease 80ms; }
/* A few pixels of room so the preview's shadow isn't cut off */
.ui-cac__clip { min-height: 0; overflow: hidden; margin: 0 -4px -4px; padding: 0 4px 4px; }
.ui-cac__preview { margin-top: 12px; padding: 10px 12px 12px; border-radius: 8px; background: var(--ui-cac-card); box-shadow: var(--ui-cac-shadow); animation: ui-cac-swap-in 320ms ease both; }
.ui-cac__pv-head { display: flex; align-items: center; gap: 8px; height: 24px; }
.ui-cac__pv-date { flex: none; white-space: pre; }
.ui-cac__pv-meta { display: flex; flex: 1; min-width: 0; overflow: hidden; font-size: 12px; line-height: 16px; color: var(--ui-cac-muted); white-space: nowrap; text-overflow: ellipsis; }
.ui-cac__pv-domain { min-width: 0; overflow: hidden; text-overflow: ellipsis; color: var(--ui-cac-text); }
.ui-cac__pv-num { display: grid; flex: none; place-items: center; min-width: 16px; height: 16px; padding: 0 4px; border-radius: 4px; background: var(--ui-cac-fill); font-size: 10px; font-weight: 500; line-height: 16px; color: var(--ui-cac-text); font-variant-numeric: tabular-nums; }
.ui-cac__close { display: grid; flex: none; place-items: center; width: 24px; height: 24px; margin-right: -6px; border-radius: 6px; color: var(--ui-cac-icon); transition: background-color 140ms ease, color 140ms ease; }
.ui-cac__close:hover { background: var(--ui-cac-wash); color: var(--ui-cac-ink); }
.ui-cac__pv-title { display: -webkit-box; overflow-wrap: anywhere; text-align: start; margin-top: 6px; overflow: hidden; font-size: 13px; font-weight: 500; line-height: 20px; color: var(--ui-cac-strong); -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.ui-cac__quote { margin: 8px 0 0; max-height: 200px; overflow: auto; overscroll-behavior: contain; overflow-wrap: anywhere; white-space: pre-line; text-align: start; padding: 0 0 0 10px; border-left: 2px solid var(--ui-cac-fill); font-size: 12px; line-height: 20px; color: var(--ui-cac-text); }
.ui-cac__quote mark { margin: 0 -1px; padding: 1px 1px; border-radius: 3px; background: var(--ui-cac-mark); color: var(--ui-cac-ink); -webkit-box-decoration-break: clone; box-decoration-break: clone; }
.ui-cac__pv-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 12px; }
/* Copy quote: a ghost button; Open source: the white secondary button */
.ui-cac__btn { display: inline-flex; align-items: center; gap: 6px; height: 28px; padding: 0 10px 0 8px; border-radius: 6px; font-size: 13px; font-weight: 500; line-height: 20px; color: var(--ui-cac-text); text-decoration: none; white-space: nowrap; transition: background-color 140ms ease, color 140ms ease; }
.ui-cac__btn .ui-cac__icon { color: var(--ui-cac-icon); transition: color 140ms ease, transform 220ms var(--ui-cac-ease); }
.ui-cac__btn:hover { background: var(--ui-cac-wash); color: var(--ui-cac-ink); }
.ui-cac__btn:hover .ui-cac__icon { color: var(--ui-cac-ink); }
.ui-cac__btn--main { background: var(--ui-cac-card); box-shadow: var(--ui-cac-shadow); color: var(--ui-cac-strong); }
.ui-cac__btn--main:hover { background: #fafafa; color: var(--ui-cac-strong); }
.ui-cac__btn--main:hover .ui-cac__icon { transform: translate(1px, -1px); }
.ui-cac__btn[data-done], .ui-cac__btn[data-done] .ui-cac__icon { color: var(--ui-cac-ok); }
.ui-cac__btn-icon { display: grid; place-items: center; width: 16px; height: 16px; animation: ui-cac-swap-in 280ms ease both; }

/* ----- The last row ----- */
.ui-cac__foot { display: flex; align-items: center; gap: 12px; height: 44px; padding: 0 8px 0 20px; border-top: 0.5px solid var(--ui-cac-line); }
.ui-cac__foot:not(:has(.ui-cac__action)) { padding-right: 20px; }
.ui-cac__caption { flex: 1; min-width: 0; overflow: hidden; font-size: 12px; line-height: 16px; color: var(--ui-cac-muted); white-space: nowrap; text-overflow: ellipsis; font-variant-numeric: tabular-nums; }
.ui-cac__swap { display: grid; min-width: 0; }
.ui-cac__swap-item { grid-area: 1 / 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; animation: ui-cac-swap-in 320ms ease both; }
.ui-cac__swap-item[data-out] { animation: ui-cac-swap-out 220ms ease both; }
.ui-cac__swap-item[data-tone="ok"] { color: var(--ui-cac-ok); }
/* Follow up: the white secondary button */
.ui-cac__action { display: inline-flex; flex: 0 1 auto; min-width: 0; max-width: 60%; align-items: center; gap: 6px; height: 28px; padding: 0 8px 0 10px; border-radius: 6px; background: var(--ui-cac-card); box-shadow: var(--ui-cac-shadow); font-size: 13px; font-weight: 500; line-height: 20px; color: var(--ui-cac-strong); white-space: nowrap; transition: background-color 140ms ease; }
.ui-cac__action .ui-cac__icon { color: var(--ui-cac-icon); transition: transform 220ms var(--ui-cac-ease), color 140ms ease; }
.ui-cac__action-label { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.ui-cac__action:hover { background: #fafafa; }
.ui-cac__action:hover .ui-cac__icon { color: var(--ui-cac-ink); transform: translateX(2px); }

@keyframes ui-cac-swap-in { from { opacity: 0; filter: blur(2px); } }
@keyframes ui-cac-swap-out { from { opacity: 1; } to { opacity: 0; filter: blur(2px); } }

/* Narrow cards: tighter padding, the preview drops its number tag, Copy quote keeps only its icon */
@container (max-width: 400px) {
  .ui-cac__body { padding: 14px 16px 16px; }
  .ui-cac__foot { padding-left: 16px; }
}
@container (max-width: 360px) {
  .ui-cac__pv-num { display: none; }
}
@container (max-width: 280px) {
  .ui-cac__btn-text { display: none; }
}

@media (pointer: coarse) {
  .ui-cac__marker::after { inset: -8px -5px; }
  .ui-cac__chip, .ui-cac__more { height: 34px; }
  .ui-cac__btn { height: 34px; }
  .ui-cac__close { width: 32px; height: 32px; margin-right: -8px; }
  .ui-cac__action { height: 34px; }
  .ui-cac__foot { height: 52px; }
}

@media (prefers-reduced-motion: reduce) {
  .ui-cac *, .ui-cac *::before, .ui-cac *::after { animation: none !important; transition: none !important; }
}

/* Dark mode: follows a .dark class or data-theme="dark" on any ancestor, e.g. <html> */
:where(.dark, [data-theme="dark"]) .ui-cac {
  --ui-cac-card: #1c1c1e;
  --ui-cac-ink: rgba(255, 255, 255, 0.9);
  --ui-cac-strong: #ffffff;
  --ui-cac-text: rgba(255, 255, 255, 0.62);
  --ui-cac-muted: rgba(255, 255, 255, 0.46);
  --ui-cac-faint: rgba(255, 255, 255, 0.3);
  --ui-cac-icon: rgba(255, 255, 255, 0.5);
  --ui-cac-line: rgba(255, 255, 255, 0.08);
  --ui-cac-fill: rgba(255, 255, 255, 0.08);
  --ui-cac-fill-strong: rgba(255, 255, 255, 0.14);
  --ui-cac-wash: rgba(255, 255, 255, 0.04);
  --ui-cac-hl: rgba(77, 141, 255, 0.14);
  --ui-cac-mark: rgba(77, 141, 255, 0.24);
  --ui-cac-ok: #3ec27a;
  --ui-cac-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.4);
  --ui-cac-focus: rgba(77, 141, 255, 0.5);
}
:where(.dark, [data-theme="dark"]) .ui-cac__btn--main:hover,
:where(.dark, [data-theme="dark"]) .ui-cac__action:hover { background: #232326; }
:where(.dark, [data-theme="dark"]) .ui-cac [data-tone="blue"] { --ui-cac-g: #9bbcff; --ui-cac-g-bg: rgba(77, 141, 255, 0.16); }
:where(.dark, [data-theme="dark"]) .ui-cac [data-tone="violet"] { --ui-cac-g: #c3b4ff; --ui-cac-g-bg: rgba(124, 92, 255, 0.18); }
:where(.dark, [data-theme="dark"]) .ui-cac [data-tone="green"] { --ui-cac-g: #6ee7a8; --ui-cac-g-bg: rgba(34, 160, 90, 0.16); }
:where(.dark, [data-theme="dark"]) .ui-cac [data-tone="amber"] { --ui-cac-g: #f5c264; --ui-cac-g-bg: rgba(240, 160, 32, 0.16); }
:where(.dark, [data-theme="dark"]) .ui-cac [data-tone="gray"] { --ui-cac-g: rgba(255, 255, 255, 0.62); --ui-cac-g-bg: rgba(255, 255, 255, 0.08); }
`,Th=e=>e instanceof Date?e.getTime():typeof e=="number"?e:typeof e=="string"?Date.parse(e):NaN,Ih=(e,t)=>{if(!Number.isFinite(e)||!Number.isFinite(t))return"";const n=Math.max(0,Math.round((t-e)/1e3));return n<5?"now":n<60?`${n}s`:n<3600?`${Math.floor(n/60)}m`:n<86400?`${Math.floor(n/3600)}h`:`${Math.floor(n/86400)}d`},Ac=e=>typeof Intl.Segmenter=="function"?Array.from(new Intl.Segmenter().segment(e),t=>t.segment):Array.from(e),Rh=e=>{const t=e.trim().split(/\s+/).filter(Boolean),n=t.filter(i=>/^[\p{L}\p{N}]/u.test(i));return n.length?(n.length>1?[n[0],n[n.length-1]]:n).map(i=>Ac(i)[0]).join("").toUpperCase():t.length?Ac(t[0])[0]:""},Fc=e=>typeof e=="number"&&Number.isFinite(e)?Math.max(0,Math.floor(e)):0,st=new Intl.NumberFormat("en"),Dr=e=>e>999?"999+":st.format(e),Ph=e=>e==="critical"||e==="warning"?e:"note",Ah={critical:"Critical",warning:"Warning",note:"Note"},Dc=e=>{const t=new Map;return(Array.isArray(e)?e:[]).filter(n=>!!n&&typeof n=="object").map(n=>{const i=String(n.id??""),r=t.get(i)??0;return t.set(i,r+1),{x:n,id:i,key:r?`${i}#${r}`:i}})},wf=40,bo=({severity:e})=>{const t=e==="critical"?[1,1,1,.6]:e==="warning"?[1,.6,.6,.3]:[.6,.3,.3,.3];return a.jsx("svg",{className:"ui-afc__mark","data-severity":e,width:"10",height:"10",viewBox:"0 0 10 10","aria-hidden":"true",children:[[0,0],[5.5,0],[0,5.5],[5.5,5.5]].map(([n,i],r)=>a.jsx("rect",{x:n,y:i,width:"4.5",height:"4.5",rx:"1",fill:"currentColor",opacity:t[r]},r))})},Fh=()=>a.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 14 14","aria-hidden":"true",children:[a.jsx("path",{d:"M7 1.2c.4 2.9 1.9 4.4 4.8 4.8-2.9.4-4.4 1.9-4.8 4.8C6.6 7.9 5.1 6.4 2.2 6 5.1 5.6 6.6 4.1 7 1.2Z",fill:"currentColor"}),a.jsx("circle",{cx:"11.6",cy:"11.4",r:"1.1",fill:"currentColor",opacity:"0.55"})]});function Dh({text:e}){return a.jsx("span",{className:"ui-afc__step",dir:"auto",title:e,children:e},e)}function Oh({avatar:e,name:t}){const[n,i]=_.useState(!1),r=e!=null&&e!==!1&&!n;return a.jsx("span",{className:"ui-afc__avatar","data-logo":r?"":void 0,onErrorCapture:()=>i(!0),children:r?e:Rh(t)})}function Bh({agents:e,findings:t,title:n="Verification",rows:i=4,now:r,onOpen:o,className:s}){const[c,l]=_.useState(()=>Date.now()),[f,x]=_.useState(null);_.useEffect(()=>{if(r!==void 0)return;const S=window.setInterval(()=>l(Date.now()),5e3);return()=>window.clearInterval(S)},[r]);const v=r??c,g=typeof i=="number"&&Number.isFinite(i)&&i>=1?Math.floor(i):4,b=Dc(e).map(({x:S,id:q,key:ne})=>{const ee=Fc(S.total),re=S.status==="running"||S.status==="done"||S.status==="failed"?S.status:void 0;return{...S,id:q,key:ne,name:String(S.name??"").trim()||q||"Agent",total:ee,done:Math.min(Fc(S.done),ee),status:re}}),w=Dc(t).map(({x:S,id:q,key:ne})=>({...S,id:q,key:ne,src:S,agentId:String(S.agentId??""),title:String(S.title??""),severity:Ph(S.severity),at:Th(S.at)})),j=b.reduce((S,q)=>S+q.done,0),E=b.reduce((S,q)=>S+q.total,0),p=(S,q)=>w.filter(ne=>ne.severity===S&&(!q||ne.agentId===q)).length,d=p("critical"),m=p("warning"),y=Math.max(0,...b.map(S=>`${st.format(S.done)}/${st.format(S.total)}`.length)),R=Math.max(1,...b.map(S=>Math.max(Dr(p("critical",S.id)).length,Dr(p("warning",S.id)).length))),I=S=>b.find(q=>q.id===S),N=f?I(f):void 0,T=N?f:null,H=S=>Number.isFinite(S.at)?S.at:-1/0,U=w.filter(S=>!T||S.agentId===T).sort((S,q)=>H(S)===H(q)?0:H(q)>H(S)?1:-1).slice(0,g+1);return a.jsxs("div",{className:["ui-afc",s].filter(Boolean).join(" "),style:{"--ui-afc-rows":g,"--ui-afc-count-w":`${y}ch`,"--ui-afc-found-w":`calc(38px + ${R*2}ch)`},children:[a.jsx("style",{href:"ui-agent-findings-clean",precedence:"default",children:Hh}),a.jsxs("div",{className:"ui-afc__card",children:[a.jsxs("header",{className:"ui-afc__bar",children:[a.jsx("span",{className:"ui-afc__spark",children:a.jsx(Fh,{})}),a.jsx("span",{className:"ui-afc__title",title:n,children:n}),a.jsx("span",{className:"ui-afc__progress",children:E>0&&`${st.format(j)} of ${st.format(E)} ${E===1?"check":"checks"}`}),a.jsxs("span",{className:"ui-afc__totals","aria-label":`${st.format(d)} critical, ${st.format(m)} ${m===1?"warning":"warnings"}`,children:[a.jsxs("span",{"data-severity":"critical","data-zero":d===0||void 0,children:[a.jsx("b",{children:st.format(d)},d)," critical"]}),a.jsxs("span",{"data-severity":"warning","data-zero":m===0||void 0,children:[a.jsx("b",{children:st.format(m)},m)," ",m===1?"warning":"warnings"]})]})]}),a.jsxs("ul",{className:"ui-afc__agents","aria-label":"Agents",children:[b.length===0&&a.jsx("li",{className:"ui-afc__none",children:"No agents yet"}),b.map(S=>{const q=S.status??(S.done>=S.total?"done":"running"),ne=S.total?Math.min(100,S.done/S.total*100):0,ee=p("critical",S.id),re=p("warning",S.id),pe=T===S.id,A=q==="done"?"All checks done":q==="failed"?"Stopped":S.step;return a.jsx("li",{children:a.jsxs("button",{type:"button",className:"ui-afc__agent","data-status":q,"aria-pressed":pe,"data-dim":T&&!pe?"":void 0,title:S.model?`${S.name} · ${S.model}`:S.name,onClick:()=>x(pe?null:S.id),children:[a.jsx(Oh,{avatar:S.avatar,name:S.name}),a.jsxs("span",{className:"ui-afc__who",children:[a.jsx("span",{className:"ui-afc__name",dir:"auto",children:S.name}),a.jsx(Dh,{text:A})]}),a.jsx("span",{className:"ui-afc__track","aria-hidden":"true",children:a.jsx("span",{className:"ui-afc__fill",style:{width:`${ne}%`}})}),a.jsxs("span",{className:"ui-afc__count",children:[st.format(S.done),"/",st.format(S.total)]}),a.jsxs("span",{className:"ui-afc__found","aria-label":`${st.format(ee)} critical, ${st.format(re)} ${re===1?"warning":"warnings"}`,children:[a.jsxs("span",{"data-severity":"critical","data-zero":ee===0||void 0,children:[a.jsx(bo,{severity:"critical"}),a.jsx("b",{children:Dr(ee)},ee)]}),a.jsxs("span",{"data-severity":"warning","data-zero":re===0||void 0,children:[a.jsx(bo,{severity:"warning"}),a.jsx("b",{children:Dr(re)},re)]})]})]})},S.key)})]}),a.jsxs("div",{className:"ui-afc__feed-head",children:[a.jsx("span",{className:"ui-afc__label",children:"Latest findings"}),N&&a.jsxs("button",{type:"button",className:"ui-afc__chip",onClick:()=>x(null),"aria-label":`Show all agents (now only ${N.name})`,title:N.name,children:[a.jsx("span",{className:"ui-afc__chip-name",children:N.name}),a.jsx("svg",{width:"10",height:"10",viewBox:"0 0 10 10","aria-hidden":"true",children:a.jsx("path",{d:"M2.5 2.5l5 5M7.5 2.5l-5 5",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round"})})]})]}),a.jsxs("ol",{className:"ui-afc__feed","aria-live":"polite",style:{"--ui-afc-shown":Math.max(1,Math.min(U.length,g))},children:[U.length===0&&a.jsx("li",{className:"ui-afc__empty",children:"Nothing found yet"}),U.map((S,q)=>{var re;const ne=(re=I(S.agentId))==null?void 0:re.name,ee=S.location?String(S.location):"";return a.jsx("li",{className:"ui-afc__slot",style:{transform:`translateY(${q*wf}px)`},"data-out":q>=g||void 0,"aria-hidden":q>=g||void 0,children:a.jsx("button",{type:"button",className:"ui-afc__finding",tabIndex:q>=g?-1:0,onClick:()=>o==null?void 0:o(S.src),children:a.jsxs("span",{className:"ui-afc__in",children:[a.jsx(bo,{severity:S.severity}),a.jsxs("span",{className:"ui-afc__sr",children:[Ah[S.severity],": "]}),a.jsx("span",{className:"ui-afc__ftitle",dir:"auto",title:S.title,children:S.title}),a.jsxs("span",{className:"ui-afc__meta",title:[ne,ee].filter(Boolean).join(" · ")||void 0,children:[ne&&a.jsx("span",{className:"ui-afc__who-name",children:ne}),ne&&ee&&a.jsx("span",{className:"ui-afc__dot",children:"·"}),ee&&a.jsx("code",{children:ee})]}),a.jsx("span",{className:"ui-afc__time",children:Ih(S.at,v)})]})})},S.key)})]})]})]})}const Hh=`
/* Colors and motion as variables – override them on .ui-afc */
.ui-afc {
  --ui-afc-card: #ffffff;
  --ui-afc-strong: #000000;
  --ui-afc-ink: rgba(0, 0, 0, 0.88);
  --ui-afc-text: rgba(0, 0, 0, 0.61);
  --ui-afc-muted: rgba(0, 0, 0, 0.45);
  --ui-afc-faint: rgba(0, 0, 0, 0.27);
  --ui-afc-line: rgba(0, 0, 0, 0.06);
  --ui-afc-fill: rgba(0, 0, 0, 0.06);
  --ui-afc-hover: rgba(0, 0, 0, 0.025);
  --ui-afc-select: rgba(0, 0, 0, 0.04);
  /* Bars after Trace Waterfall: a light tint with a hairline edge, ink for text */
  --ui-afc-run-bg: rgba(0, 96, 226, 0.1);
  --ui-afc-run-edge: rgba(0, 96, 226, 0.32);
  --ui-afc-done-bg: rgba(0, 0, 0, 0.05);
  --ui-afc-done-edge: rgba(0, 0, 0, 0.1);
  --ui-afc-fail-bg: #f52b0018;
  --ui-afc-fail-edge: rgba(215, 36, 0, 0.34);
  --ui-afc-crit: #d72400;
  --ui-afc-warn: #cc4e00;
  --ui-afc-note: rgba(0, 96, 226, 0.8);
  --ui-afc-focus: rgba(0, 96, 226, 0.35);
  --ui-afc-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.06), 0 1px 1px -1px rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --ui-afc-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --ui-afc-row: ${wf}px;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  max-width: 640px;
  container-type: inline-size;
  font-family: "Inter", "InterVariable", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  color: var(--ui-afc-text);
  text-align: left;
  -webkit-font-smoothing: antialiased;
}
.ui-afc *, .ui-afc *::before, .ui-afc *::after { box-sizing: border-box; }
:where(.ui-afc) button { margin: 0; padding: 0; border: 0; background: none; font: inherit; color: inherit; text-align: inherit; cursor: pointer; -webkit-tap-highlight-color: transparent; }
.ui-afc button:focus-visible { outline: 2px solid var(--ui-afc-focus); outline-offset: -2px; }
.ui-afc :is(ul, ol) { margin: 0; padding: 0; list-style: none; }
.ui-afc svg { display: block; flex: none; }
.ui-afc b { font-weight: 500; }
.ui-afc__sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }

.ui-afc__card { border-radius: 10px; background: var(--ui-afc-card); box-shadow: var(--ui-afc-shadow); overflow: hidden; }

/* ----- Bar ----- */
.ui-afc__bar { display: flex; align-items: center; gap: 10px; min-width: 0; padding: 14px 16px; border-bottom: 0.5px solid var(--ui-afc-line); }
.ui-afc__spark { display: grid; flex: none; place-items: center; width: 16px; color: rgba(0, 96, 226, 0.765); }
/* A long title shortens with … – the totals stay */
.ui-afc__title { font-weight: 500; color: var(--ui-afc-strong); white-space: nowrap; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.ui-afc__progress { flex: 1 0 auto; min-width: 0; overflow: hidden; font-size: 12px; line-height: 16px; color: var(--ui-afc-muted); white-space: nowrap; text-overflow: ellipsis; font-variant-numeric: tabular-nums; }
.ui-afc__totals { display: flex; flex: none; gap: 12px; font-size: 12px; line-height: 16px; white-space: nowrap; }
.ui-afc__totals > span { display: inline-flex; align-items: center; gap: 6px; transition: color 300ms ease; }
.ui-afc__totals > span::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.ui-afc__totals [data-severity="critical"] { color: var(--ui-afc-crit); }
.ui-afc__totals [data-severity="warning"] { color: var(--ui-afc-warn); }
.ui-afc__totals [data-zero] { color: var(--ui-afc-faint); }
.ui-afc__totals b, .ui-afc__found b { display: inline-block; font-variant-numeric: tabular-nums; animation: ui-afc-roll 420ms var(--ui-afc-ease); }

/* ----- Agents: one fixed row each ----- */
.ui-afc__agents { padding: 6px 6px 2px; }
.ui-afc__agent {
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr) 128px max(40px, var(--ui-afc-count-w)) max(60px, var(--ui-afc-found-w));
  align-items: center;
  gap: 12px;
  width: 100%;
  height: 48px;
  padding: 0 10px;
  border-radius: 8px;
  transition: background-color 160ms ease, opacity 220ms ease;
}
.ui-afc__agent:hover { background: var(--ui-afc-hover); }
.ui-afc__agent[aria-pressed="true"] { background: var(--ui-afc-select); }
.ui-afc__agent[data-dim] { opacity: 0.5; }
.ui-afc__agent[data-dim]:hover { opacity: 0.8; }
.ui-afc__avatar { display: grid; place-items: center; width: 24px; height: 24px; overflow: hidden; border-radius: 6px; background: var(--ui-afc-fill); font-size: 10px; font-weight: 500; letter-spacing: 0.3px; color: var(--ui-afc-text); }
.ui-afc__avatar[data-logo] { background: var(--ui-afc-card); box-shadow: var(--ui-afc-shadow); }
.ui-afc__avatar > svg { width: 14px; height: 14px; }
/* An image fills the tile, whatever its shape */
.ui-afc__avatar > img { display: block; width: 100%; height: 100%; object-fit: cover; }
.ui-afc__who { display: grid; min-width: 0; }
.ui-afc__name { overflow: hidden; font-weight: 500; line-height: 18px; color: var(--ui-afc-ink); white-space: nowrap; text-overflow: ellipsis; }
.ui-afc__step { overflow: hidden; font-size: 12px; line-height: 16px; color: var(--ui-afc-muted); white-space: nowrap; text-overflow: ellipsis; animation: ui-afc-swap 360ms var(--ui-afc-ease); }

/* Progress: a tinted bar with a hairline edge; while running a sheen sweeps over it and its front edge glows */
.ui-afc__track { position: relative; height: 6px; border-radius: 3px; background: var(--ui-afc-fill); overflow: hidden; }
.ui-afc__fill {
  position: absolute;
  inset: 0 auto 0 0;
  overflow: hidden;
  border-radius: 3px;
  background: var(--ui-afc-done-bg);
  box-shadow: inset 0 0 0 0.5px var(--ui-afc-done-edge);
  transition: width 700ms var(--ui-afc-ease), background-color 300ms ease;
}
.ui-afc__agent[data-status="running"] .ui-afc__fill { background: var(--ui-afc-run-bg); box-shadow: inset 0 0 0 0.5px var(--ui-afc-run-edge); }
.ui-afc__agent[data-status="failed"] .ui-afc__fill { background: var(--ui-afc-fail-bg); box-shadow: inset 0 0 0 0.5px var(--ui-afc-fail-edge); }
.ui-afc__agent[data-status="running"] .ui-afc__fill::before {
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  width: 40px;
  background: linear-gradient(90deg, transparent, var(--ui-afc-card), transparent);
  opacity: 0.7;
  animation: ui-afc-sheen 1500ms linear infinite;
}
.ui-afc__agent[data-status="running"] .ui-afc__fill::after {
  content: "";
  position: absolute;
  inset: 0 0 0 auto;
  width: 18px;
  background: linear-gradient(90deg, transparent, var(--ui-afc-run-edge));
  animation: ui-afc-breathe 1100ms ease-in-out infinite alternate;
}
.ui-afc__count { font-size: 12px; line-height: 16px; color: var(--ui-afc-muted); text-align: right; font-variant-numeric: tabular-nums; }
.ui-afc__found { display: flex; justify-content: flex-end; gap: 10px; font-size: 12px; line-height: 16px; }
.ui-afc__found > span { display: inline-flex; align-items: center; gap: 4px; min-width: 22px; }
.ui-afc__found [data-zero] { opacity: 0.28; }
.ui-afc__found [data-zero] .ui-afc__mark { color: var(--ui-afc-faint); }
.ui-afc__found [data-severity="critical"] b { color: var(--ui-afc-crit); }
.ui-afc__found [data-severity="warning"] b { color: var(--ui-afc-warn); }
.ui-afc__found [data-zero] b { color: var(--ui-afc-muted); }

.ui-afc__mark[data-severity="critical"] { color: var(--ui-afc-crit); }
.ui-afc__mark[data-severity="warning"] { color: var(--ui-afc-warn); }
.ui-afc__mark[data-severity="note"] { color: var(--ui-afc-note); }

/* ----- Feed: a fixed number of rows; new findings slide in on top ----- */
.ui-afc__feed-head { display: flex; align-items: center; gap: 8px; height: 40px; margin-top: 4px; padding: 0 16px; border-top: 0.5px solid var(--ui-afc-line); }
.ui-afc__label { font-size: 10px; font-weight: 500; line-height: 16px; letter-spacing: 0.5px; text-transform: uppercase; color: var(--ui-afc-muted); }
.ui-afc__chip { display: inline-flex; align-items: center; gap: 4px; height: 20px; padding: 0 6px 0 8px; border-radius: 6px; background: var(--ui-afc-fill); font-size: 12px; font-weight: 500; line-height: 16px; color: var(--ui-afc-ink); animation: ui-afc-swap 260ms var(--ui-afc-ease); }
.ui-afc__chip { max-width: 60%; }
.ui-afc__chip-name { min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.ui-afc__chip svg { color: var(--ui-afc-muted); }
.ui-afc__feed { position: relative; height: calc(var(--ui-afc-shown, var(--ui-afc-rows)) * var(--ui-afc-row) + 8px); transition: height 520ms var(--ui-afc-ease); margin: 0 6px; padding-bottom: 8px; overflow: hidden; }
.ui-afc__slot { position: absolute; top: 0; right: 0; left: 0; height: var(--ui-afc-row); transition: transform 520ms var(--ui-afc-ease), opacity 320ms ease; }
.ui-afc__slot[data-out] { opacity: 0; pointer-events: none; }
.ui-afc__finding { display: block; width: 100%; height: 100%; border-radius: 8px; transition: background-color 160ms ease; }
.ui-afc__finding:hover { background: var(--ui-afc-hover); }
.ui-afc__in { display: flex; align-items: center; gap: 10px; height: 100%; min-width: 0; padding: 0 10px; animation: ui-afc-in 560ms var(--ui-afc-ease); }
.ui-afc__ftitle { flex: 0 1 auto; min-width: 0; overflow: hidden; color: var(--ui-afc-ink); white-space: nowrap; text-overflow: ellipsis; }
.ui-afc__meta { display: flex; flex: 1 1 0; align-items: center; gap: 6px; min-width: 0; overflow: hidden; font-size: 12px; line-height: 16px; color: var(--ui-afc-muted); white-space: nowrap; }
.ui-afc__meta code { overflow: hidden; font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: 11.5px; text-overflow: ellipsis; }
.ui-afc__who-name { flex: 0 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.ui-afc__meta code { flex: 0 1 auto; min-width: 0; }
.ui-afc__dot { color: var(--ui-afc-faint); }
.ui-afc__time { flex: none; min-width: 28px; font-size: 12px; line-height: 16px; color: var(--ui-afc-faint); text-align: right; font-variant-numeric: tabular-nums; }
.ui-afc__none { display: grid; place-items: center; height: 48px; font-size: 12px; color: var(--ui-afc-muted); }
.ui-afc__empty { display: grid; place-items: center; height: var(--ui-afc-row); font-size: 12px; color: var(--ui-afc-muted); }

@keyframes ui-afc-in { from { opacity: 0; transform: translateY(-10px); filter: blur(2px); } }
@keyframes ui-afc-swap { from { opacity: 0; transform: translateY(3px); } }
@keyframes ui-afc-roll { from { opacity: 0; transform: translateY(-5px); } }
@keyframes ui-afc-sheen { from { transform: translateX(-40px); } to { transform: translateX(160px); } }
@keyframes ui-afc-breathe { from { opacity: 0.45; } to { opacity: 1; } }

/* Narrow: the step count goes, the bar gets shorter */
@container (max-width: 480px) {
  .ui-afc__agent { grid-template-columns: 24px minmax(0, 1fr) 64px max(52px, var(--ui-afc-found-w)); gap: 10px; }
  .ui-afc__count { display: none; }
  .ui-afc__progress { display: none; }
  .ui-afc__meta { display: none; }
  .ui-afc__ftitle { flex: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-afc *, .ui-afc *::before, .ui-afc *::after { animation: none !important; transition: none !important; }
}

/* Dark mode: follows a .dark class or data-theme="dark" on any ancestor, e.g. <html> */
:where(.dark, [data-theme="dark"]) .ui-afc {
  --ui-afc-card: #1c1c1f;
  --ui-afc-strong: #ffffff;
  --ui-afc-ink: rgba(255, 255, 255, 0.9);
  --ui-afc-text: rgba(255, 255, 255, 0.62);
  --ui-afc-muted: rgba(255, 255, 255, 0.45);
  --ui-afc-faint: rgba(255, 255, 255, 0.28);
  --ui-afc-line: rgba(255, 255, 255, 0.08);
  --ui-afc-fill: rgba(255, 255, 255, 0.08);
  --ui-afc-hover: rgba(255, 255, 255, 0.04);
  --ui-afc-select: rgba(255, 255, 255, 0.06);
  --ui-afc-run-bg: rgba(112, 184, 255, 0.18);
  --ui-afc-run-edge: rgba(112, 184, 255, 0.5);
  --ui-afc-done-bg: rgba(255, 255, 255, 0.08);
  --ui-afc-done-edge: rgba(255, 255, 255, 0.14);
  --ui-afc-fail-bg: #ff35232b;
  --ui-afc-fail-edge: rgba(255, 151, 125, 0.45);
  --ui-afc-crit: #ff977d;
  --ui-afc-warn: #ffa057;
  --ui-afc-note: #70b8ff;
  --ui-afc-focus: rgba(91, 154, 255, 0.45);
  --ui-afc-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.4);
}
:where(.dark, [data-theme="dark"]) .ui-afc__spark { color: #70b8ff; }
:where(.dark, [data-theme="dark"]) .ui-afc__agent[data-status="running"] .ui-afc__fill::before { background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.14), transparent); }
`,Wh=e=>{const t=Math.max(0,Math.round(e/1e3));if(t<10)return"just now";if(t<60)return`${t}s ago`;const n=Math.floor(t/60);if(n<60)return`${n}m ago`;const i=Math.floor(n/60);return i<24?`${i}h ago`:`${Math.floor(i/24)}d ago`},Uh=(e,t)=>{const n=t-e;if(n>-6e4&&n<30*864e5)return Wh(n);const i=new Date(e).getFullYear()===new Date(t).getFullYear();return new Intl.DateTimeFormat("en",{month:"short",day:"numeric",year:i?void 0:"numeric"}).format(e)},Vh=e=>{var t;return(((t=e.match(/[\p{L}\p{N}]/u))==null?void 0:t[0])??"·").toUpperCase()},Yh=e=>{const t=new Map;for(const n of e)for(const i of n.dependsOn??[])t.set(i,[...t.get(i)??[],n]);return t},Oc=(e,t)=>{const n=[],i=new Set([e]),r=[e];for(let o=0;o<r.length;o++)for(const s of t.get(r[o])??[])i.has(s.id)||(i.add(s.id),n.push(s),r.push(s.id));return n},Qh=()=>a.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none","aria-hidden":"true",children:[a.jsx("rect",{x:"2",y:"1.8",width:"12",height:"12.4",rx:"2.6",stroke:"currentColor",strokeWidth:"1.3"}),a.jsx("path",{d:"M5 5.4h6M5 8h6M5 10.6h3.6",stroke:"currentColor",strokeWidth:"1.3",strokeLinecap:"round"})]}),Zh=()=>a.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[a.jsx("path",{d:"M4 7H15C18.3137 7 21 9.68629 21 13C21 16.3137 18.3137 19 15 19H8",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"1.8"}),a.jsx("path",{d:"M8 3L4 7L8 11",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"1.8"})]}),qh=()=>a.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[a.jsx("path",{d:"M20 7H9C5.68629 7 3 9.68629 3 13C3 16.3137 5.68629 19 9 19H16",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"1.8"}),a.jsx("path",{d:"M16 3L20 7L16 11",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"1.8"})]}),Kh=()=>a.jsxs("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[a.jsx("path",{d:"M4.26781 18.8447C4.49269 20.515 5.87613 21.8235 7.55966 21.9009C8.97627 21.966 10.4153 22 12 22C13.5847 22 15.0237 21.966 16.4403 21.9009C18.1239 21.8235 19.5073 20.515 19.7322 18.8447C19.879 17.7547 20 16.6376 20 15.5C20 14.3624 19.879 13.2453 19.7322 12.1553C19.5073 10.485 18.1239 9.17649 16.4403 9.09909C15.0237 9.03397 13.5847 9 12 9C10.4153 9 8.97627 9.03397 7.55966 9.09909C5.87613 9.17649 4.49269 10.485 4.26781 12.1553C4.12104 13.2453 4 14.3624 4 15.5C4 16.6376 4.12104 17.7547 4.26781 18.8447Z",stroke:"currentColor",strokeWidth:"1.8"}),a.jsx("path",{d:"M7.5 9V6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5V9",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"1.8"})]});function Gh({entries:e,agent:t,now:n,undone:i,defaultUndone:r=[],onUndo:o,onRedo:s,pointAt:c=null,title:l="Ledger",className:f}){const x=_.useId(),v=_.useRef(null);v.current===null&&(v.current=new Set(e.map(A=>A.id)));const[g,b]=_.useState(r),w=new Set(i??g),[j,E]=_.useState(null),[p,d]=_.useState({}),m=_.useRef(i??[]);_.useEffect(()=>{if(!i)return;const A=i.filter($=>!m.current.includes($));m.current=i,A.length&&d(Object.fromEntries(A.map(($,O)=>[$,O])))},[i]);const[y,R]=_.useState(()=>Date.now());_.useEffect(()=>{if(n!==void 0)return;const A=window.setInterval(()=>R(Date.now()),15e3);return()=>window.clearInterval(A)},[n]);const I=n??y,N=[...e].sort((A,$)=>$.at-A.at),T=_.useMemo(()=>Yh(e),[e]),H=A=>Oc(A,T).filter($=>!w.has($.id)),U=j??c,S=U?H(U):[],q=new Map(S.map(A=>[A.id,A.reversible!==!1?"also":"kept"])),ne=A=>{const $=[A.id,...H(A.id).filter(O=>O.reversible!==!1).map(O=>O.id)];d(Object.fromEntries($.map((O,Y)=>[O,Y]))),b(O=>[...O,...$.filter(Y=>!O.includes(Y))]),E(null),o==null||o($)},ee=A=>{const $=[A.id,...Oc(A.id,T).filter(O=>w.has(O.id)).map(O=>O.id)];d({}),b(O=>O.filter(Y=>!$.includes(Y))),s==null||s($)},re=e.length,pe=e.filter(A=>w.has(A.id)).length;return a.jsxs("div",{className:["ui-alc",f].filter(Boolean).join(" "),children:[a.jsx("style",{href:"ui-agent-ledger-clean",precedence:"default",children:Xh}),a.jsxs("header",{className:"ui-alc__bar",children:[a.jsx("span",{className:"ui-alc__mark",children:a.jsx(Qh,{})}),a.jsx("span",{className:"ui-alc__title",id:x,children:l}),t&&a.jsx("span",{className:"ui-alc__agent",children:t}),a.jsxs("span",{className:"ui-alc__sum",children:[a.jsxs("span",{children:[a.jsx("b",{children:re.toLocaleString("en-US")})," ",re===1?"change":"changes"]}),pe>0&&a.jsxs("span",{className:"ui-alc__sum-undone",children:[a.jsx("b",{children:pe.toLocaleString("en-US")})," undone"]})]})]}),a.jsx("ol",{className:"ui-alc__panel","aria-labelledby":x,children:N.map(A=>{var fe;const $=w.has(A.id),O=q.get(A.id),Y=A.reversible===!1,G=$||Y?0:H(A.id).length,te=A.change&&(A.change[0].trim()||A.change[1].trim())?A.change:void 0;return a.jsxs("li",{className:"ui-alc__row","data-undone":$?"":void 0,"data-initial":(fe=v.current)!=null&&fe.has(A.id)?"":void 0,"data-preview":U===A.id?"":void 0,"data-chain":O,style:{"--o":p[A.id]??0},children:[a.jsx("span",{className:"ui-alc__icon","aria-hidden":"true",children:A.icon??Vh(A.system)}),a.jsxs("div",{className:"ui-alc__main",children:[a.jsxs("span",{className:"ui-alc__what",title:A.target?`${A.action} ${A.target}`:A.action,children:[a.jsx("span",{className:"ui-alc__action",dir:"auto",children:A.action}),A.target&&a.jsx("span",{className:"ui-alc__target",dir:"auto",children:A.target}),a.jsx("span",{className:"ui-alc__strike","aria-hidden":"true"})]}),a.jsx("span",{className:"ui-alc__change",title:te?`${te[0]} → ${te[1]}`:A.detail,children:te?a.jsxs(a.Fragment,{children:[a.jsx("span",{className:"ui-alc__before",dir:"auto",children:te[0]}),a.jsx("span",{className:"ui-alc__arrow","aria-label":"to",children:"→"}),a.jsx("span",{className:"ui-alc__after",dir:"auto",children:te[1]})]}):a.jsx("span",{className:"ui-alc__detail",dir:"auto",children:A.detail})})]}),a.jsx("div",{className:"ui-alc__end",children:O?a.jsx("span",{className:"ui-alc__flag","data-kind":O,children:O==="also"?"Also undone":a.jsxs(a.Fragment,{children:[a.jsx(Kh,{}),"Can't undo"]})}):a.jsxs(a.Fragment,{children:[a.jsx("span",{className:"ui-alc__time","data-hide":$||!Y?"":void 0,children:$?"Undone":a.jsxs(a.Fragment,{children:[Uh(A.at,I),a.jsxs("span",{className:"ui-alc__sys",children:[" · ",A.system]})]})}),$?a.jsxs("button",{type:"button",className:"ui-alc__act",onClick:()=>ee(A),"aria-label":`Redo: ${A.action}${A.target?` ${A.target}`:""}`,children:[a.jsx(qh,{}),a.jsx("span",{className:"ui-alc__act-label",children:"Redo"})]}):Y?null:a.jsxs("button",{type:"button",className:"ui-alc__act",onMouseEnter:()=>E(A.id),onMouseLeave:()=>E(le=>le===A.id?null:le),onFocus:()=>E(A.id),onBlur:()=>E(le=>le===A.id?null:le),onClick:()=>ne(A),"aria-label":`Undo: ${A.action}${A.target?` ${A.target}`:""}${G?` – and ${G} that build on it`:""}`,children:[a.jsx(Zh,{}),a.jsx("span",{className:"ui-alc__act-label",children:"Undo"})]})]})})]},A.id)})})]})}const Xh=`
/* Colors, sizes and motion as variables – override them on .ui-alc */
.ui-alc {
  --ui-alc-panel: #ffffff;
  --ui-alc-card: #ffffff;
  --ui-alc-strong: #000000;
  --ui-alc-ink: rgba(0, 0, 0, 0.88);
  --ui-alc-text: rgba(0, 0, 0, 0.61);
  --ui-alc-muted: rgba(0, 0, 0, 0.45);
  --ui-alc-faint: rgba(0, 0, 0, 0.27);
  --ui-alc-line: rgba(0, 0, 0, 0.06);
  --ui-alc-fill: rgba(0, 0, 0, 0.06);
  --ui-alc-accent: rgba(0, 96, 226, 0.765);
  --ui-alc-focus: rgba(0, 96, 226, 0.35);
  --ui-alc-undo-bg: rgba(0, 96, 226, 0.06);
  --ui-alc-also-bg: rgba(0, 96, 226, 0.045);
  --ui-alc-also-fg: #0058cf;
  --ui-alc-kept-bg: #ff9c0014;
  --ui-alc-kept-fg: #cc4e00;
  --ui-alc-ok-fg: #007d2ee0;
  --ui-alc-strike: rgba(0, 0, 0, 0.45);
  /* Strokes are shadows: a 0.5px hairline plus a soft lift */
  --ui-alc-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.06), 0 1px 1px -1px rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --ui-alc-ease: cubic-bezier(0.32, 0.72, 0.24, 1);
  --ui-alc-row: 56px;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  container: ui-alc / inline-size;
  font-family: "Inter", "InterVariable", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  color: var(--ui-alc-text);
  text-align: left;
  -webkit-font-smoothing: antialiased;
}
.ui-alc *, .ui-alc *::before, .ui-alc *::after { box-sizing: border-box; }
:where(.ui-alc) button { margin: 0; padding: 0; border: 0; background: none; font: inherit; color: inherit; text-align: inherit; cursor: pointer; -webkit-tap-highlight-color: transparent; }
.ui-alc button:focus-visible { outline: 2px solid var(--ui-alc-focus); outline-offset: 1px; }
.ui-alc svg { display: block; flex: none; }

/* ----- The bar: whose changes, how many ----- */
.ui-alc__bar { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; min-width: 0; margin-bottom: 16px; }
.ui-alc__mark { display: grid; flex: none; place-items: center; width: 16px; color: var(--ui-alc-accent); }
.ui-alc__title { min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-weight: 500; color: var(--ui-alc-strong); }
.ui-alc__agent { min-width: 0; overflow: hidden; color: var(--ui-alc-muted); white-space: nowrap; text-overflow: ellipsis; }
.ui-alc__sum { display: flex; align-items: center; gap: 14px; margin-left: auto; font-size: 12px; line-height: 16px; color: var(--ui-alc-muted); font-variant-numeric: tabular-nums; white-space: nowrap; }
.ui-alc__sum b { font-weight: 500; color: var(--ui-alc-ink); }
.ui-alc__sum-undone { animation: ui-alc-fade 240ms ease both; }

/* ----- The white panel: one row per change, newest first ----- */
.ui-alc__panel { display: grid; margin: 0; padding: 4px; overflow: hidden; border-radius: 10px; background: var(--ui-alc-panel); box-shadow: var(--ui-alc-shadow); list-style: none; }
.ui-alc__row { position: relative; display: grid; grid-template-columns: 28px minmax(0, 1fr) auto; align-items: center; column-gap: 12px; height: var(--ui-alc-row); padding: 9px 12px 9px 10px; border-radius: 7px; transition: background-color 200ms ease; animation: ui-alc-grow 520ms var(--ui-alc-ease) backwards; }
/* A new change opens its row – the panel grows smoothly instead of jumping – and then fades in */
.ui-alc__row > * { animation: ui-alc-in 420ms var(--ui-alc-ease) 140ms backwards; }
.ui-alc__row[data-initial], .ui-alc__row[data-initial] > * { animation: none; }
.ui-alc__row + .ui-alc__row::before { content: ""; position: absolute; top: -0.25px; right: 12px; left: 50px; height: 0.5px; background: var(--ui-alc-line); }
.ui-alc__row:hover { background: rgba(0, 0, 0, 0.015); }
/* Pointing at Undo: this row and every change built on it light up */
.ui-alc__row[data-preview] { background: var(--ui-alc-undo-bg); }
.ui-alc__row[data-chain="also"] { background: var(--ui-alc-also-bg); }
.ui-alc__row[data-chain="kept"] { background: var(--ui-alc-kept-bg); }
.ui-alc__row:is([data-preview], [data-chain]) + .ui-alc__row::before, .ui-alc__row:is([data-preview], [data-chain])::before { opacity: 0; }

.ui-alc__icon { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 7px; background: var(--ui-alc-card); box-shadow: var(--ui-alc-shadow); font-size: 12px; font-weight: 500; color: var(--ui-alc-text); transition: opacity 300ms ease, filter 300ms ease; }
.ui-alc__icon > svg { width: 14px; height: 14px; }

/* Two lines: what was done to what – then before → after */
.ui-alc__main { position: relative; display: grid; min-width: 0; }
.ui-alc__what { position: relative; display: flex; align-items: baseline; gap: 6px; justify-self: start; min-width: 0; max-width: 100%; white-space: nowrap; }
/* The target gives way first, then the action – both end in "…", the full line is in the tooltip */
.ui-alc__action { flex: 0 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; font-weight: 500; color: var(--ui-alc-ink); transition: color 300ms ease; }
.ui-alc__target { flex: 0 100 auto; min-width: 0; overflow: hidden; color: var(--ui-alc-text); text-overflow: ellipsis; transition: color 300ms ease; }
.ui-alc__change { display: flex; align-items: baseline; gap: 6px; min-width: 0; overflow: hidden; font-size: 12px; line-height: 17px; color: var(--ui-alc-muted); white-space: nowrap; text-overflow: ellipsis; }
/* Before gives way, the new value stays readable */
.ui-alc__before { flex: 0 100 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; text-decoration: line-through; text-decoration-color: var(--ui-alc-faint); }
.ui-alc__arrow { flex: none; color: var(--ui-alc-faint); }
.ui-alc__detail { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.ui-alc__after { flex: 0 1 auto; min-width: 0; overflow: hidden; color: var(--ui-alc-text); text-overflow: ellipsis; }

/* Undone: a line draws across the text, a beat after each other down the chain, and the row goes quiet */
.ui-alc__strike { position: absolute; top: 50%; left: -2px; width: calc(100% + 4px); height: 1px; border-radius: 1px; background: var(--ui-alc-strike); transform: scaleX(0); transform-origin: left; pointer-events: none; transition: transform 380ms var(--ui-alc-ease) calc(var(--o, 0) * 110ms); }
.ui-alc__row[data-undone] .ui-alc__strike { transform: scaleX(1); }
.ui-alc__row[data-undone] :is(.ui-alc__action, .ui-alc__target, .ui-alc__after) { color: var(--ui-alc-muted); transition-delay: calc(var(--o, 0) * 110ms); }
.ui-alc__row[data-undone] .ui-alc__icon { opacity: 0.5; filter: grayscale(1); transition-delay: calc(var(--o, 0) * 110ms); }

/* On the right: one slot – the time, or Undo / Redo on hover, or what an undo does to this row */
.ui-alc__end { position: relative; display: grid; justify-items: end; align-items: center; min-width: 108px; height: 24px; }
/* The time only shows – the buttons in the same slot sit on top and get every click */
.ui-alc__time { grid-area: 1 / 1; pointer-events: none; font-size: 12px; line-height: 16px; color: var(--ui-alc-muted); white-space: nowrap; font-variant-numeric: tabular-nums; transition: opacity 140ms ease; }
.ui-alc__row[data-undone] .ui-alc__time { color: var(--ui-alc-faint); }
.ui-alc__act { position: relative; z-index: 1; grid-area: 1 / 1; display: inline-flex; align-items: center; gap: 5px; height: 24px; margin-right: -6px; padding: 0 7px; border-radius: 6px; font-size: 12px; font-weight: 500; color: var(--ui-alc-ink); white-space: nowrap; opacity: 0; transition: opacity 140ms ease, background-color 140ms ease; }
.ui-alc__row:is(:hover, :focus-within) .ui-alc__time[data-hide] { opacity: 0; }
.ui-alc__row:is(:hover, :focus-within, [data-preview]) .ui-alc__act { opacity: 1; }
.ui-alc__row[data-preview] .ui-alc__time[data-hide] { opacity: 0; }
.ui-alc__row[data-preview] .ui-alc__act { background: rgba(0, 96, 226, 0.09); color: var(--ui-alc-also-fg); }
.ui-alc__act:hover { background: var(--ui-alc-fill); }
.ui-alc__flag { grid-area: 1 / 1; display: inline-flex; align-items: center; gap: 4px; height: 20px; padding: 0 7px; border-radius: 5px; font-size: 11.5px; font-weight: 500; line-height: 20px; white-space: nowrap; animation: ui-alc-fade 160ms ease both; }
.ui-alc__flag[data-kind="also"] { background: rgba(0, 96, 226, 0.09); color: var(--ui-alc-also-fg); }
.ui-alc__flag[data-kind="kept"] { background: #ff9c0026; color: var(--ui-alc-kept-fg); }

/* ----- Narrow: smaller gaps, the system's name drops from the time ----- */
@container ui-alc (max-width: 480px) {
  .ui-alc__sum { flex-basis: 100%; justify-content: space-between; margin-left: 0; }
  .ui-alc__row { column-gap: 10px; padding: 9px 8px 9px 8px; }
  .ui-alc__row + .ui-alc__row::before { left: 46px; right: 8px; }
  .ui-alc__end { min-width: 64px; }
  /* The logo already says where – the time stands alone */
  .ui-alc__sys { display: none; }
  /* Undo and Redo shrink to their icon – the label stays for screen readers */
  .ui-alc__act { width: 28px; justify-content: center; padding: 0; }
  .ui-alc__act-label { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
}
/* Touch screens can't point: Undo and Redo show on every row, in place of the time */
@media (hover: none) {
  .ui-alc__act { opacity: 1; }
  .ui-alc__time[data-hide] { opacity: 0; }
}

@keyframes ui-alc-grow { from { height: 0; padding-top: 0; padding-bottom: 0; } }
@keyframes ui-alc-in { from { opacity: 0; transform: translateY(-4px); } }
@keyframes ui-alc-fade { from { opacity: 0; } }

@media (prefers-reduced-motion: reduce) {
  .ui-alc *, .ui-alc *::before, .ui-alc *::after { animation: none !important; transition: none !important; }
}

/* Dark mode: follows a .dark class or data-theme="dark" on any ancestor, e.g. <html> */
:where(.dark, [data-theme="dark"]) .ui-alc {
  --ui-alc-panel: #1c1c1f;
  --ui-alc-card: #232326;
  --ui-alc-strong: #ffffff;
  --ui-alc-ink: rgba(255, 255, 255, 0.9);
  --ui-alc-text: rgba(255, 255, 255, 0.62);
  --ui-alc-muted: rgba(255, 255, 255, 0.45);
  --ui-alc-faint: rgba(255, 255, 255, 0.28);
  --ui-alc-line: rgba(255, 255, 255, 0.08);
  --ui-alc-fill: rgba(255, 255, 255, 0.08);
  --ui-alc-accent: #5b9aff;
  --ui-alc-focus: rgba(91, 154, 255, 0.45);
  --ui-alc-undo-bg: rgba(91, 154, 255, 0.1);
  --ui-alc-also-bg: rgba(91, 154, 255, 0.07);
  --ui-alc-also-fg: #8ab8ff;
  --ui-alc-kept-bg: rgba(255, 160, 40, 0.09);
  --ui-alc-kept-fg: #ffb357;
  --ui-alc-ok-fg: #3dd68c;
  --ui-alc-strike: rgba(255, 255, 255, 0.5);
  --ui-alc-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.4);
}
`,Va=(...e)=>e.filter(Boolean).join(" "),Bc=e=>!!e&&Object.values(e).some(Boolean),Di=e=>e==null?"":String(e),Ii=e=>e.toLocaleString("en-US"),Jh=e=>e.replace(new RegExp("\\p{Lu}\\p{Ll}+","gu"),t=>t.toLowerCase()),eg=()=>typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;function Hc(e){!e||eg()||!e.animate||e.animate([{transform:"none"},{transform:"translateX(-4px)"},{transform:"translateX(4px)"},{transform:"translateX(-2px)"},{transform:"none"}],{duration:340,easing:"ease-out"})}function Wc(e,t,n){if(!e||!t)return;const i=e.querySelector(n);if(!i||!i.offsetWidth){t.style.opacity="0";return}const r=!t.dataset.ready;r&&(t.style.transition="none"),t.style.opacity="1",t.style.width=`${i.offsetWidth}px`,t.style.height=`${i.offsetHeight}px`,t.style.transform=`translate(${i.offsetLeft}px, ${i.offsetTop}px)`,r&&(t.dataset.ready="1",t.offsetWidth,t.style.transition="")}const tg=({d:e,className:t})=>a.jsx("svg",{viewBox:"0 0 24 24",className:Va("ui-sfc__glyph",t),"aria-hidden":"true",children:a.jsx("path",{d:e})}),yf={check:"M5.5 12.5l4 4L18.5 8",back:"M14.5 6l-6 6 6 6"},bf=({className:e})=>a.jsx("svg",{viewBox:"0 0 24 24",className:Va("ui-sfc__draw",e),"aria-hidden":"true",children:a.jsx("path",{d:yf.check,pathLength:1})}),kf=_.createContext({errors:{},shake:0,report:()=>{}}),jf=_.createContext(null);function zf({steps:e,initialValues:t,onComplete:n,initialStep:i=0,step:r,onStepChange:o,submitLabel:s="Finish",submittingLabel:c="Creating…",success:l,className:f}){var Xt,Ft;const x=e.length,v=B=>Number.isFinite(B)?Math.max(0,Math.min(Math.max(x-1,0),Math.trunc(B))):0,[g,b]=_.useState(i),w=v(r??g),[j,E]=_.useState(t),p=_.useRef(j),[d,m]=_.useState(w),y=Math.max(d,w),[R,I]=_.useState({}),[N,T]=_.useState(0),[H,U]=_.useState(null),[S,q]=_.useState(!1),[ne,ee]=_.useState(""),[re,pe]=_.useState(!1),[A,$]=_.useState(""),O=_.useRef(null),Y=_.useRef(null),G=_.useRef(null),te=_.useRef(null),fe=_.useRef(!1),le=_.useRef(!1),se=_.useRef({}),C=_.useCallback((B,Q)=>{se.current={...se.current,[B]:Q??void 0}},[]),h=_.useId(),L=re?x:w,[D,z]=_.useState({index:L,from:null,dir:1});D.index!==L&&z({index:L,from:D.index,dir:L>D.index?1:-1}),_.useEffect(()=>{if(D.from===null)return;const B=window.setTimeout(()=>z(Q=>({...Q,from:null})),420);return()=>clearTimeout(B)},[D.index,D.from]);const X=_.useCallback(B=>{p.current={...p.current,...B},E(p.current)},[]),ce=B=>{const Q=Math.max(0,Math.min(x-1,B));Q!==w&&(fe.current=!0,le.current=!0,se.current={},r===void 0&&b(Q),o==null||o(Q),m(he=>Math.max(he,Q)),ee(""),$(`Step ${Ii(Q+1)} of ${Ii(x)}: ${Di(e[Q].title)}`))},M=()=>{var Q,he;const B={...se.current,...(he=(Q=e[w]).validate)==null?void 0:he.call(Q,p.current)};return Bc(B)?(I(Re=>({...Re,[w]:!0})),T(Re=>Re+1),$(Object.values(B).find(Boolean)??"Check this step"),!1):(I(Re=>({...Re,[w]:!1})),!0)},K=async B=>{if(B==null||B.preventDefault(),!(S||re||!M())){if(w<x-1){H!==null&&H>w?(U(null),ce(H)):ce(w+1);return}q(!0),ee("");try{await(n==null?void 0:n(p.current)),fe.current=!0,le.current=!0,pe(!0),$("All done")}catch(Q){const he=Q instanceof Error&&Q.message?Q.message:"Something went wrong – try again";ee(he),$(he)}finally{q(!1)}}},oe=()=>{U(null),ce(w-1)},we=B=>{B<0||B>=x||B===w||B>w&&!M()||(U(B<w?w:null),ce(B))},at=B=>we(e.findIndex(Q=>Q.id===B)),Qe=()=>{p.current=t,E(t),I({}),U(null),m(v(i)),pe(!1),ee(""),fe.current=!0,le.current=!0,se.current={},r===void 0&&b(v(i)),o==null||o(v(i))};if(_.useEffect(()=>{var he,Re;if(!fe.current)return;fe.current=!1;const B=(he=Y.current)==null?void 0:he.querySelector('[data-pane="current"]');(Re=(B==null?void 0:B.querySelector('input:not([type="hidden"]):not(:disabled), textarea, select'))??(B==null?void 0:B.querySelector(".ui-sfc__heading")))==null||Re.focus({preventScroll:!0})},[L]),_.useEffect(()=>{var B,Q;N&&((Q=(B=Y.current)==null?void 0:B.querySelector('[data-pane="current"] [aria-invalid="true"]'))==null||Q.focus({preventScroll:!0}))},[N]),_.useLayoutEffect(()=>{const B=Y.current,Q=B==null?void 0:B.querySelector('[data-pane="current"]');if(!B||!Q)return;const he=!B.dataset.ready,Re=()=>B.style.height=`${Q.offsetHeight}px`;he&&(B.style.transition="none"),Re(),he&&(B.dataset.ready="1",B.offsetWidth,B.style.transition="");const $t=new ResizeObserver(Re);return $t.observe(Q),()=>$t.disconnect()},[L]),_.useLayoutEffect(()=>{const B=G.current,Q=te.current;if(!B||!Q)return;const he=()=>B.style.width=`${Q.offsetWidth}px`;he();const Re=new ResizeObserver(he);return Re.observe(Q),()=>Re.disconnect()},[]),!x)return null;const Ce=e[w],Gt=R[w]?((Xt=Ce.validate)==null?void 0:Xt.call(Ce,j))??{}:{},ye=!Bc((Ft=Ce.validate)==null?void 0:Ft.call(Ce,j)),Mt=w===x-1,Le=S?c:Mt?s:H!==null&&H>w?`Back to ${Jh(Di(e[H].title))}`:"Continue",ot={values:j,setValues:X,errors:Gt,goTo:at,next:()=>{var B;return(B=O.current)==null?void 0:B.requestSubmit()}},ht=B=>{if(B>=x)return l?l(j,Qe):a.jsx(Nf,{title:"All set",description:"Everything is saved. You can change it any time."});const Q=e[B],he=B===w?ot:{...ot,errors:{}};return a.jsxs(a.Fragment,{children:[a.jsx("h2",{className:"ui-sfc__heading",tabIndex:-1,id:`${h}-h${B}`,dir:"auto",children:Q.heading??Q.title}),Q.description&&a.jsx("p",{className:"ui-sfc__desc",dir:"auto",children:Q.description}),a.jsx("div",{className:"ui-sfc__body",children:Q.render(he)})]})},wi=D.from!==null&&D.from!==D.index?[D.from,D.index]:[D.index];return a.jsxs("div",{className:Va("ui-sfc",f),style:{"--ui-sfc-n":x},children:[a.jsx("style",{href:"ui-stepper-form-clean",precedence:"default",children:ig}),a.jsxs("div",{className:"ui-sfc__head",children:[a.jsx("div",{className:"ui-sfc__steps",children:a.jsx("ol",{className:"ui-sfc__list","aria-label":"Progress",children:e.map((B,Q)=>{const he=re||Q<y&&Q!==w?"done":Q===w?"current":"upcoming",Re=!re&&!S&&Q!==w&&Q<=y,$t=a.jsxs(a.Fragment,{children:[a.jsx("span",{className:"ui-sfc__bar","aria-hidden":"true"}),a.jsx("span",{className:"ui-sfc__mark",children:he==="done"?a.jsx(bf,{},"check"):a.jsx("span",{children:Q+1},"num")}),a.jsx("span",{className:"ui-sfc__step-label",dir:"auto",children:B.title}),a.jsx("span",{className:"ui-sfc__sr",children:he==="done"?" (done)":he==="current"?" (current)":""})]});return a.jsx("li",{className:"ui-sfc__step","data-state":he,"aria-current":!re&&Q===w?"step":void 0,children:Re?a.jsx("button",{type:"button",className:"ui-sfc__step-btn",title:Di(B.title)||void 0,onClick:()=>we(Q),children:$t}):a.jsx("span",{className:"ui-sfc__step-btn",title:Di(B.title)||void 0,children:$t})},`${B.id}#${Q}`)})})}),a.jsx("div",{className:"ui-sfc__compact","aria-hidden":"true",children:a.jsx("span",{className:"ui-sfc__compact-text",children:re?a.jsxs(a.Fragment,{children:["All ",Ii(x)," steps done"]}):a.jsxs(a.Fragment,{children:["Step ",Ii(w+1)," of ",Ii(x),a.jsx("span",{className:"ui-sfc__compact-dot",children:"·"}),a.jsx("span",{className:"ui-sfc__compact-title",dir:"auto",children:Ce.title})]})},re?"done":w)})]}),a.jsxs("form",{ref:O,className:"ui-sfc__card",noValidate:!0,onSubmit:K,"aria-labelledby":re?void 0:`${h}-h${w}`,children:[a.jsx("div",{ref:Y,className:"ui-sfc__viewport",children:wi.map(B=>{const Q=B===D.index;return a.jsx("div",{className:"ui-sfc__pane","data-pane":Q?"current":"leaving","data-dir":D.dir,"data-first":!le.current||void 0,inert:!Q,"aria-hidden":!Q||void 0,children:a.jsx(kf.Provider,{value:{errors:Q&&B===w?Gt:{},shake:Q?N:0,report:C},children:ht(B)})},B)})}),a.jsx("div",{className:"ui-sfc__foot-fold","data-hidden":re||void 0,children:a.jsxs("div",{className:"ui-sfc__foot",inert:re,children:[a.jsxs("button",{type:"button",className:"ui-sfc__btn ui-sfc__btn-ghost","data-hidden":w===0||void 0,disabled:w===0||S,onClick:oe,children:[a.jsx(tg,{d:yf.back}),"Back"]}),ne&&a.jsx("span",{className:"ui-sfc__submit-error",role:"alert",dir:"auto",children:ne}),a.jsx("button",{ref:G,type:"submit",className:"ui-sfc__btn ui-sfc__btn-primary","aria-disabled":!ye||S||void 0,"data-busy":S||void 0,children:a.jsxs("span",{ref:te,className:"ui-sfc__btn-inner",children:[S&&a.jsx("span",{className:"ui-sfc__spinner","aria-hidden":"true"}),a.jsx("span",{className:"ui-sfc__btn-label",title:Le,children:Le},Le)]})})]})})]}),a.jsx("span",{className:"ui-sfc__sr","aria-live":"polite",children:A})]})}function sn({name:e,label:t,hint:n,optional:i,children:r}){const{errors:o,shake:s,report:c}=_.useContext(kf),[l,f]=_.useState(null),[x,v]=_.useState(0),g=_.useId(),b=_.useRef(null),w=o[e]??l??"",j=_.useRef(w);w&&(j.current=w);const E=!!w;_.useEffect(()=>{s&&(o[e]||l)&&Hc(b.current)},[s]),_.useEffect(()=>{x&&Hc(b.current)},[x]);const p=_.useCallback(d=>{f(d),c(e,d),d&&v(m=>m+1)},[e,c]);return a.jsxs("div",{className:"ui-sfc__field","data-invalid":E||void 0,children:[a.jsxs("label",{className:"ui-sfc__label",htmlFor:g,dir:"auto",children:[a.jsx("span",{className:"ui-sfc__label-text",children:t}),i&&a.jsx("span",{className:"ui-sfc__optional",children:"Optional"})]}),a.jsx("div",{ref:b,className:"ui-sfc__control",children:a.jsx(jf.Provider,{value:{id:g,invalid:E,describedBy:E?`${g}-msg`:n?`${g}-hint`:void 0,flag:p},children:r})}),a.jsx("div",{className:"ui-sfc__fold","data-open":E||void 0,children:a.jsx("div",{children:a.jsx("p",{className:"ui-sfc__msg",id:`${g}-msg`,dir:"auto",children:j.current},j.current)})}),n&&a.jsx("div",{className:"ui-sfc__fold","data-open":!E||void 0,children:a.jsx("div",{children:a.jsx("p",{className:"ui-sfc__hint",id:`${g}-hint`,dir:"auto",children:n})})})]})}function Sn({prefix:e,className:t,...n}){const i=_.useContext(jf);return a.jsxs("div",{className:Va("ui-sfc__input",t),"data-invalid":(i==null?void 0:i.invalid)||void 0,children:[e&&a.jsx("span",{className:"ui-sfc__prefix","aria-hidden":"true",title:e,children:e}),a.jsx("input",{id:i==null?void 0:i.id,"aria-invalid":(i==null?void 0:i.invalid)||void 0,"aria-describedby":i==null?void 0:i.describedBy,autoComplete:"off",spellCheck:!1,...n})]})}function ng({value:e,onChange:t,options:n,label:i}){const r=_.useRef(null),o=_.useRef(null);_.useLayoutEffect(()=>{Wc(r.current,o.current,'[aria-checked="true"]')}),_.useEffect(()=>{const l=r.current;if(!l)return;const f=new ResizeObserver(()=>Wc(l,o.current,'[aria-checked="true"]'));return f.observe(l),()=>f.disconnect()},[]);const s=n.findIndex(l=>l.value===e),c=l=>{var x,v,g;if(!n.length)return;const f=l.key==="ArrowRight"||l.key==="ArrowDown"?1:l.key==="ArrowLeft"||l.key==="ArrowUp"?-1:0;if(f){l.preventDefault();const b=(s+f+n.length)%n.length;t(n[b].value),(v=(x=r.current)==null?void 0:x.querySelector(`[data-index="${b}"]`))==null||v.focus()}else l.key==="Enter"&&(l.preventDefault(),(g=l.currentTarget.closest("form"))==null||g.requestSubmit())};return a.jsxs("div",{ref:r,className:"ui-sfc__choices",role:"radiogroup","aria-label":i,onKeyDown:c,children:[a.jsx("span",{ref:o,className:"ui-sfc__ring","aria-hidden":"true"}),n.map((l,f)=>{const x=f===s;return a.jsxs("button",{type:"button",role:"radio","aria-checked":x,tabIndex:x?0:-1,"data-value":l.value,"data-index":f,className:"ui-sfc__choice",onClick:()=>t(l.value),children:[a.jsxs("span",{className:"ui-sfc__choice-top",children:[a.jsx("span",{className:"ui-sfc__choice-title",dir:"auto",title:Di(l.title),children:l.title}),l.badge&&a.jsx("span",{className:"ui-sfc__badge",title:l.badge,children:l.badge}),a.jsx("span",{className:"ui-sfc__radio","aria-hidden":"true"})]}),l.aside&&a.jsx("span",{className:"ui-sfc__choice-aside",children:l.aside}),l.description&&a.jsx("span",{className:"ui-sfc__choice-desc",dir:"auto",children:l.description})]},`${l.value}#${f}`)})]})}function Nf({title:e,description:t,children:n}){return a.jsxs("div",{className:"ui-sfc__success",children:[a.jsx("span",{className:"ui-sfc__success-check",children:a.jsx(bf,{})}),a.jsx("h2",{className:"ui-sfc__heading",tabIndex:-1,children:e}),t&&a.jsx("p",{className:"ui-sfc__desc",children:t}),n&&a.jsx("div",{className:"ui-sfc__success-actions",children:n})]})}const ig=`
/* Colors and motion as variables – override them on .ui-sfc */
.ui-sfc {
  --ui-sfc-card: #ffffff;
  --ui-sfc-ink: rgba(0, 0, 0, 0.88);
  --ui-sfc-strong: #000000;
  --ui-sfc-text: rgba(0, 0, 0, 0.61);
  --ui-sfc-muted: rgba(0, 0, 0, 0.45);
  --ui-sfc-faint: rgba(0, 0, 0, 0.27);
  --ui-sfc-icon: rgba(0, 0, 0, 0.447);
  --ui-sfc-line: rgba(0, 0, 0, 0.06);
  --ui-sfc-fill: rgba(0, 0, 0, 0.06);
  --ui-sfc-fill-strong: rgba(0, 0, 0, 0.1);
  --ui-sfc-wash: rgba(0, 0, 0, 0.03);
  --ui-sfc-wash-soft: rgba(0, 0, 0, 0.015);
  --ui-sfc-accent: rgba(0, 96, 226, 0.765);
  --ui-sfc-accent-soft: rgba(0, 96, 226, 0.08);
  --ui-sfc-accent-fill: rgba(0, 96, 226, 0.05);
  --ui-sfc-accent-line: rgba(0, 96, 226, 0.35);
  --ui-sfc-ok: #1a9a52;
  --ui-sfc-ok-soft: rgba(26, 154, 82, 0.1);
  --ui-sfc-danger: #e5484d;
  --ui-sfc-danger-soft: rgba(229, 72, 77, 0.55);
  --ui-sfc-chip: rgba(0, 0, 0, 0.88);
  --ui-sfc-chip-hover: rgba(0, 0, 0, 0.8);
  --ui-sfc-on-chip: #fcfcfc;
  --ui-sfc-white-hover: #fafafa;
  --ui-sfc-focus: rgba(0, 96, 226, 0.35);
  /* Strokes are shadows: a 0.5px hairline plus a soft lift */
  --ui-sfc-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.06), 0 1px 1px -1px rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --ui-sfc-shadow-hover: 0 0 0 0.5px rgba(0, 0, 0, 0.12), 0 1px 1px -1px rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --ui-sfc-ease: cubic-bezier(0.22, 1, 0.36, 1);
  position: relative;
  box-sizing: border-box;
  container-type: inline-size;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  width: 100%;
  max-width: 520px;
  border-radius: 10px;
  background: var(--ui-sfc-card);
  box-shadow: var(--ui-sfc-shadow);
  font-family: "Inter", "InterVariable", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  font-size: 13px;
  line-height: 20px;
  font-weight: 400;
  color: var(--ui-sfc-ink);
  -webkit-font-smoothing: antialiased;
}
.ui-sfc *, .ui-sfc *::before, .ui-sfc *::after { box-sizing: border-box; }
:where(.ui-sfc) button { margin: 0; padding: 0; border: 0; background: none; font: inherit; color: inherit; cursor: pointer; }
:where(.ui-sfc) svg { display: block; flex: none; }
:where(.ui-sfc) :is(h2, p, dl, dd, ul, ol) { margin: 0; }
.ui-sfc button:focus-visible { outline: 2px solid var(--ui-sfc-focus); outline-offset: 1px; }
/* 16px icons with thin ~1.1px lines */
.ui-sfc__glyph { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.65; stroke-linecap: round; stroke-linejoin: round; }
.ui-sfc__sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }

/* A check that draws in */
.ui-sfc__draw { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
.ui-sfc__draw path { stroke-dasharray: 1; stroke-dashoffset: 1; animation: ui-sfc-draw 360ms var(--ui-sfc-ease) 80ms forwards; }

/* ---- The steps on top: a thin bar per step, a small uppercase label under it ---- */
.ui-sfc__head { padding: 16px 20px 0; }
.ui-sfc__steps { position: relative; }
.ui-sfc__list { display: grid; grid-template-columns: repeat(var(--ui-sfc-n), minmax(0, 1fr)); gap: 8px; padding: 0; list-style: none; }
.ui-sfc__step { position: relative; display: grid; min-width: 0; }
.ui-sfc__step-btn {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  column-gap: 6px;
  row-gap: 6px;
  min-width: 0;
  margin: -4px;
  padding: 4px 4px 2px;
  border-radius: 6px;
  text-align: left;
  cursor: default;
  transition: background-color 100ms ease;
}
button.ui-sfc__step-btn { cursor: pointer; }
button.ui-sfc__step-btn:hover { background: var(--ui-sfc-wash); }
/* The bar fills from the left once the step is reached */
.ui-sfc__bar { position: relative; grid-column: 1 / -1; height: 2px; overflow: hidden; border-radius: 1px; background: var(--ui-sfc-line); }
.ui-sfc__bar::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--ui-sfc-accent);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 360ms var(--ui-sfc-ease);
}
.ui-sfc__step:not([data-state="upcoming"]) .ui-sfc__bar::after { transform: none; }
/* The number, or the check once the step is done – same small slot, so the label never moves */
.ui-sfc__mark {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: flex-start;
  min-width: 12px;
  height: 16px;
  font-size: 10px;
  font-weight: 500;
  line-height: 16px;
  font-variant-numeric: tabular-nums;
  color: var(--ui-sfc-faint);
  transition: color 200ms ease;
}
.ui-sfc__mark > span { animation: ui-sfc-in 260ms var(--ui-sfc-ease) both; }
.ui-sfc__mark .ui-sfc__draw { width: 12px; height: 12px; stroke-width: 2.4; }
.ui-sfc__step[data-state="current"] .ui-sfc__mark { color: var(--ui-sfc-accent); }
.ui-sfc__step[data-state="done"] .ui-sfc__mark { color: var(--ui-sfc-accent); }
.ui-sfc__step-label {
  overflow: hidden;
  min-width: 0;
  font-size: 10px;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--ui-sfc-muted);
  transition: color 200ms ease;
}
.ui-sfc__step[data-state="done"] .ui-sfc__step-label { color: var(--ui-sfc-text); }
.ui-sfc__step[data-state="current"] .ui-sfc__step-label { color: var(--ui-sfc-strong); }
button.ui-sfc__step-btn:hover .ui-sfc__step-label { color: var(--ui-sfc-ink); }

/* Compact line for narrow screens: "STEP 2 OF 4 · TEAM" above the bars */
.ui-sfc__compact { display: none; }
.ui-sfc__compact-text {
  display: flex;
  min-width: 0;
  font-size: 10px;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-variant-numeric: tabular-nums;
  color: var(--ui-sfc-muted);
  white-space: nowrap;
  animation: ui-sfc-in 280ms var(--ui-sfc-ease) both;
}
.ui-sfc__compact-dot { margin: 0 6px; color: var(--ui-sfc-faint); }
.ui-sfc__compact-title { overflow: hidden; text-overflow: ellipsis; color: var(--ui-sfc-strong); }

/* ---- The step content: only this part clips and glides to each step's height ---- */
.ui-sfc__card { display: grid; min-width: 0; }
/* The panes carry a little padding so focus rings aren't cut */
.ui-sfc__viewport { position: relative; overflow: hidden; transition: height 360ms var(--ui-sfc-ease); }
.ui-sfc__pane { padding: 20px 20px 20px; animation: ui-sfc-enter 360ms var(--ui-sfc-ease) both; }
.ui-sfc__pane[data-dir="-1"] { animation-name: ui-sfc-enter-back; }
.ui-sfc__pane[data-first] { animation: none; }
.ui-sfc__pane[data-pane="leaving"] { position: absolute; top: 0; left: 0; right: 0; pointer-events: none; animation: ui-sfc-leave 280ms var(--ui-sfc-ease) both; }
.ui-sfc__pane[data-pane="leaving"][data-dir="-1"] { animation-name: ui-sfc-leave-back; }
.ui-sfc__heading { font-size: 15px; font-weight: 500; line-height: 24px; color: var(--ui-sfc-strong); outline: none; overflow-wrap: anywhere; }
.ui-sfc__desc { color: var(--ui-sfc-text); text-wrap: pretty; white-space: pre-line; overflow-wrap: anywhere; }
.ui-sfc__body { display: grid; gap: 16px; margin-top: 16px; }

/* Fields */
.ui-sfc__field { display: grid; min-width: 0; }
.ui-sfc__label { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; margin: 0 0 6px 2px; font-size: 12px; font-weight: 500; line-height: 16px; color: var(--ui-sfc-text); }
.ui-sfc__label-text { min-width: 0; overflow-wrap: anywhere; }
.ui-sfc__optional { flex: none; font-weight: 400; color: var(--ui-sfc-muted); }
.ui-sfc__control { min-width: 0; }
.ui-sfc__input, .ui-sfc__tags {
  display: flex;
  align-items: center;
  min-width: 0;
  height: 32px;
  border-radius: 8px;
  background: var(--ui-sfc-card);
  box-shadow: var(--ui-sfc-shadow);
  transition: box-shadow 120ms ease;
  cursor: text;
}
.ui-sfc__input:hover, .ui-sfc__tags:hover { box-shadow: var(--ui-sfc-shadow-hover); }
/* Typing in a field: no ring – the caret shows where you are, the edge only firms up a little */
.ui-sfc__input:focus-within, .ui-sfc__tags:focus-within { outline: none; box-shadow: var(--ui-sfc-shadow-hover); }
.ui-sfc__input[data-invalid], .ui-sfc__tags[data-invalid] { box-shadow: 0 0 0 0.5px var(--ui-sfc-danger), 0 1px 2px 0 rgba(229, 72, 77, 0.08); }
.ui-sfc__input[data-invalid]:focus-within, .ui-sfc__tags[data-invalid]:focus-within { box-shadow: 0 0 0 1px var(--ui-sfc-danger), 0 1px 2px 0 rgba(229, 72, 77, 0.08); }
.ui-sfc__input input, .ui-sfc__tags-input {
  flex: 1;
  min-width: 0;
  height: 32px;
  margin: 0;
  padding: 0 10px;
  border: 0;
  outline: none;
  background: none;
  font: inherit;
  color: var(--ui-sfc-ink);
}
.ui-sfc__input input::placeholder, .ui-sfc__tags-input::placeholder { color: var(--ui-sfc-faint); }
/* A long prefix shortens, so the field always keeps room to type */
.ui-sfc__prefix { flex: 0 1 auto; min-width: 0; max-width: 60%; overflow: hidden; padding-left: 10px; color: var(--ui-sfc-muted); white-space: nowrap; text-overflow: ellipsis; user-select: none; }
.ui-sfc__prefix + input { padding-left: 0; }

/* Message and hint fold open and closed */
.ui-sfc__fold { display: grid; grid-template-rows: 0fr; opacity: 0; transition: grid-template-rows 260ms var(--ui-sfc-ease), opacity 200ms ease; }
.ui-sfc__fold[data-open] { grid-template-rows: 1fr; opacity: 1; }
.ui-sfc__fold > div { min-height: 0; overflow: hidden; }
.ui-sfc__msg, .ui-sfc__hint { padding: 6px 0 0 2px; font-size: 12px; line-height: 16px; text-wrap: pretty; overflow-wrap: anywhere; }
.ui-sfc__msg { color: var(--ui-sfc-danger); animation: ui-sfc-in 240ms var(--ui-sfc-ease) both; }
.ui-sfc__hint { color: var(--ui-sfc-muted); }

/* Email chips: one line – the chips scroll sideways, the text field stays at the end */
.ui-sfc__tags { gap: 4px; padding: 0 4px; overflow-x: auto; overflow-y: hidden; scrollbar-width: none; overscroll-behavior-x: contain; }
.ui-sfc__tags::-webkit-scrollbar { display: none; }
.ui-sfc__chips { display: contents; padding: 0; list-style: none; }
.ui-sfc__chip {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 2px;
  max-width: 220px;
  height: 24px;
  padding: 0 3px 0 8px;
  overflow: hidden;
  border-radius: 6px;
  background: var(--ui-sfc-fill);
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: var(--ui-sfc-ink);
  white-space: nowrap;
  animation: ui-sfc-chip 260ms var(--ui-sfc-ease) both;
}
.ui-sfc__chip[data-leaving] { pointer-events: none; }
.ui-sfc__chip-text { overflow: hidden; text-overflow: ellipsis; }
.ui-sfc__chip-x { display: grid; place-items: center; flex: none; width: 18px; height: 18px; border-radius: 4px; color: var(--ui-sfc-icon); transition: background-color 100ms ease, color 100ms ease; }
.ui-sfc__chip-x .ui-sfc__glyph { width: 12px; height: 12px; stroke-width: 1.9; }
.ui-sfc__chip-x:hover { background: var(--ui-sfc-fill); color: var(--ui-sfc-ink); }
.ui-sfc__chip[data-leaving] .ui-sfc__chip-x { background: none; }
.ui-sfc__tags-input { flex: 1 0 140px; height: 24px; padding: 0 6px; }
.ui-sfc__tags-input:first-child { padding-left: 6px; }

/* Selectable cards: white with the hairline shadow; the chosen one gets a faint blue fill and a light blue hairline that moves to it */
.ui-sfc__choices { position: relative; display: grid; grid-auto-columns: minmax(0, 1fr); grid-auto-flow: column; gap: 8px; }
.ui-sfc__ring {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  border-radius: 8px;
  box-shadow: 0 0 0 0.5px var(--ui-sfc-accent-line);
  opacity: 0;
  pointer-events: none;
  transition: transform 260ms var(--ui-sfc-ease), width 260ms var(--ui-sfc-ease), height 260ms var(--ui-sfc-ease), opacity 160ms ease;
}
.ui-sfc__choice {
  position: relative;
  display: grid;
  align-content: start;
  gap: 2px;
  min-width: 0;
  padding: 10px 12px 12px;
  border-radius: 8px;
  background: var(--ui-sfc-card);
  box-shadow: var(--ui-sfc-shadow);
  text-align: left;
  transition: background-color 100ms ease;
}
.ui-sfc__choice:hover { background: var(--ui-sfc-wash-soft); }
.ui-sfc__choice[aria-checked="true"] { background: var(--ui-sfc-accent-fill); }
.ui-sfc__choice:focus-visible { outline-offset: 3px; }
/* The title keeps a readable minimum – a long badge moves to the next line instead */
.ui-sfc__choice-top { display: flex; flex-wrap: wrap; align-items: center; gap: 2px 6px; min-width: 0; }
.ui-sfc__choice-title { min-width: min(100%, 72px); overflow: hidden; font-weight: 500; color: var(--ui-sfc-strong); white-space: nowrap; text-overflow: ellipsis; }
.ui-sfc__badge { flex: 0 1 auto; min-width: 0; max-width: 50%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; padding: 0 5px; border-radius: 5px; background: var(--ui-sfc-accent-soft); font-size: 11px; font-weight: 500; line-height: 16px; color: var(--ui-sfc-accent); }
.ui-sfc__radio { position: relative; flex: none; width: 14px; height: 14px; margin-left: auto; border-radius: 50%; box-shadow: inset 0 0 0 1px var(--ui-sfc-fill-strong); transition: box-shadow 200ms ease; }
.ui-sfc__radio::after { content: ""; position: absolute; inset: 3.5px; border-radius: 50%; background: var(--ui-sfc-accent); transform: scale(0); transition: transform 280ms cubic-bezier(0.34, 1.56, 0.64, 1); }
.ui-sfc__choice[aria-checked="true"] .ui-sfc__radio { box-shadow: inset 0 0 0 1px var(--ui-sfc-accent); }
.ui-sfc__choice[aria-checked="true"] .ui-sfc__radio::after { transform: scale(1); }
.ui-sfc__choice-aside { font-variant-numeric: tabular-nums; color: var(--ui-sfc-ink); }
.ui-sfc__choice-desc { margin-top: 2px; font-size: 12px; line-height: 16px; color: var(--ui-sfc-text); text-wrap: pretty; overflow-wrap: anywhere; }

/* Review: rows under hairlines */
.ui-sfc__review { display: grid; border-radius: 8px; box-shadow: var(--ui-sfc-shadow); }
.ui-sfc__review-row { display: grid; grid-template-columns: 96px minmax(0, 1fr) auto; align-items: baseline; gap: 12px; padding: 10px 8px 10px 12px; }
.ui-sfc__review-row + .ui-sfc__review-row { border-top: 0.5px solid var(--ui-sfc-line); }
.ui-sfc__review dt { min-width: 0; font-size: 12px; line-height: 20px; color: var(--ui-sfc-muted); overflow-wrap: anywhere; }
.ui-sfc__review dd { min-width: 0; color: var(--ui-sfc-ink); overflow-wrap: anywhere; }
.ui-sfc__edit { height: 24px; margin: -2px 0; padding: 0 8px; border-radius: 6px; font-size: 12px; font-weight: 500; line-height: 16px; color: var(--ui-sfc-text); transition: background-color 100ms ease, color 100ms ease; }
.ui-sfc__edit:hover { background: var(--ui-sfc-wash); color: var(--ui-sfc-ink); }

/* Success */
.ui-sfc__success { display: grid; justify-items: center; padding: 16px 0 8px; text-align: center; }
.ui-sfc__success-check {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  margin-bottom: 12px;
  border-radius: 50%;
  background: var(--ui-sfc-ok-soft);
  color: var(--ui-sfc-ok);
  animation: ui-sfc-pop 520ms cubic-bezier(0.34, 1.56, 0.64, 1) 120ms both;
}
.ui-sfc__success-check .ui-sfc__draw { width: 18px; height: 18px; stroke-width: 2; }
.ui-sfc__success-check .ui-sfc__draw path { animation-delay: 320ms; }
.ui-sfc__success .ui-sfc__heading { animation: ui-sfc-in 340ms var(--ui-sfc-ease) 220ms both; }
.ui-sfc__success .ui-sfc__desc { max-width: 40ch; text-wrap: balance; animation: ui-sfc-in 340ms var(--ui-sfc-ease) 290ms both; }
.ui-sfc__success-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 16px; animation: ui-sfc-in 340ms var(--ui-sfc-ease) 360ms both; }

/* ---- The last row of the card: Back and Continue under a hairline; sticks to the bottom in long pages ---- */
.ui-sfc__foot-fold { position: sticky; bottom: 0; z-index: 3; display: grid; grid-template-rows: 1fr; border-radius: 0 0 10px 10px; background: var(--ui-sfc-card); transition: grid-template-rows 340ms var(--ui-sfc-ease), opacity 200ms ease; }
.ui-sfc__foot-fold[data-hidden] { grid-template-rows: 0fr; opacity: 0; }
.ui-sfc__foot { display: flex; align-items: center; gap: 12px; min-height: 0; overflow: hidden; padding: 0 12px; border-top: 0.5px solid var(--ui-sfc-line); }
/* The row's height lives on a pseudo spacer so the fold can still close it to 0 */
.ui-sfc__foot::before { content: ""; flex: none; width: 0; height: 48px; margin-right: -12px; }
.ui-sfc__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  height: 28px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  white-space: nowrap;
  transition: background-color 100ms ease, opacity 200ms ease, transform 120ms ease, width 300ms var(--ui-sfc-ease), visibility 200ms;
}
/* Secondary: white with the hairline shadow */
.ui-sfc__btn-ghost, .ui-sfc__btn-secondary { gap: 6px; padding: 0 10px 0 8px; background: var(--ui-sfc-card); box-shadow: var(--ui-sfc-shadow); color: var(--ui-sfc-strong); }
.ui-sfc__btn-secondary { padding: 0 10px; }
.ui-sfc__btn-ghost .ui-sfc__glyph { color: var(--ui-sfc-icon); }
.ui-sfc__btn-ghost:hover, .ui-sfc__btn-secondary:hover { background: var(--ui-sfc-white-hover); }
.ui-sfc__btn-ghost[data-hidden] { opacity: 0; visibility: hidden; }
/* Primary: the dark chip */
.ui-sfc__btn-primary { margin-left: auto; overflow: hidden; background: var(--ui-sfc-chip); color: var(--ui-sfc-on-chip); }
.ui-sfc__btn-primary:hover { background: var(--ui-sfc-chip-hover); }
.ui-sfc__btn:active { transform: scale(0.97); }
/* Not ready yet: dimmed, but still answers a press with the messages */
.ui-sfc__btn-primary[aria-disabled="true"] { opacity: 0.35; }
.ui-sfc__btn-primary[data-busy] { opacity: 0.7; cursor: progress; }
/* A long label shortens – the button never grows past the room Back leaves it */
.ui-sfc__btn-inner { display: inline-flex; flex: none; align-items: center; gap: 6px; max-width: calc(100cqw - 112px); padding: 0 10px; }
.ui-sfc__btn-label { min-width: 0; overflow: hidden; text-overflow: ellipsis; animation: ui-sfc-in 240ms var(--ui-sfc-ease) both; }
.ui-sfc__spinner { width: 12px; height: 12px; border-radius: 50%; border: 1.5px solid currentColor; border-right-color: transparent; animation: ui-sfc-spin 700ms linear infinite; }
.ui-sfc__submit-error { flex: 1 1 auto; min-width: 0; overflow-wrap: anywhere; font-size: 12px; line-height: 16px; color: var(--ui-sfc-danger); animation: ui-sfc-in 240ms var(--ui-sfc-ease) both; }

@keyframes ui-sfc-in { from { opacity: 0; transform: translateY(3px); filter: blur(2px); } to { opacity: 1; transform: none; filter: none; } }
@keyframes ui-sfc-enter { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: none; } }
@keyframes ui-sfc-enter-back { from { opacity: 0; transform: translateX(-24px); } to { opacity: 1; transform: none; } }
@keyframes ui-sfc-leave { to { opacity: 0; transform: translateX(-24px); } }
@keyframes ui-sfc-leave-back { to { opacity: 0; transform: translateX(24px); } }
@keyframes ui-sfc-draw { to { stroke-dashoffset: 0; } }
@keyframes ui-sfc-pop { 0% { opacity: 0; transform: scale(0.4); } 60% { opacity: 1; transform: scale(1.08); } 100% { opacity: 1; transform: scale(1); } }
@keyframes ui-sfc-chip { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: none; } }
@keyframes ui-sfc-spin { to { transform: rotate(360deg); } }

/* Narrow (phones): the compact line over the bars, cards as rows, stacked review rows */
@container (max-width: 420px) {
  .ui-sfc__head { padding: 14px 16px 0; }
  .ui-sfc__compact { display: flex; margin-bottom: 8px; }
  /* Many steps: the gaps shrink so every bar still fits – with a few steps they stay 8px */
  .ui-sfc__list { gap: min(8px, calc((100cqw - 32px) / (var(--ui-sfc-n) * 4))); }
  .ui-sfc__step-btn { row-gap: 0; padding-bottom: 4px; }
  .ui-sfc__mark, .ui-sfc__step-label { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  .ui-sfc__pane { padding: 16px 16px 16px; }
  .ui-sfc__foot { padding: 0 12px; }
  .ui-sfc__choices { grid-template-columns: minmax(0, 1fr); grid-auto-flow: row; }
  .ui-sfc__choice { grid-template-columns: minmax(0, 1fr) auto; column-gap: 10px; padding: 10px 12px; }
  .ui-sfc__choice-top { grid-column: 1; }
  .ui-sfc__choice-aside { grid-column: 2; grid-row: 1; align-self: center; }
  .ui-sfc__choice-desc { grid-column: 1 / -1; margin-top: 0; }
  .ui-sfc__radio { order: -1; margin-left: 0; margin-right: 2px; }
  .ui-sfc__review-row { grid-template-columns: minmax(0, 1fr) auto; row-gap: 0; }
  .ui-sfc__review dt { grid-column: 1; }
  .ui-sfc__review dd { grid-column: 1; grid-row: 2; }
  .ui-sfc__edit { grid-column: 2; grid-row: 1 / span 2; align-self: center; margin: 0; }
}
/* Touch screens: 16px fields (no zoom on iOS) and taller targets */
@media (hover: none) and (pointer: coarse) {
  .ui-sfc__input input, .ui-sfc__tags-input, .ui-sfc__prefix { font-size: 16px; }
  .ui-sfc__input, .ui-sfc__tags, .ui-sfc__input input { height: 40px; }
  .ui-sfc__chip { height: 30px; }
  .ui-sfc__chip-x { width: 26px; height: 26px; }
  .ui-sfc__tags-input { height: 30px; }
  .ui-sfc__btn { height: 36px; }
  .ui-sfc__foot::before { height: 56px; }
  .ui-sfc__edit { height: 34px; padding: 0 12px; }
  .ui-sfc__step-btn { padding-top: 10px; padding-bottom: 8px; margin: -10px -4px -8px; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-sfc *, .ui-sfc *::before, .ui-sfc *::after { animation-duration: 1ms !important; animation-delay: 0ms !important; transition: none !important; }
}

/* Dark mode: follows a .dark class or data-theme="dark" on any ancestor, e.g. <html> */
:where(.dark, [data-theme="dark"]) .ui-sfc {
  --ui-sfc-card: #1c1c1e;
  --ui-sfc-ink: rgba(255, 255, 255, 0.9);
  --ui-sfc-strong: #ffffff;
  --ui-sfc-text: rgba(255, 255, 255, 0.62);
  --ui-sfc-muted: rgba(255, 255, 255, 0.46);
  --ui-sfc-faint: rgba(255, 255, 255, 0.3);
  --ui-sfc-icon: rgba(255, 255, 255, 0.5);
  --ui-sfc-line: rgba(255, 255, 255, 0.08);
  --ui-sfc-fill: rgba(255, 255, 255, 0.08);
  --ui-sfc-fill-strong: rgba(255, 255, 255, 0.16);
  --ui-sfc-wash: rgba(255, 255, 255, 0.04);
  --ui-sfc-wash-soft: rgba(255, 255, 255, 0.025);
  --ui-sfc-accent: #4d8dff;
  --ui-sfc-accent-soft: rgba(77, 141, 255, 0.14);
  --ui-sfc-accent-fill: rgba(77, 141, 255, 0.09);
  --ui-sfc-accent-line: rgba(77, 141, 255, 0.5);
  --ui-sfc-ok: #3ec27a;
  --ui-sfc-ok-soft: rgba(62, 194, 122, 0.14);
  --ui-sfc-danger: #ff6369;
  --ui-sfc-chip: rgba(255, 255, 255, 0.9);
  --ui-sfc-chip-hover: rgba(255, 255, 255, 0.8);
  --ui-sfc-on-chip: #111113;
  --ui-sfc-white-hover: #232326;
  --ui-sfc-focus: rgba(77, 141, 255, 0.5);
  --ui-sfc-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.4);
  --ui-sfc-shadow-hover: 0 0 0 0.5px rgba(255, 255, 255, 0.16), 0 1px 2px 0 rgba(0, 0, 0, 0.4);
}
`;function Sf({options:e,value:t,defaultValue:n,onChange:i,size:r="md",variant:o="buttons",fullWidth:s=!1,kind:c="radio",disabled:l=!1,"aria-label":f,"aria-labelledby":x,className:v}){const g=_.useMemo(()=>{const C=new Set;return(Array.isArray(e)?e:[]).filter(h=>!h||h.value==null||C.has(String(h.value))?!1:(C.add(String(h.value)),!0))},[e]),b=r==="sm"||r==="lg"?r:"md",w=o==="tray"||o==="underline"?o:"buttons",[j,E]=_.useState(()=>{var C;return n??((C=g.find(h=>!h.disabled))==null?void 0:C.value)}),p=t!==void 0?t:j,d=_.useRef(null),m=_.useRef(null),y=_.useRef(null),R=_.useRef(null),I=_.useRef(p);I.current=p;const N=_.useRef(!1),T=_.useRef(0),H=_.useRef(void 0),U=_.useRef(null),S=()=>{var C;return Array.from(((C=y.current)==null?void 0:C.querySelectorAll(":scope > .ui-segc__opt"))??[])},q=g.findIndex(C=>C.value===p),ne=q>=0?q:g.findIndex(C=>!C.disabled),ee=C=>{const h=g.find(L=>L.value===C);!h||h.disabled||l||C===I.current||(I.current=C,t===void 0&&E(C),i==null||i(C))},re=()=>{const C=S();if(!C.length||!y.current)return;const h=getComputedStyle(C[0]),L=parseFloat(h.paddingLeft)+parseFloat(h.paddingRight),D=C.map(z=>z.firstElementChild.offsetWidth+L);s?(y.current.style.setProperty("--ui-segc-min",`${Math.max(...D)}px`),C.forEach(z=>z.style.width="")):C.forEach((z,X)=>z.style.width=`${D[X]}px`)},pe=C=>{const h=y.current,L=R.current;if(!h||!L)return;const D=h.querySelector(":scope > .ui-segc__opt[data-active]");if(!D||!D.offsetWidth){L.style.opacity="0";return}let z=D.offsetLeft,X=D.offsetWidth;if(w==="underline"){const K=D.firstElementChild;z+=K.offsetLeft,X=K.offsetWidth}const ce=!L.dataset.ready||!C&&!N.current,M=parseFloat(L.style.left)||0;!ce&&z!==M&&(L.dataset.dir=z>M?"right":"left"),ce&&(L.style.transition="none"),L.style.opacity="1",L.style.left=`${z}px`,L.style.right=`${h.clientWidth-z-X}px`,ce&&(L.dataset.ready="1",L.offsetWidth,L.style.transition="")},A=()=>{var L;const C=m.current;if(!C)return;const h=C.scrollWidth-C.clientWidth;(L=d.current)==null||L.toggleAttribute("data-overflow",h>1),C.style.setProperty("--ui-segc-fade-l",C.scrollLeft>1?"24px":"0px"),C.style.setProperty("--ui-segc-fade-r",C.scrollLeft<h-1?"24px":"0px")},$=C=>{const h=m.current,L=y.current,D=L==null?void 0:L.querySelector(":scope > .ui-segc__opt[data-active]");if(!h||!L||!D||h.scrollWidth<=h.clientWidth+1)return;const z=L.offsetLeft+D.offsetLeft-(h.clientWidth-D.offsetWidth)/2;h.scrollTo({left:Math.max(0,z),behavior:C?"smooth":"auto"})};_.useLayoutEffect(()=>{const C=y.current,h=m.current;if(!C||!h)return;const L=()=>{re(),pe(!1),A()};L();const D=requestAnimationFrame(()=>{var ce;return(ce=d.current)==null?void 0:ce.setAttribute("data-ready","")});let z=0;const X=new ResizeObserver(()=>{cancelAnimationFrame(z),z=requestAnimationFrame(L)});return X.observe(h),X.observe(C),C.querySelectorAll(".ui-segc__opt, .ui-segc__content").forEach(ce=>X.observe(ce)),()=>{X.disconnect(),cancelAnimationFrame(z),cancelAnimationFrame(D)}},[g.length,s,w,b]),_.useLayoutEffect(()=>{var L;if(H.current===p)return;const C=H.current===void 0;H.current=p,C||(N.current=!0,clearTimeout(T.current),T.current=window.setTimeout(()=>N.current=!1,240)),pe(!C),$(!C);const h=y.current;!C&&h&&h.contains(document.activeElement)&&((L=S()[q])==null||L.focus({preventScroll:!0}))},[p]),_.useEffect(()=>()=>clearTimeout(T.current),[]);const O=C=>{var ce;const h=g.filter(M=>!M.disabled);if(!h.length||l)return;const L=c==="radio"?["ArrowLeft","ArrowUp"]:["ArrowLeft"],D=c==="radio"?["ArrowRight","ArrowDown"]:["ArrowRight"],z=h.findIndex(M=>M.value===I.current);let X;L.includes(C.key)?X=h[(z-1+h.length)%h.length]:D.includes(C.key)?X=h[(z+1)%h.length]:C.key==="Home"?X=h[0]:C.key==="End"&&(X=h[h.length-1]),X&&(C.preventDefault(),ee(X.value),(ce=S()[g.indexOf(X)])==null||ce.focus())},Y=C=>{let h=-1,L=1/0;return S().forEach((D,z)=>{const X=D.getBoundingClientRect(),ce=C<X.left?X.left-C:C>X.right?C-X.right:0;ce<L&&(L=ce,h=z)}),g[h]},G=()=>{var C;U.current=null,(C=d.current)==null||C.removeAttribute("data-pressed")},te=C=>{var z;if(l||C.button!==0)return;const h=Y(C.clientX);if(!h||h.disabled)return;const L=C.pointerType==="touch",D=!L||h.value===I.current;if(U.current={id:C.pointerId,touch:L,drag:D,x:C.clientX,moved:!1},D&&((z=d.current)==null||z.setAttribute("data-pressed","")),!L){ee(h.value);try{C.currentTarget.setPointerCapture(C.pointerId)}catch{}}},fe=C=>{const h=U.current;if(!h||h.id!==C.pointerId||!h.moved&&Math.abs(C.clientX-h.x)<(h.touch?8:3)||(h.moved=!0,!h.drag))return;const L=Y(C.clientX);L&&!L.disabled&&ee(L.value)},le=C=>{const h=U.current;if(!(!h||h.id!==C.pointerId)){if(h.touch&&!h.moved){const L=Y(C.clientX);L&&ee(L.value)}G()}},se=c==="tabs";return a.jsxs("div",{ref:d,className:["ui-segc",v].filter(Boolean).join(" "),"data-size":b,"data-variant":w,"data-full":s||void 0,"data-disabled":l||void 0,children:[a.jsx("style",{href:"ui-segmented-control-clean",precedence:"default",children:ag}),a.jsx("div",{ref:m,className:"ui-segc__scroller",onScroll:A,children:a.jsxs("div",{ref:y,className:"ui-segc__track",role:se?"tablist":"radiogroup","aria-label":f,"aria-labelledby":x,"aria-disabled":l||void 0,"aria-orientation":se?"horizontal":void 0,onKeyDown:O,onPointerDown:te,onPointerMove:fe,onPointerUp:le,onPointerCancel:G,onLostPointerCapture:G,children:[a.jsx("span",{ref:R,className:"ui-segc__pill","aria-hidden":"true"}),g.map((C,h)=>{const L=h===q,D=C.label??(C.icon?null:String(C.value)),z=rg(C.count);return a.jsx("button",{type:"button",className:"ui-segc__opt",role:se?"tab":"radio","aria-checked":se?void 0:L,"aria-selected":se?L:void 0,"aria-controls":se?C.controls:void 0,"aria-label":C.ariaLabel,"data-active":L||void 0,disabled:C.disabled||l,tabIndex:h===ne?0:-1,onClick:()=>ee(C.value),children:a.jsxs("span",{className:"ui-segc__content",children:[C.icon&&a.jsx("span",{className:"ui-segc__icon",onErrorCapture:X=>X.target.style.visibility="hidden",children:C.icon}),D!=null&&a.jsx("span",{className:"ui-segc__label",dir:"auto",children:D}),z!=null&&z!==""&&a.jsx("span",{className:"ui-segc__count",children:z},String(z)),C.badge!=null&&a.jsx("span",{className:"ui-segc__badge",children:C.badge})]})},String(C.value))})]})})]})}const rg=e=>typeof e=="number"?Number.isFinite(e)?e.toLocaleString("en-US"):null:e,ag=`
/* Animatable custom properties: the equal segment width and the soft edges glide too */
@property --ui-segc-min { syntax: "<length>"; inherits: true; initial-value: 0px; }
@property --ui-segc-fade-l { syntax: "<length>"; inherits: false; initial-value: 0px; }
@property --ui-segc-fade-r { syntax: "<length>"; inherits: false; initial-value: 0px; }

.ui-segc {
  --ui-segc-ink: rgba(0, 0, 0, 0.88);
  --ui-segc-text: rgba(0, 0, 0, 0.61);
  --ui-segc-hover-text: rgba(0, 0, 0, 0.75);
  --ui-segc-line: rgba(0, 0, 0, 0.06);
  --ui-segc-wash: rgba(0, 0, 0, 0.03);
  --ui-segc-fill: rgba(0, 0, 0, 0.06);
  --ui-segc-track: rgba(0, 0, 0, 0.04);
  --ui-segc-card: #ffffff;
  --ui-segc-card-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.06), 0 1px 1px -1px rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --ui-segc-accent: rgba(0, 96, 226, 0.765);
  --ui-segc-accent-soft: rgba(0, 96, 226, 0.08);
  --ui-segc-focus: rgba(0, 96, 226, 0.35);
  --ui-segc-ease: cubic-bezier(0.25, 0.9, 0.3, 1);
  /* Size: md – 28px chips, 4px 10px */
  --ui-segc-h: 28px;
  --ui-segc-px: 10px;
  --ui-segc-fs: 13px;
  --ui-segc-lh: 20px;
  --ui-segc-icon: 16px;
  --ui-segc-gap: 8px;
  --ui-segc-pad: 2px;
  --ui-segc-ring: 3px;
  box-sizing: border-box;
  display: inline-flex;
  max-width: 100%;
  min-width: 0;
  vertical-align: middle;
  border-radius: 8px;
  font-family: "Inter", "InterVariable", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  font-size: var(--ui-segc-fs);
  font-weight: 500;
  line-height: var(--ui-segc-lh);
  color: var(--ui-segc-text);
  -webkit-font-smoothing: antialiased;
}
.ui-segc[data-size="sm"] { --ui-segc-h: 24px; --ui-segc-px: 8px; --ui-segc-fs: 12px; --ui-segc-lh: 16px; --ui-segc-icon: 14px; --ui-segc-gap: 6px; }
.ui-segc[data-size="lg"] { --ui-segc-h: 32px; --ui-segc-px: 12px; --ui-segc-icon: 16px; --ui-segc-gap: 8px; }
.ui-segc[data-full] { display: flex; width: 100%; }
.ui-segc[data-disabled] { opacity: 0.5; pointer-events: none; }
.ui-segc *, .ui-segc *::before, .ui-segc *::after { box-sizing: border-box; }
:where(.ui-segc) button { margin: 0; padding: 0; border: 0; background: none; font: inherit; color: inherit; cursor: pointer; }
:where(.ui-segc) svg { display: block; flex: none; }

/* Scrolls sideways only when it doesn't fit; the padding keeps focus rings from being cut off */
.ui-segc__scroller {
  position: relative;
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  padding: var(--ui-segc-pad);
  border-radius: inherit;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
  -webkit-mask-image: linear-gradient(to right, transparent, #000 var(--ui-segc-fade-l), #000 calc(100% - var(--ui-segc-fade-r)), transparent);
  mask-image: linear-gradient(to right, transparent, #000 var(--ui-segc-fade-l), #000 calc(100% - var(--ui-segc-fade-r)), transparent);
  transition: --ui-segc-fade-l 160ms ease, --ui-segc-fade-r 160ms ease;
}
.ui-segc__scroller::-webkit-scrollbar { display: none; }

.ui-segc__track {
  position: relative;
  display: flex;
  width: max-content;
  min-width: 100%;
  /* Horizontal drags move the indicator; vertical ones still scroll the page */
  touch-action: pan-y;
  -webkit-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}
/* When it scrolls, swipes scroll it instead of dragging the indicator */
.ui-segc[data-overflow] .ui-segc__track { touch-action: pan-x pan-y; }
/* Equal segments, each as wide as the widest one needs */
.ui-segc[data-full] .ui-segc__track { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(var(--ui-segc-min), 1fr); }
.ui-segc[data-ready] .ui-segc__track { transition: --ui-segc-min 200ms var(--ui-segc-ease); }

/* An option */
.ui-segc__opt {
  position: relative;
  z-index: 1;
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  height: var(--ui-segc-h);
  padding: 0 var(--ui-segc-px);
  overflow: clip;
  border-radius: 6px;
  white-space: nowrap;
  /* Hover washes are short and crisp, in and out */
  transition: color 90ms ease, background-color 90ms ease;
}
.ui-segc[data-ready]:not([data-full]) .ui-segc__opt { transition: color 90ms ease, background-color 90ms ease, width 200ms var(--ui-segc-ease); }
.ui-segc__opt[data-active] { color: var(--ui-segc-ink); }
.ui-segc__opt:disabled { opacity: 0.4; cursor: not-allowed; }
.ui-segc__opt:focus-visible { outline: 2px solid var(--ui-segc-focus); outline-offset: 1px; }
@media (hover: hover) {
  .ui-segc__opt:not([data-active]):not(:disabled):hover { background-color: var(--ui-segc-wash); }
}

.ui-segc__content { display: inline-flex; flex: none; align-items: center; gap: 6px; }
.ui-segc[data-size="sm"] .ui-segc__content { gap: 5px; }
.ui-segc__icon { display: grid; place-items: center; width: var(--ui-segc-icon); height: var(--ui-segc-icon); color: rgba(0, 0, 0, 0.447); transition: color 90ms ease; }
.ui-segc__opt[data-active] .ui-segc__icon { color: var(--ui-segc-ink); }
.ui-segc__icon svg, .ui-segc__icon img { width: 100%; height: 100%; }
/* Images fill the tile without leaving it, whatever their shape */
.ui-segc__icon { overflow: hidden; }
.ui-segc__icon img { display: block; object-fit: contain; }
.ui-segc__label { display: block; }

.ui-segc__count {
  display: inline-grid;
  place-items: center;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 5px;
  background: var(--ui-segc-fill);
  font-size: 11px;
  line-height: 16px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: var(--ui-segc-text);
  animation: ui-segc-in 200ms var(--ui-segc-ease) both;
}
.ui-segc__opt[data-active] .ui-segc__count { background: var(--ui-segc-card); box-shadow: 0 0 0 0.5px var(--ui-segc-line); color: var(--ui-segc-ink); }
.ui-segc[data-size="sm"] .ui-segc__count { min-width: 14px; height: 14px; padding: 0 3px; border-radius: 4px; font-size: 10px; line-height: 14px; }
.ui-segc__badge {
  display: inline-flex;
  align-items: center;
  height: 18px;
  padding: 0 6px;
  border-radius: 5px;
  background: var(--ui-segc-accent-soft);
  font-size: 11px;
  line-height: 16px;
  font-weight: 500;
  color: var(--ui-segc-accent);
}
.ui-segc[data-size="sm"] .ui-segc__badge { height: 16px; padding: 0 5px; font-size: 10px; }

/* The indicator: left and right edges slide separately – the one facing the target leads a touch. Short and crisp */
.ui-segc__pill {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 100%;
  z-index: 0;
  border-radius: 6px;
  background: var(--ui-segc-fill);
  opacity: 0;
  pointer-events: none;
  transition: left 200ms var(--ui-segc-ease), right 200ms var(--ui-segc-ease), scale 120ms var(--ui-segc-ease), opacity 120ms ease;
}
.ui-segc__pill[data-dir="right"] { transition-duration: 220ms, 160ms, 120ms, 120ms; }
.ui-segc__pill[data-dir="left"] { transition-duration: 160ms, 220ms, 120ms, 120ms; }
/* Press feedback: the indicator gives a little while held or dragged */
.ui-segc[data-pressed]:not([data-variant="underline"]) .ui-segc__pill { scale: 0.97; }

/* Buttons (default): separate chips with a hairline; the light-gray fill slides to the active one.
   The control reaches a few px past its box so focus rings are never clipped, and still lines up with its neighbours */
.ui-segc[data-variant="buttons"] { --ui-segc-pad: var(--ui-segc-ring); margin: calc(var(--ui-segc-ring) * -1); max-width: calc(100% + var(--ui-segc-ring) * 2); }
.ui-segc[data-variant="buttons"][data-full] { width: calc(100% + var(--ui-segc-ring) * 2); }
.ui-segc[data-variant="buttons"] .ui-segc__track { gap: var(--ui-segc-gap); }
.ui-segc[data-variant="buttons"] .ui-segc__opt { box-shadow: inset 0 0 0 0.5px var(--ui-segc-line); }

/* Tray: a compact light-gray track with a white raised pill */
.ui-segc[data-variant="tray"] { background: var(--ui-segc-track); }
.ui-segc[data-variant="tray"] .ui-segc__opt { height: calc(var(--ui-segc-h) - var(--ui-segc-pad) * 2); }
.ui-segc[data-variant="tray"] .ui-segc__pill { background: var(--ui-segc-card); box-shadow: var(--ui-segc-card-shadow); }

/* Underline: text tabs on a hairline */
.ui-segc[data-variant="underline"] { --ui-segc-px: 2px; --ui-segc-gap: 20px; border-radius: 0; box-shadow: inset 0 -0.5px 0 var(--ui-segc-line); }
.ui-segc[data-variant="underline"] .ui-segc__scroller { padding: 0; }
.ui-segc[data-variant="underline"]:not([data-full]) .ui-segc__track { gap: var(--ui-segc-gap); }
.ui-segc[data-variant="underline"][data-full] { --ui-segc-px: 10px; }
.ui-segc[data-variant="underline"] .ui-segc__opt { height: calc(var(--ui-segc-h) + 6px); }
.ui-segc[data-variant="underline"] .ui-segc__opt:focus-visible { outline-offset: -2px; }
.ui-segc[data-variant="underline"] .ui-segc__pill { top: auto; height: 1.5px; border-radius: 1.5px 1.5px 0 0; background: var(--ui-segc-ink); }
@media (hover: hover) {
  .ui-segc[data-variant="underline"] .ui-segc__opt:not([data-active]):not(:disabled):hover { background-color: transparent; color: var(--ui-segc-hover-text); }
}

@keyframes ui-segc-in { from { opacity: 0; transform: translateY(2px); filter: blur(2px); } to { opacity: 1; transform: none; filter: none; } }

/* Touch screens: every option at least 40px tall */
@media (hover: none) and (pointer: coarse) {
  .ui-segc[data-size] { --ui-segc-h: 40px; }
  .ui-segc[data-size="lg"] { --ui-segc-h: 44px; }
  .ui-segc[data-variant="tray"][data-size] { --ui-segc-h: 44px; }
  .ui-segc[data-variant="underline"] .ui-segc__opt { height: var(--ui-segc-h); }
}
@media (prefers-reduced-motion: reduce) {
  .ui-segc *, .ui-segc *::before, .ui-segc *::after { animation: none !important; transition: none !important; }
}

/* Dark mode: follows a .dark class or data-theme="dark" on any ancestor, e.g. <html> */
:where(.dark, [data-theme="dark"]) .ui-segc {
  --ui-segc-ink: rgba(255, 255, 255, 0.9);
  --ui-segc-text: rgba(255, 255, 255, 0.62);
  --ui-segc-hover-text: rgba(255, 255, 255, 0.78);
  --ui-segc-line: rgba(255, 255, 255, 0.08);
  --ui-segc-wash: rgba(255, 255, 255, 0.04);
  --ui-segc-fill: rgba(255, 255, 255, 0.08);
  --ui-segc-track: rgba(255, 255, 255, 0.05);
  --ui-segc-card: #2c2c2f;
  --ui-segc-card-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.1), 0 1px 2px rgba(0, 0, 0, 0.4);
  --ui-segc-accent: #4d8dff;
  --ui-segc-accent-soft: rgba(77, 141, 255, 0.14);
  --ui-segc-focus: rgba(77, 141, 255, 0.45);
}
:where(.dark, [data-theme="dark"]) .ui-segc__icon { color: rgba(255, 255, 255, 0.46); }
:where(.dark, [data-theme="dark"]) .ui-segc__opt[data-active] .ui-segc__icon { color: var(--ui-segc-ink); }
`;function og({title:e="Getting started",steps:t,autoPlay:n=!1,interval:i=2200,onChange:r,className:o}){const[s,c]=_.useState(()=>new Set(t.filter(E=>E.done).map(E=>E.id))),[l,f]=_.useState(n),x=_.useRef(new Set(t.map(E=>E.id))),v=t.map(E=>E.id).join("|");_.useEffect(()=>{const E=t.filter(p=>!x.current.has(p.id));E.forEach(p=>x.current.add(p.id)),E.some(p=>p.done)&&c(p=>new Set([...p,...E.filter(d=>d.done).map(d=>d.id)]))},[v]);const g=t.length,b=t.filter(E=>s.has(E.id)).length,w=g?b/g:0,j=E=>{const p=new Set(s);p.has(E)?p.delete(E):p.add(E),c(p),r==null||r(t.map(d=>({...d,done:p.has(d.id)})))};return _.useEffect(()=>{if(!l)return;const E=t.find(d=>!s.has(d.id)),p=window.setTimeout(()=>{E?j(E.id):c(new Set(t.filter(d=>d.done).map(d=>d.id)))},E?i:i*2);return()=>clearTimeout(p)},[l,s]),a.jsxs("div",{className:["ui-progressc",o].filter(Boolean).join(" "),"data-complete":b===g||void 0,onPointerDown:()=>f(!1),onKeyDown:()=>f(!1),children:[a.jsx("style",{href:"ui-progress-tracker-clean",precedence:"default",children:sg}),a.jsxs("div",{className:"ui-progressc__head",children:[a.jsx("h3",{className:"ui-progressc__title",dir:"auto",title:e,children:e}),a.jsxs("span",{className:"ui-progressc__count","aria-hidden":"true",children:[a.jsx("span",{className:"ui-progressc__digit",children:Or.format(b)},b),"/",Or.format(g)]})]}),a.jsx("div",{className:"ui-progressc__bar",role:"progressbar","aria-label":e,"aria-valuemin":0,"aria-valuemax":g,"aria-valuenow":b,"aria-valuetext":`${Or.format(b)} of ${Or.format(g)} done`,children:a.jsx("span",{className:"ui-progressc__fill",style:{transform:`scaleX(${w})`},children:a.jsx("span",{className:"ui-progressc__shine"},b)})}),a.jsx("ul",{className:"ui-progressc__list",children:t.map((E,p)=>{const d=s.has(E.id);return a.jsx("li",{style:{animationDelay:`${180+Math.min(p,12)*90}ms`},children:a.jsxs("button",{type:"button",role:"checkbox","aria-checked":d,className:"ui-progressc__step",onClick:()=>j(E.id),children:[a.jsx("span",{className:"ui-progressc__check","aria-hidden":"true",children:a.jsx("svg",{viewBox:"0 0 24 24",children:a.jsx("path",{d:"M6.5 12.5l3.5 3.5 7.5-8",pathLength:1})})}),a.jsx("span",{className:"ui-progressc__label",title:E.label||void 0,children:a.jsx("span",{dir:"auto",children:E.label||" "})}),E.icon&&a.jsx("span",{className:"ui-progressc__icon","aria-hidden":"true",children:E.icon})]})},E.id)})})]})}const Or=new Intl.NumberFormat("en"),sg=`
/* Colors and motion as variables – override them on .ui-progressc (see Theming in the docs) */
.ui-progressc {
  --ui-pgc-card: #ffffff;
  --ui-pgc-strong: #000000;
  --ui-pgc-ink: rgba(0, 0, 0, 0.88);
  --ui-pgc-muted: rgba(0, 0, 0, 0.45);
  --ui-pgc-faint: rgba(0, 0, 0, 0.27);
  --ui-pgc-icon: rgba(0, 0, 0, 0.447);
  --ui-pgc-ring: rgba(0, 0, 0, 0.2);
  --ui-pgc-track: rgba(0, 0, 0, 0.06);
  --ui-pgc-hover: rgba(0, 0, 0, 0.03);
  --ui-pgc-accent: rgba(0, 96, 226, 0.765);
  --ui-pgc-on-accent: #ffffff;
  --ui-pgc-shine: rgba(255, 255, 255, 0.82);
  --ui-pgc-focus: rgba(0, 96, 226, 0.35);
  /* Strokes are shadows: a 0.5px hairline plus a soft lift */
  --ui-pgc-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.06), 0 1px 1px -1px rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --ui-pgc-ease: cubic-bezier(0.22, 1, 0.36, 1);

  container-type: inline-size;
  box-sizing: border-box;
  width: 100%;
  max-width: 340px;
  padding: 14px 6px 6px;
  background: var(--ui-pgc-card);
  border-radius: 10px;
  box-shadow: var(--ui-pgc-shadow);
  font-family: "Inter", "InterVariable", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  color: var(--ui-pgc-ink);
  text-align: left;
  -webkit-font-smoothing: antialiased;
}
.ui-progressc *,
.ui-progressc *::before,
.ui-progressc *::after {
  box-sizing: border-box;
}
:where(.ui-progressc) button {
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  letter-spacing: inherit;
  color: inherit;
  cursor: pointer;
}

/* Header: the title and a quiet counter */
.ui-progressc__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 0 10px;
}
.ui-progressc__title {
  margin: 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--ui-pgc-strong);
  font-size: 15px;
  font-weight: 500;
  line-height: 24px;
}
.ui-progressc__count {
  font-size: 12px;
  line-height: 16px;
  color: var(--ui-pgc-muted);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
/* The number rolls in from below whenever it changes */
.ui-progressc__digit {
  display: inline-block;
  color: var(--ui-pgc-ink);
  animation: ui-progressc-roll 560ms var(--ui-pgc-ease);
}

/* A thin blue bar on a gray track */
.ui-progressc__bar {
  position: relative;
  height: 4px;
  margin: 10px 10px 8px;
  border-radius: 2px;
  background: var(--ui-pgc-track);
  overflow: hidden;
}
.ui-progressc__fill {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--ui-pgc-accent);
  transform-origin: 0 50%;
  overflow: hidden;
  transition: transform 1100ms var(--ui-pgc-ease);
}
/* A light band – always lighter than the bar – sweeps across */
.ui-progressc__shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 30%, var(--ui-pgc-shine) 50%, transparent 70%) 0 0 / 220% 100%
    no-repeat;
  animation: ui-progressc-shine 1400ms ease-out both;
}

.ui-progressc__list {
  display: grid;
  /* One column that never grows past the card, so long labels shorten instead of pushing rows out */
  grid-template-columns: minmax(0, 1fr);
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}
/* On mount the card settles in, then the rows fade up one after another */
.ui-progressc {
  animation: ui-progressc-in 520ms var(--ui-pgc-ease) both;
}
.ui-progressc__list > li {
  position: relative;
  animation: ui-progressc-row-in 640ms var(--ui-pgc-ease) both;
}

.ui-progressc__step {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 6px 10px;
  border-radius: 6px;
  background: transparent;
  font-size: 13px;
  line-height: 20px;
  text-align: left;
  transition: background-color 90ms ease-out;
}
.ui-progressc__step:hover {
  background: var(--ui-pgc-hover);
}
.ui-progressc__step:focus-visible {
  outline: 2px solid var(--ui-pgc-focus);
  outline-offset: 0;
}

/* Checkbox: a hairline ring that fills blue and pops, then the tick draws itself */
.ui-progressc__check {
  position: relative;
  flex: none;
  display: grid;
  place-items: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: transparent;
  box-shadow: inset 0 0 0 1px var(--ui-pgc-ring);
  transition:
    background-color 220ms var(--ui-pgc-ease),
    box-shadow 220ms var(--ui-pgc-ease);
}
.ui-progressc__check svg {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: var(--ui-pgc-on-accent);
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  transition: stroke-dashoffset 120ms ease-in;
}
.ui-progressc__step[aria-checked="true"] .ui-progressc__check {
  background: var(--ui-pgc-accent);
  box-shadow: inset 0 0 0 1px transparent;
  animation: ui-progressc-pop 560ms var(--ui-pgc-ease);
}
.ui-progressc__step[aria-checked="true"] .ui-progressc__check svg {
  stroke-dashoffset: 0;
  transition: stroke-dashoffset 420ms var(--ui-pgc-ease) 160ms;
}

/* Label: grays out while a thin line strikes through it */
.ui-progressc__label {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 300ms ease;
}
.ui-progressc__label > span {
  background: linear-gradient(var(--ui-pgc-faint), var(--ui-pgc-faint)) 0 60% / 0% 1px no-repeat;
  transition: background-size 380ms var(--ui-pgc-ease);
}
.ui-progressc__step[aria-checked="true"] .ui-progressc__label {
  color: var(--ui-pgc-muted);
}
.ui-progressc__step[aria-checked="true"] .ui-progressc__label > span {
  background-size: 100% 1px;
  transition: background-size 620ms var(--ui-pgc-ease) 220ms;
}

.ui-progressc__icon {
  flex: none;
  display: grid;
  place-items: center;
  width: 16px;
  height: 16px;
  color: var(--ui-pgc-icon);
  transition: opacity 300ms ease;
}
/* Any icon – an svg or an image of any shape – fits its 16px tile */
.ui-progressc__icon {
  overflow: hidden;
}
.ui-progressc__icon > :is(svg, img) {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.ui-progressc__step[aria-checked="true"] .ui-progressc__icon {
  opacity: 0.45;
}

/* Touch screens: taller rows */
@media (pointer: coarse) {
  .ui-progressc__step {
    padding-top: 10px;
    padding-bottom: 10px;
  }
}
/* Narrow cards: a little less inset */
@container (max-width: 300px) {
  .ui-progressc__head { padding: 0 8px; }
  .ui-progressc__bar { margin-left: 8px; margin-right: 8px; }
  .ui-progressc__step { padding-left: 8px; padding-right: 8px; }
}

@keyframes ui-progressc-pop {
  0% { transform: scale(0.9); }
  60% { transform: scale(1.08); }
  100% { transform: scale(1); }
}
@keyframes ui-progressc-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
}
@keyframes ui-progressc-row-in {
  from {
    opacity: 0;
    filter: blur(3px);
    transform: translateY(8px);
  }
}
@keyframes ui-progressc-roll {
  from { opacity: 0; transform: translateY(60%); }
  to { opacity: 1; transform: none; }
}
@keyframes ui-progressc-shine {
  from { background-position: 120% 0; opacity: 1; }
  to { background-position: -20% 0; opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .ui-progressc,
  .ui-progressc *,
  .ui-progressc *::before,
  .ui-progressc *::after {
    animation: none !important;
    transition-duration: 1ms !important;
    transition-delay: 0ms !important;
  }
}

/* Dark mode: follows a .dark class or data-theme="dark" on any ancestor, e.g. <html> */
:where(.dark, [data-theme="dark"]) .ui-progressc {
  --ui-pgc-card: #1c1c1e;
  --ui-pgc-strong: #ffffff;
  --ui-pgc-ink: rgba(255, 255, 255, 0.9);
  --ui-pgc-muted: rgba(255, 255, 255, 0.46);
  --ui-pgc-faint: rgba(255, 255, 255, 0.3);
  --ui-pgc-icon: rgba(255, 255, 255, 0.5);
  --ui-pgc-ring: rgba(255, 255, 255, 0.24);
  --ui-pgc-track: rgba(255, 255, 255, 0.08);
  --ui-pgc-hover: rgba(255, 255, 255, 0.04);
  --ui-pgc-accent: #4d8dff;
  --ui-pgc-on-accent: #ffffff;
  --ui-pgc-shine: #ffffff;
  --ui-pgc-focus: rgba(77, 141, 255, 0.5);
  --ui-pgc-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.4);
}
`,ko=["No signal","Weak signal","Good signal","Strong signal"],Br=e=>{const t=Math.round(Number(e));return Number.isFinite(t)?Math.min(3,Math.max(0,t)):0},lg=e=>new RegExp("^\\p{Lu}\\p{Ll}","u").test(e)?e.charAt(0).toLowerCase()+e.slice(1):e;function cg({title:e="Smart recommendation",options:t,onAccept:n,onUndo:i,defaultOpen:r=!0,className:o}){const[s,c]=_.useState(0),[l,f]=_.useState(null),[x,v]=_.useState(r),[g,b]=_.useState(!1),w=_.useRef(null),[j,E]=_.useState(!1);_.useLayoutEffect(()=>{const N=w.current,T=N==null?void 0:N.querySelector(".ui-src__menu"),H=N==null?void 0:N.closest(".ui-src");if(!g||!N||!T||!H||getComputedStyle(N).position==="static")return E(!1);E(N.getBoundingClientRect().right-T.offsetWidth<H.getBoundingClientRect().left-24)},[g]),_.useEffect(()=>{if(!g)return;const N=H=>{var U;return!((U=w.current)!=null&&U.contains(H.target))&&b(!1)},T=H=>H.key==="Escape"&&b(!1);return window.addEventListener("pointerdown",N),window.addEventListener("keydown",T),()=>{window.removeEventListener("pointerdown",N),window.removeEventListener("keydown",T)}},[g]);const p=s<t.length?s:0,d=t[p];if(!d)return null;const m=p===0,y=l===p,R=Br(d.signal),I=`Accept ${lg(String(d.label))}`;return a.jsxs(a.Fragment,{children:[a.jsx("style",{href:"ui-smart-recommendation-clean",precedence:"default",children:dg}),a.jsxs("section",{className:["ui-src",o].filter(Boolean).join(" "),"aria-label":e,"data-accepted":y||void 0,children:[a.jsxs("button",{type:"button",className:"ui-src__head","aria-expanded":x,onClick:()=>v(N=>!N),children:[a.jsx(ug,{}),a.jsx("span",{className:"ui-src__title",dir:"auto",title:e,children:e}),!m&&a.jsx("span",{className:"ui-src__pill",children:"Alternative"}),a.jsx("span",{className:"ui-src__chevron",children:a.jsx(Hr,{d:"m4.5 6.25 3.5 3.5 3.5-3.5"})})]}),a.jsx("div",{className:"ui-src__body","data-open":x||void 0,inert:!x,children:a.jsx("p",{className:"ui-src__reason",dir:"auto",children:d.reason},p)}),a.jsxs("footer",{className:"ui-src__foot",children:[a.jsxs("span",{className:"ui-src__signal","data-level":R,title:ko[R],children:[a.jsx("span",{className:"ui-src__bars","aria-hidden":"true",children:[1,2,3].map(N=>a.jsx("span",{"data-on":R>=N||void 0},N))}),ko[R]]}),a.jsxs("div",{className:"ui-src__actions",children:[t.length>1&&!y&&a.jsxs("div",{className:"ui-src__alt",ref:w,children:[a.jsxs("button",{type:"button",className:"ui-src__btn ui-src__btn--icon","aria-haspopup":"menu","aria-expanded":g,onClick:()=>b(N=>!N),children:[a.jsx(Hr,{d:"M5 12.5v-9M2.75 5.75 5 3.5l2.25 2.25M11 3.5v9M8.75 10.25 11 12.5l2.25-2.25"}),"Alternatives"]}),g&&a.jsx("div",{className:"ui-src__menu",role:"menu","data-flip":j||void 0,children:t.map((N,T)=>a.jsxs("button",{type:"button",role:"menuitemradio","aria-checked":T===p,className:"ui-src__option",onClick:()=>{c(T),b(!1),v(!0)},children:[a.jsxs("span",{className:"ui-src__option-label",children:[a.jsx("span",{className:"ui-src__option-name",dir:"auto",title:N.label,children:N.label}),T===0&&a.jsx("span",{className:"ui-src__tag",children:"Recommended"})]}),a.jsx("span",{className:"ui-src__mini","data-level":Br(N.signal),"aria-label":ko[Br(N.signal)],children:[1,2,3].map(H=>a.jsx("span",{"data-on":Br(N.signal)>=H||void 0},H))})]},`${N.id}-${T}`))})]}),y?a.jsxs(a.Fragment,{children:[a.jsxs("span",{className:"ui-src__done",role:"status",children:[a.jsx(Hr,{d:"m3.5 8.5 3 3 6-7"}),a.jsxs("span",{className:"ui-src__done-text",title:`${d.label} accepted`,children:[a.jsx("bdi",{children:d.label})," accepted"]})]}),a.jsxs("button",{type:"button",className:"ui-src__btn ui-src__btn--icon",onClick:()=>{f(null),i==null||i(d)},children:[a.jsx(Hr,{d:"M3.5 6.5h6.25a2.75 2.75 0 0 1 0 5.5H8M5.75 4.25 3.5 6.5l2.25 2.25"}),"Undo"]})]}):a.jsx("button",{type:"button",className:"ui-src__btn ui-src__btn--primary",title:I,onClick:()=>{f(p),b(!1),n==null||n(d)},children:a.jsx("span",{className:"ui-src__btn-text",children:I})})]})]})]})]})}const ug=()=>a.jsxs("svg",{viewBox:"0 0 16 16",className:"ui-src__mark","aria-hidden":"true",children:[a.jsx("path",{d:"M6.5 2.2c.2 0 .36.14.4.33.53 2.6 1.4 3.48 4 4.02a.4.4 0 0 1 0 .79c-2.6.53-3.47 1.4-4 4a.4.4 0 0 1-.8 0c-.53-2.6-1.4-3.47-4-4a.4.4 0 0 1 0-.79c2.6-.54 3.47-1.42 4-4.02a.4.4 0 0 1 .4-.33Z"}),a.jsx("path",{d:"M12 9.6c.12 0 .22.08.25.2.28 1.3.72 1.75 2.03 2.03a.25.25 0 0 1 0 .49c-1.31.28-1.75.72-2.03 2.03a.25.25 0 0 1-.5 0c-.28-1.31-.72-1.75-2.03-2.03a.25.25 0 0 1 0-.49c1.31-.28 1.75-.73 2.03-2.03a.25.25 0 0 1 .25-.2Z"})]}),Hr=({d:e})=>a.jsx("svg",{viewBox:"0 0 16 16",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"1.1",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:a.jsx("path",{d:e})}),dg=`
/* Colors and motion as variables – override them on .ui-src */
.ui-src {
  --ui-src-card: #ffffff;
  --ui-src-strong: #000000;
  --ui-src-ink: rgba(0, 0, 0, 0.88);
  --ui-src-text: rgba(0, 0, 0, 0.61);
  --ui-src-muted: rgba(0, 0, 0, 0.45);
  --ui-src-faint: rgba(0, 0, 0, 0.27);
  --ui-src-icon: rgba(0, 0, 0, 0.447);
  --ui-src-line: rgba(0, 0, 0, 0.06);
  --ui-src-wash: rgba(0, 0, 0, 0.03);
  --ui-src-fill: rgba(0, 0, 0, 0.06);
  --ui-src-bar: rgba(0, 0, 0, 0.1);
  --ui-src-accent: rgba(0, 96, 226, 0.765);
  --ui-src-accent-bg: rgba(0, 96, 226, 0.05);
  --ui-src-accent-line: rgba(0, 96, 226, 0.35);
  --ui-src-tag: rgba(0, 96, 226, 0.08);
  --ui-src-alt: #5b5bd6;
  --ui-src-alt-bg: rgba(91, 91, 214, 0.1);
  --ui-src-ok: #1a9a52;
  --ui-src-ok-bg: rgba(26, 154, 82, 0.08);
  --ui-src-warn: #e8a20c;
  --ui-src-solid: rgba(0, 0, 0, 0.88);
  --ui-src-solid-hover: rgba(0, 0, 0, 0.8);
  --ui-src-on-solid: #fcfcfc;
  /* Strokes are shadows: a 0.5px hairline plus a soft lift */
  --ui-src-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.06), 0 1px 1px -1px rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --ui-src-shadow-hover: 0 0 0 0.5px rgba(0, 0, 0, 0.1), 0 1px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 3px 0 rgba(0, 0, 0, 0.07);
  --ui-src-shadow-pop: 0 0 0 0.5px rgba(0, 0, 0, 0.08), 0 12px 28px -10px rgba(0, 0, 0, 0.16), 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --ui-src-focus: rgba(0, 96, 226, 0.35);
  --ui-src-ease: cubic-bezier(0.22, 1, 0.36, 1);
  box-sizing: border-box;
  container-type: inline-size;
  width: 100%;
  max-width: 440px;
  /* One white card – the edge is a shadow, not a border */
  border-radius: 10px;
  background: var(--ui-src-card);
  box-shadow: var(--ui-src-shadow);
  font-family: "Inter", "InterVariable", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  color: var(--ui-src-ink);
  text-align: left;
  -webkit-font-smoothing: antialiased;
}
.ui-src *, .ui-src *::before, .ui-src *::after { box-sizing: border-box; }
:where(.ui-src) button { margin: 0; padding: 0; border: 0; background: none; font: inherit; color: inherit; cursor: pointer; -webkit-tap-highlight-color: transparent; }
:where(.ui-src) svg { display: block; flex: none; }
.ui-src button:focus-visible { outline: 2px solid var(--ui-src-focus); outline-offset: 1px; }

/* The heading row folds the reason in and out */
.ui-src__head {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 44px;
  padding: 0 12px 0 16px;
  border-radius: 10px 10px 0 0;
  text-align: left;
  transition: background-color 140ms ease;
}
.ui-src__head:hover { background: var(--ui-src-wash); }
.ui-src button.ui-src__head:focus-visible { outline-offset: -2px; }
.ui-src__mark { width: 16px; height: 16px; fill: var(--ui-src-accent); }
.ui-src__title { min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-weight: 500; color: var(--ui-src-strong); }
.ui-src__pill {
  flex: none;
  padding: 0 6px;
  border-radius: 5px;
  background: var(--ui-src-alt-bg);
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  color: var(--ui-src-alt);
  animation: ui-src-swap 300ms var(--ui-src-ease);
}
.ui-src__chevron {
  display: grid;
  place-items: center;
  flex: none;
  width: 20px;
  height: 20px;
  margin-left: auto;
  color: var(--ui-src-icon);
  transition: transform 280ms var(--ui-src-ease), color 140ms ease;
}
.ui-src__head:hover .ui-src__chevron { color: var(--ui-src-ink); }
.ui-src__head[aria-expanded="false"] .ui-src__chevron { transform: rotate(-90deg); }

/* Only the reason folds – the last row never gets clipped */
.ui-src__body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 340ms var(--ui-src-ease);
}
.ui-src__body[data-open] { grid-template-rows: 1fr; }
.ui-src__reason {
  min-height: 0;
  overflow: hidden;
  margin: 0;
  padding: 0 16px;
  font-size: 13px;
  line-height: 20px;
  color: var(--ui-src-text);
  text-align: start;
  white-space: pre-line;
  overflow-wrap: anywhere;
  animation: ui-src-swap 360ms var(--ui-src-ease);
}
.ui-src__body[data-open] .ui-src__reason { padding-bottom: 14px; }
.ui-src__reason strong { font-weight: 500; color: var(--ui-src-ink); }

/* The last row: the signal on the left, the actions on the right */
.ui-src__foot {
  display: flex;
  align-items: center;
  /* Narrow cards: the actions move below the signal instead of running out of the card */
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px 10px;
  min-height: 48px;
  padding: 10px 10px 10px 16px;
  border-top: 0.5px solid var(--ui-src-line);
}
.ui-src__signal {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  line-height: 16px;
  white-space: nowrap;
  color: var(--ui-src-text);
}
.ui-src__bars, .ui-src__mini { display: inline-flex; align-items: flex-end; gap: 2px; }
.ui-src__bars span, .ui-src__mini span {
  width: 3px;
  border-radius: 1px;
  background: var(--ui-src-bar);
  transition: background-color 260ms ease;
}
.ui-src__bars span:nth-child(1), .ui-src__mini span:nth-child(1) { height: 5px; }
.ui-src__bars span:nth-child(2), .ui-src__mini span:nth-child(2) { height: 8px; }
.ui-src__bars span:nth-child(3), .ui-src__mini span:nth-child(3) { height: 11px; }
.ui-src [data-level="1"] > span[data-on] { background: var(--ui-src-warn); }
.ui-src [data-level="2"] > span[data-on] { background: var(--ui-src-accent); }
.ui-src [data-level="3"] > span[data-on] { background: var(--ui-src-ok); }
.ui-src [data-level="0"] > span:first-child { background: var(--ui-src-faint); }

/* Never wider than the row – a long label shortens in its button instead of running out of the card */
.ui-src__actions { display: flex; align-items: center; gap: 8px; min-width: 0; max-width: 100%; margin-left: auto; }
.ui-src__alt, .ui-src__btn--icon { flex: none; }

/* Secondary: white with the card's hairline shadow */
.ui-src__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 28px;
  padding: 0 10px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  min-width: 0;
  max-width: 100%;
  white-space: nowrap;
  transition: background-color 140ms ease, box-shadow 140ms ease, transform 160ms var(--ui-src-ease);
}
.ui-src__btn-text { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
:where(.ui-src) .ui-src__btn { background: var(--ui-src-card); box-shadow: var(--ui-src-shadow); color: var(--ui-src-strong); }
.ui-src__btn--icon { padding: 0 10px 0 8px; }
.ui-src__btn--icon svg { color: var(--ui-src-icon); }
.ui-src__btn:hover { box-shadow: var(--ui-src-shadow-hover); }
.ui-src__btn[aria-expanded="true"] { background: var(--ui-src-wash); }
.ui-src__btn:active { transform: scale(0.97); }
/* Primary: a dark chip */
:where(.ui-src) .ui-src__btn--primary { background: var(--ui-src-solid); box-shadow: none; color: var(--ui-src-on-solid); }
.ui-src__btn--primary:hover { background: var(--ui-src-solid-hover); box-shadow: none; }

/* Accepted: a minimal green fill in the place of the button */
.ui-src__done {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  height: 28px;
  padding: 0 10px 0 8px;
  border-radius: 6px;
  background: var(--ui-src-ok-bg);
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  color: var(--ui-src-ok);
  animation: ui-src-swap 300ms var(--ui-src-ease);
}
.ui-src__done-text { min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }

/* Alternatives: a white popover above the button */
.ui-src__alt { position: relative; }
.ui-src__menu {
  position: absolute;
  bottom: calc(100% + 6px);
  right: 0;
  z-index: 5;
  display: grid;
  gap: 2px;
  /* The column never grows with a long name; a long list scrolls */
  grid-template-columns: minmax(0, 1fr);
  width: 248px;
  max-height: min(320px, 60vh);
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 4px;
  border-radius: 10px;
  background: var(--ui-src-card);
  box-shadow: var(--ui-src-shadow-pop);
  animation: ui-src-drop 180ms var(--ui-src-ease);
}
.ui-src__menu[data-flip] { right: auto; left: 0; }
/* Narrow: the actions sit on their own row – the menu lines up with its right edge so it stays inside */
@container (max-width: 420px) {
  .ui-src__actions { position: relative; }
  .ui-src__alt { position: static; }
  .ui-src__menu { width: min(248px, 100cqw - 20px); }
}
.ui-src__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  height: 32px;
  padding: 0 10px 0 8px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 20px;
  text-align: left;
  color: var(--ui-src-ink);
  transition: background-color 90ms ease-out;
}
.ui-src__option:hover { background: var(--ui-src-wash); }
/* The chosen one: a light blue fill with a hairline */
.ui-src__option[aria-checked="true"] { background: var(--ui-src-accent-bg); box-shadow: inset 0 0 0 0.5px var(--ui-src-accent-line); }
.ui-src button.ui-src__option:focus-visible { outline-offset: -2px; }
.ui-src__option-label { display: inline-flex; flex: 0 1 auto; align-items: center; gap: 6px; min-width: 0; }
.ui-src__mini { flex: none; }
.ui-src__option-name { min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.ui-src__tag {
  flex: none;
  padding: 0 5px;
  border-radius: 5px;
  background: var(--ui-src-tag);
  font-size: 11px;
  font-weight: 500;
  line-height: 18px;
  color: var(--ui-src-accent);
}

@keyframes ui-src-swap { from { opacity: 0; transform: translateY(2px); } }
@keyframes ui-src-drop { from { opacity: 0; transform: translateY(4px) scale(0.98); } }

/* Narrow cards (phones) */
@container (max-width: 340px) {
  .ui-src__head { padding: 0 10px 0 14px; }
  .ui-src__reason { padding: 0 14px; }
  .ui-src__foot { padding: 10px 10px 10px 14px; }
}
/* Touch screens: bigger tap targets */
@media (pointer: coarse) {
  .ui-src__head { height: 48px; }
  .ui-src__btn, .ui-src__done { height: 36px; }
  .ui-src__btn { padding: 0 14px; }
  .ui-src__btn--icon, .ui-src__done { padding: 0 14px 0 12px; }
  .ui-src__option { height: 40px; }
}

@media (prefers-reduced-motion: reduce) {
  .ui-src__reason, .ui-src__done, .ui-src__menu, .ui-src__pill { animation: none; }
  .ui-src__body, .ui-src__chevron { transition: none; }
}

/* Dark mode: follows a .dark class or data-theme="dark" on any ancestor, e.g. <html> */
:where(.dark, [data-theme="dark"]) .ui-src {
  --ui-src-card: #1c1c1e;
  --ui-src-strong: #ffffff;
  --ui-src-ink: rgba(255, 255, 255, 0.9);
  --ui-src-text: rgba(255, 255, 255, 0.62);
  --ui-src-muted: rgba(255, 255, 255, 0.46);
  --ui-src-faint: rgba(255, 255, 255, 0.3);
  --ui-src-icon: rgba(255, 255, 255, 0.46);
  --ui-src-line: rgba(255, 255, 255, 0.08);
  --ui-src-wash: rgba(255, 255, 255, 0.04);
  --ui-src-fill: rgba(255, 255, 255, 0.08);
  --ui-src-bar: rgba(255, 255, 255, 0.14);
  --ui-src-accent: #4d8dff;
  --ui-src-accent-bg: rgba(77, 141, 255, 0.14);
  --ui-src-accent-line: rgba(77, 141, 255, 0.4);
  --ui-src-tag: rgba(77, 141, 255, 0.16);
  --ui-src-alt: #9d9dff;
  --ui-src-alt-bg: rgba(91, 91, 214, 0.22);
  --ui-src-ok: #3ec27a;
  --ui-src-ok-bg: rgba(26, 154, 82, 0.14);
  --ui-src-warn: #f0b232;
  /* The primary inverts: a light chip with dark text */
  --ui-src-solid: rgba(255, 255, 255, 0.9);
  --ui-src-solid-hover: rgba(255, 255, 255, 0.82);
  --ui-src-on-solid: #161618;
  --ui-src-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.4);
  --ui-src-shadow-hover: 0 0 0 0.5px rgba(255, 255, 255, 0.16), 0 1px 2px 0 rgba(0, 0, 0, 0.4);
  --ui-src-shadow-pop: 0 0 0 0.5px rgba(255, 255, 255, 0.1), 0 12px 28px -10px rgba(0, 0, 0, 0.6), 0 1px 2px 0 rgba(0, 0, 0, 0.4);
  --ui-src-focus: rgba(77, 141, 255, 0.5);
}
:where(.dark, [data-theme="dark"]) .ui-src__menu { background: #232326; }
`,Uc=new Intl.NumberFormat("en");function fg({title:e="Setup guide",groups:t,onEdit:n,onClose:i,onChange:r,className:o}){const[s,c]=_.useState(()=>new Set(t.flatMap(p=>p.tasks.filter(d=>d.done).map(d=>d.id)))),l=t.find(p=>p.tasks.some(d=>!s.has(d.id))),[f,x]=_.useState((l==null?void 0:l.id)??null),[v,g]=_.useState(!1),b=t.reduce((p,d)=>p+d.tasks.length,0),w=t.reduce((p,d)=>p+d.tasks.filter(m=>s.has(m.id)).length,0),j=b?Math.min(1,w/b):0,E=(p,d)=>{const m=new Set(s);if(m.has(d)?m.delete(d):m.add(d),c(m),r==null||r([...m]),p.tasks.every(y=>m.has(y.id))){const y=t.find(R=>R.tasks.some(I=>!m.has(I.id)));window.setTimeout(()=>x((y==null?void 0:y.id)??null),420)}};return a.jsxs(a.Fragment,{children:[a.jsx("style",{href:"ui-setup-guide-clean",precedence:"default",children:_g}),a.jsxs("section",{className:["ui-sgc",o].filter(Boolean).join(" "),"aria-label":e,children:[a.jsxs("header",{className:"ui-sgc__head",children:[a.jsx("h3",{className:"ui-sgc__title",title:e,dir:"auto",children:e}),a.jsxs("div",{className:"ui-sgc__actions",children:[n&&a.jsx("button",{type:"button",className:"ui-sgc__edit",onClick:n,children:"Edit"}),a.jsx("button",{type:"button",className:"ui-sgc__icon-btn","aria-label":v?"Expand setup guide":"Minimize setup guide","aria-expanded":!v,onClick:()=>g(p=>!p),children:v?a.jsx(gg,{}):a.jsx(hg,{})}),i&&a.jsx("button",{type:"button",className:"ui-sgc__icon-btn","aria-label":"Close setup guide",onClick:i,children:a.jsx(mg,{})})]})]}),a.jsxs("div",{className:"ui-sgc__progress",children:[a.jsx("span",{className:"ui-sgc__track",role:"progressbar","aria-label":`${e} progress`,"aria-valuemin":0,"aria-valuemax":100,"aria-valuenow":Math.round(j*100),children:a.jsx("span",{className:"ui-sgc__fill",style:{transform:`scaleX(${j})`}})}),a.jsxs("span",{className:"ui-sgc__count","aria-hidden":"true",children:[Uc.format(w),"/",Uc.format(b)]})]}),a.jsx("div",{className:"ui-sgc__body","data-hidden":v||void 0,children:a.jsx("div",{className:"ui-sgc__groups",children:t.map((p,d)=>{var T;const m=f===p.id,y=p.tasks.every(H=>s.has(H.id)),R=(T=p.tasks.find(H=>!s.has(H.id)))==null?void 0:T.id,I=p.tasks.findIndex(H=>H.id===R),N=`ui-sgc-${p.id}`;return a.jsxs("div",{className:"ui-sgc__group","data-open":m||void 0,children:[a.jsxs("button",{type:"button",className:"ui-sgc__group-head","aria-expanded":m,"aria-controls":N,onClick:()=>x(m?null:p.id),children:[a.jsx("span",{className:"ui-sgc__group-title","data-done":y||void 0,dir:"auto",children:p.title}),a.jsx(pg,{})]}),a.jsx("div",{className:"ui-sgc__panel",id:N,inert:!m,children:a.jsx("ul",{className:"ui-sgc__tasks",children:p.tasks.map((H,U)=>{const S=s.has(H.id),q=!S&&I!==-1&&U>I,ne=S?"done":q?"locked":"current";return a.jsx("li",{children:a.jsxs("button",{type:"button",className:"ui-sgc__task","data-state":ne,disabled:q,"aria-pressed":S,onClick:()=>E(p,H.id),children:[a.jsx("span",{className:"ui-sgc__mark","aria-hidden":"true",children:ne==="done"?a.jsx(xg,{}):ne==="locked"?a.jsx(vg,{}):null}),a.jsx("span",{className:"ui-sgc__task-label",dir:"auto",children:H.label})]})},`${U}-${H.id}`)})})})]},`${d}-${p.id}`)})})})]})]})}const pg=()=>a.jsx("svg",{className:"ui-sgc__chevron",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.3",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:a.jsx("path",{d:"m4.5 6.25 3.5 3.5 3.5-3.5"})}),hg=()=>a.jsx("svg",{viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:a.jsx("path",{d:"M9.5 2.5v4h4M9.5 6.5l4.5-4.5M6.5 13.5v-4h-4M6.5 9.5 2 14"})}),gg=()=>a.jsx("svg",{viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:a.jsx("path",{d:"M10 2h4v4M14 2 9.5 6.5M6 14H2v-4M2 14l4.5-4.5"})}),mg=()=>a.jsx("svg",{viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round","aria-hidden":"true",children:a.jsx("path",{d:"m4 4 8 8M12 4l-8 8"})}),xg=()=>a.jsxs("svg",{viewBox:"0 0 16 16","aria-hidden":"true",children:[a.jsx("circle",{cx:"8",cy:"8",r:"7",fill:"currentColor"}),a.jsx("path",{d:"m5.2 8.2 1.9 1.9 3.7-3.9",fill:"none",stroke:"var(--ui-sgc-on-accent)",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round"})]}),vg=()=>a.jsx("svg",{viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.1","aria-hidden":"true",children:a.jsx("circle",{cx:"8",cy:"8",r:"6.5",strokeDasharray:"2 2"})}),_g=`
/* Colors and motion as variables – override them on .ui-sgc */
.ui-sgc {
  --ui-sgc-card: #ffffff;
  --ui-sgc-strong: #000000;
  --ui-sgc-ink: rgba(0, 0, 0, 0.88);
  --ui-sgc-text: rgba(0, 0, 0, 0.61);
  --ui-sgc-muted: rgba(0, 0, 0, 0.45);
  --ui-sgc-faint: rgba(0, 0, 0, 0.27);
  --ui-sgc-icon: rgba(0, 0, 0, 0.447);
  --ui-sgc-line: rgba(0, 0, 0, 0.06);
  --ui-sgc-fill: rgba(0, 0, 0, 0.06);
  --ui-sgc-ring: rgba(0, 0, 0, 0.2);
  --ui-sgc-wash: rgba(0, 0, 0, 0.03);
  --ui-sgc-open: rgba(0, 0, 0, 0.025);
  --ui-sgc-accent: rgba(0, 96, 226, 0.765);
  --ui-sgc-on-accent: #ffffff;
  --ui-sgc-focus: rgba(0, 96, 226, 0.35);
  /* Strokes are shadows: a 0.5px hairline plus a soft lift */
  --ui-sgc-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.06), 0 1px 1px -1px rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --ui-sgc-ease: cubic-bezier(0.22, 1, 0.36, 1);
  box-sizing: border-box;
  container-type: inline-size;
  width: 100%;
  max-width: 320px;
  border-radius: 10px;
  background: var(--ui-sgc-card);
  box-shadow: var(--ui-sgc-shadow);
  font-family: "Inter", "InterVariable", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  color: var(--ui-sgc-ink);
  -webkit-font-smoothing: antialiased;
}
.ui-sgc *, .ui-sgc *::before, .ui-sgc *::after { box-sizing: border-box; }
:where(.ui-sgc) button { margin: 0; padding: 0; border: 0; background: none; font: inherit; color: inherit; cursor: pointer; }
:where(.ui-sgc) svg { display: block; flex: none; }
.ui-sgc button:focus-visible { outline: 2px solid var(--ui-sgc-focus); outline-offset: 1px; }

/* ---- Header: title, Edit and the two ghost icon buttons ---- */
.ui-sgc__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 10px 0 16px;
}
.ui-sgc__title {
  overflow: hidden;
  min-width: 0;
  margin: 0;
  font-size: 15px;
  font-weight: 500;
  line-height: 24px;
  color: var(--ui-sgc-strong);
  text-align: start;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-sgc__actions { display: flex; flex: none; align-items: center; gap: 2px; }
.ui-sgc__edit {
  height: 28px;
  padding: 0 8px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  color: var(--ui-sgc-text);
  transition: background-color 100ms ease, color 100ms ease;
}
.ui-sgc__edit:hover { background: var(--ui-sgc-wash); color: var(--ui-sgc-ink); }
.ui-sgc__icon-btn {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  color: var(--ui-sgc-icon);
  transition: background-color 100ms ease, color 100ms ease;
}
.ui-sgc__icon-btn:hover { background: var(--ui-sgc-wash); color: var(--ui-sgc-ink); }
.ui-sgc__icon-btn svg { width: 16px; height: 16px; }

/* ---- One thin blue line for all tasks, with the count next to it ---- */
.ui-sgc__progress {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px 12px;
}
.ui-sgc__track {
  display: block;
  flex: 1;
  height: 4px;
  overflow: hidden;
  border-radius: 2px;
  background: var(--ui-sgc-fill);
}
.ui-sgc__fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--ui-sgc-accent);
  transform-origin: left center;
  transition: transform 700ms var(--ui-sgc-ease);
}
.ui-sgc__count {
  flex: none;
  font-size: 12px;
  line-height: 16px;
  font-variant-numeric: tabular-nums;
  color: var(--ui-sgc-muted);
}

/* ---- Minimize folds the whole list away (the hairline above it too) ---- */
.ui-sgc__body {
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows 420ms var(--ui-sgc-ease), opacity 260ms ease;
}
.ui-sgc__body[data-hidden] { grid-template-rows: 0fr; opacity: 0; }
.ui-sgc__groups {
  display: grid;
  gap: 2px;
  min-height: 0;
  overflow: hidden;
  padding: 0 4px;
  border-top: 0.5px solid var(--ui-sgc-line);
}
/* Inner padding as a spacer, so focus rings aren't cut and the fold can still close to 0 */
.ui-sgc__groups::before, .ui-sgc__groups::after { content: ""; display: block; height: 2px; }

.ui-sgc__group {
  border-radius: 8px;
  transition: background-color 200ms ease;
}
.ui-sgc__group[data-open] { background: var(--ui-sgc-open); }
.ui-sgc__group-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 8px 8px 8px 12px;
  border-radius: 8px;
  text-align: left;
  transition: background-color 100ms ease;
}
.ui-sgc__group-head:hover { background: var(--ui-sgc-wash); }
.ui-sgc__group[data-open] .ui-sgc__group-head:hover { background: none; }
.ui-sgc__group-title {
  position: relative;
  min-width: 0;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  color: var(--ui-sgc-strong);
  text-align: start;
  overflow-wrap: anywhere;
  transition: color 300ms ease;
}
.ui-sgc__group-title[data-done] { color: var(--ui-sgc-muted); }
/* Finished: a hairline draws through the title */
.ui-sgc__group-title::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 52%;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 420ms var(--ui-sgc-ease);
}
.ui-sgc__group-title[data-done]::after { transform: scaleX(1); }
.ui-sgc__chevron {
  width: 16px;
  height: 16px;
  margin-top: 2px;
  color: var(--ui-sgc-icon);
  transition: transform 320ms var(--ui-sgc-ease);
}
.ui-sgc__group[data-open] .ui-sgc__chevron { transform: rotate(180deg); }

/* ---- Each group is a dropdown ---- */
.ui-sgc__panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 380ms var(--ui-sgc-ease);
}
.ui-sgc__group[data-open] .ui-sgc__panel { grid-template-rows: 1fr; }
.ui-sgc__tasks {
  min-height: 0;
  overflow: hidden;
  margin: 0;
  padding: 0 4px;
  list-style: none;
}
.ui-sgc__tasks li:last-child { padding-bottom: 6px; }
.ui-sgc__task {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
  padding: 6px 8px;
  border-radius: 6px;
  text-align: left;
  opacity: 0;
  transform: translateY(-4px);
  transition: opacity 260ms ease, transform 320ms var(--ui-sgc-ease), color 260ms ease, background-color 100ms ease;
}
.ui-sgc__group[data-open] .ui-sgc__task { opacity: 1; transform: none; transition-delay: 80ms, 80ms, 0ms, 0ms; }
.ui-sgc__task:not(:disabled):hover { background: var(--ui-sgc-wash); }
.ui-sgc__task[data-state="current"] { color: var(--ui-sgc-ink); }
.ui-sgc__task[data-state="locked"] { color: var(--ui-sgc-muted); cursor: default; }
.ui-sgc__task[data-state="done"] { color: var(--ui-sgc-muted); }

/* The mark: an open ring for the current task, a dashed faint ring while locked, a blue check when done */
.ui-sgc__mark {
  display: grid;
  place-items: center;
  flex: none;
  width: 16px;
  height: 16px;
  margin-top: 2px;
  border-radius: 50%;
  transition: box-shadow 160ms ease;
}
.ui-sgc__task[data-state="current"] .ui-sgc__mark { box-shadow: inset 0 0 0 1px var(--ui-sgc-ring); }
.ui-sgc__task[data-state="current"]:hover .ui-sgc__mark { box-shadow: inset 0 0 0 1px var(--ui-sgc-accent); }
.ui-sgc__task[data-state="locked"] .ui-sgc__mark { color: var(--ui-sgc-faint); }
.ui-sgc__task[data-state="done"] .ui-sgc__mark { color: var(--ui-sgc-accent); }
.ui-sgc__mark svg { width: 16px; height: 16px; }
.ui-sgc__task[data-state="done"] .ui-sgc__mark svg { animation: ui-sgc-pop 420ms var(--ui-sgc-ease); }
.ui-sgc__task-label {
  min-width: 0;
  font-size: 13px;
  line-height: 20px;
  text-align: start;
  white-space: pre-line;
  overflow-wrap: anywhere;
  text-decoration-line: line-through;
  text-decoration-color: transparent;
  text-decoration-thickness: 1px;
  transition: text-decoration-color 260ms ease;
}
.ui-sgc__task[data-state="done"] .ui-sgc__task-label { text-decoration-color: currentColor; }

@keyframes ui-sgc-pop {
  from { transform: scale(0.5); opacity: 0; }
}

/* Narrow: a little less side padding */
@container (max-width: 300px) {
  .ui-sgc__head { padding-left: 12px; }
  .ui-sgc__progress { padding-inline: 12px; }
  .ui-sgc__group-head { padding-left: 10px; }
}

/* Touch: taller targets */
@media (pointer: coarse) {
  .ui-sgc__icon-btn { width: 36px; height: 36px; }
  .ui-sgc__edit { height: 36px; }
  .ui-sgc__group-head { padding-block: 12px; }
  .ui-sgc__task { padding-block: 9px; }
}

@media (prefers-reduced-motion: reduce) {
  .ui-sgc__fill, .ui-sgc__body, .ui-sgc__panel, .ui-sgc__task, .ui-sgc__chevron, .ui-sgc__group, .ui-sgc__group-title::after { transition: none; }
  .ui-sgc__mark svg { animation: none; }
}

/* Dark mode: follows a .dark class or data-theme="dark" on any ancestor, e.g. <html> */
:where(.dark, [data-theme="dark"]) .ui-sgc {
  --ui-sgc-card: #1c1c1e;
  --ui-sgc-strong: #ffffff;
  --ui-sgc-ink: rgba(255, 255, 255, 0.9);
  --ui-sgc-text: rgba(255, 255, 255, 0.62);
  --ui-sgc-muted: rgba(255, 255, 255, 0.46);
  --ui-sgc-faint: rgba(255, 255, 255, 0.3);
  --ui-sgc-icon: rgba(255, 255, 255, 0.5);
  --ui-sgc-line: rgba(255, 255, 255, 0.08);
  --ui-sgc-fill: rgba(255, 255, 255, 0.08);
  --ui-sgc-ring: rgba(255, 255, 255, 0.26);
  --ui-sgc-wash: rgba(255, 255, 255, 0.04);
  --ui-sgc-open: rgba(255, 255, 255, 0.03);
  --ui-sgc-accent: #4d8dff;
  --ui-sgc-on-accent: #ffffff;
  --ui-sgc-focus: rgba(77, 141, 255, 0.5);
  --ui-sgc-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.4);
}
`,wg=`
.tc{--blue:#0a83f7;--blue-soft:#e4eefc;--ink:#191919;--text:#5c5c5c;--muted:#8a8a8a;--faint:#b4b4b4;--line:#e3e3e3;--amber:#b4570f;--amber-bg:#fdead9;
 width:450px;background:#fdfdfd;border-radius:16px;box-shadow:0 0 0 .5px rgba(0,0,0,.09),0 1px 2px rgba(0,0,0,.04),0 8px 24px -12px rgba(0,0,0,.08);
 font-family:Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased;padding:14px 21px 14px 20px;box-sizing:border-box;color:var(--text)}
.tc *{box-sizing:border-box}
.tc-head{display:flex;align-items:center;height:28px;margin-bottom:12px}
.tc-title{font-size:16px;font-weight:600;color:var(--ink);letter-spacing:-.01em}
.tc-chip{margin-left:auto;display:inline-flex;align-items:center;gap:6px;height:27px;padding:0 10px;border-radius:7px;background:#f1f1f1;color:#3a3a3a;font-size:15px}
.tc-chip svg{width:15px;height:15px}
.tc-count{margin-left:16px;font-size:15px;color:var(--muted);font-variant-numeric:tabular-nums;min-width:22px;text-align:right}
.tc-row{position:relative;display:flex;align-items:center;height:40px}
.tc-mark{position:absolute;left:1px;width:20px;height:20px;border-radius:50%;display:grid;place-items:center;transition:background .25s,box-shadow .25s}
.tc-mark[data-s=pending]{box-shadow:inset 0 0 0 1.5px var(--line)}
.tc-mark[data-s=done]{background:var(--blue-soft)}
.tc-mark[data-s=done] svg{animation:tc-pop .3s cubic-bezier(.3,1.4,.5,1)}
.tc-mark[data-s=gate]{box-shadow:none;border:1.5px dashed #f0a46a}
.tc-mark[data-s=waiting]{border:1.5px dashed #e88a3c;animation:tc-breathe 1.6s ease-in-out infinite}
@keyframes tc-pop{from{transform:scale(.4);opacity:0}to{transform:none;opacity:1}}
@keyframes tc-breathe{50%{box-shadow:0 0 0 4px rgba(232,138,60,.14)}}
.tc-spin{width:20px;height:20px;animation:tc-rot .9s linear infinite}
@keyframes tc-rot{to{transform:rotate(360deg)}}
.tc-logo{position:absolute;left:29px;width:26px;height:26px;border-radius:50%;background:#fff;box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.05);display:grid;place-items:center}
.tc-logo svg{width:13px;height:13px}
.tc-label{position:absolute;left:72px;max-width:250px;overflow:hidden;text-overflow:ellipsis;font-size:16px;color:var(--muted);transition:color .3s;white-space:nowrap}
.tc-row[data-s=active] .tc-label,.tc-row[data-s=waiting] .tc-label{color:var(--ink)}
.tc-right{margin-left:auto;display:flex;align-items:center;gap:10px;font-size:15px}
.tc-secs{color:var(--faint);font-variant-numeric:tabular-nums;min-width:26px;text-align:right}
.tc-verb{font-size:16px;color:var(--blue);background:linear-gradient(90deg,var(--blue) 0%,var(--blue) 40%,#9cccfb 50%,var(--blue) 60%,var(--blue) 100%) 0 0/300% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:tc-shine 1.6s linear infinite}
@keyframes tc-shine{from{background-position:100% 0}to{background-position:-50% 0}}
.tc-gate{height:24px;padding:0 9px;border-radius:7px;background:var(--amber-bg);color:var(--amber);font-size:15px;font-weight:500;display:inline-flex;align-items:center;gap:4px}
.tc-gate[data-live]{background:#fbd9bd}
.tc-line{position:absolute;left:10.25px;width:1.5px;background:var(--line)}
.tc-line i{position:absolute;inset:0 0 auto 0;background:var(--blue);transition:height .35s cubic-bezier(.32,.72,.24,1)}
.tc-subs{position:relative;overflow:hidden;transition:height .35s cubic-bezier(.32,.72,.24,1)}
.tc-sub{position:relative;display:flex;align-items:center;height:30px;padding-left:47px;font-size:15px;color:var(--muted);animation:tc-in .35s cubic-bezier(.32,.72,.24,1) both}
.tc-sub[data-s=active]{color:#333}
.tc-sub b{position:absolute;left:23.75px;width:5px;height:5px;border-radius:50%;background:#bdbdbd;margin-left:-2.5px}
.tc-sub[data-s=active] b{background:var(--blue)}
.tc-sub span:last-child{margin-left:auto;color:var(--faint);font-variant-numeric:tabular-nums}
@keyframes tc-in{from{opacity:0;transform:translateY(-6px)}}
.tc-open{overflow:hidden;transition:height .35s cubic-bezier(.32,.72,.24,1)}
`,yg=()=>a.jsx("svg",{width:"11",height:"11",viewBox:"0 0 12 12",children:a.jsx("path",{d:"M2.5 6.3 4.9 8.6 9.5 3.6",fill:"none",stroke:"#0a83f7",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})}),bg=()=>a.jsxs("svg",{className:"tc-spin",viewBox:"0 0 20 20",children:[a.jsx("circle",{cx:"10",cy:"10",r:"8.25",fill:"none",stroke:"#e4eefc",strokeWidth:"1.5"}),a.jsx("path",{d:"M10 1.75a8.25 8.25 0 0 1 8.25 8.25",fill:"none",stroke:"#0a83f7",strokeWidth:"1.5",strokeLinecap:"round"})]});function kg({title:e,agent:t,rows:n}){const i=n.filter(s=>s.state==="done").length,r=s=>{var c,l;return 40+(((c=s.subs)==null?void 0:c.length)??0)*30+((l=s.subs)!=null&&l.length?6:0)+(s.open?s.openH??74:0)};let o=0;return a.jsxs("div",{className:"tc",children:[a.jsx("style",{children:wg}),a.jsxs("div",{className:"tc-head",children:[a.jsx("span",{className:"tc-title",children:e}),a.jsx("span",{className:"tc-chip",children:t}),a.jsxs("span",{className:"tc-count",children:[i,"/",n.length]})]}),a.jsx("div",{style:{position:"relative"},children:n.map((s,c)=>{var x,v,g,b;const l=o;o+=r(s);const f=n[c+1];return a.jsxs("div",{"data-s":s.state,children:[f&&!((x=s.subs)!=null&&x.length)&&a.jsx("div",{className:"tc-line",style:{top:l+30,height:r(s)-20},children:a.jsx("i",{style:{height:s.state==="done"?"100%":0}})}),f&&!!((v=s.subs)!=null&&v.length)&&(()=>{const w=s.subs.length,j=l+30,E=l+40+3+15-10,p=l+40+3+(w-1)*30+15+10,d=l+r(s)+10;return a.jsx("svg",{style:{position:"absolute",left:0,top:0,overflow:"visible",pointerEvents:"none"},width:"1",height:"1",children:a.jsx("path",{d:`M11 ${j} V${E-8} C11 ${E}, 23 ${E-2}, 23 ${E+6} V${p-6} C23 ${p+2}, 11 ${p}, 11 ${p+8} V${d}`,fill:"none",stroke:"#e3e3e3",strokeWidth:"1.5"})})})(),a.jsxs("div",{className:"tc-row","data-s":s.state,children:[a.jsx("span",{className:"tc-mark","data-s":s.state==="active"?"active":s.state,children:s.state==="done"?a.jsx(yg,{}):s.state==="active"?a.jsx(bg,{}):null}),a.jsx("span",{className:"tc-logo",children:s.logo}),a.jsx("span",{className:"tc-label",children:s.label}),a.jsxs("span",{className:"tc-right",children:[s.state==="active"&&a.jsx("span",{className:"tc-verb",children:s.verb}),s.state==="gate"&&a.jsx("span",{className:"tc-gate",children:s.gateLabel??"Approval"}),s.state==="waiting"&&a.jsxs("span",{className:"tc-gate","data-live":"",children:["Needs you ",a.jsx("svg",{width:"10",height:"10",viewBox:"0 0 10 10",children:a.jsx("path",{d:"m2.5 4 2.5 2.5L7.5 4",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round"})})]}),(s.state==="active"||s.state==="done")&&a.jsx("span",{className:"tc-secs",children:s.count??a.jsxs(a.Fragment,{children:[s.secs??"",s.secs!==void 0?"s":""]})})]})]}),a.jsx("div",{className:"tc-subs",style:{height:(g=s.subs)!=null&&g.length?s.subs.length*30+6:0},children:(b=s.subs)==null?void 0:b.map((w,j)=>a.jsxs("div",{className:"tc-sub","data-s":w.state,children:[a.jsx("b",{}),a.jsx("span",{children:w.label}),a.jsx("span",{children:w.meta})]},j))}),a.jsx("div",{className:"tc-open",style:{height:s.open?s.openH??74:0},children:s.open})]},c)})})]})}const jg=()=>a.jsx("svg",{viewBox:"0 0 1200 1200","aria-hidden":"true",children:a.jsx("path",{fill:"#D97757",d:"M 233.959793 800.214905 L 468.644287 668.536987 L 472.590637 657.100647 L 468.644287 650.738403 L 457.208069 650.738403 L 417.986633 648.322144 L 283.892639 644.69812 L 167.597321 639.865845 L 54.926208 633.825623 L 26.577238 627.785339 L 3.3e-05 592.751709 L 2.73832 575.27533 L 26.577238 559.248352 L 60.724873 562.228149 L 136.187973 567.382629 L 249.422867 575.194763 L 331.570496 580.026978 L 453.261841 592.671082 L 472.590637 592.671082 L 475.328857 584.859009 L 468.724915 580.026978 L 463.570557 575.194763 L 346.389313 495.785217 L 219.543671 411.865906 L 153.100723 363.543762 L 117.181267 339.060425 L 99.060455 316.107361 L 91.248367 266.01355 L 123.865784 230.093994 L 167.677887 233.073853 L 178.872513 236.053772 L 223.248367 270.201477 L 318.040283 343.570496 L 441.825592 434.738342 L 459.946411 449.798706 L 467.194672 444.64447 L 468.080597 441.020203 L 459.946411 427.409485 L 392.617493 305.718323 L 320.778564 181.932983 L 288.80542 130.630859 L 280.348999 99.865845 C 277.369171 87.221436 275.194641 76.590698 275.194641 63.624268 L 312.322174 13.20813 L 332.8591 6.604126 L 382.389313 13.20813 L 403.248352 31.328979 L 434.013519 101.71814 L 483.865753 212.537048 L 561.181274 363.221497 L 583.812134 407.919434 L 595.892639 449.315491 L 600.40271 461.959839 L 608.214783 461.959839 L 608.214783 454.711609 L 614.577271 369.825623 L 626.335632 265.61084 L 637.771851 131.516846 L 641.718201 93.745117 L 660.402832 48.483276 L 697.530334 24.000122 L 726.52356 37.852417 L 750.362549 72 L 747.060486 94.067139 L 732.886047 186.201416 L 705.100708 330.52356 L 686.979919 427.167847 L 697.530334 427.167847 L 709.61084 415.087341 L 758.496704 350.174561 L 840.644348 247.490051 L 876.885925 206.738342 L 919.167847 161.71814 L 946.308838 140.29541 L 997.61084 140.29541 L 1035.38269 196.429626 L 1018.469849 254.416199 L 965.637634 321.422852 L 921.825562 378.201538 L 859.006714 462.765259 L 819.785278 530.41626 L 823.409424 535.812073 L 832.75177 534.92627 L 974.657776 504.724915 L 1051.328979 490.872559 L 1142.818848 475.167786 L 1184.214844 494.496582 L 1188.724854 514.147644 L 1172.456421 554.335693 L 1074.604126 578.496765 L 959.838989 601.449829 L 788.939636 641.879272 L 786.845764 643.409485 L 789.261841 646.389343 L 866.255127 653.637634 L 899.194702 655.409424 L 979.812134 655.409424 L 1129.932861 666.604187 L 1169.154419 692.537109 L 1192.671265 724.268677 L 1188.724854 748.429688 L 1128.322144 779.194641 L 1046.818848 759.865845 L 856.590759 714.604126 L 791.355774 698.335754 L 782.335693 698.335754 L 782.335693 703.731567 L 836.69812 756.885986 L 936.322205 846.845581 L 1061.073975 962.81897 L 1067.436279 991.490112 L 1051.409424 1014.120911 L 1034.496704 1011.704712 L 924.885986 929.234924 L 882.604126 892.107544 L 786.845764 811.48999 L 780.483276 811.48999 L 780.483276 819.946289 L 802.550415 852.241699 L 919.087341 1027.409424 L 925.127625 1081.127686 L 916.671204 1098.604126 L 886.469849 1109.154419 L 853.288696 1103.114136 L 785.073914 1007.355835 L 714.684631 899.516785 L 657.906067 802.872498 L 650.979858 806.81897 L 617.476624 1167.704834 L 601.771851 1186.147705 L 565.530212 1200 L 535.328857 1177.046997 L 519.302124 1139.919556 L 535.328857 1066.550537 L 554.657776 970.792053 L 570.362488 894.68457 L 584.536926 800.134277 L 592.993347 768.724976 L 592.429626 766.630859 L 585.503479 767.516968 L 514.22821 865.369263 L 405.825531 1011.865906 L 320.053711 1103.677979 L 299.516815 1111.812256 L 263.919525 1093.369263 L 267.221497 1060.429688 L 287.114136 1031.114136 L 405.825531 880.107361 L 477.422913 786.52356 L 523.651062 732.483276 L 523.328918 724.671265 L 520.590698 724.671265 L 205.288605 929.395935 L 149.154434 936.644409 L 124.993355 914.01355 L 127.973183 876.885986 L 139.409409 864.80542 L 234.201385 799.570435 L 233.879227 799.8927 Z"})}),zg=()=>a.jsx("svg",{viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true",style:{color:"#191919"},children:a.jsx("path",{d:"M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"})}),Ng=()=>a.jsxs("svg",{viewBox:"0 0 38 57","aria-hidden":"true",children:[a.jsx("path",{d:"M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0Z",fill:"#1ABCFE"}),a.jsx("path",{d:"M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0Z",fill:"#0ACF83"}),a.jsx("path",{d:"M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19Z",fill:"#FF7262"}),a.jsx("path",{d:"M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5Z",fill:"#F24E1E"}),a.jsx("path",{d:"M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5Z",fill:"#A259FF"})]}),Sg=()=>{const e=`ui-pp-gm-${_.useId().replace(/:/g,"")}`;return a.jsxs("svg",{width:"16",height:"16",viewBox:"0 -5.77 56.4108 56.4108",fill:"none","aria-hidden":"true",children:[a.jsx("path",{d:"M44.2255 5.76727H56.4051V41.0239C56.4051 43.148 54.683 44.8701 52.5589 44.8701H46.1486C45.8961 44.8701 45.646 44.8204 45.4127 44.7237C45.1794 44.6271 44.9674 44.4854 44.7888 44.3069C44.6102 44.1283 44.4686 43.9163 44.3719 43.683C44.2753 43.4497 44.2255 43.1996 44.2255 42.947V5.76727Z",fill:`url(#${e}-0)`}),a.jsx("path",{d:"M12.1796 5.76727H0V41.0239C0 43.148 1.72213 44.8701 3.84618 44.8701H10.2565C10.509 44.8701 10.7591 44.8204 10.9924 44.7237C11.2257 44.6271 11.4377 44.4854 11.6163 44.3069C11.7949 44.1283 11.9365 43.9163 12.0332 43.683C12.1298 43.4497 12.1796 43.1996 12.1796 42.947V5.76727Z",fill:"#FC413D"}),a.jsx("path",{d:"M10.0085 1.42778C7.43377 -0.736342 3.5924 -0.403647 1.42828 2.17105C-0.735843 4.74543 -0.403148 8.58681 2.17155 10.7512L26.5557 31.2479C27.0178 31.6362 27.602 31.8492 28.2056 31.8492C28.8091 31.8492 29.3934 31.6362 29.8554 31.2479L54.2396 10.7509C56.814 8.58681 57.1467 4.74543 54.9825 2.17073C52.8184 -0.403648 48.977 -0.736342 46.4027 1.42778L28.2054 16.724L10.0085 1.42778Z",fill:`url(#${e}-1)`}),a.jsxs("defs",{children:[a.jsxs("linearGradient",{id:`${e}-0`,x1:"50.3153",y1:"5.76727",x2:"50.3153",y2:"44.8701",gradientUnits:"userSpaceOnUse",children:[a.jsx("stop",{stopColor:"#60D673"}),a.jsx("stop",{offset:"0.17",stopColor:"#42C868"}),a.jsx("stop",{offset:"0.39",stopColor:"#0EBC5F"}),a.jsx("stop",{offset:"0.62",stopColor:"#00A9BB"}),a.jsx("stop",{offset:"0.86",stopColor:"#3C90FF"}),a.jsx("stop",{offset:"1",stopColor:"#3186FF"})]}),a.jsxs("linearGradient",{id:`${e}-1`,x1:"6.04194e-05",y1:"6.45153",x2:"56.4107",y2:"6.45153",gradientUnits:"userSpaceOnUse",children:[a.jsx("stop",{offset:"0.08",stopColor:"#FF63A0"}),a.jsx("stop",{offset:"0.3",stopColor:"#FC413D"}),a.jsx("stop",{offset:"0.5",stopColor:"#FC413D"}),a.jsx("stop",{offset:"0.65",stopColor:"#FC413D"}),a.jsx("stop",{offset:"0.72",stopColor:"#FC5C30"}),a.jsx("stop",{offset:"0.86",stopColor:"#FEB10C"}),a.jsx("stop",{offset:"0.91",stopColor:"#FEC700"}),a.jsx("stop",{offset:"0.96",stopColor:"#FFDB0F"})]})]})]})},Cg=()=>a.jsxs("svg",{width:"15",height:"15",viewBox:"0 0 49.883 49.877",fill:"none","aria-hidden":"true",children:[a.jsx("path",{d:"M18.3549 10.4784C15.4713 10.4784 13.1157 8.12279 13.1157 5.2392C13.1157 2.35561 15.4713 0 18.3549 0C21.2385 0 23.5941 2.35561 23.5941 5.2392V10.4784H18.3549Z",fill:"#36C5F0"}),a.jsx("path",{d:"M18.3575 13.12C21.2411 13.12 23.5967 15.4756 23.5967 18.3592C23.5967 21.2428 21.2411 23.5984 18.3575 23.5984H5.2392C2.35561 23.5984 0 21.2428 0 18.3592C0 15.4756 2.35561 13.12 5.2392 13.12H18.3575Z",fill:"#36C5F0"}),a.jsxs("g",{transform:"translate(26.28 0)",children:[a.jsx("path",{d:"M13.1244 18.3592C13.1244 15.4756 15.48 13.12 18.3636 13.12C21.2472 13.12 23.6028 15.4756 23.6028 18.3592C23.6028 21.2428 21.2472 23.5984 18.3636 23.5984H13.1244V18.3592Z",fill:"#2EB67D"}),a.jsx("path",{d:"M10.4785 18.3575C10.4785 21.2411 8.12286 23.5967 5.23927 23.5967C2.35568 23.5967 7.4362e-05 21.2411 7.4362e-05 18.3575V5.2392C7.4362e-05 2.35561 2.35568 0 5.23927 0C8.12286 0 10.4785 2.35561 10.4785 5.2392V18.3575Z",fill:"#2EB67D"})]}),a.jsxs("g",{transform:"translate(0 26.28)",children:[a.jsx("path",{d:"M10.4784 5.2392C10.4784 8.12279 8.12279 10.4784 5.2392 10.4784C2.35561 10.4784 0 8.12279 0 5.2392C0 2.35561 2.35561 0 5.2392 0H10.4784V5.2392Z",fill:"#E01E5A"}),a.jsx("path",{d:"M13.1157 5.2392C13.1157 2.35561 15.4713 0 18.3549 0C21.2385 0 23.5941 2.35561 23.5941 5.2392V18.3575C23.5941 21.2411 21.2385 23.5967 18.3549 23.5967C15.4713 23.5967 13.1157 21.2411 13.1157 18.3575V5.2392Z",fill:"#E01E5A"})]}),a.jsxs("g",{transform:"translate(26.28 26.28)",children:[a.jsx("path",{d:"M5.23927 13.1157C8.12286 13.1157 10.4785 15.4713 10.4785 18.3549C10.4785 21.2385 8.12286 23.5941 5.23927 23.5941C2.35568 23.5941 7.4362e-05 21.2385 7.4362e-05 18.3549V13.1157H5.23927Z",fill:"#ECB22E"}),a.jsx("path",{d:"M5.23927 10.4784C2.35568 10.4784 7.4362e-05 8.12279 7.4362e-05 5.2392C7.4362e-05 2.35561 2.35568 0 5.23927 0H18.3576C21.2412 0 23.5968 2.35561 23.5968 5.2392C23.5968 8.12279 21.2412 10.4784 18.3576 10.4784H5.23927Z",fill:"#ECB22E"})]})]}),Ue={claude:()=>a.jsx(jg,{}),notion:()=>a.jsx(zg,{}),figma:()=>a.jsx(Ng,{}),gmail:()=>a.jsx(Sg,{}),slack:()=>a.jsx(Cg,{})},Eg=[0,120,240,120,240,360,240,360,480],Lg=e=>{let t=0;for(const n of e)t=t*31+n.charCodeAt(0)>>>0;for(let n=0;n<64;n++){const i=t>>n%26&63,r=[0,1,2].flatMap(o=>{const s=i>>o*2&1,c=i>>o*2+1&1;return[s,c,s]});if(r.filter(Boolean).length>=5)return r;t=t*1103515245+12345>>>0}return[1,0,1,0,1,0,1,0,1]},Cf=[1,1,1,1,1,1,1,1,1],Ef=({cells:e,busy:t})=>a.jsx("span",{className:"ui-aocc__mark","data-busy":t?"":void 0,"aria-hidden":"true",children:e.map((n,i)=>a.jsx("i",{"data-on":n?"":void 0,style:{animationDelay:`${Eg[i]}ms`}},i))}),Vc=["var(--ui-aocc-p1)","var(--ui-aocc-p2)","var(--ui-aocc-p3)","var(--ui-aocc-p4)","var(--ui-aocc-p5)","var(--ui-aocc-p6)"],Wr={working:"Working",waiting:"Waiting",idle:"Idle"},Yc=160,Qc=200,vs=14,Mg=8,$g=.7,Tg=480,_s=16,Gi=1400,Zc=900,Ig="cubic-bezier(0.65, 0, 0.35, 1)",Rg=e=>e<=0?0:e>=1?1:e<.5?4*e*e*e:1-Math.pow(-2*e+2,3)/2,Lf=()=>{var e;return typeof window<"u"&&!!((e=window.matchMedia)!=null&&e.call(window,"(prefers-reduced-motion: reduce)").matches)},$e=e=>typeof e=="string"?e.trim():"",qc=(e,t=8)=>{if(e.length<2)return"";let n=`M${e[0][0]},${e[0][1]}`;for(let o=1;o<e.length-1;o++){const[s,c]=e[o-1],[l,f]=e[o],[x,v]=e[o+1],g=Math.hypot(l-s,f-c),b=Math.hypot(x-l,v-f),w=Math.min(t,g/2,b/2);if(!g||!b||!w){n+=` L${l},${f}`;continue}n+=` L${l-(l-s)/g*w},${f-(f-c)/g*w} Q${l},${f} ${l+(x-l)/b*w},${f+(v-f)/b*w}`}const[i,r]=e[e.length-1];return`${n} L${i},${r}`},Pg=([e,t],n)=>n==="down"?`M${e-4},${t-7}L${e},${t}L${e+4},${t-7}Z`:`M${e-7},${t-4}L${e},${t}L${e-7},${t+4}Z`;function Ag({nodes:e,escalations:t,onApprove:n,onReply:i,title:r="Org chart",className:o}){var _l,wl;const s=_.useId(),c=(Array.isArray(e)?e:[]).filter((u,k,F)=>u&&typeof u.id=="string"&&u.id&&(u.kind==="person"||u.kind==="agent")&&F.findIndex(W=>(W==null?void 0:W.id)===u.id)===k),l=new Map(c.map(u=>[u.id,u])),f=new Map;for(const u of c){let k=typeof u.parent=="string"&&l.has(u.parent)&&u.parent!==u.id?u.parent:void 0;const F=new Set([u.id]);for(let W=k;W;W=(_l=l.get(W))==null?void 0:_l.parent){if(F.has(W)){k=void 0;break}if(F.add(W),!l.has(W))break}f.set(u.id,k)}const x=new Map,v=[];for(const u of c){const k=f.get(u.id);k?x.set(k,[...x.get(k)??[],u]):v.push(u)}const g=[],b=new Map,w=(u,k)=>{g.push(u),b.set(u.id,k);for(const F of x.get(u.id)??[])w(F,k+1)};v.forEach(u=>w(u,1));const j=u=>{const k=[];for(let F=u;F;F=f.get(F))k.push(F);return k},E=g.filter(u=>u.kind==="agent"),p=new Map(E.map((u,k)=>[u.id,$e(u.color)||Vc[k%Vc.length]])),d=u=>(x.get(u)??[]).flatMap(k=>k.kind==="agent"?[k,...d(k.id)]:[]),m=u=>Array.isArray(u.tools)?u.tools.filter(k=>k&&$e(k.name)):[],y=(Array.isArray(t)?t:[]).filter((u,k,F)=>{var W;return u&&typeof u.id=="string"&&u.id&&((W=l.get(u.from))==null?void 0:W.kind)==="agent"&&F.findIndex(Z=>(Z==null?void 0:Z.id)===u.id)===k}).map(u=>{const k=j(u.from),F=typeof u.to=="string"&&k.slice(1).includes(u.to)?u.to:k.slice(1).find(W=>{var Z;return((Z=l.get(W))==null?void 0:Z.kind)==="person"});return F?{...u,to:F,path:k.slice(0,k.indexOf(F)+1)}:null}).filter(u=>!!u),R=u=>y.some(k=>k.from===u.id)?"waiting":u.status==="working"||u.status==="waiting"?u.status:"idle",I=u=>y.filter(k=>k.to===u),N=_.useRef(new Set),T=_.useRef(new Map),H=_.useRef(!0);for(const u of y)N.current.has(u.id)||(N.current.add(u.id),!H.current&&!Lf()&&T.current.set(u.id,performance.now()));for(const u of T.current.keys())y.some(k=>k.id===u)||T.current.delete(u);const[,U]=_.useState(0),[S,q]=_.useState("");_.useEffect(()=>{H.current=!1});const ne=T.current.size>0;_.useEffect(()=>{if(!ne)return;let u=0;const k=()=>{const F=performance.now();for(const[W,Z]of T.current)F-Z>=Gi&&T.current.delete(W);U(W=>W+1),T.current.size&&(u=requestAnimationFrame(k))};return u=requestAnimationFrame(k),()=>cancelAnimationFrame(u)});const ee=y[y.length-1];_.useEffect(()=>{if(!ee)return;const u=l.get(ee.from),k=l.get(ee.to);u&&k&&q(`${$e(u.name)||"An agent"} asks ${$e(k.name)||"its owner"}${$e(ee.label)?`: ${$e(ee.label)}`:""}`)},[ee==null?void 0:ee.id]);const re=performance.now(),pe=u=>{const k=T.current.get(u);return k===void 0?1:Rg((re-k)/Gi)},A=_.useRef(null),$=_.useRef(null),[O,Y]=_.useState(0);_.useLayoutEffect(()=>{const u=A.current;if(!u)return;const k=()=>Y(u.clientWidth);k();const F=new ResizeObserver(k);return F.observe(u),()=>F.disconnect()},[]);const G=g.filter(u=>{var k;return!((k=x.get(u.id))!=null&&k.length)}).length,te=O-_s*2,fe=Math.max(0,G-1),le=G*Yc+fe*vs<=te?vs:Mg,se=Math.floor(Math.min(Qc,Math.max(Yc,G?(te-fe*le)/G:Qc))),C=Math.min(1,te/Math.max(1,G*se+fe*le)),h=O&&(O<Tg||C<$g)?"list":"tree",L=h==="tree"&&C<1?C:1,D=_.useRef(new Map),[z,X]=_.useState({key:"",boxes:new Map,w:0,h:0});_.useLayoutEffect(()=>{const u=$.current;if(!u)return;const k=new Map;for(const[W,Z]of D.current)k.set(W,{x:Z.offsetLeft,y:Z.offsetTop,w:Z.offsetWidth,h:Z.offsetHeight});const F=`${h}|${u.offsetWidth}x${u.offsetHeight}|${[...k].map(([W,Z])=>`${W}:${Z.x},${Z.y},${Z.w},${Z.h}`).join(";")}`;F!==z.key&&X({key:F,boxes:k,w:u.offsetWidth,h:u.offsetHeight})});const ce=(u,k)=>{if(h==="tree"){const Z=u.x+u.w/2,be=u.y+u.h,Fe=k.x+k.w/2,ve=be+(k.y-be)/2;return Math.abs(Z-Fe)<.5?[[Z,be],[Fe,k.y]]:[[Z,be],[Z,ve],[Fe,ve],[Fe,k.y]]}const F=Math.min(u.x+25,k.x-14),W=k.y+26;return[[F,u.y+u.h],[F,W],[k.x,W]]},M=u=>{const k=u.map(W=>[...W]),F=k[k.length-1];return h==="tree"?F[1]-=6:F[0]-=6,k},K=u=>{const k=[];for(let F=0;F<u.length-1;F++){const W=z.boxes.get(u[F]),Z=z.boxes.get(u[F+1]);if(!W||!Z)return[];k.push(...ce(Z,W).reverse())}return k.filter((F,W)=>W===0||F[0]!==k[W-1][0]||F[1]!==k[W-1][1])},[oe,we]=_.useState(null),[at,Qe]=_.useState(null),[Ce,Gt]=_.useState(null),[ye,Mt]=_.useState(null),Le=ye&&l.has(ye.id)?l.get(ye.id):void 0,ot=oe??at??(Le?Le.id:null),ht=new Set(ot&&l.has(ot)?j(ot):[]),wi=Ce&&l.has(Ce)?Ce:((wl=g[0])==null?void 0:wl.id)??null,Xt=_.useRef(null);_.useEffect(()=>{if(!ye)return;const u=k=>{var W,Z;const F=k.target;!((W=D.current.get(ye.id))!=null&&W.contains(F))&&!((Z=Xt.current)!=null&&Z.contains(F))&&Mt(null)};return document.addEventListener("pointerdown",u),()=>document.removeEventListener("pointerdown",u)},[ye]),_.useEffect(()=>{var u,k;ye!=null&&ye.focus&&((k=(u=Xt.current)==null?void 0:u.querySelector("[data-primary]"))==null||k.focus())},[ye]);const Ft=u=>{var k;u&&(Gt(u),(k=D.current.get(u))==null||k.focus())},B=(u,k)=>Mt(F=>(F==null?void 0:F.id)===u?null:{id:u,focus:k}),Q=()=>{var k;const u=ye==null?void 0:ye.id;Mt(null),u&&((k=D.current.get(u))==null||k.focus())},he=(u,k)=>{var F;k(),(F=D.current.get(u.id))==null||F.focus()},Re=(u,k)=>{var Me,Ze,ue,kt,J,gt,bi,ki;const F=g.findIndex(Jt=>Jt.id===k.id),W=f.get(k.id),Z=(Ze=(Me=x.get(k.id))==null?void 0:Me[0])==null?void 0:Ze.id,be=g.filter(Jt=>b.get(Jt.id)===b.get(k.id)),Fe=be.findIndex(Jt=>Jt.id===k.id),ve=h==="tree";if(u.key===(ve?"ArrowUp":"ArrowLeft"))Ft(W);else if(u.key===(ve?"ArrowDown":"ArrowRight"))Ft(Z);else if(u.key===(ve?"ArrowLeft":"ArrowUp"))Ft(ve?(ue=be[Fe-1])==null?void 0:ue.id:(kt=g[F-1])==null?void 0:kt.id);else if(u.key===(ve?"ArrowRight":"ArrowDown"))Ft(ve?(J=be[Fe+1])==null?void 0:J.id:(gt=g[F+1])==null?void 0:gt.id);else if(u.key==="Home")Ft((bi=g[0])==null?void 0:bi.id);else if(u.key==="End")Ft((ki=g[g.length-1])==null?void 0:ki.id);else if(u.key==="Enter"||u.key===" ")B(k.id,!0);else if(u.key==="Escape"&&ye)Mt(null);else return;u.preventDefault()};_.useLayoutEffect(()=>{const u=Xt.current,k=Le?z.boxes.get(Le.id):void 0,F=A.current,W=$.current;if(!u||!k||!F||!W)return;const Z=W.offsetLeft,be=W.offsetTop,Fe=u.offsetWidth,ve=u.offsetHeight,Me=Math.max(8,Math.min(F.clientWidth-Fe-8,Z+(k.x+k.w/2)*L-Fe/2)),Ze=be+(k.y+k.h)*L+8,ue=be+k.y*L-ve-8;let kt=0,J=window.innerHeight;for(let ji=F.parentElement;ji;ji=ji.parentElement){const yl=getComputedStyle(ji);if(yl.overflowY==="visible"&&yl.overflowX==="visible")continue;const bl=ji.getBoundingClientRect();kt=Math.max(kt,bl.top),J=Math.min(J,bl.bottom)}const gt=F.getBoundingClientRect().top,bi=J-8-(gt+Ze),ki=gt+ue+ve-(kt+8),Jt=bi<ve&&(ki>=ve||ki>bi);u.style.left=`${Me}px`,u.style.top=`${Jt?ue:Ze}px`,u.dataset.side=Jt?"above":"below"});const $t=g.filter(u=>u.kind==="person").length,Rf=E.filter(u=>R(u)==="working").length,ml=E.filter(u=>R(u)==="waiting").length,Dt=u=>u?$e(u.name)||(u.kind==="agent"?"Agent":"Someone"):"",Qa=u=>u.kind==="agent"?$e(u.model)||"Agent":$e(u.role)||"Person",kn=(u,k="card")=>{const F=u.kind==="agent"?R(u):void 0,W=k==="card"&&(u.kind==="agent"?F==="waiting":I(u.id).length>0);return a.jsxs("span",{className:"ui-aocc__lead","data-kind":u.kind,"data-size":k,"data-idle":F==="idle"?"":void 0,style:u.kind==="agent"?{"--ui-aocc-c":p.get(u.id)}:void 0,children:[u.kind==="person"&&$e(u.avatar)?a.jsx(Fg,{src:$e(u.avatar)}):a.jsx(Ef,{cells:u.kind==="agent"?Lg(u.id):Cf,busy:F==="working"&&k!=="tiny"}),W&&a.jsx("span",{className:"ui-aocc__dot"})]})},xl=(u,k=3)=>a.jsxs("span",{className:"ui-aocc__tiles","aria-hidden":"true",children:[u.slice(0,k).map((F,W)=>{var Z;return a.jsx("span",{className:"ui-aocc__tile",style:{zIndex:k-W},children:F.logo??a.jsx("b",{children:(Z=Array.from($e(F.name))[0])==null?void 0:Z.toUpperCase()})},`${F.name}-${W}`)}),u.length>k&&a.jsxs("span",{className:"ui-aocc__more",children:["+",Math.min(99,u.length-k)]})]}),Pf=(u,k)=>{const F=x.get(u.id)??[],W=f.get(u.id)?x.get(f.get(u.id))??[]:v,Z=u.kind==="person"?d(u.id):[],be=u.kind==="person"?F.filter(ue=>ue.kind==="person"):[],Fe=u.kind==="agent"?R(u):void 0,ve=u.kind==="agent"?m(u):[],Me=I(u.id),Ze=Me.find(ue=>pe(ue.id)>=1);return a.jsxs("div",{ref:ue=>{ue?D.current.set(u.id,ue):D.current.delete(u.id)},className:"ui-aocc__card","data-kind":u.kind,"data-dim":ot&&!ht.has(u.id)?"":void 0,"data-on":ot===u.id?"":void 0,"data-open":(ye==null?void 0:ye.id)===u.id?"":void 0,"data-ask":Ze?"":void 0,role:"treeitem","aria-level":b.get(u.id),"aria-setsize":W.length,"aria-posinset":W.findIndex(ue=>ue.id===u.id)+1,"aria-expanded":F.length?!0:void 0,"aria-selected":(ye==null?void 0:ye.id)===u.id,"aria-haspopup":"dialog","aria-label":[Dt(u),Qa(u),Fe?Wr[Fe]:Z.length?`owns ${Z.length} ${Z.length===1?"agent":"agents"}`:be.length?`leads ${be.length}`:"",ve.length?`uses ${ve.map(ue=>$e(ue.name)).join(", ")}`:"",Me.length?`${Me.length} ${Me.length===1?"request":"requests"} waiting`:""].filter(Boolean).join(", "),tabIndex:u.id===wi?0:-1,style:{"--ui-aocc-i":k,"--ui-aocc-c":u.kind==="agent"?p.get(u.id):void 0},onMouseEnter:()=>we(u.id),onMouseLeave:()=>we(ue=>ue===u.id?null:ue),onFocus:ue=>{Gt(u.id),ue.currentTarget.matches(":focus-visible")&&Qe(u.id)},onBlur:()=>Qe(null),onKeyDown:ue=>Re(ue,u),onClick:()=>B(u.id,!1),children:[a.jsxs("span",{className:"ui-aocc__top",children:[kn(u),a.jsxs("span",{className:"ui-aocc__text",children:[a.jsx("span",{className:"ui-aocc__name",dir:"auto",children:Dt(u)}),a.jsxs("span",{className:"ui-aocc__sub",dir:"auto",children:[u.kind==="agent"&&u.logo?a.jsx("span",{className:"ui-aocc__logo","aria-hidden":"true",children:u.logo}):null,a.jsx("span",{className:"ui-aocc__sub-text",children:Qa(u)})]})]})]}),a.jsx("span",{className:"ui-aocc__foot",children:u.kind==="agent"?a.jsxs(a.Fragment,{children:[ve.length?xl(ve):a.jsx("span",{className:"ui-aocc__none",children:"No tools"}),a.jsx("span",{className:"ui-aocc__status","data-status":Fe,children:Wr[Fe]})]}):Ze?a.jsxs("span",{className:"ui-aocc__asking",children:[kn(l.get(Ze.from),"tiny"),a.jsxs("span",{className:"ui-aocc__asking-text",dir:"auto",children:[Dt(l.get(Ze.from))," asks"]}),Me.length>1&&a.jsxs("span",{className:"ui-aocc__more",children:["+",Me.length-1]}),a.jsx("span",{className:"ui-aocc__asking-go","aria-hidden":"true",children:"→"})]},Ze.id):Z.length||be.length?a.jsxs(a.Fragment,{children:[a.jsx("span",{className:"ui-aocc__stack","aria-hidden":"true",children:(Z.length?Z:be).slice(0,3).map((ue,kt)=>a.jsx("span",{style:{zIndex:3-kt},children:kn(ue,"stack")},ue.id))}),a.jsx("span",{className:"ui-aocc__owns",children:Z.length?`Owns ${Z.length} ${Z.length===1?"agent":"agents"}`:`Leads ${be.length} ${be.length===1?"person":"people"}`})]}):a.jsx("span",{className:"ui-aocc__none",children:"No reports"})})]})};let Af=0;const vl=u=>{const k=x.get(u.id)??[],F=Af++;return a.jsxs("div",{className:"ui-aocc__branch",role:"none",children:[Pf(u,F),k.length>0&&a.jsx("div",{className:"ui-aocc__kids",role:"group","data-deep":(b.get(u.id)??1)>=3?"":void 0,children:k.map(vl)})]},u.id)},yi=g.filter(u=>f.get(u.id)).map((u,k)=>{const F=z.boxes.get(f.get(u.id)),W=z.boxes.get(u.id);if(!F||!W)return null;const Z=ce(F,W);return{id:u.id,parent:f.get(u.id),i:k,d:qc(M(Z)),head:Pg(Z[Z.length-1],h==="tree"?"down":"right"),dot:Z[0],on:ht.has(u.id)}}).filter(u=>!!u),Ff=[...new Map(yi.map(u=>[u.parent,u])).values()],Df=new Set(y.flatMap(u=>u.path.slice(0,-1))),Of=new Set(y.flatMap(u=>u.path.slice(1)));return a.jsxs("section",{ref:A,className:["ui-aocc",o].filter(Boolean).join(" "),"aria-labelledby":s,"data-mode":h,style:{"--ui-aocc-w":`${se}px`,"--ui-aocc-gap":`${le}px`},children:[a.jsx("style",{href:"ui-agent-org-chart-clean",precedence:"default",children:Bg}),a.jsxs("header",{className:"ui-aocc__bar",children:[a.jsx("span",{className:"ui-aocc__title",id:s,dir:"auto",children:r||"Org chart"}),a.jsxs("span",{className:"ui-aocc__state",children:[ml>0&&a.jsxs("span",{className:"ui-aocc__badge",children:[a.jsx(Kc,{n:ml})," waiting"]}),g.length>0&&a.jsxs("span",{className:"ui-aocc__count",children:[$t>0&&`${$t} ${$t===1?"person":"people"}`,$t>0&&E.length>0&&" · ",E.length>0&&a.jsxs(a.Fragment,{children:[a.jsx(Kc,{n:Rf}),"/",E.length," working"]})]})]})]}),a.jsxs("div",{ref:$,className:"ui-aocc__chart",role:"tree","aria-labelledby":s,"data-active":ot?"":void 0,style:L<1?{zoom:L}:void 0,onMouseLeave:()=>we(null),children:[a.jsxs("svg",{className:"ui-aocc__lines",width:z.w,height:z.h,viewBox:`0 0 ${Math.max(1,z.w)} ${Math.max(1,z.h)}`,"aria-hidden":"true",children:[yi.map(u=>a.jsx("g",{className:"ui-aocc__edge","data-on":u.on?"":void 0,style:{"--ui-aocc-i":u.i},children:a.jsx("path",{d:u.d,pathLength:1})},`${u.id}-${h}`)),a.jsx("g",{className:"ui-aocc__lit",children:yi.filter(u=>u.on).map(u=>a.jsx("g",{className:"ui-aocc__edge","data-on":"",children:a.jsx("path",{d:u.d})},u.id))}),y.map(u=>{const k=qc(K(u.path));return k?a.jsxs("g",{className:"ui-aocc__esc",children:[a.jsx(Dg,{d:k,p:pe(u.id)}),a.jsx(Og,{d:k})]},u.id):null}),yi.map(u=>a.jsx("g",{className:"ui-aocc__edge ui-aocc__tip","data-on":u.on?"":void 0,"data-esc":Df.has(u.id)?"":void 0,style:{"--ui-aocc-i":u.i},children:a.jsx("path",{className:"ui-aocc__head",d:u.head})},`${u.id}-${h}`))]}),a.jsx("svg",{className:"ui-aocc__lines ui-aocc__dots",width:z.w,height:z.h,viewBox:`0 0 ${Math.max(1,z.w)} ${Math.max(1,z.h)}`,"aria-hidden":"true",children:Ff.map(u=>a.jsx("circle",{cx:u.dot[0],cy:u.dot[1],r:3.25,className:"ui-aocc__port","data-on":yi.some(k=>k.on&&k.parent===u.parent)?"":void 0,"data-dim":ot&&!ht.has(u.parent)?"":void 0,"data-esc":Of.has(u.parent)?"":void 0},`${u.parent}-${h}`))}),v.length===0&&a.jsx("p",{className:"ui-aocc__empty",children:"No one here yet"}),a.jsx("div",{className:"ui-aocc__roots",role:"none",children:v.map(vl)})]}),Le&&a.jsx("div",{ref:Xt,className:"ui-aocc__pop",role:"dialog","aria-label":`${Dt(Le)} – details`,onKeyDown:u=>{u.key==="Escape"&&(u.preventDefault(),Q())},onBlur:u=>{var F,W;const k=u.relatedTarget;k&&!((F=Xt.current)!=null&&F.contains(k))&&!((W=D.current.get(Le.id))!=null&&W.contains(k))&&Mt(null)},children:Bf(Le)},Le.id),a.jsx("span",{className:"ui-aocc__sr",role:"status","aria-live":"polite",children:S})]});function Bf(u){const k=l.get(f.get(u.id)??""),F=u.kind==="agent"?j(u.id).map(J=>l.get(J)).find(J=>J.kind==="person"):void 0,W=u.kind==="person"?d(u.id):(x.get(u.id)??[]).filter(J=>J.kind==="agent"),Z=u.kind==="agent"?R(u):void 0,be=u.kind==="agent"?y.find(J=>J.from===u.id):void 0,Fe=I(u.id),ve=u.kind==="agent"?m(u):[],Me=[],Ze=J=>a.jsxs("span",{className:"ui-aocc__who",children:[kn(J,"tiny"),a.jsx("span",{dir:"auto",children:Dt(J)})]});u.kind==="agent"?(F&&F.id!==(k==null?void 0:k.id)&&Me.push(["Owner",Ze(F)]),k&&Me.push([k.kind==="agent"?"Runs under":"Owner",Ze(k)]),$e(u.task)&&Me.push(["Now",$e(u.task)]),be&&Me.push(["Asks",`${Dt(l.get(be.to))}${$e(be.label)?` – ${$e(be.label)}`:""}`])):k&&Me.push(["Reports to",Ze(k)]);let ue=!1;const kt=()=>{if(!ue)return ue=!0,""};return a.jsxs(a.Fragment,{children:[a.jsxs("span",{className:"ui-aocc__pop-head",children:[kn(u,"small"),a.jsxs("span",{className:"ui-aocc__pop-text",children:[a.jsx("span",{className:"ui-aocc__pop-name",dir:"auto",children:Dt(u)}),a.jsxs("span",{className:"ui-aocc__pop-sub",dir:"auto",children:[u.kind==="agent"&&u.logo?a.jsx("span",{className:"ui-aocc__logo","aria-hidden":"true",children:u.logo}):null,a.jsx("span",{className:"ui-aocc__sub-text",children:Qa(u)})]})]}),Z&&a.jsx("span",{className:"ui-aocc__status","data-status":Z,"data-badge":"",children:Wr[Z]})]}),Fe.map(J=>{const gt=l.get(J.from);return a.jsxs("div",{className:"ui-aocc__ask",children:[a.jsxs("span",{className:"ui-aocc__ask-head",children:[kn(gt,"tiny"),a.jsxs("span",{className:"ui-aocc__ask-from",dir:"auto",children:[Dt(gt)," asks"]})]}),a.jsx("span",{className:"ui-aocc__ask-text",dir:"auto",children:$e(J.label)||"Needs a hand"}),(i||n)&&a.jsxs("span",{className:"ui-aocc__actions",children:[i&&a.jsx("button",{type:"button",className:"ui-aocc__btn","data-primary":n?void 0:kt(),onClick:()=>he(u,()=>i({id:J.id,from:J.from,to:J.to,label:J.label})),children:"Reply"}),n&&a.jsx("button",{type:"button",className:"ui-aocc__btn ui-aocc__btn--primary","data-primary":kt(),onClick:()=>he(u,()=>n({id:J.id,from:J.from,to:J.to,label:J.label})),children:"Approve"})]})]},J.id)}),Me.length>0&&a.jsx("dl",{className:"ui-aocc__facts",children:Me.map(([J,gt])=>a.jsxs("div",{children:[a.jsx("dt",{children:J}),a.jsx("dd",{dir:"auto",children:gt})]},J))}),ve.length>0&&a.jsxs(a.Fragment,{children:[a.jsx("span",{className:"ui-aocc__pop-label",children:"Uses"}),a.jsx("ul",{className:"ui-aocc__pop-tools",children:ve.slice(0,8).map((J,gt)=>a.jsxs("li",{children:[xl([J],1),a.jsx("span",{className:"ui-aocc__pop-item",dir:"auto",children:$e(J.name)})]},`${J.name}-${gt}`))}),ve.length>8&&a.jsxs("span",{className:"ui-aocc__pop-more",children:["and ",ve.length-8," more"]})]}),W.length>0&&a.jsxs(a.Fragment,{children:[a.jsx("span",{className:"ui-aocc__pop-label",children:u.kind==="person"?`Owns ${W.length} ${W.length===1?"agent":"agents"}`:`${W.length} ${W.length===1?"sub-agent":"sub-agents"}`}),a.jsx("ul",{className:"ui-aocc__pop-list",children:W.slice(0,5).map(J=>a.jsxs("li",{children:[kn(J,"tiny"),a.jsx("span",{className:"ui-aocc__pop-item",dir:"auto",children:Dt(J)}),J.logo?a.jsx("span",{className:"ui-aocc__logo","aria-hidden":"true",children:J.logo}):null,a.jsx("span",{className:"ui-aocc__status","data-status":R(J),children:Wr[R(J)]})]},J.id))}),W.length>5&&a.jsxs("span",{className:"ui-aocc__pop-more",children:["and ",W.length-5," more"]})]})]})}}function Kc({n:e}){const t=_.useRef(e);return a.jsx("span",{className:"ui-aocc__roll",children:a.jsx("span",{"data-still":e===t.current?"":void 0,children:e},e)})}function Fg({src:e}){const[t,n]=_.useState(!1);return _.useEffect(()=>n(!1),[e]),t?a.jsx(Ef,{cells:Cf}):a.jsx("img",{src:e,alt:"",draggable:!1,onError:()=>n(!0)})}function Dg({d:e,p:t}){const n=_.useRef(null),[i,r]=_.useState(0);return _.useLayoutEffect(()=>{var s,c;const o=((c=(s=n.current)==null?void 0:s.getTotalLength)==null?void 0:c.call(s))??0;Math.abs(o-i)>.5&&r(o)}),a.jsx("path",{ref:n,d:e,className:"ui-aocc__trail",style:i?{strokeDasharray:i,strokeDashoffset:i*(1-t)}:{opacity:0}})}const Ur=96,Gc=8;function Og({d:e}){const t=_.useRef([]);return _.useLayoutEffect(()=>{const n=t.current.filter(Boolean);if(!n.length||typeof n[0].animate!="function"||Lf())return;const i=n[0].getTotalLength(),r=Gi/(Gi+Zc),o=n.map((s,c)=>{const l=Ur*(c+1)/Gc;return s.style.strokeDasharray=`${l} ${i+Ur*2}`,s.animate([{strokeDashoffset:l,easing:Ig},{strokeDashoffset:-(i+Ur)+l,offset:r},{strokeDashoffset:-(i+Ur)+l}],{duration:Gi+Zc,iterations:1/0,fill:"both"})});return()=>o.forEach(s=>s.cancel())},[e]),a.jsx("g",{className:"ui-aocc__light",children:Array.from({length:Gc},(n,i)=>a.jsx("path",{ref:r=>void(t.current[i]=r),d:e},i))})}const Bg=`
/* Colors, sizes and motion as variables – override them on .ui-aocc */
.ui-aocc {
  --ui-aocc-card: var(--aui-surface, #ffffff);
  --ui-aocc-strong: var(--aui-ink, #000000);
  --ui-aocc-ink: var(--aui-ink, rgba(0, 0, 0, 0.88));
  --ui-aocc-text: var(--aui-muted, rgba(0, 0, 0, 0.61));
  --ui-aocc-muted: var(--aui-muted, rgba(0, 0, 0, 0.45));
  --ui-aocc-faint: rgba(0, 0, 0, 0.27);
  /* The lines are solid colors – the arrowheads on them are fully opaque */
  --ui-aocc-edge: color-mix(in srgb, #000000 22%, var(--ui-aocc-card));
  --ui-aocc-edge-strong: color-mix(in srgb, #000000 55%, var(--ui-aocc-card));
  --ui-aocc-edge-dim: color-mix(in srgb, #000000 10%, var(--ui-aocc-card));
  --ui-aocc-esc: color-mix(in srgb, var(--ui-aocc-amber) 60%, var(--ui-aocc-card));
  --ui-aocc-line: rgba(0, 0, 0, 0.06);
  --ui-aocc-node: #ffffff;
  --ui-aocc-tray: #f4f4f5;
  --ui-aocc-subtle: rgba(0, 0, 0, 0.025);
  --ui-aocc-blue: rgba(0, 96, 226, 0.78);
  --ui-aocc-amber: #e08a00;
  --ui-aocc-amber-text: #b25e00;
  --ui-aocc-sheen: rgba(0, 0, 0, 0.9);
  --ui-aocc-focus: rgba(0, 96, 226, 0.7);
  /* The agents' colors, in order – the design system's palette */
  --ui-aocc-p1: var(--aui-blue, #0190fe);
  --ui-aocc-p2: var(--aui-purple, #a651f0);
  --ui-aocc-p3: var(--aui-teal, #13b3a0);
  --ui-aocc-p4: var(--aui-pink, #ee3e9e);
  --ui-aocc-p5: var(--aui-green, #5fc88a);
  --ui-aocc-p6: var(--aui-cyan, #14b3f0);
  --ui-aocc-tile-edge: rgba(0, 0, 0, 0.1);
  --ui-aocc-shadow: 0 0 0 0.5px var(--aui-border, rgba(0, 0, 0, 0.06)), 0 1px 1px -1px rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --ui-aocc-node-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.08), 0 1px 1px -1px rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --ui-aocc-node-hover: 0 0 0 0.5px rgba(0, 0, 0, 0.1), 0 6px 16px -6px rgba(0, 0, 0, 0.16), 0 2px 4px -1px rgba(0, 0, 0, 0.05);
  --ui-aocc-pop: 0 0 0 0.5px rgba(0, 0, 0, 0.08), 0 16px 36px -12px rgba(0, 0, 0, 0.22), 0 4px 10px -4px rgba(0, 0, 0, 0.08);
  --ui-aocc-ease: cubic-bezier(0.32, 0.72, 0.24, 1);
  position: relative;
  box-sizing: border-box;
  display: grid;
  width: 100%;
  min-width: 0;
  padding: 14px ${_s}px ${_s}px;
  border-radius: var(--aui-radius-lg, 10px);
  /* No card of its own – the chart sits straight on whatever is behind it */
  background: none;
  font-family: var(--aui-font, "Inter", "InterVariable", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif);
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  color: var(--ui-aocc-text);
  text-align: left;
  -webkit-font-smoothing: antialiased;
}
.ui-aocc *, .ui-aocc *::before, .ui-aocc *::after { box-sizing: border-box; }
.ui-aocc ul, .ui-aocc dl, .ui-aocc dd, .ui-aocc p { margin: 0; padding: 0; list-style: none; }

/* ----- The bar: title, who's waiting, how many are at work ----- */
.ui-aocc__bar { display: flex; align-items: center; gap: 8px; min-width: 0; min-height: 20px; margin-bottom: 18px; }
.ui-aocc__title { flex: 0 0 auto; max-width: 60%; min-width: 0; overflow: hidden; font-weight: 500; color: var(--ui-aocc-strong); white-space: nowrap; text-overflow: ellipsis; }
.ui-aocc__state { display: flex; flex: 0 1 auto; align-items: center; gap: 8px; min-width: 0; margin-left: auto; }
.ui-aocc__count { min-width: 0; overflow: hidden; font-size: 12px; line-height: 16px; color: var(--ui-aocc-muted); font-variant-numeric: tabular-nums; white-space: nowrap; text-overflow: ellipsis; }
.ui-aocc__badge { flex: none; height: 20px; padding: 0 7px; border-radius: calc(var(--aui-radius-sm, 5px) + 1px); background: color-mix(in srgb, var(--ui-aocc-amber) 14%, transparent); font-size: 12px; font-weight: 500; line-height: 20px; color: var(--ui-aocc-amber-text); font-variant-numeric: tabular-nums; white-space: nowrap; animation: ui-aocc-fade 240ms ease both; }
.ui-aocc__roll { display: inline-flex; overflow: hidden; vertical-align: top; }
.ui-aocc__roll > span { display: block; animation: ui-aocc-roll 360ms var(--ui-aocc-ease) both; }
.ui-aocc__roll > span[data-still] { animation: none; }

/* The pixel mark: 3×3 squares of 3px in a 16px box – twinkling in a diagonal wave while it works */
.ui-aocc__mark { display: grid; flex: none; grid-template-columns: repeat(3, 3px); grid-auto-rows: 3px; gap: 1.5px; place-content: center; width: 16px; height: 16px; }
.ui-aocc__mark i { border-radius: 0.75px; background: var(--ui-aocc-c, var(--ui-aocc-blue)); opacity: 0; }
.ui-aocc__mark i[data-on] { opacity: 1; }
.ui-aocc__mark[data-busy] i[data-on] { animation: ui-aocc-pixel 1.2s ease-in-out infinite both; }

/* ----- The chart: a tree from the top down, or an indented list ----- */
.ui-aocc__chart { position: relative; min-width: 0; }
.ui-aocc__lines { position: absolute; top: 0; left: 0; z-index: 0; overflow: visible; pointer-events: none; }
.ui-aocc__dots { z-index: 4; }
.ui-aocc__edge { color: var(--ui-aocc-edge); transition: color 240ms ease, opacity 240ms ease; }
.ui-aocc__edge path { fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
.ui-aocc__edge > path:first-child:not(.ui-aocc__head) { stroke-dasharray: 1; animation: ui-aocc-draw 620ms var(--ui-aocc-ease) calc(160ms + var(--ui-aocc-i, 0) * 60ms) backwards; }
.ui-aocc__edge path.ui-aocc__head { fill: currentColor; stroke: none; animation: ui-aocc-fade 200ms ease calc(640ms + var(--ui-aocc-i, 0) * 60ms) backwards; }
.ui-aocc__edge[data-on] { color: var(--ui-aocc-edge-strong); }
/* Faded back by a lighter solid color, not by opacity – so a line never shows through its arrowhead */
.ui-aocc__chart[data-active] .ui-aocc__edge:not([data-on]) { color: var(--ui-aocc-edge-dim); }
.ui-aocc__lit .ui-aocc__edge path, .ui-aocc__lit .ui-aocc__edge path.ui-aocc__head { animation: none; }
.ui-aocc__port { fill: var(--ui-aocc-node); stroke: var(--ui-aocc-edge); stroke-width: 1.5; transition: stroke 240ms ease, opacity 240ms ease; animation: ui-aocc-fade 240ms ease 200ms backwards; }
.ui-aocc__port[data-on] { stroke: var(--ui-aocc-edge-strong); }
.ui-aocc__port[data-dim] { opacity: 0.5; }
/* On an escalation's way: the arrowhead and the dot take the amber of its line, and stay so while you point elsewhere */
.ui-aocc .ui-aocc__chart .ui-aocc__tip[data-esc] { color: var(--ui-aocc-esc); }
.ui-aocc__port[data-esc] { stroke: var(--ui-aocc-esc); opacity: 1; }
/* An escalation: the way up turns amber, and a light keeps running up it */
.ui-aocc__trail { fill: none; stroke: var(--ui-aocc-esc); stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
/* The light is only a fill along the line itself – as thick as the line, no glow, no blur */
.ui-aocc__light path { fill: none; stroke: var(--ui-aocc-amber); stroke-width: 1.5; stroke-linecap: butt; stroke-opacity: 0.4; stroke-dasharray: 0 10000; }
.ui-aocc__roots, .ui-aocc__kids { position: static; display: flex; gap: var(--ui-aocc-gap, ${vs}px); }
.ui-aocc[data-mode="tree"] .ui-aocc__roots { justify-content: center; }
.ui-aocc[data-mode="tree"] .ui-aocc__branch { display: flex; flex-direction: column; align-items: center; }
.ui-aocc[data-mode="tree"] .ui-aocc__kids { margin-top: 36px; }
.ui-aocc[data-mode="list"] .ui-aocc__roots, .ui-aocc[data-mode="list"] .ui-aocc__kids { flex-direction: column; gap: 8px; }
.ui-aocc[data-mode="list"] .ui-aocc__kids { margin-top: 8px; padding-left: 36px; }
.ui-aocc[data-mode="list"] .ui-aocc__kids[data-deep] { padding-left: 22px; }
.ui-aocc__empty { padding: 24px 0; font-size: 13px; color: var(--ui-aocc-muted); text-align: center; }

/* ----- A card: the same size whatever it says ----- */
.ui-aocc__card { position: relative; z-index: 1; display: grid; flex: none; grid-template-rows: 52px 28px; width: var(--ui-aocc-w); border-radius: 10px; background: var(--ui-aocc-tray); box-shadow: var(--ui-aocc-node-shadow); outline: none; cursor: pointer; user-select: none; transition: opacity 240ms ease, box-shadow 240ms ease, transform 240ms var(--ui-aocc-ease); animation: ui-aocc-in 420ms var(--ui-aocc-ease) calc(var(--ui-aocc-i, 0) * 50ms) backwards; }
.ui-aocc[data-mode="list"] .ui-aocc__card { width: 100%; }
/* An agent's card: a soft wash of its color from the corners, a hairline of it at the edge */
/* An agent: only the white layer takes a soft wash of its color – the gray one stays gray */
.ui-aocc__card[data-kind="agent"] .ui-aocc__top {
  background:
    radial-gradient(90% 130% at 0% 0%, color-mix(in srgb, var(--ui-aocc-c) var(--ui-aocc-wash, 10%), transparent), transparent 70%),
    radial-gradient(70% 120% at 100% 100%, color-mix(in srgb, var(--ui-aocc-c) calc(var(--ui-aocc-wash, 10%) * 0.6), transparent), transparent 70%),
    var(--ui-aocc-node);
  box-shadow: 0 0 0 0.5px color-mix(in srgb, var(--ui-aocc-c) 26%, transparent), 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.ui-aocc__card:hover, .ui-aocc__card[data-on], .ui-aocc__card[data-open] { z-index: 3; box-shadow: var(--ui-aocc-node-hover); }
.ui-aocc[data-mode="tree"] .ui-aocc__card:hover, .ui-aocc[data-mode="tree"] .ui-aocc__card[data-open] { transform: translateY(-1px); }
.ui-aocc__card[data-dim] { opacity: 0.45; }
.ui-aocc__card:focus-visible { outline: 2px solid var(--ui-aocc-focus); outline-offset: 2px; }
/* A request arrives: one amber ring goes out from the card */
.ui-aocc__card[data-ask]::after { content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; animation: ui-aocc-ring 1400ms ease-out both; }
/* The white layer on the gray one – flush with its top and sides, rounded all round, the gray shows below it */
.ui-aocc__top { display: flex; align-items: center; gap: 9px; min-width: 0; padding: 0 10px; border-radius: 10px; background: var(--ui-aocc-node); box-shadow: 0 0 0 0.5px var(--ui-aocc-line), 0 1px 2px 0 rgba(0, 0, 0, 0.04); }
.ui-aocc__text { display: grid; flex: 1 1 auto; min-width: 0; }
.ui-aocc__name { overflow: hidden; font-size: 13px; font-weight: 500; line-height: 17px; color: var(--ui-aocc-strong); white-space: nowrap; text-overflow: ellipsis; }
.ui-aocc__sub { display: flex; align-items: center; gap: 4px; min-width: 0; font-size: 12px; line-height: 16px; color: var(--ui-aocc-muted); }
.ui-aocc__sub-text { min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.ui-aocc__logo { display: grid; flex: none; place-items: center; width: 12px; height: 12px; color: var(--ui-aocc-strong); }
.ui-aocc__logo svg, .ui-aocc__logo img { display: block; width: 100%; height: 100%; }
/* The strip under it, on a faint wash, split off by a hairline */
.ui-aocc__foot { --ui-aocc-ring: var(--ui-aocc-tray); display: flex; align-items: center; gap: 6px; min-width: 0; padding: 0 10px; border-radius: 0 0 10px 10px; font-size: 11.5px; line-height: 16px; color: var(--ui-aocc-muted); }
.ui-aocc__none { color: var(--ui-aocc-faint); }
.ui-aocc__card[data-kind="person"] .ui-aocc__foot { gap: 6px; }
.ui-aocc__owns { min-width: 0; font-weight: 500; color: var(--ui-aocc-text); overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
/* Status, quietly: gray words; working ones shimmer, waiting is amber */
.ui-aocc__status { flex: none; margin-left: auto; font-size: 11.5px; font-weight: 500; line-height: 16px; color: var(--ui-aocc-text); white-space: nowrap; }
.ui-aocc__status[data-status="idle"] { color: var(--ui-aocc-faint); }
.ui-aocc__status[data-status="working"] { background: linear-gradient(100deg, var(--ui-aocc-text) 40%, var(--ui-aocc-sheen) 50%, var(--ui-aocc-text) 60%) 0 0 / 260% 100%; -webkit-background-clip: text; background-clip: text; color: transparent; animation: ui-aocc-sheen 2.4s linear infinite; }
.ui-aocc__status[data-status="waiting"] { height: 18px; margin-right: -4px; padding: 0 5px; border-radius: 5px; background: color-mix(in srgb, var(--ui-aocc-amber) 14%, transparent); line-height: 18px; color: var(--ui-aocc-amber-text); }
.ui-aocc__status[data-badge] { height: 20px; margin: 0; padding: 0 6px; border-radius: 6px; background: rgba(127, 127, 127, 0.1); font-size: 12px; line-height: 20px; }
.ui-aocc__status[data-badge][data-status="working"] { -webkit-background-clip: border-box; background-clip: border-box; color: var(--ui-aocc-text); animation: none; }
.ui-aocc__status[data-badge][data-status="waiting"] { background: color-mix(in srgb, var(--ui-aocc-amber) 14%, transparent); }
/* Tool logos on white tiles, overlapping, with a ring in the card's color */
.ui-aocc__tiles { display: inline-flex; flex: none; align-items: center; }
.ui-aocc__tile { position: relative; display: grid; flex: none; place-items: center; width: 18px; height: 18px; margin-left: -5px; border-radius: 5px; background: #ffffff; box-shadow: 0 0 0 1.5px var(--ui-aocc-ring, var(--ui-aocc-node)), inset 0 0 0 0.5px var(--ui-aocc-tile-edge); color: #000000; }
.ui-aocc__tile:first-child { margin-left: 0; }
.ui-aocc__tile svg, .ui-aocc__tile img { display: block; width: 11px; height: 11px; }
.ui-aocc__tile b { font-size: 9.5px; font-weight: 600; line-height: 1; color: rgba(0, 0, 0, 0.6); }
.ui-aocc__more { margin-left: 4px; font-size: 11.5px; font-weight: 500; color: var(--ui-aocc-muted); font-variant-numeric: tabular-nums; }
/* Whom a person looks after: their agents' marks – or their people's photos – stacked */
.ui-aocc__stack { display: inline-flex; flex: none; align-items: center; gap: 2px; }
.ui-aocc__stack > span { display: grid; }
/* What waits for a person, right in the strip – amber, with a sheen as it lands */
.ui-aocc__card[data-ask] .ui-aocc__top { background: radial-gradient(90% 130% at 0% 0%, color-mix(in srgb, var(--ui-aocc-amber) 12%, transparent), transparent 70%), var(--ui-aocc-node); box-shadow: 0 0 0 0.5px color-mix(in srgb, var(--ui-aocc-amber) 35%, transparent), 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
.ui-aocc__card[data-ask] .ui-aocc__foot { position: relative; overflow: hidden; }
.ui-aocc__card[data-ask] .ui-aocc__foot::after { content: ""; position: absolute; inset: 0; background: linear-gradient(100deg, transparent 30%, color-mix(in srgb, var(--ui-aocc-amber) 11%, transparent) 50%, transparent 70%) -150% 0 / 60% 100% no-repeat; animation: ui-aocc-sweep 1600ms ease-out 1 both; pointer-events: none; }
.ui-aocc__asking { display: flex; flex: 1 1 auto; align-items: center; gap: 6px; min-width: 0; animation: ui-aocc-fade 360ms ease both; }
.ui-aocc__asking-go { flex: none; margin-left: auto; font-weight: 500; color: var(--ui-aocc-amber-text); }
.ui-aocc__asking-text { min-width: 0; overflow: hidden; font-weight: 500; color: var(--ui-aocc-amber-text); white-space: nowrap; text-overflow: ellipsis; }

/* What leads a card: a round photo, or an agent's mark on a light wash of its color with a hairline edge */
.ui-aocc__lead { position: relative; display: grid; flex: none; place-items: center; width: 30px; height: 30px; border-radius: 50%; background: rgba(127, 127, 127, 0.1); }
.ui-aocc__lead[data-kind="person"] { --ui-aocc-c: var(--ui-aocc-ink); }
.ui-aocc__lead[data-kind="agent"] { border-radius: 8px; background: color-mix(in srgb, var(--ui-aocc-c) 11%, var(--ui-aocc-node)); box-shadow: inset 0 0 0 0.5px color-mix(in srgb, var(--ui-aocc-c) 32%, transparent); }
.ui-aocc__lead img { display: block; width: 100%; height: 100%; border-radius: inherit; object-fit: cover; box-shadow: inset 0 0 0 0.5px rgba(0, 0, 0, 0.08); }
.ui-aocc__lead[data-idle] .ui-aocc__mark { opacity: 0.4; }
.ui-aocc__lead[data-size="small"] { width: 28px; height: 28px; }
.ui-aocc__lead[data-size="tiny"] { width: 18px; height: 18px; }
.ui-aocc__lead[data-size="stack"] { width: 14px; height: 14px; border-radius: 3.5px; }
.ui-aocc__lead[data-size="stack"][data-kind="person"] { border-radius: 50%; }
/* The 16px mark is wider than its 14px square – pulled back by a pixel each side so it sits in the middle */
.ui-aocc__lead[data-size="stack"] .ui-aocc__mark { margin: -1px; transform: scale(0.58); }
.ui-aocc__lead[data-size="tiny"][data-kind="agent"] { border-radius: 5px; }
.ui-aocc__lead[data-size="tiny"] .ui-aocc__mark { transform: scale(0.68); }
/* Waiting on someone – an amber dot on the corner, on the agent and on the person it waits for */
.ui-aocc__dot { position: absolute; top: -2px; right: -2px; width: 9px; height: 9px; border-radius: 50%; background: var(--ui-aocc-amber); box-shadow: 0 0 0 2px var(--ui-aocc-node); animation: ui-aocc-pop 320ms var(--ui-aocc-ease) both; }
.ui-aocc__lead[data-kind="person"] .ui-aocc__dot { top: 0; right: 0; width: 7px; height: 7px; box-shadow: 0 0 0 1.5px var(--ui-aocc-node); }

/* ----- The detail card: a stronger shadow than the cards under it ----- */
.ui-aocc__pop { position: absolute; top: 0; left: 0; z-index: 6; display: grid; width: min(284px, calc(100% - 16px)); padding: 12px; border-radius: 12px; background: var(--aui-overlay, var(--ui-aocc-node)); box-shadow: var(--ui-aocc-pop); animation: ui-aocc-card 180ms var(--ui-aocc-ease) both; }
.ui-aocc__pop[data-side="above"] { animation-name: ui-aocc-card-up; }
.ui-aocc__pop-head { display: flex; align-items: center; gap: 9px; min-width: 0; }
.ui-aocc__pop-text { display: grid; flex: 1 1 auto; min-width: 0; }
.ui-aocc__pop-name { overflow: hidden; font-size: 13px; font-weight: 500; line-height: 18px; color: var(--ui-aocc-strong); white-space: nowrap; text-overflow: ellipsis; }
.ui-aocc__pop-sub { display: flex; align-items: center; gap: 4px; min-width: 0; overflow: hidden; font-size: 12px; line-height: 16px; color: var(--ui-aocc-muted); white-space: nowrap; text-overflow: ellipsis; }
.ui-aocc__ask { display: grid; gap: 4px; margin-top: 10px; padding: 10px; border-radius: 9px; background: color-mix(in srgb, var(--ui-aocc-amber) 8%, var(--ui-aocc-node)); box-shadow: inset 0 0 0 0.5px color-mix(in srgb, var(--ui-aocc-amber) 35%, transparent); }
.ui-aocc__ask-head { display: flex; align-items: center; gap: 6px; min-width: 0; }
.ui-aocc__ask-from { min-width: 0; overflow: hidden; font-size: 12px; line-height: 16px; color: var(--ui-aocc-amber-text); white-space: nowrap; text-overflow: ellipsis; }
.ui-aocc__ask-text { overflow: hidden; font-size: 13px; font-weight: 500; line-height: 18px; color: var(--ui-aocc-ink); overflow-wrap: anywhere; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; }
.ui-aocc__actions { display: flex; justify-content: flex-end; gap: 6px; margin-top: 8px; }
.ui-aocc__btn { display: inline-flex; align-items: center; height: 24px; padding: 0 7px; border: 0; border-radius: 5px; background: var(--ui-aocc-node); box-shadow: var(--ui-aocc-shadow); font: inherit; font-size: 12px; font-weight: 500; color: var(--ui-aocc-strong); cursor: pointer; transition: box-shadow 160ms ease, opacity 160ms ease; }
.ui-aocc__btn:hover { box-shadow: var(--ui-aocc-node-hover); }
.ui-aocc__btn--primary { background: var(--ui-aocc-strong); box-shadow: none; color: var(--ui-aocc-node); }
.ui-aocc__btn--primary:hover { box-shadow: none; opacity: 0.86; }
.ui-aocc__btn:focus-visible { outline: 2px solid var(--ui-aocc-focus); outline-offset: 2px; }
.ui-aocc__facts { display: grid; gap: 6px; margin-top: 10px !important; padding-top: 10px !important; border-top: 0.5px solid var(--ui-aocc-line); }
.ui-aocc__facts div { display: grid; grid-template-columns: 76px minmax(0, 1fr); gap: 8px; align-items: start; font-size: 12px; line-height: 18px; }
.ui-aocc__facts dt { color: var(--ui-aocc-muted); }
.ui-aocc__facts dd { min-width: 0; overflow: hidden; color: var(--ui-aocc-ink); overflow-wrap: anywhere; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.ui-aocc__who { display: inline-flex; align-items: center; gap: 6px; max-width: 100%; vertical-align: top; }
.ui-aocc__who > span:last-child { min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.ui-aocc__pop-label { margin-top: 10px; padding-top: 10px; border-top: 0.5px solid var(--ui-aocc-line); font-size: 12px; line-height: 16px; color: var(--ui-aocc-muted); }
.ui-aocc__pop-tools { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px 10px; margin-top: 8px !important; }
.ui-aocc__pop-tools li { display: flex; align-items: center; gap: 7px; min-width: 0; height: 20px; font-size: 12px; line-height: 16px; color: var(--ui-aocc-ink); }
.ui-aocc__pop-list { display: grid; gap: 2px; margin-top: 6px !important; }
.ui-aocc__pop-list li { display: flex; align-items: center; gap: 7px; min-width: 0; height: 26px; font-size: 12px; line-height: 16px; color: var(--ui-aocc-ink); }
.ui-aocc__pop-list .ui-aocc__logo { margin-left: auto; }
.ui-aocc__pop-list .ui-aocc__logo + .ui-aocc__status { margin-left: 4px; }
.ui-aocc__pop-item { flex: 0 1 auto; min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.ui-aocc__pop-more { margin-top: 4px; font-size: 12px; line-height: 16px; color: var(--ui-aocc-muted); }
.ui-aocc__sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }

@keyframes ui-aocc-pixel { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
@keyframes ui-aocc-fade { from { opacity: 0; } }
@keyframes ui-aocc-in { from { opacity: 0; transform: translateY(4px) scale(0.97); } }
@keyframes ui-aocc-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes ui-aocc-pop { from { opacity: 0; transform: scale(0.4); } }
@keyframes ui-aocc-roll { from { opacity: 0.35; transform: translateY(45%); } }
@keyframes ui-aocc-tick { from { opacity: 0; transform: translateY(5px); } }
@keyframes ui-aocc-sheen { from { background-position: 130% 0; } to { background-position: -30% 0; } }
@keyframes ui-aocc-sweep { from { background-position: -150% 0; } to { background-position: 250% 0; } }
@keyframes ui-aocc-ring { from { box-shadow: 0 0 0 0 color-mix(in srgb, var(--ui-aocc-amber) 28%, transparent); } to { box-shadow: 0 0 0 5px color-mix(in srgb, var(--ui-aocc-amber) 0%, transparent); } }
@keyframes ui-aocc-card { from { opacity: 0; transform: translateY(-4px) scale(0.98); } }
@keyframes ui-aocc-card-up { from { opacity: 0; transform: translateY(4px) scale(0.98); } }

@media (prefers-reduced-motion: reduce) {
  .ui-aocc *, .ui-aocc *::before, .ui-aocc *::after { animation: none !important; transition: none !important; }
  .ui-aocc__light { display: none; }
}

/* Dark mode: follows a .dark class or data-theme="dark" on any ancestor, e.g. <html> */
:where(.dark, [data-theme="dark"]) .ui-aocc {
  --ui-aocc-card: var(--aui-surface, #1c1c1e);
  --ui-aocc-strong: var(--aui-ink, #ffffff);
  --ui-aocc-ink: var(--aui-ink, rgba(255, 255, 255, 0.9));
  --ui-aocc-text: var(--aui-muted, rgba(255, 255, 255, 0.62));
  --ui-aocc-muted: var(--aui-muted, rgba(255, 255, 255, 0.46));
  --ui-aocc-faint: rgba(255, 255, 255, 0.3);
  --ui-aocc-edge: color-mix(in srgb, #ffffff 22%, var(--ui-aocc-card));
  --ui-aocc-edge-strong: color-mix(in srgb, #ffffff 60%, var(--ui-aocc-card));
  --ui-aocc-edge-dim: color-mix(in srgb, #ffffff 10%, var(--ui-aocc-card));
  --ui-aocc-esc: color-mix(in srgb, var(--ui-aocc-amber) 60%, var(--ui-aocc-card));
  --ui-aocc-line: rgba(255, 255, 255, 0.08);
  --ui-aocc-node: #2c2c30;
  --ui-aocc-tray: #232326;
  --ui-aocc-subtle: rgba(255, 255, 255, 0.03);
  --ui-aocc-blue: rgba(77, 141, 255, 0.85);
  --ui-aocc-amber: #ffb35c;
  --ui-aocc-amber-text: #ffb35c;
  --ui-aocc-sheen: rgba(255, 255, 255, 0.95);
  --ui-aocc-focus: rgba(77, 141, 255, 0.8);
  --ui-aocc-p1: var(--aui-blue, #4fb0fe);
  --ui-aocc-p2: var(--aui-purple, #b98af0);
  --ui-aocc-p3: var(--aui-teal, #4fc3b4);
  --ui-aocc-p4: var(--aui-pink, #f06db5);
  --ui-aocc-p5: var(--aui-green, #7dcf9f);
  --ui-aocc-p6: var(--aui-cyan, #5cc6ee);
  --ui-aocc-tile-edge: rgba(0, 0, 0, 0.2);
  --ui-aocc-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.08), 0 1px 2px rgba(0, 0, 0, 0.4);
  --ui-aocc-node-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.09), 0 1px 2px rgba(0, 0, 0, 0.4);
  --ui-aocc-node-hover: 0 0 0 0.5px rgba(255, 255, 255, 0.16), 0 8px 18px -6px rgba(0, 0, 0, 0.6);
  --ui-aocc-pop: 0 0 0 0.5px rgba(255, 255, 255, 0.12), 0 16px 36px -12px rgba(0, 0, 0, 0.7), 0 4px 10px -4px rgba(0, 0, 0, 0.4);
}
:where(.dark, [data-theme="dark"]) .ui-aocc__lead[data-kind="agent"] { background: color-mix(in srgb, var(--ui-aocc-c) 16%, var(--ui-aocc-node)); }
`;function Xc({className:e}){return a.jsx("svg",{role:"img","aria-label":"Atla",viewBox:"0 0 129 53",xmlns:"http://www.w3.org/2000/svg",className:e,children:a.jsx("path",{d:"M34.9852 43.0974C34.9852 46.1658 34.1489 47.7697 32.546 47.7697C31.1522 47.7697 30.3856 46.5842 30.3856 44.4224V26.5697C30.3856 19.8053 26.901 16.5974 19.3743 16.5974C14.7147 16.5974 11.1834 17.8045 8.50587 20.3632H8.25986L8.85154 16.0395H2.78767V27.7553H7.24793C8.99023 23.5013 11.6385 21.4789 15.4019 21.4789C18.9561 21.4789 20.6287 23.2921 20.6287 26.9882V32.6368H18.7471C4.52996 32.6368 0 35.1474 0 42.8184C0 49.3737 3.3452 53 9.26899 53C14.0031 53 18.6843 50.7252 21.2413 47.2816H21.6623C23.914 51.2901 26.5504 53 30.4553 53C35.8912 53 39.1667 49.6526 39.1667 44.0737V38.6342H34.9852V43.0974ZM14.8443 46.8632C11.5688 46.8632 9.89622 44.8408 9.89622 40.9355C9.89622 36.1237 12.4051 36.5421 17.4229 36.5421H20.6287V39.8197C20.6287 44.2829 18.538 46.8632 14.8443 46.8632ZM61.259 35.8447H65.4405V42.3303C65.4405 48.8855 61.1893 53 54.4989 53C48.157 53 44.2542 49.3039 44.2542 43.5158V21.8974H39.1667V18.2711C46.0662 15.2724 49.6902 10.8092 50.8052 3.48684H54.0111V17.4342H63.7679V21.8974H54.0111V43.4461C54.0111 45.8171 54.8474 46.7934 56.8684 46.7934C59.6561 46.7934 61.259 44.8408 61.259 41.3539V35.8447ZM85.0935 48.1184H86.7661V52.3026H68.6463V48.1184H70.3189C72.2703 48.1184 72.8278 47.2118 72.8278 43.9342V5.43947H68.6463V0.976316C74.8489 0.976316 78.1244 0.767105 82.1665 0L82.5846 0.278947V43.9342C82.5846 47.2118 83.1422 48.1184 85.0935 48.1184ZM124.818 38.6342V43.0974C124.818 46.1658 123.981 47.7697 122.379 47.7697C120.985 47.7697 120.218 46.5842 120.218 44.4224V26.5697C120.218 19.8053 116.734 16.5974 109.207 16.5974C104.547 16.5974 101.016 17.8045 98.3384 20.3632H98.0924L98.6841 16.0395H92.6209V27.7553H97.0812C98.8235 23.5013 101.472 21.4789 105.235 21.4789C108.789 21.4789 110.462 23.2921 110.462 26.9882V32.6368H108.58C94.3632 32.6368 89.8333 35.1474 89.8333 42.8184C89.8333 49.3737 93.1785 53 99.1023 53C103.836 53 108.518 50.7252 111.075 47.2816H111.496C113.747 51.2901 116.384 53 120.289 53C125.724 53 129 49.6526 129 44.0737V38.6342H124.818ZM104.677 46.8632C101.401 46.8632 99.7288 44.8408 99.7288 40.9355C99.7288 36.1237 102.238 36.5421 107.255 36.5421H110.461V39.8197C110.461 44.2829 108.371 46.8632 104.677 46.8632Z",fill:"currentColor"})})}function Hg({className:e}){return a.jsx("svg",{role:"img","aria-label":"Atla",viewBox:"0 0 290.795 504",xmlns:"http://www.w3.org/2000/svg",className:e,children:a.jsxs("g",{fill:"currentColor",children:[a.jsx("path",{d:"M248.147 42.6314C221.816 16.2998 185.468 0 145.389 0C105.31 0 68.963 16.2998 42.6314 42.6314C16.2998 68.963 0 105.31 0 145.389C0 185.468 16.2998 221.816 42.6314 248.147C58.1072 263.623 77.0402 275.626 98.1701 282.895V265.675C75.4247 256.709 55.8133 241.492 41.4844 222.123H249.31C234.981 241.492 215.354 256.709 192.625 265.675V282.895C213.755 275.626 232.687 263.623 248.163 248.147C274.495 221.816 290.795 185.468 290.795 145.389C290.795 105.31 274.495 68.963 248.163 42.6314H248.147ZM31.2749 205.968C22.8261 190.137 17.6083 172.335 16.429 153.466H45.6199C52.0655 153.466 57.978 155.841 62.5335 159.815C67.0729 163.773 70.2392 169.33 71.2084 175.679C72.7916 186.066 75.1824 196.211 78.3648 205.968H31.2749ZM71.2084 115.1C70.2392 121.449 67.0729 127.006 62.5335 130.963C57.978 134.937 52.0655 137.312 45.6199 137.312H16.429C17.5921 118.444 22.8261 100.642 31.2749 84.8104H78.3648C75.1986 94.5676 72.7916 104.713 71.2084 115.1ZM84.4712 68.656H41.4844C59.9327 43.746 87.1043 25.6693 118.46 18.9975C105.617 31.4364 94.8423 46.5569 86.7005 63.7613C85.9412 65.3767 85.1981 67.0083 84.4873 68.6399L84.4712 68.656ZM137.312 205.968H95.5369C92.8391 198.569 90.6421 190.864 88.9621 182.932C87.3628 175.339 89.4629 167.973 93.9053 162.513C98.3478 157.053 105.133 153.483 112.887 153.483C119.639 153.483 125.746 156.213 130.156 160.639C134.582 165.065 137.312 171.172 137.312 177.908V205.984V205.968ZM137.312 112.887C137.312 119.639 134.582 125.746 130.156 130.156C125.729 134.582 119.623 137.312 112.887 137.312C105.133 137.312 98.3478 133.742 93.9053 128.282C89.4629 122.822 87.3628 115.455 88.9621 107.863C90.6421 99.9147 92.8391 92.2091 95.5369 84.8104H137.328V112.887H137.312ZM137.312 68.656H102.419C111.174 50.9509 122.999 35.6365 137.312 23.8438V68.656ZM153.466 23.8438C167.779 35.6365 179.604 50.9509 188.36 68.656H153.466V23.8438ZM201.816 182.932C200.136 190.88 197.939 198.569 195.242 205.968H153.466V177.892C153.466 171.139 156.197 165.033 160.623 160.623C165.049 156.197 171.155 153.466 177.892 153.466C185.646 153.466 192.431 157.037 196.873 162.497C201.316 167.957 203.416 175.323 201.816 182.916V182.932ZM196.873 128.282C192.431 133.742 185.646 137.312 177.892 137.312C171.139 137.312 165.033 134.582 160.623 130.156C156.197 125.729 153.466 119.623 153.466 112.887V84.8104H195.258C197.956 92.2091 200.153 99.9147 201.833 107.863C203.432 115.455 201.332 122.822 196.889 128.282H196.873ZM204.094 63.7774C195.952 46.573 185.177 31.4364 172.335 19.0137C203.69 25.6854 230.862 43.7622 249.31 68.6722H206.324C205.613 67.0245 204.87 65.3929 204.11 63.7936L204.094 63.7774ZM259.504 84.8104C267.952 100.642 273.17 118.444 274.35 137.312H245.159C238.713 137.312 232.801 134.937 228.245 130.963C223.706 127.006 220.539 121.449 219.57 115.1C217.987 104.729 215.596 94.5676 212.414 84.8104H259.504ZM259.504 205.968H212.414C215.58 196.211 217.987 186.066 219.57 175.679C220.539 169.33 223.706 163.773 228.245 159.815C232.801 155.841 238.713 153.466 245.159 153.466H274.35C273.186 172.335 267.952 190.137 259.504 205.968Z"}),a.jsx("path",{d:"M98.1701 322.28L39.6913 317.288L8.15795 246.451C17.9313 242.089 29.4009 246.499 33.7465 256.273L50.547 293.993H98.1862V322.28H98.1701ZM257.032 256.289L240.232 294.009H120.754C115.261 294.009 110.334 296.287 106.813 299.922C103.291 303.573 101.191 308.581 101.385 314.057L103.921 386.606C93.9376 392.115 87.1851 402.728 87.1851 414.909C87.1851 422.824 90.0283 430.062 94.7453 435.683L133.144 481.384H83.098C77.751 481.384 72.9046 483.549 69.383 487.054C65.8775 490.56 63.7128 495.406 63.7128 500.769V504H132.078C140.995 504 149.072 500.381 154.92 494.534C160.768 488.686 164.387 480.608 164.387 471.691C164.387 467.394 163.547 463.275 162.012 459.527L149.557 428.882L171.85 324.04C196.615 321.924 226.323 319.388 251.087 317.288L282.621 246.451C272.847 242.089 261.378 246.499 257.032 256.273V256.289ZM233.851 400.402C239.698 406.234 243.317 414.311 243.317 423.244V494.324H240.086C234.739 494.324 229.893 492.143 226.387 488.637C222.882 485.132 220.701 480.285 220.701 474.938V425.797L160.881 439.124V390.936H211.008C219.942 390.936 228.019 394.554 233.851 400.402ZM168.005 263.316C168.005 257.969 165.841 253.123 162.335 249.601C158.83 246.096 153.983 243.931 148.62 243.931H122.773V289.163H168.005V263.316ZM157.133 266.983C156.407 267.71 155.389 268.162 154.274 268.162C153.16 268.162 152.142 267.71 151.415 266.983C150.688 266.256 150.236 265.239 150.236 264.124C150.236 263.009 150.688 261.991 151.415 261.265C152.142 260.538 153.16 260.085 154.274 260.085C155.389 260.085 156.407 260.538 157.133 261.265C157.86 261.991 158.313 263.009 158.313 264.124C158.313 265.239 157.86 266.256 157.133 266.983Z"})]})})}var au;(au=document.documentElement.dataset).theme||(au.theme="light");const ws=e=>Math.round(e*1e3);function gl(e,t=!1){const n=_.useRef(null),[i,r]=_.useState(0),[o,s]=_.useState(!1);return _.useEffect(()=>{const c=n.current;if(!c)return;if(matchMedia("(prefers-reduced-motion: reduce)").matches){s(!0),r(e);return}let l=0,f=!1;const x=()=>{if(f)return;f=!0,v.disconnect(),s(!0);const b=performance.now(),w=j=>{const E=(j-b)/1e3;r(Math.min(e,E)),E<e&&(l=requestAnimationFrame(w))};l=requestAnimationFrame(w)},v=new IntersectionObserver(([b])=>{b.isIntersecting&&x()},{rootMargin:"0px 0px -25% 0px"});v.observe(c);const g=t?window.setTimeout(x,600):0;return()=>{v.disconnect(),cancelAnimationFrame(l),clearTimeout(g)}},[e]),{ref:n,t:i,on:o}}function Mf({children:e,max:t=1}){const n=_.useRef(null),[i,r]=_.useState(1);return _.useEffect(()=>{var c;const o=(c=n.current)==null?void 0:c.parentElement;if(!o)return;const s=new ResizeObserver(()=>r(Math.min(t,o.clientWidth/450)));return s.observe(o),()=>s.disconnect()},[]),a.jsx("div",{ref:n,style:{width:450,zoom:i},children:e})}const Wg=[{id:"pos",site:"positioning.md",title:"What we say no to",date:"Brand rules",quote:"We don't discount. A lower price tells the client the first one was a guess.",highlight:["We don't discount"]},{id:"offer",site:"offer.md",title:"The offer",date:"Brand rules",quote:"One plan, one price. No cheaper tier, no custom bundles.",highlight:["One plan, one price"]},{id:"voice",site:"voice.md",title:"How we write",date:"Brand rules",quote:"Say no plainly. Then offer the next step.",highlight:["Say no plainly","offer the next step"]}],Ug=[{text:"Thanks, Sam. We don't discount, so the price stays as quoted.",cite:["pos"]},{text:" There's one plan at one price, so there's no cheaper tier to move you to.",cite:["offer"]},{text:" What I can do: a short call to scope what you actually need.",cite:["voice"]}];function Vg({t:e}){const[t,n]=_.useState(!1),i=e<.9?1:e<1.7?2:3;return a.jsxs(a.Fragment,{children:[t&&a.jsx("style",{children:".ui-cac__action{background:#191919!important;color:#fff!important}"}),a.jsx(Mh,{sources:Wg,segments:Ug.slice(0,i),action:{label:t?"Sent. Discount given: 0.":"Approve and send",onClick:()=>n(!0)}})]})}const Yg=[{id:"c",name:"Color",kind:"palette",logo:Ue.figma,from:.3,to:4.3},{id:"v",name:"Voice",kind:"words",logo:Ue.claude,from:.5,to:4.6},{id:"t",name:"Type",kind:"type sizes",logo:Ue.figma,from:.7,to:4.9}];function Qg({t:e}){const[t,n]=_.useState([]),i=Yg.map(l=>{const f=e<l.from?0:Math.min(12,Math.floor(12*(e-l.from)/(l.to-l.from)));return{id:l.id,name:l.name,avatar:l.logo(),done:f,total:12,step:`Post ${Math.min(12,f+1)}: ${l.kind}`}}),o=[{id:"t",agentId:"t",at:3900,sev:"warning",drift:"Post 9 · a 5th type size, 22px → 20px",fix:"Post 9 · fixed, now 20px"},{id:"v",agentId:"v",at:2700,sev:"warning",drift:"Post 7 · banned word “elevate” → “raise”",fix:"Post 7 · fixed, now “raise”"},{id:"c",agentId:"c",at:1500,sev:"critical",drift:"Post 4 · off-palette blue → #1F4FD8",fix:"Post 4 · fixed, now #1F4FD8"}].filter(l=>e>=l.at/1e3),s=o.map(l=>({id:l.id,agentId:l.agentId,at:l.at,severity:t.includes(l.id)?"note":l.sev,title:t.includes(l.id)?l.fix:l.drift})),c=t.length===3;return a.jsx("div",{onClickCapture:l=>{var g;const f=l.target.closest(".ui-afc__slot");if(!f||!f.parentElement)return;const x=[...f.parentElement.children].indexOf(f),v=(g=o[x])==null?void 0:g.id;v&&!t.includes(v)&&n([...t,v])},children:a.jsx(Bh,{title:c?"12 of 12 on brand.":e<4.9?"Checking 12 posts":"3 drifts found",agents:i,findings:s,rows:4,now:Math.max(ws(e),5e3)})})}const Zg=({c:e})=>a.jsx("svg",{viewBox:"0 0 14 14",children:a.jsx("circle",{cx:"7",cy:"7",r:"6",fill:e})}),qg=()=>a.jsxs("svg",{viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.3",children:[a.jsx("circle",{cx:"8",cy:"8",r:"6.2"}),a.jsx("path",{d:"M1.8 8h12.4M8 1.8c1.8 1.9 2.6 3.9 2.6 6.2S9.8 12.3 8 14.2C6.2 12.3 5.4 10.3 5.4 8S6.2 3.7 8 1.8z"})]}),Kg=()=>a.jsxs("svg",{viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.3",children:[a.jsx("rect",{x:"1.8",y:"2.6",width:"12.4",height:"8.6",rx:"1.6"}),a.jsx("path",{d:"M8 11.2v2.4M5.4 13.8h5.2",strokeLinecap:"round"})]}),Gg=()=>a.jsxs("svg",{viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.3",children:[a.jsx("rect",{x:"2.2",y:"2.2",width:"11.6",height:"11.6",rx:"2.2"}),a.jsx("path",{d:"M5 10.6l2-2.4 1.6 1.6 2.4-3",strokeLinecap:"round",strokeLinejoin:"round"})]});function Xg({t:e}){const[t,n]=_.useState(!1),i=0,r=[{id:"cva",action:t?"Synced":"Sync",target:"Canva brand kit",system:"Canva",icon:a.jsx("span",{style:{fontWeight:600},children:"C"}),at:i+4200,detail:t?"Brand kit on the new accent":"Waiting for your approval",dependsOn:["tok"]},{id:"fig",action:t?"Synced":"Sync",target:"Figma library",system:"Figma",icon:Ue.figma(),at:i+3600,detail:t?"Library on the new accent":"Waiting for your approval",dependsOn:["tok"]},{id:"mail",action:"Updated",target:"Email templates",system:"Gmail",icon:Ue.gmail(),at:i+2900,detail:"3 templates, new accent",dependsOn:["tok"]},{id:"ads",action:"Updated",target:"Ads",system:"Ads",icon:a.jsx(Gg,{}),at:i+2300,detail:"5 ads, new accent",dependsOn:["tok"]},{id:"deck",action:"Updated",target:"Sales deck",system:"Deck",icon:a.jsx(Kg,{}),at:i+1700,detail:"6 slides, new accent",dependsOn:["tok"]},{id:"web",action:"Updated",target:"Website",system:"Website",icon:a.jsx(qg,{}),at:i+1100,detail:"9 pages, new accent",dependsOn:["tok"]},{id:"tok",action:"Changed",target:"Accent color",system:"Tokens",icon:a.jsx(Zg,{c:"#E4572E"}),at:i+400,change:["#2F5BFF","#E4572E"]}];return a.jsxs(a.Fragment,{children:[a.jsx("style",{children:".ui-alc__sum{display:none!important}"+(t?"":".ui-alc__row:nth-child(1) .ui-alc__detail,.ui-alc__row:nth-child(2) .ui-alc__detail{color:#cc4e00}")}),a.jsx(Gh,{entries:r.filter(o=>ws(e)>=o.at),agent:"Claude",title:"Accent color change",now:Math.max(ws(e),4800)+1e3}),a.jsx("div",{className:"gate",style:{opacity:e>=4.6?1:0,transition:"opacity .4s"},children:t?a.jsx("span",{children:"1 rule changed. 23 pieces updated."}):a.jsxs(a.Fragment,{children:[a.jsx("span",{children:"Figma and Canva wait for your OK."}),a.jsx("button",{type:"button",onClick:()=>n(!0),children:"Approve sync"})]})})]})}function jo({id:e,n:t,label:n,title:i,text:r,dur:o=1,note:s,desc:c,children:l}){const{ref:f,t:x,on:v}=gl(o);return a.jsxs("section",{ref:f,id:e,className:"row"+(v?" in":""),children:[a.jsxs("div",{className:"copy",children:[a.jsxs("p",{className:"idx",children:[a.jsx("b",{children:t}),n]}),a.jsx("h2",{className:"title",children:i}),a.jsx("p",{className:"body",children:r})]}),a.jsxs("div",{className:"slot",children:[typeof l=="function"?l(x):l,s&&a.jsx("p",{className:"hero-note",children:s}),c&&a.jsx("p",{className:"sr",children:c})]})]})}const Wn=(e,t)=>({name:e,logo:a.jsx(t,{})}),Jg=[{id:"lead",kind:"person",name:"Dana Ruiz",role:"Head of marketing"},{id:"atla",kind:"person",name:"Atla designer",role:"Approves brand calls",parent:"lead"},{id:"email",kind:"agent",name:"Email writer",parent:"atla",model:"Claude",logo:a.jsx(Ue.claude,{}),tools:[Wn("Gmail",Ue.gmail),Wn("Notion",Ue.notion)],status:"working",task:"Drafting the holiday promo email"},{id:"social",kind:"agent",name:"Social posts",parent:"atla",model:"Claude",logo:a.jsx(Ue.claude,{}),tools:[Wn("Slack",Ue.slack),Wn("Figma",Ue.figma)],status:"working",task:"Writing captions for next week"},{id:"deck",kind:"agent",name:"Deck builder",parent:"atla",model:"Claude",logo:a.jsx(Ue.claude,{}),tools:[Wn("Figma",Ue.figma),Wn("Notion",Ue.notion)],status:"idle"}],em={id:"accent",from:"email",label:"Use a second accent color in the promo email?"};function tm(){const{ref:e,on:t}=gl(1),[n,i]=_.useState([]);return _.useEffect(()=>{if(!t)return;const r=setTimeout(()=>i([em]),1400);return()=>clearTimeout(r)},[t]),a.jsxs("section",{ref:e,className:"row"+(t?" in":""),children:[a.jsxs("div",{className:"copy",children:[a.jsxs("p",{className:"idx",children:[a.jsx("b",{children:"04"}),"Why a studio"]}),a.jsx("p",{className:"why-line",children:"A custom GPT with no brand rules is guessing. We write those rules as designers and check them on your own work before your team relies on them."}),a.jsx("p",{className:"why-by",children:"Led by José Pablo Domínguez, founder and creative director of Atla. You own every file we make."})]}),a.jsxs("div",{className:"slot",children:[a.jsx(Ag,{title:"Your team",nodes:Jg,escalations:n,onApprove:()=>i([])}),a.jsx("p",{className:"hero-note",children:"Example: a fictional team, its agents and an Atla designer."})]})]})}const nm="josepablo@atla.design",Vr=1024*1024,im=[["logo.svg",.06*Vr,"image/svg+xml"],["brand-guidelines.pdf",2.9*Vr,"application/pdf"],["colors.ase",.02*Vr,"application/octet-stream"],["fonts.zip",1.6*Vr,"application/zip"]],Jc=()=>a.jsx(Hg,{className:"atla-sym"}),rm=[{label:"Review your brand",logo:Jc,verb:"Reviewing",from:4,to:4.9,took:7},{label:"Write the rules and the voice",logo:Jc,verb:"Writing",from:4.9,to:6.5,took:38,subs:[["Colors, type, logo use","visual-system.json"],["Voice and words you never say","voice.md"],["What you sell, what you don't","positioning.md"]]},{label:"Build the visual system",logo:Ue.figma,verb:"Building",from:6.5,to:7.3,took:11}];function am(e){const t=rm.map(i=>{const r=e<i.from?"pending":e<i.to?"active":"done";let o;if(i.subs&&r!=="pending"){const s=(i.to-i.from-.3)/i.subs.length,c=r==="done"?i.subs.length:Math.min(i.subs.length,Math.floor((e-i.from-.15)/s)+1);o=c>0?i.subs.slice(0,c).map(([l,f],x)=>({label:l,meta:f,state:r==="active"&&x===c-1?"active":"done"})):void 0}return{label:i.label,logo:i.logo(),state:r,verb:i.verb,subs:o}}),n=e<7.3?"pending":e<7.9?"active":"done";return t.push({label:"Ready in Claude and ChatGPT",logo:Ue.claude(),state:n,verb:"Installing"}),t}function om(){const{ref:e,t,on:n}=gl(8.4,!0);_.useEffect(()=>{if(!n)return;const o=()=>{var x;return(x=e.current)==null?void 0:x.querySelector(".ui-dzc__area")},s=new DataTransfer;im.forEach(([x,v,g])=>s.items.add(new File([new Uint8Array(Math.round(v))],x,{type:g})));const c=x=>{var v;return(v=o())==null?void 0:v.dispatchEvent(new DragEvent(x,{dataTransfer:s,bubbles:!0,cancelable:!0}))},l=window.setTimeout(()=>c("dragenter"),300),f=window.setTimeout(()=>c("drop"),1e3);return()=>{clearTimeout(l),clearTimeout(f)}},[n]);const i=o=>{o.isTrusted&&(o.preventDefault(),o.stopPropagation())},r=t>=3.9;return a.jsxs("div",{ref:e,className:"hero-drop",children:[a.jsxs("div",{className:"hero-dz"+(r?" off":""),onClickCapture:i,onDragEnterCapture:i,onDragOverCapture:i,onDropCapture:i,children:[a.jsx(bh,{hint:"Logo, guidelines, colors, fonts"}),a.jsx("span",{className:"demo-tag",children:"Demo"})]}),a.jsx("div",{className:"hero-build"+(r?" on":""),children:a.jsx(Mf,{max:1.2,children:a.jsx(kg,{title:"Your agentic brand",agent:a.jsx(a.Fragment,{children:"Atla studio"}),rows:am(t)})})})]})}const Ya=e=>e.trim().toLowerCase().replace(/^https?:\/\//,"").replace(/^www\./,"").replace(/\/.*$/,""),$f="https://calendly.com/josepablo-atla/30min",et=[{id:"q1",q:"Do you have written brand guidelines?",item:"Written brand guidelines"},{id:"q2",q:"Is your voice written down, including words you never use?",item:"Voice and banned words written down"},{id:"q3",q:"Is it written down what you sell and what you don't?",item:"Positioning written down"},{id:"q4",q:"Does one person own the brand rules?",item:"One owner for the rules"},{id:"q5",q:"Do you have your logo, colors and fonts as source files?",item:"Source files for logo, colors and fonts"},{id:"q6",q:"Does the AI your team uses already have your brand rules?",item:"AI has your brand rules"},{id:"q7",q:"Does your recent work match the guidelines?",item:"Recent work is on brand"},{id:"q8",q:"When the brand changes, does every tool get the update?",item:"Changes reach every tool"}],jn={touch:{label:"Touch-ups first",setup:"We fix what has drifted, then set the brand up in Claude and ChatGPT"},rebrand:{label:"Rebrand first",setup:"We redesign the brand with you, then set the new one up in Claude and ChatGPT"},ready:{label:"Straight to setup",setup:"We turn your current guidelines into rules Claude and ChatGPT follow"}};function eu({ids:e}){return({values:t,setValues:n})=>a.jsx(a.Fragment,{children:et.filter(i=>e.includes(i.id)).map(i=>a.jsx(sn,{name:i.id,label:i.q,children:a.jsx(Sf,{"aria-label":i.q,size:"sm",fullWidth:!0,value:t[i.id]??"",onChange:r=>n({[i.id]:r}),options:[{value:"yes",label:"Yes"},{value:"no",label:"No"}]})},i.id))})}const tu=e=>t=>Object.fromEntries(e.filter(n=>!t[n]).map(n=>[n,"Pick yes or no"])),nu=["q1","q2","q3","q4"],iu=["q5","q6","q7","q8"],sm=[{id:"site",title:"Website",heading:"What's your website?",description:"We look at your brand before we reply.",validate:e=>/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(Ya(e.domain))?null:{domain:"Enter a website, like halden.com"},render:({values:e,setValues:t})=>a.jsx(sn,{name:"domain",label:"Website",children:a.jsx(Sn,{prefix:"https://",placeholder:"yourbrand.com",inputMode:"url",value:e.domain,onChange:n=>t({domain:n.target.value})})})},{id:"brand",title:"Brand",heading:"How do you feel about your brand?",validate:e=>e.state?null:{state:"Pick one"},render:({values:e,setValues:t})=>a.jsx(ng,{label:"How you feel about your brand",value:e.state,onChange:n=>t({state:n}),options:[{value:"touch",title:"It needs touch-ups",description:"It works, but some things have drifted"},{value:"rebrand",title:"It needs a rebrand",description:"We've outgrown it"},{value:"ready",title:"It's ready for AI",description:"We like it as it is"}]})},{id:"rules",title:"Rules",heading:"Your brand rules",validate:tu(nu),render:eu({ids:nu})},{id:"team",title:"Team",heading:"Your files and your AI",validate:tu(iu),render:eu({ids:iu})},{id:"you",title:"You",heading:"Where can we reach you?",description:"We use it only to reply about your brand.",validate:e=>({...e.name.trim()?{}:{name:"Add your name"},...e.role.trim()?{}:{role:"Add your role"},.../^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e.email.trim())?{}:{email:"Enter your work email"}}),render:({values:e,setValues:t})=>a.jsxs(a.Fragment,{children:[a.jsx(sn,{name:"name",label:"Name",children:a.jsx(Sn,{autoComplete:"name",value:e.name,onChange:n=>t({name:n.target.value})})}),a.jsx(sn,{name:"role",label:"Role",hint:"For example CMO, founder, head of brand",children:a.jsx(Sn,{autoComplete:"organization-title",value:e.role,onChange:n=>t({role:n.target.value})})}),a.jsx(sn,{name:"email",label:"Work email",children:a.jsx(Sn,{type:"email",autoComplete:"email",value:e.email,onChange:n=>t({email:n.target.value})})}),a.jsx(sn,{name:"wrong",label:"What does AI get wrong about your brand today?",optional:!0,children:a.jsx(Sn,{value:e.wrong,onChange:n=>t({wrong:n.target.value})})})]})}],lm={domain:"",state:"",name:"",role:"",email:"",wrong:"",...Object.fromEntries(et.map(e=>[e.id,""]))};function ru(e,t){const n=et.length-t,i={touch:{id:"touch",label:jn.touch.label,signal:3,reason:`${n} of ${et.length} checks are missing. ${jn.touch.setup}.`},rebrand:{id:"rebrand",label:jn.rebrand.label,signal:3,reason:`You said you've outgrown the brand. ${jn.rebrand.setup}.`},ready:{id:"ready",label:jn.ready.label,signal:3,reason:`${t} of ${et.length} checks are in place. ${jn.ready.setup}.`}};let r=e.state||"touch";return r==="ready"&&t<6&&(r="touch",i.touch.signal=2,i.touch.reason=`You like the brand, but ${n} of ${et.length} checks are missing. ${jn.touch.setup}.`),[i[r],...["touch","rebrand","ready"].filter(o=>o!==r).map(o=>({...i[o],signal:1}))]}function cm(){const[e,t]=_.useState("once");return a.jsxs("div",{className:"pay",children:[a.jsxs("div",{className:"pay-head",children:[a.jsx("p",{className:"pay-title",children:"How you pay"}),a.jsx(Sf,{"aria-label":"How you pay",size:"sm",variant:"tray",value:e,onChange:t,options:[{value:"once",label:"Pay once",badge:"Save $6,000"},{value:"monthly",label:"Monthly"}]})]}),a.jsx("p",{className:"pay-price",children:e==="once"?a.jsxs(a.Fragment,{children:["$24,000 ",a.jsx("span",{children:"once"})]}):a.jsxs(a.Fragment,{children:["$2,500 ",a.jsx("span",{children:"a month for 12 months"})]})}),a.jsx("p",{className:"pay-text",children:e==="once"?"Setup plus 12 months of management in one payment. That's $6,000 less than paying monthly.":"Setup plus 12 months of management, $30,000 in total."}),a.jsx("p",{className:"pay-note",children:"If you need a rebrand first, we quote it separately."})]})}const Tf="atla.design/brand-intelligence";function um(e){const t=Ya(e.domain),n=et.filter(i=>e[i.id]==="yes").length;return["Brand Intelligence scorecard",`Website: ${t}`,`Score: ${n} of ${et.length}`,`Brand: ${e.state}`,`Role: ${e.role}`,...e.wrong.trim()?[`What AI gets wrong: ${e.wrong.trim()}`]:[],...et.map(i=>`${i.q} ${e[i.id]}`)].join(`
`).slice(0,4e3)}async function dm(e){if(!/(^|\.)atla\.design$/.test(location.hostname))return"preview";try{return(await fetch("/api/contact",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({name:e.name.trim(),email:e.email.trim(),company:Ya(e.domain).slice(0,160),message:um(e),source:Tf})})).ok?"sent":"failed"}catch{return"failed"}}function fm({v:e,sent:t}){const n=Ya(e.domain),i=et.filter(c=>e[c.id]==="yes").length,r=$f+"?name="+encodeURIComponent(e.name)+"&email="+encodeURIComponent(e.email)+"&utm_source=brand-intelligence&utm_campaign="+encodeURIComponent(n)+"&utm_content="+encodeURIComponent(i+"-of-8-"+(e.state||"touch")),o=[`Website: ${n}`,`Score: ${i} of ${et.length}`,`Brand: ${e.state}`,`Name: ${e.name}`,`Role: ${e.role}`,`Email: ${e.email}`,...e.wrong.trim()?[`What AI gets wrong: ${e.wrong}`]:[],...et.map(c=>`${c.q} ${e[c.id]}`)].join(`
`),s="mailto:"+nm+"?subject="+encodeURIComponent("Brand Intelligence scorecard: "+n)+"&body="+encodeURIComponent(o);return a.jsxs("div",{className:"results",children:[a.jsxs("div",{className:"results-head",children:[a.jsx("p",{className:"meta",children:"Your results"}),a.jsxs("h3",{children:[n,": ",i," of ",et.length," checks in place"]}),a.jsx("p",{className:"results-band",children:i<=3?"Today your team's AI is mostly guessing.":i<=6?"Part of your brand is written down. AI can't use the rest yet.":"Your brand is close. Setup is the main step left."}),e.wrong.trim()&&a.jsxs("p",{className:"results-quote",children:['You said: "',e.wrong.trim(),'". The voice and positioning rules are where we fix that.']})]}),a.jsx(og,{title:"AI readiness",steps:et.map(c=>({id:c.id,label:c.item,done:e[c.id]==="yes"}))}),a.jsx(cg,{title:"Recommended: "+ru(e,i)[0].label,options:ru(e,i).slice(0,1),onAccept:()=>window.open(r,"_blank","noopener")}),a.jsx(fg,{title:"What happens next",groups:[{id:"setup",title:"Setup, one time",tasks:[{id:"s1",label:"A review call"},{id:"s2",label:"We audit your brand on real work"},{id:"s3",label:"Touch-ups or a rebrand, if you need one"},{id:"s4",label:"Your brand set up in Claude and ChatGPT"}]},{id:"monthly",title:"Monthly fee",tasks:[{id:"m1",label:"We check new work against the rules"},{id:"m2",label:"We update the rules when the brand changes"},{id:"m3",label:"You get a review report every month"}]}]}),a.jsx(cm,{}),t==="failed"&&a.jsx("p",{className:"results-sent fail",children:`Your answers didn't reach us. Use "Email us instead" and they arrive filled in.`}),t==="sent"&&a.jsx("p",{className:"results-sent",children:"We have your answers."}),t==="preview"&&a.jsx("p",{className:"results-sent",children:"Preview: answers are only sent from atla.design."}),a.jsxs("div",{className:"ctas",children:[a.jsx("a",{id:"book",className:"btn",href:r,target:"_blank",rel:"noopener",children:"Book your review call"}),a.jsx("a",{className:"btn soft",href:s,children:"Email us instead"})]})]})}function pm(){const[e,t]=_.useState(null),[n,i]=_.useState("sending");return e?a.jsx(fm,{v:e,sent:n}):a.jsx(zf,{steps:sm,initialValues:lm,submitLabel:"See my results",onComplete:r=>{t(r),dm(r).then(i),requestAnimationFrame(()=>{var o;return(o=document.getElementById("start"))==null?void 0:o.scrollIntoView({behavior:"smooth"})})}})}const hm=/(^|\.)atla\.design$/.test(location.hostname)?"/brand-intelligence/assets/brand-rules-template.zip":"assets/brand-rules-template.zip",If=["README.md","install.md","AGENTS.md","verbal/positioning.md","verbal/proof-and-claims.md","verbal/voice-and-tone.md","verbal/terminology.md","visual/visual-system.json","visual/logo-and-color.md"],gm=[{id:"get",title:"Template",heading:"Get the template",description:"Your download starts right after this step.",validate:e=>({...e.name.trim()?{}:{name:"Add your name"},.../^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e.email.trim())?{}:{email:"Enter your work email"}}),render:({values:e,setValues:t})=>a.jsxs(a.Fragment,{children:[a.jsx(sn,{name:"name",label:"Name",children:a.jsx(Sn,{autoComplete:"name",value:e.name,onChange:n=>t({name:n.target.value})})}),a.jsx(sn,{name:"email",label:"Work email",children:a.jsx(Sn,{type:"email",autoComplete:"email",value:e.email,onChange:n=>t({email:n.target.value})})})]})}];async function mm(e){if(!/(^|\.)atla\.design$/.test(location.hostname))return"preview";try{return(await fetch("/api/contact",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({name:e.name.trim(),email:e.email.trim(),message:"Downloaded the Brand rules template from the Brand Intelligence page.",source:Tf})})).ok?"sent":"failed"}catch{return"failed"}}function xm(){const[e,t]=_.useState("sending");return a.jsx("div",{className:"magnet-form",children:a.jsx(zf,{steps:gm,initialValues:{name:"",email:""},submitLabel:"Get the template",onComplete:n=>{mm(n).then(t)},success:()=>a.jsxs(Nf,{title:"Your template is ready",description:"Short on time? Fill in the three files in the README's 20-minute start, then install. Stuck on a file? Book a call and we'll fill it in with you.",children:[e==="preview"?a.jsx("ul",{className:"files files-links",children:If.map(n=>a.jsx("li",{children:a.jsx("a",{href:"assets/brand-rules-template/"+n,target:"_blank",rel:"noopener",children:n})},n))}):a.jsx("a",{className:"btn",href:hm,download:"brand-rules-template.zip",children:"Download the template"}),a.jsx("a",{className:"btn soft",href:$f+"?utm_source=brand-intelligence&utm_campaign=template",target:"_blank",rel:"noopener",children:"Book a call"}),e==="preview"&&a.jsx("p",{className:"results-sent",children:"Preview: the zip and saving your email work only on atla.design."})]})})})}function vm(){return a.jsxs(a.Fragment,{children:[a.jsxs("div",{className:"wrap",children:[a.jsxs("nav",{children:[a.jsxs("a",{className:"brand",href:"https://www.atla.design","aria-label":"Atla, Brand Intelligence",children:[a.jsx(Xc,{className:"wordmark"}),a.jsx("span",{children:"Brand Intelligence"})]}),a.jsx("a",{className:"nav-link",href:"#steps",children:"How it works"}),a.jsx("a",{className:"btn",href:"#start",children:"Check your brand"})]}),a.jsxs("header",{className:"hero",children:[a.jsxs("div",{children:[a.jsx("p",{className:"eyebrow",children:"Brand Intelligence by Atla, a branding studio in Austin"}),a.jsx("h1",{className:"hook",children:"Everything your team makes with AI, on brand."}),a.jsx("p",{className:"body",children:"We turn your brand into rules Claude and ChatGPT follow, so posts, decks and emails come out in your voice, your colors and your type. Our designers write the rules and check the work every month."}),a.jsxs("div",{className:"ctas",children:[a.jsx("a",{className:"btn",href:"#start",children:"Check your brand"}),a.jsx("a",{className:"btn soft",href:"#steps",children:"How it works"})]})]}),a.jsxs("div",{className:"hero-right",children:[a.jsx(om,{}),a.jsx("p",{className:"hero-note",children:"A demo with example files. On a real project, our designers write and approve every rule."}),a.jsx("p",{className:"sr",children:"Demo: a brand's logo, guidelines, colors and fonts are uploaded, then the studio reviews them, writes the rules and voice, builds the visual system, and the brand ends up ready in Claude and ChatGPT."})]})]}),a.jsxs("section",{className:"outcomes","aria-label":"What changes",children:[a.jsxs("div",{children:[a.jsx("h2",{children:"First drafts that sound like you"}),a.jsx("p",{children:"Your voice, the words you never use and what you sell travel with every prompt."})]}),a.jsxs("div",{children:[a.jsx("h2",{children:"Review, not redo"}),a.jsx("p",{children:"Colors, type and logo rules come built in, so your designers approve work instead of rebuilding it."})]}),a.jsxs("div",{children:[a.jsx("h2",{children:"Change it once"}),a.jsx("p",{children:"Update the brand one time and every tool your team uses follows."})]})]}),a.jsx(jo,{id:"steps",dur:5.1,n:"01",label:"Review",note:"Example: an audit of 12 posts for a fictional brand.",title:"See where your brand breaks",text:"We go through your recent posts, decks and ads and mark each place where the color, type or voice has drifted from the guidelines.",desc:"Example audit: three checkers review 12 posts and flag an off-palette blue, a banned word and an extra type size, each with its fix.",children:e=>a.jsx(Qg,{t:e})}),a.jsx(jo,{dur:4.8,n:"02",label:"Fix",title:"Fix it once, everywhere",text:"If the brand mostly works, we fix what's off. If it doesn't, we redesign it before anything else. After that, a change you approve once shows up across your tools.",note:"Example: one color change, and the tools that follow it.",desc:"Example: the accent color changes once and the website, deck, ads and email templates follow; Figma and Canva wait for approval.",children:e=>a.jsx(Xg,{t:e})}),a.jsx(jo,{dur:2,n:"03",label:"Install",title:"Your AI answers like your brand",text:"You get your brand as files any AI can read, a Claude skill, and a one-page guide for each tool your team uses. Every month we check new work against the rules and send you the review.",note:"Example: a fictional brand's AI answering a discount request.",desc:"Example: an AI reply to a discount request that cites the brand's positioning, offer and voice files.",children:e=>a.jsx(Mf,{children:a.jsx(Vg,{t:e})})}),a.jsx(tm,{}),a.jsx("section",{className:"row wide",children:a.jsxs("div",{children:[a.jsxs("p",{className:"idx",children:[a.jsx("b",{children:"05"}),"Where you start"]}),a.jsx("h2",{className:"title",children:"Three ways to start"}),a.jsxs("ul",{className:"paths",children:[a.jsxs("li",{children:[a.jsx("h3",{children:"You like your brand"}),a.jsx("p",{children:"We review it, fix what's off and set it up in your team's AI."})]}),a.jsxs("li",{children:[a.jsx("h3",{children:"You've outgrown it"}),a.jsx("p",{children:"We rebrand first, then set up the new brand the same way."})]}),a.jsxs("li",{children:[a.jsx("h3",{children:"It's ready as it is"}),a.jsx("p",{children:"We go straight to setup in Claude and ChatGPT."})]})]})]})}),a.jsxs("section",{className:"cta",id:"start",children:[a.jsxs("div",{className:"cta-copy",children:[a.jsx("h2",{className:"hook",children:"Is your brand ready for AI?"}),a.jsx("p",{className:"body",children:"Eight yes-or-no questions. You get your score, what's missing, the path we'd recommend and the price."})]}),a.jsx("div",{className:"intake",children:a.jsx(pm,{})})]}),a.jsxs("section",{className:"cta magnet",id:"template",children:[a.jsxs("div",{className:"cta-copy",children:[a.jsxs("p",{className:"idx",children:[a.jsx("b",{children:"Free"}),"Brand rules template"]}),a.jsx("h2",{className:"title",children:"Not ready for a call? Start with the template."}),a.jsx("p",{className:"body",children:"The same structure we build for clients, ready for you to fill in, with a one-page guide to load it into Claude and ChatGPT. Start with three files in 20 minutes."}),a.jsx("p",{className:"body",children:"You fill in the template yourself. With the paid service, our designers write the rules and check your team's work every month."}),a.jsx("ul",{className:"files",children:If.map(e=>a.jsx("li",{children:e},e))})]}),a.jsx("div",{className:"intake",children:a.jsx(xm,{})})]})]}),a.jsx("footer",{children:a.jsxs("div",{className:"wrap",children:[a.jsxs("span",{className:"foot-brand",children:[a.jsx(Xc,{className:"wordmark sm"}),a.jsx("span",{children:"Brand Intelligence"})]}),a.jsx("a",{href:"https://www.atla.design",children:"atla.design"})]})})]})}_f(document.getElementById("root")).render(a.jsx(vm,{}));
