import React from "react";
import { useState, useEffect } from "react";
import { Typography, Table, Input } from "antd";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import styles from "./index.less";
import { getApiUrl } from "@/utils";
const { Title, Text } = Typography;

const columns = [
  {
    title: "Date",
    dataIndex: "Date",
    key: "Date",
    fixed: "left",
  },
  {
    title: "Id",
    dataIndex: "Id",
    key: "Id",
  },
  {
    title: "Weight",
    dataIndex: "Weight",
    key: "Weight",
  },
  {
    title: "Reps",
    dataIndex: "Reps",
    key: "Reps",
  },
  {
    title: "Exercise",
    dataIndex: "Exercise",
    key: "Exercise",
  },
  {
    title: "Volume",
    dataIndex: "Volume",
    key: "Volume",
  },
  {
    title: "1RM",
    dataIndex: "1RM",
    key: "1RM",
  },
];

const TiersPage = () => {
  const [ranks, setRanks] = useState({
    "STONE#0": { smashgg: { url: "28b0b75b", uid: "40711" } },
    "DILD#924": {},
    "CHIP#947": { smashgg: { url: "8eaf166e", uid: "6499" } },
    "WEV#119": { smashgg: { url: "6b0c0e06", uid: "98863" } },
    "HAMB#669": { smashgg: { url: "af6e895a", uid: "934115" } },
    "NJMP#409": { smashgg: { url: "897e991e", uid: "12874" } },
    "KERO#0": { smashgg: { url: "24e7b537", uid: "153032" } },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // const url = `${getApiUrl({ localOverride: "prod" })}/exercise_log`;
      // fetch(url, { method: "GET" })
      //   .then((response) => response.json())
      //   .then((data) => setLog(data))
      //   .then(() => setLoading(false));
      fetch("https://gql-gateway-dot-slippi.uc.r.appspot.com/graphql", {
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.5",
          "apollographql-client-name": "slippi-web",
          "cache-control": "no-cache",
          "content-type": "application/json",
          pragma: "no-cache",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site",
          "sec-gpc": "1",
          Referer: "https://slippi.gg/",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body:
          '{"operationName":"AccountManagementPageQuery","variables":{"cc":"STONE#0","uid":"STONE#0"},"query":"fragment userProfilePage on User {\\n  fbUid\\n  displayName\\n  connectCode {\\n    code\\n    __typename\\n  }\\n  status\\n  activeSubscription {\\n    level\\n    hasGiftSub\\n    __typename\\n  }\\n  rankedNetplayProfile {\\n    id\\n    ratingOrdinal\\n    ratingUpdateCount\\n    wins\\n    losses\\n    dailyGlobalPlacement\\n    dailyRegionalPlacement\\n    continent\\n    characters {\\n      id\\n      character\\n      gameCount\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nquery AccountManagementPageQuery($cc: String!, $uid: String!) {\\n  getUser(fbUid: $uid) {\\n    ...userProfilePage\\n    __typename\\n  }\\n  getConnectCode(code: $cc) {\\n    user {\\n      ...userProfilePage\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}',
        method: "POST",
      })
        .then((response) => response.json())
        .then((data) => console.log(data));
      // move these to backend bc of cors issue
      fetch("https://www.start.gg/api/-/gql", {
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.5",
          "apollo-client-id": "smashgg-legacy",
          "cache-control": "no-cache",
          "client-version": "20",
          "content-type": "application/json, application/json",
          pragma: "no-cache",
          // "request-id": "|b44fdd60b10246328a705aae47271a9e.089b7f8934044a05",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "sec-gpc": "1",
          traceparent:
            "00-b44fdd60b10246328a705aae47271a9e-089b7f8934044a05-01",
          "true-client-ip": "undefined",
          "x-web-source": "gg-web-gql-client, gg-web-rest",
          // "cookie": "MUID=2D07A2E8B2F568820A1CB34EB3D969F4; __stripe_mid=f59702a3-9594-4eeb-9516-ab920feab4168bcc35; gg_fd_headers=%7B%22clientId%22%3A%222D07A2E8B2F568820A1CB34EB3D969F4%22%2C%22isMobile%22%3Afalse%2C%22activityId%22%3A%22B7235BC5DF7745A3A3D15915681665B0%22%7D; MicrosoftApplicationsTelemetryDeviceId=44a36cc5-2588-48d6-b611-762e97cfb7e6; OptanonAlertBoxClosed=2022-12-15T05:46:40.344Z; gg-recent-pages=%257B%2522version%2522%253A%25222%2522%252C%2522pages%2522%253A%255B%257B%2522profileType%2522%253A%2522tournament%2522%252C%2522profileSlug%2522%253A%2522tournament%252Fthe-g-code-20%2522%252C%2522profileId%2522%253A440884%252C%2522name%2522%253A%2522The%2520G%2520Code%2522%252C%2522icon%2522%253A%2522image-7ec46ace45f64f15942c6771e08c6309-optimized.png%2522%252C%2522ehk%2522%253A%2522G5w2WWQEfdeP7KbW2NnKo%252F5iVOuVInQvlKIf2gnA0i8%253D%2522%252C%2522ehkOptimized%2522%253A%2522oK1Ytm7RTKNtjdajpMy3AyaYGoAF38dFO280deLVdvo%253D%2522%252C%2522route%2522%253A%257B%2522name%2522%253A%2522events_list%2522%252C%2522params%2522%253A%257B%2522slug%2522%253A%2522the-g-code-20%2522%257D%257D%252C%2522order%2522%253A-1%257D%252C%257B%2522profileType%2522%253A%2522tournament%2522%252C%2522profileSlug%2522%253A%2522tournament%252Foffice-hours-51%2522%252C%2522profileId%2522%253A495495%252C%2522name%2522%253A%2522Office%2520Hours%2520%252351%2522%252C%2522icon%2522%253A%2522image-8f613736bab91e02ebc51e13c332fd72-optimized.png%2522%252C%2522ehk%2522%253A%2522UrItqox%252BQI9JyljOA%252BQKUcb%252FlcKkveoiBpY%252FeOUpD6I%253D%2522%252C%2522ehkOptimized%2522%253A%2522I7yJSTHr4stF95ZwjoG49yfEq8dgXyMUap84R90jEaA%253D%2522%252C%2522route%2522%253A%257B%2522name%2522%253A%2522events_overview%2522%252C%2522params%2522%253A%257B%2522slug%2522%253A%2522office-hours-51%2522%252C%2522eventSlug%2522%253A%2522melee%2522%257D%257D%252C%2522order%2522%253A0%257D%252C%257B%2522profileType%2522%253A%2522tournament%2522%252C%2522profileSlug%2522%253A%2522tournament%252Foffice-hours-44%2522%252C%2522profileId%2522%253A474026%252C%2522name%2522%253A%2522Office%2520Hours%2520%252344%2522%252C%2522icon%2522%253A%2522image-cbfe7ce84631856e55019ae04a3fcab5-optimized.png%2522%252C%2522ehk%2522%253A%2522hAwSJSBeuxRHsRJdUOPOovZptw9fjJGca9ORjXmKk18%253D%2522%252C%2522ehkOptimized%2522%253A%2522E6T63PbhPeub2FskmAKuEMnSa1B%252FWO6v%252BRvyRIY%252FePs%253D%2522%252C%2522route%2522%253A%257B%2522name%2522%253A%2522events_list%2522%252C%2522params%2522%253A%257B%2522slug%2522%253A%2522office-hours-44%2522%257D%257D%252C%2522order%2522%253A1%257D%252C%257B%2522profileType%2522%253A%2522tournament%2522%252C%2522profileSlug%2522%253A%2522tournament%252Fgenesis-9-1%2522%252C%2522profileId%2522%253A438800%252C%2522name%2522%253A%2522Genesis%25209%2522%252C%2522icon%2522%253A%2522image-ee12859fd1e05414d37babbad4e36551-optimized.png%2522%252C%2522ehk%2522%253A%25228ATZei2NR9kKyG5GiEDOt3OSZQsWimklwjlGFThT7N0%253D%2522%252C%2522ehkOptimized%2522%253A%25225a7GpH4PbJ47HyHdxHGB2%252FfDd2JvrTWOUUjcIWUOb5k%253D%2522%252C%2522route%2522%253A%257B%2522params%2522%253A%257B%2522slug%2522%253A%2522genesis-9-1%2522%257D%257D%252C%2522order%2522%253A2%257D%252C%257B%2522profileType%2522%253A%2522tournament%2522%252C%2522profileSlug%2522%253A%2522tournament%252Foffice-hours-53%2522%252C%2522profileId%2522%253A501233%252C%2522name%2522%253A%2522Office%2520Hours%2520%252353%2522%252C%2522icon%2522%253A%2522image-c173621a7db26654d7c9a9b6cbfd161f-optimized.png%2522%252C%2522ehk%2522%253A%2522OBntioJmGvTZqC0n7zh4N9qsi6j83H2ZN4xbeOK3QcY%253D%2522%252C%2522ehkOptimized%2522%253A%2522P9MoF%252FKYM94HbQFHNT80OxWvWx3ALsQR5Pj06qURUcg%253D%2522%252C%2522route%2522%253A%257B%2522params%2522%253A%257B%2522slug%2522%253A%2522office-hours-53%2522%257D%257D%252C%2522order%2522%253A3%257D%252C%257B%2522profileType%2522%253A%2522tournament%2522%252C%2522profileSlug%2522%253A%2522tournament%252Foffice-hours-52%2522%252C%2522profileId%2522%253A499566%252C%2522name%2522%253A%2522Office%2520Hours%2520%252352%2522%252C%2522icon%2522%253A%2522image-50d1a53f45d83ed26af077ccacc49bc9-optimized.png%2522%252C%2522ehk%2522%253A%25221juTIzpq5KXP60qdDVveztng8wfNN7RwOLbfLtfLayM%253D%2522%252C%2522ehkOptimized%2522%253A%25229MwRuZ%252BRV%252FxovUew1Gmp9a6iJuwTcglujjbFzYdymic%253D%2522%252C%2522route%2522%253A%257B%2522name%2522%253A%2522events_list%2522%252C%2522params%2522%253A%257B%2522slug%2522%253A%2522office-hours-52%2522%257D%257D%252C%2522order%2522%253A4%257D%255D%257D; recently-moderated-sets=46732306%252C53061169%252C53061179%252C47653322%252C49711555%252C49429146%252C49390588%252C49374022; eupubconsent-v2=CPkCqIgPkCqIgAcABBENCvCgAAAAAAAAACiQAAAAAAEhAAIEUAwA4AAwATwBzAHUASEAkUBcQDDwGRgN0AcSA7MB7oEPg0CEAKwAXABDADIAGWANkAdgA_ACAAEFAIwAU8Aq8BaAFpANYAbwA6oB8gEOgIqASIAnYBSIC5AGEgMYAZOAzkBngDPgH4AR_AkUIAIgAGABIAE8AcwA-QDeAJCASKAuIBh4DdAHEgOzAe6A-wCHwEdBEBoAKwAhgBkADLAGyAOwAfgBAACMAFPAKuAawA6oB8gEOgJEATsApEBcgDCQGTgM5AZ8A_ACP4EihUBgACgAQwAmABcAEcAMsAdgBHACrwFoAWkA3gCQQFsALkAXmAyIBnIDPAGfANyAfgBC8CP4EihQA4AbQA5gB4AEFAOqAj0BIoDDwGvANvAcSA-wCB4EGxkBUAIYATABHADLAHYARwAq4BWwDeAJOAWiAtgBeYDIgGcgM8AZ8A_ACF4EfwJFDABwA2gBzADwALEAdUBHoCRQF5AMPAbeA4kB8QD7AINg.YAAAAAAAAAAA; ai_user=bt0klzEICgFHFsNq5zhlfL|2022-12-20T06:03:23.069Z; gg-client-session=%257B%2522uuid%2522%253A%2522686b5ed5-e1fa-439c-a447-3a56377ff596%2522%252C%2522expiresAt%2522%253A1671518074497%252C%2522lastTime%2522%253A1671516274497%257D; ai_session=RAPHQHjiPh8/YAQhBknSkH|1671516203990|1671516278395; OptanonConsent=isGpcEnabled=1&datestamp=Tue+Dec+20+2022+01%3A04%3A38+GMT-0500+(Eastern+Standard+Time)&version=6.34.0&isIABGlobal=false&hosts=&consentId=fb49a7a6-1c07-46ed-b6f7-5c3963031105&interactionCount=2&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A0%2CC0004%3A0%2CSTACK42%3A0&AwaitingReconsent=false&geolocation=US%3BFL",
          // replace referrer with dynamic uid from state
          Referer: "https://www.start.gg/user/8eaf166e",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        // replace userId from state
        body:
          '[{"operationName":"UserBio","variables":{"id":6499},"query":"query UserBio($id: ID!) {\\n  user(id: $id) {\\n    id\\n    ...userBio\\n    __typename\\n  }\\n}\\n\\nfragment userBio on User {\\n  id\\n  discriminator\\n  images {\\n    id\\n    type\\n    url\\n    __typename\\n  }\\n  ...userBioLine\\n  ...userNameInfoLine\\n  ...userLocationAndDate\\n  ...userSocialConnectionList\\n  player {\\n    id\\n    ...playerTag\\n    ...playerAvatar\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment userBioLine on User {\\n  id\\n  bio\\n  genderPronoun\\n  __typename\\n}\\n\\nfragment userNameInfoLine on User {\\n  id\\n  nameFirst\\n  nameLast\\n  player {\\n    id\\n    name\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment userLocationAndDate on User {\\n  id\\n  createdAt\\n  birthday\\n  location {\\n    id\\n    city\\n    state\\n    country\\n    zipcode\\n    __typename\\n  }\\n  publishingSettings {\\n    location\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment userSocialConnectionList on User {\\n  id\\n  registrationState\\n  slug\\n  location {\\n    id\\n    country\\n    __typename\\n  }\\n  publishingSettings {\\n    profileAuthorizations {\\n      displayFirst\\n      __typename\\n    }\\n    __typename\\n  }\\n  authorizations(types: [TWITCH, MIXER, DISCORD, TWITTER]) {\\n    id\\n    externalUsername\\n    type\\n    stream {\\n      id\\n      isOnline\\n      __typename\\n    }\\n    __typename\\n  }\\n  images {\\n    id\\n    type\\n    url\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment playerTag on Player {\\n  id\\n  gamerTag\\n  prefix\\n  __typename\\n}\\n\\nfragment playerAvatar on Player {\\n  id\\n  gamerTag\\n  color\\n  user {\\n    id\\n    images(type: \\"profile\\") {\\n      ...image\\n      __typename\\n    }\\n    slug\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment image on Image {\\n  id\\n  height\\n  isOriginal\\n  type\\n  url\\n  width\\n  __typename\\n}\\n"}]',
        method: "POST",
      });
    })();
  }, []);

  return (
    <>
      <Title>Tier List (The North)</Title>
      {/* 7 tiers
      bronze, silver, gold, plat, diamond, grand/master
      F,      D,      C,    B,    A,       S,
      0,      1055,   1436, 1752, 2004,    2192
      drk grn lte grn yllw  yl-or orange   red 
      green <----------------------------> red
       */}
      <Input.Search
        size="large"
        prefix={<SearchOutlined />}
        allowClear
        enterButton="Search"
        style={{ marginBottom: 16 }}
      />
      <Text>{3} results</Text>
    </>
  );
};

TiersPage.displayName = "Tiers";

export default TiersPage;
