(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[0],{58:function(t,e,a){},96:function(t,e,a){"use strict";a.r(e);var n=a(0),s=a(2),r=a(3),o=a(7),i=a(6),c=a(1),l=a.n(c),h=a(49),u=a.n(h),d=a(51),b=a(4),v=(a(58),a.p+"static/media/logo.f16fac0d.png");function m(t){return Object(n.jsxs)("div",{className:"modalMain",children:[Object(n.jsx)("img",{src:v,alt:"Logo"}),Object(n.jsx)("h1",{children:"Mafia Engine"}),(e="Version Beta 1.2",e?Object(n.jsx)("h2",{children:e}):null),Object(n.jsx)("br",{}),Object(n.jsxs)("div",{className:"mainmenu",children:[Object(n.jsx)("a",{className:"menuoption",href:"/rolecard",children:"Role Card"}),Object(n.jsx)("a",{className:"menuoption",href:"/replacement",children:"Replacement Form"}),Object(n.jsx)("a",{className:"menuoption",href:"/votecount",children:"Vote Counter"}),Object(n.jsx)("a",{className:"menuoption",href:"/credits",children:"Credits / Contact"})]})]});var e}function j(t){return Object(n.jsxs)("div",{className:"modalMain",children:[Object(n.jsx)("img",{src:v,alt:"Logo"}),Object(n.jsx)("h1",{children:"Error 404"}),Object(n.jsx)("h2",{children:"Page Not Found"})]})}var p=a(25),g=a(26),f=a.n(g);function O(){var t=f()(Object({NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0}).SERVER_URL);return t}var y=["January","February","March","April","May","June","July","August","September","October","November","December"];function x(t){var e=t.title,a=t.children;return Object(n.jsxs)("div",{className:"modalMain",children:[Object(n.jsx)("h1",{children:e}),a.map((function(t,e){return t}))]})}function k(t){var e=t.child;return Object(n.jsx)("div",{className:"field",children:e})}var S=function(t){Object(o.a)(a,t);var e=Object(i.a)(a);function a(t){var n;return Object(s.a)(this,a),(n=e.call(this,t)).name=t.name,n.label=t.label,n.type=t.type,t.accept&&(n.accept=t.accept),n}return Object(r.a)(a,[{key:"render",value:function(){return Object(n.jsxs)(n.Fragment,{children:[Object(n.jsx)("label",{htmlFor:this.name,children:this.label}),Object(n.jsx)("input",{id:this.name,type:this.type,accept:this.accept||""})]})}}]),a}(l.a.Component),C=function(t){Object(o.a)(a,t);var e=Object(i.a)(a);function a(t){var n;return Object(s.a)(this,a),(n=e.call(this,t)).onSubmit=t.onSubmit,n.children=t.children,n.submitText=t.submitText,n}return Object(r.a)(a,[{key:"render",value:function(){return Object(n.jsxs)("form",{className:"modalForm",onSubmit:this.onSubmit,children:[this.children.map((function(t,e){return Object(n.jsx)(k,{child:Object(n.jsx)(S,{name:t.name,label:t.label,type:t.type})},t.name)})),Object(n.jsx)("input",{type:"submit",value:this.submitText})]})}}]),a}(l.a.Component),N=function(t){Object(o.a)(a,t);var e=Object(i.a)(a);function a(){var t;return Object(s.a)(this,a),(t=e.call(this)).onReplacement=function(e){var a=e.author,n=e.lastPage,s=e.title,r=e.url,o=function(){var t=new Date,e=t.getDate();e=function(t){var e=t%10,a=t%100;return 1===e&&11!==e?t+"st":2===e&&12!==a?t+"nd":3===e&&13!==a?t+"rd":t+"th"}(e);var a=t.getMonth()+1;return"".concat(e," ").concat(y[a-1])}(),i="".concat(o,"\n[i][url=").concat(r,"]").concat(s,"[/url][/i]\n[b]Moderator:[/b] [user]").concat(a,"[/user][tab]3[/tab][tab]3[/tab][b]Status:[/b] ").concat(n," pages [tab]3[/tab] [b]Replacing:[/b] [user]").concat(t.departing,"[/user]");t.setState({result:i,progress:""})},t.state={result:"",progress:""},t.departing=null,t.socket=O(),t.socket.on("replacement",t.onReplacement.bind(Object(p.a)(t))),t}return Object(r.a)(a,[{key:"onSubmit",value:function(t){t.preventDefault();var e=t.target.url.value;this.departing=t.target.departing.value,this.socket.emit("replacement",{url:e}),this.setState({progress:"[pending]",result:"Pending..."})}},{key:"render",value:function(){return Object(n.jsx)(x,{title:"Replacement Form",children:[Object(n.jsx)(C,{onSubmit:this.onSubmit.bind(this),submitText:"Generate",children:[{name:"url",label:"Game URL",type:"text"},{name:"departing",label:"Departing Player",type:"text"}]},"replacementForm"),Object(n.jsxs)("div",{className:"modalResult",children:[Object(n.jsxs)("h3",{children:["Result ",Object(n.jsx)("span",{children:this.state.progress})]}),Object(n.jsx)("textarea",{value:this.state.result,readOnly:!0})]},"result")]})}}]),a}(l.a.Component),w=a(16);var T=a(20),D=function(){function t(e,a){Object(s.a)(this,t),this.category=a,this.author=e.author,this.pronoun=e.pronoun,this.number=parseInt(e.post.number),this.url=e.post.url,this.votes=e.votes,this.vote={last:null,valid:null}}return Object(r.a)(t,[{key:"isAfter",value:function(t){return this.number>t.number}},{key:"getNewest",value:function(t){return t?this.isAfter?this:t:this}},{key:"clean",value:function(t){for(var e=t.totalnames,a=t.alias,n=this.votes[this.category],s=void 0,r=void 0,o=n.length;o>=0;o-=1){var i=n[o];if(void 0===s&&(s=i),void 0===r&&(i||null===i))if(null===i)r=null;else{var c=Object(T.findBestMatch)(i,e).bestMatch;c.rating,null===t||void 0===t||t.correctionWeight;var l=a[c.target];l&&(r=l,s===i&&(s=r))}}this.vote.last=s,this.vote.valid=r}},{key:"isValid",value:function(t){var e,a=this.number>parseInt(t.days[t.days.length-1]),n=!1,s=Object(w.a)(t.dead);try{for(s.s();!(e=s.n()).done;){var r=e.value,o=this.rootUser(r,t.totalnames),i=this.rootUser(this.author,t.totalnames);o.target===i.target&&(n=!0)}}catch(c){s.e(c)}finally{s.f()}return a&&!n}},{key:"rootUser",value:function(t,e){return Object(T.findBestMatch)(t,e).bestMatch}}]),t}();function R(t){for(var e=1;e<t.lemgth;e++)for(var a=e-1;a>-1;a--){if(t[e].length<t[a].length){var n=[t[a],t[a+1]];t[a+1]=n[0],t[a]=n[1]}}return t}var V={players:["playerList","players"],slots:["slotList","slots","replacementlist","replacements"],alias:["nicknameList","nicknames","alias","aliasList"],moderators:["moderatorList","moderators","moderatorNames"],dead:["deadList","dead","eliminated"],days:["dayStartNumbers","dayStart","days"],deadline:["deadline","timer"],prods:["prodTimer","prod"],countdown:["prods","timer","prodTimer","countdown"],pageData:["pageData"],correctionWeight:["correctionWeight, correction"],edash:["edash","edashweight"],edashOnTop:["edashOnTop"]};function P(t,e){return e.includes(t)}function E(t){for(var e in V)if(P(t,V[e]))return{handle:e,request:t,selectors:V[e]};return null}var W=function(t){return new A(t).data},A=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;Object(s.a)(this,t),this.data={players:[],slots:{},alias:{},totalnames:[],moderators:[],dead:[],days:["0"],votes:{reg:{id:"0",vote:"VOTE: ",unvote:"UNVOTE: "},hurt:{id:"1",vote:"HURT: ",unvote:"HEAL: "}},pageData:null,voteWeight:{reg:1},edash:-1,edashOnTop:-1,correctionWeight:.5},this.baseUrl="",e&&this.parseSettings(e)}return Object(r.a)(t,[{key:"parseSettings",value:function(t){for(var e in t){var a=E(e),n=t[e];if(a)switch(a.handle){case"players":var s=this.convertCommaDelimiter(n);this.data.players=s.list,this.data.slots=s.obj,this.addNamesArray(s.list),this.addAlias(s.obj),this.convertPlayerNicknames(s.list);break;case"slots":var r=this.convertCommaDelimiter(n);this.data.slots=r.obj,this.addNamesArray(r.list),this.addAlias(r.obj);break;case"alias":var o=this.convertCommaDelimiter(n);this.addAlias(o.obj),this.addNamesArray(o.list);break;case"moderators":var i=this.convertCommaDelimiter(n);this.data.moderators=i.list;break;case"dead":var c=this.convertCommaDelimiter(n);this.data.dead=c.list;break;case"days":var l=this.convertCommaDelimiter(n);this.data.days=l.list;break;case"deadline":this.data.deadline=n;break;case"countdown":var h=this.convertCommaDelimiter(n).list;this.data.prods=[];for(var u=0;u<4;u++)isNaN(parseInt(h[u]))?this.data.prods[u]=0:this.data.prods[u]=h[u];break;case"pageData":this.data.pageData=n;break;case"correctionWeight":this.data.correctionWeight=n;break;case"prods":this.convertProds(n);break;case"edash":var d=parseInt(n);isNaN(d)||(this.data.edash=d);break;case"edashOnTop":var b=parseInt(n);isNaN(b)||(this.data.edashOnTop=b);break;default:console.log("Unknown Setting")}else console.log("Settings found [".concat(e,"] as an unknown selector."))}}},{key:"addNamesArray",value:function(t){var e,a=Object(w.a)(t);try{for(a.s();!(e=a.n()).done;){var n=e.value;this.data.totalnames.includes(n)||this.data.totalnames.push(n)}}catch(s){a.e(s)}finally{a.f()}}},{key:"addAlias",value:function(t){this.data.alias=Object.assign(this.data.alias,t)}},{key:"addSetting",value:function(t,e){switch(t){case"playerList":this.addPlayers(e)}}},{key:"addPlayers",value:function(t){for(var e=t.split(","),a=0;a<e.length;a++)for(var n=e[a].split(":"),s=1;s<n.length;s++){var r=n[s],o=n[0];this.slotList[r]=o}}},{key:"convertPlayerNicknames",value:function(t){for(var e={},a=0;a<t.length;a++){var n=t[a].split("{");if(n.length>1)for(var s=n[1].split("}")[0].split("+"),r=0;r<s.length;r++)e[s[r]]=n[0]}return console.log(e),e}},{key:"convertCommaDelimiter",value:function(t){for(var e=[],a={},n=t.split(","),s=0;s<n.length;s++)for(var r=n[s].split(":"),o=0;o<r.length;o++){var i=r[0].trim(),c=r[o].trim();e.push(c),a[c]=i}return{list:e,obj:a}}},{key:"convertProds",value:function(t){for(var e=[0,0,0,0],a=t.split(","),n=a.length>e.length?e.length:a.length,s=0;s<n;s++){var r=a[s].trim(),o=parseInt(r);isNaN(o)||(e[s]=o)}}}]),t}(),I=function(t){Object(o.a)(a,t);var e=Object(i.a)(a);function a(){var t;for(var n in Object(s.a)(this,a),(t=e.call(this)).state={progress:"",result:""},t.toggle={onlyCountVotes:!1},t.cache={},t.socket=null,t.toggle)t.state[n]=t.toggle[n];return t}return Object(r.a)(a,[{key:"componentDidMount",value:function(){this.startSocketConnection(),this.setupSocketListeners()}},{key:"componentWillUnmount",value:function(){this.closeSocketConnection()}},{key:"startSocketConnection",value:function(){this.socket=f.a.connect()}},{key:"closeSocketConnection",value:function(){this.socket.disconnect()}},{key:"setupSocketListeners",value:function(){this.socket.on("result",this.processVotes.bind(this)),this.socket.on("progress",this.processProgress.bind(this)),this.socket.on("error",this.processError.bind(this))}},{key:"processVotes",value:function(t){t.settings=W(t.settings),this.cache=Object.assign(this.cache,t);var e=this.clean();if(e){var a=this.format(e);this.setState({progress:"",result:a})}else this.setState({progress:"[ERROR]",result:"Thread is not compatible with this tool."})}},{key:"processProgress",value:function(t){var e=t.currentPage,a=t.lastPage,n=t.notes;e&&a&&this.setState({progress:"[".concat(Math.round(t.currentPage/t.lastPage*100),"%]")}),n&&this.setState({result:"".concat(n)})}},{key:"processError",value:function(t){this.setState({progress:"[ERROR]",result:t.type})}},{key:"onFormSubmit",value:function(t){t.preventDefault();var e=t.target.url.value;this.socket.emit("votecount",{url:e}),this.setState({progress:"[0%]",result:"Pending Result..."})}},{key:"onAddField",value:function(t){console.log(t)}},{key:"render",value:function(){return Object(n.jsx)(x,{title:"Vote Counter",children:[Object(n.jsx)(C,{onSubmit:this.onFormSubmit.bind(this),submitText:"Generate Vote Count",children:[{name:"url",label:"Game URL",type:"text"}]},"votecountForm"),Object(n.jsxs)("div",{className:"modalResult",children:[Object(n.jsxs)("h3",{children:["Result ",Object(n.jsx)("span",{children:this.state.progress})]}),Object(n.jsx)("textarea",{value:this.state.result,readOnly:!0})]},"result")]})}},{key:"clean",value:function(){var t={votes:{},wagons:{},orderedWagons:[],notVoting:[],majority:null};if(this.cache.settings.players.length>=1)for(var e in this.cache.voteCount){t.votes[e]||(t.votes[e]={}),t.wagons[e]||(t.wagons[e]={});for(var a in t.notVoting=this.getAlive(),t.majority=Math.ceil(t.notVoting.length/2),this.cache.voteCount[e]){for(var n,s=this.cache.voteCount[e][a],r=null,o=null,i=0;i<s.length;i++){var c=new D(s[i],e);c.clean(this.cache.settings),void 0!==c.vote.valid&&(o=c.vote.valid?c.getNewest(o):null),r=c.getNewest(r)}if(null===(n=o)||void 0===n?void 0:n.isValid(this.cache.settings)){var l=t.notVoting.indexOf(o.author);t.notVoting.splice(l,1),t.votes[e][a]={last:r,valid:o},t.wagons[e][o.vote.valid]||(t.wagons[e][o.vote.valid]=[]);var h=t.wagons[e][o.vote.valid];h.push(o),h=R(h),t.wagons[e][o.vote.valid]=h}}for(var u in t.wagons[e]){var d=this.sortWagonByPostNumber(t.wagons[e][u]);t.orderedWagons[e]||(t.orderedWagons[e]=[]),t.orderedWagons[e][d.length]||(t.orderedWagons[e][d.length]={}),t.orderedWagons[e][d.length][u]=d}t.orderedWagons[e].reverse(),console.log(t.orderedWagons)}return this.cache.settings.players.length>=1?t:null}},{key:"sortWagonByPostNumber",value:function(t){for(var e=t,a=e.length,n=0;n<a;n++)for(var s=0;s<a-n-1;s++)if(e[s].number>e[s+1].number){var r=e[s];e[s]=e[s+1],e[s+1]=r}return console.log(e),e}},{key:"format",value:function(t){var e=t.wagons,a=t.notVoting,n=t.orderedWagons,s=t.majority,r=this.cache.settings,o=r.edash,i=r.edashOnTop,c="";for(var l in e){for(var h="[area=VC]",u=n[l],d=0;d<u.length;d++)for(var b in u[d]){for(var v=u[d][b],m="[b]".concat(b,"[/b] (").concat(v.length,") -> "),j=0;j<v.length;j++)j>0&&(m+=", "),m+="".concat(v[j].author);var p=s-v.length;(d<=i-1||p<=o)&&(m+=p<=0?" [ELIMINATED]":" [E-".concat(p,"]")),h+="".concat(m,"\n")}if(a.length>0){h+="\n[b]Not Voting[/b] (".concat(a.length,") -> ");for(var g=0;g<a.length;g++)g>0&&(h+=", "),h+="".concat(a[g])}c+=h+="".concat(this.cache.settings.deadline?"\nDay ends in [countdown]".concat(this.cache.settings.deadline,"[/countdown]"):"","[/area]")}return c}},{key:"getAlive",value:function(){for(var t=this.cache.settings,e=t.players,a=t.dead,n=[],s=0;s<e.length;s++){var r=this.getRootAuthor(e[s]);L(r,n)||L(r,a)||n.push(r)}return n}},{key:"checkValid",value:function(t,e){var a,n=t.number>parseInt(this.cache.settings.days[this.cache.settings.days.length-1]),s=!1,r=Object(w.a)(this.cache.settings.dead);try{for(r.s();!(a=r.n()).done;){var o=a.value,i=this.rootUser(o),c=this.rootUser(t.author);i.target===c.target&&(s=!0)}}catch(l){r.e(l)}finally{r.f()}return n&&!s}},{key:"isValidVote",value:function(t){var e=!1;if(t){var a=this.rootUser(t);a.rating,this.cache.settings.correctionWeight,this.cache.settings.alias[a.target]&&(e=!0)}return e}},{key:"rootUser",value:function(t){return Object(T.findBestMatch)(t,this.cache.settings.totalnames).bestMatch}},{key:"getRootAuthor",value:function(t){var e=Object(T.findBestMatch)(t,this.cache.settings.totalnames).bestMatch;return this.cache.settings.alias[e.target]||e.target}}]),a}(l.a.Component);function L(t,e){for(var a=0;a<e.length;a++)if(e[a]===t)return!0;return!1}var M=function(t){var e=t.child;return Object(n.jsx)("div",{className:"component",children:e})};var F=function(t){var e=t.name,a=t.onclick;return Object(n.jsx)("div",{className:"sidebarButton",onClick:a,children:e})},U=a(50),G=a.n(U),B={template:"[quote][b][size=200][color={{rcolour}}]{{align}} {{rname}}[/color][/size][/b]\n\n{{abilities}}\n\n{{wincon}}[/quote]"},_=function(t){Object(o.a)(a,t);var e=Object(i.a)(a);function a(t){var n;return Object(s.a)(this,a),(n=e.call(this,t)).formSubmit=null===t||void 0===t?void 0:t.formSubmit,n}return Object(r.a)(a,[{key:"render",value:function(){return Object(n.jsx)(C,{onSubmit:this.formSubmit.bind(this),submitText:"Import",children:[Object(n.jsx)(k,{child:Object(n.jsx)(S,{name:"file",label:"Upload CSV",type:"file"})},"file")]})}}]),a}(l.a.Component),H=function(t){Object(o.a)(a,t);var e=Object(i.a)(a);function a(t){var n;return Object(s.a)(this,a),(n=e.call(this,t)).onChange=t.onChange,n.template=t.template||"",n}return Object(r.a)(a,[{key:"render",value:function(){return Object(n.jsx)("div",{className:"component modalForm",children:Object(n.jsxs)("form",{onSubmit:function(t){return t.preventDefault()},children:[Object(n.jsx)("label",{htmlFor:"template",children:"Role Template"}),Object(n.jsx)("textarea",{name:"template",onChange:this.onChange,children:this.template}),Object(n.jsx)("input",{type:"submit",value:"Process Role Cards"})]})})}}]),a}(l.a.Component),J=function(t){Object(o.a)(a,t);var e=Object(i.a)(a);function a(){var t;return Object(s.a)(this,a),(t=e.call(this)).state={showImport:!1,showGlobals:!1,showTemplate:!1,roleData:[]},t.socket=O(),t}return Object(r.a)(a,[{key:"toggleImport",value:function(){this.setState({import:!this.state.showImport})}},{key:"toggleGlobal",value:function(){this.setState({globals:!this.state.showGlobals})}},{key:"toggleTemplate",value:function(){this.setState({template:!this.state.showTemplate})}},{key:"submitImport",value:function(t){var e=this;t.preventDefault();try{var a=t.target.file.files[0];G.a.parse(a,{download:!0,header:!0,skipEmptyLines:!0,complete:function(t){var a,n=[],s=Object(w.a)(t.data);try{for(s.s();!(a=s.n()).done;){var r=a.value;n.push(r)}}catch(o){s.e(o)}finally{s.f()}e.setState({roleData:e.state.roleData})}})}catch(n){console.log("Invalid File")}}},{key:"templateChange",value:function(t){this.setState({template:t.target.value})}},{key:"render",value:function(){return Object(n.jsxs)("div",{className:"rolecard",children:[Object(n.jsxs)("div",{className:"sidebar",children:[Object(n.jsx)(F,{name:"Import",onclick:this.toggleImport.bind(this)}),Object(n.jsx)(F,{name:"Globals",onclick:this.toggleGlobal.bind(this)}),Object(n.jsx)(F,{name:"Process",onclick:this.toggleTemplate.bind(this)})]}),Object(n.jsxs)("div",{className:"content",children:[this.state.showImport&&Object(n.jsx)(M,{child:Object(n.jsx)(_,{formSubmit:this.submitImport.bind(this)})}),this.state.showGlobals&&Object(n.jsx)(M,{child:Object(n.jsx)("span",{children:"Global Component"})}),this.state.showTemplate&&Object(n.jsx)(M,{child:Object(n.jsx)(H,{onChange:this.templateChange.bind(this),template:B.template})})]})]})}}]),a}(c.Component),q=function(t){Object(o.a)(a,t);var e=Object(i.a)(a);function a(){return Object(s.a)(this,a),e.apply(this,arguments)}return Object(r.a)(a,[{key:"render",value:function(){return Object(n.jsx)(x,{title:"Credits and Attributions",children:[Object(n.jsxs)("span",{children:["Uicons by ",Object(n.jsx)("a",{href:"https://www.flaticon.com/uicons",children:"Flaticon"})]})]})}}]),a}(l.a.Component),K=function(t){Object(o.a)(a,t);var e=Object(i.a)(a);function a(t){var n;return Object(s.a)(this,a),(n=e.call(this,t)).state={},n}return Object(r.a)(a,[{key:"render",value:function(){return Object(n.jsx)(n.Fragment,{children:Object(n.jsx)(d.a,{children:Object(n.jsxs)(b.d,{children:[Object(n.jsx)(b.b,{exact:!0,path:"/",component:m}),Object(n.jsx)(b.b,{exact:!0,path:"/replacement",component:N}),Object(n.jsx)(b.b,{exact:!0,path:"/votecount",component:I}),Object(n.jsx)(b.b,{exact:!0,path:"/rolecard",component:J}),Object(n.jsx)(b.b,{exact:!0,path:"/credits",component:q}),Object(n.jsx)(b.b,{exact:!0,path:"/test",component:I}),Object(n.jsx)(b.b,{path:"/404",component:j}),Object(n.jsx)(b.a,{to:"/404"})]})})})}}]),a}(l.a.Component);u.a.render(Object(n.jsx)(K,{}),document.getElementById("root"))}},[[96,1,2]]]);
//# sourceMappingURL=main.0af6d7ea.chunk.js.map