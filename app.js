async function demoLogin(e){
  e.preventDefault();

  const username = "admin";
  const password = "1234";

  const res = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if(data.success){
    alert("Login Success");
    window.location.href = "/admin.html";
  } else {
    alert("Wrong login");
  }
}
