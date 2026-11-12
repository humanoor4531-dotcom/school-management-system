const STORAGE_KEY = "edumanage_students_v1";
const courses = [
  {name:"Mathematics",description:"Build problem-solving skills through numbers, patterns and logical thinking.",level:"Core subject",symbol:"∑"},
  {name:"English Language",description:"Develop reading, writing, speaking and communication skills.",level:"Core subject",symbol:"A"},
  {name:"Computer Science",description:"Explore digital skills, computer fundamentals and technology.",level:"Technology",symbol:"⌘"},
  {name:"General Science",description:"Discover the natural world through observation and experiments.",level:"Core subject",symbol:"⚗"},
  {name:"Social Studies",description:"Learn about communities, history, geography and citizenship.",level:"Humanities",symbol:"◎"},
  {name:"Arts & Creativity",description:"Express ideas through drawing, design and creative activities.",level:"Creative",symbol:"✎"}
];
let students = loadStudents();
let attendance = JSON.parse(localStorage.getItem("edumanage_attendance_v1") || "{}");
const $ = (id) => document.getElementById(id);
function loadStudents(){
  try{
    const saved=localStorage.getItem(STORAGE_KEY);
    if(saved!==null){
      const parsed=JSON.parse(saved);
      return Array.isArray(parsed)?parsed:[];
    }
    const demoStudents=[
      {id:"demo-001",name:"Ayesha Khan",email:"ayesha.khan@example.com",grade:"Grade 8",phone:"0300-0000001"},
      {id:"demo-002",name:"Ali Ahmed",email:"ali.ahmed@example.com",grade:"Grade 7",phone:"0300-0000002"},
      {id:"demo-003",name:"Fatima Noor",email:"fatima.noor@example.com",grade:"Grade 9",phone:"0300-0000003"},
      {id:"demo-004",name:"Hassan Raza",email:"hassan.raza@example.com",grade:"Grade 6",phone:"0300-0000004"},
      {id:"demo-005",name:"Zainab Malik",email:"zainab.malik@example.com",grade:"Grade 10",phone:"0300-0000005"},
      {id:"demo-006",name:"Usman Tariq",email:"usman.tariq@example.com",grade:"Grade 8",phone:"0300-0000006"},
      {id:"demo-007",name:"Maryam Iqbal",email:"maryam.iqbal@example.com",grade:"Grade 7",phone:"0300-0000007"},
      {id:"demo-008",name:"Hamza Ali",email:"hamza.ali@example.com",grade:"Grade 9",phone:"0300-0000008"},
      {id:"demo-009",name:"Hira Shah",email:"hira.shah@example.com",grade:"Grade 6",phone:"0300-0000009"},
      {id:"demo-010",name:"Bilal Hussain",email:"bilal.hussain@example.com",grade:"Grade 10",phone:"0300-0000010"}
    ];
    localStorage.setItem(STORAGE_KEY,JSON.stringify(demoStudents));
    return demoStudents;
  }catch{return []}
}
function saveStudents(){localStorage.setItem(STORAGE_KEY,JSON.stringify(students))}
function initials(name){return name.trim().split(/\s+/).slice(0,2).map(part=>part[0]).join("").toUpperCase()}
function escapeHTML(value){return String(value ?? "").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]))}
function showToast(message){const toast=$("toast");toast.textContent=message;toast.classList.add("show");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove("show"),2400)}
function renderDashboard(){
  $("studentCount").textContent=students.length;
  $("courseCount").textContent=courses.length;
  const records=students.map(s=>attendance[s.id] || "Not marked");
  $("presentCount").textContent=records.filter(s=>s==="Present").length;
  $("absentCount").textContent=records.filter(s=>s==="Absent").length;
  const recent=[...students].slice(-4).reverse();
  $("recentStudents").innerHTML=recent.length?recent.map(s=>'<div class="recent-row"><div class="student-avatar">'+escapeHTML(initials(s.name))+'</div><div class="recent-info"><strong>'+escapeHTML(s.name)+'</strong><small>'+escapeHTML(s.grade)+' · '+escapeHTML(s.email)+'</small></div></div>').join(""):'<p class="empty-state" style="display:block">No students registered yet.</p>';
}
function renderStudents(){
  const query=$("studentSearch").value.trim().toLowerCase();
  const filtered=students.filter(s=>[s.name,s.email,s.grade,s.phone].join(" ").toLowerCase().includes(query));
  $("studentSubtitle").textContent=students.length+" students registered";
  const addButton=$("openStudentForm");
  addButton.disabled=false;
  addButton.textContent="＋ Add Student";
  $("studentTable").innerHTML=filtered.map(s=>'<tr><td><div class="table-person"><span class="student-avatar">'+escapeHTML(initials(s.name))+'</span>'+escapeHTML(s.name)+'</div></td><td>'+escapeHTML(s.email)+'</td><td>'+escapeHTML(s.grade)+'</td><td>'+escapeHTML(s.phone || "—")+'</td><td><button class="delete-button" data-delete="'+s.id+'">Remove</button></td></tr>').join("");
  $("studentEmpty").style.display=filtered.length?"none":"block";
}
function renderAttendance(){
  $("attendanceTable").innerHTML=students.map(s=>'<tr><td><div class="table-person"><span class="student-avatar">'+escapeHTML(initials(s.name))+'</span>'+escapeHTML(s.name)+'</div></td><td>'+escapeHTML(s.grade)+'</td><td><select class="status-select" data-attendance="'+s.id+'"><option value="Not marked" '+((attendance[s.id]||"Not marked")==="Not marked"?"selected":"")+'>Not marked</option><option value="Present" '+(attendance[s.id]==="Present"?"selected":"")+'>Present</option><option value="Absent" '+(attendance[s.id]==="Absent"?"selected":"")+'>Absent</option></select></td></tr>').join("");
  $("attendanceEmpty").style.display=students.length?"none":"block";
}
function renderCourses(){
  $("courseGrid").innerHTML=courses.map(c=>'<article class="course-card"><div class="course-symbol">'+c.symbol+'</div><h3>'+c.name+'</h3><p>'+c.description+'</p><span>'+c.level+'</span></article>').join("");
}
function navigate(page){
  document.querySelectorAll(".page").forEach(el=>el.classList.remove("active"));
  document.querySelectorAll(".nav-link").forEach(el=>el.classList.toggle("active",el.dataset.page===page));
  $(page+"Page").classList.add("active");
  $("pageTitle").textContent=page.charAt(0).toUpperCase()+page.slice(1);
  $("sidebar").classList.remove("open");
  if(page==="dashboard")renderDashboard();
  if(page==="students")renderStudents();
  if(page==="attendance")renderAttendance();
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll(".nav-link").forEach(button=>button.addEventListener("click",()=>navigate(button.dataset.page)));
document.querySelectorAll("[data-go]").forEach(button=>button.addEventListener("click",()=>navigate(button.dataset.go)));
$("menuToggle").addEventListener("click",()=>$("sidebar").classList.toggle("open"));
$("openStudentForm").addEventListener("click",()=>$("studentModal").classList.add("open"));
function closeModal(){$("studentModal").classList.remove("open");$("studentForm").reset()}
$("closeStudentForm").addEventListener("click",closeModal);
$("cancelStudentForm").addEventListener("click",closeModal);
$("studentModal").addEventListener("click",event=>{if(event.target===$("studentModal"))closeModal()});
$("studentForm").addEventListener("submit",event=>{
  event.preventDefault();
  const data=new FormData(event.currentTarget);
  const student={id:Date.now().toString(),name:data.get("name").trim(),email:data.get("email").trim(),grade:data.get("grade").trim(),phone:data.get("phone").trim()};
  if(students.some(s=>s.email.toLowerCase()===student.email.toLowerCase())){showToast("A student with this email already exists.");return}
  students.push(student);saveStudents();closeModal();renderStudents();renderDashboard();renderAttendance();showToast("Student added successfully.");
});
$("studentSearch").addEventListener("input",renderStudents);
$("studentTable").addEventListener("click",event=>{
  const button=event.target.closest("[data-delete]");if(!button)return;
  const id=button.dataset.delete;const student=students.find(s=>s.id===id);
  if(!student || !confirm("Remove "+student.name+" from the student list?"))return;
  students=students.filter(s=>s.id!==id);delete attendance[id];saveStudents();localStorage.setItem("edumanage_attendance_v1",JSON.stringify(attendance));renderStudents();renderDashboard();renderAttendance();showToast("Student removed.");
});
$("attendanceTable").addEventListener("change",event=>{
  const select=event.target.closest("[data-attendance]");if(!select)return;
  attendance[select.dataset.attendance]=select.value;
  localStorage.setItem("edumanage_attendance_v1",JSON.stringify(attendance));renderDashboard();showToast("Attendance updated.");
});
$("todayDate").textContent=new Intl.DateTimeFormat("en", {weekday:"short",year:"numeric",month:"short",day:"numeric"}).format(new Date());
$("year").textContent=new Date().getFullYear();
renderDashboard();renderStudents();renderAttendance();renderCourses();

/* EduManage chatbot: built-in FAQ assistant (no external AI service/API). */
const chatPanel=$("chatPanel");
const chatMessages=$("chatMessages");
function addChatMessage(message,type){
  const bubble=document.createElement("div");
  bubble.className="chat-bubble "+(type==="user"?"user-message":"bot-message");
  bubble.textContent=message;
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop=chatMessages.scrollHeight;
}
function answerChat(question){
  const q=question.toLowerCase();
  if(/hello|hi|salam|assalam|aoa/.test(q)){
    return "Wa-Alaikum-Assalam! 😊 I can guide you about adding students, attendance, courses and the dashboard.";
  }
  if(/add|register|new student|student form/.test(q)){
    navigate("students");
    return "To add a student, open the Students section and click “＋ Add Student”. Enter the student's name, email, class and phone, then press Save Student.";
  }
  if(/remove|delete/.test(q)){
    navigate("students");
    return "Open Students, find the student's row and click Remove. The website will ask you to confirm before deleting the record.";
  }
  if(/search|find student/.test(q)){
    navigate("students");
    return "Open Students and use the search box above the table. You can search by name, email, class or phone number.";
  }
  if(/attendance|present|absent/.test(q)){
    navigate("attendance");
    return "Open Attendance. Use the dropdown beside each student's name to choose Present or Absent. Changes are saved in this browser.";
  }
  if(/course|subject/.test(q)){
    navigate("courses");
    return "Open Courses from the left menu to view the subjects currently listed in EduManage.";
  }
  if(/dashboard|total|count|how many student|number of student/.test(q)){
    navigate("dashboard");
    return "There are currently "+students.length+" student record(s) in this browser. The dashboard also shows course and today's attendance counts.";
  }
  if(/data|save|stored|database|another device|phone|laptop/.test(q)){
    return "At the moment, student and attendance records are saved in this browser's local storage. They are not automatically shared with another phone or computer. A secure online database and backend would be needed for shared access.";
  }
  if(/help|what can you do|features/.test(q)){
    return "I can guide you through adding, searching and removing students, marking attendance, viewing courses and checking dashboard counts. Try one of the suggested questions.";
  }
  return "Sorry, I don't have an answer for that yet. You can ask me about adding students, searching records, attendance, courses or the dashboard.";
}
function sendChatMessage(message){
  const clean=message.trim();
  if(!clean)return;
  addChatMessage(clean,"user");
  const reply=answerChat(clean);
  window.setTimeout(()=>addChatMessage(reply,"bot"),180);
}
$("chatLauncher").addEventListener("click",()=>{
  chatPanel.classList.toggle("open");
  if(chatPanel.classList.contains("open"))$("chatInput").focus();
});
$("chatClose").addEventListener("click",()=>chatPanel.classList.remove("open"));
$("chatForm").addEventListener("submit",event=>{
  event.preventDefault();
  const input=$("chatInput");
  sendChatMessage(input.value);
  input.value="";
});
chatMessages.addEventListener("click",event=>{
  const button=event.target.closest("[data-chat-question]");
  if(button)sendChatMessage(button.dataset.chatQuestion);
});
