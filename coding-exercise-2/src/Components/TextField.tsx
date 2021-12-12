import React, { PropsWithChildren } from 'react';
import { AllowedCharacters } from '../Types'
import './TextField.css';

export default function TextField(props: ITextFieldProps) {
    const getErrorMsg = (str: string) => `${props.label} is ${str}`;
    const errorMsg = (): string => {
        if (props.isRequired && props.value.length <= 0) return getErrorMsg('required');
        if (!props.isValid) return getErrorMsg('invalid');
        return '';
    }
    const getChangeValue = (str: string) => {
        switch (props.allowedCharacters) {
            case AllowedCharacters.AlphaNumeric:
                return str.replace(/[^a-zA-Z0-9\- ]/g, '');
            case AllowedCharacters.Alpha:
                return str.replace(/[^a-z]/gi, '');
            case AllowedCharacters.Numeric:
                return str.replace(/[^0-9]/g,'');
            case AllowedCharacters.All:
            default:
                return str;
        }
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
        const newValue = getChangeValue(e.target.value);
        const formattedValue = props.format && props.format(newValue);
        const isValidLength = (props.maxLength && newValue.length <= props.maxLength) || !props.maxLength;
        if (isValidLength) { props.setValue(formattedValue ?? newValue); }
    }

    return (
        <div className="TextField">
            <div className="input">
                <label>{props.label}</label>
                <input 
                    type="text" 
                    placeholder={props.placeholder} 
                    value={props.value}
                    onChange={onChange} />
            </div>
            <div className="error">
                { props.showError ? errorMsg() : '' }
            </div>
        </div>
    );
}

TextField.defaultProps = {
    placeholder: '',
    isValid: true,
    maxLength: Infinity,
    allowedCharacters: AllowedCharacters.All
}

export interface ITextFieldProps extends PropsWithChildren<any> {
    label: string
    placeholder?: string
    value: string
    isRequired: boolean 
    isValid?: boolean
    allowedCharacters?: AllowedCharacters,
    showError: boolean
    maxLength?: number
    format?(value: string): string
    setValue(value: string): void 
}