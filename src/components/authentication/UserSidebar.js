import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import { CryptoState } from '../../CryptoContext'
import { Avatar, Button } from '@material-ui/core'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase'
import { numberWithCommas } from "../CoinsTable"
import { AiFillDelete } from "react-icons/ai"
import { db } from '../../firebase'
import { doc, setDoc } from 'firebase/firestore'

const useStyles = makeStyles({
    container: {
        display: "flex",
        flexDirection: "column",
        fontFamily: "monospace",
        height: "100%",
        padding: 25,
        width: 350
    },
    profile: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        height: "92%"
    },
    picture: {
        width: 200,
        height: 200,
        cursor: "pointer",
        backgroundColor: "#EEBC1D",
        objectFit: "contain"
    },
    logout: {
        backgroundColor: "#EEBC1D",
        marginTop: 20,
        height: "8%",
        width: "100%"
    },
    watchlist: {
        background: "grey",
        borderRadius: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flex: 1,
        gap: 12,
        padding: 15,
        width: "100%",
        overflowY: "scroll"
    },
    coin: {
        backgroundColor: "#EEBC1D",
        color: "black",
        borderRadius: 5,
        boxShadow: "0 0 3px black",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
        width: "100%"
    }
});

export default function UserSidebar() {

    const classes = useStyles();
    const [state, setState] = React.useState({
        right: false,
    });

    const { user, setAlert, watchlist, coins, symbol } = CryptoState()

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const logout = () => {
        signOut(auth)

        setAlert({
            open: true,
            message: "Logout successful",
            type: "success"
        })

        toggleDrawer()
    }

    const removeFromWatchlist = async (coin) => {
        const coinRef = doc(db, "watchlist", user.uid)

        try {
            await setDoc(coinRef,
                { coins: watchlist.filter((list) => list !== coin?.id) },
                { merge: true }
            )
            setAlert({
                open: true,
                message: `${coin.name} removed from the watchlist`,
                type: "success"
            })
        } catch (error) {
            setAlert({
                open: true,
                message: error.message,
                type: "error"
            })
        }
    }

    return (
        <div>
            {['right'].map((anchor) => (
                <React.Fragment key={anchor}>

                    <Avatar
                        onClick={toggleDrawer(anchor, true)}
                        style={{
                            height: 38,
                            width: 38,
                            cursor: "pointer",
                            backgroundColor: "#EEBC1D",
                        }}
                        src={user.photoURL}
                        alt={user.displayName || user.email}
                    />

                    <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
                        <div className={classes.container}>
                            <div className={classes.profile}>
                                <Avatar
                                    className={classes.picture}
                                    src={user.photoURL}
                                    alt={user.displayName || user.email}
                                />
                                <span
                                    style={{
                                        width: "100%",
                                        fontSize: 25,
                                        textAlign: "center",
                                        fontWeight: "bolder",
                                        wordWrap: "break-word"
                                    }}
                                >
                                    {user.displayName || user.email}
                                </span>
                                <div className={classes.watchlist}>
                                    <span>
                                        Watchlist
                                    </span>
                                    {coins.map(coin => {
                                        if (watchlist.includes(coin.id))
                                            return (
                                                <div className={classes.coin}>
                                                    <span>{coin.name}</span>
                                                    <span style={{ display: "flex", gap: 8 }}>
                                                        {symbol}
                                                        {numberWithCommas(coin.current_price.toFixed(2))}
                                                        <AiFillDelete
                                                            style={{ cursor: "pointer" }}
                                                            fontSize="16"
                                                            onClick={() => removeFromWatchlist(coin)}
                                                        />
                                                    </span>
                                                </div>
                                            )
                                    })
                                    }
                                </div>
                                <Button
                                    variant='contained'
                                    className={classes.logout}
                                    onClick={logout}
                                >
                                    Log out
                                </Button>
                            </div>
                        </div>
                    </Drawer>
                </React.Fragment>
            ))}
        </div>
    );
}