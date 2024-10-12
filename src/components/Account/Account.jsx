import './Account.css';

const Account = () => {
    const email = localStorage.getItem('email');

    return (
        <div className="account">
            <h1>Mi Cuenta</h1>
            {email ? (
                <p>Tu email: {email}</p>
            ) : (
                <p>No has iniciado sesión.</p>
            )}
        </div>
    );
};

export default Account;
