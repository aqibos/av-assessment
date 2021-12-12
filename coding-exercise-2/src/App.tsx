import React, { useState } from 'react';
import './App.css';
import TextField from './Components/TextField';
import { AllowedCharacters } from './Types'

function App() {
    // state
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [npiNumber, setNpiNumber] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('')

    const [didTrySubmit, setDidTrySubmit] = useState(false)
    const [, setJson] = useState('');

    // validations
    const required = [firstName, lastName, npiNumber, streetAddress, city, state, zipCode, phoneNumber, email];
    const validations: {[key: string]: boolean} = {
        state: state.length === 2,
        zipCode: zipCode.length === 5,
        phoneNumber: phoneNumber.replace(/\D/g,'').length === 10,
        email: /\S+@\S+\.\S+/.test(email)
    }

    const isRegistrationValid = (): boolean => {
        const allFieldsCompleted = required.map(x => x.length > 0).reduce((x, y) => x && y, true);
        const allFieldsValid = Object.keys(validations).map(x => validations[x]).reduce((x, y) => x && y, true);
        return allFieldsCompleted && allFieldsValid;
    }

    // handlers
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setDidTrySubmit(true)
        
        if (!isRegistrationValid()) {
            return;
        }

        const registration = { firstName, lastName, npiNumber, streetAddress, city, state, zipCode, phoneNumber, email };

        // send to API server
        // e.g., await userService.register(registration)
        const jsonStr = JSON.stringify(registration, null, 2); 
        setJson(jsonStr);
        alert(jsonStr);
    }

    return (
        <div className="App">
            <h1>Registration</h1>
            <form onSubmit={onSubmit}>
                <div className="name-input-container">
                    <TextField 
                        label={'First name'} 
                        placeholder={'John'} 
                        value={firstName} 
                        isRequired={true}
                        showError={didTrySubmit}
                        allowedCharacters={AllowedCharacters.AlphaNumeric}
                        setValue={setFirstName} />
                    <TextField 
                        label={'Last name'} 
                        placeholder={'Doe'} 
                        value={lastName} 
                        isRequired={true}
                        showError={didTrySubmit}
                        allowedCharacters={AllowedCharacters.AlphaNumeric}
                        setValue={setLastName} />
                </div>

                <div className="npi-input-container">
                    <TextField 
                        label={'NPI number'} 
                        placeholder={'55555'} 
                        value={npiNumber} 
                        isRequired={true}
                        showError={didTrySubmit}
                        allowedCharacters={AllowedCharacters.Numeric}
                        setValue={setNpiNumber} />
                </div>

                <div className="business-address-container">
                    <TextField 
                        label={'Business address'} 
                        placeholder={'123 Example Rd'} 
                        value={streetAddress} 
                        isRequired={true}
                        showError={didTrySubmit}
                        allowedCharacters={AllowedCharacters.All}
                        setValue={setStreetAddress} />
                    <div className="business-address-city-state">
                        <TextField 
                            label={'City'} 
                            placeholder={'Jacksonville'} 
                            value={city} 
                            isRequired={true}
                            showError={didTrySubmit}
                            allowedCharacters={AllowedCharacters.AlphaNumeric}
                            setValue={setCity} />
                        <TextField 
                            label={'State'} 
                            placeholder={'FL'} 
                            value={state} 
                            isRequired={true}
                            maxLength={2}
                            isValid={validations.state}
                            showError={didTrySubmit}
                            allowedCharacters={AllowedCharacters.Alpha}
                            setValue={setState} />
                    </div>
                    <div className="business-address-zip-code">
                        <TextField 
                            label={'Zip code'} 
                            placeholder={'33333'} 
                            value={zipCode} 
                            isRequired={true}
                            isValid={validations.zipCode}
                            maxLength={5}
                            showError={didTrySubmit}
                            allowedCharacters={AllowedCharacters.Numeric}
                            setValue={setZipCode} />
                    </div>
                </div>

                <div className="telephone-container">
                    <TextField 
                        label={'Phone number'} 
                        placeholder={'8889995555'} 
                        value={phoneNumber}
                        isRequired={true}
                        isValid={validations.phoneNumber}
                        showError={didTrySubmit}
                        maxLength={10}
                        format={(str: string) => str.replace(/^(\d{3})(\d{3})(\d+)$/, "($1)$2-$3")}
                        allowedCharacters={AllowedCharacters.Numeric}
                        setValue={setPhoneNumber} />
                </div>

                <div className="email-address-container">
                    <TextField 
                        label={'Email address'} 
                        placeholder={'johndoe@example.com'} 
                        value={email} 
                        isRequired={true}
                        isValid={validations.email}
                        showError={didTrySubmit}
                        setValue={setEmail} />
                </div>

                <div className="submit-button-container">
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
}

export default App;
