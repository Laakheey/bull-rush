// import { useEffect, useState } from "react";
// import {
//   DefaultComparisonChart,
//   StockCard,
//   StockChart,
// } from "./StockDataFetch";
// import type { StockDataPoint, StockQuote } from "../interfaces/types";
import HeroSection from "./Hero";
import InvestmentPlans from "./InvestmentPlans";
import AboutUs from "./AboutUs";


const Home: React.FC = () => {
  // const [singleStockHistory, setSingleStockHistory] = useState<any[]>([]);
  // const [selectedSymbol, setSelectedSymbol] = useState<string>("");
  // const [comparisonHistory, setComparisonHistory] = useState<StockDataPoint[]>(
  //   []
  // );
  // const [stocks, setStocks] = useState<StockQuote[]>([]);

  // const TICKERS = ["AAPL", "MSFT", "GOOGL", "NVDA"];
  // const CRYPTO_TICKERS = [
  //   { sym: "BTC", color: "#f59e0b" },
  //   { sym: "ETH", color: "#6366f1" },
  //   { sym: "SOL", color: "#10b981" },
  // ];

  // const fetchQuotes = async () => {
  //   const quotes = await Promise.all(
  //     TICKERS.map(async (symbol) => {
  //       const res = await fetch(
  //         `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${
  //           import.meta.env.VITE_FINNHUB_API_KEY
  //         }`
  //       );
  //       const data = await res.json();
  //       return {
  //         symbol,
  //         price: data.c,
  //         change: data.d,
  //         changePercent: data.dp,
  //         loading: false,
  //       };
  //     })
  //   );
  //   setStocks(quotes);
  // };

  // const fetchComparisonHistory = async () => {
  //   const allData: Record<string, Record<string, number>> = {};

  //   await Promise.all(
  //     CRYPTO_TICKERS.map(async (item) => {
  //       const res = await fetch(
  //         `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${
  //           item.sym
  //         }&apikey=${
  //           import.meta.env.VITE_ALPHA_VINTAGE_TIME_SERIES_DAILY_API_KEY
  //         }`
  //       );
  //       const data = await res.json();
  //       const timeSeries = data["Time Series (Daily)"];
  //       if (timeSeries) {
  //         Object.entries(timeSeries)
  //           .slice(0, 20)
  //           .forEach(([date, val]: any) => {
  //             if (!allData[date]) allData[date] = {};
  //             allData[date][item.sym] = parseFloat(val["4. close"]);
  //           });
  //       }
  //     })
  //   );

  //   const formatted = Object.entries(allData)
  //     .map(([date, prices]) => ({
  //       date,
  //       ...prices,
  //     }))
  //     .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  //   setComparisonHistory(formatted);
  // };

  // const fetchSingleHistory = async (symbol: string) => {
  //   setSelectedSymbol(symbol);
  //   const res = await fetch(
  //     `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${
  //       import.meta.env.VITE_ALPHA_VINTAGE_TIME_SERIES_DAILY_API_KEY
  //     }`
  //   );
  //   const data = await res.json();
  //   const timeSeries = data["Time Series (Daily)"];
  //   if (timeSeries) {
  //     const formatted = Object.entries(timeSeries)
  //       .slice(0, 30)
  //       .map(([date, val]: any) => ({
  //         date,
  //         close: parseFloat(val["4. close"]),
  //       }))
  //       .reverse();
  //     setSingleStockHistory(formatted);
  //   }
  // };

  // useEffect(() => {
  //   fetchQuotes();
  //   fetchComparisonHistory();
  // }, []);

  return (
    <>
      <HeroSection />
      <InvestmentPlans />
      <AboutUs />
      {/* <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stocks.map((s) => (
            <StockCard
              key={s.symbol}
              stock={s}
              isSelected={selectedSymbol === s.symbol}
              onClick={() => fetchSingleHistory(s.symbol)}
            />
          ))}
        </div>

        <div className="min-h-112.5">
          {selectedSymbol && singleStockHistory.length > 0 ? (
            <StockChart
              symbol={selectedSymbol}
              data={singleStockHistory}
              onClose={() => {
                setSelectedSymbol("");
                setSingleStockHistory([]);
              }}
            />
          ) : (
            <DefaultComparisonChart
              data={comparisonHistory}
              tickers={CRYPTO_TICKERS}
            />
          )}
        </div>
      </div> */}
    </>
  );
};

export default Home;
