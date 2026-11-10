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
function loadStudents(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []}catch{return []}}
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
  $("studentSubtitle").textContent=students.length+" / 10 students registered";
  const addButton=$("openStudentForm");
  addButton.disabled=students.length>=10;
  addButton.textContent=students.length>=10?"✓ Student Limit Reached":"＋ Add Student";
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
$("openStudentForm").addEventListener("click",()=>{if(students.length>=10){showToast("Maximum limit is 10 students. Remove a student to add another.");return}$("studentModal").classList.add("open")});
function closeModal(){$("studentModal").classList.remove("open");$("studentForm").reset()}
$("closeStudentForm").addEventListener("click",closeModal);
$("cancelStudentForm").addEventListener("click",closeModal);
$("studentModal").addEventListener("click",event=>{if(event.target===$("studentModal"))closeModal()});
$("studentForm").addEventListener("submit",event=>{
  event.preventDefault();
  if(students.length>=10){showToast("Maximum limit is 10 students. Remove a student to add another.");closeModal();return}
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