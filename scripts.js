document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');
    const totalDaily = document.getElementById('total-daily');
    const totalWeekly = document.getElementById('total-weekly');
    const totalMonthly = document.getElementById('total-monthly');
    let expenses = [];

    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const expenseName = document.getElementById('expense-name').value;
        const expenseAmount = parseFloat(document.getElementById('expense-amount').value);
        const expenseDate = document.getElementById('expense-date').value;

        const expense = {
            id: Date.now(),
            name: expenseName,
            amount: expenseAmount,
            date: new Date(expenseDate)
        };

        expenses.push(expense);
        addExpenseToList(expense);
        updateTotals();
        expenseForm.reset();
    });

    expenseList.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const expenseId = parseInt(e.target.parentElement.getAttribute('data-id'));
            expenses = expenses.filter(expense => expense.id !== expenseId);
            e.target.parentElement.remove();
            updateTotals();
        }
    });

    function addExpenseToList(expense) {
        const li = document.createElement('li');
        li.setAttribute('data-id', expense.id);
        li.innerHTML = `
            ${expense.name} - $${expense.amount} on ${expense.date.toLocaleDateString()}
            <button>Delete</button>
        `;
        expenseList.appendChild(li);
    }

    function updateTotals() {
        const now = new Date();
        const dailyExpenses = expenses.filter(expense => isSameDay(expense.date, now));
        const weeklyExpenses = expenses.filter(expense => isSameWeek(expense.date, now));
        const monthlyExpenses = expenses.filter(expense => isSameMonth(expense.date, now));

        totalDaily.textContent = calculateTotal(dailyExpenses).toFixed(2);
        totalWeekly.textContent = calculateTotal(weeklyExpenses).toFixed(2);
        totalMonthly.textContent = calculateTotal(monthlyExpenses).toFixed(2);
    }

    function isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }

    function isSameWeek(date1, date2) {
        const startOfWeek = date => {
            const day = date.getDay();
            return new Date(date.getFullYear(), date.getMonth(), date.getDate() - day);
        };
        return startOfWeek(date1).getTime() === startOfWeek(date2).getTime();
    }

    function isSameMonth(date1, date2) {
        return date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }

    function calculateTotal(expenses) {
        return expenses.reduce((sum, expense) => sum + expense.amount, 0);
    }
});
