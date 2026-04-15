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
  const [country, setCountry] = useState([]);
  const [currency, setCurrency] = useState([]);
  const [exchangeRate, setExchangeRate] = useState([]);
  const [exchangeRateDate, setExchangeRateDate] = useState([]);
  const [convertedAmount, setConvertedAmount] = useState([]);
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");
  const purchaseDescription = searchParams.get("purchaseDescription");
  const transactionDate = searchParams.get("transactionDate");
  const actualTransactionDate = new Date(transactionDate);
  const formattedTransactionDate = actualTransactionDate.toLocaleDateString('en-US');
  const purchaseAmount = searchParams.get("purchaseAmount");
  //setCountry(searchParams.get("country"));
  //setCurrency(searchParams.get("currency"));
  //setExchangeRate(searchParams.get("exchangeRate"));
  //setConvertedAmount(searchParams.get("convertedAmount"));

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  useEffect(() => {
    // Define the async function inside useEffect
    const fetchData = async () => {
      const baseUrl = new URL('https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/od/rates_of_exchange');
      const params = new URLSearchParams();
      const exchangeRateRangeDate = addDaysToDate(new Date(`${transactionDate}`), -180);

      params.append('fields', 'record_date,country,currency,country_currency_desc,exchange_rate');
      params.append('filter', 'country:eq:Euro Zone,record_date:gte:' + `${exchangeRateRangeDate}`);
      params.append('sort', '-record_date');

      const queryString = new URLSearchParams(params).toString();

      try {
        const response = await fetch(`${baseUrl}?${queryString}`);
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        console.log(data);
        alert('Country: ' + data.data[0].country + '\nCurrency: ' + data.data[0].currency +
            '\nExchange Rate: ' + data.data[0].exchange_rate + '\nExchange Rate Range Date: ' +
            exchangeRateRangeDate + '\nPurchase Amount: ' + currencyFormatter.format(purchaseAmount));
        setCountry(data.data[0].country);
        setCurrency(data.data[0].currency);
        setExchangeRate(data.data[0].exchange_rate);
        const recordDate = new Date(data.data[0].record_date);
        const formattedRecordDate = recordDate.toLocaleDateString('en-US');
        setExchangeRateDate(formattedRecordDate);
        const formattedAmount = new Intl.NumberFormat('en-US').format(purchaseAmount * data.data[0].exchange_rate);
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

  // Handle the form close
  const handleClose = (event) => {
    event.target = history.back();
  };

  // Render the form
  return (
    <>
    <div style={{paddingLeft: '100px'}}>
      <h1>Purchase Transaction Detail</h1>
      <label>
        <b>Transaction ID:</b> {transactionId}
      </label>
      <br></br>
      <label>
        <b>Description:</b> {purchaseDescription}
      </label>
      <br></br>
      <label>
        <b>Transaction Date:</b> {formattedTransactionDate}
      </label>
      <br></br>
      <label>
        <b>Purchase Amount:</b> {currencyFormatter.format(`${purchaseAmount}`)}
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
    </div>
    </>
  );
}

export default PurchaseTransactionViewForm;
