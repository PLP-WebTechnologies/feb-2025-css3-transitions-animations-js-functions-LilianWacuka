// Select elements
const form = document.getElementById('transaction-form');
const description = document.getElementById('description');
const amount = document.getElementById('amount');
const transactionList = document.getElementById('transaction-list');
const balanceDisplay = document.getElementById('balance');

// initialize a transaction
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Function to update localStorage
function saveToLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Function to calculate and update balance
function updateBalance() {
  const total = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  balanceDisplay.textContent = total.toFixed(2);
  balanceDisplay.parentElement.classList.toggle('positive', total >= 0);
  balanceDisplay.parentElement.classList.toggle('negative', total < 0);
}

// Function to render transactions
function renderTransactions() {
  transactionList.innerHTML = '';

  transactions.forEach(tx => {
    const li = document.createElement('li');
    li.textContent = `${tx.description}: $${tx.amount.toFixed(2)}`;
    li.classList.add(tx.amount >= 0 ? 'income' : 'expense');
    
    transactionList.appendChild(li);
  });

  updateBalance();
}
document.getElementById('clear-btn').addEventListener('click', () => {
  transactions = [];
  localStorage.removeItem('transactions');
  renderTransactions();
});


// Handle form submission
const addBtn = document.getElementById('add-btn');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const desc = description.value.trim();
  const amt = parseFloat(amount.value);
  const type = document.getElementById('type').value;

  if (desc === '' || isNaN(amt)) return;

  const transaction = {
    description: desc,
    amount: type === 'expense' ? -Math.abs(amt) : Math.abs(amt),
  };

  transactions.push(transaction);
  saveToLocalStorage();
  renderTransactions();

  // Reset form
  description.value = '';
  amount.value = '';

  // Trigger button animation
  addBtn.classList.add('animate-button');

  // Remove animation class after it's done so it can trigger again next time
  setTimeout(() => {
    addBtn.classList.remove('animate-button');
  }, 400); // Match animation duration
});


// Initial render
renderTransactions();
