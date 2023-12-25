import { Typography, Table, Button, notification } from "antd";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuthenticator } from "@aws-amplify/ui-react";
const { Title } = Typography;
import { getApiUrl, Toggle, getEnvironment } from "@/utils";
import { Pie } from '@ant-design/charts';
import layoutStyles from "@/layouts/index.module.less";
import subStyles from "@/pages/subscription/index.module.less";

const TradePage = () => {

  const { user: loggedIn } = useAuthenticator((context) => [context.user]);
  const [portfolio, setPortfolio] = useState([[], []]);
  const [loading, setLoading] = useState(true);
  const [tradeLoading, setTradeLoading] = useState();
  const [toggle, setToggle] = useState(false);
  const [variant, setVariant] = useState(0);
  const [toggle2, setToggle2] = useState(true);
  const toggleLabels = { OPTIONS: "OPT", STOCKS: "STX" };
  const isLocal = getEnvironment() === "local";
  const mockData = [
    {
      "price": "189.900000",
      "quantity": "100.12666900",
      "average_buy_price": "179.8660",
      "equity": "19014.05",
      "percent_change": "5.58",
      "intraday_percent_change": "0.00",
      "equity_change": "1004.670997",
      "type": "stock",
      "name": "Apple",
      "id": "450dfc6d-5510-4d40-abfb-f633b7d9be3e",
      "pe_ratio": "31.188500",
      "percentage": "4.77",
      "symbol": "AAPL",
      "open_contracts": -1,
      "option_type": "C",
      "expiration": "2023-12-29",
      "strike": 200.0,
      "chance": 0.872788,
      "key": 0
    },
    {
      "price": "128.950000",
      "quantity": "5.00000000",
      "average_buy_price": "127.5180",
      "equity": "644.75",
      "percent_change": "1.12",
      "intraday_percent_change": "0.00",
      "equity_change": "7.160000",
      "type": "stock",
      "name": "Airbnb",
      "id": "f1c1cfe5-c598-4499-9182-818eee5a9c1b",
      "pe_ratio": "15.630600",
      "percentage": "0.16",
      "symbol": "ABNB",
      "open_contracts": 0,
      "key": 1
    },
    {
      "price": "619.430000",
      "quantity": "12.00000000",
      "average_buy_price": "600.7600",
      "equity": "7433.16",
      "percent_change": "3.11",
      "intraday_percent_change": "0.00",
      "equity_change": "224.040000",
      "type": "stock",
      "name": "Adobe",
      "id": "809adc21-ef75-4c3d-9c0e-5f9a167f235b",
      "pe_ratio": "55.767800",
      "percentage": "1.86",
      "symbol": "ADBE",
      "open_contracts": 0,
      "key": 2
    },
    {
      "price": "122.170000",
      "quantity": "100.00000000",
      "average_buy_price": "109.9602",
      "equity": "12217.00",
      "percent_change": "11.10",
      "intraday_percent_change": "0.00",
      "equity_change": "1220.980000",
      "type": "stock",
      "name": "AMD",
      "id": "940fc3f5-1db5-4fed-b452-f3a2e4562b5f",
      "pe_ratio": "966.167000",
      "percentage": "3.06",
      "symbol": "AMD",
      "open_contracts": -1,
      "option_type": "C",
      "expiration": "2023-12-15",
      "strike": 130.0,
      "chance": 0.796533,
      "key": 3
    },
    {
      "price": "146.696900",
      "quantity": "100.00000000",
      "average_buy_price": "120.0000",
      "equity": "14669.69",
      "percent_change": "22.25",
      "intraday_percent_change": "0.00",
      "equity_change": "2669.690000",
      "type": "stock",
      "name": "Amazon",
      "id": "c0bb3aec-bd1e-471e-a4f0-ca011cbec711",
      "pe_ratio": "76.603000",
      "percentage": "3.68",
      "symbol": "AMZN",
      "open_contracts": -1,
      "option_type": "C",
      "expiration": "2025-01-17",
      "strike": 150.0,
      "chance": 0.681119,
      "key": 4
    },
    {
      "price": "63.620000",
      "quantity": "100.00000000",
      "average_buy_price": "58.1847",
      "equity": "6362.00",
      "percent_change": "9.34",
      "intraday_percent_change": "0.00",
      "equity_change": "543.530000",
      "type": "adr",
      "name": "Arm Holdings plc",
      "id": "185d1287-967e-481a-92b9-cd801572b58e",
      "pe_ratio": "120.932000",
      "percentage": "1.59",
      "symbol": "ARM",
      "open_contracts": -1,
      "option_type": "C",
      "expiration": "2025-01-17",
      "strike": 80.0,
      "chance": 0.786055,
      "key": 5
    },
    {
      "price": "730.100000",
      "quantity": "4.75000000",
      "average_buy_price": "693.7074",
      "equity": "3467.97",
      "percent_change": "5.25",
      "intraday_percent_change": "0.38",
      "equity_change": "172.864850",
      "type": "stock",
      "name": "BlackRock",
      "id": "c5435e0e-02b0-434f-9717-b13b68ae82d1",
      "pe_ratio": "20.393400",
      "percentage": "0.87",
      "symbol": "BLK",
      "open_contracts": 0,
      "key": 6
    },
    {
      "price": "25.500000",
      "quantity": "100.00000000",
      "average_buy_price": "35.0000",
      "equity": "2550.00",
      "percent_change": "-27.14",
      "intraday_percent_change": "0.00",
      "equity_change": "-950.000000",
      "type": "stock",
      "name": "Instacart (Maplebear Inc.)",
      "id": "c3428303-869b-4a54-a5c2-704015441d17",
      "pe_ratio": "-3.870000",
      "percentage": "0.64",
      "symbol": "CART",
      "open_contracts": 0,
      "key": 7
    },
    {
      "price": "34.290000",
      "quantity": "100.00000000",
      "average_buy_price": "32.9300",
      "equity": "3429.00",
      "percent_change": "4.13",
      "intraday_percent_change": "0.00",
      "equity_change": "136.000000",
      "type": "stock",
      "name": "CAVA",
      "id": "14e9a799-c117-4373-8895-0341bf9165f2",
      "pe_ratio": "-484.720000",
      "percentage": "0.86",
      "symbol": "CAVA",
      "open_contracts": -1,
      "option_type": "C",
      "expiration": "2024-12-20",
      "strike": 55.0,
      "chance": 0.87459,
      "key": 8
    },
    {
      "price": "2220.000000",
      "quantity": "3.62500000",
      "average_buy_price": "2132.3144",
      "equity": "8047.50",
      "percent_change": "4.11",
      "intraday_percent_change": "0.08",
      "equity_change": "317.860300",
      "type": "stock",
      "name": "Chipotle",
      "id": "da53f1f6-29b2-4d20-bb4e-05da9d508259",
      "pe_ratio": "52.646400",
      "percentage": "2.02",
      "symbol": "CMG",
      "open_contracts": 0,
      "key": 9
    },
    {
      "price": "115.750000",
      "quantity": "100.00000000",
      "average_buy_price": "59.5300",
      "equity": "11575.00",
      "percent_change": "94.44",
      "intraday_percent_change": "0.00",
      "equity_change": "5622.000000",
      "type": "stock",
      "name": "Coinbase",
      "id": "aedbcff3-1e3c-469b-9594-44cffed43404",
      "pe_ratio": "-35.810000",
      "percentage": "2.90",
      "symbol": "COIN",
      "open_contracts": -1,
      "option_type": "C",
      "expiration": "2024-01-19",
      "strike": 110.0,
      "chance": 0.657615,
      "key": 10
    },
    {
      "price": "591.038900",
      "quantity": "2.00176200",
      "average_buy_price": "580.9182",
      "equity": "1183.12",
      "percent_change": "1.74",
      "intraday_percent_change": "0.00",
      "equity_change": "20.259233",
      "type": "stock",
      "name": "Costco",
      "id": "ec89803c-c5e5-4df1-889c-da4f8cb6f8cd",
      "pe_ratio": "41.611100",
      "percentage": "0.30",
      "symbol": "COST",
      "open_contracts": 0,
      "key": 11
    },
    {
      "price": "70.200100",
      "quantity": "100.00000000",
      "average_buy_price": "53.3500",
      "equity": "7020.01",
      "percent_change": "31.58",
      "intraday_percent_change": "0.00",
      "equity_change": "1685.010000",
      "type": "stock",
      "name": "CRISPR",
      "id": "d5b60f04-4b46-465c-b954-e9ecc9afa51a",
      "pe_ratio": "-15.610000",
      "percentage": "1.76",
      "symbol": "CRSP",
      "open_contracts": -1,
      "option_type": "C",
      "expiration": "2025-01-17",
      "strike": 90.0,
      "chance": 0.798737,
      "key": 12
    },
    {
      "price": "144.850000",
      "quantity": "2.00000000",
      "average_buy_price": "156.6700",
      "equity": "289.70",
      "percent_change": "-7.54",
      "intraday_percent_change": "0.00",
      "equity_change": "-23.640000",
      "type": "stock",
      "name": "Chevron",
      "id": "7a6a30e2-cf4d-40dd-8baa-0cea48de85e4",
      "pe_ratio": "10.731700",
      "percentage": "0.07",
      "symbol": "CVX",
      "open_contracts": 0,
      "key": 13
    },
    {
      "price": "10.390000",
      "quantity": "102.46008800",
      "average_buy_price": "14.6514",
      "equity": "1064.56",
      "percent_change": "-29.09",
      "intraday_percent_change": "0.00",
      "equity_change": "-436.623419",
      "type": "stock",
      "name": "Ford Motor",
      "id": "6df56bd0-0bf2-44ab-8875-f94fd8526942",
      "pe_ratio": "6.727870",
      "percentage": "0.27",
      "symbol": "F",
      "open_contracts": -1,
      "option_type": "C",
      "expiration": "2023-12-15",
      "strike": 11.0,
      "chance": 0.811753,
      "key": 14
    },
    {
      "price": "136.600000",
      "quantity": "100.00000000",
      "average_buy_price": "99.8430",
      "equity": "13660.00",
      "percent_change": "36.81",
      "intraday_percent_change": "0.00",
      "equity_change": "3675.700000",
      "type": "stock",
      "name": "Alphabet Class A",
      "id": "54db869e-f7d5-45fb-88f1-8d7072d4c8b2",
      "pe_ratio": "26.551500",
      "percentage": "3.42",
      "symbol": "GOOGL",
      "open_contracts": -1,
      "option_type": "C",
      "expiration": "2025-06-20",
      "strike": 175.0,
      "chance": 0.797338,
      "key": 15
    },
    {
      "price": "43.900000",
      "quantity": "100.00000000",
      "average_buy_price": "32.9862",
      "equity": "4390.00",
      "percent_change": "33.09",
      "intraday_percent_change": "0.00",
      "equity_change": "1091.380000",
      "type": "stock",
      "name": "Intel",
      "id": "ad059c69-0c1c-4c6b-8322-f53f1bbd69d4",
      "pe_ratio": "-109.520000",
      "percentage": "1.10",
      "symbol": "INTC",
      "open_contracts": -1,
      "option_type": "C",
      "expiration": "2024-06-21",
      "strike": 50.0,
      "chance": 0.766819,
      "key": 16
    },
    {
      "price": "153.450000",
      "quantity": "103.66020200",
      "average_buy_price": "166.0581",
      "equity": "15906.66",
      "percent_change": "-7.59",
      "intraday_percent_change": "0.00",
      "equity_change": "-1306.958193",
      "type": "stock",
      "name": "JPMorgan Chase",
      "id": "43c1172a-9130-420a-ac9b-b01a6ff5dd54",
      "pe_ratio": "9.152940",
      "percentage": "3.99",
      "symbol": "JPM",
      "open_contracts": -1,
      "option_type": "C",
      "expiration": "2024-01-19",
      "strike": 170.0,
      "chance": 0.941034,
      "key": 17
    },
    {
      "price": "282.430000",
      "quantity": "100.00000000",
      "average_buy_price": "260.7454",
      "equity": "28243.00",
      "percent_change": "8.32",
      "intraday_percent_change": "0.00",
      "equity_change": "2168.460000",
      "type": "stock",
      "name": "McDonald's",
      "id": "41eac3c6-f7f7-4c4a-b696-ab9d1b913981",
      "pe_ratio": "24.839200",
      "percentage": "7.08",
      "symbol": "MCD",
      "open_contracts": -1,
      "option_type": "C",
      "expiration": "2024-01-19",
      "strike": 290.0,
      "chance": 0.749302,
      "key": 18
    },
    {
      "price": "337.717600",
      "quantity": "100.00000000",
      "average_buy_price": "319.3278",
      "equity": "33771.76",
      "percent_change": "5.76",
      "intraday_percent_change": "0.00",
      "equity_change": "1838.980000",
      "type": "stock",
      "name": "Meta Platforms",
      "id": "ebab2398-028d-4939-9f1d-13bf38f81c50",
      "pe_ratio": "30.143800",
      "percentage": "8.46",
      "symbol": "META",
      "open_contracts": -1,
      "option_type": "C",
      "expiration": "2024-06-21",
      "strike": 190.0,
      "chance": 0.565624,
      "key": 19
    },
    {
      "price": "78.600000",
      "quantity": "20.05349900",
      "average_buy_price": "77.9340",
      "equity": "1576.21",
      "percent_change": "0.85",
      "intraday_percent_change": "0.00",
      "equity_change": "13.355630",
      "type": "stock",
      "name": "Morgan Stanley",
      "id": "75f435f0-0d44-44a4-bd14-ac2eba5badea",
      "pe_ratio": "14.062000",
      "percentage": "0.40",
      "symbol": "MS",
      "open_contracts": 0,
      "key": 20
    },
    {
      "price": "377.410000",
      "quantity": "101.20073300",
      "average_buy_price": "327.4240",
      "equity": "38194.17",
      "percent_change": "15.27",
      "intraday_percent_change": "0.00",
      "equity_change": "5058.619840",
      "type": "stock",
      "name": "Microsoft",
      "id": "50810c35-d215-4866-9758-0ada4ac79ffa",
      "pe_ratio": "36.591700",
      "percentage": "9.57",
      "symbol": "MSFT",
      "open_contracts": -1,
      "option_type": "C",
      "expiration": "2024-06-21",
      "strike": 360.0,
      "chance": 0.612212,
      "key": 21
    },
    {
      "price": "32.030000",
      "quantity": "100.00000000",
      "average_buy_price": "151.0033",
      "equity": "3203.00",
      "percent_change": "-78.79",
      "intraday_percent_change": "0.00",
      "equity_change": "-11897.330000",
      "type": "stock",
      "name": "Match",
      "id": "8886c92c-7bbe-4014-994a-6509bb3b0009",
      "pe_ratio": "18.242300",
      "percentage": "0.80",
      "symbol": "MTCH",
      "open_contracts": -1,
      "option_type": "C",
      "expiration": "2025-01-17",
      "strike": 60.0,
      "chance": 0.935752,
      "key": 22
    },
    {
      "price": "73.050000",
      "quantity": "5.00000000",
      "average_buy_price": "72.6180",
      "equity": "365.25",
      "percent_change": "0.59",
      "intraday_percent_change": "0.00",
      "equity_change": "2.160000",
      "type": "stock",
      "name": "Cloudflare",
      "id": "9722f34e-b765-410d-9d42-06d30b3ebe70",
      "pe_ratio": "-120.390000",
      "percentage": "0.09",
      "symbol": "NET",
      "open_contracts": 0,
      "key": 23
    },
    {
      "price": "478.990000",
      "quantity": "100.00000000",
      "average_buy_price": "691.0000",
      "equity": "47899.00",
      "percent_change": "-30.68",
      "intraday_percent_change": "0.00",
      "equity_change": "-21201.000000",
      "type": "stock",
      "name": "Netflix",
      "id": "81733743-965a-4d93-b87a-6973cb9efd34",
      "pe_ratio": "47.661800",
      "percentage": "12.01",
      "symbol": "NFLX",
      "open_contracts": -1,
      "option_type": "C",
      "expiration": "2024-06-21",
      "strike": 640.0,
      "chance": 0.891728,
      "key": 24
    },
    {
      "price": "477.780000",
      "quantity": "100.12069200",
      "average_buy_price": "222.4398",
      "equity": "47835.66",
      "percent_change": "114.79",
      "intraday_percent_change": "0.00",
      "equity_change": "25564.837519",
      "type": "stock",
      "name": "NVIDIA",
      "id": "a4ecd608-e7b4-4ff3-afa5-f77ae7632dfb",
      "pe_ratio": "64.323400",
      "percentage": "11.99",
      "symbol": "NVDA",
      "open_contracts": -1,
      "option_type": "C",
      "expiration": "2025-12-19",
      "strike": 450.0,
      "chance": 0.695846,
      "key": 25
    },
    {
      "price": "53.800000",
      "quantity": "100.07257600",
      "average_buy_price": "51.4140",
      "equity": "5383.90",
      "percent_change": "4.64",
      "intraday_percent_change": "0.00",
      "equity_change": "238.773166",
      "type": "reit",
      "name": "Realty Income",
      "id": "8118ec86-3d0b-46f2-a025-f362a3616440",
      "pe_ratio": "40.490700",
      "percentage": "1.35",
      "symbol": "O",
      "open_contracts": -1,
      "option_type": "C",
      "expiration": "2023-12-15",
      "strike": 55.0,
      "chance": 0.78159,
      "key": 26
    },
    {
      "price": "73.060000",
      "quantity": "100.00000000",
      "average_buy_price": "69.8753",
      "equity": "7306.00",
      "percent_change": "4.56",
      "intraday_percent_change": "0.00",
      "equity_change": "318.470000",
      "type": "stock",
      "name": "Okta",
      "id": "d57904fb-55fe-4e2b-97f7-34ef2e0729ec",
      "pe_ratio": "-19.840000",
      "percentage": "1.83",
      "symbol": "OKTA",
      "open_contracts": 0,
      "key": 27
    },
    {
      "price": "19.200000",
      "quantity": "100.00000000",
      "average_buy_price": "25.2485",
      "equity": "1920.00",
      "percent_change": "-23.96",
      "intraday_percent_change": "0.00",
      "equity_change": "-604.850000",
      "type": "stock",
      "name": "Palantir Technologies",
      "id": "f90de184-4f73-4aad-9a5f-407858013eb1",
      "pe_ratio": "304.328000",
      "percentage": "0.48",
      "symbol": "PLTR",
      "open_contracts": -1,
      "option_type": "C",
      "expiration": "2024-01-19",
      "strike": 13.0,
      "chance": 0.552767,
      "key": 28
    },
    {
      "price": "3.470000",
      "quantity": "100.00000000",
      "average_buy_price": "26.0400",
      "equity": "347.00",
      "percent_change": "-86.67",
      "intraday_percent_change": "0.00",
      "equity_change": "-2257.000000",
      "type": "stock",
      "name": "Plug Power",
      "id": "ef99a2c4-adb2-4163-a2df-2d5722cc75b7",
      "pe_ratio": "-2.170000",
      "percentage": "0.09",
      "symbol": "PLUG",
      "open_contracts": -1,
      "option_type": "C",
      "expiration": "2023-12-15",
      "strike": 10.0,
      "chance": 0.994175,
      "key": 29
    },
    {
      "price": "389.250000",
      "quantity": "100.28330300",
      "average_buy_price": "386.7546",
      "equity": "39035.28",
      "percent_change": "0.65",
      "intraday_percent_change": "0.00",
      "equity_change": "250.246954",
      "type": "etp",
      "name": "Invesco QQQ",
      "id": "1790dd4f-a7ff-409e-90de-cad5efafde10",
      "pe_ratio": "32.132046",
      "percentage": "9.78",
      "symbol": "QQQ",
      "open_contracts": -1,
      "option_type": "C",
      "expiration": "2025-01-17",
      "strike": 380.0,
      "chance": 0.613827,
      "key": 30
    },
    {
      "price": "80.149300",
      "quantity": "10.00000000",
      "average_buy_price": "77.8370",
      "equity": "801.49",
      "percent_change": "2.97",
      "intraday_percent_change": "0.00",
      "equity_change": "23.123000",
      "type": "stock",
      "name": "RTX Corporation",
      "id": "1de794e3-c447-4125-b3d9-6bcb4895444c",
      "pe_ratio": "37.048000",
      "percentage": "0.20",
      "symbol": "RTX",
      "open_contracts": 0,
      "key": 31
    },
    {
      "price": "181.680100",
      "quantity": "100.00000000",
      "average_buy_price": "164.9571",
      "equity": "18168.01",
      "percent_change": "10.14",
      "intraday_percent_change": "0.00",
      "equity_change": "1672.300000",
      "type": "stock",
      "name": "Spotify",
      "id": "9c53326c-d07e-4b82-82d2-b108ec5d9530",
      "pe_ratio": "-45.430000",
      "percentage": "4.55",
      "symbol": "SPOT",
      "open_contracts": -1,
      "option_type": "C",
      "expiration": "2025-01-17",
      "strike": 165.0,
      "chance": 0.663986,
      "key": 32
    },
    {
      "price": "59.650000",
      "quantity": "100.00000000",
      "average_buy_price": "70.0150",
      "equity": "5965.00",
      "percent_change": "-14.80",
      "intraday_percent_change": "0.00",
      "equity_change": "-1036.500000",
      "type": "stock",
      "name": "Block",
      "id": "f3acdd2f-6580-4c75-a69c-81481cc4c235",
      "pe_ratio": "-127.650000",
      "percentage": "1.50",
      "symbol": "SQ",
      "open_contracts": -1,
      "option_type": "C",
      "expiration": "2025-01-17",
      "strike": 85.0,
      "chance": 0.834949,
      "key": 33
    },
    {
      "price": "181.590000",
      "quantity": "100.00000000",
      "average_buy_price": "385.0185",
      "equity": "18159.00",
      "percent_change": "-52.84",
      "intraday_percent_change": "0.00",
      "equity_change": "-20342.850000",
      "type": "stock",
      "name": "Atlassian Corporation",
      "id": "6fb80910-6286-4848-a847-2098dc5ab6fa",
      "pe_ratio": "-92.230000",
      "percentage": "4.55",
      "symbol": "TEAM",
      "open_contracts": -1,
      "option_type": "C",
      "expiration": "2025-01-17",
      "strike": 270.0,
      "chance": 0.857054,
      "key": 34
    },
    {
      "price": "235.700000",
      "quantity": "100.00000000",
      "average_buy_price": "121.9989",
      "equity": "23570.00",
      "percent_change": "93.20",
      "intraday_percent_change": "0.00",
      "equity_change": "11370.110000",
      "type": "stock",
      "name": "Tesla",
      "id": "e39ed23a-7bd1-4587-b060-71988d9ef483",
      "pe_ratio": "75.417800",
      "percentage": "5.91",
      "symbol": "TSLA",
      "open_contracts": -1,
      "option_type": "C",
      "expiration": "2023-12-15",
      "strike": 300.0,
      "chance": 0.977053,
      "key": 35
    },
    {
      "price": "104.570000",
      "quantity": "2.00000000",
      "average_buy_price": "108.3430",
      "equity": "209.14",
      "percent_change": "-3.48",
      "intraday_percent_change": "0.00",
      "equity_change": "-7.546000",
      "type": "stock",
      "name": "Exxon Mobil",
      "id": "9133b38b-4917-4b5a-8eab-c029d60f9912",
      "pe_ratio": "10.339900",
      "percentage": "0.05",
      "symbol": "XOM",
      "open_contracts": 0,
      "key": 36
    }
  ];

  const format = (prefix = '', suffix = '', mult = 1, color = (_: any) => 'inherit', arrow = false) => (toRound: string) => {
    let num = parseFloat(toRound) * mult;
    return num ? (
      <>
        <span style={{ color: color(num) }}>{`${prefix}${num % 1 ? num.toFixed(2) : num}${suffix}`}</span>
        <span style={{ color: num >= 0 ? 'cyan' : 'magenta' }}>{arrow && (num >= 0 ? ' ▲' : ' ▼') || ''}</span>
      </>) : '';
  }

  const createColumn = ({ dataName = '', displayName = '', render = (s: string) => s, sort = null }) => (
    Object.assign({
      title: (displayName || dataName).toLowerCase().replace(/(^| )(\w)/g, (s: string) => s.toUpperCase()),
      dataIndex: dataName,
      key: dataName,
      align: 'center',
      render
    }, sort && Object.assign({
      sorter: { compare: (a: { [x: string]: any; }, b: { [x: string]: any; }) => a[dataName] - b[dataName] }
    }, sort)));

  const sell = async (holding) => {
    setTradeLoading(holding.symbol);
    const renderError = () => notification.error({
      duration: 10,
      message: "Failure",
      description: `Failed to execute order for ${holding.symbol}.`,
    });
    const jwtToken = loggedIn?.signInUserSession?.idToken?.jwtToken;
    const url = `${getApiUrl({ localOverride: "dev" })}/trade?variant=${Boolean(variant)}`;
    try {
      const response = await fetch(url, { method: "POST", headers: { Authorization: jwtToken }, body: JSON.stringify({ type: holding.open_contracts ? 'BUY' : 'SELL', symbols: [holding.symbol] }) });
      const data = await response.json();
      console.log('data', typeof data, data);
      console.log('data keys', Object.keys(data));
      //   {
      //     "statusCode": 200,
      //     "body": "{\"CVNA\": {\"account_number\": \"5QV38413\", \"cancel_url\": null, \"canceled_quantity\": \"0.00000\", \"created_at\": \"2023-12-22T20:01:47.326521Z\", \"direction\": \"debit\", \"id\": \"6585eb2b-9a21-4644-bfef-08da04aa6d4a\", \"legs\": [{\"executions\": [{\"id\": \"6585eb2b-5f6b-4623-b040-93a3763058ce\", \"price\": \"1.94000000\", \"quantity\": \"1.00000\", \"settlement_date\": \"2023-12-26\", \"timestamp\": \"2023-12-22T20:01:47.874000Z\"}], \"id\": \"6585eb2b-bbd4-42a6-9fb2-1a3ca7421173\", \"option\": \"https://api.robinhood.com/options/instruments/fbb52868-43b2-4316-86f1-9a48754d5f8f/\", \"position_effect\": \"close\", \"ratio_quantity\": 1, \"side\": \"buy\", \"expiration_date\": \"2023-12-22\", \"strike_price\": \"54.0000\", \"option_type\": \"call\", \"long_strategy_code\": \"fbb52868-43b2-4316-86f1-9a48754d5f8f_L1\", \"short_strategy_code\": \"fbb52868-43b2-4316-86f1-9a48754d5f8f_S1\"}], \"pending_quantity\": \"0.00000\", \"premium\": \"194.00000000\", \"processed_premium\": \"194\", \"net_amount\": \"194.03\", \"net_amount_direction\": \"debit\", \"price\": \"1.94000000\", \"processed_quantity\": \"1.00000\", \"quantity\": \"1.00000\", \"ref_id\": \"99e74494-af70-40a6-a0a4-04ec19cf8dcc\", \"regulatory_fees\": \"0.03\", \"state\": \"filled\", \"time_in_force\": \"gtc\", \"trigger\": \"immediate\", \"type\": \"limit\", \"updated_at\": \"2023-12-22T20:01:48.464649Z\", \"chain_id\": \"99954490-bfc1-4590-9cf7-19f7e8ca916d\", \"chain_symbol\": \"CVNA\", \"response_category\": null, \"opening_strategy\": null, \"closing_strategy\": \"short_call\", \"stop_price\": null, \"form_source\": null, \"client_bid_at_submission\": null, \"client_ask_at_submission\": null, \"client_time_at_submission\": null, \"average_net_premium_paid\": \"194.00000000\", \"estimated_total_net_amount\": \"194.03\", \"estimated_total_net_amount_direction\": \"debit\"}}",
      //     "headers": {
      //         "Access-Control-Allow-Origin": "*"
      //     }
      // }
      // buy result is putting statusCode body and headers all in body - fix in api

      if ('error' in data[holding.symbol]) {
        renderError();
      } else {
        // this is for sell req,
        // make for buy req too!
        notification.success({
          duration: 10,
          message: <span style={{ display: 'flex', justifyContent: 'space-between' }}><span>Success</span><span style={{ color: 'lime', fontWeight: 'bold' }}>+ ${parseFloat(data[holding.symbol].premium).toFixed(0)}</span></span>,
          description: `Executed order for ${holding.symbol}!`,
        });

        setPortfolio(prev => [
          ...(prev.slice(0, variant).length === 1 ? [prev.slice(0, variant)] : prev.slice(0, variant)),
          prev[variant].map(p =>
            p.symbol === holding.symbol ?
              ({
                ...p,
                ...{
                  open_contracts: holding.open_contracts - parseInt(data[holding.symbol].quantity),
                  expiration: data[holding.symbol].legs[0].expiration_date,
                  strike: parseFloat(data[holding.symbol].legs[0].strike_price),
                  chance: 0.88
                }
              }) : p
          ),
          ...(prev.slice(variant + 1).length === 1 ? [prev.slice(variant + 1)] : prev.slice(variant + 1))
        ])
      }
    } catch (e) {
      console.error(e);
      renderError()
    }
    setTradeLoading();
  }

  const columns = toggle ? [
    createColumn({ dataName: 'symbol' }),
    createColumn({ dataName: 'quantity', render: format() }),
    createColumn({ dataName: 'price', render: format('$') }),
    createColumn({
      dataName: 'percent_change', displayName: 'Delta',
      render: format(
        '',
        '%',
        1,
        (num) => num >= 0 ? 'cyan' : 'magenta',
        true
      ),
      sort: true,
    }),
    createColumn({ dataName: 'percentage', render: format('', '%'), sort: true })
  ] : [
    createColumn({ dataName: 'symbol' }),
    createColumn({ dataName: 'open_contracts', displayName: 'Contracts', sort: { defaultSortOrder: 'descend', sorter: { compare: (a, b) => a.open_contracts - b.open_contracts, multiple: 2 } } }),
    createColumn({ dataName: 'strike', render: format('$') }),
    createColumn({ dataName: 'chance', render: format('', '%', 100, (num) => num >= 80 ? 'cyan' : 'magenta'), sort: true }),
    createColumn({ dataName: 'expiration', sort: { defaultSortOrder: 'ascend', sorter: { compare: (a, b) => Date.parse(a.expiration) - Date.parse(b.expiration), multiple: 1 } } }),
    createColumn({
      displayName: 'Action', render: (holding) =>
        <Button
          className={holding.open_contracts ? layoutStyles.start : subStyles.subscribe}
          onClick={() => sell(holding)}
          loading={tradeLoading === holding.symbol}
          disabled={Boolean(tradeLoading)}
        >
          {holding.open_contracts ? 'BUY' : 'SELL'}
        </Button>
    })
    // add chart for premium income per week
    // include dividend income on chart - area chart
  ]

  useEffect(() => {
    if (loggedIn) {
      (async () => {
        setLoading(true);
        const jwtToken = loggedIn?.signInUserSession?.idToken?.jwtToken;
        const variants = [0, 1];
        try {
          const promises = variants.map(async v => {
            const url = `${getApiUrl({ localOverride: "dev" })}/trade?variant=${Boolean(v)}`;
            const response = await fetch(url, { method: "GET", headers: { Authorization: jwtToken } });
            if (response.ok) {
              const data = await response.json();
              return data;
            } else if (isLocal) {
              return mockData;
            }
          })
          setPortfolio(await Promise.all(promises));
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [loggedIn]);

  const data = portfolio[variant].map(holding => ({ type: holding['symbol'], value: Math.round(holding['percentage'] * 100) / 100 }))

  const config = {
    appendPadding: 10,
    data,
    theme: 'dark',
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-50%',
      content: (content: { type: any; }) => content.type,
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        content: 'STX',
      },
    },
  };

  // Goal:
  // number of options (should be done), date (should be done), strike price (should be done), chance of profit (should be done), sell (magenta) and roll (cyan) buttons
  // execute (magenta) button executes strategy for all assets
  // graph of covered call income over time
  // total + for the week, filter sum to include filled orders after start of day Mon
  // include dividend income on chart - area chart
  console.log('variant', variant);
  console.log('toggle2', toggle2);
  return (
    <>
      <Title>Portfolio</Title>
      <span style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
        <Toggle
          val={!variant}
          options={['DEFAULT', 'VARIANT']}
          defaultValue={'DEFAULT'}
          onChange={(val: string) => setVariant(Number(val === 'VARIANT'))}
        />
        {/* <Toggle
          val={toggle2}
          options={['1', '2']}
          defaultValue={'1'}
          onChange={(val: string) => setToggle2(!toggle2)}
        /> */}
        <Toggle
          val={toggle}
          options={[toggleLabels.STOCKS, toggleLabels.OPTIONS]}
          defaultValue={toggleLabels.OPTIONS}
          onChange={(val: string) => setToggle(val === toggleLabels.STOCKS)}
        />
      </span>
      <Table loading={loading} dataSource={toggle ? portfolio[variant] : portfolio[variant].filter(holding => parseFloat(holding?.quantity) >= 100)} columns={columns} />
      {toggle && <Pie {...config} />}
    </>
  );
};

TradePage.displayName = "Trade";

export default TradePage;
