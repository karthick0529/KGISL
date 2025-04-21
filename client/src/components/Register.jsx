import React, {useState} from 'react';
import API from '../api';

const Register = () => {
    const [form, setForm] = useState({name: '', email: '', password: '', gender: ''});
    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});    
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        await API.post('/auth/register', form);
        alert('User Registered');
    };

    return (
        <form onSubmit = {handleSubmit}>
        <input name="name" placeholder="Enter the name" onChange={handleChange} />
        <input name="email" placeholder="Enter the email" onChange={handleChange} />
        <input name="password" placeholder="Enter the password" onChange={handleChange} />
        <input name="gender" placeholder="Enter the gender" onChange={handleChange} />
        <select name="gender" onChange={handleChange}>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
        </select>
        <button type="submit">Register</button>
        </form>
    );  
};
export default Register;