/* CareerPath iOS 40M — plain JavaScript, works offline with localStorage. */
(() => {
  'use strict';
  const D = window.CareerPathData;
  if (!D || !Array.isArray(D.days)) { document.getElementById('app').textContent='Không tải được dữ liệu lộ trình.'; return; }
  const STORAGE_KEY = 'careerpath-ios40m:v1';
  const PAGES = [
    {id:'today', name:'Hôm nay',icon:'◫'},
    {id:'roadmap', name:'Lộ trình 125 ngày',icon:'▦'},
    {id:'lead', name:'Tech Lead & Claude',icon:'↑'},
    {id:'skills', name:'Bản đồ kỹ năng',icon:'◈'},
    {id:'project', name:'Portfolio',icon:'⌘'},
    {id:'interview', name:'Phỏng vấn',icon:'✳'},
    {id:'apply', name:'Ứng tuyển',icon:'↗'},
    {id:'resources', name:'Tài nguyên',icon:'⌁'},
    {id:'settings', name:'Dữ liệu & cài đặt',icon:'⚙'}
  ];
  const localIso = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  const today = () => localIso(new Date());
  const dateUTC = iso => new Date(`${iso}T12:00:00Z`);
  const dateFormat = (iso, opts={day:'numeric',month:'long',year:'numeric'}) => new Intl.DateTimeFormat('vi-VN',{...opts,timeZone:'UTC'}).format(dateUTC(iso));
  const addDays = (iso,n) => {const d=dateUTC(iso); d.setUTCDate(d.getUTCDate()+n); return d.toISOString().slice(0,10);};
  const daysDiff = (from,to) => Math.round((dateUTC(to)-dateUTC(from))/86400000);
  const clamp = (x,a,b) => Math.max(a,Math.min(b,x));
  const escapeHtml = s => String(s == null ? '' : s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeLink = url => /^(https?:\/\/)/i.test(String(url||''))?escapeHtml(url):'#';
  const initialDate = today()<D.START?D.START:today()>D.END?D.END:today();
  const freshState = () => ({version:1, page:'today',selectedDate:initialDate,checks:{},notes:{},proofLinks:{},seconds:{},questions:{},applications:[],projectUrl:'',weekOpen:1,
    timer:{duration:1500,remaining:1500,running:false,endAt:0,startRemaining:0,date:initialDate},lastOpenedDate:today()});
  function loadState(){
    try {
      const raw=localStorage.getItem(STORAGE_KEY);
      if(!raw) return freshState();
      const d=JSON.parse(raw), base=freshState();
      if(!d || typeof d!=='object' || Array.isArray(d)) return base;
      const o={...base,...d};
      for(const key of ['checks','notes','proofLinks','seconds','questions']) if(!o[key] || typeof o[key]!=='object' || Array.isArray(o[key])) o[key]={};
      if(!Array.isArray(o.applications)) o.applications=[];
      if(!PAGES.some(x=>x.id===o.page)) o.page='today';
      if(!D.days.some(x=>x.date===o.selectedDate)) o.selectedDate=initialDate;
      if(o.lastOpenedDate && o.lastOpenedDate!==today() && o.page==='today')o.selectedDate=today()<D.START?D.START:today()>D.END?D.END:today();
      o.lastOpenedDate=today();
      o.timer={...base.timer,...(d.timer||{})};
      if(![1500,3000,7200].includes(o.timer.duration)) o.timer.duration=1500;
      if(!Number.isFinite(o.timer.remaining)) o.timer.remaining=o.timer.duration;
      return o;
    } catch(e){ return freshState(); }
  }
  let s=loadState();
  let roadmapQuery='',qaCategory='Tất cả';
  const $app=document.getElementById('app');
  function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(s));}catch(e){toast('Không lưu được dữ liệu. Hãy kiểm tra dung lượng trình duyệt.');}}
  function toast(message){const old=document.querySelector('.toast');if(old)old.remove();const el=document.createElement('div');el.className='toast';el.setAttribute('role','status');el.textContent=message;document.body.append(el);setTimeout(()=>el.remove(),3600);}
  function dayByDate(iso){return D.days.find(d=>d.date===iso)||D.days[0];}
  function isTaskDone(date,id){return Boolean(s.checks[date]&&s.checks[date][id]);}
  function doneCount(date){return ['learn','build','review'].filter(id=>isTaskDone(date,id)).length;}
  function isDone(date){return doneCount(date)===3;}
  function totalDone(){return D.days.reduce((n,d)=>n+(isDone(d.date)?1:0),0);}
  function totalSeconds(){return Object.values(s.seconds).reduce((a,b)=>a+(Number.isFinite(+b)?Math.max(0,+b):0),0);}
  function currentStreak(){let day=today()>D.END?D.END:today();if(day<D.START)return 0;if(!isDone(day))day=addDays(day,-1);let n=0;while(day>=D.START && isDone(day)){n++;day=addDays(day,-1);}return n;}
  function weekPercent(week){const a=D.days.filter(x=>x.week===week);return a.length?Math.round(100*a.filter(x=>isDone(x.date)).length/a.length):0;}
  function viewProgress(n,den){return `<div class="mini-progress" role="progressbar" aria-valuenow="${n}" aria-valuemin="0" aria-valuemax="${den}"><span style="width:${den?clamp(100*n/den,0,100):0}%"></span></div>`;}
  function selected(){return dayByDate(s.selectedDate);}
  function nav(to){if(!PAGES.some(x=>x.id===to))return;s.page=to;save();render();window.scrollTo({top:0,behavior:'smooth'});}
  function goToDate(date){if(!D.days.some(x=>x.date===date))return;s.selectedDate=date;s.page='today';s.weekOpen=dayByDate(date).week;save();render();window.scrollTo({top:0,behavior:'smooth'});}
  function shell(inner){
    const day=today(), dayTitle=new Intl.DateTimeFormat('vi-VN',{weekday:'long',day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date());
    $app.innerHTML=`<div class="app-shell"><aside class="sidebar">
      <a class="brand" href="#today" data-page="today" aria-label="CareerPath Trang chủ"><span class="brand-mark">C</span><span class="brand-copy"><strong>careerpath<span style="color:var(--lime)">.</span></strong><small>IOS → 40M</small></span></a>
      <nav aria-label="Điều hướng chính"><div class="side-label">WORKSPACE</div><div class="nav-stack">${PAGES.map(p=>`<button class="nav-link ${s.page===p.id?'active':''}" data-page="${p.id}" title="${p.name}" aria-current="${s.page===p.id?'page':'false'}"><span class="nav-icon" aria-hidden="true">${p.icon}</span><span class="nav-text">${p.name}</span></button>`).join('')}</div></nav>
      <div class="side-bottom"><div class="side-goal"><div class="eyebrow">ĐÍCH ĐẾN</div><strong>40.000.000₫</strong><p>Senior iOS Developer<br/>Sau Tết 2027 · 2 giờ/ngày</p>${viewProgress(totalDone(),D.days.length)}<small style="color:var(--muted)">${totalDone()}/${D.days.length} buổi đã xong</small></div><div class="side-footer">Sản phẩm tự học • Dữ liệu lưu trên máy</div></div>
    </aside><main class="main"><header class="topbar"><span class="eyebrow">CAREER GROWTH / 2026—2027</span><div class="topbar-right"><span class="date-chip">${escapeHtml(dayTitle)}</span><span class="avatar" title="iOS Developer">iOS</span></div></header>${inner}
    <div class="footer">CareerPath iOS 40M · Kế hoạch học tập, không phải bảo đảm có offer hay lương 40 triệu.</div></main></div>`;
    updateTimerUI();
  }
  const header=(heading,sub,actions='')=>`<div class="page-head"><div><div class="eyebrow">TARGET: SENIOR IOS · 40M / THÁNG</div><h1>${heading}</h1><p>${sub}</p></div>${actions?`<div class="head-side">${actions}</div>`:''}</div>`;
  function stats(){
    const t=today(), diff=daysDiff(t,D.TET);
    return `<div class="stats-grid">
      <div class="card stat"><span class="stat-spark">◎</span><div class="stat-label">Hoàn thành</div><div class="stat-number accent-lime">${totalDone()}<span class="unit"> / ${D.days.length} ngày</span></div><div class="stat-note">${Math.round(100*totalDone()/D.days.length)}% hành trình</div></div>
      <div class="card stat"><span class="stat-spark">◷</span><div class="stat-label">Thời gian đã học</div><div class="stat-number accent-lav">${(totalSeconds()/3600).toFixed(1)}<span class="unit"> giờ</span></div><div class="stat-note">Mục tiêu ${D.days.length*2} giờ · ${currentStreak()} ngày liên tiếp</div></div>
      <div class="card stat"><span class="stat-spark">◈</span><div class="stat-label">Mốc Tết 2027</div><div class="stat-number accent-blue">${Math.abs(diff)}<span class="unit"> ngày</span></div><div class="stat-note">${diff>=0?'Còn tới 06/02/2027':'Đã qua 06/02/2027'}</div></div>
      <div class="card stat"><span class="stat-spark">↗</span><div class="stat-label">Thu nhập mục tiêu</div><div class="stat-number accent-yellow">40<span class="unit"> triệu / tháng</span></div><div class="stat-note">Từ 25 triệu → mục tiêu tăng 60%</div></div>
    </div>`;
  }
  function renderToday(){
    const d=selected(),wc=weekPercent(d.week),res=D.RESOURCES[d.resource],count=doneCount(d.date),week=D.WEEKS[d.week-1];
    const startDay=Math.max(0,Math.min(D.days.length-7,d.id-3));
    const lineDays=D.days.slice(startDay,startDay+7);
    return header('Học đúng việc. Tiến từng ngày.','125 buổi học × 120 phút · Swift → Portfolio → Phỏng vấn → Offer',`<button class="btn" data-action="jump-today">↺ Về hôm nay</button><button class="btn primary" data-page="roadmap">Xem lộ trình ↗</button>`)+stats()+
    `<div class="dashboard-columns"><section class="column-stack"><div class="card learning-hero"><div class="hero-row"><div class="tag-list"><span class="badge lime">TUẦN ${d.week} / ${D.WEEKS.length}</span><span class="badge lav">${escapeHtml(d.phase)}</span><span class="badge">${d.date===today()?'HÔM NAY':dateFormat(d.date,{day:'2-digit',month:'2-digit'})}</span></div><span class="hero-date">Ngày ${d.id+1}/${D.days.length}</span></div>
      <h2 class="hero-title">${escapeHtml(d.title)}</h2><p class="hero-description">${escapeHtml(d.weekTitle)} · 2 giờ tập trung vào kỹ năng tuyển dụng thực tế.</p>
      <div class="tasks">${d.tasks.map(t=>`<label class="task ${isTaskDone(d.date,t.id)?'done':''}"><input type="checkbox" data-date="${d.date}" data-task="${t.id}" ${isTaskDone(d.date,t.id)?'checked':''}/><div><div class="task-label">${escapeHtml(t.label)}</div><div class="task-detail">${escapeHtml(t.detail)}</div></div><span class="task-time">${t.minutes} PHÚT</span></label>`).join('')}</div>
      <div class="question-block"><span class="section-eyebrow" style="color:var(--lav)">SENIOR INTERVIEW QUESTION</span><div style="margin-top:6px">“${escapeHtml(d.question)}”</div></div>
      <div class="reference-list"><span class="small-label">Tài liệu:</span><a href="${safeLink(res.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(res.name)} ↗</a></div>
      <div class="hero-footer"><div style="flex:1;min-width:170px"><div class="small-label">Đầu ra bắt buộc</div><div class="hero-output">${escapeHtml(d.proof)}</div></div><span class="badge ${count===3?'lime':'blue'}">${count===3?'✓ ĐÃ HOÀN THÀNH':`${count}/3 nhiệm vụ`}</span></div>
      </div><div class="card"><div class="card-top"><h3 class="card-title">Nhật ký & bằng chứng</h3><span class="badge">Lưu tự động</span></div>
      <label class="field-label" for="proofLink">Link commit / PR / video demo</label><input id="proofLink" class="text-input" type="url" data-proof-date="${d.date}" placeholder="https://github.com/…" value="${escapeHtml(s.proofLinks[d.date]||'')}" />
      <label class="field-label" for="noteInput">Hôm nay đã học được gì? Vướng mắc nào cần xử lý?</label><textarea id="noteInput" class="note-input" data-note-date="${d.date}" placeholder="Ví dụ: actor reentrancy làm thay đổi trạng thái sau await; cần test thêm…">${escapeHtml(s.notes[d.date]||'')}</textarea><div class="note-meta">Mẹo: mỗi ngày ghi 2–3 dòng kết luận và một bằng chứng code. Checklist là tự đánh giá, không tự chứng minh khả năng Senior.</div></div>
      </section><aside class="column-stack"><div class="card timer-card"><div class="card-top timer-head"><h3 class="card-title">Deep work timer</h3><span class="badge lime">FOCUS MODE</span></div>
      <div class="timer-ring" id="timerRing"><div class="timer-content"><span class="timer-time" id="timerTime">25:00</span><span class="timer-caption">Không gián đoạn</span></div></div>
      <div class="timer-sizes">${[[1500,'25 phút'],[3000,'50 phút'],[7200,'120 phút']].map(([val,label])=>`<button class="timer-mode ${s.timer.duration===val?'active':''}" data-timer-mode="${val}" ${s.timer.running?'disabled':''}>${label}</button>`).join('')}</div>
      <div class="timer-controls"><button class="btn primary" id="timerToggle" data-action="timer-toggle">${s.timer.running?'Ⅱ Tạm dừng':'▶ Bắt đầu học'}</button><button class="btn" data-action="timer-reset">↺ Đặt lại</button></div>
      <div class="timer-total"><span>Đã ghi hôm ${dateFormat(d.date,{day:'2-digit',month:'2-digit'})}</span><strong id="loggedToday">${Math.floor((s.seconds[d.date]||0)/60)} / 120 phút</strong></div>
      ${viewProgress(Math.min(7200,s.seconds[d.date]||0),7200)}</div>
      <div class="card"><div class="card-top"><h3 class="card-title">7 ngày gần nhất</h3><span class="card-sub">Chọn ngày</span></div>
      <div class="daily-nav">${lineDays.map(x=>`<button class="day-pill ${x.date===d.date?'active':''} ${x.date===today()?'today':''} ${isDone(x.date)?'done':''}" data-date-open="${x.date}" aria-label="${dateFormat(x.date)} ${x.title}"><span class="dayofweek">${dateFormat(x.date,{weekday:'short'})}</span><span class="daynum">${dateFormat(x.date,{day:'2-digit'})}</span></button>`).join('')}</div>
      <div class="weekly-progress"><div class="meta"><span>Tiến độ tuần ${d.week}</span><strong>${wc}%</strong></div>${viewProgress(wc,100)}</div>
      <div class="week-summary"><strong>Mục tiêu tuần:</strong><div style="margin-top:5px">${escapeHtml(week.outcome)}</div></div></div>
      <div class="card milestone-card"><div class="section-eyebrow">NEXT MILESTONE</div><div class="milestone-name">${d.date<D.TET?'Portfolio hoàn chỉnh trước Tết':'Phỏng vấn & ứng tuyển sau Tết'}</div><div class="milestone-target">${d.date<D.TET?'Trước 06/02/2027: code, test, architecture, video demo.':'Nửa cuối tháng 2–3/2027: CV, mock interviews, hồ sơ và offer.'}</div><div class="check-item">Mỗi ngày một bằng chứng để kể khi phỏng vấn</div><div class="check-item">Ưu tiên hiểu sâu thay vì học lan man</div></div>
      </aside></div>`;
  }
  function renderRoadmap(){
    let query=roadmapQuery.trim().toLocaleLowerCase('vi');
    const filtered=D.WEEKS.map(w=>({...w,visibleDays:w.days.map(id=>D.days[id]).filter(d=> !query || [w.title,w.phase,d.title,d.study,d.practice].some(x=>x.toLocaleLowerCase('vi').includes(query)))})).filter(w=>!query || w.visibleDays.length);
    return header('Bản đồ 125 ngày','18 tuần có điểm ra rõ ràng · bắt đầu 10/11/2026, tổng kết 14/03/2027',`<button class="btn primary" data-action="jump-today">Đi đến buổi hôm nay ↗</button>`)+
    `<div class="phase-grid">${D.phases.map(p=>{const x=D.days.filter(d=>d.phase===p.label);const n=x.filter(d=>isDone(d.date)).length;return `<div class="phase-card"><strong>${p.label}</strong><small>${x.length} buổi · ${n} đã xong</small><div style="margin-top:10px">${viewProgress(n,x.length)}</div></div>`}).join('')}</div>
    <div class="roadmap-layout"><div><div class="search-row"><input id="roadmapSearch" class="text-input" type="search" placeholder="Tìm: actor, testing, MVVM, CI/CD…" value="${escapeHtml(roadmapQuery)}"/><span class="fineprint">Chọn một buổi để xem checklist chi tiết</span></div>
    ${filtered.length?filtered.map(w=>{const open=!!query || s.weekOpen===w.id;const complete=w.days.filter(id=>isDone(D.days[id].date)).length;return `<div class="roadmap-week"><button class="week-toggle" data-week="${w.id}" aria-expanded="${open}"><div class="week-index">${String(w.id).padStart(2,'0')}</div><div><div class="week-title">${escapeHtml(w.title)}</div><div class="week-subtitle">${escapeHtml(w.phase)} · ${dateFormat(D.days[w.days[0]].date,{day:'2-digit',month:'2-digit'})} – ${dateFormat(D.days[w.days[w.days.length-1]].date,{day:'2-digit',month:'2-digit'})}</div></div><span class="week-right"><span>${complete}/${w.days.length} ngày</span><span>${open?'⌃':'⌄'}</span></span></button>
      ${open?`<div class="week-list"><div class="week-summary"><strong>Đầu ra:</strong> ${escapeHtml(w.outcome)}</div>${w.visibleDays.map(d=>`<button class="week-day" data-date-open="${d.date}"><span class="date">${dateFormat(d.date,{day:'2-digit',month:'2-digit'})}</span><span class="${isDone(d.date)?'tick':'none'}">${isDone(d.date)?'✓':'○'}</span><span class="name">${escapeHtml(d.title)}</span><span style="color:var(--soft)">120′ ↗</span></button>`).join('')}</div>`:''}</div>`}).join(''):'<div class="empty">Không tìm thấy bài học phù hợp. Thử từ khóa khác.</div>'}</div>
    <aside class="column-stack sticky-side"><div class="card"><h3 class="card-title">Tổng tiến độ</h3><div class="stat-number accent-lime" style="margin-top:13px">${Math.round(totalDone()/D.days.length*100)}%</div><div class="progress-total"><div style="width:${Math.round(totalDone()/D.days.length*100)}%"></div></div><div class="card-sub">${totalDone()} / ${D.days.length} buổi · ${D.days.length*2} giờ kế hoạch</div><div class="divider"></div><div class="section-eyebrow">CÁC MỐC CHÍNH</div><div class="legend">${[['24/11','Swift core + ARC'],['22/12','Concurrency / SwiftUI / Networking'],['26/01','Testing, performance, CI/CD'],['06/02','Tết · Portfolio đã chuẩn bị'],['15/02','Bắt đầu ứng tuyển chủ động'],['14/03','Đánh giá offer / kế hoạch B']].map(([d,t])=>`<div class="legend-row"><span class="legend-dot"></span><div><strong>${d}</strong><small>${t}</small></div></div>`).join('')}</div></div><div class="callout"><b>Luật 2 giờ:</b> 30 phút học kiến thức, 70 phút thực hành code, 20 phút tự giải thích và lưu bằng chứng. Có thể hoán đổi buổi để phù hợp lịch thực tế.</div></aside></div>`;
  }
  function renderSkills(){return header('Bản đồ kỹ năng Senior iOS','Đây là tiến độ hoàn thành bài học, không phải điểm đánh giá trình độ thực tế.')+
    `<div class="callout" style="margin-bottom:17px"><b>Ưu tiên P0:</b> Swift, Concurrency, UI, Architecture, Networking, Testing, System Design, English và hồ sơ. Kỹ năng P1 bổ trợ để chứng minh năng lực production.</div><div class="skills-grid">${D.SKILLS.map(sk=>{
      const a=D.days.filter(d=>d.skill===sk.id), done=a.filter(d=>isDone(d.date)).length,p=a.length?Math.round(done/a.length*100):0;
      return `<div class="card skill-card"><div class="skill-flex"><span class="skill-icon">${escapeHtml(sk.icon)}</span><div style="flex:1"><div class="skill-name">${escapeHtml(sk.name)}</div><span class="badge ${sk.priority==='P0'?'lime':'lav'}">${sk.priority}</span></div></div><div class="skill-desc">${escapeHtml(sk.target)}</div><div class="skill-score"><span>${done}/${a.length} buổi chuyên biệt</span><strong>${p}%</strong></div>${viewProgress(done,a.length)}<div class="skill-foot"><span>Chứng minh bằng code + câu hỏi phỏng vấn</span><button class="btn small" data-action="skill-open" data-skill="${sk.id}">Học ↗</button></div></div>`;
    }).join('')}</div><h2 class="section-heading">Mốc đánh giá năng lực thật</h2><div class="project-bullets">${[
      ['Code không nhìn tài liệu','Implement network layer, cancellation, một feature SwiftUI trong thời gian giới hạn.'],
      ['Giải thích trade-off','Bảo vệ lựa chọn MVVM/Clean, actor, persistence bằng lý do kỹ thuật.'],
      ['Bằng chứng production','Repo có tests, CI, README và quyết định thiết kế được ghi rõ.'],
      ['Phỏng vấn bằng tiếng Anh','Tự giới thiệu và kể 4 câu chuyện STAR; trả lời câu hỏi follow-up.']
    ].map(([a,b])=>`<div class="project-bullet"><strong>${a}</strong>${b}</div>`).join('')}</div>`;
  }
  function renderProject(){
    const checkpoints=[{week:4,title:'v0.1 — SwiftUI UI flow',desc:'Dashboard, list, add, detail; empty/loading/error states'},{week:6,title:'Networking — APIClient',desc:'URLSession, pagination, auth refresh, retry, caching'},{week:7,title:'Clean modules',desc:'DomainKit/DataKit, DI, ADR, testable view models'},{week:8,title:'Offline-first',desc:'SwiftData, migration, pending sync queue, conflict strategy'},{week:9,title:'Quality tests',desc:'≥25 tests meaningful, XCTest/Swift Testing, UI test'},{week:10,title:'Performance',desc:'Instruments before/after case study'},{week:11,title:'Release pipeline',desc:'GitHub Actions + release checklist, signing nếu có'},{week:12,title:'v1.0 — Portfolio',desc:'README, architecture, demo, docs, bug bash'}];
    return header('Portfolio — SpendWise','Một ứng dụng iOS hoàn chỉnh chứng minh kỹ năng, thay vì 10 tutorial rời rạc.',`<button class="btn primary" data-page="roadmap">Đến tuần xây dựng ↗</button>`)+
    `<div class="card project-hero"><div class="project-head"><div><span class="badge lime">FLAGSHIP PROJECT</span><h2 style="font:700 29px var(--display);letter-spacing:-1px;margin:10px 0">SpendWise iOS</h2><p style="color:var(--muted);max-width:650px;margin:0">Ứng dụng theo dõi chi tiêu offline-first, có kiến trúc modular, sync giả lập, API layer robust, unit/UI tests, profiling và release automation. Dùng dữ liệu demo, không đưa dữ liệu tài chính thật lên repo công khai.</p></div><span class="project-emoji">◈</span></div>
    <div class="project-bullets">${[['Stack','Swift, SwiftUI, UIKit interop, SwiftData, URLSession, Concurrency'],['Architecture','MVVM + Clean layers + initializer DI + SPM modules'],['Quality','Swift Testing / XCTest, XCUITest, Instruments, GitHub Actions'],['Evidence','README, ADR, architecture diagram, video demo, TestFlight nếu khả thi']].map(([t,v])=>`<div class="project-bullet"><strong>${t}</strong>${v}</div>`).join('')}</div></div>
    <h2 class="section-heading">Các mốc giao hàng</h2><div class="card"><div class="proof-list">${checkpoints.map(c=>{const a=D.days.filter(d=>d.week<=c.week),all=a.every(d=>isDone(d.date));const completedWeek=weekPercent(c.week);return `<div class="proof"><div><strong>${escapeHtml(c.title)}</strong><small>${escapeHtml(c.desc)}</small></div><span class="badge ${all?'lime':'lav'}">Tuần ${c.week} · ${completedWeek}%</span></div>`}).join('')}</div>
    <label class="field-label" for="projectUrl">Link GitHub của SpendWise</label><input id="projectUrl" class="text-input" type="url" data-project-url placeholder="https://github.com/username/spendwise-ios" value="${escapeHtml(s.projectUrl||'')}"/><div class="note-meta">Lưu tự động trên trình duyệt. Repo có thể private trong quá trình xây dựng.</div></div>
    <h2 class="section-heading">Rubric portfolio trước khi phỏng vấn</h2><div class="callout"><b>Có thể kể được:</b> Vấn đề → lựa chọn giải pháp → trade-off → test → kết quả đo được. Không đưa số liệu giả vào CV; chỉ dùng số liệu thực tế có thể kiểm chứng.</div>`;
  }
  function renderInterview(){
    const categories=['Tất cả',...new Set(D.QUESTIONS.map(q=>q[0]))];
    const qs=D.QUESTIONS.map(([cat,q],i)=>({cat,q,i})).filter(x=>qaCategory==='Tất cả'||x.cat===qaCategory);
    const reviewed=Object.values(s.questions).filter(Boolean).length;
    return header('Ngân hàng phỏng vấn','24 câu hỏi cốt lõi, gắn với các chủ đề Senior iOS + tình huống production.',`<button class="btn" data-action="jump-today">Học theo kế hoạch ↗</button>`)+
      `<div class="stats-grid"><div class="card stat"><div class="stat-label">Đã tự trả lời</div><div class="stat-number accent-lime">${reviewed}<span class="unit"> / ${D.QUESTIONS.length}</span></div><div class="stat-note">Đánh dấu khi giải thích được thành tiếng</div></div>
      <div class="card stat"><div class="stat-label">Chủ đề</div><div class="stat-number accent-lav">${categories.length-1}</div><div class="stat-note">Technical · Behavioral · Career</div></div>
      <div class="card stat"><div class="stat-label">Giai đoạn</div><div class="stat-number accent-blue">2–3/2027</div><div class="stat-note">Tập trung mock & interviews thật</div></div>
      <div class="card stat"><div class="stat-label">Nguyên tắc</div><div class="stat-number accent-yellow">STAR</div><div class="stat-note">Chứng minh bằng trải nghiệm có thật</div></div></div>
      <div class="search-row"><select class="select-input" id="qaCategory" style="max-width:280px"><option value="Tất cả">Tất cả chủ đề</option>${categories.slice(1).map(c=>`<option value="${escapeHtml(c)}" ${qaCategory===c?'selected':''}>${escapeHtml(c)}</option>`).join('')}</select><span class="fineprint">Click “Đã trả lời” sau khi tự giải thích trong 90–120 giây</span></div>
      <div class="qa-grid">${qs.map(x=>`<div class="qa-card"><div class="qa-category">${escapeHtml(x.cat)}</div><p>${escapeHtml(x.q)}</p><div class="qa-bottom"><span class="badge ${s.questions[x.i]?'lime':'blue'}">${s.questions[x.i]?'✓ Đã ôn':'Chưa ôn'}</span><button class="btn small" data-qa="${x.i}">${s.questions[x.i]?'↺ Làm lại':'✓ Đã trả lời'}</button></div></div>`).join('')}</div>
      <h2 class="section-heading">Cấu trúc trả lời 90 giây</h2><div class="project-bullets">${[['Đặt bối cảnh','Nêu requirement, constraints, scale / rủi ro.'],['Lựa chọn & giải thích','Giải pháp, alternatives, lý do chọn, trade-offs.'],['Chứng minh','Tests, số liệu đo được, failure handling, bài học.'],['Tiếng Anh','Trả lời mạch lạc; hỏi lại khi yêu cầu còn thiếu.']].map(([a,b])=>`<div class="project-bullet"><strong>${a}</strong>${b}</div>`).join('')}</div>`;
  }
  const STATUSES=[['saved','Quan tâm'],['applied','Đã nộp'],['hr','HR screen'],['tech','Tech interview'],['offer','Offer'],['rejected','Không phù hợp']];
  function renderApply(){
    const applied=s.applications.filter(a=>a.status!=='saved').length,interviews=s.applications.filter(a=>a.status==='hr'||a.status==='tech'||a.status==='offer').length,offers=s.applications.filter(a=>a.status==='offer').length;
    return header('Ứng tuyển — mục tiêu 40 triệu','Quản lý pipeline, không bỏ sót follow-up. Chỉ nghỉ việc khi đã có offer phù hợp.',`<button class="btn primary" data-page="interview">Ôn phỏng vấn ↗</button>`)+
      `<div class="stats-grid"><div class="card stat"><div class="stat-label">Công ty đang theo dõi</div><div class="stat-number accent-lav">${s.applications.length}</div><div class="stat-note">Ưu tiên đúng stack và mức lương</div></div><div class="card stat"><div class="stat-label">Đã ứng tuyển</div><div class="stat-number accent-blue">${applied}</div><div class="stat-note">Các vị trí đã chuyển trạng thái</div></div><div class="card stat"><div class="stat-label">Có phản hồi/phỏng vấn</div><div class="stat-number accent-lime">${interviews}</div><div class="stat-note">HR / Technical / Offer</div></div><div class="card stat"><div class="stat-label">Offer</div><div class="stat-number accent-yellow">${offers}</div><div class="stat-note">So sánh tổng package trước khi quyết định</div></div></div>
      <div class="apply-layout"><section class="column-stack"><div class="card"><div class="card-top"><h3 class="card-title">Application tracker</h3><span class="badge lav">${s.applications.length} vị trí</span></div>
      ${s.applications.length?`<div class="application-list">${s.applications.map(a=>`<div class="application"><div><strong>${escapeHtml(a.company)} · ${escapeHtml(a.role)}</strong><div class="sub">${a.salary?`${escapeHtml(a.salary)} · `:''}${escapeHtml(a.createdAt||'')} ${a.link?`· <a href="${safeLink(a.link)}" target="_blank" rel="noopener noreferrer" style="color:var(--blue)">JD ↗</a>`:''}</div></div><div class="application-actions"><select class="select-input" aria-label="Trạng thái ứng tuyển ${escapeHtml(a.company)}" data-app-status="${escapeHtml(a.id)}">${STATUSES.map(([val,label])=>`<option value="${val}" ${a.status===val?'selected':''}>${label}</option>`).join('')}</select><button class="btn small danger" data-app-delete="${escapeHtml(a.id)}" aria-label="Xóa ${escapeHtml(a.company)}">×</button></div></div>`).join('')}</div>`:'<div class="empty" style="margin-top:15px">Chưa có công ty nào. Hãy thêm các vị trí phù hợp, ưu tiên sau Tết 2027.</div>'}</div>
      <div class="card"><h3 class="card-title">Kịch bản thương lượng</h3><p class="muted">“Với kinh nghiệm phát triển iOS, các bài toán em đã chịu trách nhiệm và yêu cầu vị trí này, em đang kỳ vọng tổng thu nhập cố định khoảng <strong style="color:var(--lime)">40 triệu/tháng</strong>, tùy cách tính gross/net, thưởng và phạm vi công việc. Anh/chị có thể chia sẻ khung ngân sách cho vị trí này không?”</p><div class="callout"><b>Quan trọng:</b> 40 triệu gross và 40 triệu net là hai đề xuất khác nhau. So sánh bảo hiểm, thưởng, thử việc, chính sách làm việc và thời gian đi lại.</div></div></section>
      <aside class="column-stack"><div class="card"><h3 class="card-title">Thêm cơ hội mới</h3><p class="fineprint">Lưu local, không gửi lên máy chủ.</p><form id="applicationForm" class="form-grid"><label class="full"><span class="field-label">Công ty *</span><input name="company" required maxlength="100" class="text-input" placeholder="Tên công ty"/></label><label class="full"><span class="field-label">Vị trí *</span><input name="role" required maxlength="100" class="text-input" value="Senior iOS Developer"/></label><label><span class="field-label">Lương / range</span><input name="salary" maxlength="45" class="text-input" placeholder="40M gross"/></label><label><span class="field-label">Trạng thái</span><select name="status" class="select-input">${STATUSES.map(([v,n])=>`<option value="${v}">${n}</option>`).join('')}</select></label><label class="full"><span class="field-label">Link JD</span><input type="url" name="link" class="text-input" placeholder="https://…"/></label><button class="btn primary full" type="submit">+ Thêm công ty</button></form></div>
      <div class="card"><h3 class="card-title">Điều kiện chuyển việc</h3><div class="check-item">Offer bằng văn bản và mức lương rõ gross/net</div><div class="check-item">Hiểu quyền lợi, thời gian thử việc, review cycles</div><div class="check-item">Tech stack/team có cơ hội phát triển</div><div class="check-item">Có kế hoạch bàn giao ở FPT trước khi nghỉ</div></div></aside></div>`;
  }
  function renderResources(){return header('Tài nguyên chọn lọc','Ưu tiên nguồn chính thức, học ngay khi cần cho bài tập — không học theo video vô hạn.')+
    `<div class="resource-grid">${Object.values(D.RESOURCES).map(r=>`<a class="resource-card" target="_blank" rel="noopener noreferrer" href="${safeLink(r.url)}"><span class="badge lav">${escapeHtml(r.from)}</span><strong>${escapeHtml(r.name)}</strong><span class="external">Mở tài liệu ↗</span></a>`).join('')}</div><h2 class="section-heading">Phương pháp học gợi ý</h2><div class="project-bullets"><div class="project-bullet"><strong>30′ · Học có mục đích</strong>Đọc đủ để giải quyết bài code hôm nay; ghi 3 ý quan trọng.</div><div class="project-bullet"><strong>70′ · Code không sao chép</strong>Viết lại từ trí nhớ, chạy Simulator và tests; lưu commit hoặc PR.</div><div class="project-bullet"><strong>20′ · Recall + chứng minh</strong>Trả lời câu hỏi Senior thành tiếng, hoàn thiện README, ghi blockers.</div><div class="project-bullet"><strong>Mỗi Chủ nhật / cuối tuần</strong>Ôn tập, đánh giá lỗ hổng và ưu tiên công việc có tác động tới phỏng vấn.</div></div>`;
  }
  function renderSettings(){return header('Dữ liệu & cài đặt','Dùng trên máy cá nhân, lưu tự động trong localStorage của trình duyệt.')+
    `<div class="settings-grid"><div class="card"><h3 class="card-title">Sao lưu lộ trình</h3><p class="muted">Xuất file JSON để mang sang trình duyệt / máy khác hoặc đưa vào Codex xử lý. File chứa nhật ký, notes, link, pipeline tuyển dụng — giữ riêng tư.</p><div class="export-zone"><button class="btn primary" data-action="export">↓ Xuất dữ liệu (.json)</button><button class="btn" data-action="import">↑ Nhập bản sao lưu</button><input type="file" id="importFile" accept="application/json,.json" hidden/></div><div class="divider"></div><h3 class="card-title">Tiến độ hiện tại</h3><div class="week-line"><span>Hoàn thành</span><strong>${totalDone()}/${D.days.length}</strong></div>${viewProgress(totalDone(),D.days.length)}<div class="week-line"><span>Tổng phút đã học được ghi nhận</span><strong>${Math.floor(totalSeconds()/60)} phút</strong></div><div class="week-line"><span>Câu hỏi đã trả lời</span><strong>${Object.values(s.questions).filter(Boolean).length}/${D.QUESTIONS.length}</strong></div></div>
    <div class="card"><h3 class="card-title">Thiết lập mặc định</h3><div class="bar-pair"><span class="bar-text">Hiện tại</span><div class="bar-track"><span style="width:62.5%"></span></div><strong>25M</strong></div><div class="bar-pair"><span class="bar-text">Mục tiêu</span><div class="bar-track"><span style="width:100%;background:var(--lime)"></span></div><strong>40M</strong></div><div class="divider"></div><div class="legend"><div class="legend-row"><span class="legend-dot"></span><div><strong>Ngày bắt đầu</strong><small>10/11/2026</small></div></div><div class="legend-row"><span class="legend-dot"></span><div><strong>Ngày kết thúc</strong><small>14/03/2027</small></div></div><div class="legend-row"><span class="legend-dot"></span><div><strong>Mỗi ngày</strong><small>30 phút lý thuyết · 70 phút code · 20 phút recall</small></div></div></div><div class="divider"></div><button class="btn danger" data-action="reset-all">Xóa toàn bộ tiến độ</button><p class="fineprint">Chỉ xóa dữ liệu đã lưu trên trình duyệt này. Hãy xuất backup trước nếu cần.</p></div></div>
    <h2 class="section-heading">Chính sách dữ liệu</h2><div class="callout"><b>Privacy by default:</b> Website thuần HTML/CSS/JS, không tài khoản, không database, không analytics. Dữ liệu lưu trên thiết bị đang dùng. Nếu xóa dữ liệu trình duyệt hoặc mở ở thiết bị khác, tiến độ sẽ không tự đồng bộ. Link tài liệu ngoài chỉ mở khi bạn nhấn.</div>`;
  }
  function renderLead(){
    const study = window.TechLeadStudy;
    const link = (label, url) => `<a href="${safeLink(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)} ↗</a>`;
    if (!study) return header('Tech Lead & Claude', 'Hãy tải lại trang để mở nội dung.');
    return header('Tech Lead & Claude', 'Dùng kinh nghiệm iOS làm nền để chịu trách nhiệm từ thiết kế đến vận hành.')+
      `<section class="card study-section"><h2>Tín hiệu tuyển dụng tại Việt Nam</h2>
      <p class="muted">Mẫu tin tuyển dụng rà soát 24/11/2026. Mục tiêu cá nhân 40 triệu gross/tháng cần đối chiếu theo từng JD và offer.</p>
      <ul>${study.jobs.map(([name, note, url])=>`<li>${escapeHtml(note)} ${link(name,url)}</li>`).join('')}</ul>
      </section><section class="card study-section"><h2>Lộ trình thực hành 6 tuần</h2>
      <p class="muted">Dùng một dự án xuyên suốt. Dành 2 buổi mỗi tuần cho phần mở rộng nếu đang theo lịch iOS 125 ngày.</p>
      <ol>${study.weeks.map(([name, task, proof])=>`<li><strong>${escapeHtml(name)}</strong><p>${escapeHtml(task)}</p><p class="muted">Đầu ra · ${escapeHtml(proof)}</p></li>`).join('')}</ol>
      </section><section class="card study-section"><h2>Ôn Claude Certified Developer – Foundations</h2>
      <p>CCDV-F dành cho developer tích hợp Claude vào ứng dụng. Partner Academy niêm yết lệ phí thi 125 USD trước ưu đãi. Kiểm tra quyền đăng ký và bản exam guide áp dụng đúng ngày thi.</p>
      <p>Ưu tiên API và tích hợp, model và tối ưu, agents, prompt/context, tools/MCP, bảo mật, Claude Code và kiểm thử. Đọc guide trước, làm lab tuần 5–6 rồi sửa các nhóm câu sai trong mock.</p>
      <ul>${study.study.map(([name, url])=>`<li>${link(name,url)}</li>`).join('')}</ul>
      </section><section class="card study-section"><h2>Mock CCDV-F · ${study.mock.length} câu</h2>
      <p class="muted">Câu hỏi tiếng Anh tự biên soạn, bám nhóm kỹ năng công khai. Mỗi câu nhiều đáp án chỉ tính đúng khi chọn đủ. Gợi ý tự bấm giờ 25 phút.</p>
      <form id="leadQuiz">
      ${study.mock.map(([domain, question, options, answers], index)=>`<fieldset><legend>${index+1}. ${escapeHtml(question)}</legend><p class="muted">${escapeHtml(domain)}</p>${options.map((option, choice)=>`<label><input type="${answers.length>1?'checkbox':'radio'}" name="q${index}" value="${choice}"> ${escapeHtml(option)}</label>`).join('')}<p id="leadAnswer${index}" class="study-answer" hidden></p></fieldset>`).join('')}
      <button type="submit" class="btn primary">Chấm bài</button>
      <button type="reset" class="btn" id="leadReset">Làm lại</button>
      <p id="leadScore" role="status" tabindex="-1"></p>
      </form></section>`;
  }

  $app.addEventListener('submit', event=>{
    if (event.target.id!=='leadQuiz') return;
    event.preventDefault();
    const data = new FormData(event.target);
    let score = 0;
    window.TechLeadStudy.mock.forEach(([, , options, answers, explanation], index)=>{
      const selected = data.getAll(`q${index}`).map(Number);
      const correct = answers.length===selected.length && answers.every(choice=>selected.includes(choice));
      if (correct) score++;
      const result = document.getElementById(`leadAnswer${index}`);
      result.textContent = `${correct?'Đúng':'Cần ôn lại'} · ${answers.map(choice=>options[choice]).join(' / ')}. ${explanation}`;
      result.hidden = false;
    });
    const output = document.getElementById('leadScore');
    output.textContent = `${score}/${window.TechLeadStudy.mock.length} câu đúng`;
    output.focus();
  });
  $app.addEventListener('reset', event=>{
    if (event.target.id!=='leadQuiz') return;
    event.target.querySelectorAll('.study-answer').forEach(item=>item.hidden=true);
    document.getElementById('leadScore').textContent='';
  });

  function render(){
    const views={today:renderToday,roadmap:renderRoadmap,skills:renderSkills,lead:renderLead,project:renderProject,interview:renderInterview,apply:renderApply,resources:renderResources,settings:renderSettings};
    shell((views[s.page]||renderToday)());
  }
  // Timer can survive a refresh; only committed seconds are counted as study time.
  function remaining(){return s.timer.running?Math.max(0,Math.ceil((s.timer.endAt-Date.now())/1000)):s.timer.remaining;}
  function timerCommit(){
    const t=s.timer;if(!t.running)return;
    const rem=remaining(),elapsed=clamp(t.startRemaining-rem,0,t.startRemaining);
    if(elapsed>0)s.seconds[t.date]=(Number(s.seconds[t.date])||0)+elapsed;
    t.remaining=rem;t.running=false;t.endAt=0;t.startRemaining=0;save();
  }
  function timerEndIfDue(){if(s.timer.running && remaining()===0){timerCommit();s.timer.remaining=s.timer.duration;save();toast('Hoàn thành phiên học. Bằng chứng code quan trọng hơn số phút!');render();}}
  function updateTimerUI(){
    if(!document.getElementById('timerTime'))return;
    const left=remaining(),min=Math.floor(left/60),secs=left%60;
    document.getElementById('timerTime').textContent=`${String(min).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
    const ring=document.getElementById('timerRing');if(ring)ring.style.setProperty('--angle',`${Math.round(360*(1-left/s.timer.duration))}deg`);
    const todayNode=document.getElementById('loggedToday');if(todayNode){const d=selected();let count=Number(s.seconds[d.date]||0);if(s.timer.running && s.timer.date===d.date)count+=s.timer.startRemaining-remaining();todayNode.textContent=`${Math.floor(count/60)} / 120 phút`;}
  }
  function timerToggle(){
    if(s.timer.running){timerCommit();toast('Đã tạm dừng. Phút học được lưu.');}
    else {if(s.timer.remaining<=0)s.timer.remaining=s.timer.duration;s.timer.running=true;s.timer.endAt=Date.now()+s.timer.remaining*1000;s.timer.startRemaining=s.timer.remaining;s.timer.date=s.selectedDate;save();}
    render();
  }
  function timerMode(value){if(s.timer.running)return;s.timer.duration=value;s.timer.remaining=value;save();render();}
  function timerReset(){if(s.timer.running)timerCommit();s.timer.remaining=s.timer.duration;save();render();}
  function exportBackup(){
    if(s.timer.running){timerCommit();render();}
    const payload={app:'CareerPath iOS 40M',exportedAt:new Date().toISOString(),data:{...s,timer:{...s.timer,running:false,endAt:0}}};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`careerpath-backup-${today()}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Đã tạo file sao lưu.');
  }
  const askConfirm=(title,text,onConfirm)=>{
    const node=document.createElement('div');node.className='modal-backdrop';node.innerHTML=`<div class="modal" role="dialog" aria-modal="true" aria-label="${escapeHtml(title)}"><h2>${escapeHtml(title)}</h2><p>${escapeHtml(text)}</p><div class="modal-buttons"><button class="btn" data-modal-cancel>Hủy</button><button class="btn danger" data-modal-confirm>Xác nhận</button></div></div>`;
    document.body.appendChild(node);node.querySelector('[data-modal-cancel]').addEventListener('click',()=>node.remove());node.addEventListener('click',e=>{if(e.target===node)node.remove();});node.querySelector('[data-modal-confirm]').addEventListener('click',()=>{node.remove();onConfirm();});node.querySelector('[data-modal-cancel]').focus();
  };
  document.addEventListener('click',e=>{
    const el=e.target.closest('button,a[data-page]');if(!el)return;
    if(el.dataset.page){e.preventDefault();nav(el.dataset.page);return;}
    if(el.dataset.dateOpen){goToDate(el.dataset.dateOpen);return;}
    if(el.dataset.week){s.weekOpen=s.weekOpen===Number(el.dataset.week)?0:Number(el.dataset.week);save();render();return;}
    if(el.dataset.timerMode){timerMode(Number(el.dataset.timerMode));return;}
    if(el.dataset.qa!==undefined){s.questions[Number(el.dataset.qa)]=!s.questions[Number(el.dataset.qa)];save();render();return;}
    if(el.dataset.appDelete){const id=el.dataset.appDelete;const a=s.applications.find(x=>x.id===id);askConfirm('Xóa công ty?',`Xóa ${a?a.company:'mục này'} khỏi tracker?`,()=>{s.applications=s.applications.filter(x=>x.id!==id);save();render();toast('Đã xóa mục ứng tuyển.');});return;}
    switch(el.dataset.action){
      case 'jump-today':goToDate(initialDate===today()?today():today()<D.START?D.START:today()>D.END?D.END:today());break;
      case 'skill-open':{const f=D.days.find(d=>d.skill===el.dataset.skill);if(f)goToDate(f.date);break;}
      case 'timer-toggle':timerToggle();break;
      case 'timer-reset':timerReset();break;
      case 'export':exportBackup();break;
      case 'import':document.getElementById('importFile').click();break;
      case 'reset-all':askConfirm('Xóa toàn bộ dữ liệu?','Checklist, thời gian, nhật ký và hồ sơ ứng tuyển sẽ không thể khôi phục nếu chưa xuất backup.',()=>{s=freshState();save();render();toast('Đã đặt lại tiến độ.');});break;
    }
  });
  document.addEventListener('change',async e=>{
    const el=e.target;
    if(el.matches('[data-task]')){const date=el.dataset.date,id=el.dataset.task;s.checks[date]??={};s.checks[date][id]=el.checked;save();render();if(isDone(date))toast(`✓ Hoàn thành ngày ${dateFormat(date,{day:'2-digit',month:'2-digit'})}!`);return;}
    if(el.matches('[data-app-status]')){const a=s.applications.find(x=>x.id===el.dataset.appStatus);if(a){a.status=el.value;save();render();}return;}
    if(el.id==='qaCategory'){qaCategory=el.value;render();return;}
    if(el.id==='importFile' && el.files&&el.files[0]){
      try{
        if(el.files[0].size>5*1024*1024)throw new Error('File quá lớn (tối đa 5MB).');
        const parsed=JSON.parse(await el.files[0].text());const data=parsed.data||parsed;
        if(!data || data.version!==1 || !data.checks || !data.notes || !Array.isArray(data.applications))throw new Error('File không đúng định dạng CareerPath v1.');
        askConfirm('Khôi phục bản sao lưu?','Dữ liệu hiện tại sẽ được thay bằng nội dung trong file JSON.',()=>{localStorage.setItem(STORAGE_KEY,JSON.stringify(data));s=loadState();if(s.timer.running){s.timer.running=false;s.timer.remaining=s.timer.duration;save();}render();toast('Đã khôi phục dữ liệu sao lưu.');});
      }catch(err){toast(`Không nhập được file: ${err.message}`);}el.value='';
    }
  });
  document.addEventListener('input',e=>{
    const el=e.target;
    if(el.dataset.noteDate){s.notes[el.dataset.noteDate]=el.value;save();}
    if(el.dataset.proofDate){s.proofLinks[el.dataset.proofDate]=el.value;save();}
    if(el.hasAttribute('data-project-url')){s.projectUrl=el.value;save();}
    if(el.id==='roadmapSearch'){const caret=el.selectionStart;roadmapQuery=el.value;render();const repl=document.getElementById('roadmapSearch');if(repl){repl.focus();repl.setSelectionRange(caret,caret);}}
  });
  document.addEventListener('submit',e=>{
    if(e.target.id!=='applicationForm')return;
    e.preventDefault();const form=e.target,fd=new FormData(form),company=String(fd.get('company')||'').trim(),role=String(fd.get('role')||'').trim();if(!company||!role)return;
    const link=String(fd.get('link')||'').trim();if(link && !/^https?:\/\//i.test(link)){toast('Link JD phải bắt đầu bằng https:// hoặc http://');return;}
    s.applications.push({id:`a${Date.now()}-${Math.floor(Math.random()*10000)}`,company:company.slice(0,100),role:role.slice(0,100),salary:String(fd.get('salary')||'').slice(0,45),status:String(fd.get('status')||'saved'),link,createdAt:dateFormat(today(),{day:'2-digit',month:'2-digit',year:'numeric'})});save();render();toast('Đã thêm cơ hội ứng tuyển.');
  });
  // Finish pending work on reopening the page, never silently count hours that were not in a timer session.
  timerEndIfDue();render();setInterval(()=>{timerEndIfDue();updateTimerUI();},1000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){timerEndIfDue();updateTimerUI();}});
  if('serviceWorker' in navigator && location.protocol!=='file:'){window.addEventListener('load',()=>{navigator.serviceWorker.register('./sw.js').catch(()=>{});});}
})();
