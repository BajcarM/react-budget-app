import { useState } from 'react'
import { Container, Stack, Button } from 'react-bootstrap'
import { createPortal } from 'react-dom'
import AddBudgetModal from './components/AddBudgetModal'
import AddExpenseModal from './components/AddExpenseModal'
import BudgetCard from './components/BudgetCard'
import ViewExpensesModal from './components/ViewExpensesModal'
import { UNCATEGORIZED_BUDGET_ID, useBudgets } from './contexts/BudgetsContext'

export default function App() {
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false)
  const [showAdExpensetModal, setShowAddExpenseModal] = useState(false)
  const [addExpenseModalBudgetId, setAddExpenseModalBudgetId] = useState(
    UNCATEGORIZED_BUDGET_ID,
  )
  const [viewExpensesModalBudgetId, setViewExpensesModalBudgetId] =
    useState(null)

  const { budgets, getBudgetExpenses } = useBudgets()

  function openAddExpenseModal(budgetId) {
    setShowAddExpenseModal(true)
    setAddExpenseModalBudgetId(budgetId)
  }

  return (
    <>
      <Container className="my-4">
        <Stack
          direction="horizontal"
          gap="2"
          className="mb-4"
        >
          <h1 className="me-auto">Budgets </h1>
          <Button
            variant="primary"
            onClick={() => setShowAddBudgetModal(true)}
          >
            Add Budget
          </Button>
          <Button
            variant="outline-primary"
            onClick={() => openAddExpenseModal(UNCATEGORIZED_BUDGET_ID)}
          >
            Add Expense
          </Button>
        </Stack>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1rem',
            alignItems: 'flex-start',
          }}
        >
          {budgets.map((budget) => {
            const amount = getBudgetExpenses(budget.id).reduce(
              (acc, expense) => acc + expense.amount,
              0,
            )

            return (
              <BudgetCard
                key={budget.id}
                name={budget.name}
                amount={amount}
                max={budget.max}
                onAddExpense={() => openAddExpenseModal(budget.id)}
                onViewExpenses={() => setViewExpensesModalBudgetId(budget.id)}
                gray={budget.id === UNCATEGORIZED_BUDGET_ID}
              />
            )
          })}
        </div>
      </Container>
      {createPortal(
        <AddBudgetModal
          show={showAddBudgetModal}
          handleClose={() => setShowAddBudgetModal(false)}
        />,
        document.body,
      )}

      {createPortal(
        <AddExpenseModal
          show={showAdExpensetModal}
          handleClose={() => setShowAddExpenseModal(false)}
          defaultBudgetId={addExpenseModalBudgetId}
        />,
        document.body,
      )}
      {createPortal(
        <ViewExpensesModal
          budgetId={viewExpensesModalBudgetId}
          handleClose={() => setViewExpensesModalBudgetId(null)}
        />,
        document.body,
      )}
    </>
  )
}
