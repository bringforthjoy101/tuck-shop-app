(this["webpackJsonpvuexy-react-admin-dashboard"]=this["webpackJsonpvuexy-react-admin-dashboard"]||[]).push([[209],{2244:function(e,t,a){"use strict";a.r(t);var s=a(22),n=a.n(s),c=a(0),r=a(47),o=a(30),i=a(1),l=a(497),j=a(92),u=a(566),d=a(142),h=a(143),b=a(48),m=a.n(b),g={loginEndpoint:"/jwt/login",registerEndpoint:"/jwt/register",refreshEndpoint:"/jwt/refresh-token",logoutEndpoint:"/jwt/logout",tuckShopLoginEndpoint:"".concat("https://tuck-shop-api.herokuapp.com","/login"),tokenType:"Bearer",storageTokenKeyName:"accessToken",storageRefreshTokenKeyName:"refreshToken"};var f={jwt:new(function(){function e(t){var a=this;Object(d.a)(this,e),this.jwtConfig=Object(c.a)({},g),this.isAlreadyFetchingAccessToken=!1,this.subscribers=[],this.jwtConfig=Object(c.a)(Object(c.a)({},this.jwtConfig),t),m.a.interceptors.request.use((function(e){var t=a.getToken();return t&&(e.headers.Authorization="".concat(a.jwtConfig.tokenType," ").concat(t)),e}),(function(e){return Promise.reject(e)})),m.a.interceptors.response.use((function(e){return e}),(function(e){var t=e.config,s=e.response,n=t;return s&&401===s.status?(a.isAlreadyFetchingAccessToken||(a.isAlreadyFetchingAccessToken=!0,a.refreshToken().then((function(e){a.isAlreadyFetchingAccessToken=!1,a.setToken(e.data.accessToken),a.setRefreshToken(e.data.refreshToken),a.onAccessTokenFetched(e.data.accessToken)}))),new Promise((function(e){a.addSubscriber((function(t){n.headers.Authorization="".concat(a.jwtConfig.tokenType," ").concat(t),e(a.axios(n))}))}))):Promise.reject(e)}))}return Object(h.a)(e,[{key:"onAccessTokenFetched",value:function(e){this.subscribers=this.subscribers.filter((function(t){return t(e)}))}},{key:"addSubscriber",value:function(e){this.subscribers.push(e)}},{key:"getToken",value:function(){return localStorage.getItem(this.jwtConfig.storageTokenKeyName)}},{key:"getRefreshToken",value:function(){return localStorage.getItem(this.jwtConfig.storageRefreshTokenKeyName)}},{key:"setToken",value:function(e){localStorage.setItem(this.jwtConfig.storageTokenKeyName,e)}},{key:"setRefreshToken",value:function(e){localStorage.setItem(this.jwtConfig.storageRefreshTokenKeyName,e)}},{key:"login",value:function(){for(var e=arguments.length,t=new Array(e),a=0;a<e;a++)t[a]=arguments[a];return m.a.post.apply(m.a,[this.jwtConfig.tuckShopLoginEndpoint].concat(t))}},{key:"register",value:function(){for(var e=arguments.length,t=new Array(e),a=0;a<e;a++)t[a]=arguments[a];return m.a.post.apply(m.a,[this.jwtConfig.registerEndpoint].concat(t))}},{key:"refreshToken",value:function(){return m.a.post(this.jwtConfig.refreshEndpoint,{refreshToken:this.getRefreshToken()})}}]),e}())({})}.jwt,p=a(88),O=a(134),x=a(1035),k=a(139),v=a(839),y=a(495),w=a(549),N=a(131),T=a(1094),C=a(535),A=a(502),S=a(503),F=a(499),I=a(505),z=a(1028),P=a(518),E=a(1025),R=a(491),K=a(555),L=(a(574),a(6)),q=function(e){var t=e.name,a=e.role;return Object(L.jsxs)(i.Fragment,{children:[Object(L.jsx)("div",{className:"toastify-header",children:Object(L.jsxs)("div",{className:"title-wrapper",children:[Object(L.jsx)(l.a,{size:"sm",color:"success",icon:Object(L.jsx)(T.a,{size:12})}),Object(L.jsxs)("h6",{className:"toast-title font-weight-bold",children:["Welcome, ",t]})]})}),Object(L.jsx)("div",{className:"toastify-body",children:Object(L.jsxs)("span",{children:["You have successfully logged in as an ",a," user to Appia. Now you can start to explore. Enjoy!"]})})]})},B=function(e){var t=e.message;return Object(L.jsxs)(i.Fragment,{children:[Object(L.jsx)("div",{className:"toastify-header",children:Object(L.jsxs)("div",{className:"title-wrapper",children:[Object(L.jsx)(l.a,{size:"sm",color:"success",icon:Object(L.jsx)(T.a,{size:12})}),Object(L.jsx)("h6",{className:"toast-title font-weight-bold",children:t})]})}),Object(L.jsx)("div",{className:"toastify-body",children:Object(L.jsx)("span",{children:"Pls, reconfirm login credentials"})})]})};t.default=function(e){var t=Object(u.a)(),s=Object(o.a)(t,2),l=(s[0],s[1],Object(i.useContext)(k.a)),d=Object(p.b)(),h=Object(v.g)(),b=Object(i.useState)("adelugba.emma@gmail.com"),m=Object(o.a)(b,2),g=m[0],T=m[1],J=Object(i.useState)("000000"),D=Object(o.a)(J,2),W=D[0],M=D[1],V=Object(i.useState)(!1),Y=Object(o.a)(V,2),G=Y[0],H=Y[1],Q=a(702)("./".concat("wexford-banner-1.jpg")).default,U=function(){var e=Object(r.a)(n.a.mark((function e(t,a){return n.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!a||a.length){e.next=4;break}return H(!0),e.next=4,f.login({email:g,password:W}).then((function(e){if(e.data.success){var t=Object(c.a)(Object(c.a)({},e.data.admin),{},{accessToken:e.data.token,refreshToken:e.data.token,ability:[{action:"manage",subject:"all"}],avatar:"/demo/Appia-react-admin-dashboard-template/demo-1/static/media/avatar-s-11.1d46cc62.jpg",extras:{eCommerceCartItemsCount:5}});console.log("data",t),d(Object(x.a)(t)),l.update(t.ability),h.push(Object(N.d)("admin")),O.f.success(Object(L.jsx)(q,{name:"".concat(t.firstName," ").concat(t.lastName)||t.fullName||t.username||"John Doe",role:t.role||"admin"}),{transition:O.c,hideProgressBar:!0,autoClose:2e3})}else O.f.error(Object(L.jsx)(B,{message:"".concat(e.data.message)||"Invalid Login"}),{transition:O.c,hideProgressBar:!0,autoClose:2e3}),H(!1)})).catch((function(e){console.log(e),H(!1)}));case 4:case"end":return e.stop()}}),e)})));return function(t,a){return e.apply(this,arguments)}}();return Object(L.jsx)("div",{className:"auth-wrapper auth-v2",children:Object(L.jsxs)(A.a,{className:"auth-inner m-0",children:[Object(L.jsxs)(y.b,{className:"brand-logo",to:"/",onClick:function(e){return e.preventDefault()},children:[Object(L.jsx)("img",{src:j.default,width:"40"}),Object(L.jsx)("h2",{className:"brand-text text-primary ml-1",children:"TuckShop"})]}),Object(L.jsx)(S.a,{className:"d-none d-lg-flex align-items-center p-1",lg:"8",sm:"12",children:Object(L.jsx)("div",{className:"w-100 d-lg-flex align-items-center justify-content-center px-5",children:Object(L.jsx)("img",{className:"img-fluid",src:Q,width:"100%",alt:"Login V2"})})}),Object(L.jsx)(S.a,{className:"d-flex align-items-center auth-bg px-2 p-lg-5",lg:"4",sm:"12",children:Object(L.jsxs)(S.a,{className:"px-xl-2 mx-auto",sm:"8",md:"6",lg:"12",children:[Object(L.jsx)(F.a,{tag:"h2",className:"font-weight-bold mb-1",children:"Welcome to TuckShop \ud83d\udc4b"}),Object(L.jsx)(I.a,{className:"mb-2",children:"Please sign-in to your account and start the adventure"}),Object(L.jsxs)(C.AvForm,{className:"auth-login-form mt-2",onSubmit:U,children:[Object(L.jsxs)(z.a,{children:[Object(L.jsx)(P.a,{className:"form-label",for:"login-email",children:"Email"}),Object(L.jsx)(C.AvInput,{required:!0,autoFocus:!0,type:"email",value:g,id:"login-email",name:"login-email",placeholder:"john@example.com",onChange:function(e){return T(e.target.value)}})]}),Object(L.jsxs)(z.a,{children:[Object(L.jsxs)("div",{className:"d-flex justify-content-between",children:[Object(L.jsx)(P.a,{className:"form-label",for:"login-password",children:"Password"}),Object(L.jsx)(y.b,{to:"/forgot-password",children:Object(L.jsx)("small",{children:"Forgot Password?"})})]}),Object(L.jsx)(w.a,{required:!0,tag:C.AvInput,value:W,id:"login-password",name:"login-password",autoComplete:"on",className:"input-group-merge",onChange:function(e){return M(e.target.value)}})]}),Object(L.jsx)(z.a,{children:Object(L.jsx)(E.a,{type:"checkbox",className:"custom-control-Primary",id:"remember-me",label:"Remember Me"})}),Object(L.jsxs)(R.a.Ripple,{color:"primary",block:!0,disabled:G,children:[G&&Object(L.jsx)(K.a,{color:"white",size:"sm"}),Object(L.jsx)("span",{className:"ml-50",children:"Sign In"})]})]})]})})]})})}},549:function(e,t,a){"use strict";var s=a(0),n=a(65),c=a(30),r=a(133),o=a(1),i=a(29),l=a.n(i),j=a(1110),u=a(1109),d=a(518),h=a(1044),b=a(1046),m=a(1045),g=a(845),f=a(6),p=["label","hideIcon","showIcon","visible","className","htmlFor","placeholder","iconSize"],O=function(e){var t=e.label,a=e.hideIcon,i=e.showIcon,O=e.visible,x=e.className,k=e.htmlFor,v=e.placeholder,y=e.iconSize,w=Object(r.a)(e,p),N=Object(o.useState)(O),T=Object(c.a)(N,2),C=T[0],A=T[1];return Object(f.jsxs)(o.Fragment,{children:[t?Object(f.jsx)(d.a,{for:k,children:t}):null,Object(f.jsxs)(h.a,{className:l()(Object(n.a)({},x,x)),children:[Object(f.jsx)(b.a,Object(s.a)(Object(s.a)({type:!1===C?"password":"text",placeholder:v||"\xb7\xb7\xb7\xb7\xb7\xb7\xb7\xb7\xb7\xb7\xb7\xb7"},t&&k?{id:k}:{}),w)),Object(f.jsx)(m.a,{addonType:"append",onClick:function(){return A(!C)},children:Object(f.jsx)(g.a,{className:"cursor-pointer",children:function(){var e=y||14;return!1===C?a||Object(f.jsx)(j.a,{size:e}):i||Object(f.jsx)(u.a,{size:e})}()})})]})]})};t.a=O,O.defaultProps={visible:!1}}}]);
//# sourceMappingURL=209.d876e000.chunk.js.map