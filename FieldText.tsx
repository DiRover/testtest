import TextField, {TextFieldProps} from "@mui/material/TextField";
import React, {FC} from "react";
import {FieldRenderProps} from "react-final-form";
import {InputProps} from "@mui/material";
import {createStyles, makeStyles, withStyles} from "@mui/styles";
import {StyleRules} from "@mui/styles/withStyles";
import FormControlWrapper from "./FormControlWrapper";

interface Props extends Pick<TextFieldProps, 'label' | 'variant'>, FieldRenderProps<string> {
    inputProps?: Partial<InputProps>;
    visibilityToggle?: boolean;
}

const useDefaultStyles = makeStyles((): StyleRules => {
    return createStyles({
        root: {
            '& fieldset': {
                borderColor: 'grey !important',
            },
            '& label': {
                color: 'grey !important'
            }
        },
    })
});

const useStyles = makeStyles((theme): StyleRules => {
    console.log(theme);
    return createStyles({
        root: {
            '& MuiFormHelperText-root': {
                color: 'black !important'
            }
        },
    })
});


const StyledTextField = withStyles({
    root: {
        '& label.Mui-focused': {
            color: 'green',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: 'green',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'grey',
            },
            '&:hover fieldset': {
                borderColor: 'yellow',
            },
            '&.Mui-focused fieldset': {
                borderColor: 'grey',
            },
        },
    },
})(TextField);

const useHelperTextStyles = makeStyles(() => ({
    root: {
        position: 'absolute',
        top: '90%',
    }
}));

const FieldText: FC<Props> = ({input, placeholder, meta}) => {

    const defaultClasses = useDefaultStyles();


    const classes = useStyles(!!(meta.touched && meta.error));
    const error = !!(meta.touched && meta.error);

    const helperTextStyles = useHelperTextStyles();

    return (
        <FormControlWrapper meta={meta}>
            <TextField label="Outlined secondary"
                       // focused
                             InputLabelProps={{ shrink: true }}
                       classes={classes}
                       error={!!(meta.touched && meta.error)}
                       {...input}

                       helperText={error ? "Incorrect entry." : null}
                       placeholder={placeholder}
                       FormHelperTextProps={{
                           classes: {
                               root: helperTextStyles.root
                           }
                       }}
            />
        </FormControlWrapper>
    )

};

export default FieldText;