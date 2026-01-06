import React, { useState } from 'react'
import Head from 'next/head'
import { DashboardLayout } from '@/components/Dashboard'
import {
  useTransactions,
  useCreateTransaction,
  useDeleteTransaction,
  useMonthlyStats,
  type Transaction,
  type TransactionType,
  type TransactionCategory,
} from '@/hooks/useMoney'

const EXPENSE_CATEGORIES: { value: TransactionCategory; label: string; emoji: string }[] = [
  { value: 'housing', label: 'Housing', emoji: '🏠' },
  { value: 'utilities', label: 'Utilities', emoji: '💡' },
  { value: 'groceries', label: 'Groceries', emoji: '🛒' },
  { value: 'dining', label: 'Dining', emoji: '🍽️' },
  { value: 'transport', label: 'Transport', emoji: '🚗' },
  { value: 'health', label: 'Health', emoji: '💊' },
  { value: 'entertainment', label: 'Entertainment', emoji: '🎬' },
  { value: 'shopping', label: 'Shopping', emoji: '🛍️' },
  { value: 'subscriptions', label: 'Subscriptions', emoji: '📱' },
  { value: 'education', label: 'Education', emoji: '📚' },
  { value: 'gifts', label: 'Gifts', emoji: '🎁' },
  { value: 'travel', label: 'Travel', emoji: '✈️' },
  { value: 'personal', label: 'Personal', emoji: '👤' },
  { value: 'other', label: 'Other', emoji: '📦' },
]

const INCOME_CATEGORIES: { value: TransactionCategory; label: string; emoji: string }[] = [
  { value: 'salary', label: 'Salary', emoji: '💼' },
  { value: 'freelance', label: 'Freelance', emoji: '💻' },
  { value: 'investments', label: 'Investments', emoji: '📈' },
  { value: 'other_income', label: 'Other', emoji: '💵' },
]

function getCurrentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export default function MoneyPage() {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth())
  const [showTransactionForm, setShowTransactionForm] = useState(false)

  const { data: transactions = [] } = useTransactions({ month: selectedMonth })
  const { data: stats } = useMonthlyStats(selectedMonth)

  const createTransaction = useCreateTransaction()
  const deleteTransaction = useDeleteTransaction()

  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    transaction_type: 'expense' as TransactionType,
    transaction_date: new Date().toISOString().split('T')[0],
    category: '' as TransactionCategory | '',
  })

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTransaction.description.trim() || !newTransaction.amount) return

    const amount = parseFloat(newTransaction.amount)

    await createTransaction.mutateAsync({
      description: newTransaction.description.trim(),
      amount: newTransaction.transaction_type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
      transaction_type: newTransaction.transaction_type,
      transaction_date: newTransaction.transaction_date,
      category: newTransaction.category || null,
    })

    setNewTransaction({
      description: '',
      amount: '',
      transaction_type: 'expense',
      transaction_date: new Date().toISOString().split('T')[0],
      category: '',
    })
    setShowTransactionForm(false)
  }

  const monthDisplay = new Date(selectedMonth + '-01').toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <>
      <Head>
        <title>Money — Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <DashboardLayout title="Money">
        <div className="money-page">
          <div className="month-nav">
            <button
              className="nav-btn"
              onClick={() => {
                const [y, m] = selectedMonth.split('-').map(Number)
                const prev = m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, '0')}`
                setSelectedMonth(prev)
              }}
            >
              <ChevronLeftIcon />
            </button>
            <span className="month-display">{monthDisplay}</span>
            <button
              className="nav-btn"
              onClick={() => {
                const [y, m] = selectedMonth.split('-').map(Number)
                const next = m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, '0')}`
                setSelectedMonth(next)
              }}
            >
              <ChevronRightIcon />
            </button>
          </div>

          <div className="stats-row">
            <div className="stat-card income">
              <span className="stat-label">Income</span>
              <span className="stat-value">{formatCurrency(stats?.income || 0)}</span>
            </div>
            <div className="stat-card expenses">
              <span className="stat-label">Expenses</span>
              <span className="stat-value">{formatCurrency(stats?.expenses || 0)}</span>
            </div>
            <div className={`stat-card savings ${(stats?.savings || 0) >= 0 ? 'positive' : 'negative'}`}>
              <span className="stat-label">Savings</span>
              <span className="stat-value">{formatCurrency(stats?.savings || 0)}</span>
            </div>
          </div>

          {stats?.byCategory && Object.keys(stats.byCategory).length > 0 && (
            <div className="category-breakdown">
              <h3 className="section-title">Spending by Category</h3>
              <div className="categories-grid">
                {Object.entries(stats.byCategory)
                  .sort((a, b) => b[1] - a[1])
                  .map(([category, amount]) => {
                    const cat = EXPENSE_CATEGORIES.find((c) => c.value === category)
                    return (
                      <div key={category} className="category-item">
                        <span className="category-emoji">{cat?.emoji || '📦'}</span>
                        <span className="category-name">{cat?.label || category}</span>
                        <span className="category-amount">{formatCurrency(amount)}</span>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}

          <div className="transactions-section">
            <div className="section-header">
              <h3 className="section-title">Transactions</h3>
              <button className="add-btn" onClick={() => setShowTransactionForm(true)}>
                <PlusIcon />
                <span>Add</span>
              </button>
            </div>

            {transactions.length === 0 ? (
              <div className="empty-state">
                <p>No transactions for this month. Start tracking!</p>
              </div>
            ) : (
              <ul className="transactions-list">
                {transactions.map((tx) => {
                  const cat = tx.transaction_type === 'income'
                    ? INCOME_CATEGORIES.find((c) => c.value === tx.category)
                    : EXPENSE_CATEGORIES.find((c) => c.value === tx.category)

                  return (
                    <li key={tx.id} className="transaction-item">
                      <div className="transaction-info">
                        <span className="transaction-emoji">{cat?.emoji || (tx.transaction_type === 'income' ? '💵' : '📦')}</span>
                        <div className="transaction-details">
                          <span className="transaction-description">{tx.description}</span>
                          <span className="transaction-meta">
                            {new Date(tx.transaction_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            {tx.category && ` • ${cat?.label || tx.category}`}
                          </span>
                        </div>
                      </div>
                      <div className="transaction-amount-wrapper">
                        <span className={`transaction-amount ${tx.amount >= 0 ? 'income' : 'expense'}`}>
                          {tx.amount >= 0 ? '+' : ''}{formatCurrency(Math.abs(tx.amount))}
                        </span>
                        <button
                          className="delete-btn"
                          onClick={() => deleteTransaction.mutate(tx.id)}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>

        {showTransactionForm && (
          <div className="modal-overlay" onClick={() => setShowTransactionForm(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3 className="modal-title">Add Transaction</h3>
              <form onSubmit={handleCreateTransaction}>
                <div className="transaction-type-tabs">
                  <button
                    type="button"
                    className={`type-tab ${newTransaction.transaction_type === 'expense' ? 'active' : ''}`}
                    onClick={() => setNewTransaction({ ...newTransaction, transaction_type: 'expense', category: '' })}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    className={`type-tab ${newTransaction.transaction_type === 'income' ? 'active' : ''}`}
                    onClick={() => setNewTransaction({ ...newTransaction, transaction_type: 'income', category: '' })}
                  >
                    Income
                  </button>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                    placeholder="e.g., Coffee shop"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newTransaction.amount}
                      onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      value={newTransaction.transaction_date}
                      onChange={(e) => setNewTransaction({ ...newTransaction, transaction_date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={newTransaction.category}
                    onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value as TransactionCategory })}
                  >
                    <option value="">Select category</option>
                    {(newTransaction.transaction_type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((c) => (
                      <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
                    ))}
                  </select>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowTransactionForm(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <style jsx>{`
          .money-page {
            max-width: 800px;
            margin: 0 auto;
          }
          .month-nav {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 1.5rem;
          }
          .nav-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0.5rem;
            background: var(--color-background-card);
            border: 1px solid var(--color-border);
            border-radius: 6px;
            cursor: pointer;
          }
          .nav-btn :global(svg) {
            width: 16px;
            height: 16px;
          }
          .month-display {
            font-family: var(--font-display);
            font-size: 1.25rem;
            min-width: 180px;
            text-align: center;
          }
          .stats-row {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
            margin-bottom: 2rem;
          }
          .stat-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 1.25rem;
            background: var(--color-background-card);
            border: 1px solid var(--color-border);
            border-radius: 12px;
          }
          .stat-card.income { border-color: #10b981; }
          .stat-card.expenses { border-color: #ef4444; }
          .stat-card.savings.positive { border-color: #10b981; }
          .stat-card.savings.negative { border-color: #ef4444; }
          .stat-label {
            font-size: 0.75rem;
            color: var(--color-text-muted);
            text-transform: uppercase;
            letter-spacing: 0.03em;
          }
          .stat-value {
            font-family: var(--font-display);
            font-size: 1.5rem;
            margin-top: 0.25rem;
          }
          .stat-card.income .stat-value { color: #10b981; }
          .stat-card.expenses .stat-value { color: #ef4444; }
          .stat-card.savings.positive .stat-value { color: #10b981; }
          .stat-card.savings.negative .stat-value { color: #ef4444; }
          .category-breakdown {
            background: var(--color-background-card);
            border: 1px solid var(--color-border);
            border-radius: 12px;
            padding: 1.25rem;
            margin-bottom: 1.5rem;
          }
          .section-title {
            font-family: var(--font-display);
            font-size: 1rem;
            font-weight: 400;
            margin: 0 0 1rem;
          }
          .categories-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 0.75rem;
          }
          .category-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 0.75rem;
            background: var(--color-background-subtle);
            border-radius: 8px;
          }
          .category-emoji {
            font-size: 1.25rem;
            margin-bottom: 0.25rem;
          }
          .category-name {
            font-size: 0.75rem;
            color: var(--color-text-muted);
          }
          .category-amount {
            font-size: 0.875rem;
            font-weight: 500;
            margin-top: 0.25rem;
          }
          .transactions-section {
            background: var(--color-background-card);
            border: 1px solid var(--color-border);
            border-radius: 12px;
            padding: 1.25rem;
          }
          .section-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1rem;
          }
          .add-btn {
            display: flex;
            align-items: center;
            gap: 0.375rem;
            font-size: 0.75rem;
            font-weight: 500;
            color: var(--color-accent);
            background: var(--color-accent-subtle);
            border: none;
            border-radius: 6px;
            padding: 0.375rem 0.625rem;
            cursor: pointer;
          }
          .add-btn :global(svg) {
            width: 14px;
            height: 14px;
          }
          .empty-state {
            padding: 2rem;
            text-align: center;
            color: var(--color-text-muted);
          }
          .transactions-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .transaction-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.75rem 0;
            border-bottom: 1px solid var(--color-border-subtle);
          }
          .transaction-item:last-child {
            border-bottom: none;
          }
          .transaction-info {
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }
          .transaction-emoji {
            font-size: 1.25rem;
          }
          .transaction-details {
            display: flex;
            flex-direction: column;
          }
          .transaction-description {
            font-size: 0.9375rem;
            font-weight: 500;
          }
          .transaction-meta {
            font-size: 0.75rem;
            color: var(--color-text-muted);
          }
          .transaction-amount-wrapper {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          .transaction-amount {
            font-size: 0.9375rem;
            font-weight: 600;
          }
          .transaction-amount.income { color: #10b981; }
          .transaction-amount.expense { color: #ef4444; }
          .delete-btn {
            background: none;
            border: none;
            color: var(--color-text-muted);
            cursor: pointer;
            padding: 0.25rem;
            opacity: 0;
            transition: opacity 0.15s;
          }
          .transaction-item:hover .delete-btn {
            opacity: 1;
          }
          .delete-btn:hover {
            color: #ef4444;
          }
          .delete-btn :global(svg) {
            width: 16px;
            height: 16px;
          }
          .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 1rem;
          }
          .modal {
            background: var(--color-background-card);
            border-radius: 12px;
            padding: 1.5rem;
            width: 100%;
            max-width: 400px;
          }
          .modal-title {
            font-family: var(--font-display);
            font-size: 1.125rem;
            font-weight: 400;
            margin: 0 0 1.25rem;
          }
          .transaction-type-tabs {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 1rem;
          }
          .type-tab {
            flex: 1;
            padding: 0.5rem;
            font-size: 0.875rem;
            font-weight: 500;
            background: var(--color-background);
            border: 1px solid var(--color-border);
            border-radius: 6px;
            cursor: pointer;
          }
          .type-tab.active {
            background: var(--color-accent-subtle);
            border-color: var(--color-accent);
            color: var(--color-accent);
          }
          .form-group {
            margin-bottom: 1rem;
          }
          .form-group label {
            display: block;
            font-size: 0.75rem;
            font-weight: 500;
            color: var(--color-text-muted);
            margin-bottom: 0.375rem;
          }
          .form-group input,
          .form-group select {
            width: 100%;
            padding: 0.5rem 0.75rem;
            font-size: 0.875rem;
            border: 1px solid var(--color-border);
            border-radius: 6px;
            background: var(--color-background);
          }
          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
          }
          .modal-actions {
            display: flex;
            justify-content: flex-end;
            gap: 0.75rem;
            margin-top: 1.5rem;
          }
          .btn-secondary, .btn-primary {
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
            font-weight: 500;
            border-radius: 6px;
            cursor: pointer;
          }
          .btn-secondary {
            color: var(--color-text-secondary);
            background: var(--color-background);
            border: 1px solid var(--color-border);
          }
          .btn-primary {
            color: white;
            background: var(--color-accent);
            border: none;
          }
          @media (max-width: 768px) {
            .stats-row {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </DashboardLayout>
    </>
  )
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
}
