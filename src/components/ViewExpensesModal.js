import { Button, Modal, Stack } from 'react-bootstrap'
import { UNCATEGORIZED_BUDGET_ID, useBudgets } from '../contexts/BudgetsContext'
import { currencyFormatter } from '../utils'

export default function ViewExpensesModal({ budgetId, handleClose }) {
  const { getBudgetExpenses, budgets, deleteBudget, deleteExpense } =
    useBudgets()

  const budget = budgets.find((budget) => budget.id === budgetId)

  return (
    <Modal
      show={budgetId !== null}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <Stack
            direction="horizontal"
            gap={2}
          >
            <div>Expenses - {budget?.name}</div>
            {budgetId !== UNCATEGORIZED_BUDGET_ID && (
              <Button
                onClick={() => {
                  deleteBudget(budgetId)
                  handleClose()
                }}
                variant="outline-danger"
              >
                Delete
              </Button>
            )}
          </Stack>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack
          direction="vertical"
          gap={3}
        >
          {getBudgetExpenses(budgetId).map((expense) => (
            <Stack
              direction="horizontal"
              gap={2}
              key={expense.id}
            >
              <div className="me-auto fs-4">{expense.description}</div>
              <div className="fs-5">
                {currencyFormatter.format(expense.amount)}
              </div>
              <Button
                onClick={() => deleteExpense(expense.id)}
                size="sm"
                variant="outline-danger"
              >
                &times;
              </Button>
            </Stack>
          ))}
        </Stack>
      </Modal.Body>
    </Modal>
  )
}
