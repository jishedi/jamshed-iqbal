import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { NumericFormat } from 'react-number-format';
import Button from '../components/Button';

function addDaysToDate(currentDate, daysToAdd) {
    daysToAdd = daysToAdd || 0

    // Instantiate a new object based on the current Date
    const futureDate = new Date(currentDate)

    // Adding the number of days
    futureDate.setDate(futureDate.getDate() + daysToAdd)

    return futureDate.toISOString().split('T')[0];
}

function PurchaseTransactionViewForm() {
  const [transaction, setTransaction] = useState([]);
  const [country, setCountry] = useState([]);
  const [currency, setCurrency] = useState([]);
  const [exchangeRate, setExchangeRate] = useState([]);
  const [exchangeRateDate, setExchangeRateDate] = useState([]);
  const [convertedAmount, setConvertedAmount] = useState([]);
  const [purchaseDescription, setPurchaseDescription] = useState([]);
  const [transactionDate, setTransactionDate] = useState([]);
  const [actualTransactionDate, setActualTransactionDate] = useState([]);
  const [formattedTransactionDate, setFormattedTransactionDate] = useState([]);
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");
  const [purchaseAmount, setPurchaseAmount] = useState([]);
  //setCountry(searchParams.get("country"));
  //setCurrency(searchParams.get("currency"));
  //setExchangeRate(searchParams.get("exchangeRate"));
  //setConvertedAmount(searchParams.get("convertedAmount"));

  const fetchTreasuryFiscalData = async () => {
    const baseUrl = new URL('https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/od/rates_of_exchange');
    const params = new URLSearchParams();
    console.log('Transaction Date for Treasury Fiscal Data Service: ' + `${transactionDate}` + ':');
    const exchangeRateRangeStartDate = addDaysToDate(new Date(`${transactionDate}`), -180);

    console.log('Exchange Rate Range Start Date: ' + exchangeRateRangeStartDate);
    console.log('Exchange Rate Range End Date: ' + transactionDate);
    params.append('fields', 'record_date,country,currency,country_currency_desc,exchange_rate');
    params.append('filter', 'country:eq:Euro Zone,record_date:gte:' + `${exchangeRateRangeStartDate}` +
        ',record_date:lte:' + `${transactionDate}`);
    params.append('sort', '-record_date');

    const queryString = new URLSearchParams(params).toString();

    try {
      console.log('Fetching Treasury Fiscal Data...');
      const response = await fetch(`${baseUrl}?${queryString}`);
      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      console.log(data);
      setCountry(data.data[0].country);
      setCurrency(data.data[0].currency);
      setExchangeRate(data.data[0].exchange_rate);
      const dateFormatter = new Intl.DateTimeFormat('en-US');
      const recordDate = new Date(data.data[0].record_date);
      const intlRecordDate = dateFormatter.format(recordDate);
      console.log('Record Date: ' + data.data[0].record_date);
      console.log('Converted Record Date: ' + recordDate);
      console.log('Intl Record Date: ' + intlRecordDate);
      const formattedRecordDate = recordDate.toLocaleDateString('en-US');
      setExchangeRateDate(formattedRecordDate);
      console.log('Formatted Exchange Rate Date: ' + formattedRecordDate);
      const formattedAmount = new Intl.NumberFormat('en-US').format(purchaseAmount * data.data[0].exchange_rate);
      setConvertedAmount(formattedAmount);
      console.log('Treasury Fiscal Data Fetched Successfully.');
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  useEffect(() => {
    // Define the async function inside useEffect
    const fetchTransactionData = async () => {
      const baseUrl = new URL(`http://localhost:8080/api/transactions/${transactionId}`);
      try {
        console.log('Fetching Transaction Data...');
        const response = await fetch(`${baseUrl}`);
        if (!response.ok) throw new Error('Network response was not ok');

        const jsonData = await response.json();
        console.log(jsonData);
        setTransaction(jsonData);
        console.log('Transaction ID: ' + jsonData.transactionId);
        console.log('Purchase Description: ' + jsonData.purchaseDescription);
        setPurchaseDescription(jsonData.purchaseDescription);
        console.log('Transaction Date: ' + jsonData.transactionDate);
        setTransactionDate(jsonData.transactionDate);
        console.log('Actual Transaction Date: ' + jsonData.transactionDate);
        setActualTransactionDate(new Date(jsonData.transactionDate));
        console.log('Purchase Amount: ' + jsonData.purchaseAmount);
        setPurchaseAmount(jsonData.purchaseAmount);
        console.log('Transaction Data Fetched Successfully.');
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchTransactionData();

    // This code runs once on component load
    console.log("Component loaded!");

    // Optional: return a cleanup function (runs on unmount)
    return () => console.log("Cleaning up...");
  }, []); // Empty array ensures it runs only once

  // Handle the form close
  const handleClose = (event) => {
    event.target = history.back();
  };

  // Handle the form submission
  const handleRefresh = (event) => {
    // Prevent the default form submission behavior (page reload)
    event.preventDefault();
    // fetch treasury fiscal data by country currency
    console.log('Fetching treasury fiscal data...');
    fetchTreasuryFiscalData();
    console.log('Treasury fiscal data fetched successfully.');
  };

  // Render the form
  return (
    <>
    <div style={{paddingLeft: '100px'}}>
      <h1>Purchase Transaction Detail</h1>
      <label>
        <b>Transaction ID:</b> {transaction.transactionId}
      </label>
      <br></br>
      <label>
        <b>Description:</b> {transaction.purchaseDescription}
      </label>
      <br></br>
      <label>
        <b>Transaction Date:</b> {transaction.transactionDate}
      </label>
      <br></br>
      <label>
        <b>Purchase Amount:</b> {currencyFormatter.format(`${transaction.purchaseAmount}`)}
      </label>
      <br></br>
      <label>
        <b>Country:</b> {country}
      </label>
      <br></br>
      <label>
        <b>Exchange Rate:</b> 1.00 U.S. Dollar = {exchangeRate} {currency}
      </label>
      <br></br>
      <label>
        <b>Published Date:</b> {exchangeRateDate}
      </label>
      <br></br>
      <label>
        <b>Converted Amount:</b> {convertedAmount} {currency}
      </label>
    </div>
    <br></br>
    <div style={{paddingLeft: '100px'}}>
      <Button type="button" style={{backgroundColor: '#c1b6b6'}} onClick={handleClose}>Close</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <Button type="button" onClick={handleRefresh}>Refresh</Button>
    </div>
    </>
  );
}

export default PurchaseTransactionViewForm;
