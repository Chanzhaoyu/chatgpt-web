import{V as S,B as T,D as L,E as N,F as I}from"./element-plus.5b1237d2.js";import{a as P,b as U}from"./role.34e90f45.js";import{m as j}from"./menu.891f00fe.js";import{P as q}from"./index.9779dcb9.js";import{f as H,t as M}from"./index.4abee10a.js";import{d as O,s as p,r,Z,o as z,c as G,U as t,L as d,u,a as k,i as J,n as y}from"./@vue.50ba5cf8.js";const Q={class:"edit-popup"},le=O({__name:"auth",emits:["success","close"],setup(W,{expose:v,emit:f}){const o=p(),h=p(),m=p(),C=r(!1),c=r(!0),_=r([]),i=r([]),l=Z({id:"",name:"",remark:"",sort:0,isDisable:0,menus:[]}),b={name:[{required:!0,message:"\u8BF7\u8F93\u5165\u540D\u79F0",trigger:["blur"]}]},x=async()=>{const e=await j();i.value=e,_.value=M(e)},E=()=>{var s,n;const e=(s=o.value)==null?void 0:s.getCheckedKeys(),a=(n=o.value)==null?void 0:n.getHalfCheckedKeys();return e==null||e.unshift.apply(e,a),e},F=()=>{l.menus.forEach(e=>{y(()=>{var a;(a=o.value)==null||a.setChecked(e,!0,!1)})})},g=e=>{const a=i.value;for(let s=0;s<a.length;s++)o.value.store.nodesMap[a[s].id].expanded=e},D=e=>{var a,s;e?(a=o.value)==null||a.setCheckedKeys(_.value.map(n=>n.id)):(s=o.value)==null||s.setCheckedKeys([])},w=async()=>{var e,a;await((e=h.value)==null?void 0:e.validate()),l.menus=E(),await P({...l,menuIds:l.menus.join()}),(a=m.value)==null||a.close(),H.msgSuccess("\u64CD\u4F5C\u6210\u529F"),f("success")},B=()=>{f("close")};return v({open:()=>{var e;(e=m.value)==null||e.open()},setFormData:async e=>{await x();const a=await U({id:e.id});for(const s in l)a[s]!=null&&a[s]!=null&&(l[s]=a[s]);y(()=>{F()})}}),(e,a)=>{const s=T,n=S,R=L,A=N,K=I;return z(),G("div",Q,[t(q,{ref_key:"popupRef",ref:m,title:"\u6743\u9650\u8BBE\u7F6E",async:!0,width:"550px",onConfirm:w,onClose:B},{default:d(()=>[t(K,{class:"ls-form",ref_key:"formRef",ref:h,rules:b,model:u(l),"label-width":"60px"},{default:d(()=>[t(A,{class:"h-[400px] sm:h-[600px]"},{default:d(()=>[t(R,{label:"\u6743\u9650",prop:"menus"},{default:d(()=>[k("div",null,[t(s,{label:"\u5C55\u5F00/\u6298\u53E0",onChange:g}),t(s,{label:"\u5168\u9009/\u4E0D\u5168\u9009",onChange:D}),t(s,{modelValue:u(c),"onUpdate:modelValue":a[0]||(a[0]=V=>J(c)?c.value=V:null),label:"\u7236\u5B50\u8054\u52A8"},null,8,["modelValue"]),k("div",null,[t(n,{ref_key:"treeRef",ref:o,data:u(i),props:{label:"menuName",children:"children"},"check-strictly":!u(c),"node-key":"id","default-expand-all":u(C),"show-checkbox":""},null,8,["data","check-strictly","default-expand-all"])])])]),_:1})]),_:1})]),_:1},8,["model"])]),_:1},512)])}}});export{le as _};
