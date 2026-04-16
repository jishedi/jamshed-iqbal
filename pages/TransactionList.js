import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '../components/Button';
import styles from '../styles/home.module.css';

function addDaysToDate(currentDate, daysToAdd) {
    daysToAdd = daysToAdd || 0

    // Instantiate a new object based on the current Date
    const futureDate = new Date(currentDate)

    // Adding the number of days
    futureDate.setDate(futureDate.getDate() + daysToAdd)

    return futureDate.toISOString().split('T')[0];
}

function TransactionListForm() {
  const [transactions, setTransactions] = useState([]);

//  for (const transaction of transactions) {
//    console.log('Transaction ID: ' + transaction.transactionId);
//    console.log('Purchase Description: ' + transaction.purchaseDescription);
//    console.log('Transaction Date: ' + transaction.transactionDate);
//    console.log('Purchase Amount:' + transaction.purchaseAmount);
//  }

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  useEffect(() => {
    // Define the async function inside useEffect
    const fetchData = async () => {
      const baseUrl = new URL('http://localhost:8080/api/transactions');
      const params = new URLSearchParams();

      params.append('days', '60');

      const queryString = new URLSearchParams(params).toString();

      try {
        const response = await fetch(`${baseUrl}?${queryString}`);
        if (!response.ok) throw new Error('Network response was not ok');

        const jsonData = await response.json();
        console.log(jsonData);
        setTransactions(jsonData);
        for (const transaction of transactions) {
            console.log('Transaction ID: ' + transaction.transactionId);
            console.log('Purchase Description: ' + transaction.purchaseDescription);
            console.log('Transaction Date: ' + transaction.transactionDate);
            console.log('Purchase Amount: ' + transaction.purchaseAmount);
        }
        } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchData();

    // This code runs once on component load
    console.log("Component loaded!");

    // Optional: return a cleanup function (runs on unmount)
    return () => console.log("Cleaning up...");
  }, []); // Empty array ensures it runs only once

  // The function passed from a parent component or defined here to handle cancellation
  const handleHome = (event) => {
    console.log('Form submission canceled, navigating away or closing modal.');
    event.target = history.back();
  };

  // Handle the form submission
  const handleRefresh = (event) => {
    // Prevent the default form submission behavior (page reload)
    event.preventDefault();
    // fetch and refresh the transactions
    console.log('Transactions have been refreshed successfully.');
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
              <td style={{padding: '10px',  textAlign: 'left'}}><Link href={`/TransactionView?transactionId=${transaction.transactionId}&purchaseDescription=${transaction.purchaseDescription}&transactionDate=${transaction.transactionDate}&purchaseAmount=${transaction.purchaseAmount}`}>{transaction.purchaseDescription}</Link></td>
              <td style={{padding: '10px',  textAlign: 'center'}}>{transaction.transactionDate}</td>
              <td style={{padding: '10px',  textAlign: 'center'}}>{currencyFormatter.format(transaction.purchaseAmount)}</td>
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
