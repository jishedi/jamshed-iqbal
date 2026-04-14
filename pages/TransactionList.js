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
  const transactions = [
    {transactionId: 1001, purchaseDescription: 'CVS Pharmacy', transactionDate: '2026-04-02', transactionAmount: '2172.34'},
    {transactionId: 1002, purchaseDescription: 'Market Basket', transactionDate: '2026-04-01', transactionAmount: '161.45'},
    {transactionId: 1003, purchaseDescription: 'Pizza Hut', transactionDate: '2026-03-31', transactionAmount: '35623.87'}
  ];

  //const transactions = JSON.parse(transactionRecords);

  for (const transaction of transactions) {
    console.log('Transaction ID' + transaction.transactionId);
    console.log('Purchase Description' + transaction.purchaseDescription);
    console.log('Transaction Date' + transaction.transactionDate);
    console.log('Transaction Amount' + transaction.transactionAmount);
  }

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  useEffect(() => {
    // Define the async function inside useEffect
    const fetchData = async () => {
      const baseUrl = new URL('http://localhost:3000/api/transaction-management/transactions');
      const params = new URLSearchParams();
      const transactionRangeDate = addDaysToDate(new Date(), -30);

      params.append('fields', 'record_date,country,currency,country_currency_desc,exchange_rate');
      params.append('filter', 'country:eq:Euro Zone,record_date:gte:' + `${transactionRangeDate}`);
      params.append('sort', '-record_date');

      const queryString = new URLSearchParams(params).toString();

      try {
        const response = await fetch(`${baseUrl}?${queryString}`);
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        console.log(data);
        setTransactionId(data.data[0].transactionId);
        setPurchaseDescription(data.data[0].purchaseDescription);
        setTransactionDate(data.data[0].transactionDate);
        setTransactionAmount(data.data[0].transactionAmount);
        const formattedAmount = new Intl.NumberFormat('en-US').format(transactionAmount * data.data[0].exchange_rate);
        setConvertedAmount(formattedAmount);
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
              <td style={{padding: '10px',  textAlign: 'center'}}>{currencyFormatter.format(transaction.transactionAmount)}</td>
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
