import {FC, memo, useEffect, useState} from 'react';
import {FieldRenderProps} from 'react-final-form';
import {Collapse, FormControl, FormHelperText} from "@mui/material";

type props = Pick<FieldRenderProps<unknown, HTMLInputElement>, 'meta'>;

const FormControlWrapper: FC<props> = memo(({meta, children}): JSX.Element => {
    const {touched, error} = meta;

    const [errorText, setErrorText] = useState(() => error);

    useEffect(() => {
        if (error) {
            setErrorText(error);
        }
    }, [error]);

    const hasError = !!(touched && error);

    return (
        <FormControl fullWidth error={hasError}>
            {children}

            {/*<Collapse in={hasError} unmountOnExit>*/}
            {/*    <FormHelperText>{errorText}</FormHelperText>*/}
            {/*</Collapse>*/}
        </FormControl>
    );
});



export default FormControlWrapper;
