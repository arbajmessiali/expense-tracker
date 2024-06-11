document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');
    const totalAmount = document.getElementById('total-amount');
    let expenses = [];

    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const expenseName = document.getElementById('expense-name').value;
        const expenseAmount = parseFloat(document.getElementById('expense-amount').value);
        
        const expense = {
            id: Date.now(),
            name: expenseName,
            amount: expenseAmount
        };

        expenses.push(expense);
        addExpenseToList(expense);
        updateTotalAmount();
        expenseForm.reset();
    });

    expenseList.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const expenseId = parseInt(e.target.parentElement.getAttribute('data-id'));
            expenses = expenses.filter(expense => expense.id !== expenseId);
            e.target.parentElement.remove();
            updateTotalAmount();
        }
    });

    function addExpenseToList(expense) {
        const li = document.createElement('li');
        li.setAttribute('data-id', expense.id);
        li.innerHTML = `
            ${expense.name} - $${expense.amount}
            <button>Delete</button>
        `;
        expenseList.appendChild(li);
    }

    function updateTotalAmount() {
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        totalAmount.textContent = total.toFixed(2);
    }
});
