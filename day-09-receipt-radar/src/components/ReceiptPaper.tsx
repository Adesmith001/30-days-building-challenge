export function ReceiptPaper({ image }: { image?: string }) {
  return (
    <div className="paper-wrap">
      {image ? (
        <img src={image} className="uploaded-receipt" />
      ) : (
        <div className="paper">
          <b>SHOPRITE</b>
          <small>VICTORIA ISLAND EXTENSION #4</small>
          <small>09 SEP 2026 Â· 14:22</small>
          <hr />
          <p>BREAD ARTISAN LOAF <span>1,800</span></p>
          <p>FRESH WHOLE MILK 2L <span>2,450</span></p>
          <p>TRAY FRESH EGGS 30PK <span>7,900</span></p>
          <p>PURE VEGETABLE OIL 3L <span>5,200</span></p>
          <hr />
          <p>SUBTOTAL <span>17,350</span></p>
          <p className="warn-row">VAT <span>1,301</span></p>
          <strong>TOTAL <span>19,151</span></strong>
          <hr />
          <small>THANK YOU FOR YOUR PATRONAGE</small>
        </div>
      )}
    </div>
  )
}

