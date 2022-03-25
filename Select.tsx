import React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { Select as BasicSelect, SelectChangeEvent } from '@mui/material';
import {FC} from "react";
import styled from "@emotion/styled";

interface Props {
    data: Array<string>,
}

const StyledMenuItem = styled(MenuItem)({
    borderBottom: '1px solid black'
})

const Select: FC<Props> = ({data}): JSX.Element => {
    const [value, setData] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setData(event.target.value as string);
    };

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Age</InputLabel>
                <BasicSelect
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={value}
                    label="Age"
                    MenuProps={{
                        MenuListProps: {
                            disablePadding: true
                        }
                    }}
                    onChange={handleChange}
                >
                    {data.map(item => (
                        <StyledMenuItem key={item} value={item}>{item}</StyledMenuItem>
                    ))}
                </BasicSelect>
            </FormControl>
        </Box>
    );
};

export default Select;
