/**
 * Export dashboard/report data as PDF
 * Uses browser's built-in print-to-PDF functionality
 */
export function exportToPDF(title = 'MonEv Report', htmlContent = null, options = {}) {
  if (htmlContent) {
    const printWindow = window.open('', '', 'width=800,height=600')
    const timestamp = new Date().toLocaleString('id-ID')
    const logoSrc = options.logoSrc || ''
    const subtitle = options.subtitle || 'PLN UID Riau & Kepri - Monitoring Evidence Report'
    const scopeLabel = options.scopeLabel || 'Data aktif'

    const content = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #334155; background: #fff; }
          .container { max-width: 1000px; margin: 0 auto; padding: 28px 24px 22px; }
          .header { display: flex; align-items: center; justify-content: space-between; gap: 24px; margin-bottom: 24px; padding-bottom: 18px; border-bottom: 2px solid #dbeafe; }
          .brand { display: flex; align-items: center; gap: 14px; }
          .brand img { width: 58px; height: 58px; object-fit: contain; }
          .header h1 { color: #1d4ed8; font-size: 26px; margin-bottom: 4px; line-height: 1.1; }
          .header p { color: #64748b; font-size: 12px; }
          .meta { text-align: right; }
          .meta .scope { display: inline-block; margin-bottom: 8px; padding: 4px 10px; border-radius: 999px; background: #eff6ff; color: #1d4ed8; font-size: 11px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; }
          .meta .timestamp { font-size: 11px; color: #94a3b8; margin-top: 2px; }
          .content { margin-top: 20px; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0 20px; }
          thead { background: #eff6ff; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
          th { font-weight: 700; color: #1d4ed8; }
          tr:nth-child(even) { background: #f8fafc; }
          .footer { text-align: center; margin-top: 28px; padding-top: 14px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #94a3b8; }
          @media print {
            body { margin: 0; }
            .container { padding: 0; }
            .header { break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="brand">
              ${logoSrc ? `<img src="${logoSrc}" alt="PLN UID Riau & Kepri" />` : ''}
              <div>
                <h1>${title}</h1>
                <p>${subtitle}</p>
              </div>
            </div>
            <div class="meta">
              <div class="scope">${scopeLabel}</div>
              <div class="timestamp">Generated: ${timestamp}</div>
            </div>
          </div>
          <div class="content">
            ${htmlContent}
          </div>
          <div class="footer">
            <p>MonEv PLN v1.0 | Confidential - For Internal Use Only</p>
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(() => window.close(), 1000);
          }
        </script>
      </body>
      </html>
    `

    printWindow.document.write(content)
    printWindow.document.close()
  } else {
    // Fallback: open print dialog for current page
    window.print()
  }
}

/**
 * Convert data array to HTML table
 */
export function dataToHTMLTable(data, headers) {
  if (!data || data.length === 0) {
    return '<p style="text-align: center; color: #999;">Tidak ada data untuk diexport</p>'
  }

  const headerRow = headers.map(h => `<th>${h}</th>`).join('')
  const rows = data.map(row => {
    const cells = Object.values(row).map(cell => `<td>${cell || '-'}</td>`).join('')
    return `<tr>${cells}</tr>`
  }).join('')

  return `
    <table>
      <thead>
        <tr>${headerRow}</tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `
}
