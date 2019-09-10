import React, { useEffect } from 'react';
import { useKV } from 'react-hooks-kv'

import {
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography
} from '@material-ui/core'

import io from 'socket.io-client'

interface ITicker {
  "product_code": string,
  "timestamp": string,
  "tick_id": number,
  "best_bid": number,
  "best_ask": number,
  "best_bid_size": number,
  "best_ask_size": number,
  "total_bid_depth": number,
  "total_ask_depth": number,
  "ltp": number,
  "volume": number,
  "volume_by_product": number
}

const socket = io("https://io.lightstream.bitflyer.com", { transports: ["websocket"] });
const channels = ["BTC_JPY", "FX_BTC_JPY", "ETH_BTC", "BCH_BTC", "BTCJPY_MAT3M", "BTCJPY_MAT1WK", "BTCJPY_MAT2WK"].map(x => 'lightning_ticker_' + x)

const App: React.FC = () => {
  const [tickers, setTicker] = useKV<ITicker>()

  useEffect(() => {
    socket.on("connect", () => {
      channels.forEach(channel => {
        console.log('subscribe' + channel)
        socket.emit('subscribe', channel)
      })
    })

    socket.on("error", console.error)
  }, [])

  useEffect(() => {
    channels.forEach(channel => {
      socket.on(channel, (x: ITicker) => {
        console.log(x)
        setTicker(channel, x)
      })
    })
    return () => channels.forEach(channel => {
      socket.off(channel)
    })
  }, [setTicker])

  return (
    <Container maxWidth="lg">
      <Typography variant="h2">bitFlyer Monitor</Typography>
      <br />
      <Grid container spacing={2}>
        {Object.values(tickers).map(value => (
          <Grid key={value.tick_id} item xs={12} sm={6} lg={3}>
            <Paper>
              <Typography variant="h4">{value.product_code}</Typography>
              <List dense={true}>
                {Object.entries(value).map(([k, v]) => (
                  <ListItem>
                    <ListItemText key={k} primary={k} secondary={v} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default App;