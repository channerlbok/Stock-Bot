import { FormEvent, useState, ReactElement } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { getStock, StockPrice } from './api/stock_api';

export default function Stocks(): ReactElement {
  const { userData, setUserData } = useOutletContext();
  const updateUserData = (newUserName) => {
    setUserData({ userName: newUserName, userImage: userData.userImage });
  };
  const [symbol, setSymbol] = useState('');
  const [prices, setPrices] = useState<StockPrice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const stockData = await getStock(symbol);
      setPrices(stockData);
    } catch (err) {
      setError('Failed to fetch stock data');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Enter stock symbol"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Get Stock Data'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {prices.length > 0 && (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={prices}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="trade_date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="close"
              name="Closing Price"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
      <h1>Stock Page for {userData.userName} </h1>
    </>
  );
}
