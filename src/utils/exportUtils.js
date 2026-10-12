import { jsPDF } from 'jspdf'

const PAGE_WIDTH = 210
const PAGE_HEIGHT = 297
const MARGIN = 14
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2

const truncate = (value, length) => {
  const text = String(value ?? '-')
  return text.length > length ? `${text.slice(0, length - 1)}...` : text
}

const addPageHeader = (doc, title, subtitle) => {
  doc.setFillColor(29, 78, 216)
  doc.rect(0, 0, PAGE_WIDTH, 24, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text(title, MARGIN, 10)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text(subtitle, MARGIN, 17)
  doc.setTextColor(51, 65, 85)
}

const addFooter = (doc, pageNumber) => {
  doc.setDrawColor(226, 232, 240)
  doc.line(MARGIN, PAGE_HEIGHT - 12, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 12)
  doc.setTextColor(148, 163, 184)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.text('MonEv PLN v1.0 | Internal Use Only', MARGIN, PAGE_HEIGHT - 6)
  doc.text(`Halaman ${pageNumber}`, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 6, { align: 'right' })
}

const drawChart = (doc, groups, target) => {
  let y = 34
  doc.setTextColor(30, 64, 175)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('Grafik Realisasi Siaran Pers', MARGIN, y)
  y += 5
  doc.setTextColor(100, 116, 139)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text('Jumlah siaran pers berdasarkan unit dan bulan periode siaran.', MARGIN, y)
  y += 8

  const chartHeight = 18 + groups.length * 7
  doc.setFillColor(248, 250, 252)
  doc.setDrawColor(219, 234, 254)
  doc.roundedRect(MARGIN, y, CONTENT_WIDTH, chartHeight, 2, 2, 'FD')

  const labelWidth = 48
  const valueWidth = 10
  const barX = MARGIN + labelWidth
  const barWidth = CONTENT_WIDTH - labelWidth - valueWidth - 5
  const maxValue = Math.max(target, ...groups.map((group) => group.items.length), 1)
  const targetX = barX + (target / maxValue) * barWidth
  const rowHeight = Math.max(5, Math.min(7, (chartHeight - 8) / Math.max(groups.length, 1)))

  groups.forEach((group, index) => {
    const rowY = y + 7 + index * rowHeight
    doc.setTextColor(51, 65, 85)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(6.5)
    doc.text(truncate(`${group.unitLabel} - ${group.monthLabel}`, 28), MARGIN + 3, rowY + 2)
    doc.setFillColor(226, 232, 240)
    doc.roundedRect(barX, rowY - 2, barWidth, 4, 1, 1, 'F')
    doc.setFillColor(37, 99, 235)
    doc.roundedRect(barX, rowY - 2, Math.max(2, (group.items.length / maxValue) * barWidth), 4, 1, 1, 'F')
    doc.setDrawColor(245, 158, 11)
    doc.setLineDashPattern([1.5, 1.5], 0)
    doc.line(targetX, rowY - 5, targetX, rowY + 5)
    doc.setLineDashPattern([], 0)
    doc.setTextColor(15, 23, 42)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.text(String(group.items.length), MARGIN + CONTENT_WIDTH - 4, rowY + 2, { align: 'right' })
  })

  doc.setDrawColor(245, 158, 11)
  doc.setLineDashPattern([1.5, 1.5], 0)
  doc.line(targetX, y + chartHeight - 4, targetX, y + chartHeight + 3)
  doc.setLineDashPattern([], 0)
  doc.setTextColor(100, 116, 139)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.text(`Garis target: ${target} Siaran Pers`, targetX + 2, y + chartHeight + 3)

  return y + chartHeight + 14
}

export function exportPublicationPDF({
  groups,
  target = 3,
  filename = 'laporan-monitoring-siaran-pers.pdf',
}) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  let pageNumber = 1
  addPageHeader(doc, 'Laporan Monitoring Siaran Pers', 'PLN UID Riau & Kepri - Monitoring Siaran Pers')
  let y = drawChart(doc, groups, target)

  const ensureSpace = (height) => {
    if (y + height > PAGE_HEIGHT - 18) {
      addFooter(doc, pageNumber)
      doc.addPage()
      pageNumber += 1
      addPageHeader(doc, 'Laporan Monitoring Siaran Pers', 'PLN UID Riau & Kepri - Monitoring Siaran Pers')
      y = 34
    }
  }

  if (y > PAGE_HEIGHT - 30) {
    addFooter(doc, pageNumber)
    doc.addPage()
    pageNumber += 1
    addPageHeader(doc, 'Laporan Monitoring Siaran Pers', 'PLN UID Riau & Kepri - Monitoring Siaran Pers')
    y = 34
  }

  doc.setTextColor(30, 64, 175)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('Detail Pers per Unit dan Periode', MARGIN, y)
  y += 8

  groups.forEach((group) => {
    ensureSpace(18)
    doc.setFillColor(239, 246, 255)
    doc.roundedRect(MARGIN, y, CONTENT_WIDTH, 9, 2, 2, 'F')
    doc.setTextColor(30, 64, 175)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.text(truncate(group.unitLabel, 42), MARGIN + 3, y + 5.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(71, 85, 105)
    doc.text(`${group.monthLabel} - ${group.items.length} Siaran Pers`, PAGE_WIDTH - MARGIN - 3, y + 5.5, { align: 'right' })
    y += 11

    group.items.forEach((item, index) => {
      ensureSpace(13)
      if (index % 2 === 0) {
        doc.setFillColor(248, 250, 252)
        doc.rect(MARGIN, y - 3.5, CONTENT_WIDTH, 10, 'F')
      }
      doc.setTextColor(51, 65, 85)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7)
      doc.text(String(index + 1), MARGIN + 2, y + 2)
      doc.text(truncate(item.tanggalRaw || '-', 16), MARGIN + 10, y + 2)
      doc.text(truncate(item.tipe || '-', 18), MARGIN + 39, y + 2)
      doc.text(truncate(item.judul || '-', 70), MARGIN + 72, y + 2)
      doc.text(`${item.links?.filter(Boolean).length || 0}/10`, PAGE_WIDTH - MARGIN - 3, y + 2, { align: 'right' })
      y += 10
    })
    y += 4
  })

  addFooter(doc, pageNumber)
  doc.save(filename)
}

/**
 * Convert data array to an HTML table for callers that still need HTML output.
 */
export function dataToHTMLTable(data, headers) {
  if (!data || data.length === 0) {
    return '<p style="text-align: center; color: #999;">Tidak ada data untuk diexport</p>'
  }

  const headerRow = headers.map((header) => `<th>${header}</th>`).join('')
  const rows = data.map((row) => {
    const cells = Object.values(row).map((cell) => `<td>${cell || '-'}</td>`).join('')
    return `<tr>${cells}</tr>`
  }).join('')

  return `<table><thead><tr>${headerRow}</tr></thead><tbody>${rows}</tbody></table>`
}
