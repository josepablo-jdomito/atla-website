var mc={exports:{}},Ji={},xc={exports:{}},K={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Br=Symbol.for("react.element"),Hd=Symbol.for("react.portal"),Wd=Symbol.for("react.fragment"),Vd=Symbol.for("react.strict_mode"),Ud=Symbol.for("react.profiler"),Qd=Symbol.for("react.provider"),Yd=Symbol.for("react.context"),Zd=Symbol.for("react.forward_ref"),qd=Symbol.for("react.suspense"),Kd=Symbol.for("react.memo"),Gd=Symbol.for("react.lazy"),Oo=Symbol.iterator;function Xd(e){return e===null||typeof e!="object"?null:(e=Oo&&e[Oo]||e["@@iterator"],typeof e=="function"?e:null)}var vc={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},_c=Object.assign,wc={};function Un(e,t,n){this.props=e,this.context=t,this.refs=wc,this.updater=n||vc}Un.prototype.isReactComponent={};Un.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};Un.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function yc(){}yc.prototype=Un.prototype;function Hs(e,t,n){this.props=e,this.context=t,this.refs=wc,this.updater=n||vc}var Ws=Hs.prototype=new yc;Ws.constructor=Hs;_c(Ws,Un.prototype);Ws.isPureReactComponent=!0;var Bo=Array.isArray,kc=Object.prototype.hasOwnProperty,Vs={current:null},bc={key:!0,ref:!0,__self:!0,__source:!0};function jc(e,t,n){var r,i={},s=null,o=null;if(t!=null)for(r in t.ref!==void 0&&(o=t.ref),t.key!==void 0&&(s=""+t.key),t)kc.call(t,r)&&!bc.hasOwnProperty(r)&&(i[r]=t[r]);var c=arguments.length-2;if(c===1)i.children=n;else if(1<c){for(var l=Array(c),f=0;f<c;f++)l[f]=arguments[f+2];i.children=l}if(e&&e.defaultProps)for(r in c=e.defaultProps,c)i[r]===void 0&&(i[r]=c[r]);return{$$typeof:Br,type:e,key:s,ref:o,props:i,_owner:Vs.current}}function Jd(e,t){return{$$typeof:Br,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function Us(e){return typeof e=="object"&&e!==null&&e.$$typeof===Br}function ef(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var Ho=/\/+/g;function va(e,t){return typeof e=="object"&&e!==null&&e.key!=null?ef(""+e.key):t.toString(36)}function mi(e,t,n,r,i){var s=typeof e;(s==="undefined"||s==="boolean")&&(e=null);var o=!1;if(e===null)o=!0;else switch(s){case"string":case"number":o=!0;break;case"object":switch(e.$$typeof){case Br:case Hd:o=!0}}if(o)return o=e,i=i(o),e=r===""?"."+va(o,0):r,Bo(i)?(n="",e!=null&&(n=e.replace(Ho,"$&/")+"/"),mi(i,t,n,"",function(f){return f})):i!=null&&(Us(i)&&(i=Jd(i,n+(!i.key||o&&o.key===i.key?"":(""+i.key).replace(Ho,"$&/")+"/")+e)),t.push(i)),1;if(o=0,r=r===""?".":r+":",Bo(e))for(var c=0;c<e.length;c++){s=e[c];var l=r+va(s,c);o+=mi(s,t,n,l,i)}else if(l=Xd(e),typeof l=="function")for(e=l.call(e),c=0;!(s=e.next()).done;)s=s.value,l=r+va(s,c++),o+=mi(s,t,n,l,i);else if(s==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return o}function Yr(e,t,n){if(e==null)return e;var r=[],i=0;return mi(e,r,"","",function(s){return t.call(n,s,i++)}),r}function tf(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(n){(e._status===0||e._status===-1)&&(e._status=1,e._result=n)},function(n){(e._status===0||e._status===-1)&&(e._status=2,e._result=n)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var Ie={current:null},xi={transition:null},nf={ReactCurrentDispatcher:Ie,ReactCurrentBatchConfig:xi,ReactCurrentOwner:Vs};function zc(){throw Error("act(...) is not supported in production builds of React.")}K.Children={map:Yr,forEach:function(e,t,n){Yr(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return Yr(e,function(){t++}),t},toArray:function(e){return Yr(e,function(t){return t})||[]},only:function(e){if(!Us(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};K.Component=Un;K.Fragment=Wd;K.Profiler=Ud;K.PureComponent=Hs;K.StrictMode=Vd;K.Suspense=qd;K.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=nf;K.act=zc;K.cloneElement=function(e,t,n){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var r=_c({},e.props),i=e.key,s=e.ref,o=e._owner;if(t!=null){if(t.ref!==void 0&&(s=t.ref,o=Vs.current),t.key!==void 0&&(i=""+t.key),e.type&&e.type.defaultProps)var c=e.type.defaultProps;for(l in t)kc.call(t,l)&&!bc.hasOwnProperty(l)&&(r[l]=t[l]===void 0&&c!==void 0?c[l]:t[l])}var l=arguments.length-2;if(l===1)r.children=n;else if(1<l){c=Array(l);for(var f=0;f<l;f++)c[f]=arguments[f+2];r.children=c}return{$$typeof:Br,type:e.type,key:i,ref:s,props:r,_owner:o}};K.createContext=function(e){return e={$$typeof:Yd,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:Qd,_context:e},e.Consumer=e};K.createElement=jc;K.createFactory=function(e){var t=jc.bind(null,e);return t.type=e,t};K.createRef=function(){return{current:null}};K.forwardRef=function(e){return{$$typeof:Zd,render:e}};K.isValidElement=Us;K.lazy=function(e){return{$$typeof:Gd,_payload:{_status:-1,_result:e},_init:tf}};K.memo=function(e,t){return{$$typeof:Kd,type:e,compare:t===void 0?null:t}};K.startTransition=function(e){var t=xi.transition;xi.transition={};try{e()}finally{xi.transition=t}};K.unstable_act=zc;K.useCallback=function(e,t){return Ie.current.useCallback(e,t)};K.useContext=function(e){return Ie.current.useContext(e)};K.useDebugValue=function(){};K.useDeferredValue=function(e){return Ie.current.useDeferredValue(e)};K.useEffect=function(e,t){return Ie.current.useEffect(e,t)};K.useId=function(){return Ie.current.useId()};K.useImperativeHandle=function(e,t,n){return Ie.current.useImperativeHandle(e,t,n)};K.useInsertionEffect=function(e,t){return Ie.current.useInsertionEffect(e,t)};K.useLayoutEffect=function(e,t){return Ie.current.useLayoutEffect(e,t)};K.useMemo=function(e,t){return Ie.current.useMemo(e,t)};K.useReducer=function(e,t,n){return Ie.current.useReducer(e,t,n)};K.useRef=function(e){return Ie.current.useRef(e)};K.useState=function(e){return Ie.current.useState(e)};K.useSyncExternalStore=function(e,t,n){return Ie.current.useSyncExternalStore(e,t,n)};K.useTransition=function(){return Ie.current.useTransition()};K.version="18.3.1";xc.exports=K;var _=xc.exports;/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var rf=_,af=Symbol.for("react.element"),sf=Symbol.for("react.fragment"),of=Object.prototype.hasOwnProperty,lf=rf.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,cf={key:!0,ref:!0,__self:!0,__source:!0};function Cc(e,t,n){var r,i={},s=null,o=null;n!==void 0&&(s=""+n),t.key!==void 0&&(s=""+t.key),t.ref!==void 0&&(o=t.ref);for(r in t)of.call(t,r)&&!cf.hasOwnProperty(r)&&(i[r]=t[r]);if(e&&e.defaultProps)for(r in t=e.defaultProps,t)i[r]===void 0&&(i[r]=t[r]);return{$$typeof:af,type:e,key:s,ref:o,props:i,_owner:lf.current}}Ji.Fragment=sf;Ji.jsx=Cc;Ji.jsxs=Cc;mc.exports=Ji;var a=mc.exports,Sc={exports:{}},Ye={},Nc={exports:{}},Ec={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(e){function t(L,F){var H=L.length;L.push(F);e:for(;0<H;){var Y=H-1>>>1,Z=L[Y];if(0<i(Z,F))L[Y]=F,L[H]=Z,H=Y;else break e}}function n(L){return L.length===0?null:L[0]}function r(L){if(L.length===0)return null;var F=L[0],H=L.pop();if(H!==F){L[0]=H;e:for(var Y=0,Z=L.length,le=Z>>>1;Y<le;){var ie=2*(Y+1)-1,ne=L[ie],z=ie+1,h=L[z];if(0>i(ne,H))z<Z&&0>i(h,ne)?(L[Y]=h,L[z]=H,Y=z):(L[Y]=ne,L[ie]=H,Y=ie);else if(z<Z&&0>i(h,H))L[Y]=h,L[z]=H,Y=z;else break e}}return F}function i(L,F){var H=L.sortIndex-F.sortIndex;return H!==0?H:L.id-F.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;e.unstable_now=function(){return s.now()}}else{var o=Date,c=o.now();e.unstable_now=function(){return o.now()-c}}var l=[],f=[],m=1,x=null,g=3,y=!1,v=!1,k=!1,C=typeof setTimeout=="function"?setTimeout:null,d=typeof clearTimeout=="function"?clearTimeout:null,u=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function p(L){for(var F=n(f);F!==null;){if(F.callback===null)r(f);else if(F.startTime<=L)r(f),F.sortIndex=F.expirationTime,t(l,F);else break;F=n(f)}}function w(L){if(k=!1,p(L),!v)if(n(l)!==null)v=!0,ue(I);else{var F=n(f);F!==null&&P(w,F.startTime-L)}}function I(L,F){v=!1,k&&(k=!1,d($),$=-1),y=!0;var H=g;try{for(p(F),x=n(l);x!==null&&(!(x.expirationTime>F)||L&&!b());){var Y=x.callback;if(typeof Y=="function"){x.callback=null,g=x.priorityLevel;var Z=Y(x.expirationTime<=F);F=e.unstable_now(),typeof Z=="function"?x.callback=Z:x===n(l)&&r(l),p(F)}else r(l);x=n(l)}if(x!==null)var le=!0;else{var ie=n(f);ie!==null&&P(w,ie.startTime-F),le=!1}return le}finally{x=null,g=H,y=!1}}var M=!1,j=null,$=-1,D=5,B=-1;function b(){return!(e.unstable_now()-B<D)}function V(){if(j!==null){var L=e.unstable_now();B=L;var F=!0;try{F=j(!0,L)}finally{F?q():(M=!1,j=null)}}else M=!1}var q;if(typeof u=="function")q=function(){u(V)};else if(typeof MessageChannel<"u"){var G=new MessageChannel,J=G.port2;G.port1.onmessage=V,q=function(){J.postMessage(null)}}else q=function(){C(V,0)};function ue(L){j=L,M||(M=!0,q())}function P(L,F){$=C(function(){L(e.unstable_now())},F)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(L){L.callback=null},e.unstable_continueExecution=function(){v||y||(v=!0,ue(I))},e.unstable_forceFrameRate=function(L){0>L||125<L?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):D=0<L?Math.floor(1e3/L):5},e.unstable_getCurrentPriorityLevel=function(){return g},e.unstable_getFirstCallbackNode=function(){return n(l)},e.unstable_next=function(L){switch(g){case 1:case 2:case 3:var F=3;break;default:F=g}var H=g;g=F;try{return L()}finally{g=H}},e.unstable_pauseExecution=function(){},e.unstable_requestPaint=function(){},e.unstable_runWithPriority=function(L,F){switch(L){case 1:case 2:case 3:case 4:case 5:break;default:L=3}var H=g;g=L;try{return F()}finally{g=H}},e.unstable_scheduleCallback=function(L,F,H){var Y=e.unstable_now();switch(typeof H=="object"&&H!==null?(H=H.delay,H=typeof H=="number"&&0<H?Y+H:Y):H=Y,L){case 1:var Z=-1;break;case 2:Z=250;break;case 5:Z=1073741823;break;case 4:Z=1e4;break;default:Z=5e3}return Z=H+Z,L={id:m++,callback:F,priorityLevel:L,startTime:H,expirationTime:Z,sortIndex:-1},H>Y?(L.sortIndex=H,t(f,L),n(l)===null&&L===n(f)&&(k?(d($),$=-1):k=!0,P(w,H-Y))):(L.sortIndex=Z,t(l,L),v||y||(v=!0,ue(I))),L},e.unstable_shouldYield=b,e.unstable_wrapCallback=function(L){var F=g;return function(){var H=g;g=F;try{return L.apply(this,arguments)}finally{g=H}}}})(Ec);Nc.exports=Ec;var uf=Nc.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var df=_,Qe=uf;function T(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var Lc=new Set,br={};function hn(e,t){An(e,t),An(e+"Capture",t)}function An(e,t){for(br[e]=t,e=0;e<t.length;e++)Lc.add(t[e])}var bt=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Za=Object.prototype.hasOwnProperty,ff=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Wo={},Vo={};function pf(e){return Za.call(Vo,e)?!0:Za.call(Wo,e)?!1:ff.test(e)?Vo[e]=!0:(Wo[e]=!0,!1)}function hf(e,t,n,r){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function gf(e,t,n,r){if(t===null||typeof t>"u"||hf(e,t,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function Pe(e,t,n,r,i,s,o){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=r,this.attributeNamespace=i,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=s,this.removeEmptyString=o}var ze={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){ze[e]=new Pe(e,0,!1,e,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];ze[t]=new Pe(t,1,!1,e[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(e){ze[e]=new Pe(e,2,!1,e.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){ze[e]=new Pe(e,2,!1,e,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){ze[e]=new Pe(e,3,!1,e.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(e){ze[e]=new Pe(e,3,!0,e,null,!1,!1)});["capture","download"].forEach(function(e){ze[e]=new Pe(e,4,!1,e,null,!1,!1)});["cols","rows","size","span"].forEach(function(e){ze[e]=new Pe(e,6,!1,e,null,!1,!1)});["rowSpan","start"].forEach(function(e){ze[e]=new Pe(e,5,!1,e.toLowerCase(),null,!1,!1)});var Qs=/[\-:]([a-z])/g;function Ys(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(Qs,Ys);ze[t]=new Pe(t,1,!1,e,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(Qs,Ys);ze[t]=new Pe(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(Qs,Ys);ze[t]=new Pe(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(e){ze[e]=new Pe(e,1,!1,e.toLowerCase(),null,!1,!1)});ze.xlinkHref=new Pe("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(e){ze[e]=new Pe(e,1,!1,e.toLowerCase(),null,!0,!0)});function Zs(e,t,n,r){var i=ze.hasOwnProperty(t)?ze[t]:null;(i!==null?i.type!==0:r||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(gf(t,n,i,r)&&(n=null),r||i===null?pf(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):i.mustUseProperty?e[i.propertyName]=n===null?i.type===3?!1:"":n:(t=i.attributeName,r=i.attributeNamespace,n===null?e.removeAttribute(t):(i=i.type,n=i===3||i===4&&n===!0?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}var St=df.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Zr=Symbol.for("react.element"),wn=Symbol.for("react.portal"),yn=Symbol.for("react.fragment"),qs=Symbol.for("react.strict_mode"),qa=Symbol.for("react.profiler"),Mc=Symbol.for("react.provider"),Tc=Symbol.for("react.context"),Ks=Symbol.for("react.forward_ref"),Ka=Symbol.for("react.suspense"),Ga=Symbol.for("react.suspense_list"),Gs=Symbol.for("react.memo"),Mt=Symbol.for("react.lazy"),$c=Symbol.for("react.offscreen"),Uo=Symbol.iterator;function Gn(e){return e===null||typeof e!="object"?null:(e=Uo&&e[Uo]||e["@@iterator"],typeof e=="function"?e:null)}var he=Object.assign,_a;function or(e){if(_a===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);_a=t&&t[1]||""}return`
`+_a+e}var wa=!1;function ya(e,t){if(!e||wa)return"";wa=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(f){var r=f}Reflect.construct(e,[],t)}else{try{t.call()}catch(f){r=f}e.call(t.prototype)}else{try{throw Error()}catch(f){r=f}e()}}catch(f){if(f&&r&&typeof f.stack=="string"){for(var i=f.stack.split(`
`),s=r.stack.split(`
`),o=i.length-1,c=s.length-1;1<=o&&0<=c&&i[o]!==s[c];)c--;for(;1<=o&&0<=c;o--,c--)if(i[o]!==s[c]){if(o!==1||c!==1)do if(o--,c--,0>c||i[o]!==s[c]){var l=`
`+i[o].replace(" at new "," at ");return e.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",e.displayName)),l}while(1<=o&&0<=c);break}}}finally{wa=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?or(e):""}function mf(e){switch(e.tag){case 5:return or(e.type);case 16:return or("Lazy");case 13:return or("Suspense");case 19:return or("SuspenseList");case 0:case 2:case 15:return e=ya(e.type,!1),e;case 11:return e=ya(e.type.render,!1),e;case 1:return e=ya(e.type,!0),e;default:return""}}function Xa(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case yn:return"Fragment";case wn:return"Portal";case qa:return"Profiler";case qs:return"StrictMode";case Ka:return"Suspense";case Ga:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case Tc:return(e.displayName||"Context")+".Consumer";case Mc:return(e._context.displayName||"Context")+".Provider";case Ks:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case Gs:return t=e.displayName||null,t!==null?t:Xa(e.type)||"Memo";case Mt:t=e._payload,e=e._init;try{return Xa(e(t))}catch{}}return null}function xf(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Xa(t);case 8:return t===qs?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function Qt(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function Ic(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function vf(e){var t=Ic(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var i=n.get,s=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return i.call(this)},set:function(o){r=""+o,s.call(this,o)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(o){r=""+o},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function qr(e){e._valueTracker||(e._valueTracker=vf(e))}function Pc(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=Ic(e)?e.checked?"true":"false":e.value),e=r,e!==n?(t.setValue(e),!0):!1}function Ni(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function Ja(e,t){var n=t.checked;return he({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function Qo(e,t){var n=t.defaultValue==null?"":t.defaultValue,r=t.checked!=null?t.checked:t.defaultChecked;n=Qt(t.value!=null?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function Fc(e,t){t=t.checked,t!=null&&Zs(e,"checked",t,!1)}function es(e,t){Fc(e,t);var n=Qt(t.value),r=t.type;if(n!=null)r==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(r==="submit"||r==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?ts(e,t.type,n):t.hasOwnProperty("defaultValue")&&ts(e,t.type,Qt(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Yo(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var r=t.type;if(!(r!=="submit"&&r!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function ts(e,t,n){(t!=="number"||Ni(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var lr=Array.isArray;function Tn(e,t,n,r){if(e=e.options,t){t={};for(var i=0;i<n.length;i++)t["$"+n[i]]=!0;for(n=0;n<e.length;n++)i=t.hasOwnProperty("$"+e[n].value),e[n].selected!==i&&(e[n].selected=i),i&&r&&(e[n].defaultSelected=!0)}else{for(n=""+Qt(n),t=null,i=0;i<e.length;i++){if(e[i].value===n){e[i].selected=!0,r&&(e[i].defaultSelected=!0);return}t!==null||e[i].disabled||(t=e[i])}t!==null&&(t.selected=!0)}}function ns(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(T(91));return he({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Zo(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(T(92));if(lr(n)){if(1<n.length)throw Error(T(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:Qt(n)}}function Rc(e,t){var n=Qt(t.value),r=Qt(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),r!=null&&(e.defaultValue=""+r)}function qo(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function Ac(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function rs(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?Ac(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var Kr,Dc=function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,r,i){MSApp.execUnsafeLocalFunction(function(){return e(t,n,r,i)})}:e}(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(Kr=Kr||document.createElement("div"),Kr.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=Kr.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function jr(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var fr={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},_f=["Webkit","ms","Moz","O"];Object.keys(fr).forEach(function(e){_f.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),fr[t]=fr[e]})});function Oc(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||fr.hasOwnProperty(e)&&fr[e]?(""+t).trim():t+"px"}function Bc(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var r=n.indexOf("--")===0,i=Oc(n,t[n],r);n==="float"&&(n="cssFloat"),r?e.setProperty(n,i):e[n]=i}}var wf=he({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function is(e,t){if(t){if(wf[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(T(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(T(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(T(61))}if(t.style!=null&&typeof t.style!="object")throw Error(T(62))}}function as(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var ss=null;function Xs(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var os=null,$n=null,In=null;function Ko(e){if(e=Vr(e)){if(typeof os!="function")throw Error(T(280));var t=e.stateNode;t&&(t=ia(t),os(e.stateNode,e.type,t))}}function Hc(e){$n?In?In.push(e):In=[e]:$n=e}function Wc(){if($n){var e=$n,t=In;if(In=$n=null,Ko(e),t)for(e=0;e<t.length;e++)Ko(t[e])}}function Vc(e,t){return e(t)}function Uc(){}var ka=!1;function Qc(e,t,n){if(ka)return e(t,n);ka=!0;try{return Vc(e,t,n)}finally{ka=!1,($n!==null||In!==null)&&(Uc(),Wc())}}function zr(e,t){var n=e.stateNode;if(n===null)return null;var r=ia(n);if(r===null)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(T(231,t,typeof n));return n}var ls=!1;if(bt)try{var Xn={};Object.defineProperty(Xn,"passive",{get:function(){ls=!0}}),window.addEventListener("test",Xn,Xn),window.removeEventListener("test",Xn,Xn)}catch{ls=!1}function yf(e,t,n,r,i,s,o,c,l){var f=Array.prototype.slice.call(arguments,3);try{t.apply(n,f)}catch(m){this.onError(m)}}var pr=!1,Ei=null,Li=!1,cs=null,kf={onError:function(e){pr=!0,Ei=e}};function bf(e,t,n,r,i,s,o,c,l){pr=!1,Ei=null,yf.apply(kf,arguments)}function jf(e,t,n,r,i,s,o,c,l){if(bf.apply(this,arguments),pr){if(pr){var f=Ei;pr=!1,Ei=null}else throw Error(T(198));Li||(Li=!0,cs=f)}}function gn(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function Yc(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Go(e){if(gn(e)!==e)throw Error(T(188))}function zf(e){var t=e.alternate;if(!t){if(t=gn(e),t===null)throw Error(T(188));return t!==e?null:e}for(var n=e,r=t;;){var i=n.return;if(i===null)break;var s=i.alternate;if(s===null){if(r=i.return,r!==null){n=r;continue}break}if(i.child===s.child){for(s=i.child;s;){if(s===n)return Go(i),e;if(s===r)return Go(i),t;s=s.sibling}throw Error(T(188))}if(n.return!==r.return)n=i,r=s;else{for(var o=!1,c=i.child;c;){if(c===n){o=!0,n=i,r=s;break}if(c===r){o=!0,r=i,n=s;break}c=c.sibling}if(!o){for(c=s.child;c;){if(c===n){o=!0,n=s,r=i;break}if(c===r){o=!0,r=s,n=i;break}c=c.sibling}if(!o)throw Error(T(189))}}if(n.alternate!==r)throw Error(T(190))}if(n.tag!==3)throw Error(T(188));return n.stateNode.current===n?e:t}function Zc(e){return e=zf(e),e!==null?qc(e):null}function qc(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=qc(e);if(t!==null)return t;e=e.sibling}return null}var Kc=Qe.unstable_scheduleCallback,Xo=Qe.unstable_cancelCallback,Cf=Qe.unstable_shouldYield,Sf=Qe.unstable_requestPaint,me=Qe.unstable_now,Nf=Qe.unstable_getCurrentPriorityLevel,Js=Qe.unstable_ImmediatePriority,Gc=Qe.unstable_UserBlockingPriority,Mi=Qe.unstable_NormalPriority,Ef=Qe.unstable_LowPriority,Xc=Qe.unstable_IdlePriority,ea=null,ht=null;function Lf(e){if(ht&&typeof ht.onCommitFiberRoot=="function")try{ht.onCommitFiberRoot(ea,e,void 0,(e.current.flags&128)===128)}catch{}}var lt=Math.clz32?Math.clz32:$f,Mf=Math.log,Tf=Math.LN2;function $f(e){return e>>>=0,e===0?32:31-(Mf(e)/Tf|0)|0}var Gr=64,Xr=4194304;function cr(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function Ti(e,t){var n=e.pendingLanes;if(n===0)return 0;var r=0,i=e.suspendedLanes,s=e.pingedLanes,o=n&268435455;if(o!==0){var c=o&~i;c!==0?r=cr(c):(s&=o,s!==0&&(r=cr(s)))}else o=n&~i,o!==0?r=cr(o):s!==0&&(r=cr(s));if(r===0)return 0;if(t!==0&&t!==r&&!(t&i)&&(i=r&-r,s=t&-t,i>=s||i===16&&(s&4194240)!==0))return t;if(r&4&&(r|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=r;0<t;)n=31-lt(t),i=1<<n,r|=e[n],t&=~i;return r}function If(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Pf(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,i=e.expirationTimes,s=e.pendingLanes;0<s;){var o=31-lt(s),c=1<<o,l=i[o];l===-1?(!(c&n)||c&r)&&(i[o]=If(c,t)):l<=t&&(e.expiredLanes|=c),s&=~c}}function us(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function Jc(){var e=Gr;return Gr<<=1,!(Gr&4194240)&&(Gr=64),e}function ba(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Hr(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-lt(t),e[t]=n}function Ff(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<n;){var i=31-lt(n),s=1<<i;t[i]=0,r[i]=-1,e[i]=-1,n&=~s}}function eo(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-lt(n),i=1<<r;i&t|e[r]&t&&(e[r]|=t),n&=~i}}var te=0;function eu(e){return e&=-e,1<e?4<e?e&268435455?16:536870912:4:1}var tu,to,nu,ru,iu,ds=!1,Jr=[],At=null,Dt=null,Ot=null,Cr=new Map,Sr=new Map,$t=[],Rf="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Jo(e,t){switch(e){case"focusin":case"focusout":At=null;break;case"dragenter":case"dragleave":Dt=null;break;case"mouseover":case"mouseout":Ot=null;break;case"pointerover":case"pointerout":Cr.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":Sr.delete(t.pointerId)}}function Jn(e,t,n,r,i,s){return e===null||e.nativeEvent!==s?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:s,targetContainers:[i]},t!==null&&(t=Vr(t),t!==null&&to(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,i!==null&&t.indexOf(i)===-1&&t.push(i),e)}function Af(e,t,n,r,i){switch(t){case"focusin":return At=Jn(At,e,t,n,r,i),!0;case"dragenter":return Dt=Jn(Dt,e,t,n,r,i),!0;case"mouseover":return Ot=Jn(Ot,e,t,n,r,i),!0;case"pointerover":var s=i.pointerId;return Cr.set(s,Jn(Cr.get(s)||null,e,t,n,r,i)),!0;case"gotpointercapture":return s=i.pointerId,Sr.set(s,Jn(Sr.get(s)||null,e,t,n,r,i)),!0}return!1}function au(e){var t=tn(e.target);if(t!==null){var n=gn(t);if(n!==null){if(t=n.tag,t===13){if(t=Yc(n),t!==null){e.blockedOn=t,iu(e.priority,function(){nu(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function vi(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=fs(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);ss=r,n.target.dispatchEvent(r),ss=null}else return t=Vr(n),t!==null&&to(t),e.blockedOn=n,!1;t.shift()}return!0}function el(e,t,n){vi(e)&&n.delete(t)}function Df(){ds=!1,At!==null&&vi(At)&&(At=null),Dt!==null&&vi(Dt)&&(Dt=null),Ot!==null&&vi(Ot)&&(Ot=null),Cr.forEach(el),Sr.forEach(el)}function er(e,t){e.blockedOn===t&&(e.blockedOn=null,ds||(ds=!0,Qe.unstable_scheduleCallback(Qe.unstable_NormalPriority,Df)))}function Nr(e){function t(i){return er(i,e)}if(0<Jr.length){er(Jr[0],e);for(var n=1;n<Jr.length;n++){var r=Jr[n];r.blockedOn===e&&(r.blockedOn=null)}}for(At!==null&&er(At,e),Dt!==null&&er(Dt,e),Ot!==null&&er(Ot,e),Cr.forEach(t),Sr.forEach(t),n=0;n<$t.length;n++)r=$t[n],r.blockedOn===e&&(r.blockedOn=null);for(;0<$t.length&&(n=$t[0],n.blockedOn===null);)au(n),n.blockedOn===null&&$t.shift()}var Pn=St.ReactCurrentBatchConfig,$i=!0;function Of(e,t,n,r){var i=te,s=Pn.transition;Pn.transition=null;try{te=1,no(e,t,n,r)}finally{te=i,Pn.transition=s}}function Bf(e,t,n,r){var i=te,s=Pn.transition;Pn.transition=null;try{te=4,no(e,t,n,r)}finally{te=i,Pn.transition=s}}function no(e,t,n,r){if($i){var i=fs(e,t,n,r);if(i===null)$a(e,t,r,Ii,n),Jo(e,r);else if(Af(i,e,t,n,r))r.stopPropagation();else if(Jo(e,r),t&4&&-1<Rf.indexOf(e)){for(;i!==null;){var s=Vr(i);if(s!==null&&tu(s),s=fs(e,t,n,r),s===null&&$a(e,t,r,Ii,n),s===i)break;i=s}i!==null&&r.stopPropagation()}else $a(e,t,r,null,n)}}var Ii=null;function fs(e,t,n,r){if(Ii=null,e=Xs(r),e=tn(e),e!==null)if(t=gn(e),t===null)e=null;else if(n=t.tag,n===13){if(e=Yc(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return Ii=e,null}function su(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Nf()){case Js:return 1;case Gc:return 4;case Mi:case Ef:return 16;case Xc:return 536870912;default:return 16}default:return 16}}var Ft=null,ro=null,_i=null;function ou(){if(_i)return _i;var e,t=ro,n=t.length,r,i="value"in Ft?Ft.value:Ft.textContent,s=i.length;for(e=0;e<n&&t[e]===i[e];e++);var o=n-e;for(r=1;r<=o&&t[n-r]===i[s-r];r++);return _i=i.slice(e,1<r?1-r:void 0)}function wi(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function ei(){return!0}function tl(){return!1}function Ze(e){function t(n,r,i,s,o){this._reactName=n,this._targetInst=i,this.type=r,this.nativeEvent=s,this.target=o,this.currentTarget=null;for(var c in e)e.hasOwnProperty(c)&&(n=e[c],this[c]=n?n(s):s[c]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?ei:tl,this.isPropagationStopped=tl,this}return he(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=ei)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=ei)},persist:function(){},isPersistent:ei}),t}var Qn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},io=Ze(Qn),Wr=he({},Qn,{view:0,detail:0}),Hf=Ze(Wr),ja,za,tr,ta=he({},Wr,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:ao,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==tr&&(tr&&e.type==="mousemove"?(ja=e.screenX-tr.screenX,za=e.screenY-tr.screenY):za=ja=0,tr=e),ja)},movementY:function(e){return"movementY"in e?e.movementY:za}}),nl=Ze(ta),Wf=he({},ta,{dataTransfer:0}),Vf=Ze(Wf),Uf=he({},Wr,{relatedTarget:0}),Ca=Ze(Uf),Qf=he({},Qn,{animationName:0,elapsedTime:0,pseudoElement:0}),Yf=Ze(Qf),Zf=he({},Qn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),qf=Ze(Zf),Kf=he({},Qn,{data:0}),rl=Ze(Kf),Gf={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Xf={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Jf={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function ep(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Jf[e])?!!t[e]:!1}function ao(){return ep}var tp=he({},Wr,{key:function(e){if(e.key){var t=Gf[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=wi(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Xf[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:ao,charCode:function(e){return e.type==="keypress"?wi(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?wi(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),np=Ze(tp),rp=he({},ta,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),il=Ze(rp),ip=he({},Wr,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:ao}),ap=Ze(ip),sp=he({},Qn,{propertyName:0,elapsedTime:0,pseudoElement:0}),op=Ze(sp),lp=he({},ta,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),cp=Ze(lp),up=[9,13,27,32],so=bt&&"CompositionEvent"in window,hr=null;bt&&"documentMode"in document&&(hr=document.documentMode);var dp=bt&&"TextEvent"in window&&!hr,lu=bt&&(!so||hr&&8<hr&&11>=hr),al=" ",sl=!1;function cu(e,t){switch(e){case"keyup":return up.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function uu(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var kn=!1;function fp(e,t){switch(e){case"compositionend":return uu(t);case"keypress":return t.which!==32?null:(sl=!0,al);case"textInput":return e=t.data,e===al&&sl?null:e;default:return null}}function pp(e,t){if(kn)return e==="compositionend"||!so&&cu(e,t)?(e=ou(),_i=ro=Ft=null,kn=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return lu&&t.locale!=="ko"?null:t.data;default:return null}}var hp={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function ol(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!hp[e.type]:t==="textarea"}function du(e,t,n,r){Hc(r),t=Pi(t,"onChange"),0<t.length&&(n=new io("onChange","change",null,n,r),e.push({event:n,listeners:t}))}var gr=null,Er=null;function gp(e){ku(e,0)}function na(e){var t=zn(e);if(Pc(t))return e}function mp(e,t){if(e==="change")return t}var fu=!1;if(bt){var Sa;if(bt){var Na="oninput"in document;if(!Na){var ll=document.createElement("div");ll.setAttribute("oninput","return;"),Na=typeof ll.oninput=="function"}Sa=Na}else Sa=!1;fu=Sa&&(!document.documentMode||9<document.documentMode)}function cl(){gr&&(gr.detachEvent("onpropertychange",pu),Er=gr=null)}function pu(e){if(e.propertyName==="value"&&na(Er)){var t=[];du(t,Er,e,Xs(e)),Qc(gp,t)}}function xp(e,t,n){e==="focusin"?(cl(),gr=t,Er=n,gr.attachEvent("onpropertychange",pu)):e==="focusout"&&cl()}function vp(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return na(Er)}function _p(e,t){if(e==="click")return na(t)}function wp(e,t){if(e==="input"||e==="change")return na(t)}function yp(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var ut=typeof Object.is=="function"?Object.is:yp;function Lr(e,t){if(ut(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var i=n[r];if(!Za.call(t,i)||!ut(e[i],t[i]))return!1}return!0}function ul(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function dl(e,t){var n=ul(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=ul(n)}}function hu(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?hu(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function gu(){for(var e=window,t=Ni();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=Ni(e.document)}return t}function oo(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function kp(e){var t=gu(),n=e.focusedElem,r=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&hu(n.ownerDocument.documentElement,n)){if(r!==null&&oo(n)){if(t=r.start,e=r.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var i=n.textContent.length,s=Math.min(r.start,i);r=r.end===void 0?s:Math.min(r.end,i),!e.extend&&s>r&&(i=r,r=s,s=i),i=dl(n,s);var o=dl(n,r);i&&o&&(e.rangeCount!==1||e.anchorNode!==i.node||e.anchorOffset!==i.offset||e.focusNode!==o.node||e.focusOffset!==o.offset)&&(t=t.createRange(),t.setStart(i.node,i.offset),e.removeAllRanges(),s>r?(e.addRange(t),e.extend(o.node,o.offset)):(t.setEnd(o.node,o.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var bp=bt&&"documentMode"in document&&11>=document.documentMode,bn=null,ps=null,mr=null,hs=!1;function fl(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;hs||bn==null||bn!==Ni(r)||(r=bn,"selectionStart"in r&&oo(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),mr&&Lr(mr,r)||(mr=r,r=Pi(ps,"onSelect"),0<r.length&&(t=new io("onSelect","select",null,t,n),e.push({event:t,listeners:r}),t.target=bn)))}function ti(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var jn={animationend:ti("Animation","AnimationEnd"),animationiteration:ti("Animation","AnimationIteration"),animationstart:ti("Animation","AnimationStart"),transitionend:ti("Transition","TransitionEnd")},Ea={},mu={};bt&&(mu=document.createElement("div").style,"AnimationEvent"in window||(delete jn.animationend.animation,delete jn.animationiteration.animation,delete jn.animationstart.animation),"TransitionEvent"in window||delete jn.transitionend.transition);function ra(e){if(Ea[e])return Ea[e];if(!jn[e])return e;var t=jn[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in mu)return Ea[e]=t[n];return e}var xu=ra("animationend"),vu=ra("animationiteration"),_u=ra("animationstart"),wu=ra("transitionend"),yu=new Map,pl="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Zt(e,t){yu.set(e,t),hn(t,[e])}for(var La=0;La<pl.length;La++){var Ma=pl[La],jp=Ma.toLowerCase(),zp=Ma[0].toUpperCase()+Ma.slice(1);Zt(jp,"on"+zp)}Zt(xu,"onAnimationEnd");Zt(vu,"onAnimationIteration");Zt(_u,"onAnimationStart");Zt("dblclick","onDoubleClick");Zt("focusin","onFocus");Zt("focusout","onBlur");Zt(wu,"onTransitionEnd");An("onMouseEnter",["mouseout","mouseover"]);An("onMouseLeave",["mouseout","mouseover"]);An("onPointerEnter",["pointerout","pointerover"]);An("onPointerLeave",["pointerout","pointerover"]);hn("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));hn("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));hn("onBeforeInput",["compositionend","keypress","textInput","paste"]);hn("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));hn("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));hn("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var ur="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Cp=new Set("cancel close invalid load scroll toggle".split(" ").concat(ur));function hl(e,t,n){var r=e.type||"unknown-event";e.currentTarget=n,jf(r,t,void 0,e),e.currentTarget=null}function ku(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var r=e[n],i=r.event;r=r.listeners;e:{var s=void 0;if(t)for(var o=r.length-1;0<=o;o--){var c=r[o],l=c.instance,f=c.currentTarget;if(c=c.listener,l!==s&&i.isPropagationStopped())break e;hl(i,c,f),s=l}else for(o=0;o<r.length;o++){if(c=r[o],l=c.instance,f=c.currentTarget,c=c.listener,l!==s&&i.isPropagationStopped())break e;hl(i,c,f),s=l}}}if(Li)throw e=cs,Li=!1,cs=null,e}function se(e,t){var n=t[_s];n===void 0&&(n=t[_s]=new Set);var r=e+"__bubble";n.has(r)||(bu(t,e,2,!1),n.add(r))}function Ta(e,t,n){var r=0;t&&(r|=4),bu(n,e,r,t)}var ni="_reactListening"+Math.random().toString(36).slice(2);function Mr(e){if(!e[ni]){e[ni]=!0,Lc.forEach(function(n){n!=="selectionchange"&&(Cp.has(n)||Ta(n,!1,e),Ta(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[ni]||(t[ni]=!0,Ta("selectionchange",!1,t))}}function bu(e,t,n,r){switch(su(t)){case 1:var i=Of;break;case 4:i=Bf;break;default:i=no}n=i.bind(null,t,n,e),i=void 0,!ls||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(i=!0),r?i!==void 0?e.addEventListener(t,n,{capture:!0,passive:i}):e.addEventListener(t,n,!0):i!==void 0?e.addEventListener(t,n,{passive:i}):e.addEventListener(t,n,!1)}function $a(e,t,n,r,i){var s=r;if(!(t&1)&&!(t&2)&&r!==null)e:for(;;){if(r===null)return;var o=r.tag;if(o===3||o===4){var c=r.stateNode.containerInfo;if(c===i||c.nodeType===8&&c.parentNode===i)break;if(o===4)for(o=r.return;o!==null;){var l=o.tag;if((l===3||l===4)&&(l=o.stateNode.containerInfo,l===i||l.nodeType===8&&l.parentNode===i))return;o=o.return}for(;c!==null;){if(o=tn(c),o===null)return;if(l=o.tag,l===5||l===6){r=s=o;continue e}c=c.parentNode}}r=r.return}Qc(function(){var f=s,m=Xs(n),x=[];e:{var g=yu.get(e);if(g!==void 0){var y=io,v=e;switch(e){case"keypress":if(wi(n)===0)break e;case"keydown":case"keyup":y=np;break;case"focusin":v="focus",y=Ca;break;case"focusout":v="blur",y=Ca;break;case"beforeblur":case"afterblur":y=Ca;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":y=nl;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":y=Vf;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":y=ap;break;case xu:case vu:case _u:y=Yf;break;case wu:y=op;break;case"scroll":y=Hf;break;case"wheel":y=cp;break;case"copy":case"cut":case"paste":y=qf;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":y=il}var k=(t&4)!==0,C=!k&&e==="scroll",d=k?g!==null?g+"Capture":null:g;k=[];for(var u=f,p;u!==null;){p=u;var w=p.stateNode;if(p.tag===5&&w!==null&&(p=w,d!==null&&(w=zr(u,d),w!=null&&k.push(Tr(u,w,p)))),C)break;u=u.return}0<k.length&&(g=new y(g,v,null,n,m),x.push({event:g,listeners:k}))}}if(!(t&7)){e:{if(g=e==="mouseover"||e==="pointerover",y=e==="mouseout"||e==="pointerout",g&&n!==ss&&(v=n.relatedTarget||n.fromElement)&&(tn(v)||v[jt]))break e;if((y||g)&&(g=m.window===m?m:(g=m.ownerDocument)?g.defaultView||g.parentWindow:window,y?(v=n.relatedTarget||n.toElement,y=f,v=v?tn(v):null,v!==null&&(C=gn(v),v!==C||v.tag!==5&&v.tag!==6)&&(v=null)):(y=null,v=f),y!==v)){if(k=nl,w="onMouseLeave",d="onMouseEnter",u="mouse",(e==="pointerout"||e==="pointerover")&&(k=il,w="onPointerLeave",d="onPointerEnter",u="pointer"),C=y==null?g:zn(y),p=v==null?g:zn(v),g=new k(w,u+"leave",y,n,m),g.target=C,g.relatedTarget=p,w=null,tn(m)===f&&(k=new k(d,u+"enter",v,n,m),k.target=p,k.relatedTarget=C,w=k),C=w,y&&v)t:{for(k=y,d=v,u=0,p=k;p;p=mn(p))u++;for(p=0,w=d;w;w=mn(w))p++;for(;0<u-p;)k=mn(k),u--;for(;0<p-u;)d=mn(d),p--;for(;u--;){if(k===d||d!==null&&k===d.alternate)break t;k=mn(k),d=mn(d)}k=null}else k=null;y!==null&&gl(x,g,y,k,!1),v!==null&&C!==null&&gl(x,C,v,k,!0)}}e:{if(g=f?zn(f):window,y=g.nodeName&&g.nodeName.toLowerCase(),y==="select"||y==="input"&&g.type==="file")var I=mp;else if(ol(g))if(fu)I=wp;else{I=vp;var M=xp}else(y=g.nodeName)&&y.toLowerCase()==="input"&&(g.type==="checkbox"||g.type==="radio")&&(I=_p);if(I&&(I=I(e,f))){du(x,I,n,m);break e}M&&M(e,g,f),e==="focusout"&&(M=g._wrapperState)&&M.controlled&&g.type==="number"&&ts(g,"number",g.value)}switch(M=f?zn(f):window,e){case"focusin":(ol(M)||M.contentEditable==="true")&&(bn=M,ps=f,mr=null);break;case"focusout":mr=ps=bn=null;break;case"mousedown":hs=!0;break;case"contextmenu":case"mouseup":case"dragend":hs=!1,fl(x,n,m);break;case"selectionchange":if(bp)break;case"keydown":case"keyup":fl(x,n,m)}var j;if(so)e:{switch(e){case"compositionstart":var $="onCompositionStart";break e;case"compositionend":$="onCompositionEnd";break e;case"compositionupdate":$="onCompositionUpdate";break e}$=void 0}else kn?cu(e,n)&&($="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&($="onCompositionStart");$&&(lu&&n.locale!=="ko"&&(kn||$!=="onCompositionStart"?$==="onCompositionEnd"&&kn&&(j=ou()):(Ft=m,ro="value"in Ft?Ft.value:Ft.textContent,kn=!0)),M=Pi(f,$),0<M.length&&($=new rl($,e,null,n,m),x.push({event:$,listeners:M}),j?$.data=j:(j=uu(n),j!==null&&($.data=j)))),(j=dp?fp(e,n):pp(e,n))&&(f=Pi(f,"onBeforeInput"),0<f.length&&(m=new rl("onBeforeInput","beforeinput",null,n,m),x.push({event:m,listeners:f}),m.data=j))}ku(x,t)})}function Tr(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Pi(e,t){for(var n=t+"Capture",r=[];e!==null;){var i=e,s=i.stateNode;i.tag===5&&s!==null&&(i=s,s=zr(e,n),s!=null&&r.unshift(Tr(e,s,i)),s=zr(e,t),s!=null&&r.push(Tr(e,s,i))),e=e.return}return r}function mn(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function gl(e,t,n,r,i){for(var s=t._reactName,o=[];n!==null&&n!==r;){var c=n,l=c.alternate,f=c.stateNode;if(l!==null&&l===r)break;c.tag===5&&f!==null&&(c=f,i?(l=zr(n,s),l!=null&&o.unshift(Tr(n,l,c))):i||(l=zr(n,s),l!=null&&o.push(Tr(n,l,c)))),n=n.return}o.length!==0&&e.push({event:t,listeners:o})}var Sp=/\r\n?/g,Np=/\u0000|\uFFFD/g;function ml(e){return(typeof e=="string"?e:""+e).replace(Sp,`
`).replace(Np,"")}function ri(e,t,n){if(t=ml(t),ml(e)!==t&&n)throw Error(T(425))}function Fi(){}var gs=null,ms=null;function xs(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var vs=typeof setTimeout=="function"?setTimeout:void 0,Ep=typeof clearTimeout=="function"?clearTimeout:void 0,xl=typeof Promise=="function"?Promise:void 0,Lp=typeof queueMicrotask=="function"?queueMicrotask:typeof xl<"u"?function(e){return xl.resolve(null).then(e).catch(Mp)}:vs;function Mp(e){setTimeout(function(){throw e})}function Ia(e,t){var n=t,r=0;do{var i=n.nextSibling;if(e.removeChild(n),i&&i.nodeType===8)if(n=i.data,n==="/$"){if(r===0){e.removeChild(i),Nr(t);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=i}while(n);Nr(t)}function Bt(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function vl(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var Yn=Math.random().toString(36).slice(2),pt="__reactFiber$"+Yn,$r="__reactProps$"+Yn,jt="__reactContainer$"+Yn,_s="__reactEvents$"+Yn,Tp="__reactListeners$"+Yn,$p="__reactHandles$"+Yn;function tn(e){var t=e[pt];if(t)return t;for(var n=e.parentNode;n;){if(t=n[jt]||n[pt]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=vl(e);e!==null;){if(n=e[pt])return n;e=vl(e)}return t}e=n,n=e.parentNode}return null}function Vr(e){return e=e[pt]||e[jt],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function zn(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(T(33))}function ia(e){return e[$r]||null}var ws=[],Cn=-1;function qt(e){return{current:e}}function oe(e){0>Cn||(e.current=ws[Cn],ws[Cn]=null,Cn--)}function ae(e,t){Cn++,ws[Cn]=e.current,e.current=t}var Yt={},Me=qt(Yt),De=qt(!1),cn=Yt;function Dn(e,t){var n=e.type.contextTypes;if(!n)return Yt;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var i={},s;for(s in n)i[s]=t[s];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=i),i}function Oe(e){return e=e.childContextTypes,e!=null}function Ri(){oe(De),oe(Me)}function _l(e,t,n){if(Me.current!==Yt)throw Error(T(168));ae(Me,t),ae(De,n)}function ju(e,t,n){var r=e.stateNode;if(t=t.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var i in r)if(!(i in t))throw Error(T(108,xf(e)||"Unknown",i));return he({},n,r)}function Ai(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||Yt,cn=Me.current,ae(Me,e),ae(De,De.current),!0}function wl(e,t,n){var r=e.stateNode;if(!r)throw Error(T(169));n?(e=ju(e,t,cn),r.__reactInternalMemoizedMergedChildContext=e,oe(De),oe(Me),ae(Me,e)):oe(De),ae(De,n)}var vt=null,aa=!1,Pa=!1;function zu(e){vt===null?vt=[e]:vt.push(e)}function Ip(e){aa=!0,zu(e)}function Kt(){if(!Pa&&vt!==null){Pa=!0;var e=0,t=te;try{var n=vt;for(te=1;e<n.length;e++){var r=n[e];do r=r(!0);while(r!==null)}vt=null,aa=!1}catch(i){throw vt!==null&&(vt=vt.slice(e+1)),Kc(Js,Kt),i}finally{te=t,Pa=!1}}return null}var Sn=[],Nn=0,Di=null,Oi=0,Ke=[],Ge=0,un=null,wt=1,yt="";function Xt(e,t){Sn[Nn++]=Oi,Sn[Nn++]=Di,Di=e,Oi=t}function Cu(e,t,n){Ke[Ge++]=wt,Ke[Ge++]=yt,Ke[Ge++]=un,un=e;var r=wt;e=yt;var i=32-lt(r)-1;r&=~(1<<i),n+=1;var s=32-lt(t)+i;if(30<s){var o=i-i%5;s=(r&(1<<o)-1).toString(32),r>>=o,i-=o,wt=1<<32-lt(t)+i|n<<i|r,yt=s+e}else wt=1<<s|n<<i|r,yt=e}function lo(e){e.return!==null&&(Xt(e,1),Cu(e,1,0))}function co(e){for(;e===Di;)Di=Sn[--Nn],Sn[Nn]=null,Oi=Sn[--Nn],Sn[Nn]=null;for(;e===un;)un=Ke[--Ge],Ke[Ge]=null,yt=Ke[--Ge],Ke[Ge]=null,wt=Ke[--Ge],Ke[Ge]=null}var Ue=null,Ve=null,ce=!1,ot=null;function Su(e,t){var n=Xe(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function yl(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,Ue=e,Ve=Bt(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,Ue=e,Ve=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=un!==null?{id:wt,overflow:yt}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=Xe(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,Ue=e,Ve=null,!0):!1;default:return!1}}function ys(e){return(e.mode&1)!==0&&(e.flags&128)===0}function ks(e){if(ce){var t=Ve;if(t){var n=t;if(!yl(e,t)){if(ys(e))throw Error(T(418));t=Bt(n.nextSibling);var r=Ue;t&&yl(e,t)?Su(r,n):(e.flags=e.flags&-4097|2,ce=!1,Ue=e)}}else{if(ys(e))throw Error(T(418));e.flags=e.flags&-4097|2,ce=!1,Ue=e}}}function kl(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;Ue=e}function ii(e){if(e!==Ue)return!1;if(!ce)return kl(e),ce=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!xs(e.type,e.memoizedProps)),t&&(t=Ve)){if(ys(e))throw Nu(),Error(T(418));for(;t;)Su(e,t),t=Bt(t.nextSibling)}if(kl(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(T(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){Ve=Bt(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}Ve=null}}else Ve=Ue?Bt(e.stateNode.nextSibling):null;return!0}function Nu(){for(var e=Ve;e;)e=Bt(e.nextSibling)}function On(){Ve=Ue=null,ce=!1}function uo(e){ot===null?ot=[e]:ot.push(e)}var Pp=St.ReactCurrentBatchConfig;function nr(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(T(309));var r=n.stateNode}if(!r)throw Error(T(147,e));var i=r,s=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===s?t.ref:(t=function(o){var c=i.refs;o===null?delete c[s]:c[s]=o},t._stringRef=s,t)}if(typeof e!="string")throw Error(T(284));if(!n._owner)throw Error(T(290,e))}return e}function ai(e,t){throw e=Object.prototype.toString.call(t),Error(T(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function bl(e){var t=e._init;return t(e._payload)}function Eu(e){function t(d,u){if(e){var p=d.deletions;p===null?(d.deletions=[u],d.flags|=16):p.push(u)}}function n(d,u){if(!e)return null;for(;u!==null;)t(d,u),u=u.sibling;return null}function r(d,u){for(d=new Map;u!==null;)u.key!==null?d.set(u.key,u):d.set(u.index,u),u=u.sibling;return d}function i(d,u){return d=Ut(d,u),d.index=0,d.sibling=null,d}function s(d,u,p){return d.index=p,e?(p=d.alternate,p!==null?(p=p.index,p<u?(d.flags|=2,u):p):(d.flags|=2,u)):(d.flags|=1048576,u)}function o(d){return e&&d.alternate===null&&(d.flags|=2),d}function c(d,u,p,w){return u===null||u.tag!==6?(u=Ha(p,d.mode,w),u.return=d,u):(u=i(u,p),u.return=d,u)}function l(d,u,p,w){var I=p.type;return I===yn?m(d,u,p.props.children,w,p.key):u!==null&&(u.elementType===I||typeof I=="object"&&I!==null&&I.$$typeof===Mt&&bl(I)===u.type)?(w=i(u,p.props),w.ref=nr(d,u,p),w.return=d,w):(w=Si(p.type,p.key,p.props,null,d.mode,w),w.ref=nr(d,u,p),w.return=d,w)}function f(d,u,p,w){return u===null||u.tag!==4||u.stateNode.containerInfo!==p.containerInfo||u.stateNode.implementation!==p.implementation?(u=Wa(p,d.mode,w),u.return=d,u):(u=i(u,p.children||[]),u.return=d,u)}function m(d,u,p,w,I){return u===null||u.tag!==7?(u=on(p,d.mode,w,I),u.return=d,u):(u=i(u,p),u.return=d,u)}function x(d,u,p){if(typeof u=="string"&&u!==""||typeof u=="number")return u=Ha(""+u,d.mode,p),u.return=d,u;if(typeof u=="object"&&u!==null){switch(u.$$typeof){case Zr:return p=Si(u.type,u.key,u.props,null,d.mode,p),p.ref=nr(d,null,u),p.return=d,p;case wn:return u=Wa(u,d.mode,p),u.return=d,u;case Mt:var w=u._init;return x(d,w(u._payload),p)}if(lr(u)||Gn(u))return u=on(u,d.mode,p,null),u.return=d,u;ai(d,u)}return null}function g(d,u,p,w){var I=u!==null?u.key:null;if(typeof p=="string"&&p!==""||typeof p=="number")return I!==null?null:c(d,u,""+p,w);if(typeof p=="object"&&p!==null){switch(p.$$typeof){case Zr:return p.key===I?l(d,u,p,w):null;case wn:return p.key===I?f(d,u,p,w):null;case Mt:return I=p._init,g(d,u,I(p._payload),w)}if(lr(p)||Gn(p))return I!==null?null:m(d,u,p,w,null);ai(d,p)}return null}function y(d,u,p,w,I){if(typeof w=="string"&&w!==""||typeof w=="number")return d=d.get(p)||null,c(u,d,""+w,I);if(typeof w=="object"&&w!==null){switch(w.$$typeof){case Zr:return d=d.get(w.key===null?p:w.key)||null,l(u,d,w,I);case wn:return d=d.get(w.key===null?p:w.key)||null,f(u,d,w,I);case Mt:var M=w._init;return y(d,u,p,M(w._payload),I)}if(lr(w)||Gn(w))return d=d.get(p)||null,m(u,d,w,I,null);ai(u,w)}return null}function v(d,u,p,w){for(var I=null,M=null,j=u,$=u=0,D=null;j!==null&&$<p.length;$++){j.index>$?(D=j,j=null):D=j.sibling;var B=g(d,j,p[$],w);if(B===null){j===null&&(j=D);break}e&&j&&B.alternate===null&&t(d,j),u=s(B,u,$),M===null?I=B:M.sibling=B,M=B,j=D}if($===p.length)return n(d,j),ce&&Xt(d,$),I;if(j===null){for(;$<p.length;$++)j=x(d,p[$],w),j!==null&&(u=s(j,u,$),M===null?I=j:M.sibling=j,M=j);return ce&&Xt(d,$),I}for(j=r(d,j);$<p.length;$++)D=y(j,d,$,p[$],w),D!==null&&(e&&D.alternate!==null&&j.delete(D.key===null?$:D.key),u=s(D,u,$),M===null?I=D:M.sibling=D,M=D);return e&&j.forEach(function(b){return t(d,b)}),ce&&Xt(d,$),I}function k(d,u,p,w){var I=Gn(p);if(typeof I!="function")throw Error(T(150));if(p=I.call(p),p==null)throw Error(T(151));for(var M=I=null,j=u,$=u=0,D=null,B=p.next();j!==null&&!B.done;$++,B=p.next()){j.index>$?(D=j,j=null):D=j.sibling;var b=g(d,j,B.value,w);if(b===null){j===null&&(j=D);break}e&&j&&b.alternate===null&&t(d,j),u=s(b,u,$),M===null?I=b:M.sibling=b,M=b,j=D}if(B.done)return n(d,j),ce&&Xt(d,$),I;if(j===null){for(;!B.done;$++,B=p.next())B=x(d,B.value,w),B!==null&&(u=s(B,u,$),M===null?I=B:M.sibling=B,M=B);return ce&&Xt(d,$),I}for(j=r(d,j);!B.done;$++,B=p.next())B=y(j,d,$,B.value,w),B!==null&&(e&&B.alternate!==null&&j.delete(B.key===null?$:B.key),u=s(B,u,$),M===null?I=B:M.sibling=B,M=B);return e&&j.forEach(function(V){return t(d,V)}),ce&&Xt(d,$),I}function C(d,u,p,w){if(typeof p=="object"&&p!==null&&p.type===yn&&p.key===null&&(p=p.props.children),typeof p=="object"&&p!==null){switch(p.$$typeof){case Zr:e:{for(var I=p.key,M=u;M!==null;){if(M.key===I){if(I=p.type,I===yn){if(M.tag===7){n(d,M.sibling),u=i(M,p.props.children),u.return=d,d=u;break e}}else if(M.elementType===I||typeof I=="object"&&I!==null&&I.$$typeof===Mt&&bl(I)===M.type){n(d,M.sibling),u=i(M,p.props),u.ref=nr(d,M,p),u.return=d,d=u;break e}n(d,M);break}else t(d,M);M=M.sibling}p.type===yn?(u=on(p.props.children,d.mode,w,p.key),u.return=d,d=u):(w=Si(p.type,p.key,p.props,null,d.mode,w),w.ref=nr(d,u,p),w.return=d,d=w)}return o(d);case wn:e:{for(M=p.key;u!==null;){if(u.key===M)if(u.tag===4&&u.stateNode.containerInfo===p.containerInfo&&u.stateNode.implementation===p.implementation){n(d,u.sibling),u=i(u,p.children||[]),u.return=d,d=u;break e}else{n(d,u);break}else t(d,u);u=u.sibling}u=Wa(p,d.mode,w),u.return=d,d=u}return o(d);case Mt:return M=p._init,C(d,u,M(p._payload),w)}if(lr(p))return v(d,u,p,w);if(Gn(p))return k(d,u,p,w);ai(d,p)}return typeof p=="string"&&p!==""||typeof p=="number"?(p=""+p,u!==null&&u.tag===6?(n(d,u.sibling),u=i(u,p),u.return=d,d=u):(n(d,u),u=Ha(p,d.mode,w),u.return=d,d=u),o(d)):n(d,u)}return C}var Bn=Eu(!0),Lu=Eu(!1),Bi=qt(null),Hi=null,En=null,fo=null;function po(){fo=En=Hi=null}function ho(e){var t=Bi.current;oe(Bi),e._currentValue=t}function bs(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,r!==null&&(r.childLanes|=t)):r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t),e===n)break;e=e.return}}function Fn(e,t){Hi=e,fo=En=null,e=e.dependencies,e!==null&&e.firstContext!==null&&(e.lanes&t&&(Ae=!0),e.firstContext=null)}function tt(e){var t=e._currentValue;if(fo!==e)if(e={context:e,memoizedValue:t,next:null},En===null){if(Hi===null)throw Error(T(308));En=e,Hi.dependencies={lanes:0,firstContext:e}}else En=En.next=e;return t}var nn=null;function go(e){nn===null?nn=[e]:nn.push(e)}function Mu(e,t,n,r){var i=t.interleaved;return i===null?(n.next=n,go(t)):(n.next=i.next,i.next=n),t.interleaved=n,zt(e,r)}function zt(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var Tt=!1;function mo(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Tu(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function kt(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function Ht(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,X&2){var i=r.pending;return i===null?t.next=t:(t.next=i.next,i.next=t),r.pending=t,zt(e,n)}return i=r.interleaved,i===null?(t.next=t,go(r)):(t.next=i.next,i.next=t),r.interleaved=t,zt(e,n)}function yi(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,eo(e,n)}}function jl(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var i=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var o={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?i=s=o:s=s.next=o,n=n.next}while(n!==null);s===null?i=s=t:s=s.next=t}else i=s=t;n={baseState:r.baseState,firstBaseUpdate:i,lastBaseUpdate:s,shared:r.shared,effects:r.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function Wi(e,t,n,r){var i=e.updateQueue;Tt=!1;var s=i.firstBaseUpdate,o=i.lastBaseUpdate,c=i.shared.pending;if(c!==null){i.shared.pending=null;var l=c,f=l.next;l.next=null,o===null?s=f:o.next=f,o=l;var m=e.alternate;m!==null&&(m=m.updateQueue,c=m.lastBaseUpdate,c!==o&&(c===null?m.firstBaseUpdate=f:c.next=f,m.lastBaseUpdate=l))}if(s!==null){var x=i.baseState;o=0,m=f=l=null,c=s;do{var g=c.lane,y=c.eventTime;if((r&g)===g){m!==null&&(m=m.next={eventTime:y,lane:0,tag:c.tag,payload:c.payload,callback:c.callback,next:null});e:{var v=e,k=c;switch(g=t,y=n,k.tag){case 1:if(v=k.payload,typeof v=="function"){x=v.call(y,x,g);break e}x=v;break e;case 3:v.flags=v.flags&-65537|128;case 0:if(v=k.payload,g=typeof v=="function"?v.call(y,x,g):v,g==null)break e;x=he({},x,g);break e;case 2:Tt=!0}}c.callback!==null&&c.lane!==0&&(e.flags|=64,g=i.effects,g===null?i.effects=[c]:g.push(c))}else y={eventTime:y,lane:g,tag:c.tag,payload:c.payload,callback:c.callback,next:null},m===null?(f=m=y,l=x):m=m.next=y,o|=g;if(c=c.next,c===null){if(c=i.shared.pending,c===null)break;g=c,c=g.next,g.next=null,i.lastBaseUpdate=g,i.shared.pending=null}}while(!0);if(m===null&&(l=x),i.baseState=l,i.firstBaseUpdate=f,i.lastBaseUpdate=m,t=i.shared.interleaved,t!==null){i=t;do o|=i.lane,i=i.next;while(i!==t)}else s===null&&(i.shared.lanes=0);fn|=o,e.lanes=o,e.memoizedState=x}}function zl(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var r=e[t],i=r.callback;if(i!==null){if(r.callback=null,r=n,typeof i!="function")throw Error(T(191,i));i.call(r)}}}var Ur={},gt=qt(Ur),Ir=qt(Ur),Pr=qt(Ur);function rn(e){if(e===Ur)throw Error(T(174));return e}function xo(e,t){switch(ae(Pr,t),ae(Ir,e),ae(gt,Ur),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:rs(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=rs(t,e)}oe(gt),ae(gt,t)}function Hn(){oe(gt),oe(Ir),oe(Pr)}function $u(e){rn(Pr.current);var t=rn(gt.current),n=rs(t,e.type);t!==n&&(ae(Ir,e),ae(gt,n))}function vo(e){Ir.current===e&&(oe(gt),oe(Ir))}var fe=qt(0);function Vi(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Fa=[];function _o(){for(var e=0;e<Fa.length;e++)Fa[e]._workInProgressVersionPrimary=null;Fa.length=0}var ki=St.ReactCurrentDispatcher,Ra=St.ReactCurrentBatchConfig,dn=0,pe=null,_e=null,ye=null,Ui=!1,xr=!1,Fr=0,Fp=0;function Ne(){throw Error(T(321))}function wo(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!ut(e[n],t[n]))return!1;return!0}function yo(e,t,n,r,i,s){if(dn=s,pe=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,ki.current=e===null||e.memoizedState===null?Op:Bp,e=n(r,i),xr){s=0;do{if(xr=!1,Fr=0,25<=s)throw Error(T(301));s+=1,ye=_e=null,t.updateQueue=null,ki.current=Hp,e=n(r,i)}while(xr)}if(ki.current=Qi,t=_e!==null&&_e.next!==null,dn=0,ye=_e=pe=null,Ui=!1,t)throw Error(T(300));return e}function ko(){var e=Fr!==0;return Fr=0,e}function ft(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return ye===null?pe.memoizedState=ye=e:ye=ye.next=e,ye}function nt(){if(_e===null){var e=pe.alternate;e=e!==null?e.memoizedState:null}else e=_e.next;var t=ye===null?pe.memoizedState:ye.next;if(t!==null)ye=t,_e=e;else{if(e===null)throw Error(T(310));_e=e,e={memoizedState:_e.memoizedState,baseState:_e.baseState,baseQueue:_e.baseQueue,queue:_e.queue,next:null},ye===null?pe.memoizedState=ye=e:ye=ye.next=e}return ye}function Rr(e,t){return typeof t=="function"?t(e):t}function Aa(e){var t=nt(),n=t.queue;if(n===null)throw Error(T(311));n.lastRenderedReducer=e;var r=_e,i=r.baseQueue,s=n.pending;if(s!==null){if(i!==null){var o=i.next;i.next=s.next,s.next=o}r.baseQueue=i=s,n.pending=null}if(i!==null){s=i.next,r=r.baseState;var c=o=null,l=null,f=s;do{var m=f.lane;if((dn&m)===m)l!==null&&(l=l.next={lane:0,action:f.action,hasEagerState:f.hasEagerState,eagerState:f.eagerState,next:null}),r=f.hasEagerState?f.eagerState:e(r,f.action);else{var x={lane:m,action:f.action,hasEagerState:f.hasEagerState,eagerState:f.eagerState,next:null};l===null?(c=l=x,o=r):l=l.next=x,pe.lanes|=m,fn|=m}f=f.next}while(f!==null&&f!==s);l===null?o=r:l.next=c,ut(r,t.memoizedState)||(Ae=!0),t.memoizedState=r,t.baseState=o,t.baseQueue=l,n.lastRenderedState=r}if(e=n.interleaved,e!==null){i=e;do s=i.lane,pe.lanes|=s,fn|=s,i=i.next;while(i!==e)}else i===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function Da(e){var t=nt(),n=t.queue;if(n===null)throw Error(T(311));n.lastRenderedReducer=e;var r=n.dispatch,i=n.pending,s=t.memoizedState;if(i!==null){n.pending=null;var o=i=i.next;do s=e(s,o.action),o=o.next;while(o!==i);ut(s,t.memoizedState)||(Ae=!0),t.memoizedState=s,t.baseQueue===null&&(t.baseState=s),n.lastRenderedState=s}return[s,r]}function Iu(){}function Pu(e,t){var n=pe,r=nt(),i=t(),s=!ut(r.memoizedState,i);if(s&&(r.memoizedState=i,Ae=!0),r=r.queue,bo(Au.bind(null,n,r,e),[e]),r.getSnapshot!==t||s||ye!==null&&ye.memoizedState.tag&1){if(n.flags|=2048,Ar(9,Ru.bind(null,n,r,i,t),void 0,null),ke===null)throw Error(T(349));dn&30||Fu(n,t,i)}return i}function Fu(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=pe.updateQueue,t===null?(t={lastEffect:null,stores:null},pe.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Ru(e,t,n,r){t.value=n,t.getSnapshot=r,Du(t)&&Ou(e)}function Au(e,t,n){return n(function(){Du(t)&&Ou(e)})}function Du(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!ut(e,n)}catch{return!0}}function Ou(e){var t=zt(e,1);t!==null&&ct(t,e,1,-1)}function Cl(e){var t=ft();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Rr,lastRenderedState:e},t.queue=e,e=e.dispatch=Dp.bind(null,pe,e),[t.memoizedState,e]}function Ar(e,t,n,r){return e={tag:e,create:t,destroy:n,deps:r,next:null},t=pe.updateQueue,t===null?(t={lastEffect:null,stores:null},pe.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e)),e}function Bu(){return nt().memoizedState}function bi(e,t,n,r){var i=ft();pe.flags|=e,i.memoizedState=Ar(1|t,n,void 0,r===void 0?null:r)}function sa(e,t,n,r){var i=nt();r=r===void 0?null:r;var s=void 0;if(_e!==null){var o=_e.memoizedState;if(s=o.destroy,r!==null&&wo(r,o.deps)){i.memoizedState=Ar(t,n,s,r);return}}pe.flags|=e,i.memoizedState=Ar(1|t,n,s,r)}function Sl(e,t){return bi(8390656,8,e,t)}function bo(e,t){return sa(2048,8,e,t)}function Hu(e,t){return sa(4,2,e,t)}function Wu(e,t){return sa(4,4,e,t)}function Vu(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Uu(e,t,n){return n=n!=null?n.concat([e]):null,sa(4,4,Vu.bind(null,t,e),n)}function jo(){}function Qu(e,t){var n=nt();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&wo(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function Yu(e,t){var n=nt();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&wo(t,r[1])?r[0]:(e=e(),n.memoizedState=[e,t],e)}function Zu(e,t,n){return dn&21?(ut(n,t)||(n=Jc(),pe.lanes|=n,fn|=n,e.baseState=!0),t):(e.baseState&&(e.baseState=!1,Ae=!0),e.memoizedState=n)}function Rp(e,t){var n=te;te=n!==0&&4>n?n:4,e(!0);var r=Ra.transition;Ra.transition={};try{e(!1),t()}finally{te=n,Ra.transition=r}}function qu(){return nt().memoizedState}function Ap(e,t,n){var r=Vt(e);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},Ku(e))Gu(t,n);else if(n=Mu(e,t,n,r),n!==null){var i=$e();ct(n,e,r,i),Xu(n,t,r)}}function Dp(e,t,n){var r=Vt(e),i={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(Ku(e))Gu(t,i);else{var s=e.alternate;if(e.lanes===0&&(s===null||s.lanes===0)&&(s=t.lastRenderedReducer,s!==null))try{var o=t.lastRenderedState,c=s(o,n);if(i.hasEagerState=!0,i.eagerState=c,ut(c,o)){var l=t.interleaved;l===null?(i.next=i,go(t)):(i.next=l.next,l.next=i),t.interleaved=i;return}}catch{}finally{}n=Mu(e,t,i,r),n!==null&&(i=$e(),ct(n,e,r,i),Xu(n,t,r))}}function Ku(e){var t=e.alternate;return e===pe||t!==null&&t===pe}function Gu(e,t){xr=Ui=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Xu(e,t,n){if(n&4194240){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,eo(e,n)}}var Qi={readContext:tt,useCallback:Ne,useContext:Ne,useEffect:Ne,useImperativeHandle:Ne,useInsertionEffect:Ne,useLayoutEffect:Ne,useMemo:Ne,useReducer:Ne,useRef:Ne,useState:Ne,useDebugValue:Ne,useDeferredValue:Ne,useTransition:Ne,useMutableSource:Ne,useSyncExternalStore:Ne,useId:Ne,unstable_isNewReconciler:!1},Op={readContext:tt,useCallback:function(e,t){return ft().memoizedState=[e,t===void 0?null:t],e},useContext:tt,useEffect:Sl,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,bi(4194308,4,Vu.bind(null,t,e),n)},useLayoutEffect:function(e,t){return bi(4194308,4,e,t)},useInsertionEffect:function(e,t){return bi(4,2,e,t)},useMemo:function(e,t){var n=ft();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var r=ft();return t=n!==void 0?n(t):t,r.memoizedState=r.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},r.queue=e,e=e.dispatch=Ap.bind(null,pe,e),[r.memoizedState,e]},useRef:function(e){var t=ft();return e={current:e},t.memoizedState=e},useState:Cl,useDebugValue:jo,useDeferredValue:function(e){return ft().memoizedState=e},useTransition:function(){var e=Cl(!1),t=e[0];return e=Rp.bind(null,e[1]),ft().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var r=pe,i=ft();if(ce){if(n===void 0)throw Error(T(407));n=n()}else{if(n=t(),ke===null)throw Error(T(349));dn&30||Fu(r,t,n)}i.memoizedState=n;var s={value:n,getSnapshot:t};return i.queue=s,Sl(Au.bind(null,r,s,e),[e]),r.flags|=2048,Ar(9,Ru.bind(null,r,s,n,t),void 0,null),n},useId:function(){var e=ft(),t=ke.identifierPrefix;if(ce){var n=yt,r=wt;n=(r&~(1<<32-lt(r)-1)).toString(32)+n,t=":"+t+"R"+n,n=Fr++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=Fp++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},Bp={readContext:tt,useCallback:Qu,useContext:tt,useEffect:bo,useImperativeHandle:Uu,useInsertionEffect:Hu,useLayoutEffect:Wu,useMemo:Yu,useReducer:Aa,useRef:Bu,useState:function(){return Aa(Rr)},useDebugValue:jo,useDeferredValue:function(e){var t=nt();return Zu(t,_e.memoizedState,e)},useTransition:function(){var e=Aa(Rr)[0],t=nt().memoizedState;return[e,t]},useMutableSource:Iu,useSyncExternalStore:Pu,useId:qu,unstable_isNewReconciler:!1},Hp={readContext:tt,useCallback:Qu,useContext:tt,useEffect:bo,useImperativeHandle:Uu,useInsertionEffect:Hu,useLayoutEffect:Wu,useMemo:Yu,useReducer:Da,useRef:Bu,useState:function(){return Da(Rr)},useDebugValue:jo,useDeferredValue:function(e){var t=nt();return _e===null?t.memoizedState=e:Zu(t,_e.memoizedState,e)},useTransition:function(){var e=Da(Rr)[0],t=nt().memoizedState;return[e,t]},useMutableSource:Iu,useSyncExternalStore:Pu,useId:qu,unstable_isNewReconciler:!1};function at(e,t){if(e&&e.defaultProps){t=he({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function js(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:he({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var oa={isMounted:function(e){return(e=e._reactInternals)?gn(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var r=$e(),i=Vt(e),s=kt(r,i);s.payload=t,n!=null&&(s.callback=n),t=Ht(e,s,i),t!==null&&(ct(t,e,i,r),yi(t,e,i))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=$e(),i=Vt(e),s=kt(r,i);s.tag=1,s.payload=t,n!=null&&(s.callback=n),t=Ht(e,s,i),t!==null&&(ct(t,e,i,r),yi(t,e,i))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=$e(),r=Vt(e),i=kt(n,r);i.tag=2,t!=null&&(i.callback=t),t=Ht(e,i,r),t!==null&&(ct(t,e,r,n),yi(t,e,r))}};function Nl(e,t,n,r,i,s,o){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,s,o):t.prototype&&t.prototype.isPureReactComponent?!Lr(n,r)||!Lr(i,s):!0}function Ju(e,t,n){var r=!1,i=Yt,s=t.contextType;return typeof s=="object"&&s!==null?s=tt(s):(i=Oe(t)?cn:Me.current,r=t.contextTypes,s=(r=r!=null)?Dn(e,i):Yt),t=new t(n,s),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=oa,e.stateNode=t,t._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=i,e.__reactInternalMemoizedMaskedChildContext=s),t}function El(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&oa.enqueueReplaceState(t,t.state,null)}function zs(e,t,n,r){var i=e.stateNode;i.props=n,i.state=e.memoizedState,i.refs={},mo(e);var s=t.contextType;typeof s=="object"&&s!==null?i.context=tt(s):(s=Oe(t)?cn:Me.current,i.context=Dn(e,s)),i.state=e.memoizedState,s=t.getDerivedStateFromProps,typeof s=="function"&&(js(e,t,s,n),i.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof i.getSnapshotBeforeUpdate=="function"||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(t=i.state,typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount(),t!==i.state&&oa.enqueueReplaceState(i,i.state,null),Wi(e,n,i,r),i.state=e.memoizedState),typeof i.componentDidMount=="function"&&(e.flags|=4194308)}function Wn(e,t){try{var n="",r=t;do n+=mf(r),r=r.return;while(r);var i=n}catch(s){i=`
Error generating stack: `+s.message+`
`+s.stack}return{value:e,source:t,stack:i,digest:null}}function Oa(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function Cs(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var Wp=typeof WeakMap=="function"?WeakMap:Map;function ed(e,t,n){n=kt(-1,n),n.tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){Zi||(Zi=!0,Fs=r),Cs(e,t)},n}function td(e,t,n){n=kt(-1,n),n.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r=="function"){var i=t.value;n.payload=function(){return r(i)},n.callback=function(){Cs(e,t)}}var s=e.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){Cs(e,t),typeof r!="function"&&(Wt===null?Wt=new Set([this]):Wt.add(this));var o=t.stack;this.componentDidCatch(t.value,{componentStack:o!==null?o:""})}),n}function Ll(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new Wp;var i=new Set;r.set(t,i)}else i=r.get(t),i===void 0&&(i=new Set,r.set(t,i));i.has(n)||(i.add(n),e=r0.bind(null,e,t,n),t.then(e,e))}function Ml(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function Tl(e,t,n,r,i){return e.mode&1?(e.flags|=65536,e.lanes=i,e):(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=kt(-1,1),t.tag=2,Ht(n,t,1))),n.lanes|=1),e)}var Vp=St.ReactCurrentOwner,Ae=!1;function Te(e,t,n,r){t.child=e===null?Lu(t,null,n,r):Bn(t,e.child,n,r)}function $l(e,t,n,r,i){n=n.render;var s=t.ref;return Fn(t,i),r=yo(e,t,n,r,s,i),n=ko(),e!==null&&!Ae?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~i,Ct(e,t,i)):(ce&&n&&lo(t),t.flags|=1,Te(e,t,r,i),t.child)}function Il(e,t,n,r,i){if(e===null){var s=n.type;return typeof s=="function"&&!To(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=s,nd(e,t,s,r,i)):(e=Si(n.type,null,r,t,t.mode,i),e.ref=t.ref,e.return=t,t.child=e)}if(s=e.child,!(e.lanes&i)){var o=s.memoizedProps;if(n=n.compare,n=n!==null?n:Lr,n(o,r)&&e.ref===t.ref)return Ct(e,t,i)}return t.flags|=1,e=Ut(s,r),e.ref=t.ref,e.return=t,t.child=e}function nd(e,t,n,r,i){if(e!==null){var s=e.memoizedProps;if(Lr(s,r)&&e.ref===t.ref)if(Ae=!1,t.pendingProps=r=s,(e.lanes&i)!==0)e.flags&131072&&(Ae=!0);else return t.lanes=e.lanes,Ct(e,t,i)}return Ss(e,t,n,r,i)}function rd(e,t,n){var r=t.pendingProps,i=r.children,s=e!==null?e.memoizedState:null;if(r.mode==="hidden")if(!(t.mode&1))t.memoizedState={baseLanes:0,cachePool:null,transitions:null},ae(Mn,We),We|=n;else{if(!(n&1073741824))return e=s!==null?s.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,ae(Mn,We),We|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=s!==null?s.baseLanes:n,ae(Mn,We),We|=r}else s!==null?(r=s.baseLanes|n,t.memoizedState=null):r=n,ae(Mn,We),We|=r;return Te(e,t,i,n),t.child}function id(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function Ss(e,t,n,r,i){var s=Oe(n)?cn:Me.current;return s=Dn(t,s),Fn(t,i),n=yo(e,t,n,r,s,i),r=ko(),e!==null&&!Ae?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~i,Ct(e,t,i)):(ce&&r&&lo(t),t.flags|=1,Te(e,t,n,i),t.child)}function Pl(e,t,n,r,i){if(Oe(n)){var s=!0;Ai(t)}else s=!1;if(Fn(t,i),t.stateNode===null)ji(e,t),Ju(t,n,r),zs(t,n,r,i),r=!0;else if(e===null){var o=t.stateNode,c=t.memoizedProps;o.props=c;var l=o.context,f=n.contextType;typeof f=="object"&&f!==null?f=tt(f):(f=Oe(n)?cn:Me.current,f=Dn(t,f));var m=n.getDerivedStateFromProps,x=typeof m=="function"||typeof o.getSnapshotBeforeUpdate=="function";x||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(c!==r||l!==f)&&El(t,o,r,f),Tt=!1;var g=t.memoizedState;o.state=g,Wi(t,r,o,i),l=t.memoizedState,c!==r||g!==l||De.current||Tt?(typeof m=="function"&&(js(t,n,m,r),l=t.memoizedState),(c=Tt||Nl(t,n,c,r,g,l,f))?(x||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(t.flags|=4194308)):(typeof o.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=l),o.props=r,o.state=l,o.context=f,r=c):(typeof o.componentDidMount=="function"&&(t.flags|=4194308),r=!1)}else{o=t.stateNode,Tu(e,t),c=t.memoizedProps,f=t.type===t.elementType?c:at(t.type,c),o.props=f,x=t.pendingProps,g=o.context,l=n.contextType,typeof l=="object"&&l!==null?l=tt(l):(l=Oe(n)?cn:Me.current,l=Dn(t,l));var y=n.getDerivedStateFromProps;(m=typeof y=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(c!==x||g!==l)&&El(t,o,r,l),Tt=!1,g=t.memoizedState,o.state=g,Wi(t,r,o,i);var v=t.memoizedState;c!==x||g!==v||De.current||Tt?(typeof y=="function"&&(js(t,n,y,r),v=t.memoizedState),(f=Tt||Nl(t,n,f,r,g,v,l)||!1)?(m||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(r,v,l),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(r,v,l)),typeof o.componentDidUpdate=="function"&&(t.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof o.componentDidUpdate!="function"||c===e.memoizedProps&&g===e.memoizedState||(t.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&g===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=v),o.props=r,o.state=v,o.context=l,r=f):(typeof o.componentDidUpdate!="function"||c===e.memoizedProps&&g===e.memoizedState||(t.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&g===e.memoizedState||(t.flags|=1024),r=!1)}return Ns(e,t,n,r,s,i)}function Ns(e,t,n,r,i,s){id(e,t);var o=(t.flags&128)!==0;if(!r&&!o)return i&&wl(t,n,!1),Ct(e,t,s);r=t.stateNode,Vp.current=t;var c=o&&typeof n.getDerivedStateFromError!="function"?null:r.render();return t.flags|=1,e!==null&&o?(t.child=Bn(t,e.child,null,s),t.child=Bn(t,null,c,s)):Te(e,t,c,s),t.memoizedState=r.state,i&&wl(t,n,!0),t.child}function ad(e){var t=e.stateNode;t.pendingContext?_l(e,t.pendingContext,t.pendingContext!==t.context):t.context&&_l(e,t.context,!1),xo(e,t.containerInfo)}function Fl(e,t,n,r,i){return On(),uo(i),t.flags|=256,Te(e,t,n,r),t.child}var Es={dehydrated:null,treeContext:null,retryLane:0};function Ls(e){return{baseLanes:e,cachePool:null,transitions:null}}function sd(e,t,n){var r=t.pendingProps,i=fe.current,s=!1,o=(t.flags&128)!==0,c;if((c=o)||(c=e!==null&&e.memoizedState===null?!1:(i&2)!==0),c?(s=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(i|=1),ae(fe,i&1),e===null)return ks(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?(t.mode&1?e.data==="$!"?t.lanes=8:t.lanes=1073741824:t.lanes=1,null):(o=r.children,e=r.fallback,s?(r=t.mode,s=t.child,o={mode:"hidden",children:o},!(r&1)&&s!==null?(s.childLanes=0,s.pendingProps=o):s=ua(o,r,0,null),e=on(e,r,n,null),s.return=t,e.return=t,s.sibling=e,t.child=s,t.child.memoizedState=Ls(n),t.memoizedState=Es,e):zo(t,o));if(i=e.memoizedState,i!==null&&(c=i.dehydrated,c!==null))return Up(e,t,o,r,c,i,n);if(s){s=r.fallback,o=t.mode,i=e.child,c=i.sibling;var l={mode:"hidden",children:r.children};return!(o&1)&&t.child!==i?(r=t.child,r.childLanes=0,r.pendingProps=l,t.deletions=null):(r=Ut(i,l),r.subtreeFlags=i.subtreeFlags&14680064),c!==null?s=Ut(c,s):(s=on(s,o,n,null),s.flags|=2),s.return=t,r.return=t,r.sibling=s,t.child=r,r=s,s=t.child,o=e.child.memoizedState,o=o===null?Ls(n):{baseLanes:o.baseLanes|n,cachePool:null,transitions:o.transitions},s.memoizedState=o,s.childLanes=e.childLanes&~n,t.memoizedState=Es,r}return s=e.child,e=s.sibling,r=Ut(s,{mode:"visible",children:r.children}),!(t.mode&1)&&(r.lanes=n),r.return=t,r.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=r,t.memoizedState=null,r}function zo(e,t){return t=ua({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function si(e,t,n,r){return r!==null&&uo(r),Bn(t,e.child,null,n),e=zo(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Up(e,t,n,r,i,s,o){if(n)return t.flags&256?(t.flags&=-257,r=Oa(Error(T(422))),si(e,t,o,r)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(s=r.fallback,i=t.mode,r=ua({mode:"visible",children:r.children},i,0,null),s=on(s,i,o,null),s.flags|=2,r.return=t,s.return=t,r.sibling=s,t.child=r,t.mode&1&&Bn(t,e.child,null,o),t.child.memoizedState=Ls(o),t.memoizedState=Es,s);if(!(t.mode&1))return si(e,t,o,null);if(i.data==="$!"){if(r=i.nextSibling&&i.nextSibling.dataset,r)var c=r.dgst;return r=c,s=Error(T(419)),r=Oa(s,r,void 0),si(e,t,o,r)}if(c=(o&e.childLanes)!==0,Ae||c){if(r=ke,r!==null){switch(o&-o){case 4:i=2;break;case 16:i=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:i=32;break;case 536870912:i=268435456;break;default:i=0}i=i&(r.suspendedLanes|o)?0:i,i!==0&&i!==s.retryLane&&(s.retryLane=i,zt(e,i),ct(r,e,i,-1))}return Mo(),r=Oa(Error(T(421))),si(e,t,o,r)}return i.data==="$?"?(t.flags|=128,t.child=e.child,t=i0.bind(null,e),i._reactRetry=t,null):(e=s.treeContext,Ve=Bt(i.nextSibling),Ue=t,ce=!0,ot=null,e!==null&&(Ke[Ge++]=wt,Ke[Ge++]=yt,Ke[Ge++]=un,wt=e.id,yt=e.overflow,un=t),t=zo(t,r.children),t.flags|=4096,t)}function Rl(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),bs(e.return,t,n)}function Ba(e,t,n,r,i){var s=e.memoizedState;s===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:i}:(s.isBackwards=t,s.rendering=null,s.renderingStartTime=0,s.last=r,s.tail=n,s.tailMode=i)}function od(e,t,n){var r=t.pendingProps,i=r.revealOrder,s=r.tail;if(Te(e,t,r.children,n),r=fe.current,r&2)r=r&1|2,t.flags|=128;else{if(e!==null&&e.flags&128)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Rl(e,n,t);else if(e.tag===19)Rl(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(ae(fe,r),!(t.mode&1))t.memoizedState=null;else switch(i){case"forwards":for(n=t.child,i=null;n!==null;)e=n.alternate,e!==null&&Vi(e)===null&&(i=n),n=n.sibling;n=i,n===null?(i=t.child,t.child=null):(i=n.sibling,n.sibling=null),Ba(t,!1,i,n,s);break;case"backwards":for(n=null,i=t.child,t.child=null;i!==null;){if(e=i.alternate,e!==null&&Vi(e)===null){t.child=i;break}e=i.sibling,i.sibling=n,n=i,i=e}Ba(t,!0,n,null,s);break;case"together":Ba(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function ji(e,t){!(t.mode&1)&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function Ct(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),fn|=t.lanes,!(n&t.childLanes))return null;if(e!==null&&t.child!==e.child)throw Error(T(153));if(t.child!==null){for(e=t.child,n=Ut(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=Ut(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Qp(e,t,n){switch(t.tag){case 3:ad(t),On();break;case 5:$u(t);break;case 1:Oe(t.type)&&Ai(t);break;case 4:xo(t,t.stateNode.containerInfo);break;case 10:var r=t.type._context,i=t.memoizedProps.value;ae(Bi,r._currentValue),r._currentValue=i;break;case 13:if(r=t.memoizedState,r!==null)return r.dehydrated!==null?(ae(fe,fe.current&1),t.flags|=128,null):n&t.child.childLanes?sd(e,t,n):(ae(fe,fe.current&1),e=Ct(e,t,n),e!==null?e.sibling:null);ae(fe,fe.current&1);break;case 19:if(r=(n&t.childLanes)!==0,e.flags&128){if(r)return od(e,t,n);t.flags|=128}if(i=t.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),ae(fe,fe.current),r)break;return null;case 22:case 23:return t.lanes=0,rd(e,t,n)}return Ct(e,t,n)}var ld,Ms,cd,ud;ld=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};Ms=function(){};cd=function(e,t,n,r){var i=e.memoizedProps;if(i!==r){e=t.stateNode,rn(gt.current);var s=null;switch(n){case"input":i=Ja(e,i),r=Ja(e,r),s=[];break;case"select":i=he({},i,{value:void 0}),r=he({},r,{value:void 0}),s=[];break;case"textarea":i=ns(e,i),r=ns(e,r),s=[];break;default:typeof i.onClick!="function"&&typeof r.onClick=="function"&&(e.onclick=Fi)}is(n,r);var o;n=null;for(f in i)if(!r.hasOwnProperty(f)&&i.hasOwnProperty(f)&&i[f]!=null)if(f==="style"){var c=i[f];for(o in c)c.hasOwnProperty(o)&&(n||(n={}),n[o]="")}else f!=="dangerouslySetInnerHTML"&&f!=="children"&&f!=="suppressContentEditableWarning"&&f!=="suppressHydrationWarning"&&f!=="autoFocus"&&(br.hasOwnProperty(f)?s||(s=[]):(s=s||[]).push(f,null));for(f in r){var l=r[f];if(c=i!=null?i[f]:void 0,r.hasOwnProperty(f)&&l!==c&&(l!=null||c!=null))if(f==="style")if(c){for(o in c)!c.hasOwnProperty(o)||l&&l.hasOwnProperty(o)||(n||(n={}),n[o]="");for(o in l)l.hasOwnProperty(o)&&c[o]!==l[o]&&(n||(n={}),n[o]=l[o])}else n||(s||(s=[]),s.push(f,n)),n=l;else f==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,c=c?c.__html:void 0,l!=null&&c!==l&&(s=s||[]).push(f,l)):f==="children"?typeof l!="string"&&typeof l!="number"||(s=s||[]).push(f,""+l):f!=="suppressContentEditableWarning"&&f!=="suppressHydrationWarning"&&(br.hasOwnProperty(f)?(l!=null&&f==="onScroll"&&se("scroll",e),s||c===l||(s=[])):(s=s||[]).push(f,l))}n&&(s=s||[]).push("style",n);var f=s;(t.updateQueue=f)&&(t.flags|=4)}};ud=function(e,t,n,r){n!==r&&(t.flags|=4)};function rr(e,t){if(!ce)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function Ee(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags&14680064,r|=i.flags&14680064,i.return=e,i=i.sibling;else for(i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags,r|=i.flags,i.return=e,i=i.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function Yp(e,t,n){var r=t.pendingProps;switch(co(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ee(t),null;case 1:return Oe(t.type)&&Ri(),Ee(t),null;case 3:return r=t.stateNode,Hn(),oe(De),oe(Me),_o(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&(ii(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,ot!==null&&(Ds(ot),ot=null))),Ms(e,t),Ee(t),null;case 5:vo(t);var i=rn(Pr.current);if(n=t.type,e!==null&&t.stateNode!=null)cd(e,t,n,r,i),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!r){if(t.stateNode===null)throw Error(T(166));return Ee(t),null}if(e=rn(gt.current),ii(t)){r=t.stateNode,n=t.type;var s=t.memoizedProps;switch(r[pt]=t,r[$r]=s,e=(t.mode&1)!==0,n){case"dialog":se("cancel",r),se("close",r);break;case"iframe":case"object":case"embed":se("load",r);break;case"video":case"audio":for(i=0;i<ur.length;i++)se(ur[i],r);break;case"source":se("error",r);break;case"img":case"image":case"link":se("error",r),se("load",r);break;case"details":se("toggle",r);break;case"input":Qo(r,s),se("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!s.multiple},se("invalid",r);break;case"textarea":Zo(r,s),se("invalid",r)}is(n,s),i=null;for(var o in s)if(s.hasOwnProperty(o)){var c=s[o];o==="children"?typeof c=="string"?r.textContent!==c&&(s.suppressHydrationWarning!==!0&&ri(r.textContent,c,e),i=["children",c]):typeof c=="number"&&r.textContent!==""+c&&(s.suppressHydrationWarning!==!0&&ri(r.textContent,c,e),i=["children",""+c]):br.hasOwnProperty(o)&&c!=null&&o==="onScroll"&&se("scroll",r)}switch(n){case"input":qr(r),Yo(r,s,!0);break;case"textarea":qr(r),qo(r);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(r.onclick=Fi)}r=i,t.updateQueue=r,r!==null&&(t.flags|=4)}else{o=i.nodeType===9?i:i.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=Ac(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=o.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof r.is=="string"?e=o.createElement(n,{is:r.is}):(e=o.createElement(n),n==="select"&&(o=e,r.multiple?o.multiple=!0:r.size&&(o.size=r.size))):e=o.createElementNS(e,n),e[pt]=t,e[$r]=r,ld(e,t,!1,!1),t.stateNode=e;e:{switch(o=as(n,r),n){case"dialog":se("cancel",e),se("close",e),i=r;break;case"iframe":case"object":case"embed":se("load",e),i=r;break;case"video":case"audio":for(i=0;i<ur.length;i++)se(ur[i],e);i=r;break;case"source":se("error",e),i=r;break;case"img":case"image":case"link":se("error",e),se("load",e),i=r;break;case"details":se("toggle",e),i=r;break;case"input":Qo(e,r),i=Ja(e,r),se("invalid",e);break;case"option":i=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple},i=he({},r,{value:void 0}),se("invalid",e);break;case"textarea":Zo(e,r),i=ns(e,r),se("invalid",e);break;default:i=r}is(n,i),c=i;for(s in c)if(c.hasOwnProperty(s)){var l=c[s];s==="style"?Bc(e,l):s==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&Dc(e,l)):s==="children"?typeof l=="string"?(n!=="textarea"||l!=="")&&jr(e,l):typeof l=="number"&&jr(e,""+l):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(br.hasOwnProperty(s)?l!=null&&s==="onScroll"&&se("scroll",e):l!=null&&Zs(e,s,l,o))}switch(n){case"input":qr(e),Yo(e,r,!1);break;case"textarea":qr(e),qo(e);break;case"option":r.value!=null&&e.setAttribute("value",""+Qt(r.value));break;case"select":e.multiple=!!r.multiple,s=r.value,s!=null?Tn(e,!!r.multiple,s,!1):r.defaultValue!=null&&Tn(e,!!r.multiple,r.defaultValue,!0);break;default:typeof i.onClick=="function"&&(e.onclick=Fi)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return Ee(t),null;case 6:if(e&&t.stateNode!=null)ud(e,t,e.memoizedProps,r);else{if(typeof r!="string"&&t.stateNode===null)throw Error(T(166));if(n=rn(Pr.current),rn(gt.current),ii(t)){if(r=t.stateNode,n=t.memoizedProps,r[pt]=t,(s=r.nodeValue!==n)&&(e=Ue,e!==null))switch(e.tag){case 3:ri(r.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&ri(r.nodeValue,n,(e.mode&1)!==0)}s&&(t.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[pt]=t,t.stateNode=r}return Ee(t),null;case 13:if(oe(fe),r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(ce&&Ve!==null&&t.mode&1&&!(t.flags&128))Nu(),On(),t.flags|=98560,s=!1;else if(s=ii(t),r!==null&&r.dehydrated!==null){if(e===null){if(!s)throw Error(T(318));if(s=t.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(T(317));s[pt]=t}else On(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;Ee(t),s=!1}else ot!==null&&(Ds(ot),ot=null),s=!0;if(!s)return t.flags&65536?t:null}return t.flags&128?(t.lanes=n,t):(r=r!==null,r!==(e!==null&&e.memoizedState!==null)&&r&&(t.child.flags|=8192,t.mode&1&&(e===null||fe.current&1?we===0&&(we=3):Mo())),t.updateQueue!==null&&(t.flags|=4),Ee(t),null);case 4:return Hn(),Ms(e,t),e===null&&Mr(t.stateNode.containerInfo),Ee(t),null;case 10:return ho(t.type._context),Ee(t),null;case 17:return Oe(t.type)&&Ri(),Ee(t),null;case 19:if(oe(fe),s=t.memoizedState,s===null)return Ee(t),null;if(r=(t.flags&128)!==0,o=s.rendering,o===null)if(r)rr(s,!1);else{if(we!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(o=Vi(e),o!==null){for(t.flags|=128,rr(s,!1),r=o.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),t.subtreeFlags=0,r=n,n=t.child;n!==null;)s=n,e=r,s.flags&=14680066,o=s.alternate,o===null?(s.childLanes=0,s.lanes=e,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=o.childLanes,s.lanes=o.lanes,s.child=o.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=o.memoizedProps,s.memoizedState=o.memoizedState,s.updateQueue=o.updateQueue,s.type=o.type,e=o.dependencies,s.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return ae(fe,fe.current&1|2),t.child}e=e.sibling}s.tail!==null&&me()>Vn&&(t.flags|=128,r=!0,rr(s,!1),t.lanes=4194304)}else{if(!r)if(e=Vi(o),e!==null){if(t.flags|=128,r=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),rr(s,!0),s.tail===null&&s.tailMode==="hidden"&&!o.alternate&&!ce)return Ee(t),null}else 2*me()-s.renderingStartTime>Vn&&n!==1073741824&&(t.flags|=128,r=!0,rr(s,!1),t.lanes=4194304);s.isBackwards?(o.sibling=t.child,t.child=o):(n=s.last,n!==null?n.sibling=o:t.child=o,s.last=o)}return s.tail!==null?(t=s.tail,s.rendering=t,s.tail=t.sibling,s.renderingStartTime=me(),t.sibling=null,n=fe.current,ae(fe,r?n&1|2:n&1),t):(Ee(t),null);case 22:case 23:return Lo(),r=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==r&&(t.flags|=8192),r&&t.mode&1?We&1073741824&&(Ee(t),t.subtreeFlags&6&&(t.flags|=8192)):Ee(t),null;case 24:return null;case 25:return null}throw Error(T(156,t.tag))}function Zp(e,t){switch(co(t),t.tag){case 1:return Oe(t.type)&&Ri(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return Hn(),oe(De),oe(Me),_o(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 5:return vo(t),null;case 13:if(oe(fe),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(T(340));On()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return oe(fe),null;case 4:return Hn(),null;case 10:return ho(t.type._context),null;case 22:case 23:return Lo(),null;case 24:return null;default:return null}}var oi=!1,Le=!1,qp=typeof WeakSet=="function"?WeakSet:Set,O=null;function Ln(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){ge(e,t,r)}else n.current=null}function Ts(e,t,n){try{n()}catch(r){ge(e,t,r)}}var Al=!1;function Kp(e,t){if(gs=$i,e=gu(),oo(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var i=r.anchorOffset,s=r.focusNode;r=r.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var o=0,c=-1,l=-1,f=0,m=0,x=e,g=null;t:for(;;){for(var y;x!==n||i!==0&&x.nodeType!==3||(c=o+i),x!==s||r!==0&&x.nodeType!==3||(l=o+r),x.nodeType===3&&(o+=x.nodeValue.length),(y=x.firstChild)!==null;)g=x,x=y;for(;;){if(x===e)break t;if(g===n&&++f===i&&(c=o),g===s&&++m===r&&(l=o),(y=x.nextSibling)!==null)break;x=g,g=x.parentNode}x=y}n=c===-1||l===-1?null:{start:c,end:l}}else n=null}n=n||{start:0,end:0}}else n=null;for(ms={focusedElem:e,selectionRange:n},$i=!1,O=t;O!==null;)if(t=O,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,O=e;else for(;O!==null;){t=O;try{var v=t.alternate;if(t.flags&1024)switch(t.tag){case 0:case 11:case 15:break;case 1:if(v!==null){var k=v.memoizedProps,C=v.memoizedState,d=t.stateNode,u=d.getSnapshotBeforeUpdate(t.elementType===t.type?k:at(t.type,k),C);d.__reactInternalSnapshotBeforeUpdate=u}break;case 3:var p=t.stateNode.containerInfo;p.nodeType===1?p.textContent="":p.nodeType===9&&p.documentElement&&p.removeChild(p.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(T(163))}}catch(w){ge(t,t.return,w)}if(e=t.sibling,e!==null){e.return=t.return,O=e;break}O=t.return}return v=Al,Al=!1,v}function vr(e,t,n){var r=t.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var i=r=r.next;do{if((i.tag&e)===e){var s=i.destroy;i.destroy=void 0,s!==void 0&&Ts(t,n,s)}i=i.next}while(i!==r)}}function la(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var r=n.create;n.destroy=r()}n=n.next}while(n!==t)}}function $s(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function dd(e){var t=e.alternate;t!==null&&(e.alternate=null,dd(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[pt],delete t[$r],delete t[_s],delete t[Tp],delete t[$p])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function fd(e){return e.tag===5||e.tag===3||e.tag===4}function Dl(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||fd(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Is(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=Fi));else if(r!==4&&(e=e.child,e!==null))for(Is(e,t,n),e=e.sibling;e!==null;)Is(e,t,n),e=e.sibling}function Ps(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(Ps(e,t,n),e=e.sibling;e!==null;)Ps(e,t,n),e=e.sibling}var be=null,st=!1;function Et(e,t,n){for(n=n.child;n!==null;)pd(e,t,n),n=n.sibling}function pd(e,t,n){if(ht&&typeof ht.onCommitFiberUnmount=="function")try{ht.onCommitFiberUnmount(ea,n)}catch{}switch(n.tag){case 5:Le||Ln(n,t);case 6:var r=be,i=st;be=null,Et(e,t,n),be=r,st=i,be!==null&&(st?(e=be,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):be.removeChild(n.stateNode));break;case 18:be!==null&&(st?(e=be,n=n.stateNode,e.nodeType===8?Ia(e.parentNode,n):e.nodeType===1&&Ia(e,n),Nr(e)):Ia(be,n.stateNode));break;case 4:r=be,i=st,be=n.stateNode.containerInfo,st=!0,Et(e,t,n),be=r,st=i;break;case 0:case 11:case 14:case 15:if(!Le&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){i=r=r.next;do{var s=i,o=s.destroy;s=s.tag,o!==void 0&&(s&2||s&4)&&Ts(n,t,o),i=i.next}while(i!==r)}Et(e,t,n);break;case 1:if(!Le&&(Ln(n,t),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(c){ge(n,t,c)}Et(e,t,n);break;case 21:Et(e,t,n);break;case 22:n.mode&1?(Le=(r=Le)||n.memoizedState!==null,Et(e,t,n),Le=r):Et(e,t,n);break;default:Et(e,t,n)}}function Ol(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new qp),t.forEach(function(r){var i=a0.bind(null,e,r);n.has(r)||(n.add(r),r.then(i,i))})}}function it(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var i=n[r];try{var s=e,o=t,c=o;e:for(;c!==null;){switch(c.tag){case 5:be=c.stateNode,st=!1;break e;case 3:be=c.stateNode.containerInfo,st=!0;break e;case 4:be=c.stateNode.containerInfo,st=!0;break e}c=c.return}if(be===null)throw Error(T(160));pd(s,o,i),be=null,st=!1;var l=i.alternate;l!==null&&(l.return=null),i.return=null}catch(f){ge(i,t,f)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)hd(t,e),t=t.sibling}function hd(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(it(t,e),dt(e),r&4){try{vr(3,e,e.return),la(3,e)}catch(k){ge(e,e.return,k)}try{vr(5,e,e.return)}catch(k){ge(e,e.return,k)}}break;case 1:it(t,e),dt(e),r&512&&n!==null&&Ln(n,n.return);break;case 5:if(it(t,e),dt(e),r&512&&n!==null&&Ln(n,n.return),e.flags&32){var i=e.stateNode;try{jr(i,"")}catch(k){ge(e,e.return,k)}}if(r&4&&(i=e.stateNode,i!=null)){var s=e.memoizedProps,o=n!==null?n.memoizedProps:s,c=e.type,l=e.updateQueue;if(e.updateQueue=null,l!==null)try{c==="input"&&s.type==="radio"&&s.name!=null&&Fc(i,s),as(c,o);var f=as(c,s);for(o=0;o<l.length;o+=2){var m=l[o],x=l[o+1];m==="style"?Bc(i,x):m==="dangerouslySetInnerHTML"?Dc(i,x):m==="children"?jr(i,x):Zs(i,m,x,f)}switch(c){case"input":es(i,s);break;case"textarea":Rc(i,s);break;case"select":var g=i._wrapperState.wasMultiple;i._wrapperState.wasMultiple=!!s.multiple;var y=s.value;y!=null?Tn(i,!!s.multiple,y,!1):g!==!!s.multiple&&(s.defaultValue!=null?Tn(i,!!s.multiple,s.defaultValue,!0):Tn(i,!!s.multiple,s.multiple?[]:"",!1))}i[$r]=s}catch(k){ge(e,e.return,k)}}break;case 6:if(it(t,e),dt(e),r&4){if(e.stateNode===null)throw Error(T(162));i=e.stateNode,s=e.memoizedProps;try{i.nodeValue=s}catch(k){ge(e,e.return,k)}}break;case 3:if(it(t,e),dt(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{Nr(t.containerInfo)}catch(k){ge(e,e.return,k)}break;case 4:it(t,e),dt(e);break;case 13:it(t,e),dt(e),i=e.child,i.flags&8192&&(s=i.memoizedState!==null,i.stateNode.isHidden=s,!s||i.alternate!==null&&i.alternate.memoizedState!==null||(No=me())),r&4&&Ol(e);break;case 22:if(m=n!==null&&n.memoizedState!==null,e.mode&1?(Le=(f=Le)||m,it(t,e),Le=f):it(t,e),dt(e),r&8192){if(f=e.memoizedState!==null,(e.stateNode.isHidden=f)&&!m&&e.mode&1)for(O=e,m=e.child;m!==null;){for(x=O=m;O!==null;){switch(g=O,y=g.child,g.tag){case 0:case 11:case 14:case 15:vr(4,g,g.return);break;case 1:Ln(g,g.return);var v=g.stateNode;if(typeof v.componentWillUnmount=="function"){r=g,n=g.return;try{t=r,v.props=t.memoizedProps,v.state=t.memoizedState,v.componentWillUnmount()}catch(k){ge(r,n,k)}}break;case 5:Ln(g,g.return);break;case 22:if(g.memoizedState!==null){Hl(x);continue}}y!==null?(y.return=g,O=y):Hl(x)}m=m.sibling}e:for(m=null,x=e;;){if(x.tag===5){if(m===null){m=x;try{i=x.stateNode,f?(s=i.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(c=x.stateNode,l=x.memoizedProps.style,o=l!=null&&l.hasOwnProperty("display")?l.display:null,c.style.display=Oc("display",o))}catch(k){ge(e,e.return,k)}}}else if(x.tag===6){if(m===null)try{x.stateNode.nodeValue=f?"":x.memoizedProps}catch(k){ge(e,e.return,k)}}else if((x.tag!==22&&x.tag!==23||x.memoizedState===null||x===e)&&x.child!==null){x.child.return=x,x=x.child;continue}if(x===e)break e;for(;x.sibling===null;){if(x.return===null||x.return===e)break e;m===x&&(m=null),x=x.return}m===x&&(m=null),x.sibling.return=x.return,x=x.sibling}}break;case 19:it(t,e),dt(e),r&4&&Ol(e);break;case 21:break;default:it(t,e),dt(e)}}function dt(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(fd(n)){var r=n;break e}n=n.return}throw Error(T(160))}switch(r.tag){case 5:var i=r.stateNode;r.flags&32&&(jr(i,""),r.flags&=-33);var s=Dl(e);Ps(e,s,i);break;case 3:case 4:var o=r.stateNode.containerInfo,c=Dl(e);Is(e,c,o);break;default:throw Error(T(161))}}catch(l){ge(e,e.return,l)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Gp(e,t,n){O=e,gd(e)}function gd(e,t,n){for(var r=(e.mode&1)!==0;O!==null;){var i=O,s=i.child;if(i.tag===22&&r){var o=i.memoizedState!==null||oi;if(!o){var c=i.alternate,l=c!==null&&c.memoizedState!==null||Le;c=oi;var f=Le;if(oi=o,(Le=l)&&!f)for(O=i;O!==null;)o=O,l=o.child,o.tag===22&&o.memoizedState!==null?Wl(i):l!==null?(l.return=o,O=l):Wl(i);for(;s!==null;)O=s,gd(s),s=s.sibling;O=i,oi=c,Le=f}Bl(e)}else i.subtreeFlags&8772&&s!==null?(s.return=i,O=s):Bl(e)}}function Bl(e){for(;O!==null;){var t=O;if(t.flags&8772){var n=t.alternate;try{if(t.flags&8772)switch(t.tag){case 0:case 11:case 15:Le||la(5,t);break;case 1:var r=t.stateNode;if(t.flags&4&&!Le)if(n===null)r.componentDidMount();else{var i=t.elementType===t.type?n.memoizedProps:at(t.type,n.memoizedProps);r.componentDidUpdate(i,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var s=t.updateQueue;s!==null&&zl(t,s,r);break;case 3:var o=t.updateQueue;if(o!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}zl(t,o,n)}break;case 5:var c=t.stateNode;if(n===null&&t.flags&4){n=c;var l=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&n.focus();break;case"img":l.src&&(n.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var f=t.alternate;if(f!==null){var m=f.memoizedState;if(m!==null){var x=m.dehydrated;x!==null&&Nr(x)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(T(163))}Le||t.flags&512&&$s(t)}catch(g){ge(t,t.return,g)}}if(t===e){O=null;break}if(n=t.sibling,n!==null){n.return=t.return,O=n;break}O=t.return}}function Hl(e){for(;O!==null;){var t=O;if(t===e){O=null;break}var n=t.sibling;if(n!==null){n.return=t.return,O=n;break}O=t.return}}function Wl(e){for(;O!==null;){var t=O;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{la(4,t)}catch(l){ge(t,n,l)}break;case 1:var r=t.stateNode;if(typeof r.componentDidMount=="function"){var i=t.return;try{r.componentDidMount()}catch(l){ge(t,i,l)}}var s=t.return;try{$s(t)}catch(l){ge(t,s,l)}break;case 5:var o=t.return;try{$s(t)}catch(l){ge(t,o,l)}}}catch(l){ge(t,t.return,l)}if(t===e){O=null;break}var c=t.sibling;if(c!==null){c.return=t.return,O=c;break}O=t.return}}var Xp=Math.ceil,Yi=St.ReactCurrentDispatcher,Co=St.ReactCurrentOwner,et=St.ReactCurrentBatchConfig,X=0,ke=null,xe=null,je=0,We=0,Mn=qt(0),we=0,Dr=null,fn=0,ca=0,So=0,_r=null,Fe=null,No=0,Vn=1/0,xt=null,Zi=!1,Fs=null,Wt=null,li=!1,Rt=null,qi=0,wr=0,Rs=null,zi=-1,Ci=0;function $e(){return X&6?me():zi!==-1?zi:zi=me()}function Vt(e){return e.mode&1?X&2&&je!==0?je&-je:Pp.transition!==null?(Ci===0&&(Ci=Jc()),Ci):(e=te,e!==0||(e=window.event,e=e===void 0?16:su(e.type)),e):1}function ct(e,t,n,r){if(50<wr)throw wr=0,Rs=null,Error(T(185));Hr(e,n,r),(!(X&2)||e!==ke)&&(e===ke&&(!(X&2)&&(ca|=n),we===4&&It(e,je)),Be(e,r),n===1&&X===0&&!(t.mode&1)&&(Vn=me()+500,aa&&Kt()))}function Be(e,t){var n=e.callbackNode;Pf(e,t);var r=Ti(e,e===ke?je:0);if(r===0)n!==null&&Xo(n),e.callbackNode=null,e.callbackPriority=0;else if(t=r&-r,e.callbackPriority!==t){if(n!=null&&Xo(n),t===1)e.tag===0?Ip(Vl.bind(null,e)):zu(Vl.bind(null,e)),Lp(function(){!(X&6)&&Kt()}),n=null;else{switch(eu(r)){case 1:n=Js;break;case 4:n=Gc;break;case 16:n=Mi;break;case 536870912:n=Xc;break;default:n=Mi}n=bd(n,md.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function md(e,t){if(zi=-1,Ci=0,X&6)throw Error(T(327));var n=e.callbackNode;if(Rn()&&e.callbackNode!==n)return null;var r=Ti(e,e===ke?je:0);if(r===0)return null;if(r&30||r&e.expiredLanes||t)t=Ki(e,r);else{t=r;var i=X;X|=2;var s=vd();(ke!==e||je!==t)&&(xt=null,Vn=me()+500,sn(e,t));do try{t0();break}catch(c){xd(e,c)}while(!0);po(),Yi.current=s,X=i,xe!==null?t=0:(ke=null,je=0,t=we)}if(t!==0){if(t===2&&(i=us(e),i!==0&&(r=i,t=As(e,i))),t===1)throw n=Dr,sn(e,0),It(e,r),Be(e,me()),n;if(t===6)It(e,r);else{if(i=e.current.alternate,!(r&30)&&!Jp(i)&&(t=Ki(e,r),t===2&&(s=us(e),s!==0&&(r=s,t=As(e,s))),t===1))throw n=Dr,sn(e,0),It(e,r),Be(e,me()),n;switch(e.finishedWork=i,e.finishedLanes=r,t){case 0:case 1:throw Error(T(345));case 2:Jt(e,Fe,xt);break;case 3:if(It(e,r),(r&130023424)===r&&(t=No+500-me(),10<t)){if(Ti(e,0)!==0)break;if(i=e.suspendedLanes,(i&r)!==r){$e(),e.pingedLanes|=e.suspendedLanes&i;break}e.timeoutHandle=vs(Jt.bind(null,e,Fe,xt),t);break}Jt(e,Fe,xt);break;case 4:if(It(e,r),(r&4194240)===r)break;for(t=e.eventTimes,i=-1;0<r;){var o=31-lt(r);s=1<<o,o=t[o],o>i&&(i=o),r&=~s}if(r=i,r=me()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*Xp(r/1960))-r,10<r){e.timeoutHandle=vs(Jt.bind(null,e,Fe,xt),r);break}Jt(e,Fe,xt);break;case 5:Jt(e,Fe,xt);break;default:throw Error(T(329))}}}return Be(e,me()),e.callbackNode===n?md.bind(null,e):null}function As(e,t){var n=_r;return e.current.memoizedState.isDehydrated&&(sn(e,t).flags|=256),e=Ki(e,t),e!==2&&(t=Fe,Fe=n,t!==null&&Ds(t)),e}function Ds(e){Fe===null?Fe=e:Fe.push.apply(Fe,e)}function Jp(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var i=n[r],s=i.getSnapshot;i=i.value;try{if(!ut(s(),i))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function It(e,t){for(t&=~So,t&=~ca,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-lt(t),r=1<<n;e[n]=-1,t&=~r}}function Vl(e){if(X&6)throw Error(T(327));Rn();var t=Ti(e,0);if(!(t&1))return Be(e,me()),null;var n=Ki(e,t);if(e.tag!==0&&n===2){var r=us(e);r!==0&&(t=r,n=As(e,r))}if(n===1)throw n=Dr,sn(e,0),It(e,t),Be(e,me()),n;if(n===6)throw Error(T(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,Jt(e,Fe,xt),Be(e,me()),null}function Eo(e,t){var n=X;X|=1;try{return e(t)}finally{X=n,X===0&&(Vn=me()+500,aa&&Kt())}}function pn(e){Rt!==null&&Rt.tag===0&&!(X&6)&&Rn();var t=X;X|=1;var n=et.transition,r=te;try{if(et.transition=null,te=1,e)return e()}finally{te=r,et.transition=n,X=t,!(X&6)&&Kt()}}function Lo(){We=Mn.current,oe(Mn)}function sn(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,Ep(n)),xe!==null)for(n=xe.return;n!==null;){var r=n;switch(co(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&Ri();break;case 3:Hn(),oe(De),oe(Me),_o();break;case 5:vo(r);break;case 4:Hn();break;case 13:oe(fe);break;case 19:oe(fe);break;case 10:ho(r.type._context);break;case 22:case 23:Lo()}n=n.return}if(ke=e,xe=e=Ut(e.current,null),je=We=t,we=0,Dr=null,So=ca=fn=0,Fe=_r=null,nn!==null){for(t=0;t<nn.length;t++)if(n=nn[t],r=n.interleaved,r!==null){n.interleaved=null;var i=r.next,s=n.pending;if(s!==null){var o=s.next;s.next=i,r.next=o}n.pending=r}nn=null}return e}function xd(e,t){do{var n=xe;try{if(po(),ki.current=Qi,Ui){for(var r=pe.memoizedState;r!==null;){var i=r.queue;i!==null&&(i.pending=null),r=r.next}Ui=!1}if(dn=0,ye=_e=pe=null,xr=!1,Fr=0,Co.current=null,n===null||n.return===null){we=1,Dr=t,xe=null;break}e:{var s=e,o=n.return,c=n,l=t;if(t=je,c.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var f=l,m=c,x=m.tag;if(!(m.mode&1)&&(x===0||x===11||x===15)){var g=m.alternate;g?(m.updateQueue=g.updateQueue,m.memoizedState=g.memoizedState,m.lanes=g.lanes):(m.updateQueue=null,m.memoizedState=null)}var y=Ml(o);if(y!==null){y.flags&=-257,Tl(y,o,c,s,t),y.mode&1&&Ll(s,f,t),t=y,l=f;var v=t.updateQueue;if(v===null){var k=new Set;k.add(l),t.updateQueue=k}else v.add(l);break e}else{if(!(t&1)){Ll(s,f,t),Mo();break e}l=Error(T(426))}}else if(ce&&c.mode&1){var C=Ml(o);if(C!==null){!(C.flags&65536)&&(C.flags|=256),Tl(C,o,c,s,t),uo(Wn(l,c));break e}}s=l=Wn(l,c),we!==4&&(we=2),_r===null?_r=[s]:_r.push(s),s=o;do{switch(s.tag){case 3:s.flags|=65536,t&=-t,s.lanes|=t;var d=ed(s,l,t);jl(s,d);break e;case 1:c=l;var u=s.type,p=s.stateNode;if(!(s.flags&128)&&(typeof u.getDerivedStateFromError=="function"||p!==null&&typeof p.componentDidCatch=="function"&&(Wt===null||!Wt.has(p)))){s.flags|=65536,t&=-t,s.lanes|=t;var w=td(s,c,t);jl(s,w);break e}}s=s.return}while(s!==null)}wd(n)}catch(I){t=I,xe===n&&n!==null&&(xe=n=n.return);continue}break}while(!0)}function vd(){var e=Yi.current;return Yi.current=Qi,e===null?Qi:e}function Mo(){(we===0||we===3||we===2)&&(we=4),ke===null||!(fn&268435455)&&!(ca&268435455)||It(ke,je)}function Ki(e,t){var n=X;X|=2;var r=vd();(ke!==e||je!==t)&&(xt=null,sn(e,t));do try{e0();break}catch(i){xd(e,i)}while(!0);if(po(),X=n,Yi.current=r,xe!==null)throw Error(T(261));return ke=null,je=0,we}function e0(){for(;xe!==null;)_d(xe)}function t0(){for(;xe!==null&&!Cf();)_d(xe)}function _d(e){var t=kd(e.alternate,e,We);e.memoizedProps=e.pendingProps,t===null?wd(e):xe=t,Co.current=null}function wd(e){var t=e;do{var n=t.alternate;if(e=t.return,t.flags&32768){if(n=Zp(n,t),n!==null){n.flags&=32767,xe=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{we=6,xe=null;return}}else if(n=Yp(n,t,We),n!==null){xe=n;return}if(t=t.sibling,t!==null){xe=t;return}xe=t=e}while(t!==null);we===0&&(we=5)}function Jt(e,t,n){var r=te,i=et.transition;try{et.transition=null,te=1,n0(e,t,n,r)}finally{et.transition=i,te=r}return null}function n0(e,t,n,r){do Rn();while(Rt!==null);if(X&6)throw Error(T(327));n=e.finishedWork;var i=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(T(177));e.callbackNode=null,e.callbackPriority=0;var s=n.lanes|n.childLanes;if(Ff(e,s),e===ke&&(xe=ke=null,je=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||li||(li=!0,bd(Mi,function(){return Rn(),null})),s=(n.flags&15990)!==0,n.subtreeFlags&15990||s){s=et.transition,et.transition=null;var o=te;te=1;var c=X;X|=4,Co.current=null,Kp(e,n),hd(n,e),kp(ms),$i=!!gs,ms=gs=null,e.current=n,Gp(n),Sf(),X=c,te=o,et.transition=s}else e.current=n;if(li&&(li=!1,Rt=e,qi=i),s=e.pendingLanes,s===0&&(Wt=null),Lf(n.stateNode),Be(e,me()),t!==null)for(r=e.onRecoverableError,n=0;n<t.length;n++)i=t[n],r(i.value,{componentStack:i.stack,digest:i.digest});if(Zi)throw Zi=!1,e=Fs,Fs=null,e;return qi&1&&e.tag!==0&&Rn(),s=e.pendingLanes,s&1?e===Rs?wr++:(wr=0,Rs=e):wr=0,Kt(),null}function Rn(){if(Rt!==null){var e=eu(qi),t=et.transition,n=te;try{if(et.transition=null,te=16>e?16:e,Rt===null)var r=!1;else{if(e=Rt,Rt=null,qi=0,X&6)throw Error(T(331));var i=X;for(X|=4,O=e.current;O!==null;){var s=O,o=s.child;if(O.flags&16){var c=s.deletions;if(c!==null){for(var l=0;l<c.length;l++){var f=c[l];for(O=f;O!==null;){var m=O;switch(m.tag){case 0:case 11:case 15:vr(8,m,s)}var x=m.child;if(x!==null)x.return=m,O=x;else for(;O!==null;){m=O;var g=m.sibling,y=m.return;if(dd(m),m===f){O=null;break}if(g!==null){g.return=y,O=g;break}O=y}}}var v=s.alternate;if(v!==null){var k=v.child;if(k!==null){v.child=null;do{var C=k.sibling;k.sibling=null,k=C}while(k!==null)}}O=s}}if(s.subtreeFlags&2064&&o!==null)o.return=s,O=o;else e:for(;O!==null;){if(s=O,s.flags&2048)switch(s.tag){case 0:case 11:case 15:vr(9,s,s.return)}var d=s.sibling;if(d!==null){d.return=s.return,O=d;break e}O=s.return}}var u=e.current;for(O=u;O!==null;){o=O;var p=o.child;if(o.subtreeFlags&2064&&p!==null)p.return=o,O=p;else e:for(o=u;O!==null;){if(c=O,c.flags&2048)try{switch(c.tag){case 0:case 11:case 15:la(9,c)}}catch(I){ge(c,c.return,I)}if(c===o){O=null;break e}var w=c.sibling;if(w!==null){w.return=c.return,O=w;break e}O=c.return}}if(X=i,Kt(),ht&&typeof ht.onPostCommitFiberRoot=="function")try{ht.onPostCommitFiberRoot(ea,e)}catch{}r=!0}return r}finally{te=n,et.transition=t}}return!1}function Ul(e,t,n){t=Wn(n,t),t=ed(e,t,1),e=Ht(e,t,1),t=$e(),e!==null&&(Hr(e,1,t),Be(e,t))}function ge(e,t,n){if(e.tag===3)Ul(e,e,n);else for(;t!==null;){if(t.tag===3){Ul(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(Wt===null||!Wt.has(r))){e=Wn(n,e),e=td(t,e,1),t=Ht(t,e,1),e=$e(),t!==null&&(Hr(t,1,e),Be(t,e));break}}t=t.return}}function r0(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),t=$e(),e.pingedLanes|=e.suspendedLanes&n,ke===e&&(je&n)===n&&(we===4||we===3&&(je&130023424)===je&&500>me()-No?sn(e,0):So|=n),Be(e,t)}function yd(e,t){t===0&&(e.mode&1?(t=Xr,Xr<<=1,!(Xr&130023424)&&(Xr=4194304)):t=1);var n=$e();e=zt(e,t),e!==null&&(Hr(e,t,n),Be(e,n))}function i0(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),yd(e,n)}function a0(e,t){var n=0;switch(e.tag){case 13:var r=e.stateNode,i=e.memoizedState;i!==null&&(n=i.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(T(314))}r!==null&&r.delete(t),yd(e,n)}var kd;kd=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||De.current)Ae=!0;else{if(!(e.lanes&n)&&!(t.flags&128))return Ae=!1,Qp(e,t,n);Ae=!!(e.flags&131072)}else Ae=!1,ce&&t.flags&1048576&&Cu(t,Oi,t.index);switch(t.lanes=0,t.tag){case 2:var r=t.type;ji(e,t),e=t.pendingProps;var i=Dn(t,Me.current);Fn(t,n),i=yo(null,t,r,e,i,n);var s=ko();return t.flags|=1,typeof i=="object"&&i!==null&&typeof i.render=="function"&&i.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,Oe(r)?(s=!0,Ai(t)):s=!1,t.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,mo(t),i.updater=oa,t.stateNode=i,i._reactInternals=t,zs(t,r,e,n),t=Ns(null,t,r,!0,s,n)):(t.tag=0,ce&&s&&lo(t),Te(null,t,i,n),t=t.child),t;case 16:r=t.elementType;e:{switch(ji(e,t),e=t.pendingProps,i=r._init,r=i(r._payload),t.type=r,i=t.tag=o0(r),e=at(r,e),i){case 0:t=Ss(null,t,r,e,n);break e;case 1:t=Pl(null,t,r,e,n);break e;case 11:t=$l(null,t,r,e,n);break e;case 14:t=Il(null,t,r,at(r.type,e),n);break e}throw Error(T(306,r,""))}return t;case 0:return r=t.type,i=t.pendingProps,i=t.elementType===r?i:at(r,i),Ss(e,t,r,i,n);case 1:return r=t.type,i=t.pendingProps,i=t.elementType===r?i:at(r,i),Pl(e,t,r,i,n);case 3:e:{if(ad(t),e===null)throw Error(T(387));r=t.pendingProps,s=t.memoizedState,i=s.element,Tu(e,t),Wi(t,r,null,n);var o=t.memoizedState;if(r=o.element,s.isDehydrated)if(s={element:r,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},t.updateQueue.baseState=s,t.memoizedState=s,t.flags&256){i=Wn(Error(T(423)),t),t=Fl(e,t,r,n,i);break e}else if(r!==i){i=Wn(Error(T(424)),t),t=Fl(e,t,r,n,i);break e}else for(Ve=Bt(t.stateNode.containerInfo.firstChild),Ue=t,ce=!0,ot=null,n=Lu(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(On(),r===i){t=Ct(e,t,n);break e}Te(e,t,r,n)}t=t.child}return t;case 5:return $u(t),e===null&&ks(t),r=t.type,i=t.pendingProps,s=e!==null?e.memoizedProps:null,o=i.children,xs(r,i)?o=null:s!==null&&xs(r,s)&&(t.flags|=32),id(e,t),Te(e,t,o,n),t.child;case 6:return e===null&&ks(t),null;case 13:return sd(e,t,n);case 4:return xo(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=Bn(t,null,r,n):Te(e,t,r,n),t.child;case 11:return r=t.type,i=t.pendingProps,i=t.elementType===r?i:at(r,i),$l(e,t,r,i,n);case 7:return Te(e,t,t.pendingProps,n),t.child;case 8:return Te(e,t,t.pendingProps.children,n),t.child;case 12:return Te(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(r=t.type._context,i=t.pendingProps,s=t.memoizedProps,o=i.value,ae(Bi,r._currentValue),r._currentValue=o,s!==null)if(ut(s.value,o)){if(s.children===i.children&&!De.current){t=Ct(e,t,n);break e}}else for(s=t.child,s!==null&&(s.return=t);s!==null;){var c=s.dependencies;if(c!==null){o=s.child;for(var l=c.firstContext;l!==null;){if(l.context===r){if(s.tag===1){l=kt(-1,n&-n),l.tag=2;var f=s.updateQueue;if(f!==null){f=f.shared;var m=f.pending;m===null?l.next=l:(l.next=m.next,m.next=l),f.pending=l}}s.lanes|=n,l=s.alternate,l!==null&&(l.lanes|=n),bs(s.return,n,t),c.lanes|=n;break}l=l.next}}else if(s.tag===10)o=s.type===t.type?null:s.child;else if(s.tag===18){if(o=s.return,o===null)throw Error(T(341));o.lanes|=n,c=o.alternate,c!==null&&(c.lanes|=n),bs(o,n,t),o=s.sibling}else o=s.child;if(o!==null)o.return=s;else for(o=s;o!==null;){if(o===t){o=null;break}if(s=o.sibling,s!==null){s.return=o.return,o=s;break}o=o.return}s=o}Te(e,t,i.children,n),t=t.child}return t;case 9:return i=t.type,r=t.pendingProps.children,Fn(t,n),i=tt(i),r=r(i),t.flags|=1,Te(e,t,r,n),t.child;case 14:return r=t.type,i=at(r,t.pendingProps),i=at(r.type,i),Il(e,t,r,i,n);case 15:return nd(e,t,t.type,t.pendingProps,n);case 17:return r=t.type,i=t.pendingProps,i=t.elementType===r?i:at(r,i),ji(e,t),t.tag=1,Oe(r)?(e=!0,Ai(t)):e=!1,Fn(t,n),Ju(t,r,i),zs(t,r,i,n),Ns(null,t,r,!0,e,n);case 19:return od(e,t,n);case 22:return rd(e,t,n)}throw Error(T(156,t.tag))};function bd(e,t){return Kc(e,t)}function s0(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Xe(e,t,n,r){return new s0(e,t,n,r)}function To(e){return e=e.prototype,!(!e||!e.isReactComponent)}function o0(e){if(typeof e=="function")return To(e)?1:0;if(e!=null){if(e=e.$$typeof,e===Ks)return 11;if(e===Gs)return 14}return 2}function Ut(e,t){var n=e.alternate;return n===null?(n=Xe(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function Si(e,t,n,r,i,s){var o=2;if(r=e,typeof e=="function")To(e)&&(o=1);else if(typeof e=="string")o=5;else e:switch(e){case yn:return on(n.children,i,s,t);case qs:o=8,i|=8;break;case qa:return e=Xe(12,n,t,i|2),e.elementType=qa,e.lanes=s,e;case Ka:return e=Xe(13,n,t,i),e.elementType=Ka,e.lanes=s,e;case Ga:return e=Xe(19,n,t,i),e.elementType=Ga,e.lanes=s,e;case $c:return ua(n,i,s,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case Mc:o=10;break e;case Tc:o=9;break e;case Ks:o=11;break e;case Gs:o=14;break e;case Mt:o=16,r=null;break e}throw Error(T(130,e==null?e:typeof e,""))}return t=Xe(o,n,t,i),t.elementType=e,t.type=r,t.lanes=s,t}function on(e,t,n,r){return e=Xe(7,e,r,t),e.lanes=n,e}function ua(e,t,n,r){return e=Xe(22,e,r,t),e.elementType=$c,e.lanes=n,e.stateNode={isHidden:!1},e}function Ha(e,t,n){return e=Xe(6,e,null,t),e.lanes=n,e}function Wa(e,t,n){return t=Xe(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function l0(e,t,n,r,i){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=ba(0),this.expirationTimes=ba(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=ba(0),this.identifierPrefix=r,this.onRecoverableError=i,this.mutableSourceEagerHydrationData=null}function $o(e,t,n,r,i,s,o,c,l){return e=new l0(e,t,n,c,l),t===1?(t=1,s===!0&&(t|=8)):t=0,s=Xe(3,null,null,t),e.current=s,s.stateNode=e,s.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},mo(s),e}function c0(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:wn,key:r==null?null:""+r,children:e,containerInfo:t,implementation:n}}function jd(e){if(!e)return Yt;e=e._reactInternals;e:{if(gn(e)!==e||e.tag!==1)throw Error(T(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(Oe(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(T(171))}if(e.tag===1){var n=e.type;if(Oe(n))return ju(e,n,t)}return t}function zd(e,t,n,r,i,s,o,c,l){return e=$o(n,r,!0,e,i,s,o,c,l),e.context=jd(null),n=e.current,r=$e(),i=Vt(n),s=kt(r,i),s.callback=t??null,Ht(n,s,i),e.current.lanes=i,Hr(e,i,r),Be(e,r),e}function da(e,t,n,r){var i=t.current,s=$e(),o=Vt(i);return n=jd(n),t.context===null?t.context=n:t.pendingContext=n,t=kt(s,o),t.payload={element:e},r=r===void 0?null:r,r!==null&&(t.callback=r),e=Ht(i,t,o),e!==null&&(ct(e,i,o,s),yi(e,i,o)),o}function Gi(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function Ql(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function Io(e,t){Ql(e,t),(e=e.alternate)&&Ql(e,t)}function u0(){return null}var Cd=typeof reportError=="function"?reportError:function(e){console.error(e)};function Po(e){this._internalRoot=e}fa.prototype.render=Po.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(T(409));da(e,t,null,null)};fa.prototype.unmount=Po.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;pn(function(){da(null,e,null,null)}),t[jt]=null}};function fa(e){this._internalRoot=e}fa.prototype.unstable_scheduleHydration=function(e){if(e){var t=ru();e={blockedOn:null,target:e,priority:t};for(var n=0;n<$t.length&&t!==0&&t<$t[n].priority;n++);$t.splice(n,0,e),n===0&&au(e)}};function Fo(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function pa(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function Yl(){}function d0(e,t,n,r,i){if(i){if(typeof r=="function"){var s=r;r=function(){var f=Gi(o);s.call(f)}}var o=zd(t,r,e,0,null,!1,!1,"",Yl);return e._reactRootContainer=o,e[jt]=o.current,Mr(e.nodeType===8?e.parentNode:e),pn(),o}for(;i=e.lastChild;)e.removeChild(i);if(typeof r=="function"){var c=r;r=function(){var f=Gi(l);c.call(f)}}var l=$o(e,0,!1,null,null,!1,!1,"",Yl);return e._reactRootContainer=l,e[jt]=l.current,Mr(e.nodeType===8?e.parentNode:e),pn(function(){da(t,l,n,r)}),l}function ha(e,t,n,r,i){var s=n._reactRootContainer;if(s){var o=s;if(typeof i=="function"){var c=i;i=function(){var l=Gi(o);c.call(l)}}da(t,o,e,i)}else o=d0(n,t,e,i,r);return Gi(o)}tu=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=cr(t.pendingLanes);n!==0&&(eo(t,n|1),Be(t,me()),!(X&6)&&(Vn=me()+500,Kt()))}break;case 13:pn(function(){var r=zt(e,1);if(r!==null){var i=$e();ct(r,e,1,i)}}),Io(e,1)}};to=function(e){if(e.tag===13){var t=zt(e,134217728);if(t!==null){var n=$e();ct(t,e,134217728,n)}Io(e,134217728)}};nu=function(e){if(e.tag===13){var t=Vt(e),n=zt(e,t);if(n!==null){var r=$e();ct(n,e,t,r)}Io(e,t)}};ru=function(){return te};iu=function(e,t){var n=te;try{return te=e,t()}finally{te=n}};os=function(e,t,n){switch(t){case"input":if(es(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var i=ia(r);if(!i)throw Error(T(90));Pc(r),es(r,i)}}}break;case"textarea":Rc(e,n);break;case"select":t=n.value,t!=null&&Tn(e,!!n.multiple,t,!1)}};Vc=Eo;Uc=pn;var f0={usingClientEntryPoint:!1,Events:[Vr,zn,ia,Hc,Wc,Eo]},ir={findFiberByHostInstance:tn,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},p0={bundleType:ir.bundleType,version:ir.version,rendererPackageName:ir.rendererPackageName,rendererConfig:ir.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:St.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=Zc(e),e===null?null:e.stateNode},findFiberByHostInstance:ir.findFiberByHostInstance||u0,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var ci=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!ci.isDisabled&&ci.supportsFiber)try{ea=ci.inject(p0),ht=ci}catch{}}Ye.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=f0;Ye.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Fo(t))throw Error(T(200));return c0(e,t,null,n)};Ye.createRoot=function(e,t){if(!Fo(e))throw Error(T(299));var n=!1,r="",i=Cd;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onRecoverableError!==void 0&&(i=t.onRecoverableError)),t=$o(e,1,!1,null,null,n,!1,r,i),e[jt]=t.current,Mr(e.nodeType===8?e.parentNode:e),new Po(t)};Ye.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(T(188)):(e=Object.keys(e).join(","),Error(T(268,e)));return e=Zc(t),e=e===null?null:e.stateNode,e};Ye.flushSync=function(e){return pn(e)};Ye.hydrate=function(e,t,n){if(!pa(t))throw Error(T(200));return ha(null,e,t,!0,n)};Ye.hydrateRoot=function(e,t,n){if(!Fo(e))throw Error(T(405));var r=n!=null&&n.hydratedSources||null,i=!1,s="",o=Cd;if(n!=null&&(n.unstable_strictMode===!0&&(i=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(o=n.onRecoverableError)),t=zd(t,null,e,1,n??null,i,!1,s,o),e[jt]=t.current,Mr(e),r)for(e=0;e<r.length;e++)n=r[e],i=n._getVersion,i=i(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,i]:t.mutableSourceEagerHydrationData.push(n,i);return new fa(t)};Ye.render=function(e,t,n){if(!pa(t))throw Error(T(200));return ha(null,e,t,!1,n)};Ye.unmountComponentAtNode=function(e){if(!pa(e))throw Error(T(40));return e._reactRootContainer?(pn(function(){ha(null,null,e,!1,function(){e._reactRootContainer=null,e[jt]=null})}),!0):!1};Ye.unstable_batchedUpdates=Eo;Ye.unstable_renderSubtreeIntoContainer=function(e,t,n,r){if(!pa(n))throw Error(T(200));if(e==null||e._reactInternals===void 0)throw Error(T(38));return ha(e,t,n,!1,r)};Ye.version="18.3.1-next-f1338f8080-20240426";function Sd(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Sd)}catch(e){console.error(e)}}Sd(),Sc.exports=Ye;var h0=Sc.exports,Nd,Zl=h0;Nd=Zl.createRoot,Zl.hydrateRoot;const Je=1024*1024,yr=e=>e.includes(".")?e.split(".").pop().toLowerCase():"",Xi=1024*Je,_t=new Intl.NumberFormat("en"),Or=e=>Number.isFinite(e)&&e>0?e:0,an=e=>{const t=Or(e);return t<1024?`${Math.round(t)} B`:t<Je?`${_t.format(Math.round(t/1024))} KB`:t<Xi?`${(t/Je).toFixed(t<10*Je?1:0)} MB`:`${_t.format(Number((t/Xi).toFixed(1)))} GB`},ql=(e,t)=>{const n=Or(t),r=Math.min(Or(e),n);return n<1024?`${Math.round(r)} of ${an(n)}`:n<Je?`${_t.format(Math.round(r/1024))} of ${an(n)}`:n<Xi?`${(r/Je).toFixed(1)} of ${an(n)}`:`${(r/Xi).toFixed(1)} of ${an(n)}`},g0=e=>Number.isFinite(e)?e<1?"almost done":e<60?`${Math.ceil(e)}s left`:e<3600?`${Math.ceil(e/60)} min left`:e<86400?`${Math.ceil(e/3600)} h left`:`${Math.ceil(e/86400)} d left`:"starting",m0=e=>Number.isFinite(e)?Math.min(1,Math.max(0,e)):0,Va=e=>e.length>24&&!/[\u0590-\u08ff]/.test(e)?[e.slice(0,-14),e.slice(-14)]:null,x0=[{exts:["pdf"],color:"#e5484d"},{exts:["xls","xlsx","csv","numbers"],color:"#1a9a52"},{exts:["doc","docx","txt","md","pages","rtf"],color:"#0060e2"},{exts:["png","jpg","jpeg","gif","webp","svg","heic","avif"],color:"#5B5BD6"},{exts:["mp4","mov","webm","mp3","wav"],color:"#e8a20c"},{exts:["ppt","pptx","key"],color:"#e8590c"}],Os=e=>{var t;return((t=x0.find(n=>n.exts.includes(yr(e))))==null?void 0:t.color)??"#8f8f8f"},v0=e=>Math.min(9e3,Math.max(2600,e/(1.2*Je)*1e3));let _0=0;const w0=()=>`f${Date.now().toString(36)}${(_0++).toString(36)}`,vn=({d:e,solid:t,className:n})=>a.jsx("svg",{viewBox:t?"0 0 16 16":"0 0 24 24",className:["ui-dzc__glyph",n].filter(Boolean).join(" "),"data-solid":t||void 0,"aria-hidden":"true",children:a.jsx("path",{d:e})}),_n={upload:"M12 15V4M7.5 8.5 12 4l4.5 4.5M5 15v3.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V15",close:"M7 7l10 10M17 7 7 17",retry:"M20 12a8 8 0 1 1-2.34-5.66L20 8.5M20 4v4.5h-4.5",checkCircle:"M1.5 8a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0Zm8.9-1.2a.5.5 0 0 0-.8-.6L7.44 9.23 6.35 8.15a.5.5 0 1 0-.7.7l1.5 1.5a.5.5 0 0 0 .76-.06l2.5-3.5Z",alertCircle:"M1.5 8a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0ZM8 4.6a.6.6 0 0 0-.6.6v3.2a.6.6 0 0 0 1.2 0V5.2a.6.6 0 0 0-.6-.6Zm0 6.9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"};function y0({name:e}){return a.jsxs("svg",{viewBox:"0 0 16 16",className:"ui-dzc__file","aria-hidden":"true",children:[a.jsx("path",{className:"ui-dzc__file-sheet",d:"M4 1.75h5l3.25 3.25v8A1.25 1.25 0 0 1 11 14.25H4A1.25 1.25 0 0 1 2.75 13V3A1.25 1.25 0 0 1 4 1.75Z"}),a.jsx("path",{className:"ui-dzc__file-fold",d:"M9 1.75V4a1 1 0 0 0 1 1h2.25"}),a.jsx("rect",{x:"1",y:"8.5",width:"9",height:"4.5",rx:"1.25",fill:Os(e)})]})}function Kl({name:e,end:t}){const n=(yr(e)||"file").slice(0,4).toUpperCase(),r=Math.max(18,n.length*5.2+8),i=t?30-r:0;return a.jsxs("svg",{viewBox:"0 0 30 36",className:"ui-dzc__badge","aria-hidden":"true",children:[a.jsx("path",{d:"M5 1h14l10 10v20a4 4 0 0 1-4 4H5a4 4 0 0 1-4-4V5a4 4 0 0 1 4-4z",className:"ui-dzc__badge-sheet"}),a.jsx("path",{d:"M19 1v6a4 4 0 0 0 4 4h6",className:"ui-dzc__badge-fold"}),a.jsx("rect",{x:i,y:"19",width:r,height:"11",rx:"3",fill:Os(e),fillOpacity:"0.12"}),a.jsx("text",{x:i+4,y:"27.2",className:"ui-dzc__badge-text",fill:Os(e),children:n})]})}function k0(){return a.jsxs("span",{className:"ui-dzc__stack","aria-hidden":"true",children:[a.jsx("span",{className:"ui-dzc__sheet ui-dzc__sheet-l",children:a.jsx(Kl,{name:"file.pdf"})}),a.jsx("span",{className:"ui-dzc__sheet ui-dzc__sheet-r",children:a.jsx(Kl,{name:"file.png",end:!0})}),a.jsx("span",{className:"ui-dzc__sheet ui-dzc__sheet-m",children:a.jsx(vn,{d:_n.upload})})]})}const Gl=[{name:"Q3-Board-Report.pdf",size:4.2*Je},{name:"Hero-Shot.png",size:2.6*Je},{name:"Budget-2027.xlsx",size:1.3*Je,failAt:.62},{name:"Product-Demo.mp4",size:48*Je}];function b0({accept:e,maxSize:t=25*Je,onUpload:n,onChange:r,hint:i,autoplay:s=!1,className:o}){const[c,l]=_.useState([]),[f,m]=_.useState(0),[x,g]=_.useState(""),[,y]=_.useState(0),v=_.useRef(null),k=_.useRef(null),C=_.useRef(null),d=_.useRef(0),u=_.useRef(c);u.current=c;const p=_.useId(),w=e==null?void 0:e.map(h=>h.replace(/^\./,"").toLowerCase()),I=w!=null&&w.length?w.length<=3?w.map(h=>h.toUpperCase()).join(", "):`${w.slice(0,3).map(h=>h.toUpperCase()).join(", ")} and more`:"Any file",M=Number.isFinite(t)&&t>0?t:1/0,j=i??(M<1/0?`${I} · up to ${an(M)} each`:I);_.useEffect(()=>{r==null||r(c.filter(h=>!h.removing).map(({id:h,name:E,size:R,status:S,progress:Q,error:re,file:N})=>({id:h,name:E,size:R,status:S,progress:Q,error:re,file:N})))},[c]),_.useLayoutEffect(()=>{const h=k.current,E=C.current;if(!h||!E)return;const R=()=>h.style.height=`${E.offsetHeight}px`;R();const S=new ResizeObserver(R);return S.observe(E),()=>S.disconnect()},[]);const $=(h,E)=>l(R=>R.map(S=>S.id===h?{...S,...E}:S)),D=h=>{const E=w0();let R;w!=null&&w.length&&!w.includes(yr(h.name))?R=yr(h.name)?`.${yr(h.name)} files aren't supported`:"This file type isn't supported":h.size>M&&(R=`Too large – max ${an(M)}`);const S={id:E,name:h.name,size:Or(h.size),file:h.file,status:R?"error":"uploading",progress:0,error:R,failAt:h.failAt,startedAt:performance.now(),duration:v0(Or(h.size))};l(Q=>[...Q,S]),R?g(`${h.name}: ${R}`):n&&h.file&&B(S)},B=h=>{n(h.file,E=>l(R=>R.map(S=>S.id===h.id&&S.status==="uploading"?{...S,progress:Math.max(S.progress,m0(E))}:S))).then(()=>{$(h.id,{status:"done",progress:1}),g(`${h.name} uploaded`)}).catch(E=>{const R=E instanceof Error&&E.message?E.message:"Upload failed";$(h.id,{status:"error",error:R,retryable:!0}),g(`${h.name}: ${R}`)})},b=h=>Array.from(h).forEach(E=>D({name:E.name,size:E.size,file:E})),V=c.some(h=>h.status==="uploading"&&(!n||!h.file));_.useEffect(()=>{if(!V)return;const h=window.setInterval(()=>{const E=performance.now();l(R=>R.map(S=>{if(S.status!=="uploading"||n&&S.file)return S;const Q=Math.min(1,(E-S.startedAt)/S.duration),re=Math.max(S.progress,Q<1?Q*(.92+Math.random()*.08):1);return S.failAt!==void 0&&re>=S.failAt?(g(`${S.name}: upload failed`),{...S,progress:S.failAt,status:"error",error:"Connection lost",retryable:!0}):re>=1?(g(`${S.name} uploaded`),{...S,progress:1,status:"done"}):{...S,progress:re}}))},90);return()=>clearInterval(h)},[V,n]),_.useEffect(()=>{if(!c.some(E=>E.status==="uploading"))return;const h=window.setInterval(()=>y(E=>E+1),500);return()=>clearInterval(h)},[c]),_.useEffect(()=>{if(!s)return;const h=[window.setTimeout(()=>m(Gl.length),700),window.setTimeout(()=>{m(0),Gl.forEach((E,R)=>window.setTimeout(()=>D(E),R*140))},1900)];return()=>h.forEach(clearTimeout)},[s]);const q=h=>{$(h.id,{status:"uploading",progress:0,error:void 0,retryable:!1,failAt:void 0,startedAt:performance.now()}),n&&h.file&&B({...h})},G=h=>{$(h,{removing:!0}),window.setTimeout(()=>l(E=>E.filter(R=>R.id!==h)),480)},J=()=>u.current.filter(h=>h.status!=="uploading").forEach(h=>G(h.id)),ue=h=>Array.from(h.dataTransfer.types).includes("Files"),P=h=>{ue(h)&&(h.preventDefault(),d.current+=1,m(Math.max(1,h.dataTransfer.items.length)))},L=h=>{ue(h)&&(h.preventDefault(),h.dataTransfer.dropEffect="copy")},F=()=>{d.current=Math.max(0,d.current-1),d.current||m(0)},H=h=>{ue(h)&&(h.preventDefault(),d.current=0,m(0),b(h.dataTransfer.files))},Y=c.filter(h=>!h.removing),Z=Y.filter(h=>h.status==="uploading"),le=Y.filter(h=>h.status==="done"),ie=Y.filter(h=>h.status==="error"),ne=performance.now();let z=null;if(Y.length)if(Z.length){const h=Z.reduce((S,Q)=>S+Q.size,0),E=Z.reduce((S,Q)=>S+Q.size*Q.progress,0),R=`Uploading ${_t.format(Z.length)} of ${_t.format(Y.length)}`;z=a.jsxs("span",{className:"ui-dzc__summary",children:[a.jsx("span",{className:"ui-dzc__shimmer","data-text":R,children:R}),a.jsx("span",{className:"ui-dzc__dot",children:"·"}),ql(E,h)]})}else z=a.jsxs("span",{className:"ui-dzc__summary ui-dzc__summary-done",children:[ie.length?a.jsx(vn,{d:_n.alertCircle,solid:!0,className:"ui-dzc__warn"}):a.jsx(vn,{d:_n.checkCircle,solid:!0,className:"ui-dzc__ok"}),ie.length?`${_t.format(le.length)} of ${_t.format(Y.length)} uploaded`:`${_t.format(le.length)} ${le.length===1?"file":"files"} uploaded`]});return a.jsxs("div",{className:["ui-dzc",o].filter(Boolean).join(" "),children:[a.jsx("style",{href:"ui-dropzone-clean",precedence:"default",children:j0}),a.jsxs("div",{className:"ui-dzc__card",children:[a.jsx("div",{ref:k,className:"ui-dzc__body",children:a.jsxs("div",{ref:C,className:"ui-dzc__inner",children:[a.jsx("input",{ref:v,id:p,type:"file",multiple:!0,accept:e==null?void 0:e.join(","),className:"ui-dzc__input",tabIndex:-1,onChange:h=>{h.target.files&&b(h.target.files),h.target.value=""}}),a.jsxs("button",{type:"button",className:"ui-dzc__area","data-dragging":f>0||void 0,"aria-describedby":`${p}-hint`,onClick:()=>{var h;return(h=v.current)==null?void 0:h.click()},onDragEnter:P,onDragOver:L,onDragLeave:F,onDrop:H,children:[a.jsx(k0,{}),a.jsx("span",{className:"ui-dzc__title",children:f?`Release to upload ${f===1?"1 file":`${_t.format(f)} files`}`:a.jsxs(a.Fragment,{children:[a.jsxs("span",{className:"ui-dzc__for-mouse",children:["Drop files here or ",a.jsx("span",{className:"ui-dzc__browse",children:"browse"})]}),a.jsxs("span",{className:"ui-dzc__for-touch",children:["Tap to ",a.jsx("span",{className:"ui-dzc__browse",children:"choose files"})]})]})},f?"drop":"idle"),a.jsx("span",{className:"ui-dzc__hint",id:`${p}-hint`,children:j})]}),a.jsx("ul",{className:"ui-dzc__list","aria-label":"Uploads",children:c.map(h=>{const E=h.status==="uploading"?(1-h.progress)*(ne-h.startedAt)/Math.max(.05,h.progress)/1e3:0;return a.jsx("li",{className:"ui-dzc__row","data-status":h.status,"data-removing":h.removing||void 0,children:a.jsxs("div",{className:"ui-dzc__row-inner",children:[a.jsx(y0,{name:h.name}),a.jsxs("div",{className:"ui-dzc__info",children:[a.jsxs("div",{className:"ui-dzc__line",children:[a.jsx("span",{className:"ui-dzc__name",title:h.name,dir:"auto",children:Va(h.name)?a.jsxs(a.Fragment,{children:[a.jsx("span",{className:"ui-dzc__name-head",children:Va(h.name)[0]}),a.jsx("span",{className:"ui-dzc__name-tail",children:Va(h.name)[1]})]}):h.name}),h.status==="done"&&a.jsx("span",{className:"ui-dzc__done","aria-label":"Uploaded",children:a.jsx(vn,{d:_n.checkCircle,solid:!0})})]}),a.jsxs("div",{className:"ui-dzc__meta",children:[h.status==="uploading"&&a.jsxs(a.Fragment,{children:[ql(h.size*h.progress,h.size),a.jsx("span",{className:"ui-dzc__dot",children:"·"}),h.progress<.04?"starting":g0(E)]}),h.status==="done"&&an(h.size),h.status==="error"&&a.jsx("span",{className:"ui-dzc__error",dir:"auto",children:h.error})]},h.status),(h.status!=="error"||h.retryable)&&a.jsx("div",{className:"ui-dzc__bar","data-hidden":h.status==="done"||void 0,role:"progressbar","aria-label":`${h.name} upload`,"aria-valuemin":0,"aria-valuemax":100,"aria-valuenow":Math.round(h.progress*100),children:a.jsx("span",{style:{transform:`scaleX(${h.progress})`}})})]}),a.jsxs("div",{className:"ui-dzc__actions",children:[h.status==="error"&&h.retryable&&a.jsx("button",{type:"button",className:"ui-dzc__icon-btn ui-dzc__retry","aria-label":`Retry ${h.name}`,onClick:()=>q(h),children:a.jsx(vn,{d:_n.retry})}),a.jsx("button",{type:"button",className:"ui-dzc__icon-btn","aria-label":`Remove ${h.name}`,onClick:()=>G(h.id),children:a.jsx(vn,{d:_n.close})})]})]})},h.id)})})]})}),a.jsxs("div",{className:"ui-dzc__foot",children:[z??a.jsx("span",{className:"ui-dzc__foot-idle",children:"No files yet"}),(le.length>0||ie.length>0)&&!Z.length&&a.jsx("button",{type:"button",className:"ui-dzc__clear",onClick:J,children:"Clear"})]})]}),a.jsx("span",{className:"ui-dzc__live","aria-live":"polite",children:x})]})}const j0=`
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
`,Xl=["blue","violet","green","amber","gray"],z0=e=>Xl[[...e].reduce((t,n)=>(t*31+n.charCodeAt(0))%997,7)%Xl.length],C0=e=>{if(!e)return"";try{return new URL(e).hostname.replace(/^www\./,"")}catch{return e}},Lt=new Intl.NumberFormat("en"),S0=(...e)=>{for(const t of e){const n=t.match(/[\p{L}\p{N}]/u);if(n)return n[0].toUpperCase()}return""},Jl=e=>e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),N0=new Set(["about","after","again","their","there","these","those","which","while","would","could","should","every","other","being","still","where","until","since","under","first","people","thing","things"]);function E0(e,t,n){let r=null;if(t!=null&&t.length){const i=t.filter(s=>s.trim()).map(Jl);i.length&&(r=new RegExp(`(${i.join("|")})`,"gi"))}else{const i=[...new Set((n.toLowerCase().match(/[a-z0-9%]+/g)??[]).filter(s=>(s.length>=5||/\d/.test(s))&&!N0.has(s)))];i.length&&(r=new RegExp(`\\b(${i.map(Jl).join("|")})\\b`,"gi"))}return r?e.split(r).map((i,s)=>s%2?a.jsx("mark",{children:i},s):i):e}function L0({id:e,tone:t,children:n}){const r=_.useRef({id:e,tone:t,node:n}),[i,s]=_.useState(e),[o,c]=_.useState(null);return i!==e&&(s(e),c(r.current)),r.current={id:e,tone:t,node:n},_.useEffect(()=>{if(!o)return;const l=window.setTimeout(()=>c(null),260);return()=>window.clearTimeout(l)},[o]),a.jsxs("span",{className:"ui-cac__swap",children:[o&&a.jsx("span",{className:"ui-cac__swap-item","data-out":"","data-tone":o.tone,"aria-hidden":"true",children:o.node},`out-${o.id}`),a.jsx("span",{className:"ui-cac__swap-item","data-tone":t,children:n},e)]})}const ar=({d:e})=>a.jsx("svg",{viewBox:"0 0 16 16",className:"ui-cac__icon","aria-hidden":"true",children:a.jsx("path",{d:e})}),xn={close:"M4.75 4.75l6.5 6.5m0-6.5-6.5 6.5",out:"M6.5 4.5h5v5M11.25 4.75 4.5 11.5",copy:"M6.75 5.5h5c.69 0 1.25.56 1.25 1.25v5c0 .69-.56 1.25-1.25 1.25h-5c-.69 0-1.25-.56-1.25-1.25v-5c0-.69.56-1.25 1.25-1.25ZM10.5 3.5A1.25 1.25 0 0 0 9.25 3h-5C3.56 3 3 3.56 3 4.25v5c0 .54.34 1 .82 1.17",done:"M3.75 8.4 6.6 11.2 12.25 5",arrow:"M3.5 8h9M8.75 4.25 12.5 8l-3.75 3.75"};function ui({source:e}){const[t,n]=_.useState(!1);return a.jsx("span",{className:"ui-cac__glyph","data-tone":z0(e.site),"aria-hidden":"true",onErrorCapture:()=>n(!0),children:e.icon&&!t?e.icon:S0(e.site,e.title)})}const M0=_.memo(function({seg:t,index:n,marks:r,state:i,lit:s,openHere:o,previewId:c,api:l}){const[,f,m,x]=t.text.match(/^(\s*)([\s\S]*?)(\s*)$/)??["","",t.text,""],g=r.length?Math.max(0,m.search(/\S+$/)):m.length,y=m.length-g>24?m.length:g,v=k=>a.jsx("button",{type:"button",className:"ui-cac__marker","data-source":k.id,"data-lit":s===k.id?"":void 0,"aria-expanded":o===k.id,"aria-controls":c,"aria-label":`Source ${k.n}: ${k.label}`,onPointerEnter:C=>C.pointerType==="mouse"&&l.current.setHot({source:k.id,segment:n}),onPointerLeave:C=>C.pointerType==="mouse"&&l.current.setHot(null),onFocus:()=>l.current.setHot({source:k.id,segment:n}),onBlur:()=>l.current.setHot(null),onClick:()=>l.current.toggle(k.id),children:Lt.format(k.n)},k.id);return a.jsxs("span",{children:[f,a.jsxs("span",{className:"ui-cac__seg","data-hl":i==="hl"?"":void 0,"data-dim":i==="dim"?"":void 0,children:[m.slice(0,y),a.jsxs("span",{className:"ui-cac__keep",children:[m.slice(y),r.slice(0,1).map(v)]}),r.slice(1).map(v)]}),x]})}),kr=4;function T0({segments:e,sources:t,pagesRead:n,defaultOpen:r,onOpenSource:i,onPreviewChange:s,action:o,className:c}){const l=_.useId(),[f,m]=_.useState(null),[x,g]=_.useState(r&&t.some(N=>N.id===r)?r:null),y=_.useRef(x);x&&(y.current=x);const[v,k]=_.useState(null),C=_.useRef(null),d=_.useRef(null),[u,p]=_.useState(t.length),[w,I]=_.useState(!1),M=_.useMemo(()=>new Map(t.map((N,U)=>[N.id,U])),[t]),j=N=>(M.get(N)??-1)+1,$=N=>N!=null&&M.has(N)?t[M.get(N)]:null,D=N=>M.has(N),B=_.useMemo(()=>e.map(N=>[...new Set(N.cite??[])].filter(U=>M.has(U)).map(U=>{const ee=t[M.get(U)];return{id:U,n:M.get(U)+1,label:`${ee.site} – ${ee.title}`}})),[e,t,M]);_.useLayoutEffect(()=>{var rt;const N=C.current,U=d.current;if(!N||!U)return;const ee=()=>{var qn;const qe=[...U.querySelectorAll("[data-chip]")].map(Nt=>Nt.offsetWidth),Ce=((qn=U.querySelector("[data-more]"))==null?void 0:qn.offsetWidth)??36,Zn=N.clientWidth;if(qe.reduce((Nt,xa)=>Nt+xa,0)+kr*Math.max(0,qe.length-1)<=Zn+.5)return p(qe.length);let Qr=0,mt=0;for(;mt<qe.length;mt++){const Nt=Qr+(mt?kr:0)+qe[mt];if(Nt+kr+Ce>Zn)break;Qr=Nt}p(Math.max(1,mt))};ee();const ve=new ResizeObserver(ee);return ve.observe(N),(rt=document.fonts)==null||rt.ready.then(ee).catch(()=>{}),()=>ve.disconnect()},[t]);const b=w?t.length:Math.min(u,t.length),V=t.length-b,q=[];e.forEach((N,U)=>{(N.paragraph||q.length===0)&&q.push([]),q[q.length-1].push({seg:N,index:U})});const G=e.filter(N=>N.text.trim()).length,J=e.filter(N=>{var U;return N.text.trim()&&((U=N.cite)==null?void 0:U.some(D))}).length,ue=N=>e.filter(U=>{var ee;return(ee=U.cite)==null?void 0:ee.includes(N)}),P=N=>{const U=x===N?null:N;g(U),s==null||s(U)},L=_.useRef({setHot:m,toggle:P});L.current={setHot:m,toggle:P};const F=()=>{var U,ee;if(!x)return;const N=x;g(null),s==null||s(null),(ee=(U=C.current)==null?void 0:U.querySelector(`[data-source="${CSS.escape(N)}"]`))==null||ee.focus({preventScroll:!0})},H=N=>{var ee;const U=`“${N.quote??N.title}” – ${N.title}, ${N.site}${N.url?` (${N.url})`:""}`;(ee=navigator.clipboard)==null||ee.writeText(U).catch(()=>{}),k({id:Date.now(),source:N.id})};_.useEffect(()=>{if(!v)return;const N=window.setTimeout(()=>k(null),1800);return()=>window.clearTimeout(N)},[v]);const Y=N=>{N.key==="Escape"&&x&&(N.stopPropagation(),F())},Z=N=>{var qe,Ce;const U=[...((qe=C.current)==null?void 0:qe.querySelectorAll(".ui-cac__chip, .ui-cac__more"))??[]],ee=U.indexOf(N.currentTarget),ve=U.length-1,rt=N.key==="ArrowRight"?Math.min(ve,ee+1):N.key==="ArrowLeft"?Math.max(0,ee-1):N.key==="Home"?0:N.key==="End"?ve:null;rt===null||ee<0||(N.preventDefault(),(Ce=U[rt])==null||Ce.focus())},le=(f==null?void 0:f.source)??null,ie=(N,U)=>{var ee,ve;if(f)return f.segment!==void 0?f.segment===U?"hl":void 0:(ee=N.cite)!=null&&ee.includes(f.source)?"hl":"dim";if(x&&((ve=N.cite)!=null&&ve.includes(x)))return"hl"},ne=$(le),z=$(x);let h=a.jsxs(a.Fragment,{children:[a.jsx("b",{children:Lt.format(J)})," of ",Lt.format(G)," ",G===1?"sentence":"sentences"," backed by a source"]}),E="rest",R;if(v)h="Quote copied",E=`copied-${v.id}`,R="ok";else if(ne&&(f==null?void 0:f.segment)!==void 0)h=a.jsxs(a.Fragment,{children:[a.jsx("b",{children:ne.site})," ",a.jsx("span",{className:"ui-cac__dot",children:"·"})," ",ne.title]}),E=`mark-${f.segment}-${ne.id}`;else if(ne){const N=ue(ne.id).length;h=N?a.jsxs(a.Fragment,{children:[a.jsx("b",{children:ne.site})," ",a.jsx("span",{className:"ui-cac__dot",children:"·"})," cited in ",Lt.format(N)," ",N===1?"sentence":"sentences"]}):a.jsxs(a.Fragment,{children:[a.jsx("b",{children:ne.site})," ",a.jsx("span",{className:"ui-cac__dot",children:"·"})," read, not cited"]}),E=`src-${ne.id}`}else z&&(h=a.jsxs(a.Fragment,{children:["Quote from ",a.jsx("b",{children:z.site})]}),E=`open-${z.id}`);const S=$(x??y.current),Q=`${l}-preview`,re=[`${Lt.format(t.length)} ${t.length===1?"source":"sources"}`,Number.isFinite(n)?`${Lt.format(n)} ${n===1?"page":"pages"} read`:null].filter(Boolean);return a.jsxs("div",{className:["ui-cac",c].filter(Boolean).join(" "),role:"group","aria-label":"Answer with sources","data-hot":f?f.segment!==void 0?"mark":"source":void 0,onKeyDown:Y,children:[a.jsx("style",{href:"ui-cited-answer-clean",precedence:"default",children:$0}),a.jsxs("div",{className:"ui-cac__body",children:[a.jsxs("div",{className:"ui-cac__head",children:[a.jsx("span",{className:"ui-cac__stack","aria-hidden":"true",children:t.slice(0,3).map(N=>a.jsx(ui,{source:N},N.id))}),a.jsx("span",{className:"ui-cac__meta",children:re.map((N,U)=>a.jsxs("span",{children:[U>0&&a.jsx("span",{className:"ui-cac__dot",children:" · "}),N]},N))})]}),a.jsx("div",{className:"ui-cac__text",onPointerLeave:()=>m(null),children:q.map((N,U)=>a.jsx("p",{className:"ui-cac__p",dir:"auto",children:N.map(({seg:ee,index:ve})=>{const rt=B[ve],qe=f&&(f.segment===ve||f.segment===void 0&&rt.some(Ce=>Ce.id===f.source))?f.source:void 0;return a.jsx(M0,{seg:ee,index:ve,marks:rt,state:ie(ee,ve),lit:qe,openHere:x&&rt.some(Ce=>Ce.id===x)?x:null,previewId:Q,api:L},ve)})},U))}),a.jsxs("div",{className:"ui-cac__chips","data-all":w?"":void 0,ref:C,role:"list","aria-label":"Sources",onPointerLeave:()=>m(null),children:[t.slice(0,b).map((N,U)=>{const ee=le===N.id;return a.jsx("span",{role:"listitem",className:"ui-cac__chip-item",children:a.jsxs("button",{type:"button",className:"ui-cac__chip","data-source":N.id,"data-lit":ee?"":void 0,"data-dim":le&&!ee?"":void 0,"aria-expanded":x===N.id,"aria-controls":Q,"aria-label":`Source ${U+1}: ${N.site} – ${N.title}`,onPointerEnter:ve=>ve.pointerType==="mouse"&&m({source:N.id}),onFocus:()=>m({source:N.id}),onBlur:()=>m(null),onKeyDown:Z,onClick:()=>P(N.id),children:[a.jsx(ui,{source:N}),a.jsx("span",{className:"ui-cac__chip-name",dir:"auto",title:N.site,children:N.site}),a.jsx("span",{className:"ui-cac__chip-num",children:Lt.format(U+1)})]})},N.id)}),V>0&&a.jsx("span",{role:"listitem",className:"ui-cac__chip-item",children:a.jsxs("button",{type:"button",className:"ui-cac__more","aria-label":`Show ${V} more ${V===1?"source":"sources"}`,onKeyDown:Z,onClick:()=>I(!0),children:["+",V]})})]}),a.jsxs("div",{className:"ui-cac__ruler",ref:d,"aria-hidden":"true",children:[t.map((N,U)=>a.jsxs("span",{className:"ui-cac__chip","data-chip":"",children:[a.jsx(ui,{source:N}),a.jsx("span",{className:"ui-cac__chip-name",children:N.site}),a.jsx("span",{className:"ui-cac__chip-num",children:U+1})]},N.id)),a.jsxs("span",{className:"ui-cac__more","data-more":"",children:["+",t.length]})]}),a.jsx("div",{id:Q,className:"ui-cac__fold","data-open":x?"":void 0,inert:!x,role:"region","aria-label":S?`Source ${j(S.id)}: ${S.site}`:"Source",children:a.jsx("div",{className:"ui-cac__clip",children:S&&a.jsxs("div",{className:"ui-cac__preview",children:[a.jsxs("div",{className:"ui-cac__pv-head",children:[a.jsx(ui,{source:S}),a.jsxs("span",{className:"ui-cac__pv-meta",children:[a.jsx("span",{className:"ui-cac__pv-domain",title:S.url||S.site,children:C0(S.url)||S.site}),S.date&&a.jsxs("span",{className:"ui-cac__pv-date",children:[a.jsx("span",{className:"ui-cac__dot",children:" · "}),S.date]})]}),a.jsx("span",{className:"ui-cac__pv-num",children:Lt.format(j(S.id))}),a.jsx("button",{type:"button",className:"ui-cac__close","aria-label":"Close source",onClick:F,children:a.jsx(ar,{d:xn.close})})]}),a.jsx("div",{className:"ui-cac__pv-title",dir:"auto",title:S.title,children:S.title}),S.quote&&a.jsx("blockquote",{className:"ui-cac__quote",dir:"auto",children:E0(S.quote,S.highlight,ue(S.id).map(N=>N.text).join(" "))}),a.jsxs("div",{className:"ui-cac__pv-actions",children:[S.url?a.jsxs("a",{className:"ui-cac__btn ui-cac__btn--main",href:S.url,target:"_blank",rel:"noreferrer noopener",onClick:N=>{i&&(N.preventDefault(),i(S))},children:[a.jsx(ar,{d:xn.out}),"Open source"]}):i&&a.jsxs("button",{type:"button",className:"ui-cac__btn ui-cac__btn--main",onClick:()=>i(S),children:[a.jsx(ar,{d:xn.out}),"Open source"]}),S.quote&&a.jsxs("button",{type:"button",className:"ui-cac__btn","data-done":(v==null?void 0:v.source)===S.id?"":void 0,"aria-label":"Copy quote",onClick:()=>H(S),children:[a.jsx("span",{className:"ui-cac__btn-icon",children:a.jsx(ar,{d:(v==null?void 0:v.source)===S.id?xn.done:xn.copy})},(v==null?void 0:v.source)===S.id?"done":"idle"),a.jsx("span",{className:"ui-cac__btn-text",children:(v==null?void 0:v.source)===S.id?"Copied":"Copy quote"})]})]})]},S.id)})})]}),a.jsxs("div",{className:"ui-cac__foot",children:[a.jsx("span",{className:"ui-cac__caption","aria-live":"polite",children:a.jsx(L0,{id:E,tone:R,children:h})}),o&&a.jsxs("button",{type:"button",className:"ui-cac__action",title:o.label,onClick:o.onClick,children:[a.jsx("span",{className:"ui-cac__action-label",children:o.label}),a.jsx(ar,{d:xn.arrow})]})]})]})}const $0=`
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
.ui-cac__chips { display: flex; gap: ${kr}px; margin-top: 16px; min-width: 0; }
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
.ui-cac__ruler { position: absolute; top: 0; left: 0; display: flex; gap: ${kr}px; height: 0; overflow: hidden; visibility: hidden; pointer-events: none; }
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
`,I0=e=>e instanceof Date?e.getTime():typeof e=="number"?e:typeof e=="string"?Date.parse(e):NaN,P0=(e,t)=>{if(!Number.isFinite(e)||!Number.isFinite(t))return"";const n=Math.max(0,Math.round((t-e)/1e3));return n<5?"now":n<60?`${n}s`:n<3600?`${Math.floor(n/60)}m`:n<86400?`${Math.floor(n/3600)}h`:`${Math.floor(n/86400)}d`},ec=e=>typeof Intl.Segmenter=="function"?Array.from(new Intl.Segmenter().segment(e),t=>t.segment):Array.from(e),F0=e=>{const t=e.trim().split(/\s+/).filter(Boolean),n=t.filter(r=>/^[\p{L}\p{N}]/u.test(r));return n.length?(n.length>1?[n[0],n[n.length-1]]:n).map(r=>ec(r)[0]).join("").toUpperCase():t.length?ec(t[0])[0]:""},tc=e=>typeof e=="number"&&Number.isFinite(e)?Math.max(0,Math.floor(e)):0,He=new Intl.NumberFormat("en"),di=e=>e>999?"999+":He.format(e),R0=e=>e==="critical"||e==="warning"?e:"note",A0={critical:"Critical",warning:"Warning",note:"Note"},nc=e=>{const t=new Map;return(Array.isArray(e)?e:[]).filter(n=>!!n&&typeof n=="object").map(n=>{const r=String(n.id??""),i=t.get(r)??0;return t.set(r,i+1),{x:n,id:r,key:i?`${r}#${i}`:r}})},Ed=40,Ua=({severity:e})=>{const t=e==="critical"?[1,1,1,.6]:e==="warning"?[1,.6,.6,.3]:[.6,.3,.3,.3];return a.jsx("svg",{className:"ui-afc__mark","data-severity":e,width:"10",height:"10",viewBox:"0 0 10 10","aria-hidden":"true",children:[[0,0],[5.5,0],[0,5.5],[5.5,5.5]].map(([n,r],i)=>a.jsx("rect",{x:n,y:r,width:"4.5",height:"4.5",rx:"1",fill:"currentColor",opacity:t[i]},i))})},D0=()=>a.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 14 14","aria-hidden":"true",children:[a.jsx("path",{d:"M7 1.2c.4 2.9 1.9 4.4 4.8 4.8-2.9.4-4.4 1.9-4.8 4.8C6.6 7.9 5.1 6.4 2.2 6 5.1 5.6 6.6 4.1 7 1.2Z",fill:"currentColor"}),a.jsx("circle",{cx:"11.6",cy:"11.4",r:"1.1",fill:"currentColor",opacity:"0.55"})]});function O0({text:e}){return a.jsx("span",{className:"ui-afc__step",dir:"auto",title:e,children:e},e)}function B0({avatar:e,name:t}){const[n,r]=_.useState(!1),i=e!=null&&e!==!1&&!n;return a.jsx("span",{className:"ui-afc__avatar","data-logo":i?"":void 0,onErrorCapture:()=>r(!0),children:i?e:F0(t)})}function H0({agents:e,findings:t,title:n="Verification",rows:r=4,now:i,onOpen:s,className:o}){const[c,l]=_.useState(()=>Date.now()),[f,m]=_.useState(null);_.useEffect(()=>{if(i!==void 0)return;const b=window.setInterval(()=>l(Date.now()),5e3);return()=>window.clearInterval(b)},[i]);const x=i??c,g=typeof r=="number"&&Number.isFinite(r)&&r>=1?Math.floor(r):4,y=nc(e).map(({x:b,id:V,key:q})=>{const G=tc(b.total),J=b.status==="running"||b.status==="done"||b.status==="failed"?b.status:void 0;return{...b,id:V,key:q,name:String(b.name??"").trim()||V||"Agent",total:G,done:Math.min(tc(b.done),G),status:J}}),v=nc(t).map(({x:b,id:V,key:q})=>({...b,id:V,key:q,src:b,agentId:String(b.agentId??""),title:String(b.title??""),severity:R0(b.severity),at:I0(b.at)})),k=y.reduce((b,V)=>b+V.done,0),C=y.reduce((b,V)=>b+V.total,0),d=(b,V)=>v.filter(q=>q.severity===b&&(!V||q.agentId===V)).length,u=d("critical"),p=d("warning"),w=Math.max(0,...y.map(b=>`${He.format(b.done)}/${He.format(b.total)}`.length)),I=Math.max(1,...y.map(b=>Math.max(di(d("critical",b.id)).length,di(d("warning",b.id)).length))),M=b=>y.find(V=>V.id===b),j=f?M(f):void 0,$=j?f:null,D=b=>Number.isFinite(b.at)?b.at:-1/0,B=v.filter(b=>!$||b.agentId===$).sort((b,V)=>D(b)===D(V)?0:D(V)>D(b)?1:-1).slice(0,g+1);return a.jsxs("div",{className:["ui-afc",o].filter(Boolean).join(" "),style:{"--ui-afc-rows":g,"--ui-afc-count-w":`${w}ch`,"--ui-afc-found-w":`calc(38px + ${I*2}ch)`},children:[a.jsx("style",{href:"ui-agent-findings-clean",precedence:"default",children:W0}),a.jsxs("div",{className:"ui-afc__card",children:[a.jsxs("header",{className:"ui-afc__bar",children:[a.jsx("span",{className:"ui-afc__spark",children:a.jsx(D0,{})}),a.jsx("span",{className:"ui-afc__title",title:n,children:n}),a.jsx("span",{className:"ui-afc__progress",children:C>0&&`${He.format(k)} of ${He.format(C)} ${C===1?"check":"checks"}`}),a.jsxs("span",{className:"ui-afc__totals","aria-label":`${He.format(u)} critical, ${He.format(p)} ${p===1?"warning":"warnings"}`,children:[a.jsxs("span",{"data-severity":"critical","data-zero":u===0||void 0,children:[a.jsx("b",{children:He.format(u)},u)," critical"]}),a.jsxs("span",{"data-severity":"warning","data-zero":p===0||void 0,children:[a.jsx("b",{children:He.format(p)},p)," ",p===1?"warning":"warnings"]})]})]}),a.jsxs("ul",{className:"ui-afc__agents","aria-label":"Agents",children:[y.length===0&&a.jsx("li",{className:"ui-afc__none",children:"No agents yet"}),y.map(b=>{const V=b.status??(b.done>=b.total?"done":"running"),q=b.total?Math.min(100,b.done/b.total*100):0,G=d("critical",b.id),J=d("warning",b.id),ue=$===b.id,P=V==="done"?"All checks done":V==="failed"?"Stopped":b.step;return a.jsx("li",{children:a.jsxs("button",{type:"button",className:"ui-afc__agent","data-status":V,"aria-pressed":ue,"data-dim":$&&!ue?"":void 0,title:b.model?`${b.name} · ${b.model}`:b.name,onClick:()=>m(ue?null:b.id),children:[a.jsx(B0,{avatar:b.avatar,name:b.name}),a.jsxs("span",{className:"ui-afc__who",children:[a.jsx("span",{className:"ui-afc__name",dir:"auto",children:b.name}),a.jsx(O0,{text:P})]}),a.jsx("span",{className:"ui-afc__track","aria-hidden":"true",children:a.jsx("span",{className:"ui-afc__fill",style:{width:`${q}%`}})}),a.jsxs("span",{className:"ui-afc__count",children:[He.format(b.done),"/",He.format(b.total)]}),a.jsxs("span",{className:"ui-afc__found","aria-label":`${He.format(G)} critical, ${He.format(J)} ${J===1?"warning":"warnings"}`,children:[a.jsxs("span",{"data-severity":"critical","data-zero":G===0||void 0,children:[a.jsx(Ua,{severity:"critical"}),a.jsx("b",{children:di(G)},G)]}),a.jsxs("span",{"data-severity":"warning","data-zero":J===0||void 0,children:[a.jsx(Ua,{severity:"warning"}),a.jsx("b",{children:di(J)},J)]})]})]})},b.key)})]}),a.jsxs("div",{className:"ui-afc__feed-head",children:[a.jsx("span",{className:"ui-afc__label",children:"Latest findings"}),j&&a.jsxs("button",{type:"button",className:"ui-afc__chip",onClick:()=>m(null),"aria-label":`Show all agents (now only ${j.name})`,title:j.name,children:[a.jsx("span",{className:"ui-afc__chip-name",children:j.name}),a.jsx("svg",{width:"10",height:"10",viewBox:"0 0 10 10","aria-hidden":"true",children:a.jsx("path",{d:"M2.5 2.5l5 5M7.5 2.5l-5 5",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round"})})]})]}),a.jsxs("ol",{className:"ui-afc__feed","aria-live":"polite",style:{"--ui-afc-shown":Math.max(1,Math.min(B.length,g))},children:[B.length===0&&a.jsx("li",{className:"ui-afc__empty",children:"Nothing found yet"}),B.map((b,V)=>{var J;const q=(J=M(b.agentId))==null?void 0:J.name,G=b.location?String(b.location):"";return a.jsx("li",{className:"ui-afc__slot",style:{transform:`translateY(${V*Ed}px)`},"data-out":V>=g||void 0,"aria-hidden":V>=g||void 0,children:a.jsx("button",{type:"button",className:"ui-afc__finding",tabIndex:V>=g?-1:0,onClick:()=>s==null?void 0:s(b.src),children:a.jsxs("span",{className:"ui-afc__in",children:[a.jsx(Ua,{severity:b.severity}),a.jsxs("span",{className:"ui-afc__sr",children:[A0[b.severity],": "]}),a.jsx("span",{className:"ui-afc__ftitle",dir:"auto",title:b.title,children:b.title}),a.jsxs("span",{className:"ui-afc__meta",title:[q,G].filter(Boolean).join(" · ")||void 0,children:[q&&a.jsx("span",{className:"ui-afc__who-name",children:q}),q&&G&&a.jsx("span",{className:"ui-afc__dot",children:"·"}),G&&a.jsx("code",{children:G})]}),a.jsx("span",{className:"ui-afc__time",children:P0(b.at,x)})]})})},b.key)})]})]})]})}const W0=`
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
  --ui-afc-row: ${Ed}px;
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
`,V0=e=>{const t=Math.max(0,Math.round(e/1e3));if(t<10)return"just now";if(t<60)return`${t}s ago`;const n=Math.floor(t/60);if(n<60)return`${n}m ago`;const r=Math.floor(n/60);return r<24?`${r}h ago`:`${Math.floor(r/24)}d ago`},U0=(e,t)=>{const n=t-e;if(n>-6e4&&n<30*864e5)return V0(n);const r=new Date(e).getFullYear()===new Date(t).getFullYear();return new Intl.DateTimeFormat("en",{month:"short",day:"numeric",year:r?void 0:"numeric"}).format(e)},Q0=e=>{var t;return(((t=e.match(/[\p{L}\p{N}]/u))==null?void 0:t[0])??"·").toUpperCase()},Y0=e=>{const t=new Map;for(const n of e)for(const r of n.dependsOn??[])t.set(r,[...t.get(r)??[],n]);return t},rc=(e,t)=>{const n=[],r=new Set([e]),i=[e];for(let s=0;s<i.length;s++)for(const o of t.get(i[s])??[])r.has(o.id)||(r.add(o.id),n.push(o),i.push(o.id));return n},Z0=()=>a.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none","aria-hidden":"true",children:[a.jsx("rect",{x:"2",y:"1.8",width:"12",height:"12.4",rx:"2.6",stroke:"currentColor",strokeWidth:"1.3"}),a.jsx("path",{d:"M5 5.4h6M5 8h6M5 10.6h3.6",stroke:"currentColor",strokeWidth:"1.3",strokeLinecap:"round"})]}),q0=()=>a.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[a.jsx("path",{d:"M4 7H15C18.3137 7 21 9.68629 21 13C21 16.3137 18.3137 19 15 19H8",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"1.8"}),a.jsx("path",{d:"M8 3L4 7L8 11",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"1.8"})]}),K0=()=>a.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[a.jsx("path",{d:"M20 7H9C5.68629 7 3 9.68629 3 13C3 16.3137 5.68629 19 9 19H16",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"1.8"}),a.jsx("path",{d:"M16 3L20 7L16 11",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"1.8"})]}),G0=()=>a.jsxs("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[a.jsx("path",{d:"M4.26781 18.8447C4.49269 20.515 5.87613 21.8235 7.55966 21.9009C8.97627 21.966 10.4153 22 12 22C13.5847 22 15.0237 21.966 16.4403 21.9009C18.1239 21.8235 19.5073 20.515 19.7322 18.8447C19.879 17.7547 20 16.6376 20 15.5C20 14.3624 19.879 13.2453 19.7322 12.1553C19.5073 10.485 18.1239 9.17649 16.4403 9.09909C15.0237 9.03397 13.5847 9 12 9C10.4153 9 8.97627 9.03397 7.55966 9.09909C5.87613 9.17649 4.49269 10.485 4.26781 12.1553C4.12104 13.2453 4 14.3624 4 15.5C4 16.6376 4.12104 17.7547 4.26781 18.8447Z",stroke:"currentColor",strokeWidth:"1.8"}),a.jsx("path",{d:"M7.5 9V6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5V9",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"1.8"})]});function X0({entries:e,agent:t,now:n,undone:r,defaultUndone:i=[],onUndo:s,onRedo:o,pointAt:c=null,title:l="Ledger",className:f}){const m=_.useId(),x=_.useRef(null);x.current===null&&(x.current=new Set(e.map(P=>P.id)));const[g,y]=_.useState(i),v=new Set(r??g),[k,C]=_.useState(null),[d,u]=_.useState({}),p=_.useRef(r??[]);_.useEffect(()=>{if(!r)return;const P=r.filter(L=>!p.current.includes(L));p.current=r,P.length&&u(Object.fromEntries(P.map((L,F)=>[L,F])))},[r]);const[w,I]=_.useState(()=>Date.now());_.useEffect(()=>{if(n!==void 0)return;const P=window.setInterval(()=>I(Date.now()),15e3);return()=>window.clearInterval(P)},[n]);const M=n??w,j=[...e].sort((P,L)=>L.at-P.at),$=_.useMemo(()=>Y0(e),[e]),D=P=>rc(P,$).filter(L=>!v.has(L.id)),B=k??c,b=B?D(B):[],V=new Map(b.map(P=>[P.id,P.reversible!==!1?"also":"kept"])),q=P=>{const L=[P.id,...D(P.id).filter(F=>F.reversible!==!1).map(F=>F.id)];u(Object.fromEntries(L.map((F,H)=>[F,H]))),y(F=>[...F,...L.filter(H=>!F.includes(H))]),C(null),s==null||s(L)},G=P=>{const L=[P.id,...rc(P.id,$).filter(F=>v.has(F.id)).map(F=>F.id)];u({}),y(F=>F.filter(H=>!L.includes(H))),o==null||o(L)},J=e.length,ue=e.filter(P=>v.has(P.id)).length;return a.jsxs("div",{className:["ui-alc",f].filter(Boolean).join(" "),children:[a.jsx("style",{href:"ui-agent-ledger-clean",precedence:"default",children:J0}),a.jsxs("header",{className:"ui-alc__bar",children:[a.jsx("span",{className:"ui-alc__mark",children:a.jsx(Z0,{})}),a.jsx("span",{className:"ui-alc__title",id:m,children:l}),t&&a.jsx("span",{className:"ui-alc__agent",children:t}),a.jsxs("span",{className:"ui-alc__sum",children:[a.jsxs("span",{children:[a.jsx("b",{children:J.toLocaleString("en-US")})," ",J===1?"change":"changes"]}),ue>0&&a.jsxs("span",{className:"ui-alc__sum-undone",children:[a.jsx("b",{children:ue.toLocaleString("en-US")})," undone"]})]})]}),a.jsx("ol",{className:"ui-alc__panel","aria-labelledby":m,children:j.map(P=>{var le;const L=v.has(P.id),F=V.get(P.id),H=P.reversible===!1,Y=L||H?0:D(P.id).length,Z=P.change&&(P.change[0].trim()||P.change[1].trim())?P.change:void 0;return a.jsxs("li",{className:"ui-alc__row","data-undone":L?"":void 0,"data-initial":(le=x.current)!=null&&le.has(P.id)?"":void 0,"data-preview":B===P.id?"":void 0,"data-chain":F,style:{"--o":d[P.id]??0},children:[a.jsx("span",{className:"ui-alc__icon","aria-hidden":"true",children:P.icon??Q0(P.system)}),a.jsxs("div",{className:"ui-alc__main",children:[a.jsxs("span",{className:"ui-alc__what",title:P.target?`${P.action} ${P.target}`:P.action,children:[a.jsx("span",{className:"ui-alc__action",dir:"auto",children:P.action}),P.target&&a.jsx("span",{className:"ui-alc__target",dir:"auto",children:P.target}),a.jsx("span",{className:"ui-alc__strike","aria-hidden":"true"})]}),a.jsx("span",{className:"ui-alc__change",title:Z?`${Z[0]} → ${Z[1]}`:P.detail,children:Z?a.jsxs(a.Fragment,{children:[a.jsx("span",{className:"ui-alc__before",dir:"auto",children:Z[0]}),a.jsx("span",{className:"ui-alc__arrow","aria-label":"to",children:"→"}),a.jsx("span",{className:"ui-alc__after",dir:"auto",children:Z[1]})]}):a.jsx("span",{className:"ui-alc__detail",dir:"auto",children:P.detail})})]}),a.jsx("div",{className:"ui-alc__end",children:F?a.jsx("span",{className:"ui-alc__flag","data-kind":F,children:F==="also"?"Also undone":a.jsxs(a.Fragment,{children:[a.jsx(G0,{}),"Can't undo"]})}):a.jsxs(a.Fragment,{children:[a.jsx("span",{className:"ui-alc__time","data-hide":L||!H?"":void 0,children:L?"Undone":a.jsxs(a.Fragment,{children:[U0(P.at,M),a.jsxs("span",{className:"ui-alc__sys",children:[" · ",P.system]})]})}),L?a.jsxs("button",{type:"button",className:"ui-alc__act",onClick:()=>G(P),"aria-label":`Redo: ${P.action}${P.target?` ${P.target}`:""}`,children:[a.jsx(K0,{}),a.jsx("span",{className:"ui-alc__act-label",children:"Redo"})]}):H?null:a.jsxs("button",{type:"button",className:"ui-alc__act",onMouseEnter:()=>C(P.id),onMouseLeave:()=>C(ie=>ie===P.id?null:ie),onFocus:()=>C(P.id),onBlur:()=>C(ie=>ie===P.id?null:ie),onClick:()=>q(P),"aria-label":`Undo: ${P.action}${P.target?` ${P.target}`:""}${Y?` – and ${Y} that build on it`:""}`,children:[a.jsx(q0,{}),a.jsx("span",{className:"ui-alc__act-label",children:"Undo"})]})]})})]},P.id)})})]})}const J0=`
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
`,ga=(...e)=>e.filter(Boolean).join(" "),ic=e=>!!e&&Object.values(e).some(Boolean),dr=e=>e==null?"":String(e),sr=e=>e.toLocaleString("en-US"),eh=e=>e.replace(new RegExp("\\p{Lu}\\p{Ll}+","gu"),t=>t.toLowerCase()),th=()=>typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;function ac(e){!e||th()||!e.animate||e.animate([{transform:"none"},{transform:"translateX(-4px)"},{transform:"translateX(4px)"},{transform:"translateX(-2px)"},{transform:"none"}],{duration:340,easing:"ease-out"})}function sc(e,t,n){if(!e||!t)return;const r=e.querySelector(n);if(!r||!r.offsetWidth){t.style.opacity="0";return}const i=!t.dataset.ready;i&&(t.style.transition="none"),t.style.opacity="1",t.style.width=`${r.offsetWidth}px`,t.style.height=`${r.offsetHeight}px`,t.style.transform=`translate(${r.offsetLeft}px, ${r.offsetTop}px)`,i&&(t.dataset.ready="1",t.offsetWidth,t.style.transition="")}const nh=({d:e,className:t})=>a.jsx("svg",{viewBox:"0 0 24 24",className:ga("ui-sfc__glyph",t),"aria-hidden":"true",children:a.jsx("path",{d:e})}),Ld={check:"M5.5 12.5l4 4L18.5 8",back:"M14.5 6l-6 6 6 6"},Md=({className:e})=>a.jsx("svg",{viewBox:"0 0 24 24",className:ga("ui-sfc__draw",e),"aria-hidden":"true",children:a.jsx("path",{d:Ld.check,pathLength:1})}),Td=_.createContext({errors:{},shake:0,report:()=>{}}),$d=_.createContext(null);function Id({steps:e,initialValues:t,onComplete:n,initialStep:r=0,step:i,onStepChange:s,submitLabel:o="Finish",submittingLabel:c="Creating…",success:l,className:f}){var Ao,Do;const m=e.length,x=A=>Number.isFinite(A)?Math.max(0,Math.min(Math.max(m-1,0),Math.trunc(A))):0,[g,y]=_.useState(r),v=x(i??g),[k,C]=_.useState(t),d=_.useRef(k),[u,p]=_.useState(v),w=Math.max(u,v),[I,M]=_.useState({}),[j,$]=_.useState(0),[D,B]=_.useState(null),[b,V]=_.useState(!1),[q,G]=_.useState(""),[J,ue]=_.useState(!1),[P,L]=_.useState(""),F=_.useRef(null),H=_.useRef(null),Y=_.useRef(null),Z=_.useRef(null),le=_.useRef(!1),ie=_.useRef(!1),ne=_.useRef({}),z=_.useCallback((A,W)=>{ne.current={...ne.current,[A]:W??void 0}},[]),h=_.useId(),E=J?m:v,[R,S]=_.useState({index:E,from:null,dir:1});R.index!==E&&S({index:E,from:R.index,dir:E>R.index?1:-1}),_.useEffect(()=>{if(R.from===null)return;const A=window.setTimeout(()=>S(W=>({...W,from:null})),420);return()=>clearTimeout(A)},[R.index,R.from]);const Q=_.useCallback(A=>{d.current={...d.current,...A},C(d.current)},[]),re=A=>{const W=Math.max(0,Math.min(m-1,A));W!==v&&(le.current=!0,ie.current=!0,ne.current={},i===void 0&&y(W),s==null||s(W),p(de=>Math.max(de,W)),G(""),L(`Step ${sr(W+1)} of ${sr(m)}: ${dr(e[W].title)}`))},N=()=>{var W,de;const A={...ne.current,...(de=(W=e[v]).validate)==null?void 0:de.call(W,d.current)};return ic(A)?(M(Se=>({...Se,[v]:!0})),$(Se=>Se+1),L(Object.values(A).find(Boolean)??"Check this step"),!1):(M(Se=>({...Se,[v]:!1})),!0)},U=async A=>{if(A==null||A.preventDefault(),!(b||J||!N())){if(v<m-1){D!==null&&D>v?(B(null),re(D)):re(v+1);return}V(!0),G("");try{await(n==null?void 0:n(d.current)),le.current=!0,ie.current=!0,ue(!0),L("All done")}catch(W){const de=W instanceof Error&&W.message?W.message:"Something went wrong – try again";G(de),L(de)}finally{V(!1)}}},ee=()=>{B(null),re(v-1)},ve=A=>{A<0||A>=m||A===v||A>v&&!N()||(B(A<v?v:null),re(A))},rt=A=>ve(e.findIndex(W=>W.id===A)),qe=()=>{d.current=t,C(t),M({}),B(null),p(x(r)),ue(!1),G(""),le.current=!0,ie.current=!0,ne.current={},i===void 0&&y(x(r)),s==null||s(x(r))};if(_.useEffect(()=>{var de,Se;if(!le.current)return;le.current=!1;const A=(de=H.current)==null?void 0:de.querySelector('[data-pane="current"]');(Se=(A==null?void 0:A.querySelector('input:not([type="hidden"]):not(:disabled), textarea, select'))??(A==null?void 0:A.querySelector(".ui-sfc__heading")))==null||Se.focus({preventScroll:!0})},[E]),_.useEffect(()=>{var A,W;j&&((W=(A=H.current)==null?void 0:A.querySelector('[data-pane="current"] [aria-invalid="true"]'))==null||W.focus({preventScroll:!0}))},[j]),_.useLayoutEffect(()=>{const A=H.current,W=A==null?void 0:A.querySelector('[data-pane="current"]');if(!A||!W)return;const de=!A.dataset.ready,Se=()=>A.style.height=`${W.offsetHeight}px`;de&&(A.style.transition="none"),Se(),de&&(A.dataset.ready="1",A.offsetWidth,A.style.transition="");const Kn=new ResizeObserver(Se);return Kn.observe(W),()=>Kn.disconnect()},[E]),_.useLayoutEffect(()=>{const A=Y.current,W=Z.current;if(!A||!W)return;const de=()=>A.style.width=`${W.offsetWidth}px`;de();const Se=new ResizeObserver(de);return Se.observe(W),()=>Se.disconnect()},[]),!m)return null;const Ce=e[v],Zn=I[v]?((Ao=Ce.validate)==null?void 0:Ao.call(Ce,k))??{}:{},Ro=!ic((Do=Ce.validate)==null?void 0:Do.call(Ce,k)),Qr=v===m-1,mt=b?c:Qr?o:D!==null&&D>v?`Back to ${eh(dr(e[D].title))}`:"Continue",qn={values:k,setValues:Q,errors:Zn,goTo:rt,next:()=>{var A;return(A=F.current)==null?void 0:A.requestSubmit()}},Nt=A=>{if(A>=m)return l?l(k,qe):a.jsx(Pd,{title:"All set",description:"Everything is saved. You can change it any time."});const W=e[A],de=A===v?qn:{...qn,errors:{}};return a.jsxs(a.Fragment,{children:[a.jsx("h2",{className:"ui-sfc__heading",tabIndex:-1,id:`${h}-h${A}`,dir:"auto",children:W.heading??W.title}),W.description&&a.jsx("p",{className:"ui-sfc__desc",dir:"auto",children:W.description}),a.jsx("div",{className:"ui-sfc__body",children:W.render(de)})]})},xa=R.from!==null&&R.from!==R.index?[R.from,R.index]:[R.index];return a.jsxs("div",{className:ga("ui-sfc",f),style:{"--ui-sfc-n":m},children:[a.jsx("style",{href:"ui-stepper-form-clean",precedence:"default",children:ih}),a.jsxs("div",{className:"ui-sfc__head",children:[a.jsx("div",{className:"ui-sfc__steps",children:a.jsx("ol",{className:"ui-sfc__list","aria-label":"Progress",children:e.map((A,W)=>{const de=J||W<w&&W!==v?"done":W===v?"current":"upcoming",Se=!J&&!b&&W!==v&&W<=w,Kn=a.jsxs(a.Fragment,{children:[a.jsx("span",{className:"ui-sfc__bar","aria-hidden":"true"}),a.jsx("span",{className:"ui-sfc__mark",children:de==="done"?a.jsx(Md,{},"check"):a.jsx("span",{children:W+1},"num")}),a.jsx("span",{className:"ui-sfc__step-label",dir:"auto",children:A.title}),a.jsx("span",{className:"ui-sfc__sr",children:de==="done"?" (done)":de==="current"?" (current)":""})]});return a.jsx("li",{className:"ui-sfc__step","data-state":de,"aria-current":!J&&W===v?"step":void 0,children:Se?a.jsx("button",{type:"button",className:"ui-sfc__step-btn",title:dr(A.title)||void 0,onClick:()=>ve(W),children:Kn}):a.jsx("span",{className:"ui-sfc__step-btn",title:dr(A.title)||void 0,children:Kn})},`${A.id}#${W}`)})})}),a.jsx("div",{className:"ui-sfc__compact","aria-hidden":"true",children:a.jsx("span",{className:"ui-sfc__compact-text",children:J?a.jsxs(a.Fragment,{children:["All ",sr(m)," steps done"]}):a.jsxs(a.Fragment,{children:["Step ",sr(v+1)," of ",sr(m),a.jsx("span",{className:"ui-sfc__compact-dot",children:"·"}),a.jsx("span",{className:"ui-sfc__compact-title",dir:"auto",children:Ce.title})]})},J?"done":v)})]}),a.jsxs("form",{ref:F,className:"ui-sfc__card",noValidate:!0,onSubmit:U,"aria-labelledby":J?void 0:`${h}-h${v}`,children:[a.jsx("div",{ref:H,className:"ui-sfc__viewport",children:xa.map(A=>{const W=A===R.index;return a.jsx("div",{className:"ui-sfc__pane","data-pane":W?"current":"leaving","data-dir":R.dir,"data-first":!ie.current||void 0,inert:!W,"aria-hidden":!W||void 0,children:a.jsx(Td.Provider,{value:{errors:W&&A===v?Zn:{},shake:W?j:0,report:z},children:Nt(A)})},A)})}),a.jsx("div",{className:"ui-sfc__foot-fold","data-hidden":J||void 0,children:a.jsxs("div",{className:"ui-sfc__foot",inert:J,children:[a.jsxs("button",{type:"button",className:"ui-sfc__btn ui-sfc__btn-ghost","data-hidden":v===0||void 0,disabled:v===0||b,onClick:ee,children:[a.jsx(nh,{d:Ld.back}),"Back"]}),q&&a.jsx("span",{className:"ui-sfc__submit-error",role:"alert",dir:"auto",children:q}),a.jsx("button",{ref:Y,type:"submit",className:"ui-sfc__btn ui-sfc__btn-primary","aria-disabled":!Ro||b||void 0,"data-busy":b||void 0,children:a.jsxs("span",{ref:Z,className:"ui-sfc__btn-inner",children:[b&&a.jsx("span",{className:"ui-sfc__spinner","aria-hidden":"true"}),a.jsx("span",{className:"ui-sfc__btn-label",title:mt,children:mt},mt)]})})]})})]}),a.jsx("span",{className:"ui-sfc__sr","aria-live":"polite",children:P})]})}function Pt({name:e,label:t,hint:n,optional:r,children:i}){const{errors:s,shake:o,report:c}=_.useContext(Td),[l,f]=_.useState(null),[m,x]=_.useState(0),g=_.useId(),y=_.useRef(null),v=s[e]??l??"",k=_.useRef(v);v&&(k.current=v);const C=!!v;_.useEffect(()=>{o&&(s[e]||l)&&ac(y.current)},[o]),_.useEffect(()=>{m&&ac(y.current)},[m]);const d=_.useCallback(u=>{f(u),c(e,u),u&&x(p=>p+1)},[e,c]);return a.jsxs("div",{className:"ui-sfc__field","data-invalid":C||void 0,children:[a.jsxs("label",{className:"ui-sfc__label",htmlFor:g,dir:"auto",children:[a.jsx("span",{className:"ui-sfc__label-text",children:t}),r&&a.jsx("span",{className:"ui-sfc__optional",children:"Optional"})]}),a.jsx("div",{ref:y,className:"ui-sfc__control",children:a.jsx($d.Provider,{value:{id:g,invalid:C,describedBy:C?`${g}-msg`:n?`${g}-hint`:void 0,flag:d},children:i})}),a.jsx("div",{className:"ui-sfc__fold","data-open":C||void 0,children:a.jsx("div",{children:a.jsx("p",{className:"ui-sfc__msg",id:`${g}-msg`,dir:"auto",children:k.current},k.current)})}),n&&a.jsx("div",{className:"ui-sfc__fold","data-open":!C||void 0,children:a.jsx("div",{children:a.jsx("p",{className:"ui-sfc__hint",id:`${g}-hint`,dir:"auto",children:n})})})]})}function en({prefix:e,className:t,...n}){const r=_.useContext($d);return a.jsxs("div",{className:ga("ui-sfc__input",t),"data-invalid":(r==null?void 0:r.invalid)||void 0,children:[e&&a.jsx("span",{className:"ui-sfc__prefix","aria-hidden":"true",title:e,children:e}),a.jsx("input",{id:r==null?void 0:r.id,"aria-invalid":(r==null?void 0:r.invalid)||void 0,"aria-describedby":r==null?void 0:r.describedBy,autoComplete:"off",spellCheck:!1,...n})]})}function rh({value:e,onChange:t,options:n,label:r}){const i=_.useRef(null),s=_.useRef(null);_.useLayoutEffect(()=>{sc(i.current,s.current,'[aria-checked="true"]')}),_.useEffect(()=>{const l=i.current;if(!l)return;const f=new ResizeObserver(()=>sc(l,s.current,'[aria-checked="true"]'));return f.observe(l),()=>f.disconnect()},[]);const o=n.findIndex(l=>l.value===e),c=l=>{var m,x,g;if(!n.length)return;const f=l.key==="ArrowRight"||l.key==="ArrowDown"?1:l.key==="ArrowLeft"||l.key==="ArrowUp"?-1:0;if(f){l.preventDefault();const y=(o+f+n.length)%n.length;t(n[y].value),(x=(m=i.current)==null?void 0:m.querySelector(`[data-index="${y}"]`))==null||x.focus()}else l.key==="Enter"&&(l.preventDefault(),(g=l.currentTarget.closest("form"))==null||g.requestSubmit())};return a.jsxs("div",{ref:i,className:"ui-sfc__choices",role:"radiogroup","aria-label":r,onKeyDown:c,children:[a.jsx("span",{ref:s,className:"ui-sfc__ring","aria-hidden":"true"}),n.map((l,f)=>{const m=f===o;return a.jsxs("button",{type:"button",role:"radio","aria-checked":m,tabIndex:m?0:-1,"data-value":l.value,"data-index":f,className:"ui-sfc__choice",onClick:()=>t(l.value),children:[a.jsxs("span",{className:"ui-sfc__choice-top",children:[a.jsx("span",{className:"ui-sfc__choice-title",dir:"auto",title:dr(l.title),children:l.title}),l.badge&&a.jsx("span",{className:"ui-sfc__badge",title:l.badge,children:l.badge}),a.jsx("span",{className:"ui-sfc__radio","aria-hidden":"true"})]}),l.aside&&a.jsx("span",{className:"ui-sfc__choice-aside",children:l.aside}),l.description&&a.jsx("span",{className:"ui-sfc__choice-desc",dir:"auto",children:l.description})]},`${l.value}#${f}`)})]})}function Pd({title:e,description:t,children:n}){return a.jsxs("div",{className:"ui-sfc__success",children:[a.jsx("span",{className:"ui-sfc__success-check",children:a.jsx(Md,{})}),a.jsx("h2",{className:"ui-sfc__heading",tabIndex:-1,children:e}),t&&a.jsx("p",{className:"ui-sfc__desc",children:t}),n&&a.jsx("div",{className:"ui-sfc__success-actions",children:n})]})}const ih=`
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
`;function Fd({options:e,value:t,defaultValue:n,onChange:r,size:i="md",variant:s="buttons",fullWidth:o=!1,kind:c="radio",disabled:l=!1,"aria-label":f,"aria-labelledby":m,className:x}){const g=_.useMemo(()=>{const z=new Set;return(Array.isArray(e)?e:[]).filter(h=>!h||h.value==null||z.has(String(h.value))?!1:(z.add(String(h.value)),!0))},[e]),y=i==="sm"||i==="lg"?i:"md",v=s==="tray"||s==="underline"?s:"buttons",[k,C]=_.useState(()=>{var z;return n??((z=g.find(h=>!h.disabled))==null?void 0:z.value)}),d=t!==void 0?t:k,u=_.useRef(null),p=_.useRef(null),w=_.useRef(null),I=_.useRef(null),M=_.useRef(d);M.current=d;const j=_.useRef(!1),$=_.useRef(0),D=_.useRef(void 0),B=_.useRef(null),b=()=>{var z;return Array.from(((z=w.current)==null?void 0:z.querySelectorAll(":scope > .ui-segc__opt"))??[])},V=g.findIndex(z=>z.value===d),q=V>=0?V:g.findIndex(z=>!z.disabled),G=z=>{const h=g.find(E=>E.value===z);!h||h.disabled||l||z===M.current||(M.current=z,t===void 0&&C(z),r==null||r(z))},J=()=>{const z=b();if(!z.length||!w.current)return;const h=getComputedStyle(z[0]),E=parseFloat(h.paddingLeft)+parseFloat(h.paddingRight),R=z.map(S=>S.firstElementChild.offsetWidth+E);o?(w.current.style.setProperty("--ui-segc-min",`${Math.max(...R)}px`),z.forEach(S=>S.style.width="")):z.forEach((S,Q)=>S.style.width=`${R[Q]}px`)},ue=z=>{const h=w.current,E=I.current;if(!h||!E)return;const R=h.querySelector(":scope > .ui-segc__opt[data-active]");if(!R||!R.offsetWidth){E.style.opacity="0";return}let S=R.offsetLeft,Q=R.offsetWidth;if(v==="underline"){const U=R.firstElementChild;S+=U.offsetLeft,Q=U.offsetWidth}const re=!E.dataset.ready||!z&&!j.current,N=parseFloat(E.style.left)||0;!re&&S!==N&&(E.dataset.dir=S>N?"right":"left"),re&&(E.style.transition="none"),E.style.opacity="1",E.style.left=`${S}px`,E.style.right=`${h.clientWidth-S-Q}px`,re&&(E.dataset.ready="1",E.offsetWidth,E.style.transition="")},P=()=>{var E;const z=p.current;if(!z)return;const h=z.scrollWidth-z.clientWidth;(E=u.current)==null||E.toggleAttribute("data-overflow",h>1),z.style.setProperty("--ui-segc-fade-l",z.scrollLeft>1?"24px":"0px"),z.style.setProperty("--ui-segc-fade-r",z.scrollLeft<h-1?"24px":"0px")},L=z=>{const h=p.current,E=w.current,R=E==null?void 0:E.querySelector(":scope > .ui-segc__opt[data-active]");if(!h||!E||!R||h.scrollWidth<=h.clientWidth+1)return;const S=E.offsetLeft+R.offsetLeft-(h.clientWidth-R.offsetWidth)/2;h.scrollTo({left:Math.max(0,S),behavior:z?"smooth":"auto"})};_.useLayoutEffect(()=>{const z=w.current,h=p.current;if(!z||!h)return;const E=()=>{J(),ue(!1),P()};E();const R=requestAnimationFrame(()=>{var re;return(re=u.current)==null?void 0:re.setAttribute("data-ready","")});let S=0;const Q=new ResizeObserver(()=>{cancelAnimationFrame(S),S=requestAnimationFrame(E)});return Q.observe(h),Q.observe(z),z.querySelectorAll(".ui-segc__opt, .ui-segc__content").forEach(re=>Q.observe(re)),()=>{Q.disconnect(),cancelAnimationFrame(S),cancelAnimationFrame(R)}},[g.length,o,v,y]),_.useLayoutEffect(()=>{var E;if(D.current===d)return;const z=D.current===void 0;D.current=d,z||(j.current=!0,clearTimeout($.current),$.current=window.setTimeout(()=>j.current=!1,240)),ue(!z),L(!z);const h=w.current;!z&&h&&h.contains(document.activeElement)&&((E=b()[V])==null||E.focus({preventScroll:!0}))},[d]),_.useEffect(()=>()=>clearTimeout($.current),[]);const F=z=>{var re;const h=g.filter(N=>!N.disabled);if(!h.length||l)return;const E=c==="radio"?["ArrowLeft","ArrowUp"]:["ArrowLeft"],R=c==="radio"?["ArrowRight","ArrowDown"]:["ArrowRight"],S=h.findIndex(N=>N.value===M.current);let Q;E.includes(z.key)?Q=h[(S-1+h.length)%h.length]:R.includes(z.key)?Q=h[(S+1)%h.length]:z.key==="Home"?Q=h[0]:z.key==="End"&&(Q=h[h.length-1]),Q&&(z.preventDefault(),G(Q.value),(re=b()[g.indexOf(Q)])==null||re.focus())},H=z=>{let h=-1,E=1/0;return b().forEach((R,S)=>{const Q=R.getBoundingClientRect(),re=z<Q.left?Q.left-z:z>Q.right?z-Q.right:0;re<E&&(E=re,h=S)}),g[h]},Y=()=>{var z;B.current=null,(z=u.current)==null||z.removeAttribute("data-pressed")},Z=z=>{var S;if(l||z.button!==0)return;const h=H(z.clientX);if(!h||h.disabled)return;const E=z.pointerType==="touch",R=!E||h.value===M.current;if(B.current={id:z.pointerId,touch:E,drag:R,x:z.clientX,moved:!1},R&&((S=u.current)==null||S.setAttribute("data-pressed","")),!E){G(h.value);try{z.currentTarget.setPointerCapture(z.pointerId)}catch{}}},le=z=>{const h=B.current;if(!h||h.id!==z.pointerId||!h.moved&&Math.abs(z.clientX-h.x)<(h.touch?8:3)||(h.moved=!0,!h.drag))return;const E=H(z.clientX);E&&!E.disabled&&G(E.value)},ie=z=>{const h=B.current;if(!(!h||h.id!==z.pointerId)){if(h.touch&&!h.moved){const E=H(z.clientX);E&&G(E.value)}Y()}},ne=c==="tabs";return a.jsxs("div",{ref:u,className:["ui-segc",x].filter(Boolean).join(" "),"data-size":y,"data-variant":v,"data-full":o||void 0,"data-disabled":l||void 0,children:[a.jsx("style",{href:"ui-segmented-control-clean",precedence:"default",children:sh}),a.jsx("div",{ref:p,className:"ui-segc__scroller",onScroll:P,children:a.jsxs("div",{ref:w,className:"ui-segc__track",role:ne?"tablist":"radiogroup","aria-label":f,"aria-labelledby":m,"aria-disabled":l||void 0,"aria-orientation":ne?"horizontal":void 0,onKeyDown:F,onPointerDown:Z,onPointerMove:le,onPointerUp:ie,onPointerCancel:Y,onLostPointerCapture:Y,children:[a.jsx("span",{ref:I,className:"ui-segc__pill","aria-hidden":"true"}),g.map((z,h)=>{const E=h===V,R=z.label??(z.icon?null:String(z.value)),S=ah(z.count);return a.jsx("button",{type:"button",className:"ui-segc__opt",role:ne?"tab":"radio","aria-checked":ne?void 0:E,"aria-selected":ne?E:void 0,"aria-controls":ne?z.controls:void 0,"aria-label":z.ariaLabel,"data-active":E||void 0,disabled:z.disabled||l,tabIndex:h===q?0:-1,onClick:()=>G(z.value),children:a.jsxs("span",{className:"ui-segc__content",children:[z.icon&&a.jsx("span",{className:"ui-segc__icon",onErrorCapture:Q=>Q.target.style.visibility="hidden",children:z.icon}),R!=null&&a.jsx("span",{className:"ui-segc__label",dir:"auto",children:R}),S!=null&&S!==""&&a.jsx("span",{className:"ui-segc__count",children:S},String(S)),z.badge!=null&&a.jsx("span",{className:"ui-segc__badge",children:z.badge})]})},String(z.value))})]})})]})}const ah=e=>typeof e=="number"?Number.isFinite(e)?e.toLocaleString("en-US"):null:e,sh=`
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
`;function oh({title:e="Getting started",steps:t,autoPlay:n=!1,interval:r=2200,onChange:i,className:s}){const[o,c]=_.useState(()=>new Set(t.filter(C=>C.done).map(C=>C.id))),[l,f]=_.useState(n),m=_.useRef(new Set(t.map(C=>C.id))),x=t.map(C=>C.id).join("|");_.useEffect(()=>{const C=t.filter(d=>!m.current.has(d.id));C.forEach(d=>m.current.add(d.id)),C.some(d=>d.done)&&c(d=>new Set([...d,...C.filter(u=>u.done).map(u=>u.id)]))},[x]);const g=t.length,y=t.filter(C=>o.has(C.id)).length,v=g?y/g:0,k=C=>{const d=new Set(o);d.has(C)?d.delete(C):d.add(C),c(d),i==null||i(t.map(u=>({...u,done:d.has(u.id)})))};return _.useEffect(()=>{if(!l)return;const C=t.find(u=>!o.has(u.id)),d=window.setTimeout(()=>{C?k(C.id):c(new Set(t.filter(u=>u.done).map(u=>u.id)))},C?r:r*2);return()=>clearTimeout(d)},[l,o]),a.jsxs("div",{className:["ui-progressc",s].filter(Boolean).join(" "),"data-complete":y===g||void 0,onPointerDown:()=>f(!1),onKeyDown:()=>f(!1),children:[a.jsx("style",{href:"ui-progress-tracker-clean",precedence:"default",children:lh}),a.jsxs("div",{className:"ui-progressc__head",children:[a.jsx("h3",{className:"ui-progressc__title",dir:"auto",title:e,children:e}),a.jsxs("span",{className:"ui-progressc__count","aria-hidden":"true",children:[a.jsx("span",{className:"ui-progressc__digit",children:fi.format(y)},y),"/",fi.format(g)]})]}),a.jsx("div",{className:"ui-progressc__bar",role:"progressbar","aria-label":e,"aria-valuemin":0,"aria-valuemax":g,"aria-valuenow":y,"aria-valuetext":`${fi.format(y)} of ${fi.format(g)} done`,children:a.jsx("span",{className:"ui-progressc__fill",style:{transform:`scaleX(${v})`},children:a.jsx("span",{className:"ui-progressc__shine"},y)})}),a.jsx("ul",{className:"ui-progressc__list",children:t.map((C,d)=>{const u=o.has(C.id);return a.jsx("li",{style:{animationDelay:`${180+Math.min(d,12)*90}ms`},children:a.jsxs("button",{type:"button",role:"checkbox","aria-checked":u,className:"ui-progressc__step",onClick:()=>k(C.id),children:[a.jsx("span",{className:"ui-progressc__check","aria-hidden":"true",children:a.jsx("svg",{viewBox:"0 0 24 24",children:a.jsx("path",{d:"M6.5 12.5l3.5 3.5 7.5-8",pathLength:1})})}),a.jsx("span",{className:"ui-progressc__label",title:C.label||void 0,children:a.jsx("span",{dir:"auto",children:C.label||" "})}),C.icon&&a.jsx("span",{className:"ui-progressc__icon","aria-hidden":"true",children:C.icon})]})},C.id)})})]})}const fi=new Intl.NumberFormat("en"),lh=`
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
`,Qa=["No signal","Weak signal","Good signal","Strong signal"],pi=e=>{const t=Math.round(Number(e));return Number.isFinite(t)?Math.min(3,Math.max(0,t)):0},ch=e=>new RegExp("^\\p{Lu}\\p{Ll}","u").test(e)?e.charAt(0).toLowerCase()+e.slice(1):e;function uh({title:e="Smart recommendation",options:t,onAccept:n,onUndo:r,defaultOpen:i=!0,className:s}){const[o,c]=_.useState(0),[l,f]=_.useState(null),[m,x]=_.useState(i),[g,y]=_.useState(!1),v=_.useRef(null),[k,C]=_.useState(!1);_.useLayoutEffect(()=>{const j=v.current,$=j==null?void 0:j.querySelector(".ui-src__menu"),D=j==null?void 0:j.closest(".ui-src");if(!g||!j||!$||!D||getComputedStyle(j).position==="static")return C(!1);C(j.getBoundingClientRect().right-$.offsetWidth<D.getBoundingClientRect().left-24)},[g]),_.useEffect(()=>{if(!g)return;const j=D=>{var B;return!((B=v.current)!=null&&B.contains(D.target))&&y(!1)},$=D=>D.key==="Escape"&&y(!1);return window.addEventListener("pointerdown",j),window.addEventListener("keydown",$),()=>{window.removeEventListener("pointerdown",j),window.removeEventListener("keydown",$)}},[g]);const d=o<t.length?o:0,u=t[d];if(!u)return null;const p=d===0,w=l===d,I=pi(u.signal),M=`Accept ${ch(String(u.label))}`;return a.jsxs(a.Fragment,{children:[a.jsx("style",{href:"ui-smart-recommendation-clean",precedence:"default",children:fh}),a.jsxs("section",{className:["ui-src",s].filter(Boolean).join(" "),"aria-label":e,"data-accepted":w||void 0,children:[a.jsxs("button",{type:"button",className:"ui-src__head","aria-expanded":m,onClick:()=>x(j=>!j),children:[a.jsx(dh,{}),a.jsx("span",{className:"ui-src__title",dir:"auto",title:e,children:e}),!p&&a.jsx("span",{className:"ui-src__pill",children:"Alternative"}),a.jsx("span",{className:"ui-src__chevron",children:a.jsx(hi,{d:"m4.5 6.25 3.5 3.5 3.5-3.5"})})]}),a.jsx("div",{className:"ui-src__body","data-open":m||void 0,inert:!m,children:a.jsx("p",{className:"ui-src__reason",dir:"auto",children:u.reason},d)}),a.jsxs("footer",{className:"ui-src__foot",children:[a.jsxs("span",{className:"ui-src__signal","data-level":I,title:Qa[I],children:[a.jsx("span",{className:"ui-src__bars","aria-hidden":"true",children:[1,2,3].map(j=>a.jsx("span",{"data-on":I>=j||void 0},j))}),Qa[I]]}),a.jsxs("div",{className:"ui-src__actions",children:[t.length>1&&!w&&a.jsxs("div",{className:"ui-src__alt",ref:v,children:[a.jsxs("button",{type:"button",className:"ui-src__btn ui-src__btn--icon","aria-haspopup":"menu","aria-expanded":g,onClick:()=>y(j=>!j),children:[a.jsx(hi,{d:"M5 12.5v-9M2.75 5.75 5 3.5l2.25 2.25M11 3.5v9M8.75 10.25 11 12.5l2.25-2.25"}),"Alternatives"]}),g&&a.jsx("div",{className:"ui-src__menu",role:"menu","data-flip":k||void 0,children:t.map((j,$)=>a.jsxs("button",{type:"button",role:"menuitemradio","aria-checked":$===d,className:"ui-src__option",onClick:()=>{c($),y(!1),x(!0)},children:[a.jsxs("span",{className:"ui-src__option-label",children:[a.jsx("span",{className:"ui-src__option-name",dir:"auto",title:j.label,children:j.label}),$===0&&a.jsx("span",{className:"ui-src__tag",children:"Recommended"})]}),a.jsx("span",{className:"ui-src__mini","data-level":pi(j.signal),"aria-label":Qa[pi(j.signal)],children:[1,2,3].map(D=>a.jsx("span",{"data-on":pi(j.signal)>=D||void 0},D))})]},`${j.id}-${$}`))})]}),w?a.jsxs(a.Fragment,{children:[a.jsxs("span",{className:"ui-src__done",role:"status",children:[a.jsx(hi,{d:"m3.5 8.5 3 3 6-7"}),a.jsxs("span",{className:"ui-src__done-text",title:`${u.label} accepted`,children:[a.jsx("bdi",{children:u.label})," accepted"]})]}),a.jsxs("button",{type:"button",className:"ui-src__btn ui-src__btn--icon",onClick:()=>{f(null),r==null||r(u)},children:[a.jsx(hi,{d:"M3.5 6.5h6.25a2.75 2.75 0 0 1 0 5.5H8M5.75 4.25 3.5 6.5l2.25 2.25"}),"Undo"]})]}):a.jsx("button",{type:"button",className:"ui-src__btn ui-src__btn--primary",title:M,onClick:()=>{f(d),y(!1),n==null||n(u)},children:a.jsx("span",{className:"ui-src__btn-text",children:M})})]})]})]})]})}const dh=()=>a.jsxs("svg",{viewBox:"0 0 16 16",className:"ui-src__mark","aria-hidden":"true",children:[a.jsx("path",{d:"M6.5 2.2c.2 0 .36.14.4.33.53 2.6 1.4 3.48 4 4.02a.4.4 0 0 1 0 .79c-2.6.53-3.47 1.4-4 4a.4.4 0 0 1-.8 0c-.53-2.6-1.4-3.47-4-4a.4.4 0 0 1 0-.79c2.6-.54 3.47-1.42 4-4.02a.4.4 0 0 1 .4-.33Z"}),a.jsx("path",{d:"M12 9.6c.12 0 .22.08.25.2.28 1.3.72 1.75 2.03 2.03a.25.25 0 0 1 0 .49c-1.31.28-1.75.72-2.03 2.03a.25.25 0 0 1-.5 0c-.28-1.31-.72-1.75-2.03-2.03a.25.25 0 0 1 0-.49c1.31-.28 1.75-.73 2.03-2.03a.25.25 0 0 1 .25-.2Z"})]}),hi=({d:e})=>a.jsx("svg",{viewBox:"0 0 16 16",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"1.1",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:a.jsx("path",{d:e})}),fh=`
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
`,oc=new Intl.NumberFormat("en");function ph({title:e="Setup guide",groups:t,onEdit:n,onClose:r,onChange:i,className:s}){const[o,c]=_.useState(()=>new Set(t.flatMap(d=>d.tasks.filter(u=>u.done).map(u=>u.id)))),l=t.find(d=>d.tasks.some(u=>!o.has(u.id))),[f,m]=_.useState((l==null?void 0:l.id)??null),[x,g]=_.useState(!1),y=t.reduce((d,u)=>d+u.tasks.length,0),v=t.reduce((d,u)=>d+u.tasks.filter(p=>o.has(p.id)).length,0),k=y?Math.min(1,v/y):0,C=(d,u)=>{const p=new Set(o);if(p.has(u)?p.delete(u):p.add(u),c(p),i==null||i([...p]),d.tasks.every(w=>p.has(w.id))){const w=t.find(I=>I.tasks.some(M=>!p.has(M.id)));window.setTimeout(()=>m((w==null?void 0:w.id)??null),420)}};return a.jsxs(a.Fragment,{children:[a.jsx("style",{href:"ui-setup-guide-clean",precedence:"default",children:wh}),a.jsxs("section",{className:["ui-sgc",s].filter(Boolean).join(" "),"aria-label":e,children:[a.jsxs("header",{className:"ui-sgc__head",children:[a.jsx("h3",{className:"ui-sgc__title",title:e,dir:"auto",children:e}),a.jsxs("div",{className:"ui-sgc__actions",children:[n&&a.jsx("button",{type:"button",className:"ui-sgc__edit",onClick:n,children:"Edit"}),a.jsx("button",{type:"button",className:"ui-sgc__icon-btn","aria-label":x?"Expand setup guide":"Minimize setup guide","aria-expanded":!x,onClick:()=>g(d=>!d),children:x?a.jsx(mh,{}):a.jsx(gh,{})}),r&&a.jsx("button",{type:"button",className:"ui-sgc__icon-btn","aria-label":"Close setup guide",onClick:r,children:a.jsx(xh,{})})]})]}),a.jsxs("div",{className:"ui-sgc__progress",children:[a.jsx("span",{className:"ui-sgc__track",role:"progressbar","aria-label":`${e} progress`,"aria-valuemin":0,"aria-valuemax":100,"aria-valuenow":Math.round(k*100),children:a.jsx("span",{className:"ui-sgc__fill",style:{transform:`scaleX(${k})`}})}),a.jsxs("span",{className:"ui-sgc__count","aria-hidden":"true",children:[oc.format(v),"/",oc.format(y)]})]}),a.jsx("div",{className:"ui-sgc__body","data-hidden":x||void 0,children:a.jsx("div",{className:"ui-sgc__groups",children:t.map((d,u)=>{var $;const p=f===d.id,w=d.tasks.every(D=>o.has(D.id)),I=($=d.tasks.find(D=>!o.has(D.id)))==null?void 0:$.id,M=d.tasks.findIndex(D=>D.id===I),j=`ui-sgc-${d.id}`;return a.jsxs("div",{className:"ui-sgc__group","data-open":p||void 0,children:[a.jsxs("button",{type:"button",className:"ui-sgc__group-head","aria-expanded":p,"aria-controls":j,onClick:()=>m(p?null:d.id),children:[a.jsx("span",{className:"ui-sgc__group-title","data-done":w||void 0,dir:"auto",children:d.title}),a.jsx(hh,{})]}),a.jsx("div",{className:"ui-sgc__panel",id:j,inert:!p,children:a.jsx("ul",{className:"ui-sgc__tasks",children:d.tasks.map((D,B)=>{const b=o.has(D.id),V=!b&&M!==-1&&B>M,q=b?"done":V?"locked":"current";return a.jsx("li",{children:a.jsxs("button",{type:"button",className:"ui-sgc__task","data-state":q,disabled:V,"aria-pressed":b,onClick:()=>C(d,D.id),children:[a.jsx("span",{className:"ui-sgc__mark","aria-hidden":"true",children:q==="done"?a.jsx(vh,{}):q==="locked"?a.jsx(_h,{}):null}),a.jsx("span",{className:"ui-sgc__task-label",dir:"auto",children:D.label})]})},`${B}-${D.id}`)})})})]},`${u}-${d.id}`)})})})]})]})}const hh=()=>a.jsx("svg",{className:"ui-sgc__chevron",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.3",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:a.jsx("path",{d:"m4.5 6.25 3.5 3.5 3.5-3.5"})}),gh=()=>a.jsx("svg",{viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:a.jsx("path",{d:"M9.5 2.5v4h4M9.5 6.5l4.5-4.5M6.5 13.5v-4h-4M6.5 9.5 2 14"})}),mh=()=>a.jsx("svg",{viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:a.jsx("path",{d:"M10 2h4v4M14 2 9.5 6.5M6 14H2v-4M2 14l4.5-4.5"})}),xh=()=>a.jsx("svg",{viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round","aria-hidden":"true",children:a.jsx("path",{d:"m4 4 8 8M12 4l-8 8"})}),vh=()=>a.jsxs("svg",{viewBox:"0 0 16 16","aria-hidden":"true",children:[a.jsx("circle",{cx:"8",cy:"8",r:"7",fill:"currentColor"}),a.jsx("path",{d:"m5.2 8.2 1.9 1.9 3.7-3.9",fill:"none",stroke:"var(--ui-sgc-on-accent)",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round"})]}),_h=()=>a.jsx("svg",{viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.1","aria-hidden":"true",children:a.jsx("circle",{cx:"8",cy:"8",r:"6.5",strokeDasharray:"2 2"})}),wh=`
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
`,yh=`
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
`,kh=()=>a.jsx("svg",{width:"11",height:"11",viewBox:"0 0 12 12",children:a.jsx("path",{d:"M2.5 6.3 4.9 8.6 9.5 3.6",fill:"none",stroke:"#0a83f7",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})}),bh=()=>a.jsxs("svg",{className:"tc-spin",viewBox:"0 0 20 20",children:[a.jsx("circle",{cx:"10",cy:"10",r:"8.25",fill:"none",stroke:"#e4eefc",strokeWidth:"1.5"}),a.jsx("path",{d:"M10 1.75a8.25 8.25 0 0 1 8.25 8.25",fill:"none",stroke:"#0a83f7",strokeWidth:"1.5",strokeLinecap:"round"})]});function jh({title:e,agent:t,rows:n}){const r=n.filter(o=>o.state==="done").length,i=o=>{var c,l;return 40+(((c=o.subs)==null?void 0:c.length)??0)*30+((l=o.subs)!=null&&l.length?6:0)+(o.open?o.openH??74:0)};let s=0;return a.jsxs("div",{className:"tc",children:[a.jsx("style",{children:yh}),a.jsxs("div",{className:"tc-head",children:[a.jsx("span",{className:"tc-title",children:e}),a.jsx("span",{className:"tc-chip",children:t}),a.jsxs("span",{className:"tc-count",children:[r,"/",n.length]})]}),a.jsx("div",{style:{position:"relative"},children:n.map((o,c)=>{var m,x,g,y;const l=s;s+=i(o);const f=n[c+1];return a.jsxs("div",{"data-s":o.state,children:[f&&!((m=o.subs)!=null&&m.length)&&a.jsx("div",{className:"tc-line",style:{top:l+30,height:i(o)-20},children:a.jsx("i",{style:{height:o.state==="done"?"100%":0}})}),f&&!!((x=o.subs)!=null&&x.length)&&(()=>{const v=o.subs.length,k=l+30,C=l+40+3+15-10,d=l+40+3+(v-1)*30+15+10,u=l+i(o)+10;return a.jsx("svg",{style:{position:"absolute",left:0,top:0,overflow:"visible",pointerEvents:"none"},width:"1",height:"1",children:a.jsx("path",{d:`M11 ${k} V${C-8} C11 ${C}, 23 ${C-2}, 23 ${C+6} V${d-6} C23 ${d+2}, 11 ${d}, 11 ${d+8} V${u}`,fill:"none",stroke:"#e3e3e3",strokeWidth:"1.5"})})})(),a.jsxs("div",{className:"tc-row","data-s":o.state,children:[a.jsx("span",{className:"tc-mark","data-s":o.state==="active"?"active":o.state,children:o.state==="done"?a.jsx(kh,{}):o.state==="active"?a.jsx(bh,{}):null}),a.jsx("span",{className:"tc-logo",children:o.logo}),a.jsx("span",{className:"tc-label",children:o.label}),a.jsxs("span",{className:"tc-right",children:[o.state==="active"&&a.jsx("span",{className:"tc-verb",children:o.verb}),o.state==="gate"&&a.jsx("span",{className:"tc-gate",children:o.gateLabel??"Approval"}),o.state==="waiting"&&a.jsxs("span",{className:"tc-gate","data-live":"",children:["Needs you ",a.jsx("svg",{width:"10",height:"10",viewBox:"0 0 10 10",children:a.jsx("path",{d:"m2.5 4 2.5 2.5L7.5 4",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round"})})]}),(o.state==="active"||o.state==="done")&&a.jsx("span",{className:"tc-secs",children:o.count??a.jsxs(a.Fragment,{children:[o.secs??"",o.secs!==void 0?"s":""]})})]})]}),a.jsx("div",{className:"tc-subs",style:{height:(g=o.subs)!=null&&g.length?o.subs.length*30+6:0},children:(y=o.subs)==null?void 0:y.map((v,k)=>a.jsxs("div",{className:"tc-sub","data-s":v.state,children:[a.jsx("b",{}),a.jsx("span",{children:v.label}),a.jsx("span",{children:v.meta})]},k))}),a.jsx("div",{className:"tc-open",style:{height:o.open?o.openH??74:0},children:o.open})]},c)})})]})}const zh=()=>a.jsx("svg",{viewBox:"0 0 1200 1200","aria-hidden":"true",children:a.jsx("path",{fill:"#D97757",d:"M 233.959793 800.214905 L 468.644287 668.536987 L 472.590637 657.100647 L 468.644287 650.738403 L 457.208069 650.738403 L 417.986633 648.322144 L 283.892639 644.69812 L 167.597321 639.865845 L 54.926208 633.825623 L 26.577238 627.785339 L 3.3e-05 592.751709 L 2.73832 575.27533 L 26.577238 559.248352 L 60.724873 562.228149 L 136.187973 567.382629 L 249.422867 575.194763 L 331.570496 580.026978 L 453.261841 592.671082 L 472.590637 592.671082 L 475.328857 584.859009 L 468.724915 580.026978 L 463.570557 575.194763 L 346.389313 495.785217 L 219.543671 411.865906 L 153.100723 363.543762 L 117.181267 339.060425 L 99.060455 316.107361 L 91.248367 266.01355 L 123.865784 230.093994 L 167.677887 233.073853 L 178.872513 236.053772 L 223.248367 270.201477 L 318.040283 343.570496 L 441.825592 434.738342 L 459.946411 449.798706 L 467.194672 444.64447 L 468.080597 441.020203 L 459.946411 427.409485 L 392.617493 305.718323 L 320.778564 181.932983 L 288.80542 130.630859 L 280.348999 99.865845 C 277.369171 87.221436 275.194641 76.590698 275.194641 63.624268 L 312.322174 13.20813 L 332.8591 6.604126 L 382.389313 13.20813 L 403.248352 31.328979 L 434.013519 101.71814 L 483.865753 212.537048 L 561.181274 363.221497 L 583.812134 407.919434 L 595.892639 449.315491 L 600.40271 461.959839 L 608.214783 461.959839 L 608.214783 454.711609 L 614.577271 369.825623 L 626.335632 265.61084 L 637.771851 131.516846 L 641.718201 93.745117 L 660.402832 48.483276 L 697.530334 24.000122 L 726.52356 37.852417 L 750.362549 72 L 747.060486 94.067139 L 732.886047 186.201416 L 705.100708 330.52356 L 686.979919 427.167847 L 697.530334 427.167847 L 709.61084 415.087341 L 758.496704 350.174561 L 840.644348 247.490051 L 876.885925 206.738342 L 919.167847 161.71814 L 946.308838 140.29541 L 997.61084 140.29541 L 1035.38269 196.429626 L 1018.469849 254.416199 L 965.637634 321.422852 L 921.825562 378.201538 L 859.006714 462.765259 L 819.785278 530.41626 L 823.409424 535.812073 L 832.75177 534.92627 L 974.657776 504.724915 L 1051.328979 490.872559 L 1142.818848 475.167786 L 1184.214844 494.496582 L 1188.724854 514.147644 L 1172.456421 554.335693 L 1074.604126 578.496765 L 959.838989 601.449829 L 788.939636 641.879272 L 786.845764 643.409485 L 789.261841 646.389343 L 866.255127 653.637634 L 899.194702 655.409424 L 979.812134 655.409424 L 1129.932861 666.604187 L 1169.154419 692.537109 L 1192.671265 724.268677 L 1188.724854 748.429688 L 1128.322144 779.194641 L 1046.818848 759.865845 L 856.590759 714.604126 L 791.355774 698.335754 L 782.335693 698.335754 L 782.335693 703.731567 L 836.69812 756.885986 L 936.322205 846.845581 L 1061.073975 962.81897 L 1067.436279 991.490112 L 1051.409424 1014.120911 L 1034.496704 1011.704712 L 924.885986 929.234924 L 882.604126 892.107544 L 786.845764 811.48999 L 780.483276 811.48999 L 780.483276 819.946289 L 802.550415 852.241699 L 919.087341 1027.409424 L 925.127625 1081.127686 L 916.671204 1098.604126 L 886.469849 1109.154419 L 853.288696 1103.114136 L 785.073914 1007.355835 L 714.684631 899.516785 L 657.906067 802.872498 L 650.979858 806.81897 L 617.476624 1167.704834 L 601.771851 1186.147705 L 565.530212 1200 L 535.328857 1177.046997 L 519.302124 1139.919556 L 535.328857 1066.550537 L 554.657776 970.792053 L 570.362488 894.68457 L 584.536926 800.134277 L 592.993347 768.724976 L 592.429626 766.630859 L 585.503479 767.516968 L 514.22821 865.369263 L 405.825531 1011.865906 L 320.053711 1103.677979 L 299.516815 1111.812256 L 263.919525 1093.369263 L 267.221497 1060.429688 L 287.114136 1031.114136 L 405.825531 880.107361 L 477.422913 786.52356 L 523.651062 732.483276 L 523.328918 724.671265 L 520.590698 724.671265 L 205.288605 929.395935 L 149.154434 936.644409 L 124.993355 914.01355 L 127.973183 876.885986 L 139.409409 864.80542 L 234.201385 799.570435 L 233.879227 799.8927 Z"})}),Ch=()=>a.jsx("svg",{viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true",style:{color:"#191919"},children:a.jsx("path",{d:"M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"})}),Sh=()=>a.jsxs("svg",{viewBox:"0 0 38 57","aria-hidden":"true",children:[a.jsx("path",{d:"M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0Z",fill:"#1ABCFE"}),a.jsx("path",{d:"M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0Z",fill:"#0ACF83"}),a.jsx("path",{d:"M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19Z",fill:"#FF7262"}),a.jsx("path",{d:"M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5Z",fill:"#F24E1E"}),a.jsx("path",{d:"M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5Z",fill:"#A259FF"})]}),Nh=()=>{const e=`ui-pp-gm-${_.useId().replace(/:/g,"")}`;return a.jsxs("svg",{width:"16",height:"16",viewBox:"0 -5.77 56.4108 56.4108",fill:"none","aria-hidden":"true",children:[a.jsx("path",{d:"M44.2255 5.76727H56.4051V41.0239C56.4051 43.148 54.683 44.8701 52.5589 44.8701H46.1486C45.8961 44.8701 45.646 44.8204 45.4127 44.7237C45.1794 44.6271 44.9674 44.4854 44.7888 44.3069C44.6102 44.1283 44.4686 43.9163 44.3719 43.683C44.2753 43.4497 44.2255 43.1996 44.2255 42.947V5.76727Z",fill:`url(#${e}-0)`}),a.jsx("path",{d:"M12.1796 5.76727H0V41.0239C0 43.148 1.72213 44.8701 3.84618 44.8701H10.2565C10.509 44.8701 10.7591 44.8204 10.9924 44.7237C11.2257 44.6271 11.4377 44.4854 11.6163 44.3069C11.7949 44.1283 11.9365 43.9163 12.0332 43.683C12.1298 43.4497 12.1796 43.1996 12.1796 42.947V5.76727Z",fill:"#FC413D"}),a.jsx("path",{d:"M10.0085 1.42778C7.43377 -0.736342 3.5924 -0.403647 1.42828 2.17105C-0.735843 4.74543 -0.403148 8.58681 2.17155 10.7512L26.5557 31.2479C27.0178 31.6362 27.602 31.8492 28.2056 31.8492C28.8091 31.8492 29.3934 31.6362 29.8554 31.2479L54.2396 10.7509C56.814 8.58681 57.1467 4.74543 54.9825 2.17073C52.8184 -0.403648 48.977 -0.736342 46.4027 1.42778L28.2054 16.724L10.0085 1.42778Z",fill:`url(#${e}-1)`}),a.jsxs("defs",{children:[a.jsxs("linearGradient",{id:`${e}-0`,x1:"50.3153",y1:"5.76727",x2:"50.3153",y2:"44.8701",gradientUnits:"userSpaceOnUse",children:[a.jsx("stop",{stopColor:"#60D673"}),a.jsx("stop",{offset:"0.17",stopColor:"#42C868"}),a.jsx("stop",{offset:"0.39",stopColor:"#0EBC5F"}),a.jsx("stop",{offset:"0.62",stopColor:"#00A9BB"}),a.jsx("stop",{offset:"0.86",stopColor:"#3C90FF"}),a.jsx("stop",{offset:"1",stopColor:"#3186FF"})]}),a.jsxs("linearGradient",{id:`${e}-1`,x1:"6.04194e-05",y1:"6.45153",x2:"56.4107",y2:"6.45153",gradientUnits:"userSpaceOnUse",children:[a.jsx("stop",{offset:"0.08",stopColor:"#FF63A0"}),a.jsx("stop",{offset:"0.3",stopColor:"#FC413D"}),a.jsx("stop",{offset:"0.5",stopColor:"#FC413D"}),a.jsx("stop",{offset:"0.65",stopColor:"#FC413D"}),a.jsx("stop",{offset:"0.72",stopColor:"#FC5C30"}),a.jsx("stop",{offset:"0.86",stopColor:"#FEB10C"}),a.jsx("stop",{offset:"0.91",stopColor:"#FEC700"}),a.jsx("stop",{offset:"0.96",stopColor:"#FFDB0F"})]})]})]})},Eh=()=>a.jsxs("svg",{width:"15",height:"15",viewBox:"0 0 49.883 49.877",fill:"none","aria-hidden":"true",children:[a.jsx("path",{d:"M18.3549 10.4784C15.4713 10.4784 13.1157 8.12279 13.1157 5.2392C13.1157 2.35561 15.4713 0 18.3549 0C21.2385 0 23.5941 2.35561 23.5941 5.2392V10.4784H18.3549Z",fill:"#36C5F0"}),a.jsx("path",{d:"M18.3575 13.12C21.2411 13.12 23.5967 15.4756 23.5967 18.3592C23.5967 21.2428 21.2411 23.5984 18.3575 23.5984H5.2392C2.35561 23.5984 0 21.2428 0 18.3592C0 15.4756 2.35561 13.12 5.2392 13.12H18.3575Z",fill:"#36C5F0"}),a.jsxs("g",{transform:"translate(26.28 0)",children:[a.jsx("path",{d:"M13.1244 18.3592C13.1244 15.4756 15.48 13.12 18.3636 13.12C21.2472 13.12 23.6028 15.4756 23.6028 18.3592C23.6028 21.2428 21.2472 23.5984 18.3636 23.5984H13.1244V18.3592Z",fill:"#2EB67D"}),a.jsx("path",{d:"M10.4785 18.3575C10.4785 21.2411 8.12286 23.5967 5.23927 23.5967C2.35568 23.5967 7.4362e-05 21.2411 7.4362e-05 18.3575V5.2392C7.4362e-05 2.35561 2.35568 0 5.23927 0C8.12286 0 10.4785 2.35561 10.4785 5.2392V18.3575Z",fill:"#2EB67D"})]}),a.jsxs("g",{transform:"translate(0 26.28)",children:[a.jsx("path",{d:"M10.4784 5.2392C10.4784 8.12279 8.12279 10.4784 5.2392 10.4784C2.35561 10.4784 0 8.12279 0 5.2392C0 2.35561 2.35561 0 5.2392 0H10.4784V5.2392Z",fill:"#E01E5A"}),a.jsx("path",{d:"M13.1157 5.2392C13.1157 2.35561 15.4713 0 18.3549 0C21.2385 0 23.5941 2.35561 23.5941 5.2392V18.3575C23.5941 21.2411 21.2385 23.5967 18.3549 23.5967C15.4713 23.5967 13.1157 21.2411 13.1157 18.3575V5.2392Z",fill:"#E01E5A"})]}),a.jsxs("g",{transform:"translate(26.28 26.28)",children:[a.jsx("path",{d:"M5.23927 13.1157C8.12286 13.1157 10.4785 15.4713 10.4785 18.3549C10.4785 21.2385 8.12286 23.5941 5.23927 23.5941C2.35568 23.5941 7.4362e-05 21.2385 7.4362e-05 18.3549V13.1157H5.23927Z",fill:"#ECB22E"}),a.jsx("path",{d:"M5.23927 10.4784C2.35568 10.4784 7.4362e-05 8.12279 7.4362e-05 5.2392C7.4362e-05 2.35561 2.35568 0 5.23927 0H18.3576C21.2412 0 23.5968 2.35561 23.5968 5.2392C23.5968 8.12279 21.2412 10.4784 18.3576 10.4784H5.23927Z",fill:"#ECB22E"})]})]}),ln={claude:()=>a.jsx(zh,{}),notion:()=>a.jsx(Ch,{}),figma:()=>a.jsx(Sh,{}),gmail:()=>a.jsx(Nh,{}),slack:()=>a.jsx(Eh,{})};function lc({className:e}){return a.jsx("svg",{role:"img","aria-label":"Atla",viewBox:"0 0 129 53",xmlns:"http://www.w3.org/2000/svg",className:e,children:a.jsx("path",{d:"M34.9852 43.0974C34.9852 46.1658 34.1489 47.7697 32.546 47.7697C31.1522 47.7697 30.3856 46.5842 30.3856 44.4224V26.5697C30.3856 19.8053 26.901 16.5974 19.3743 16.5974C14.7147 16.5974 11.1834 17.8045 8.50587 20.3632H8.25986L8.85154 16.0395H2.78767V27.7553H7.24793C8.99023 23.5013 11.6385 21.4789 15.4019 21.4789C18.9561 21.4789 20.6287 23.2921 20.6287 26.9882V32.6368H18.7471C4.52996 32.6368 0 35.1474 0 42.8184C0 49.3737 3.3452 53 9.26899 53C14.0031 53 18.6843 50.7252 21.2413 47.2816H21.6623C23.914 51.2901 26.5504 53 30.4553 53C35.8912 53 39.1667 49.6526 39.1667 44.0737V38.6342H34.9852V43.0974ZM14.8443 46.8632C11.5688 46.8632 9.89622 44.8408 9.89622 40.9355C9.89622 36.1237 12.4051 36.5421 17.4229 36.5421H20.6287V39.8197C20.6287 44.2829 18.538 46.8632 14.8443 46.8632ZM61.259 35.8447H65.4405V42.3303C65.4405 48.8855 61.1893 53 54.4989 53C48.157 53 44.2542 49.3039 44.2542 43.5158V21.8974H39.1667V18.2711C46.0662 15.2724 49.6902 10.8092 50.8052 3.48684H54.0111V17.4342H63.7679V21.8974H54.0111V43.4461C54.0111 45.8171 54.8474 46.7934 56.8684 46.7934C59.6561 46.7934 61.259 44.8408 61.259 41.3539V35.8447ZM85.0935 48.1184H86.7661V52.3026H68.6463V48.1184H70.3189C72.2703 48.1184 72.8278 47.2118 72.8278 43.9342V5.43947H68.6463V0.976316C74.8489 0.976316 78.1244 0.767105 82.1665 0L82.5846 0.278947V43.9342C82.5846 47.2118 83.1422 48.1184 85.0935 48.1184ZM124.818 38.6342V43.0974C124.818 46.1658 123.981 47.7697 122.379 47.7697C120.985 47.7697 120.218 46.5842 120.218 44.4224V26.5697C120.218 19.8053 116.734 16.5974 109.207 16.5974C104.547 16.5974 101.016 17.8045 98.3384 20.3632H98.0924L98.6841 16.0395H92.6209V27.7553H97.0812C98.8235 23.5013 101.472 21.4789 105.235 21.4789C108.789 21.4789 110.462 23.2921 110.462 26.9882V32.6368H108.58C94.3632 32.6368 89.8333 35.1474 89.8333 42.8184C89.8333 49.3737 93.1785 53 99.1023 53C103.836 53 108.518 50.7252 111.075 47.2816H111.496C113.747 51.2901 116.384 53 120.289 53C125.724 53 129 49.6526 129 44.0737V38.6342H124.818ZM104.677 46.8632C101.401 46.8632 99.7288 44.8408 99.7288 40.9355C99.7288 36.1237 102.238 36.5421 107.255 36.5421H110.461V39.8197C110.461 44.2829 108.371 46.8632 104.677 46.8632Z",fill:"currentColor"})})}function Lh({className:e}){return a.jsx("svg",{role:"img","aria-label":"Atla",viewBox:"0 0 290.795 504",xmlns:"http://www.w3.org/2000/svg",className:e,children:a.jsxs("g",{fill:"currentColor",children:[a.jsx("path",{d:"M248.147 42.6314C221.816 16.2998 185.468 0 145.389 0C105.31 0 68.963 16.2998 42.6314 42.6314C16.2998 68.963 0 105.31 0 145.389C0 185.468 16.2998 221.816 42.6314 248.147C58.1072 263.623 77.0402 275.626 98.1701 282.895V265.675C75.4247 256.709 55.8133 241.492 41.4844 222.123H249.31C234.981 241.492 215.354 256.709 192.625 265.675V282.895C213.755 275.626 232.687 263.623 248.163 248.147C274.495 221.816 290.795 185.468 290.795 145.389C290.795 105.31 274.495 68.963 248.163 42.6314H248.147ZM31.2749 205.968C22.8261 190.137 17.6083 172.335 16.429 153.466H45.6199C52.0655 153.466 57.978 155.841 62.5335 159.815C67.0729 163.773 70.2392 169.33 71.2084 175.679C72.7916 186.066 75.1824 196.211 78.3648 205.968H31.2749ZM71.2084 115.1C70.2392 121.449 67.0729 127.006 62.5335 130.963C57.978 134.937 52.0655 137.312 45.6199 137.312H16.429C17.5921 118.444 22.8261 100.642 31.2749 84.8104H78.3648C75.1986 94.5676 72.7916 104.713 71.2084 115.1ZM84.4712 68.656H41.4844C59.9327 43.746 87.1043 25.6693 118.46 18.9975C105.617 31.4364 94.8423 46.5569 86.7005 63.7613C85.9412 65.3767 85.1981 67.0083 84.4873 68.6399L84.4712 68.656ZM137.312 205.968H95.5369C92.8391 198.569 90.6421 190.864 88.9621 182.932C87.3628 175.339 89.4629 167.973 93.9053 162.513C98.3478 157.053 105.133 153.483 112.887 153.483C119.639 153.483 125.746 156.213 130.156 160.639C134.582 165.065 137.312 171.172 137.312 177.908V205.984V205.968ZM137.312 112.887C137.312 119.639 134.582 125.746 130.156 130.156C125.729 134.582 119.623 137.312 112.887 137.312C105.133 137.312 98.3478 133.742 93.9053 128.282C89.4629 122.822 87.3628 115.455 88.9621 107.863C90.6421 99.9147 92.8391 92.2091 95.5369 84.8104H137.328V112.887H137.312ZM137.312 68.656H102.419C111.174 50.9509 122.999 35.6365 137.312 23.8438V68.656ZM153.466 23.8438C167.779 35.6365 179.604 50.9509 188.36 68.656H153.466V23.8438ZM201.816 182.932C200.136 190.88 197.939 198.569 195.242 205.968H153.466V177.892C153.466 171.139 156.197 165.033 160.623 160.623C165.049 156.197 171.155 153.466 177.892 153.466C185.646 153.466 192.431 157.037 196.873 162.497C201.316 167.957 203.416 175.323 201.816 182.916V182.932ZM196.873 128.282C192.431 133.742 185.646 137.312 177.892 137.312C171.139 137.312 165.033 134.582 160.623 130.156C156.197 125.729 153.466 119.623 153.466 112.887V84.8104H195.258C197.956 92.2091 200.153 99.9147 201.833 107.863C203.432 115.455 201.332 122.822 196.889 128.282H196.873ZM204.094 63.7774C195.952 46.573 185.177 31.4364 172.335 19.0137C203.69 25.6854 230.862 43.7622 249.31 68.6722H206.324C205.613 67.0245 204.87 65.3929 204.11 63.7936L204.094 63.7774ZM259.504 84.8104C267.952 100.642 273.17 118.444 274.35 137.312H245.159C238.713 137.312 232.801 134.937 228.245 130.963C223.706 127.006 220.539 121.449 219.57 115.1C217.987 104.729 215.596 94.5676 212.414 84.8104H259.504ZM259.504 205.968H212.414C215.58 196.211 217.987 186.066 219.57 175.679C220.539 169.33 223.706 163.773 228.245 159.815C232.801 155.841 238.713 153.466 245.159 153.466H274.35C273.186 172.335 267.952 190.137 259.504 205.968Z"}),a.jsx("path",{d:"M98.1701 322.28L39.6913 317.288L8.15795 246.451C17.9313 242.089 29.4009 246.499 33.7465 256.273L50.547 293.993H98.1862V322.28H98.1701ZM257.032 256.289L240.232 294.009H120.754C115.261 294.009 110.334 296.287 106.813 299.922C103.291 303.573 101.191 308.581 101.385 314.057L103.921 386.606C93.9376 392.115 87.1851 402.728 87.1851 414.909C87.1851 422.824 90.0283 430.062 94.7453 435.683L133.144 481.384H83.098C77.751 481.384 72.9046 483.549 69.383 487.054C65.8775 490.56 63.7128 495.406 63.7128 500.769V504H132.078C140.995 504 149.072 500.381 154.92 494.534C160.768 488.686 164.387 480.608 164.387 471.691C164.387 467.394 163.547 463.275 162.012 459.527L149.557 428.882L171.85 324.04C196.615 321.924 226.323 319.388 251.087 317.288L282.621 246.451C272.847 242.089 261.378 246.499 257.032 256.273V256.289ZM233.851 400.402C239.698 406.234 243.317 414.311 243.317 423.244V494.324H240.086C234.739 494.324 229.893 492.143 226.387 488.637C222.882 485.132 220.701 480.285 220.701 474.938V425.797L160.881 439.124V390.936H211.008C219.942 390.936 228.019 394.554 233.851 400.402ZM168.005 263.316C168.005 257.969 165.841 253.123 162.335 249.601C158.83 246.096 153.983 243.931 148.62 243.931H122.773V289.163H168.005V263.316ZM157.133 266.983C156.407 267.71 155.389 268.162 154.274 268.162C153.16 268.162 152.142 267.71 151.415 266.983C150.688 266.256 150.236 265.239 150.236 264.124C150.236 263.009 150.688 261.991 151.415 261.265C152.142 260.538 153.16 260.085 154.274 260.085C155.389 260.085 156.407 260.538 157.133 261.265C157.86 261.991 158.313 263.009 158.313 264.124C158.313 265.239 157.86 266.256 157.133 266.983Z"})]})})}var gc;(gc=document.documentElement.dataset).theme||(gc.theme="light");const Bs=e=>Math.round(e*1e3);function Rd(e,t=!1){const n=_.useRef(null),[r,i]=_.useState(0),[s,o]=_.useState(!1);return _.useEffect(()=>{const c=n.current;if(!c)return;if(matchMedia("(prefers-reduced-motion: reduce)").matches){o(!0),i(e);return}let l=0,f=!1;const m=()=>{if(f)return;f=!0,x.disconnect(),o(!0);const y=performance.now(),v=k=>{const C=(k-y)/1e3;i(Math.min(e,C)),C<e&&(l=requestAnimationFrame(v))};l=requestAnimationFrame(v)},x=new IntersectionObserver(([y])=>{y.isIntersecting&&m()},{rootMargin:"0px 0px -25% 0px"});x.observe(c);const g=t?window.setTimeout(m,600):0;return()=>{x.disconnect(),cancelAnimationFrame(l),clearTimeout(g)}},[e]),{ref:n,t:r,on:s}}function Ad({children:e,max:t=1}){const n=_.useRef(null),[r,i]=_.useState(1);return _.useEffect(()=>{var c;const s=(c=n.current)==null?void 0:c.parentElement;if(!s)return;const o=new ResizeObserver(()=>i(Math.min(t,s.clientWidth/450)));return o.observe(s),()=>o.disconnect()},[]),a.jsx("div",{ref:n,style:{width:450,zoom:r},children:e})}const Mh=[{id:"pos",site:"positioning.md",title:"What we say no to",date:"Brand rules",quote:"We don't discount. A lower price tells the client the first one was a guess.",highlight:["We don't discount"]},{id:"offer",site:"offer.md",title:"The offer",date:"Brand rules",quote:"One plan, one price. No cheaper tier, no custom bundles.",highlight:["One plan, one price"]},{id:"voice",site:"voice.md",title:"How we write",date:"Brand rules",quote:"Say no plainly. Then offer the next step.",highlight:["Say no plainly","offer the next step"]}],Th=[{text:"Thanks, Sam. We don't discount, so the price stays as quoted.",cite:["pos"]},{text:" There's one plan at one price, so there's no cheaper tier to move you to.",cite:["offer"]},{text:" What I can do: a short call to scope what you actually need.",cite:["voice"]}];function $h({t:e}){const[t,n]=_.useState(!1),r=e<.9?1:e<1.7?2:3;return a.jsxs(a.Fragment,{children:[t&&a.jsx("style",{children:".ui-cac__action{background:#191919!important;color:#fff!important}"}),a.jsx(T0,{sources:Mh,segments:Th.slice(0,r),action:{label:t?"Sent. Discount given: 0.":"Approve and send",onClick:()=>n(!0)}})]})}const Ih=[{id:"c",name:"Color",kind:"palette",logo:ln.figma,from:.3,to:4.3},{id:"v",name:"Voice",kind:"words",logo:ln.claude,from:.5,to:4.6},{id:"t",name:"Type",kind:"type sizes",logo:ln.figma,from:.7,to:4.9}];function Ph({t:e}){const[t,n]=_.useState([]),r=Ih.map(l=>{const f=e<l.from?0:Math.min(12,Math.floor(12*(e-l.from)/(l.to-l.from)));return{id:l.id,name:l.name,avatar:l.logo(),done:f,total:12,step:`Post ${Math.min(12,f+1)}: ${l.kind}`}}),s=[{id:"t",agentId:"t",at:3900,sev:"warning",drift:"Post 9 · a 5th type size, 22px → 20px",fix:"Post 9 · fixed, now 20px"},{id:"v",agentId:"v",at:2700,sev:"warning",drift:"Post 7 · banned word “elevate” → “raise”",fix:"Post 7 · fixed, now “raise”"},{id:"c",agentId:"c",at:1500,sev:"critical",drift:"Post 4 · off-palette blue → #1F4FD8",fix:"Post 4 · fixed, now #1F4FD8"}].filter(l=>e>=l.at/1e3),o=s.map(l=>({id:l.id,agentId:l.agentId,at:l.at,severity:t.includes(l.id)?"note":l.sev,title:t.includes(l.id)?l.fix:l.drift})),c=t.length===3;return a.jsx("div",{onClickCapture:l=>{var g;const f=l.target.closest(".ui-afc__slot");if(!f||!f.parentElement)return;const m=[...f.parentElement.children].indexOf(f),x=(g=s[m])==null?void 0:g.id;x&&!t.includes(x)&&n([...t,x])},children:a.jsx(H0,{title:c?"12 of 12 on brand.":e<4.9?"Checking 12 posts":"3 drifts found",agents:r,findings:o,rows:4,now:Math.max(Bs(e),5e3)})})}const Fh=({c:e})=>a.jsx("svg",{viewBox:"0 0 14 14",children:a.jsx("circle",{cx:"7",cy:"7",r:"6",fill:e})}),Rh=()=>a.jsxs("svg",{viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.3",children:[a.jsx("circle",{cx:"8",cy:"8",r:"6.2"}),a.jsx("path",{d:"M1.8 8h12.4M8 1.8c1.8 1.9 2.6 3.9 2.6 6.2S9.8 12.3 8 14.2C6.2 12.3 5.4 10.3 5.4 8S6.2 3.7 8 1.8z"})]}),Ah=()=>a.jsxs("svg",{viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.3",children:[a.jsx("rect",{x:"1.8",y:"2.6",width:"12.4",height:"8.6",rx:"1.6"}),a.jsx("path",{d:"M8 11.2v2.4M5.4 13.8h5.2",strokeLinecap:"round"})]}),Dh=()=>a.jsxs("svg",{viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.3",children:[a.jsx("rect",{x:"2.2",y:"2.2",width:"11.6",height:"11.6",rx:"2.2"}),a.jsx("path",{d:"M5 10.6l2-2.4 1.6 1.6 2.4-3",strokeLinecap:"round",strokeLinejoin:"round"})]});function Oh({t:e}){const[t,n]=_.useState(!1),r=0,i=[{id:"cva",action:t?"Synced":"Sync",target:"Canva brand kit",system:"Canva",icon:a.jsx("span",{style:{fontWeight:600},children:"C"}),at:r+4200,detail:t?"Brand kit on the new accent":"Waiting for your approval",dependsOn:["tok"]},{id:"fig",action:t?"Synced":"Sync",target:"Figma library",system:"Figma",icon:ln.figma(),at:r+3600,detail:t?"Library on the new accent":"Waiting for your approval",dependsOn:["tok"]},{id:"mail",action:"Updated",target:"Email templates",system:"Gmail",icon:ln.gmail(),at:r+2900,detail:"3 templates, new accent",dependsOn:["tok"]},{id:"ads",action:"Updated",target:"Ads",system:"Ads",icon:a.jsx(Dh,{}),at:r+2300,detail:"5 ads, new accent",dependsOn:["tok"]},{id:"deck",action:"Updated",target:"Sales deck",system:"Deck",icon:a.jsx(Ah,{}),at:r+1700,detail:"6 slides, new accent",dependsOn:["tok"]},{id:"web",action:"Updated",target:"Website",system:"Website",icon:a.jsx(Rh,{}),at:r+1100,detail:"9 pages, new accent",dependsOn:["tok"]},{id:"tok",action:"Changed",target:"Accent color",system:"Tokens",icon:a.jsx(Fh,{c:"#E4572E"}),at:r+400,change:["#2F5BFF","#E4572E"]}];return a.jsxs(a.Fragment,{children:[a.jsx("style",{children:".ui-alc__sum{display:none!important}"+(t?"":".ui-alc__row:nth-child(1) .ui-alc__detail,.ui-alc__row:nth-child(2) .ui-alc__detail{color:#cc4e00}")}),a.jsx(X0,{entries:i.filter(s=>Bs(e)>=s.at),agent:"Claude",title:"Accent color change",now:Math.max(Bs(e),4800)+1e3}),a.jsx("div",{className:"gate",style:{opacity:e>=4.6?1:0,transition:"opacity .4s"},children:t?a.jsx("span",{children:"1 rule changed. 23 pieces updated."}):a.jsxs(a.Fragment,{children:[a.jsx("span",{children:"Figma and Canva wait for your OK."}),a.jsx("button",{type:"button",onClick:()=>n(!0),children:"Approve sync"})]})})]})}function Ya({id:e,n:t,label:n,title:r,text:i,dur:s=1,note:o,desc:c,children:l}){const{ref:f,t:m,on:x}=Rd(s);return a.jsxs("section",{ref:f,id:e,className:"row"+(x?" in":""),children:[a.jsxs("div",{className:"copy",children:[a.jsxs("p",{className:"idx",children:[a.jsx("b",{children:t}),n]}),a.jsx("h2",{className:"title",children:r}),a.jsx("p",{className:"body",children:i})]}),a.jsxs("div",{className:"slot",children:[typeof l=="function"?l(m):l,o&&a.jsx("p",{className:"hero-note",children:o}),c&&a.jsx("p",{className:"sr",children:c})]})]})}const Bh="josepablo@atla.design",gi=1024*1024,Hh=[["logo.svg",.06*gi,"image/svg+xml"],["brand-guidelines.pdf",2.9*gi,"application/pdf"],["colors.ase",.02*gi,"application/octet-stream"],["fonts.zip",1.6*gi,"application/zip"]],cc=()=>a.jsx(Lh,{className:"atla-sym"}),Wh=[{label:"Review your brand",logo:cc,verb:"Reviewing",from:4,to:4.9,took:7},{label:"Write the rules and the voice",logo:cc,verb:"Writing",from:4.9,to:6.5,took:38,subs:[["Colors, type, logo use","visual-system.json"],["Voice and words you never say","voice.md"],["What you sell, what you don't","positioning.md"]]},{label:"Build the visual system",logo:ln.figma,verb:"Building",from:6.5,to:7.3,took:11}];function Vh(e){const t=Wh.map(r=>{const i=e<r.from?"pending":e<r.to?"active":"done";let s;if(r.subs&&i!=="pending"){const o=(r.to-r.from-.3)/r.subs.length,c=i==="done"?r.subs.length:Math.min(r.subs.length,Math.floor((e-r.from-.15)/o)+1);s=c>0?r.subs.slice(0,c).map(([l,f],m)=>({label:l,meta:f,state:i==="active"&&m===c-1?"active":"done"})):void 0}return{label:r.label,logo:r.logo(),state:i,verb:r.verb,subs:s}}),n=e<7.3?"pending":e<7.9?"active":"done";return t.push({label:"Ready in Claude and ChatGPT",logo:ln.claude(),state:n,verb:"Installing"}),t}function Uh(){const{ref:e,t,on:n}=Rd(8.4,!0);_.useEffect(()=>{if(!n)return;const s=()=>{var m;return(m=e.current)==null?void 0:m.querySelector(".ui-dzc__area")},o=new DataTransfer;Hh.forEach(([m,x,g])=>o.items.add(new File([new Uint8Array(Math.round(x))],m,{type:g})));const c=m=>{var x;return(x=s())==null?void 0:x.dispatchEvent(new DragEvent(m,{dataTransfer:o,bubbles:!0,cancelable:!0}))},l=window.setTimeout(()=>c("dragenter"),300),f=window.setTimeout(()=>c("drop"),1e3);return()=>{clearTimeout(l),clearTimeout(f)}},[n]);const r=s=>{s.isTrusted&&(s.preventDefault(),s.stopPropagation())},i=t>=3.9;return a.jsxs("div",{ref:e,className:"hero-drop",children:[a.jsxs("div",{className:"hero-dz"+(i?" off":""),onClickCapture:r,onDragEnterCapture:r,onDragOverCapture:r,onDropCapture:r,children:[a.jsx(b0,{hint:"Logo, guidelines, colors, fonts"}),a.jsx("span",{className:"demo-tag",children:"Demo"})]}),a.jsx("div",{className:"hero-build"+(i?" on":""),children:a.jsx(Ad,{max:1.2,children:a.jsx(jh,{title:"Your agentic brand",agent:a.jsx(a.Fragment,{children:"Atla studio"}),rows:Vh(t)})})})]})}const ma=e=>e.trim().toLowerCase().replace(/^https?:\/\//,"").replace(/^www\./,"").replace(/\/.*$/,""),Dd="https://calendly.com/josepablo-atla/30min",Re=[{id:"q1",q:"Do you have written brand guidelines?",item:"Written brand guidelines"},{id:"q2",q:"Is your voice written down, including words you never use?",item:"Voice and banned words written down"},{id:"q3",q:"Is it written down what you sell and what you don't?",item:"Positioning written down"},{id:"q4",q:"Does one person own the brand rules?",item:"One owner for the rules"},{id:"q5",q:"Do you have your logo, colors and fonts as source files?",item:"Source files for logo, colors and fonts"},{id:"q6",q:"Does the AI your team uses already have your brand rules?",item:"AI has your brand rules"},{id:"q7",q:"Does your recent work match the guidelines?",item:"Recent work is on brand"},{id:"q8",q:"When the brand changes, does every tool get the update?",item:"Changes reach every tool"}],Gt={touch:{label:"Touch-ups first",setup:"We fix what has drifted, then set the brand up in Claude and ChatGPT"},rebrand:{label:"Rebrand first",setup:"We redesign the brand with you, then set the new one up in Claude and ChatGPT"},ready:{label:"Straight to setup",setup:"We turn your current guidelines into rules Claude and ChatGPT follow"}};function uc({ids:e}){return({values:t,setValues:n})=>a.jsx(a.Fragment,{children:Re.filter(r=>e.includes(r.id)).map(r=>a.jsx(Pt,{name:r.id,label:r.q,children:a.jsx(Fd,{"aria-label":r.q,size:"sm",fullWidth:!0,value:t[r.id]??"",onChange:i=>n({[r.id]:i}),options:[{value:"yes",label:"Yes"},{value:"no",label:"No"}]})},r.id))})}const dc=e=>t=>Object.fromEntries(e.filter(n=>!t[n]).map(n=>[n,"Pick yes or no"])),fc=["q1","q2","q3","q4"],pc=["q5","q6","q7","q8"],Qh=[{id:"site",title:"Website",heading:"What's your website?",description:"We look at your brand before we reply.",validate:e=>/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(ma(e.domain))?null:{domain:"Enter a website, like halden.com"},render:({values:e,setValues:t})=>a.jsx(Pt,{name:"domain",label:"Website",children:a.jsx(en,{prefix:"https://",placeholder:"yourbrand.com",inputMode:"url",value:e.domain,onChange:n=>t({domain:n.target.value})})})},{id:"brand",title:"Brand",heading:"How do you feel about your brand?",validate:e=>e.state?null:{state:"Pick one"},render:({values:e,setValues:t})=>a.jsx(rh,{label:"How you feel about your brand",value:e.state,onChange:n=>t({state:n}),options:[{value:"touch",title:"It needs touch-ups",description:"It works, but some things have drifted"},{value:"rebrand",title:"It needs a rebrand",description:"We've outgrown it"},{value:"ready",title:"It's ready for AI",description:"We like it as it is"}]})},{id:"rules",title:"Rules",heading:"Your brand rules",validate:dc(fc),render:uc({ids:fc})},{id:"team",title:"Team",heading:"Your files and your AI",validate:dc(pc),render:uc({ids:pc})},{id:"you",title:"You",heading:"Where can we reach you?",description:"We use it only to reply about your brand.",validate:e=>({...e.name.trim()?{}:{name:"Add your name"},...e.role.trim()?{}:{role:"Add your role"},.../^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e.email.trim())?{}:{email:"Enter your work email"}}),render:({values:e,setValues:t})=>a.jsxs(a.Fragment,{children:[a.jsx(Pt,{name:"name",label:"Name",children:a.jsx(en,{autoComplete:"name",value:e.name,onChange:n=>t({name:n.target.value})})}),a.jsx(Pt,{name:"role",label:"Role",hint:"For example CMO, founder, head of brand",children:a.jsx(en,{autoComplete:"organization-title",value:e.role,onChange:n=>t({role:n.target.value})})}),a.jsx(Pt,{name:"email",label:"Work email",children:a.jsx(en,{type:"email",autoComplete:"email",value:e.email,onChange:n=>t({email:n.target.value})})}),a.jsx(Pt,{name:"wrong",label:"What does AI get wrong about your brand today?",optional:!0,children:a.jsx(en,{value:e.wrong,onChange:n=>t({wrong:n.target.value})})})]})}],Yh={domain:"",state:"",name:"",role:"",email:"",wrong:"",...Object.fromEntries(Re.map(e=>[e.id,""]))};function hc(e,t){const n=Re.length-t,r={touch:{id:"touch",label:Gt.touch.label,signal:3,reason:`${n} of ${Re.length} checks are missing. ${Gt.touch.setup}.`},rebrand:{id:"rebrand",label:Gt.rebrand.label,signal:3,reason:`You said you've outgrown the brand. ${Gt.rebrand.setup}.`},ready:{id:"ready",label:Gt.ready.label,signal:3,reason:`${t} of ${Re.length} checks are in place. ${Gt.ready.setup}.`}};let i=e.state||"touch";return i==="ready"&&t<6&&(i="touch",r.touch.signal=2,r.touch.reason=`You like the brand, but ${n} of ${Re.length} checks are missing. ${Gt.touch.setup}.`),[r[i],...["touch","rebrand","ready"].filter(s=>s!==i).map(s=>({...r[s],signal:1}))]}function Zh(){const[e,t]=_.useState("once");return a.jsxs("div",{className:"pay",children:[a.jsxs("div",{className:"pay-head",children:[a.jsx("p",{className:"pay-title",children:"How you pay"}),a.jsx(Fd,{"aria-label":"How you pay",size:"sm",variant:"tray",value:e,onChange:t,options:[{value:"once",label:"Pay once",badge:"Save $6,000"},{value:"monthly",label:"Monthly"}]})]}),a.jsx("p",{className:"pay-price",children:e==="once"?a.jsxs(a.Fragment,{children:["$24,000 ",a.jsx("span",{children:"once"})]}):a.jsxs(a.Fragment,{children:["$2,500 ",a.jsx("span",{children:"a month for 12 months"})]})}),a.jsx("p",{className:"pay-text",children:e==="once"?"Setup plus 12 months of management in one payment. That's $6,000 less than paying monthly.":"Setup plus 12 months of management, $30,000 in total."}),a.jsx("p",{className:"pay-note",children:"If you need a rebrand first, we quote it separately."})]})}const Od="atla.design/brand-intelligence";function qh(e){const t=ma(e.domain),n=Re.filter(r=>e[r.id]==="yes").length;return["Brand Intelligence scorecard",`Website: ${t}`,`Score: ${n} of ${Re.length}`,`Brand: ${e.state}`,`Role: ${e.role}`,...e.wrong.trim()?[`What AI gets wrong: ${e.wrong.trim()}`]:[],...Re.map(r=>`${r.q} ${e[r.id]}`)].join(`
`).slice(0,4e3)}async function Kh(e){if(!/(^|\.)atla\.design$/.test(location.hostname))return"preview";try{return(await fetch("/api/contact",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({name:e.name.trim(),email:e.email.trim(),company:ma(e.domain).slice(0,160),message:qh(e),source:Od})})).ok?"sent":"failed"}catch{return"failed"}}function Gh({v:e,sent:t}){const n=ma(e.domain),r=Re.filter(c=>e[c.id]==="yes").length,i=Dd+"?name="+encodeURIComponent(e.name)+"&email="+encodeURIComponent(e.email)+"&utm_source=brand-intelligence&utm_campaign="+encodeURIComponent(n)+"&utm_content="+encodeURIComponent(r+"-of-8-"+(e.state||"touch")),s=[`Website: ${n}`,`Score: ${r} of ${Re.length}`,`Brand: ${e.state}`,`Name: ${e.name}`,`Role: ${e.role}`,`Email: ${e.email}`,...e.wrong.trim()?[`What AI gets wrong: ${e.wrong}`]:[],...Re.map(c=>`${c.q} ${e[c.id]}`)].join(`
`),o="mailto:"+Bh+"?subject="+encodeURIComponent("Brand Intelligence scorecard: "+n)+"&body="+encodeURIComponent(s);return a.jsxs("div",{className:"results",children:[a.jsxs("div",{className:"results-head",children:[a.jsx("p",{className:"meta",children:"Your results"}),a.jsxs("h3",{children:[n,": ",r," of ",Re.length," checks in place"]}),a.jsx("p",{className:"results-band",children:r<=3?"Today your team's AI is mostly guessing.":r<=6?"Part of your brand is written down. AI can't use the rest yet.":"Your brand is close. Setup is the main step left."}),e.wrong.trim()&&a.jsxs("p",{className:"results-quote",children:['You said: "',e.wrong.trim(),'". The voice and positioning rules are where we fix that.']})]}),a.jsx(oh,{title:"AI readiness",steps:Re.map(c=>({id:c.id,label:c.item,done:e[c.id]==="yes"}))}),a.jsx(uh,{title:"Recommended: "+hc(e,r)[0].label,options:hc(e,r).slice(0,1),onAccept:()=>window.open(i,"_blank","noopener")}),a.jsx(ph,{title:"What happens next",groups:[{id:"setup",title:"Setup, one time",tasks:[{id:"s1",label:"A review call"},{id:"s2",label:"We audit your brand on real work"},{id:"s3",label:"Touch-ups or a rebrand, if you need one"},{id:"s4",label:"Your brand set up in Claude and ChatGPT"}]},{id:"monthly",title:"Monthly fee",tasks:[{id:"m1",label:"We check new work against the rules"},{id:"m2",label:"We update the rules when the brand changes"},{id:"m3",label:"You get a review report every month"}]}]}),a.jsx(Zh,{}),t==="failed"&&a.jsx("p",{className:"results-sent fail",children:`Your answers didn't reach us. Use "Email us instead" and they arrive filled in.`}),t==="sent"&&a.jsx("p",{className:"results-sent",children:"We have your answers."}),t==="preview"&&a.jsx("p",{className:"results-sent",children:"Preview: answers are only sent from atla.design."}),a.jsxs("div",{className:"ctas",children:[a.jsx("a",{id:"book",className:"btn",href:i,target:"_blank",rel:"noopener",children:"Book your review call"}),a.jsx("a",{className:"btn soft",href:o,children:"Email us instead"})]})]})}function Xh(){const[e,t]=_.useState(null),[n,r]=_.useState("sending");return e?a.jsx(Gh,{v:e,sent:n}):a.jsx(Id,{steps:Qh,initialValues:Yh,submitLabel:"See my results",onComplete:i=>{t(i),Kh(i).then(r),requestAnimationFrame(()=>{var s;return(s=document.getElementById("start"))==null?void 0:s.scrollIntoView({behavior:"smooth"})})}})}const Jh=/(^|\.)atla\.design$/.test(location.hostname)?"/brand-intelligence/assets/brand-rules-template.zip":"assets/brand-rules-template.zip",Bd=["README.md","install.md","AGENTS.md","verbal/positioning.md","verbal/proof-and-claims.md","verbal/voice-and-tone.md","verbal/terminology.md","visual/visual-system.json","visual/logo-and-color.md"],eg=[{id:"get",title:"Template",heading:"Get the template",description:"Your download starts right after this step.",validate:e=>({...e.name.trim()?{}:{name:"Add your name"},.../^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e.email.trim())?{}:{email:"Enter your work email"}}),render:({values:e,setValues:t})=>a.jsxs(a.Fragment,{children:[a.jsx(Pt,{name:"name",label:"Name",children:a.jsx(en,{autoComplete:"name",value:e.name,onChange:n=>t({name:n.target.value})})}),a.jsx(Pt,{name:"email",label:"Work email",children:a.jsx(en,{type:"email",autoComplete:"email",value:e.email,onChange:n=>t({email:n.target.value})})})]})}];async function tg(e){if(!/(^|\.)atla\.design$/.test(location.hostname))return"preview";try{return(await fetch("/api/contact",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({name:e.name.trim(),email:e.email.trim(),message:"Downloaded the Brand rules template from the Brand Intelligence page.",source:Od})})).ok?"sent":"failed"}catch{return"failed"}}function ng(){const[e,t]=_.useState("sending");return a.jsx("div",{className:"magnet-form",children:a.jsx(Id,{steps:eg,initialValues:{name:"",email:""},submitLabel:"Get the template",onComplete:n=>{tg(n).then(t)},success:()=>a.jsxs(Pd,{title:"Your template is ready",description:"Short on time? Fill in the three files in the README's 20-minute start, then install. Stuck on a file? Book a call and we'll fill it in with you.",children:[e==="preview"?a.jsx("ul",{className:"files files-links",children:Bd.map(n=>a.jsx("li",{children:a.jsx("a",{href:"assets/brand-rules-template/"+n,target:"_blank",rel:"noopener",children:n})},n))}):a.jsx("a",{className:"btn",href:Jh,download:"brand-rules-template.zip",children:"Download the template"}),a.jsx("a",{className:"btn soft",href:Dd+"?utm_source=brand-intelligence&utm_campaign=template",target:"_blank",rel:"noopener",children:"Book a call"}),e==="preview"&&a.jsx("p",{className:"results-sent",children:"Preview: the zip and saving your email work only on atla.design."})]})})})}function rg(){return a.jsxs(a.Fragment,{children:[a.jsxs("div",{className:"wrap",children:[a.jsxs("nav",{children:[a.jsxs("a",{className:"brand",href:"https://www.atla.design","aria-label":"Atla, Brand Intelligence",children:[a.jsx(lc,{className:"wordmark"}),a.jsx("span",{children:"Brand Intelligence"})]}),a.jsx("a",{className:"nav-link",href:"#steps",children:"How it works"}),a.jsx("a",{className:"btn",href:"#start",children:"Check your brand"})]}),a.jsxs("header",{className:"hero",children:[a.jsxs("div",{children:[a.jsx("p",{className:"eyebrow",children:"Brand Intelligence by Atla, a branding studio in Austin"}),a.jsx("h1",{className:"hook",children:"Everything your team makes with AI, on brand."}),a.jsx("p",{className:"body",children:"We turn your brand into rules Claude and ChatGPT follow, so posts, decks and emails come out in your voice, your colors and your type. Our designers write the rules and check the work every month."}),a.jsxs("div",{className:"ctas",children:[a.jsx("a",{className:"btn",href:"#start",children:"Check your brand"}),a.jsx("a",{className:"btn soft",href:"#steps",children:"How it works"})]})]}),a.jsxs("div",{className:"hero-right",children:[a.jsx(Uh,{}),a.jsx("p",{className:"hero-note",children:"A demo with example files. On a real project, our designers write and approve every rule."}),a.jsx("p",{className:"sr",children:"Demo: a brand's logo, guidelines, colors and fonts are uploaded, then the studio reviews them, writes the rules and voice, builds the visual system, and the brand ends up ready in Claude and ChatGPT."})]})]}),a.jsxs("section",{className:"outcomes","aria-label":"What changes",children:[a.jsxs("div",{children:[a.jsx("h2",{children:"First drafts that sound like you"}),a.jsx("p",{children:"Your voice, the words you never use and what you sell travel with every prompt."})]}),a.jsxs("div",{children:[a.jsx("h2",{children:"Review, not redo"}),a.jsx("p",{children:"Colors, type and logo rules come built in, so your designers approve work instead of rebuilding it."})]}),a.jsxs("div",{children:[a.jsx("h2",{children:"Change it once"}),a.jsx("p",{children:"Update the brand one time and every tool your team uses follows."})]})]}),a.jsx(Ya,{id:"steps",dur:5.1,n:"01",label:"Review",note:"Example: an audit of 12 posts for a fictional brand.",title:"See where your brand breaks",text:"We go through your recent posts, decks and ads and mark each place where the color, type or voice has drifted from the guidelines.",desc:"Example audit: three checkers review 12 posts and flag an off-palette blue, a banned word and an extra type size, each with its fix.",children:e=>a.jsx(Ph,{t:e})}),a.jsx(Ya,{dur:4.8,n:"02",label:"Fix",title:"Fix it once, everywhere",text:"If the brand mostly works, we fix what's off. If it doesn't, we redesign it before anything else. After that, a change you approve once shows up across your tools.",note:"Example: one color change, and the tools that follow it.",desc:"Example: the accent color changes once and the website, deck, ads and email templates follow; Figma and Canva wait for approval.",children:e=>a.jsx(Oh,{t:e})}),a.jsx(Ya,{dur:2,n:"03",label:"Install",title:"Your AI answers like your brand",text:"You get your brand as files any AI can read, a Claude skill, and a one-page guide for each tool your team uses. Every month we check new work against the rules and send you the review.",note:"Example: a fictional brand's AI answering a discount request.",desc:"Example: an AI reply to a discount request that cites the brand's positioning, offer and voice files.",children:e=>a.jsx(Ad,{children:a.jsx($h,{t:e})})}),a.jsx("section",{className:"row wide",children:a.jsxs("div",{children:[a.jsxs("p",{className:"idx",children:[a.jsx("b",{children:"04"}),"Why a studio"]}),a.jsx("p",{className:"why-line",children:"A custom GPT with no brand rules is guessing. We write those rules as designers and check them on your own work before your team relies on them."}),a.jsx("p",{className:"why-by",children:"Led by José Pablo Domínguez, founder and creative director of Atla. You own every file we make."})]})}),a.jsx("section",{className:"row wide",children:a.jsxs("div",{children:[a.jsxs("p",{className:"idx",children:[a.jsx("b",{children:"05"}),"Where you start"]}),a.jsx("h2",{className:"title",children:"Three ways to start"}),a.jsxs("ul",{className:"paths",children:[a.jsxs("li",{children:[a.jsx("h3",{children:"You like your brand"}),a.jsx("p",{children:"We review it, fix what's off and set it up in your team's AI."})]}),a.jsxs("li",{children:[a.jsx("h3",{children:"You've outgrown it"}),a.jsx("p",{children:"We rebrand first, then set up the new brand the same way."})]}),a.jsxs("li",{children:[a.jsx("h3",{children:"It's ready as it is"}),a.jsx("p",{children:"We go straight to setup in Claude and ChatGPT."})]})]})]})}),a.jsxs("section",{className:"cta",id:"start",children:[a.jsxs("div",{className:"cta-copy",children:[a.jsx("h2",{className:"hook",children:"Is your brand ready for AI?"}),a.jsx("p",{className:"body",children:"Eight yes-or-no questions. You get your score, what's missing, the path we'd recommend and the price."})]}),a.jsx("div",{className:"intake",children:a.jsx(Xh,{})})]}),a.jsxs("section",{className:"cta magnet",id:"template",children:[a.jsxs("div",{className:"cta-copy",children:[a.jsxs("p",{className:"idx",children:[a.jsx("b",{children:"Free"}),"Brand rules template"]}),a.jsx("h2",{className:"title",children:"Not ready for a call? Start with the template."}),a.jsx("p",{className:"body",children:"The same structure we build for clients, ready for you to fill in, with a one-page guide to load it into Claude and ChatGPT. Start with three files in 20 minutes."}),a.jsx("p",{className:"body",children:"You fill in the template yourself. With the paid service, our designers write the rules and check your team's work every month."}),a.jsx("ul",{className:"files",children:Bd.map(e=>a.jsx("li",{children:e},e))})]}),a.jsx("div",{className:"intake",children:a.jsx(ng,{})})]})]}),a.jsx("footer",{children:a.jsxs("div",{className:"wrap",children:[a.jsxs("span",{className:"foot-brand",children:[a.jsx(lc,{className:"wordmark sm"}),a.jsx("span",{children:"Brand Intelligence"})]}),a.jsx("a",{href:"https://www.atla.design",children:"atla.design"})]})})]})}Nd(document.getElementById("root")).render(a.jsx(rg,{}));
