document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const expenseListDaily = document.getElementById('expense-list-daily');
    const expenseListWeekly = document.getElementById('expense-list-weekly');
    const expenseListMonthly = document.getElementById('expense-list-monthly');
    const totalDaily = document.getElementById('total-daily');
    const totalWeekly = document.getElementById('total-weekly');
    const totalMonthly = document.getElementById('total-monthly');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    let expenses = [];

    // Initialize Pikaday
    let selectedDate = new Date();
    const picker = new Pikaday({
        field: document.getElementById('expense-date'),
        format: 'YYYY-MM-DD',
        onSelect: (date) => {
            selectedDate = date;
        }
    });

    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const expenseName = document.getElementById('expense-name').value;
        const expenseAmount = parseFloat(document.getElementById('expense-amount').value);
        // const expenseDate = document.getElementById('expense-date').value;

        const expense = {
            id: Date.now(),
            name: expenseName,
            amount: expenseAmount,
            date: selectedDate
        };

        expenses.push(expense);
        updateExpenseLists();
        updateTotals();
        expenseForm.reset();
        // Reset the date picker
        picker.setDate(new Date());
    });

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(button.dataset.tab).classList.add('active');
        });
    });

    function updateExpenseLists() {
        clearExpenseLists();
        const now = new Date();

        expenses.forEach(expense => {
            if (isSameDay(expense.date, now)) {
                addExpenseToList(expense, expenseListDaily);
            }
            if (isSameWeek(expense.date, now)) {
                addExpenseToList(expense, expenseListWeekly);
            }
            if (isSameMonth(expense.date, now)) {
                addExpenseToList(expense, expenseListMonthly);
            }
        });
    }

    function clearExpenseLists() {
        expenseListDaily.innerHTML = '';
        expenseListWeekly.innerHTML = '';
        expenseListMonthly.innerHTML = '';
    }

    function addExpenseToList(expense, listElement) {
        const li = document.createElement('li');
        li.setAttribute('data-id', expense.id);
        li.innerHTML = `
            ${expense.name} - $${expense.amount} on ${expense.date.toLocaleDateString()}
            <button>Delete</button>
        `;
        listElement.appendChild(li);
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
