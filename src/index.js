import { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import './index.css';
import { API_URL } from './config.js';
import AuthContext from './contexts/auth';

import LoginPage from './pages/loginPage/LoginPage.jsx';
import ChatPage from './pages/chatPage/ChatPage.jsx';
import RegisterPage from './pages/RegisterPage/RegisterPage';

const App = () => {

  const [loading, setLoading] = useState(true);
  const [logged, setLogged] = useState(false);

  const authContext = useMemo(() => ({
    validToken: async () => {

      const sessionToken = sessionStorage.getItem('token');

      if (sessionToken) {
        try {
          const authReq = await fetch(API_URL + '/auth/valid', {
            method: 'POST',
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify({ token: sessionToken })
          });

          const res = await authReq.json();

          if (!authReq.ok) {
            setLoading(false);
            return alert(res.message);
          }

          const { token, _id, name, email } = res;

          sessionStorage.setItem('token', token);
          sessionStorage.setItem('_id', _id);
          sessionStorage.setItem('name', name);
          sessionStorage.setItem('email', email);

          setLoading(false);
          return setLogged(true);
        } catch (err) {
          console.log(err.message);
        }
      }

      setLoading(false);
      return setLogged(false);
    },
    signIn: async e => {

      const ev = e || window.event;
      ev.preventDefault();

      const emailInput = document.querySelector('#email-input');
      const passwordInput = document.querySelector('#password-input');

      if (!emailInput.value && !passwordInput.value)
        return alert('Preencha todos os campos necessários e tente novamente!');

      try {
        const loginReq = await fetch(API_URL + '/auth/signin', {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            email: emailInput.value,
            password: passwordInput.value,
          })
        });

        const res = await loginReq.json();

        if (!loginReq.ok)
          return alert(res.message);

        const { token, _id, name, email } = res;

        sessionStorage.setItem('token', token);
        sessionStorage.setItem('_id', _id);
        sessionStorage.setItem('name', name);
        sessionStorage.setItem('email', email);

        return setLogged(true);
      } catch (err) {
        alert(err.message);
      }

      setLogged(false);
    },
    signUp: async e => {

      const ev = e || window.event;
      ev.preventDefault();

      const nameInput = document.querySelector('#name-input');
      const emailInput = document.querySelector('#email-input');
      const passwordInput = document.querySelector('#password-input');
      const confirmPasswordInput = document.querySelector('#confirm-password-input');

      if (!nameInput.lavue && !emailInput.value && !passwordInput.value)
        return alert('Preencha todos os campos necessários e tente novamente!');

      if (passwordInput.value !== confirmPasswordInput.value)
        return alert('As senhas digitadas são diferentes!');

      try {
        const registerReq = await fetch(API_URL + '/users', {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            name: nameInput.value,
            email: emailInput.value,
            password: passwordInput.value,
          })
        });

        const res = await registerReq.json();

        if (!registerReq.ok)
          return alert(res.message);

        const { token, _id, name, email } = res;

        sessionStorage.setItem('token', token);
        sessionStorage.setItem('_id', _id);
        sessionStorage.setItem('name', name);
        sessionStorage.setItem('email', email);

        return setLogged(true);
      } catch (err) {
        alert(err.message);
      }

      setLogged(false);
    },
    signOut: () => {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('_id');
      sessionStorage.removeItem('name');
      sessionStorage.removeItem('email');

      return setLogged(false);
    }
  }), []);

  useEffect(() => {
    authContext.validToken();
  }, [authContext]);

  return (
    <AuthContext.Provider value={authContext}>
      <BrowserRouter>
        {
          loading ? (
            <Routes>
              <Route path="/" element={
                <div className="loading-container"></div>
              } />
            </Routes>
          ) : logged ? (
            <Routes>
              <Route path="/" element={<ChatPage />} />
              <Route path="/criar-conta" element={<Navigate to="/" />} />
            </Routes>
          ) : (
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/criar-conta" element={<RegisterPage />} />
            </Routes>
          )
        }
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);
