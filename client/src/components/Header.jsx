import heroImg from '../assets/logo-centered-cropped.svg';

function Header() {
    return (
    <header className="p-3 text-bg-dark">
        <div className="container">
            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
                    <img src={heroImg} alt="Logo" width="40" height="42" className="me-2" />
                    <span className="fs-4">Small Business Invoice Management</span>
                </a>

                <div className="d-flex ms-auto align-items-center">
                    <ul className="nav mb-2 mb-lg-0">
                        <li><a href="/" className="nav-link px-2 text-white">Home</a></li>
                        <li><a href="/invoices" className="nav-link px-2 text-white">Invoices</a></li>
                        <li><a href="/create-invoice" className="nav-link px-2 text-white">Create</a></li>
                    </ul>
                    <div className="text-end ms-3">
                        <a href="/signin" className="btn btn-outline-light">Sign in</a>
                    </div>
                </div>
            </div>
        </div>
    </header>
    );
}

export default Header;