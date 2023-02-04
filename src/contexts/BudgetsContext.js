import { createContext, useContext } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

const BudgetsContext = createContext({
  budgets: [
    {
      id: String,
      name: String,
      max: Number,
    },
  ],
  expenses: [
    {
      id: String,
      budgetId: String,
      amount: Number,
      description: String,
    },
  ],
  getBudgetExpenses(budgetId) {},
  addExpense(budgetId, amount, description) {},
  addBudget({ name: String, max: Number }) {},
  deleteBudget(budgetId) {},
  deleteExpense(expenseId) {},
})

export const UNCATEGORIZED_BUDGET_ID = 'Uncategorized'

export function useBudgets() {
  return useContext(BudgetsContext)
}

export function BudgetsProvider({ children }) {
  const [budgets, setBudgets] = useLocalStorage('budgets', [
    {
      id: UNCATEGORIZED_BUDGET_ID,
      name: 'Uncategorized',
    },
  ])
  const [expenses, setExpenses] = useLocalStorage('expenses', [])

  function getBudgetExpenses(budgetId) {
    return expenses.filter((expense) => expense.budgetId === budgetId)
  }
  function addExpense({ budgetId, amount, description }) {
    setExpenses((currentExpenses) => [
      ...currentExpenses,
      { id: crypto.randomUUID(), budgetId, amount, description },
    ])
  }
  function addBudget({ name, max }) {
    if (budgets.find((budget) => budget.name === name)) return

    setBudgets((currentBudgets) => [
      { id: crypto.randomUUID(), name, max },
      ...currentBudgets,
    ])
  }
  function deleteBudget(budgetId) {
    setBudgets((currentBudgets) =>
      currentBudgets.filter((budget) => budget.id !== budgetId),
    )
  }
  function deleteExpense(expenseId) {
    setExpenses((currentExpenses) =>
      currentExpenses.filter((expense) => expense.id !== expenseId),
    )
  }

  return (
    <BudgetsContext.Provider
      value={{
        budgets,
        expenses,
        getBudgetExpenses,
        addExpense,
        addBudget,
        deleteBudget,
        deleteExpense,
      }}
    >
      {children}
    </BudgetsContext.Provider>
  )
}
