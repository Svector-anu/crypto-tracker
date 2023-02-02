import { LinearProgress, makeStyles, Typography } from "@material-ui/core";
import ReactHtmlParser from "react-html-parser";
import axios from "axios";
import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { SingleCoin } from "../config/api";
import { CryptoState } from "../CryptoContext";
import { CoinInfo } from "../components";
import { numberWithCommas } from "../components/CoinListTable";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

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
    fontSize: "18px",
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
  marketData: {
    alignSelf: "start",
    padding: 25,
    paddingTop: 10,
    width: "100%",
    [theme.breakpoints.down("md")]: {
      display: "flex",
      justifyContent: "space-around",
    },
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      alignItems: "center",
    },
    [theme.breakpoints.down("xs")]: {
      alignItems: "start",
    },
  },
}));

const Coin = () => {
  const { id } = useParams();
  const { currency, symbol, apiData } = CryptoState();
  const [coin, setCoin] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prev24, setPrev24] = useState("");
  const [current24, setCurrent24] = useState("");
  const [prev7, setPrev7] = useState("");
  const [current7, setCurrent7] = useState("");
  const [prev30, setPrev30] = useState("");
  const [current30, setCurrent30] = useState("");

  const fetchData = async () => {
    setLoading(true);
    const { data } = await axios.get(SingleCoin(id));
    setCoin(data);
    setLoading(false);
  };

  const data = useMemo(() => {
    fetchData();
  }, [id]);

  const data24 = useMemo(() => {
    const start_date24 = dayjs().subtract(2, "days");
    const end_date24 = start_date24.add(2, "days");
    const start_date7 = dayjs().subtract(14, "days");
    const end_date7 = start_date7.add(14, "days");
    const start_date30 = dayjs().subtract(60, "days");
    const end_date30 = start_date30.add(60, "days");

    const data24 = apiData.filter(([date, value]) => {
      const volume_date = dayjs(date);
      return volume_date.isBetween(start_date24, end_date24);
    });
    const data7 = apiData.filter(([date, value]) => {
      const volume_date = dayjs(date);
      return volume_date.isBetween(start_date7, end_date7);
    });
    const data30 = apiData.filter(([date, value]) => {
      const volume_date = dayjs(date);
      return volume_date.isBetween(start_date30, end_date30);
    });

    if (data24.length && data24.length !== 0) {
      setPrev24(numberWithCommas(data24[0][1]).toString().split(".")[0]);
      // console.log("last", data24[0][1]);
      setCurrent24(
        numberWithCommas(data24[data24.length - 1][1])
          .toString()
          .split(".")[0]
      );
      console.log(prev24, current24);
    }
    if (data7.length !== 0) {
      setPrev7(numberWithCommas(data7[0][1]).toString().split(".")[0]);
      setCurrent7(
        numberWithCommas(data7[data7.length - 1][1])
          .toString()
          .split(".")[0]
      );
    }
    if (data30.length !== 0) {
      console.log(data30[data30.length - 1][1], data30[0][1]);
      setPrev30(numberWithCommas(data30[0][1]).toString().split(".")[0]);
      setCurrent30(
        numberWithCommas(data30[data30.length - 1][1])
          .toString()
          .split(".")[0]
      );
    }

    // return data24;
  }, [apiData]);

  // console.log(data24[data24.length - 1][1], data24[0][0]);

  const calculateChangePercentage = (current, prev) => {
    // const result = ((current - prev) / prev) * 100;
    const c = parseInt(current.replace(/,/g, ""));
    const p = parseInt(prev.replace(/,/g, ""));
    // console.log([current.replace(/,/g, ""), prev.replace(/,/g, "")]);
    const result = ((c - p) / p) * 100;
    return result;
  };

  // console.log(typeof Number(current24), Number(typeof prev24));

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
                <Typography variant="h6" className={classes.heading}>
                  Rank:
                </Typography>
                &nbsp; &nbsp;
                <Typography
                  variant="h6"
                  style={{
                    fontFamily: "Montserrat",
                    color: "gold",
                  }}
                >
                  {coin?.market_cap_rank}
                </Typography>
              </span>

              <span style={{ display: "flex" }}>
                <Typography variant="h6" className={classes.heading}>
                  Current Price:
                </Typography>
                &nbsp; &nbsp;
                <Typography
                  variant="h6"
                  style={{
                    fontFamily: "Montserrat",
                    color: "gold",
                  }}
                >
                  {symbol}
                  {numberWithCommas(
                    coin?.market_data?.current_price[currency.toLowerCase()]
                  )}
                </Typography>
              </span>
              <span style={{ display: "flex" }}>
                <Typography variant="h6" className={classes.heading}>
                  Market Cap:
                </Typography>
                &nbsp; &nbsp;
                <Typography
                  variant="h6"
                  style={{
                    fontFamily: "Montserrat",
                    color: "gold",
                  }}
                >
                  {symbol}
                  {numberWithCommas(
                    coin?.market_data?.market_cap[currency.toLowerCase()]
                      .toString()
                      .slice(0, -6)
                  )}
                  M
                </Typography>
              </span>
              <span style={{ display: "flex" }}>
                <Typography variant="h6" className={classes.heading}>
                  Previous 24hr Volume:
                </Typography>
                &nbsp; &nbsp;
                <Typography
                  variant="h6"
                  style={{
                    fontFamily: "Montserrat",
                    color: "gold",
                  }}
                >
                  {symbol}
                  {prev24}M
                </Typography>
              </span>
              <span style={{ display: "flex" }}>
                <Typography variant="h6" className={classes.heading}>
                  Previous 7 Day Volume :
                </Typography>
                &nbsp; &nbsp;
                <Typography
                  variant="h6"
                  style={{
                    fontFamily: "Montserrat",
                    color: "gold",
                  }}
                >
                  {symbol}
                  {prev7}
                </Typography>
              </span>
              <span style={{ display: "flex" }}>
                <Typography variant="h6" className={classes.heading}>
                  Previous 30 Day Volume :
                </Typography>
                &nbsp; &nbsp;
                <Typography
                  variant="h6"
                  style={{
                    fontFamily: "Montserrat",
                    color: "gold",
                  }}
                >
                  {symbol}
                  {prev30}
                </Typography>
              </span>

              <span style={{ display: "flex" }}>
                <Typography variant="h6" className={classes.heading}>
                  % 24hr Volume Change :
                </Typography>
                &nbsp; &nbsp;
                <Typography
                  variant="h6"
                  style={{
                    fontFamily: "Montserrat",
                    color: "gold",
                  }}
                >
                  {calculateChangePercentage(current24, prev24).toFixed(2)}%
                </Typography>
              </span>

              <span style={{ display: "flex" }}>
                <Typography variant="h6" className={classes.heading}>
                  % 7 Days Volume Change :
                </Typography>
                &nbsp; &nbsp;
                <Typography
                  variant="h6"
                  style={{
                    fontFamily: "Montserrat",
                    color: "gold",
                  }}
                >
                  {calculateChangePercentage(current7, prev7).toFixed(2)}%
                </Typography>
              </span>

              <span style={{ display: "flex" }}>
                <Typography variant="h6" className={classes.heading}>
                  % 30 Days Volume Change :
                </Typography>
                &nbsp; &nbsp;
                <Typography
                  variant="h6"
                  style={{
                    fontFamily: "Montserrat",
                    color: "gold",
                  }}
                >
                  {calculateChangePercentage(current30, prev30).toFixed(2)}%
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
