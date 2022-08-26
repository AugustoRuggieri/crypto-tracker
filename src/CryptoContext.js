import React, { useState, createContext, useContext, useEffect } from 'react'
import axios from 'axios'
import { CoinList } from './config/api'
import { auth, db } from "./firebase"
import { onAuthStateChanged } from "@firebase/auth"
import { onSnapshot } from 'firebase/firestore'
import { doc } from 'firebase/firestore'

const Crypto = createContext()

const CryptoContext = ({children}) => {

    const [coins, setCoins] = useState([])
    const [loading, setLoading] = useState(false)
    const [currency, setCurrency] = useState("EUR")
    const [symbol, setSymbol] = useState("€")
    const [user, setUser] = useState(null)
    const [watchlist, setWatchlist] = useState([])
    const [alert, setAlert] = useState({
        open: false,
        message: "",
        type: "success"
    })

    useEffect(() => {
      if(user) {
        const coinRef = doc(db, "watchlist", user.uid)

        var unsubscribe = onSnapshot(coinRef, coin => {
            if(coin.exists()) {
                setWatchlist(coin.data().coins)
            } else {
                console.log("Watchlist is empty")
            }
        })

        return () => {
            unsubscribe()
          }
      }
    }, [user])
    

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
          if (user) setUser(user);
          else setUser(null);
        });
      }, []);

    const fetchCoins = async () => {
        setLoading(true)
        const { data } = await axios.get(CoinList(currency))
        setCoins(data)
        setLoading(false)
    }

    useEffect(() => {
        if(currency === "EUR") {setSymbol("€")}
        else if(currency === "USD") {setSymbol("$")}
    }, [currency])
    

    return (
        <Crypto.Provider value={{currency, symbol, setCurrency, coins, loading, fetchCoins, alert, setAlert, user, watchlist}}>
            {children}
        </Crypto.Provider>
    )
}

export default CryptoContext

export const CryptoState = () => {
    return useContext(Crypto)
}