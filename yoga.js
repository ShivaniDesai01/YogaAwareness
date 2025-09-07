/* Helper selectors */
const q = (s, el=document) => el.querySelector(s);
const qq = (s, el=document) => Array.from(el.querySelectorAll(s));
const todayISO = () => (new Date()).toISOString().slice(0,10);

/* Seed: 30 poses (no images) */
const seedPoses = (()=>{
  const names = [
    // Morning (10)
    "Sun Salutation","Mountain Pose","Chair Pose","Revolved Chair","Downward Dog",
    "Low Lunge","Child's Pose","Cat-Cow","Happy Baby","Boat Pose",
    // Stretch (10)
    "Seated Forward Bend","Legs-Up-the-Wall","Reclining Bound Angle","Camel Pose","Cow-Face Pose",
    "Triangle Pose","Bridge Pose","Butterfly Pose","Half Lord of the Fishes","Tree Pose",
    // Relax (10)
    "Corpse Pose","Wide-Knee Child’s Pose","Reclining Pigeon","Reclining Hand-to-Big-Toe","Half-Pigeon",
    "Seated Forward Bend (Relax)","Corpse Rest / Breath","Legs-Up-the-Wall (Relax)","Supported Bridge","Standing Forward Bend"
  ];
  const infos = [
    "Energizing flow to warm up body.",
    "Foundational pose for posture and balance.",
    "Strengthens legs, builds heat.",
    "Twisting variation to detoxify.",
    "Full-body stretch and circulation boost.",
    "Hip opener to increase mobility.",
    "Soothing rest and lower back release.",
    "Spinal warm-up for flexibility.",
    "Playful hip and back opening.",
    "Core-strengthening seated pose.",
    "Calms mind, stretches hamstrings.",
    "Gentle inversion to relieve legs.",
    "Restorative hip opener.",
    "Chest opener and backbend.",
    "Stretches shoulders and hips.",
    "Lateral stretch and alignment.",
    "Spinal release and back strengthening.",
    "Inner thigh and hip opener.",
    "Spinal twist and massage.",
    "Balance and focus in a grounding stance.",
    "Deep relaxation and integration.",
    "Very gentle full-body stretch and grounding.",
    "Hip release in a supported position.",
    "Hamstring stretch with ease.",
    "Deep hip opening pose.",
    "Soothing forward fold.",
    "Stillness and inner calm.",
    "Calming inversion for stress relief.",
    "Backbend with gentle support.",
    "Nervous system calming fold."
  ];
  //Images are from Pocket Yoga app by Rainfrog, used under fair use for educational demo purposes only
  //https://pocketyoga.com/
  //All rights reserved to Rainfrog LLC
  const imageUrls = [
    "https://pocketyoga.com/assets/images/full/LungeCrescent_L.png",
    "https://pocketyoga.com/assets/images/full/MountainArmsSide.png",
    "https://pocketyoga.com/assets/images/full/Chair.png",  
    "https://pocketyoga.com/assets/images/full/ChairTwistBindUp_L.png",
    "https://pocketyoga.com/assets/images/full/DownwardDog.png",
    "https://pocketyoga.com/assets/images/full/SeatedForwardBend.png",
    "https://pocketyoga.com/assets/images/full/HeadstandSupported.png",
    "https://pocketyoga.com/assets/images/full/BoundAngle.png",
    "https://pocketyoga.com/assets/images/full/LordOfTheFishes_R.png",
    "https://pocketyoga.com/assets/images/full/KneePileBind_L.png",
    "https://pocketyoga.com/assets/images/full/TriangleForward_L.png",
    "https://pocketyoga.com/assets/images/full/Bridge.png",
    "https://pocketyoga.com/assets/images/full/Butterfly.png",
    "https://pocketyoga.com/assets/images/full/Camel.png",
    "https://pocketyoga.com/assets/images/full/TreePrayer_R.png",
    "https://pocketyoga.com/assets/images/full/Corpse.png",
    "https://pocketyoga.com/assets/images/full/GarlandSideways_L.png",
    "https://pocketyoga.com/assets/images/full/PigeonFlying_L.png",
    "https://pocketyoga.com/assets/images/full/ForwardBendBigToe.png",
    "https://pocketyoga.com/assets/images/full/PigeonHalf_L.png",
    "https://pocketyoga.com/assets/images/full/SeatedForwardBend.png",
    "https://pocketyoga.com/assets/images/full/CorpseFrontArmsForward.png",
    "https://pocketyoga.com/assets/images/full/LegsUpTheWallRelax.png",
    "https://pocketyoga.com/assets/images/full/SupportedBridge.png",
    "https://pocketyoga.com/assets/images/full/StandingForwardBend.png",
    "https://pocketyoga.com/assets/images/full/Lunge_L.png",
    "https://pocketyoga.com/assets/images/full/CatCow.png",
    "https://pocketyoga.com/assets/images/full/HappyBaby.png",
    "https://pocketyoga.com/assets/images/full/BoatFull.png",
    "https://pocketyoga.com/assets/images/full/LowLunge_L.png"
  ];

  const images = []; //ToDo: add actual images data in base64 encoded format in future version.

  return names.map((n,i)=>({
    id: 'p'+(i+1),
    category: i<10 ? 'morning' : (i<20 ? 'stretch' : 'relax'),
    name: n,
    info: infos[i] || '',
    imageUrl: imageUrls[i] || '',
    imageData: images[i] || ''
  }));
})();

/* Database in localStorage */
let DB = { poses: [], completions: {}, reviews: [], profile: { name: '' } };

function loadData(){
  const raw = localStorage.getItem('yogaAwarenessData');
  if(raw){
    try { DB = JSON.parse(raw); }
    catch(e){ DB = { poses: seedPoses.slice(), completions: {}, reviews: [], profile: { name: '' } }; saveData(); }
  } else {
    DB.poses = seedPoses.slice();
    DB.completions = {}; DB.reviews = []; DB.profile = { name: '' };
    saveData();
  }
}
function saveData(){ localStorage.setItem('yogaAwarenessData', JSON.stringify(DB)); }

/* Render Home - only names & info (no images) */
function renderHome(){
  const byCat = { morning: [], stretch: [], relax: [] };
  DB.poses.forEach(p => byCat[p.category]?.push(p));
  const renderList = (id, arr) => {
    const container = q(`#${id}List`);
    container.innerHTML = '';
    arr.forEach(p => {
      const card = document.createElement('div'); card.className = 'card';
      card.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:6px">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div style="font-weight:700">${p.name}</div>
            <button class="icon-btn add-to-today" data-id="${p.id}" title="Add to today's session"><i class="fa-regular fa-plus"></i></button>
          </div>
          <div class="small">${p.info}</div>
        </div>
      `;
      card.querySelector('.add-to-today').onclick = ()=>addToToday(p.id);
      container.appendChild(card);
    });
  };
  renderList('morning', byCat.morning);
  renderList('stretch', byCat.stretch);
  renderList('relax', byCat.relax);
  q('#streakBadge').innerText = 'Streak: ' + computeStreak();
}

/* Today's session logic */
function getTodaysSession(){
  const today = todayISO();
  if(DB.completions[today] && DB.completions[today].sessionList){
    return DB.completions[today].sessionList.map(id => DB.poses.find(p=>p.id===id)).filter(Boolean);
  }
  const arr = DB.poses.slice(0,5);
  const ids = arr.map(p=>p.id);
  DB.completions[today] = DB.completions[today] || {};
  DB.completions[today].sessionList = ids;
  saveData();
  return arr;
}

function addToToday(poseId){
  const today = todayISO();
  DB.completions[today] = DB.completions[today] || {};
  DB.completions[today].sessionList = DB.completions[today].sessionList || [];
  if(!DB.completions[today].sessionList.includes(poseId)) 
  {
    if (DB.completions[today].sessionList.length == 5) {
      //add the element at first position and remove the last one
      DB.completions[today].sessionList.unshift(poseId);
      DB.completions[today].sessionList.pop();
    }
    else
    {
      DB.completions[today].sessionList.push(poseId);
    }
  }
  saveData();
  alert('Added pose to today’s session');
  renderSession();
}

function renderSession(){
  const list = getTodaysSession();
  const container = q('#sessionList'); container.innerHTML = '';
  list.forEach(p => {
    const row = document.createElement('div'); row.className = 'card';
    const checked = DB.completions[todayISO()]?.donePoses?.includes(p.id) ? 'checked' : '';
    row.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-direction:column;">
        <div>
          <div style="font-weight:700">${p.name}</div>
          <div style="padding:5px 0;height:200px"><img src="${p.imageUrl}" width="auto" height="200px" alt="image incorrect" /></div>
          <div class="small">${p.info}</div>
        </div>
      </div>
      <div style="text-align:center">
        <label class="small">Done</label>
        <input type="checkbox" class="poseCheck" data-id="${p.id}" ${checked} />
      </div>
    `;
    container.appendChild(row);
  });
  // wire checkboxes after injecting them
  qq('.poseCheck').forEach(cb=>{
    cb.onchange = ()=>{
      const id = cb.dataset.id;
      DB.completions[todayISO()] = DB.completions[todayISO()] || {};
      DB.completions[todayISO()].donePoses = DB.completions[todayISO()].donePoses || [];
      if(cb.checked){
        if(!DB.completions[todayISO()].donePoses.includes(id)) DB.completions[todayISO()].donePoses.push(id);
      } else {
        DB.completions[todayISO()].donePoses = DB.completions[todayISO()].donePoses.filter(x=>x!==id);
      }
      saveData();
      q('#streakBadge').innerText = 'Streak: ' + computeStreak();
    };
  });
}

/* Complete session button */
q('#completeSessionBtn').onclick = ()=>{
  const today = todayISO();
  const done = DB.completions[today]?.donePoses?.length || 0;
  const total = DB.completions[today]?.sessionList?.length || 5;
  if(done===0 && !confirm("You haven't ticked any poses. Mark today as not done?")) return;
  const status = (done===total) ? 'complete' : (done>0 ? 'partial' : 'none');
  DB.completions[today] = DB.completions[today] || {};
  DB.completions[today].status = status;
  saveData();
  alert('Today marked: ' + status);
  q('#streakBadge').innerText = 'Streak: ' + computeStreak();
  renderCalendar();
};

/* Timer */
q('#startTimerBtn').onclick = ()=>{
  const minutes = 30;
  if(!confirm(`Start a ${minutes} minute reminder? (for demo you can cancel)`)) return;
  setTimeout(()=> alert('Yoga Timer finished — nice job!'), minutes*60*1000);
  alert('Timer started');
};

/* Session review (session page) */
q('#saveReviewBtnSession').onclick = ()=>{
  const t = q('#reviewTextSession').value.trim();
  if(!t){ alert('Write something first'); return; }
  DB.reviews.unshift({date: todayISO(), text: t});
  if(DB.reviews.length>50) DB.reviews.pop();
  saveData();
  q('#reviewTextSession').value='';
  alert('Thanks for review');
  renderAnalysis();
};

/* Calendar */
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function renderCalendar(){
  const grid = q('#calGrid');
  grid.innerHTML = `
    <div class="small" style="text-align:center;font-weight:700">Sun</div><div class="small" style="text-align:center;font-weight:700">Mon</div>
    <div class="small" style="text-align:center;font-weight:700">Tue</div><div class="small" style="text-align:center;font-weight:700">Wed</div>
    <div class="small" style="text-align:center;font-weight:700">Thu</div><div class="small" style="text-align:center;font-weight:700">Fri</div>
    <div class="small" style="text-align:center;font-weight:700">Sat</div>
  `;
  const first = new Date(currentYear, currentMonth, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(currentYear, currentMonth+1, 0).getDate();
  q('#calTitle').innerText = first.toLocaleString(undefined, {month:'long', year:'numeric'});
  for(let i=0;i<startDay;i++){
    const cell = document.createElement('div'); cell.className='cal-cell none'; grid.appendChild(cell);
  }
  for(let d=1; d<=daysInMonth; d++){
    const dateISO = new Date(currentYear, currentMonth, d).toISOString().slice(0,10);
    const status = DB.completions[dateISO]?.status || 'none';
    const cell = document.createElement('div');
    cell.className = 'cal-cell ' + (status==='complete' ? 'complete' : (status==='partial' ? 'partial' : 'none'));
    cell.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center"><div class="date-num">${d}</div>${dateISO===todayISO() ? '<div class="today-badge">Today</div>' : ''}</div>
      <div class="small" style="margin-top:6px">${status==='complete' ? 'Completed' : (status==='partial' ? 'Partial' : '')}</div>`;
    cell.onclick = ()=> openDayEditor(dateISO);
    grid.appendChild(cell);
  }
}

/* Day editor */
function openDayEditor(dateISO){
  q('#dayEditorModal').style.display='block';
  q('#editingDate').innerText = dateISO;
  q('#markCompleteBtn').onclick = ()=>{ setDayStatus(dateISO,'complete'); q('#dayEditorModal').style.display='none'; };
  q('#markPartialBtn').onclick = ()=>{ setDayStatus(dateISO,'partial'); q('#dayEditorModal').style.display='none'; };
  q('#markNoneBtn').onclick = ()=>{ setDayStatus(dateISO,'none'); q('#dayEditorModal').style.display='none'; };
}
function setDayStatus(dateISO, status){
  DB.completions[dateISO] = DB.completions[dateISO] || {};
  DB.completions[dateISO].status = status;
  saveData();
  renderCalendar();
  q('#streakBadge').innerText = 'Streak: ' + computeStreak();
}
q('#prevMonth').onclick = ()=>{ currentMonth--; if(currentMonth<0){ currentMonth=11; currentYear--; } renderCalendar(); }
q('#nextMonth').onclick = ()=>{ currentMonth++; if(currentMonth>11){ currentMonth=0; currentYear++; } renderCalendar(); }

/* Upload page */
function renderUpload(){
  q('#poseName').value=''; q('#poseInfo').value=''; q('#poseCategory').value='morning';
}
q('#addPoseBtn').onclick = ()=>{
  const name = q('#poseName').value.trim();
  const cat = q('#poseCategory').value;
  const info = q('#poseInfo').value.trim() || '';
  if(!name){ alert('Give a name'); return; }
  const img = q('#poseImage').files[0] || null;
  const id = 'p'+(Date.now()%1000000);
  DB.poses.unshift({id, category: cat, name, info, imgUrl: null, img});
  saveData();
  alert('Pose added');
  renderHome();
  showPage('homePage');
};
q('#resetSampleBtn').onclick = ()=>{ if(confirm('Reset to original sample 30 poses?')){ DB.poses = seedPoses.slice(); saveData(); renderHome(); } };

/* Analysis (reviews & stats) */
function renderAnalysis(){
  const completed = Object.keys(DB.completions).filter(d=>DB.completions[d].status==='complete').length;
  const partial = Object.keys(DB.completions).filter(d=>DB.completions[d].status==='partial').length;
  const total = Object.keys(DB.completions).length;
  q('#statsArea').innerText = `Total days recorded: ${total} • Completed: ${completed} • Partial: ${partial} • Longest streak: ${computeLongestStreak()}`;
  const ul = q('#reviewsList'); ul.innerHTML = '';
  DB.reviews.slice(0,50).forEach(r=>{
    const div = document.createElement('div'); div.className='card'; div.style.marginBottom='8px';
    div.innerHTML = `<div style="font-weight:700">${r.date}</div><div class="small" style="margin-top:6px">${r.text}</div>`;
    ul.appendChild(div);
  });
}

/* Analysis page review input (main analysis) */
q('#saveReviewBtn').onclick = ()=>{
  const t = q('#reviewText').value.trim();
  if(!t) return alert('Write something first');
  DB.reviews.unshift({date: todayISO(), text: t});
  if(DB.reviews.length>50) DB.reviews.pop();
  saveData();
  q('#reviewText').value='';
  renderAnalysis();
};

/* Streak calculations */
function computeStreak(){
  let count = 0; let d = new Date();
  while(true){
    const iso = d.toISOString().slice(0,10);
    if(DB.completions[iso]?.status === 'complete'){ count++; d.setDate(d.getDate()-1); }
    else break;
  }
  return count;
}
function computeLongestStreak(){
  const dates = Object.keys(DB.completions).sort();
  let best = 0, cur = 0, last = null;
  for(const date of dates){
    const s = DB.completions[date].status;
    if(s === 'complete'){
      if(last && (new Date(date) - new Date(last) === 86400000)) cur++; else cur = 1;
      best = Math.max(best, cur);
      last = date;
    } else { last = date; cur = 0; }
  }
  return best;
}

/* Profile & reminder */
q('#profileBtn').onclick = ()=>{
  const name = prompt('Enter your name', DB.profile.name || '');
  if(name !== null){ DB.profile.name = name; saveData(); alert('Saved'); }
};
q('#reminderBtn').onclick = ()=>{
  const mins = prompt('Set reminder in minutes (demo: enter 0.1 for 6 seconds)', '30');
  if(!mins) return;
  const ms = parseFloat(mins) * 60 * 1000;
  setTimeout(()=> alert('Reminder: time for yoga!'), ms);
  alert('Reminder set');
};

/* Navigation */
function showPage(pageId){
  ['homePage','sessionPage','calendarPage','uploadPage','analysisPage'].forEach(id=>{
    const el = q('#'+id);
    if(el) el.classList.toggle('hidden', id !== pageId);
  });
  ['navHome','navSession','navCalendar','navAnalysis'].forEach(id=>{
    const el = q('#'+id);
    if(el) el.classList.toggle('active', id.toLowerCase().includes(pageId.replace('Page','').toLowerCase()));
  });
  if(pageId === 'homePage') renderHome();
  if(pageId === 'sessionPage') renderSession();
  if(pageId === 'calendarPage') renderCalendar();
  if(pageId === 'uploadPage') renderUpload();
  if(pageId === 'analysisPage') renderAnalysis();
}

/* Bottom nav wiring + upload icon */
q('#navHome').onclick = ()=> showPage('homePage');
q('#navSession').onclick = ()=> showPage('sessionPage');
q('#navCalendar').onclick = ()=> showPage('calendarPage');
q('#navAnalysis').onclick = ()=> showPage('analysisPage');
q('#uploadNavBtn').onclick = ()=> showPage('uploadPage');

/* Initialize */
loadData();
showPage('homePage');
renderCalendar();
renderAnalysis();
