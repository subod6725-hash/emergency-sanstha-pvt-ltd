const seed={
customers:[
{name:'Rahul Kumar',mobile:'98XXXXXX10',address:'Bihar',loanId:'LN1001',status:'Active'},
{name:'Pooja Devi',mobile:'97XXXXXX22',address:'Bihar',loanId:'LN1002',status:'Active'}
],
loans:[
{id:'LN1001',customer:'Rahul Kumar',product:'Personal Loan',amount:'₹1,00,000',emi:'₹4,500',status:'Active'},
{id:'LN1002',customer:'Pooja Devi',product:'Home Loan',amount:'₹5,00,000',emi:'₹8,200',status:'Active'}
],
investors:[
{name:'Amit Kumar',mobile:'99XXXXXX11',deposit:'₹50,000',withdrawal:'₹10,000',balance:'₹40,000',status:'Active'}
],
requests:[
{id:'SR1001',customer:'Rahul Kumar',category:'EMI Related',date:'30/08/2026',status:'Pending'}
]};

let db=JSON.parse(localStorage.getItem('es_db')||'null')||seed;

function save(){
  localStorage.setItem('es_db',JSON.stringify(db))
}

function showTab(id,btn){
  document.querySelectorAll('.tab').forEach(x=>x.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
  document.querySelectorAll('.side').forEach(x=>x.classList.remove('active'));
  if(btn)btn.classList.add('active');
  render()
}

function render(){
  document.getElementById('statCustomers').textContent=db.customers.length;
  document.getElementById('statLoans').textContent=db.loans.filter(x=>x.status==='Active').length;
  document.getElementById('statInvestors').textContent=db.investors.length;
  document.getElementById('statRequests').textContent=db.requests.filter(x=>x.status==='Pending').length;

  fill('customersTable',db.customers,x=>`<td>${x.name}</td><td>${x.mobile}</td><td>${x.address}</td><td>${x.loanId}</td><td>${x.status}</td>`);
  fill('loansTable',db.loans,x=>`<td>${x.id}</td><td>${x.customer}</td><td>${x.product}</td><td>${x.amount}</td><td>${x.emi}</td><td>${x.status}</td>`);
  fill('investorsTable',db.investors,x=>`<td>${x.name}</td><td>${x.mobile}</td><td>${x.deposit}</td><td>${x.withdrawal}</td><td>${x.balance}</td><td>${x.status}</td>`);
  fill('requestsTable',db.requests,x=>`<td>${x.id}</td><td>${x.customer}</td><td>${x.category}</td><td>${x.date}</td><td>${x.status}</td>`)
}

function fill(id,arr,fn){
  let el=document.getElementById(id);
  if(el)
    el.innerHTML=arr.map(x=>`<tr>${fn(x)}</tr>`).join('')
    ||'<tr><td colspan="8">No records</td></tr>'
}

function addCustomer(){
  let n=prompt('Customer name?');
  if(!n)return;
  db.customers.push({
    name:n,
    mobile:prompt('Mobile?')||'-',
    address:prompt('Address?')||'-',
    loanId:'-',
    status:'Active'
  });
  save();
  render()
}

function addLoan(){
  let id=prompt('Loan ID?');
  if(!id)return;
  db.loans.push({
    id,
    customer:prompt('Customer?')||'-',
    product:prompt('Product?')||'Personal Loan',
    amount:prompt('Amount?')||'₹0',
    emi:prompt('EMI?')||'₹0',
    status:'Active'
  });
  save();
  render()
}

function addInvestor(){
  let n=prompt('Investor name?');
  if(!n)return;
  let d=prompt('Deposit?')||'₹0';
  db.investors.push({
    name:n,
    mobile:prompt('Mobile?')||'-',
    deposit:d,
    withdrawal:'₹0',
    balance:d,
    status:'Active'
  });
  save();
  render()
}

function addRequest(){
  let c=prompt('Customer?');
  if(!c)return;
  db.requests.push({
    id:'SR'+(1001+db.requests.length),
    customer:c,
    category:prompt('Category?')||'Other',
    date:new Date().toLocaleDateString('en-GB'),
    status:'Pending'
  });
  save();
  render()
}

// 🔥 REAL LOGOUT FIX
function adminLogout(){
  fetch('/logout', {
    method: 'POST'
  })
  .then(res => res.json())
  .then(data => {
    if(data.success){
      alert("Logout Successful");
      window.location.href = "index.html";
    }
  })
  .catch(()=>{
    alert("Logout Error");
  });
}

render();
