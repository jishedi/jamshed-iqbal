import Link from 'next/link';
import Button from '../components/Button';
import styles from '../styles/home.module.css';

function TransactionListForm() {
  const transactions = [
    {transactionId: 1001, purchaseDescription: 'CVS Pharmacy', transactionDate: '04/02/2026', transactionAmount: '21.34'},
    {transactionId: 1002, purchaseDescription: 'Market Basket', transactionDate: '04/01/2026', transactionAmount: '161.45'},
    {transactionId: 1003, purchaseDescription: 'Pizza Hut', transactionDate: '03/31/2026', transactionAmount: '35.87'}
  ];

  // The function passed from a parent component or defined here to handle cancellation
  const handleHome = (event) => {
    console.log('Form submission canceled, navigating away or closing modal.');
    event.target = history.back();
  };

  // Handle the form submission
  const handleRefresh = (event) => {
    // Prevent the default form submission behavior (page reload)
    event.preventDefault();
    // You can add code here to send data to a backend server (e.g., using fetch or Axios)
    alert('Transactions have been refreshed successfully.');
  };

  // Render the form
  return (
    <form onSubmit={handleRefresh}>
    <div style={{paddingLeft: '100px'}}>
      <h1>Transactions</h1>
    </div>
    <div style={{paddingLeft: '100px'}}>
        <table border={1}>
          <thead>
            <tr>
              <th style={{padding: '10px'}}>Transaction ID</th>
              <th style={{padding: '10px'}}>Description</th>
              <th style={{padding: '10px'}}>Transaction Date</th>
              <th style={{padding: '10px'}}>Purchase Amount</th>
            </tr>
          </thead>
          <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.transactionId}>
              <td style={{padding: '10px',  textAlign: 'center'}}>{transaction.transactionId}</td>
              <td style={{padding: '10px',  textAlign: 'left'}}><Link href={`/TransactionView?transactionId=${transaction.transactionId}&purchaseDescription=${transaction.purchaseDescription}&transactionDate=${transaction.transactionDate}&transactionAmount=${transaction.transactionAmount}`}>{transaction.purchaseDescription}</Link></td>
              <td style={{padding: '10px',  textAlign: 'center'}}>{transaction.transactionDate}</td>
              <td style={{padding: '10px',  textAlign: 'center'}}>${transaction.transactionAmount}</td>
            </tr>
          ))}
          </tbody>
        </table>
    </div>
    <br></br>
    <div style={{paddingLeft: '100px'}}>
      <Button type="button" style={{backgroundColor: '#c1b6b6'}} onClick={handleHome}>Home</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <Button type="submit">Refresh</Button>
    </div>
    </form>
  );
}

export default TransactionListForm;
