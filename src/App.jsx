import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState(null);
  useEffect(() => {
    axios
      .get(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false",
        { crossDomain: true }
      )
      .then((res) => console.log(res));
  });
  return <div className="App">{data && data.map((d) => <pre>{d}</pre>)}</div>;
}

export default App;
