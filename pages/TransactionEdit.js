import { useState } from 'react';
import Button from '../components/Button';
import styles from '../styles/home.module.css';

function PurchaseTransactionEditForm() {
  // Manage the input values in the component's state
  const [purchaseDescription, setPurchaseDescription] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [purchaseAmount, setPurchaseAmount] = useState('');

  // Handle changes to the input fields
  const handlePurchaseDescriptionChange = (event) => {
    setPurchaseDescription(event.target.value);
  };
  const handleTransactionDateChange = (event) => {
    setTransactionDate(event.target.value);
  };
  const handlePurchaseAmountChange = (event) => {
    const rawValue = event.target.value;
    // Regex to allow digits, an optional decimal point, and up to 2 decimal places
    const regex = /^-?[0-9]\d*\.?\d{0,2}$/; 

    if (rawValue === '' || regex.test(rawValue)) {
      setPurchaseAmount(rawValue);
    }
  };

  // Handle the form cancellation
  const handleCancel = (event) => {
    console.log('Form submission canceled, navigating away or closing modal.');
    event.target = history.back();
  };

  // Handle the form submission
  const handleSubmit = (event) => {
    // Prevent the default form submission behavior (page reload)
    event.preventDefault();
    console.log('Submitted name:', name);    // Log the form data or send it to an API
    console.log('Submitted data: ' + purchaseDescription + ' ' + transactionDate + ' ' + purchaseAmount);
    // You can add code here to send data to a backend server (e.g., using fetch or Axios)
    alert(`Purchase transaction data submitted successfully.`);
    event.target = history.back();
  };

  // Render the form
  return (
    <form onSubmit={handleSubmit}>
    <div style={{paddingLeft: '100px'}}>
      <h1>Purchase Transaction</h1>
      <label>
        Description: <input required
          type="text"
          maxLength={50}
          value={purchaseDescription} // The value is controlled by React state
          onChange={handlePurchaseDescriptionChange} // The state is updated on change
        />
      </label>
      <br></br><br></br>
      <label>
        Transaction Date: <input required
          type="date"
          value={transactionDate} // The value is controlled by React state
          onChange={handleTransactionDateChange} // The state is updated on change
        />
      </label>
      <br></br><br></br>
      <label>
        Purchase Amount: $ <input required
          type="text" // Use type="text" to prevent browser 'type="number"' issues
          value={purchaseAmount} // The value is controlled by React state
          onChange={handlePurchaseAmountChange}
          placeholder="Enter a decimal number (max 2 places)"
        />
      </label>
    </div>
    <br></br>
    <div style={{paddingLeft: '100px'}}>
      <Button type="button" style={{backgroundColor: '#c1b6b6'}} onClick={handleCancel}>Cancel</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <Button type="submit">Submit</Button>
    </div>
    </form>
  );
}

export default PurchaseTransactionEditForm;
