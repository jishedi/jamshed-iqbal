import Link from 'next/link';
import styles from '../styles/home.module.css'

function Home() {
  return (
    <div style={{paddingLeft: '100px'}}>
    <main className={styles.Home}>
      <h1>WEX Corporate Payments</h1>
      <Link href="/TransactionEdit">Purchase Transaction</Link> - store a new purchase transaction<br></br>
      <Link href="/TransactionList">Retrieve Transactions</Link> - retrieve purchase transactions
    </main>
    </div>
  )
}

export default Home
