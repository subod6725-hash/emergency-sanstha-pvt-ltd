function openLogin(mode='login'){
  document.getElementById('modal').classList.add('open');

  document.getElementById('modalTitle').textContent =
    mode==='invest' ? 'Investor Login' :
    mode==='request' ? 'Service Request Login' :
    'Admin Login';

  document.getElementById('modalText').textContent =
    'Username और Password डालें';
}

function closeModal(){
  document.getElementById('modal').classList.remove('open');
}

// 🔥 REAL LOGIN (SERVER CONNECTED)
function demoLogin(e){
  e.preventDefault();

  const username = document.getElementById('mobile').value;
  const password = document.querySelector('input[type="password"]').value;

  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: username,
      password: password
    })
  })
  .then(res => res.json())
  .then(data => {
    if(data.success){
      alert("Login Successful");

      closeModal();

      // 👉 Admin page open
      window.location.href = "admin.html";
    } else {
      alert("Wrong username or password");
    }
  })
  .catch(()=>{
    alert("Server error");
  });
}

function apply(product){
  alert(product+' application demo opened.');
}

window.onclick = e => {
  if(e.target.id==='modal') closeModal()
}
