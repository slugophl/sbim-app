function Footer() {
    return (
        <div className="container">
            <footer className="py-3 my-4">
                <ul className="nav justify-content-center border-bottom pb-3 mb-3">
                    <li className="nav-item"><a href="/" className="nav-link px-2 fg-2 text-body-secondary footer-nav-link">Home</a></li>
                    <li className="nav-item"><a href="/invoices" className="nav-link px-2 fg-2 text-body-secondary footer-nav-link">Invoices</a></li>
                    <li className="nav-item"><a href="/create-invoice" className="nav-link px-2 fg-2 text-body-secondary footer-nav-link">Create</a></li>
                </ul>
                <p className="text-center fg-2 text-body-secondary">© 2026 Small Business Invoice Management. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Footer;