import React from 'react';
import FieldText from './FieldText'
import {Field, Form as FinalForm} from 'react-final-form';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { SelectChangeEvent } from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import StyledAccordion from "./StyledAccordion";
import data from  './sources.json';
import {isMobile} from 'react-device-detect';
import Select from "./Select";
import Button from "./Button";
// компонент отображения всего

const AccordionDetails = styled(MuiAccordionDetails)(() => ({
    padding: 0,
}));

export default function Form() {



    const [personName, setPersonName] = React.useState<Array<string>>([]);

    console.log(isMobile);

    const handleChange = (event: SelectChangeEvent) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const onSubmit = (val: unknown) => {
        console.log(val)
    }

    const required = (value: string) => (value ? undefined : 'Required');

    console.log({data});

    return (
        <>
            <FinalForm
                subscription={{invalid: true}}
                onSubmit={onSubmit}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Box>
                            <Grid container direction='column' spacing={2.5}>
                                <Grid item>
                                    <Grid container spacing={2.5} direction={ isMobile ? 'column' : 'row'}>
                                        <Grid item>
                                            <Field
                                                name='firstName'
                                                validate={required}
                                                render={({ input, meta }) => (
                                                    <FieldText
                                                        input={input}
                                                        meta={meta}
                                                        placeholder='Иван'
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Field
                                                name='phoneNumber'
                                                validate={required}
                                                render={({ input, meta }) => (
                                                    <FieldText
                                                        input={input}
                                                        meta={meta}
                                                        placeholder='+7 (000)000-00-00'
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Grid container spacing={2.5} direction={ isMobile ? 'column' : 'row'}>
                                        <Grid item>
                                            <Field
                                                name='email'
                                                validate={required}
                                                render={({ input, meta }) => (
                                                    <FieldText
                                                        input={input}
                                                        meta={meta}
                                                        placeholder='EMAIL'
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Field
                                                name='link'
                                                validate={required}
                                                render={({ input, meta }) => (
                                                    <FieldText
                                                        input={input}
                                                        meta={meta}
                                                        placeholder='Ссылка на профиль'
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Field
                                        name='city'
                                        validate={required}
                                        render={({ input, meta }) => (
                                            <Select data={data}/>
                                        )}
                                    />
                                </Grid>
                                <Grid item>
                                    <Field
                                        name='organisation'
                                        validate={required}
                                        render={({ input, meta }) => (
                                            <FieldText
                                                input={input}
                                                meta={meta}
                                                placeholder=''
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item>
                                    <StyledAccordion>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls='panel1a-content'
                                            id='panel1a-header'
                                        >
                                            <Typography>Accordion 1</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Grid container spacing={2.5} direction="column">
                                                <Grid item>
                                                    <Field
                                                        name='phoneNumber'
                                                        validate={required}
                                                        render={({ input, meta }) => (
                                                            <FieldText
                                                                input={input}
                                                                meta={meta}
                                                                placeholder='+7 (000)000-00-00'
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <Field
                                                        name='phoneNumber'
                                                        validate={required}
                                                        render={() => (
                                                            <Select data={data}/>
                                                        )}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </AccordionDetails>
                                    </StyledAccordion>

                                </Grid>
                            </Grid>
                        </Box>
                        <Box>
                            <Button type='submit'>ok</Button>
                        </Box>
                    </form>
                )}
            />
        </>
    )
}
