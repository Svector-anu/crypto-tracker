import React, { useState, useEffect } from "react";
import axios from "axios";
import { CryptoState } from "../CryptoContext";
import { CoinList } from "../config/api";
import {
  Container,
  createTheme,
  LinearProgress,
  TableCell,
  Table,
  TableContainer,
  TableHead,
  TextField,
  ThemeProvider,
  Typography,
  TableRow,
  TableBody,
} from "@material-ui/core";

const CoinListTable = () => {
  const [coins, setCoins] = useState([]);
  const { currency } = CryptoState();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchCoins = async () => {
    setLoading(true);
    const { data } = await axios.get(CoinList(currency));
    // setCoins(data);
    console.log(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCoins();
  }, [currency]);

  const handleSearch = () => {
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search) ||
        coin.symbol.toLowerCase().includes(search)
    );
  };

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Container style={{ textAlign: "center" }}>
        <Typography
          variant="h4"
          style={{ margin: 18, fontFamily: "Montserrat" }}
        >
          Crypto Currency Prices by market cap
        </Typography>
        <TextField
          label="Seach for crypto currency..."
          variant="outlined"
          fullWidth
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Table */}

        <TableContainer style={{ marginTop: 18 }}>
          {loading ? (
            <LinearProgress style={{ backgroundColor: "black" }} />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  {[
                    "Coin",
                    "Symbol",
                    "Price",
                    "24hr Vol",
                    "7Day Vol",
                    "Monthly Vol",
                  ].map((item) => (
                    <TableCell
                      style={{
                        color: "gold",
                        fontWeight: "700",
                        fontFamily: "Montserrat",
                      }}
                      key={item}
                      align={item == "Coin" ? "left" : "right"}
                    >
                      {item}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              {/* {handleSearch().map(row=>(
                const profit = row.price_change_percentage_24h
              ))} */}
              <TableBody></TableBody>
            </Table>
          )}
        </TableContainer>
      </Container>
    </ThemeProvider>
  );
};

export default CoinListTable;
