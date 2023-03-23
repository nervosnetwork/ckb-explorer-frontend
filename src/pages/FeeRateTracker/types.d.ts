declare namespace FeeRateTracker {
  export interface TransactionFeeRate {
    id: number
    timestamp: number
    feeRate: number
    confirmationTime: number
  }

  export interface PendingTransactionFeeRate {
    id: number
    feeRate: number
  }

  export interface LastNDaysTransactionFeeRate {
    date: string
    feeRate: string
  }

  export interface TransactionFeesStatistic {
    transactionFeeRates: TransactionFeeRate[]
    pendingTransactionFeeRates: PendingTransactionFeeRate[]
    lastNDaysTransactionFeeRates: LastNDaysTransactionFeeRate[]
  }

  export interface FeeRateCard {
    priority: string
    icon: ReactComponent
    feeRate?: string
    priorityClass: string
    confirmationTime: number
  }
}
