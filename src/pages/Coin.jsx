import { LinearProgress, makeStyles, Typography } from "@material-ui/core";
import ReactHtmlParser from "react-html-parser";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SingleCoin } from "../config/api";
import { CryptoState } from "../CryptoContext";
import { CoinInfo } from "../components";
import { numberWithCommas } from "../components/CoinListTable";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "center",
    },
  },
  sidebar: {
    width: "30%",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 25,
    borderRight: "2px solid grey",
  },
  heading: {
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Montserrat",
  },
  description: {
    width: "100%",
    fontFamily: "Montserrat",
    padding: 25,
    paddingBottom: 15,
    paddingTop: 0,
    textAlign: "justify",
  },
  loading: {
    background: "gold",
    width: "50%",
    margin: "40px auto",
  },
}));

const Coin = () => {
  const { id } = useParams();
  const { currency } = CryptoState();
  const [coin, setCoin] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await axios.get(SingleCoin(id));
    console.log(data);
    setCoin(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  console.log("currency", currency);

  const classes = useStyles();

  return (
    <div className={classes.container}>
      {loading ? (
        <LinearProgress className={classes.loading} />
      ) : (
        <>
          <div className={classes.sidebar}>
            <img
              src={coin?.image?.large}
              alt={coin?.name}
              height="150"
              style={{ marginBottom: 20 }}
            />
            <Typography variant="h3" className={classes.heading}>
              {coin?.name}
            </Typography>
            <Typography variant="subtitle1" className={classes.description}>
              {ReactHtmlParser(coin?.description?.en.split(". ")[0])}.
            </Typography>

            <div className={classes.marketData}>
              <span style={{ display: "flex" }}>
                <Typography variant="h5" className={classes.heading}>
                  Rank:
                </Typography>
                &nbsp; &nbsp;
                <Typography
                  variant="h5"
                  style={{
                    fontFamily: "Montserrat",
                  }}
                >
                  {coin?.market_cap_rank}
                </Typography>
              </span>

              <span style={{ display: "flex" }}>
                <Typography variant="h5" className={classes.heading}>
                  Current Price:
                </Typography>
                &nbsp; &nbsp;
                <Typography
                  variant="h5"
                  style={{
                    fontFamily: "Montserrat",
                  }}
                >
                  {numberWithCommas(
                    coin?.market_data?.current_price[currency.toLowerCase()]
                  )}
                </Typography>
              </span>
              <span style={{ display: "flex" }}>
                <Typography variant="h5" className={classes.heading}>
                  Market Cap:
                </Typography>
                &nbsp; &nbsp;
                <Typography
                  variant="h5"
                  style={{
                    fontFamily: "Montserrat",
                  }}
                >
                  {numberWithCommas(
                    coin?.market_data?.market_cap[currency.toLowerCase()]
                  )}
                  M
                </Typography>
              </span>
            </div>
          </div>

          {/* Chart */}
          <CoinInfo coin={coin} />
        </>
      )}
    </div>
  );
};

export default Coin;
