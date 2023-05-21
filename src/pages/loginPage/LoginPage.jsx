import './LoginPage.scss';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../contexts/auth';

export default function LoginPage() {

  const { signIn } = useContext(AuthContext);

  return (
    <div className='app-container'>
      <div className="form-container">
        <h3 className="title">Entrar agora</h3>
        <form id="login-form" onSubmit={signIn}>
          <input type="email" name="email" id="email-input" placeholder='Digite seu e-mail' />
          <input type="password" name="password" id="password-input" placeholder='Digite sua senha' />
          <div className="footer">
            <Link className="link" to="/criar-conta" >Criar conta</Link>
            <button>Entrar</button>
          </div>
        </form>
      </div>
    </div>
  )
}