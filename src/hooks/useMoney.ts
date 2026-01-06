import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export type TransactionType = 'income' | 'expense' | 'transfer'
export type TransactionCategory =
  | 'salary' | 'freelance' | 'investments' | 'other_income'
  | 'housing' | 'utilities' | 'groceries' | 'dining' | 'transport'
  | 'health' | 'entertainment' | 'shopping' | 'subscriptions'
  | 'education' | 'gifts' | 'travel' | 'personal' | 'other'

export interface Transaction {
  id: string
  owner_id: string
  description: string
  amount: number
  transaction_type: TransactionType
  transaction_date: string
  category: TransactionCategory | null
  account: string | null
  notes: string | null
  tags: string[]
  is_recurring: boolean
  recurrence_rule: string | null
  created_at: string
  updated_at: string
}

export interface Budget {
  id: string
  owner_id: string
  category: string
  monthly_limit: number
  notes: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

const TRANSACTIONS_KEY = ['transactions']
const BUDGETS_KEY = ['budgets']

export function useTransactions(filters?: { month?: string; type?: TransactionType; category?: TransactionCategory }) {
  const supabase = createClient()

  return useQuery({
    queryKey: [...TRANSACTIONS_KEY, filters],
    queryFn: async () => {
      if (!supabase) return []

      let query = supabase
        .from('transactions')
        .select('*')
        .order('transaction_date', { ascending: false })

      if (filters?.month) {
        const [year, month] = filters.month.split('-')
        const startDate = `${year}-${month}-01`
        const endDate = new Date(parseInt(year), parseInt(month), 0).toISOString().split('T')[0]
        query = query.gte('transaction_date', startDate).lte('transaction_date', endDate)
      }

      if (filters?.type) {
        query = query.eq('transaction_type', filters.type)
      }

      if (filters?.category) {
        query = query.eq('category', filters.category)
      }

      const { data, error } = await query
      if (error) throw error
      return data as Transaction[]
    },
    enabled: !!supabase,
  })
}

export function useCreateTransaction() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (transaction: Partial<Omit<Transaction, 'id' | 'owner_id' | 'created_at' | 'updated_at'>>) => {
      if (!supabase) throw new Error('Supabase not available')

      const { data, error } = await supabase
        .from('transactions')
        .insert({
          description: transaction.description || 'Transaction',
          amount: transaction.amount || 0,
          transaction_type: transaction.transaction_type || 'expense',
          transaction_date: transaction.transaction_date || new Date().toISOString().split('T')[0],
          category: transaction.category || null,
          account: transaction.account || null,
          notes: transaction.notes || null,
          tags: transaction.tags || [],
          is_recurring: transaction.is_recurring || false,
          recurrence_rule: transaction.recurrence_rule || null,
        })
        .select()
        .single()

      if (error) throw error
      return data as Transaction
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY })
    },
  })
}

export function useUpdateTransaction() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Transaction> & { id: string }) => {
      if (!supabase) throw new Error('Supabase not available')

      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Transaction
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY })
    },
  })
}

export function useDeleteTransaction() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      if (!supabase) throw new Error('Supabase not available')

      const { error } = await supabase.from('transactions').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY })
    },
  })
}

// Budgets
export function useBudgets() {
  const supabase = createClient()

  return useQuery({
    queryKey: BUDGETS_KEY,
    queryFn: async () => {
      if (!supabase) return []

      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('is_active', true)
        .order('category')

      if (error) throw error
      return data as Budget[]
    },
    enabled: !!supabase,
  })
}

export function useCreateBudget() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (budget: { category: string; monthly_limit: number; notes?: string }) => {
      if (!supabase) throw new Error('Supabase not available')

      const { data, error } = await supabase
        .from('budgets')
        .upsert({
          category: budget.category,
          monthly_limit: budget.monthly_limit,
          notes: budget.notes || null,
        }, { onConflict: 'owner_id,category' })
        .select()
        .single()

      if (error) throw error
      return data as Budget
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUDGETS_KEY })
    },
  })
}

export function useDeleteBudget() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      if (!supabase) throw new Error('Supabase not available')

      const { error } = await supabase.from('budgets').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUDGETS_KEY })
    },
  })
}

// Monthly summary
export function useMonthlyStats(month: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: [...TRANSACTIONS_KEY, 'stats', month],
    queryFn: async () => {
      if (!supabase) return null

      const [year, m] = month.split('-')
      const startDate = `${year}-${m}-01`
      const lastDay = new Date(parseInt(year), parseInt(m), 0).getDate()
      const endDate = `${year}-${m}-${lastDay}`

      const { data, error } = await supabase
        .from('transactions')
        .select('amount, transaction_type, category')
        .gte('transaction_date', startDate)
        .lte('transaction_date', endDate)

      if (error) throw error

      const transactions = data || []
      const income = transactions
        .filter((t) => t.transaction_type === 'income')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0)
      const expenses = transactions
        .filter((t) => t.transaction_type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0)

      // Group by category
      const byCategory: Record<string, number> = {}
      transactions
        .filter((t) => t.transaction_type === 'expense')
        .forEach((t) => {
          const cat = t.category || 'other'
          byCategory[cat] = (byCategory[cat] || 0) + Math.abs(t.amount)
        })

      return {
        income,
        expenses,
        savings: income - expenses,
        byCategory,
      }
    },
    enabled: !!supabase && !!month,
  })
}
