import React, { useState, useEffect } from "react";
import axios from "axios";
import { CryptoState } from "../CryptoContext";
import { CoinList } from "../config/api";
import { useNavigate } from "react-router-dom";
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
  makeStyles,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";

const useStyles = makeStyles({
  tableRow: {
    backgroundColor: "#16171a",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#131111",
    },
    fontFamily: "Montserrat",
  },
});

export function numberWithCommas(x) {
  if (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return;
  }
}

const CoinListTable = () => {
  const [coins, setCoins] = useState([]);
  const { currency } = CryptoState();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [numberOfResult, setNumberOfResult] = useState(20);
  const navigate = useNavigate();

  const fetchCoins = async () => {
    setLoading(true);
    const { data } = await axios.get(CoinList(currency));
    setCoins(data);
    // console.log(data);
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

  const classes = useStyles();

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
            <LinearProgress style={{ backgroundColor: "gold" }} />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  {[
                    "Coin",
                    "Symbol",
                    "Price",
                    "24hr % Price change",
                    "Market Cap",
                    "Market Cap change % 24hr",
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

              <TableBody>
                {handleSearch()
                  .slice(
                    (page - 1) * numberOfResult,
                    (page - 1) * numberOfResult + numberOfResult
                  )
                  .map((row) => {
                    const profit = row.price_change_percentage_24h > 0;
                    const marketCapChange =
                      row.market_cap_change_percentage_24h > 0;
                    return (
                      <TableRow
                        key={row.name}
                        onClick={() => navigate(`/coins/${row.id}`)}
                        className={classes.tableRow}
                      >
                        <TableCell>
                          <span
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <img
                              src={row.image}
                              alt={row.name}
                              style={{
                                width: "30px",
                                height: "30px",
                                marginRight: 18,
                              }}
                            />
                            <Typography
                              variant="body1"
                              style={{ fontFamily: "Montserrat" }}
                            >
                              {row.name}
                            </Typography>
                          </span>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body1"
                            style={{
                              textAlign: "right",
                              fontFamily: "Montserrat",
                            }}
                          >
                            {row.symbol}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body1"
                            style={{
                              textAlign: "right",
                              fontFamily: "Montserrat",
                            }}
                          >
                            {currency.toLowerCase() == "usd"
                              ? "$"
                              : currency.toLowerCase() == "eur"
                              ? "€"
                              : ""}
                            {row.current_price}
                          </Typography>
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            color: profit > 0 ? "rgb(14, 203, 129)" : "red",
                            fontWeight: 500,
                            fontFamily: "Montserrat",
                          }}
                        >
                          {profit && "+"}
                          {row.price_change_percentage_24h.toFixed(2)}%
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{ fontFamily: "Montserrat" }}
                        >
                          {numberWithCommas(
                            row.market_cap.toString().slice(0, -6)
                          )}
                          M
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            color:
                              row.market_cap_change_percentage_24h > 0
                                ? "rgb(14, 203, 129)"
                                : "red",
                            fontWeight: 500,
                            fontFamily: "Montserrat",
                          }}
                        >
                          {marketCapChange && "+"}
                          {row.market_cap_change_percentage_24h.toFixed(2)}%
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          )}
        </TableContainer>

        {/* Pagination */}
        <Pagination
          count={(handleSearch()?.length / numberOfResult).toFixed(0)}
          style={{
            padding: 40,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
          onChange={(_, value) => {
            setPage(value);
            window.scroll(0, 0);
          }}
        ></Pagination>
      </Container>
    </ThemeProvider>
  );
};

export default CoinListTable;
