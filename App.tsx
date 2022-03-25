import React from 'react';
import {isMobile} from 'react-device-detect';
import './App.css';
import Form from './components/Form';
import Grid from "@mui/material/Grid";
import Text from "./components/Text";

function App() {
    return (
        <Grid container direction={ isMobile ? 'column' : 'row'}>
            <Grid item>
                <Text />
            </Grid>
            <Grid item>
                <Form />
            </Grid>
        </Grid>

    );
}

export default App;
