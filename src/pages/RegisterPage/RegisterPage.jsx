import './RegisterPage.scss';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../contexts/auth';

export default function RegisterPage() {

  const { signUp } = useContext(AuthContext);

  return (
    <div className='app-container'>
      <div className="form-container">
        <h3 className="title">Criar conta</h3>
        <form id="register-form" onSubmit={signUp}>
          <input type="text" name="name" id="name-input" placeholder='Digite seu nome' />
          <input type="email" name="email" id="email-input" placeholder='Digite seu e-mail' />
          <input type="password" name="password" id="password-input" placeholder='Digite sua senha' />
          <input type="password" name="confirm-password" id="confirm-password-input" placeholder='Confirme sua senha' />
          <div className="footer">
            <Link className="link" to="/">Entrar agora</Link>
            <button>Criar conta</button>
          </div>
        </form>
      </div>
    </div>
  )
}