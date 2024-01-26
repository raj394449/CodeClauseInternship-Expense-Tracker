const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

const list = document.getElementById("transactionList");
const form = document.getElementById("transactionForm");
const transactionHistory = document.getElementById("transactionHistory");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    signDisplay: "always",
});

form.addEventListener("submit", addTransaction);

function updateTotal() {
    const incomeTotal = transactions
        .filter((trx) => trx.type === "income")
        .reduce((total, trx) => total + trx.amount, 0);

    const expenseTotal = transactions
        .filter((trx) => trx.type === "expense")
        .reduce((total, trx) => total + trx.amount, 0);

    const balanceTotal = incomeTotal - expenseTotal;

    balance.textContent = formatter.format(balanceTotal).substring(1);
    income.textContent = formatter.format(incomeTotal);
    expense.textContent = formatter.format(expenseTotal * -1);
}

function transactionHistoryList() {
    list.innerHTML = "";

    transactionHistory.textContent = "";
    if (transactions.length === 0) {
        transactionHistory.textContent = "No transactions.";
        return;
    }

    transactions.forEach(({ id, name, amount, type }) => {
        const sign = "income" === type ? 1 : -1;

        const li = document.createElement("li");

        li.innerHTML = `
      <div class="name">
        <h4>${name}</h4>
      </div>

      <div class="amount ${type}">
        <span>${formatter.format(amount * sign)}</span>
      </div>
    
      <div class="action">
        <p onclick="deleteTransaction(${id})">X</p>
      </div>
    `;

        list.appendChild(li);
    });
}

transactionHistoryList();
updateTotal();

function deleteTransaction(id) {
    const index = transactions.findIndex((trx) => trx.id === id);
    transactions.splice(index, 1);

    updateTotal();
    saveTransactions();
    transactionHistoryList();
}

function addTransaction(e) {
    e.preventDefault();

    const formData = new FormData(this);

    transactions.push({
        id: transactions.length + 1,
        name: formData.get("name"),
        amount: parseFloat(formData.get("amount")),
        type: "on" === formData.get("type") ? "income" : "expense",
    });

    this.reset();

    updateTotal();
    saveTransactions();
    transactionHistoryList();
}

function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}