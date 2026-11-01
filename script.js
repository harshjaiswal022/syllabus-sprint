const S=[
["DAA","Design and Analysis of Algorithms",[
"Introduction, recurrences, Master theorem, sorting (merge, quick, heap)",
"Advanced data structures: B-trees, binomial and Fibonacci heaps",
"Greedy and dynamic programming: Huffman, knapsack, LCS, matrix chain",
"Graph algorithms: MST, shortest paths, max flow",
"NP-completeness, string matching, approximation"]],
["DBMS","Database Management Systems",[
"Introduction, ER model, database architecture",
"Relational model, relational algebra, SQL",
"Functional dependencies and normalization",
"Transactions, ACID, concurrency control",
"Indexing, recovery, deadlocks"]],
["DWDM","Data Warehouse and Data Mining",[
"Data warehouse basics, architecture, OLAP",
"ETL, star and snowflake schema, data cubes",
"Data mining intro and preprocessing",
"Association rules: Apriori, FP-growth",
"Classification and clustering"]],
["Cloud","Cloud Computing",[
"Introduction, characteristics, history",
"Service and deployment models (IaaS, PaaS, SaaS)",
"Virtualization and resource management",
"Cloud security, issues, SLAs",
"Platforms (AWS, Azure, GCP), MapReduce, Hadoop"]],
["AI","Artificial Intelligence",[
"Introduction, intelligent agents, problem solving",
"Heuristic search, game playing",
"Knowledge representation, logic",
"Uncertainty, probabilistic reasoning",
"Learning, expert systems, NLP basics"]]
];
const K=[["lec","Lecture watched",""],["notes","Notes written",""],["learn","Learned",""],["focus","Focus more","f"],["rev","Revise more","r"]];
const DM=[1,1,2,2,3];
let st={},filter=-1;
try{st=JSON.parse(localStorage.getItem("syl20")||"{}")}catch(e){st={}}
const save=()=>{try{localStorage.setItem("syl20",JSON.stringify(st))}catch(e){}};
const $=id=>document.getElementById(id);
const app=$("app"),strip=$("strip"),nav=$("nav");

// nav
["All",...S.map(s=>s[0])].forEach((t,i)=>{
  const b=document.createElement("button");b.textContent=t;b.dataset.f=i-1;if(i===0)b.className="on";nav.appendChild(b);
});

// cards
S.forEach((s,si)=>{
  const c=document.createElement("section");c.className="card s"+si;c.id="sub"+si;c.dataset.si=si;
  c.innerHTML=`<header><div class="code">${s[0]}</div><div class="hd"><h2>${s[1]}</h2><span>Days ${si*3+1} to ${si*3+3}</span></div><div class="pb"><em id="pc${si}">0/15</em><div><i id="pf${si}"></i></div></div></header>`;
  s[2].forEach((t,ui)=>{
    const id=si+"-"+ui;
    const u=document.createElement("div");u.className="unit";u.id="u"+id;
    u.innerHTML=`<div class="ut"><span class="d">D${si*3+DM[ui]}</span><b>Unit ${ui+1}: ${t}</b></div><div class="chips">`+
      K.map(k=>`<label class="${k[2]}"><input type="checkbox" data-k="${id}-${k[0]}"${st[id+"-"+k[0]]?" checked":""}><span>${k[1]}</span></label>`).join("")+
      `</div><input class="note" data-n="${id}" placeholder="weak topics, doubts, formulas to remember">`;
    u.querySelector(".note").value=st["n"+id]||"";
    c.appendChild(u);
  });
  app.appendChild(c);
});

// day strip
for(let d=1;d<=20;d++){
  const b=document.createElement("button");b.className="cell";b.dataset.d=d;
  let cap;
  if(d<=15){const si=Math.floor((d-1)/3);b.classList.add("s"+si);cap=S[si][0]}
  else cap=d<20?"rev":"mock";
  b.innerHTML=`<b>${d}</b><small>${cap}</small>`;
  strip.appendChild(b);
}

function dayNow(){
  if(!st.start)return null;
  const [y,m,d]=st.start.split("-").map(Number),a=new Date(y,m-1,d),n=new Date();n.setHours(0,0,0,0);
  return Math.round((n-a)/864e5)+1;
}

function calc(){
  let T=0,D=0;
  const dayTot={},dayDone={};
  S.forEach((s,si)=>{
    let sd=0;
    s[2].forEach((t,ui)=>{
      let n=0;
      ["lec","notes","learn"].forEach(k=>{if(st[si+"-"+ui+"-"+k])n++});
      sd+=n;
      $("u"+si+"-"+ui).classList.toggle("ok",n===3);
      const dd=si*3+DM[ui];dayTot[dd]=(dayTot[dd]||0)+3;dayDone[dd]=(dayDone[dd]||0)+n;
    });
    $("pc"+si).textContent=sd+"/15";
    $("pf"+si).style.width=(sd/15*100)+"%";
    T+=15;D+=sd;
  });
  const p=Math.round(D/T*100);
  $("rtxt").textContent=p+"%";
  $("rfg").style.strokeDashoffset=175.9*(1-p/100);
  const now=dayNow();
  [...strip.children].forEach(b=>{
    const d=+b.dataset.d;let f;
    if(d<=15)f=dayDone[d]/dayTot[d];else f=st["rd"+d]?1:0;
    b.style.setProperty("--p",Math.round(f*100)+"%");
    b.classList.toggle("done",f===1);
    b.classList.toggle("today",now===d);
  });
  $("dayline").textContent=now===null?"Set a start date":now<1?"Starts in "+(1-now)+(now===0?" day":" days"):now>20?"Sprint over":"Day "+now+" of 20";
  queue();
}

function queue(){
  let h="";
  S.forEach((s,si)=>s[2].forEach((t,ui)=>{
    const id=si+"-"+ui,f=st[id+"-focus"],r=st[id+"-rev"];
    if(!f&&!r)return;
    const n=st["n"+id];
    h+=`<div class="qi s${si}"><div class="n"><b>${s[0]}</b> · Unit ${ui+1}: ${t}${n?`<small>${n.replace(/</g,"&lt;")}</small>`:""}</div>${f?'<span class="tag tf">focus more</span>':""}${r?'<span class="tag tr">revise more</span>':""}</div>`;
  }));
  $("qbody").innerHTML=h||'<div class="empty">Nothing flagged yet. Mark a unit as focus more or revise more and it shows up here.</div>';
}

function show(f){
  filter=f;
  [...nav.children].forEach(b=>b.classList.toggle("on",+b.dataset.f===f));
  [...app.children].forEach(c=>c.style.display=(f<0||+c.dataset.si===f)?"":"none");
}

app.addEventListener("change",e=>{if(e.target.dataset.k){st[e.target.dataset.k]=e.target.checked;save();calc()}});
app.addEventListener("input",e=>{if(e.target.dataset.n){st["n"+e.target.dataset.n]=e.target.value;save();queue()}});
nav.addEventListener("click",e=>{const b=e.target.closest("button");if(b)show(+b.dataset.f)});
strip.addEventListener("click",e=>{
  const b=e.target.closest(".cell");if(!b)return;
  const d=+b.dataset.d;
  if(d<=15){const si=Math.floor((d-1)/3);show(si);$("sub"+si).scrollIntoView({behavior:"smooth"})}
  else{st["rd"+d]=!st["rd"+d];save();calc();if(d<20)$("queue").scrollIntoView({behavior:"smooth"})}
});
$("start").value=st.start||"";
$("start").addEventListener("change",e=>{st.start=e.target.value;save();calc()});
$("reset").onclick=()=>{if(confirm("Clear all progress and notes?")){st={};save();location.reload()}};
calc();

// theme toggle
$("theme").addEventListener("click",()=>{
  const cur=document.documentElement.dataset.theme||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");
  const next=cur==="dark"?"light":"dark";
  document.documentElement.dataset.theme=next;
  try{localStorage.setItem("syl20theme",next)}catch(e){}
});

// backup
$("export").addEventListener("click",()=>{
  const a=document.createElement("a");
  a.href=URL.createObjectURL(new Blob([JSON.stringify(st,null,2)],{type:"application/json"}));
  a.download="syllabus-sprint-backup.json";a.click();URL.revokeObjectURL(a.href);
});
$("import").addEventListener("change",e=>{
  const f=e.target.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=()=>{
    try{const d=JSON.parse(r.result);if(typeof d!=="object"||d===null)throw 0;st=d;save();location.reload()}
    catch(x){alert("That file is not a valid backup.")}
  };
  r.readAsText(f);
});

