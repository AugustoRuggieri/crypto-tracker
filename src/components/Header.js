import React from 'react'
import {
    AppBar, 
    Container, 
    createTheme, 
    MenuItem, 
    Select, 
    Toolbar, 
    Typography
} from '@material-ui/core'
import { makeStyles, ThemeProvider } from '@material-ui/styles'
import { useNavigate } from 'react-router-dom'
import { CryptoState } from '../CryptoContext'
import AuthModal from './authentication/AuthModal'
import UserSidebar from './authentication/UserSidebar'

const useStyles = makeStyles({
    title: {
        flex: 1,
        color: "gold",
        fontFamily: "Montserrat",
        fontWeight: "bold",
        cursor: "pointer",
    }
})

const Header = () => {

    const classes = useStyles()

    const navigate = useNavigate()

    const { currency, setCurrency, user } = CryptoState()

    const darkTheme = createTheme({
        palette: {
            primary: {
                main: '#fff',
            },
            type: 'dark',
        }
    })

    return (
        <ThemeProvider theme={darkTheme}>
            <AppBar color='transparent' position='static'>
                <Container>
                    <Toolbar>
                        <Typography onClick={() => navigate("/")}
                            className={classes.title}
                        >
                            Crypto Tracker
                        </Typography>
                        <Select
                        variant='outlined'
                        style={{
                            width: 100,
                            height: 40,
                            marginRight: 15
                        }}
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        >
                            <MenuItem value={"USD"} >USD</MenuItem>
                            <MenuItem value={"EUR"} >EUR</MenuItem>
                        </Select>
                        { user ? <UserSidebar /> : <AuthModal />}
                    </Toolbar>
                </Container>
            </AppBar>
        </ThemeProvider>
    )
}

export default Header