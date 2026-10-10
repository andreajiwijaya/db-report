import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { fetchSheetData, getMonthKey, getPublicationDate, getUniqueBulan } from '../utils/dataUtils'
import { SHEET_XLSX_URL, isSheetCsvUrlConfigured } from '../utils/constants'

export function useMonevData() {
  const [rawData, setRawData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const isMounted = useRef(true)

  const fetchData = useCallback(async () => {
    if (!isSheetCsvUrlConfigured) {
      setLoading(false)
      setError(
        'VITE_SHEET_XLSX_URL belum diisi. Tambahkan URL export XLSX Google Sheets ke file .env.local lalu jalankan ulang dev server.'
      )
      return
    }

    setLoading(true)
    setError(null)
    try {
      const data = await fetchSheetData(SHEET_XLSX_URL)
      if (!isMounted.current) return
      setRawData(data)
      setLastUpdated(new Date())
    } catch (e) {
      if (!isMounted.current) return
      setError(e.message)
    } finally {
      if (isMounted.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    isMounted.current = true
    const timer = setTimeout(() => {
      if (isMounted.current) {
        fetchData()
      }
    }, 0)
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => {
      isMounted.current = false
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [fetchData])

  const bulanOptions = useMemo(() => getUniqueBulan(rawData), [rawData])

  return { rawData, loading, error, lastUpdated, refetch: fetchData, bulanOptions }
}

export function useFilteredData(rawData, filters) {
  return useMemo(() => {
    let data = [...rawData]

    if (filters.up3 && filters.up3 !== 'all') {
      data = data.filter((d) => d.up3 === filters.up3)
    }

    if (filters.bulan && filters.bulan !== 'all') {
      data = data.filter((d) => {
        return getMonthKey(getPublicationDate(d)) === filters.bulan
      })
    }

    // Date range filter
    if (filters.dateFrom || filters.dateTo) {
      const dateFrom = filters.dateFrom instanceof Date ? filters.dateFrom : filters.dateFrom ? new Date(filters.dateFrom) : null
      const dateTo = filters.dateTo instanceof Date ? filters.dateTo : filters.dateTo ? new Date(filters.dateTo) : null

      data = data.filter((d) => {
        const publicationDate = getPublicationDate(d)
        if (!publicationDate) return false
        if (dateFrom && publicationDate < dateFrom) return false
        if (dateTo) {
          const endOfDay = new Date(dateTo)
          endOfDay.setHours(23, 59, 59, 999)
          if (publicationDate > endOfDay) return false
        }
        return true
      })
    }

    if (filters.status && filters.status !== 'all') {
      data = data.filter((d) => d.status === filters.status)
    }

    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase()
      data = data.filter(
        (d) =>
          d.judul.toLowerCase().includes(q) ||
          d.up3Raw.toLowerCase().includes(q) ||
          d.tipe.toLowerCase().includes(q)
      )
    }

    if (filters.tipe && filters.tipe !== 'all') {
      data = data.filter((d) => d.tipe === filters.tipe)
    }

    return data
  }, [rawData, filters])
}
