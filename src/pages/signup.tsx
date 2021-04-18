import { GetServerSideProps } from 'next';
import Router from 'next/router';
import React, { Component } from 'react'
import { IProfileStatus, IUser } from '../lib/auth_helper'
import Image from 'next/image'

import styles from '../styles/Signup.module.scss'
import { Button, Checkbox, FormControlLabel, TextField, Typography } from '@material-ui/core';
import { db_req } from '../lib/db_helper';

interface SignupPageProps {
    profile: IProfileStatus;
    countries: {id: number, country_code: string, country_name: string}[];
    message?: string;
}

interface SignupPageState {
    username: string;
    password: string;
    birthday: Date;
    country: number;
    profile_picture?: Buffer;
    isAdmin: boolean;
    termsAndConditions: boolean;
}


class SignupPage extends Component<SignupPageProps, SignupPageState> {
    constructor(props: SignupPageProps) {
        super(props);
        this.state = {
            username: "",
            password: "",
            birthday: new Date(0),
            country: 1,
            isAdmin: false,
            termsAndConditions: false
        }
    }
    onSignup = async (event) => {
        let user_data: IUser = {
            id: 0,
            username: "hedsao1",
            registered: new Date(),
            password: "abcdef",
            isadmin: false
        }

        try {
            const loginApi = await fetch(`/api/signup`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user_data),
            });

            let result = await loginApi.json();

            if (result.success) {
                Router.push('/login');
            } else {
                alert("Error: " + result.error)
            }

        } catch (error) {
            alert("Error: " + error)
        }
    }


    onSubmit = (event) => {
        // We do some simple form validation, and prevent submission if errors are found
        if (!this.state.username) {
            alert("Your username cannot be empty!");
            event.preventDefault();
        }

        if (!this.state.password) {
            alert("Your password cannot be empty!");
            event.preventDefault();

        }

        if (this.state.birthday > new Date()) {
            alert("Your birthday cannot be in the future");
            event.preventDefault();
        }

        if (!this.state.termsAndConditions) {
            alert("You must agree to the terms and conditions");
            event.preventDefault();
        }
    }

    render() {
        return (
            <div className={styles.container}>
                <form className={styles.form} method="POST" action="/api/signup" encType="multipart/form-data" onSubmit={this.onSubmit}>
                    <Typography variant="h5">Sign Up</Typography>
                    <TextField label="Brugernavn"
                        type="text"
                        name="username"
                        value={this.state.username}
                        onChange={e => this.setState({ username: e.target.value })}
                        InputLabelProps={{
                            shrink: true,
                        }} />
                    <TextField
                        label="Kodeord"
                        type="password"
                        name="password"
                        value={this.state.password}
                        onChange={e => this.setState({ password: e.target.value })}
                        InputLabelProps={{
                            shrink: true,
                        }} />
                    <TextField
                        name="birthday"
                        label="Fødselsdag"
                        type="date"
                        value={this.state.birthday.toISOString().substr(0, 10)}
                        onChange={e => this.setState({ birthday: new Date(e.target.value) })}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        name="country"
                        select
                        label="Land"
                        SelectProps={{
                            native: true,
                        }}
                    >
                         {this.props.countries.map((country) => (
                            <option key={country.id} value={country.id}>
                                {country.country_name}
                            </option>
                        ))}
                    </TextField>
                    <TextField
                        name="profile_picture"
                        label="Profil billede"
                        type="file"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <div style={{ gap: 10, display: "flex", justifyContent: "space-between" }}>
                        <FormControlLabel
                            control={<Checkbox
                                name="isadmin"
                                value={this.state.isAdmin}
                                onChange={e => this.setState({ isAdmin: e.target.checked })}
                            />}
                            label="Is admin"
                        />
                        <FormControlLabel
                            control={<Checkbox
                                name="termsandconditions"
                                value={this.state.termsAndConditions}
                                onChange={e => this.setState({ termsAndConditions: e.target.checked })}
                            />}
                            label="Agree to Terms and Conditions"
                        />
                    </div>
                    <Button type="submit">Submit</Button>
                </form>


                {/* <MaterialUIForm>
          {'Upload file: '}
          <input accept="image/*" id="raised-button-file" multiple type="file" onChange={this.uploadFile} />
          <label htmlFor="raised-button-file">
            <Button variant="raised" component="span">Upload</Button>
          </label>
        </MaterialUIForm> */}

                {/* <img
                    src="/api/file/myfile.jpg"
                    alt="Picture of the author"
                    width={500}
                    height={500}
                />

                <button type="button" onClick={this.onSignup}>Signup</button>
                <button onClick={this.handleClick}>
                    Click me
      </button>
       */}
            </div>

        )
    }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    return { props: {
        countries: (await db_req("SELECT * FROM countries;")).rows
    } };
}

export default SignupPage;