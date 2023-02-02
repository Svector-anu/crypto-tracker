import {
  createTheme,
  ThemeProvider,
  CircularProgress,
  makeStyles,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import axios from "axios";
import React, { useState, useEffect, useMemo } from "react";
import { HistoricalChart } from "../config/api";
import { CryptoState } from "../CryptoContext";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { chartDays } from "../config/data";
import { SelectButton } from "./index";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

const useStyles = makeStyles((theme) => ({
  container: {
    width: "75%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    padding: 40,
    [theme.breakpoints.down("md")]: {
      width: "100%",
      marginTop: 0,
      padding: 20,
      paddingTop: 0,
    },
  },
  formControl: {
    margin: 3,
    minWidth: 120,
  },
}));

const CoinInfo = ({ coin }) => {
  const [historycalData, setHistorycalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [parameter, setParameter] = useState("total_volumes");
  const [days, setDays] = useState(1);
  const { currency, setPercent7, setPercent24, setPercent30, setApiData } =
    CryptoState();
  const classes = useStyles();

  const fetchData = async () => {
    setLoading(true);
    const { data } = await axios.get(HistoricalChart(coin.id, currency));
    setApiData(data["total_volumes"]);
    setHistorycalData(data[parameter]);
    setLoading(false);
  };

  const handleParameterChange = (e) => {
    setParameter(e.target.value);
  };

  const lastDay = useMemo(() => {
    const start_date = dayjs().subtract(days, "days");
    const end_date = start_date.add(days, "days");
    // console.log(start_date, end_date);

    const data = historycalData.filter(([date, value]) => {
      const volume_date = dayjs(date);
      return volume_date.isBetween(start_date, end_date);
    });

    // data.forEach(([date]) => console.log(dayjs(date).format()));
    return data;
  }, [historycalData]);

  useEffect(() => {
    fetchData();
  }, [currency, days, parameter]);

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
      <div className={classes.container}>
        {loading ? (
          <CircularProgress
            style={{ color: "gold" }}
            size={250}
            thickness={1}
          />
        ) : (
          <>
            <Line
              data={{
                labels: lastDay.map((coin) => {
                  let date = new Date(coin[0]);
                  let time =
                    date.getHours() > 12
                      ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                      : `${date.getHours()}:${date.getMinutes()} AM`;
                  return days === 1 ? time : date.toLocaleDateString();
                }),

                datasets: [
                  {
                    data: lastDay.map((coin) => coin[1]),
                    label: `Volume ( Past ${days} Days )`,
                    borderColor: "#EEBC1D",
                  },
                ],
              }}
              options={{
                elements: {
                  point: {
                    radius: 1,
                  },
                },
              }}
            />

            <div
              style={{
                display: "flex",
                marginTop: 20,
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="by">By</InputLabel>
                <Select
                  labelId="by"
                  id="by"
                  value={parameter}
                  onChange={handleParameterChange}
                  label="By"
                >
                  <MenuItem value={"prices"}>Price</MenuItem>
                  <MenuItem value={"total_volumes"}>Volume</MenuItem>
                </Select>
              </FormControl>

              {chartDays.map((day) => (
                <SelectButton
                  key={day.value}
                  onClick={() => {
                    setLoading(true);
                    setDays(day.value);
                    setLoading(false);
                  }}
                  selected={day.value === days}
                >
                  {day.label}
                </SelectButton>
              ))}
            </div>
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default CoinInfo;
