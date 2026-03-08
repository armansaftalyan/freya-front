const amdFormatter = new Intl.NumberFormat('hy-AM', {
  maximumFractionDigits: 0,
})

export const useCurrency = () => {
  const formatAmd = (value: number | string | null | undefined): string => {
    const amount = typeof value === 'string' ? Number(value) : value
    if (amount === null || amount === undefined || Number.isNaN(amount)) {
      return `0 ֏`
    }

    return `${amdFormatter.format(amount)} ֏`
  }

  return {
    formatAmd,
  }
}
