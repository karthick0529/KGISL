import React, {useState} from 'react';
import API  from '../api';

const Login = ({onLogin})=> {
    const [form, setForm] = useState({email: '', password: ''});
    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const {data} = await API.post('/auth/login', form);
        localStorage.setItem('token', data.token);
        onLogin();
    };

    return (
        <form onSubmit = {handleSubmit}>
            <input name="email" placeholder="Email" onChange={handleChange} />
            <input name= "password" placeholder="Password" type="password" onChange={handleChange} />
            <button type="submit">Login</button>
        </form>
    );
};
export default  Login;