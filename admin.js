async function checkLogin() {
  const res = await fetch('/check-auth');
  const data = await res.json();

  if (!data.loggedIn) {
    alert('Please login first');
    window.location.href = '/index.html';
  }
}

checkLogin();
