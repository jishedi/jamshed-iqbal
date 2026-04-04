import { useSearchParams } from 'next/navigation';
import Button from '../components/Button';

function PurchaseTransactionViewForm() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");
  const purchaseDescription = searchParams.get("purchaseDescription");
  const transactionDate = searchParams.get("transactionDate");
  const transactionAmount = searchParams.get("transactionAmount");

  // Handle the form close
  const handleClose = (event) => {
    event.target = history.back();
  };

  // Render the form
  return (
    <>
    <div style={{paddingLeft: '100px'}}>
      <h1>Purchase Transaction</h1>
      <label>
        <b>Transaction ID:</b> {transactionId}
      </label>
      <br></br><br></br>
      <label>
        <b>Description:</b> {purchaseDescription}
      </label>
      <br></br><br></br>
      <label>
        <b>Transaction Date:</b> {transactionDate}
      </label>
      <br></br><br></br>
      <label>
        <b>Purchase Amount:</b> ${transactionAmount}
      </label>
    </div>
    <br></br>
    <div style={{paddingLeft: '100px'}}>
      <Button type="button" style={{backgroundColor: '#c1b6b6'}} onClick={handleClose}>Close</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </div>
    </>
  );
}

export default PurchaseTransactionViewForm;
