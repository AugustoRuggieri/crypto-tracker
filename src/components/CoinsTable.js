import React, { useEffect, useState } from 'react'
import { CryptoState } from '../CryptoContext'
import {
    Container,
    createTheme,
    LinearProgress,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    ThemeProvider,
    Typography
} from '@material-ui/core'
import { useNavigate } from 'react-router-dom'
import { Pagination } from '@material-ui/lab'

export function numberWithCommas(x) {
    return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const useStyles = makeStyles({
    row: {
        backgroundColor: "#16171a",
        cursor: "pointer",
        "&:hover": {
            backgroundColor: "#131111"
        },
        fontFamily: "Montserrat",
    },
    pagination: {
        "& .MuiPaginationItem-root": {
            color: "gold"
        }
    }
})

export default function CoinsTable() {

    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)

    const { currency, symbol, coins, loading, fetchCoins } = CryptoState()

    const navigate = useNavigate()

    useEffect(() => {
        fetchCoins()
    }, [currency])

    const darkTheme = createTheme({
        palette: {
            primary: {
                main: '#fff',
            },
            type: 'dark',
        }
    })

    const classes = useStyles()

    const handleSearch = () => {
        return coins.filter((coin) =>
            coin.name.toLowerCase().includes(search) ||
            coin.symbol.toLowerCase().includes(search)
        )
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <Container style={{
                textAlign: "center"
            }}>
                <Typography variant='h4' style={{
                    margin: 18,
                    fontFamily: "Montserrat"
                }}>
                    Cryptocurrency prices by market caps
                </Typography>
                <TextField
                    label="Search for a crypto currency... "
                    variant='outlined'
                    style={{
                        marginBottom: 20,
                        width: "100%"
                    }}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <TableContainer>
                    {loading ? (
                        <LinearProgress style={{ background: "gold" }} />
                    ) : (
                        <Table>
                            <TableHead>
                                <TableRow style={{ background: "gold" }}>
                                    {["Coin", "Price", "24h Change", "Market Cap"].map((cell) => (
                                        <TableCell
                                            style={{
                                                color: "black",
                                                fontWeight: "700",
                                                fontFamily: "Montserrat"
                                            }}
                                            key={cell}
                                            align={cell === "Coin" ? "" : "right"}
                                        >
                                            {cell}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {handleSearch()
                                .slice((page - 1) * 10, (page - 1) * 10 + 10)
                                .map((row) => {
                                    const profit = row.price_change_percentage_24h > 0

                                    return (
                                        <TableRow
                                            onClick={() => navigate(`/coins/${row.id}`)}
                                            className={classes.row}
                                            key={row.name}
                                        >
                                            <TableCell
                                                component='th'
                                                scope='row'
                                                style={{
                                                    display: "flex",
                                                    gap: 15
                                                }}>
                                                <img src={row?.image}
                                                    alt={row.name}
                                                    height="50"
                                                    style={{ marginBottom: 10 }}
                                                />
                                                <div
                                                    style={{ display: "flex", flexDirection: "column" }}
                                                >
                                                    <span
                                                        style={{
                                                            textTransform: "uppercase",
                                                            fontSize: 22
                                                        }}>
                                                        {row.symbol}
                                                    </span>
                                                    <span style={{ color: "darkgrey" }}>
                                                        {row.name}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell align='right'>
                                                {symbol}{" "}
                                                {numberWithCommas(
                                                    row.market_cap.toString().slice(0, -6)
                                                )}
                                            </TableCell>
                                            <TableCell
                                                align='right'
                                                style={{
                                                    color: profit > 0 ? "green" : "red",
                                                    fontWeight: 500
                                                }}>
                                                {profit && "+"}
                                                {row.price_change_percentage_24h.toFixed(2)}%
                                            </TableCell>
                                            <TableCell align='right'>
                                                {symbol}{" "}
                                                {numberWithCommas(
                                                    row.market_cap.toString().slice(0, -6)
                                                )}M
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    )
                    }
                </TableContainer>
                <Pagination 
                style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: 20,
                    width: "100%"
                }}
                classes={{ ul: classes.pagination }}
                count={(handleSearch()?.length / 10).toFixed(0)}
                onChange={(_, value) => {
                    setPage(value)
                    window.scroll(0, 450)
                }}
                />
            </Container>
        </ThemeProvider>
    )
}