import { Container, Row, Col, Card, OverlayTrigger, Tooltip, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

function Home() {
    const [showRegisterSuccess, setShowRegisterSuccess] = useState(false);
    const [showRegisterFail, setShowRegisterFail] = useState(false);
    const [showSignInFail, setShowSignInFail] = useState(false);
    
    const { user, isSignedIn } = useAuth();

    const DEFAULT_REGISTER_FAIL_MSG = 'Registration Failed! Please try again.';
    const [ registerErrorMessage, setRegisterErrorMessage ] = useState(DEFAULT_REGISTER_FAIL_MSG)


    async function handleRegister(event) {
        event.preventDefault();
        const registerButton = document.getElementById('registerButton');
        registerButton.disabled = true;
        const formData = new FormData(event.target);
        const userData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            companyName: formData.get('companyName'),
            email: formData.get('email'),
            password: formData.get('password')
        };

        try {
            const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (userData.email.length < 8 || userData.email.length > 254 || !emailRegexPattern.test(userData.email)) {
                showRegisterError('Email must be a valid email address between 8 and 254 characters.');
                return;
            }
            if (userData.firstName.length < 1 || userData.firstName.length > 50) {
                showRegisterError('First name must be between 1 and 50 characters.');
                return;
            }
            if (userData.lastName.length < 1 || userData.lastName.length > 50) {
                showRegisterError('Last name must be between 1 and 50 characters.');
                return;
            }
            if (userData.companyName.length < 1 || userData.companyName.length > 100) {
                showRegisterError('Company name must be between 1 and 100 characters.');
                return;
            }
            if (userData.password.length < 12 || userData.password.length > 128) {
                showRegisterError('Password must be between 12 and 128 characters.');
                return;
            }
        } catch (error) {
            console.error('Error during validation of registration data:', error);
            showRegisterError(DEFAULT_REGISTER_FAIL_MSG);
            return;
        } finally {
            registerButton.disabled = false;
        }

        try {
            const registerResponse = await api('http://localhost:3001/api/register', {method: 'POST', body: userData});
            if (registerResponse) {
                setShowRegisterSuccess(true);
                setShowRegisterFail(false);
            } else {
                setShowRegisterFail(true);
            }
            document.getElementById('password').value = '';
            document.getElementById('firstName').value = '';
            document.getElementById('lastName').value = '';
            document.getElementById('companyName').value = '';
            document.getElementById('email').value = '';
            document.getElementById('signInEmail').value = registerResponse.email;
        } catch (error) {
            console.error('Error during registration:', error);
            setShowRegisterFail(true);
        } finally {
            registerButton.disabled = false;
        }
    }

    function showRegisterError(msg) {
        setRegisterErrorMessage(msg);
        setShowRegisterFail(true);
    }

    async function handleSignIn(event) {
        event.preventDefault();
        const signInButton = document.getElementById('signInButton');
        signInButton.disabled = true;
        const formData = new FormData(event.target);
        const data = {
            email: formData.get('signInEmail'),
            password: formData.get('signInPassword')
        };

        try {
            const user = await api('http://localhost:3001/api/signin', {method: 'POST', body: data});
            if (user) {
                window.location.href = '/';
            } else {
                setShowSignInFail(true);
            }
        } catch (error) {
            console.error('Error during sign-in:', error);
            setShowSignInFail(true);
        } finally {
            signInButton.disabled = false;
        }
    }

    return (
        <Container className="py-5">
            {isSignedIn ? (
                <Row className="justify-content-center">
                    <Col md={8} className="text-center">
                        <h2>Welcome, {user.firstName}!</h2>
                        <p>Go to the <a href="/invoices">invoices page</a> to start managing your invoices.</p>
                    </Col>
                </Row>
            ) : (
                <Row className="justify-content-center g-4">
                    <Col md={5} lg={4}>
                        <Card className="h-100">
                            <Card.Header>Register</Card.Header>
                            <Card.Body>
                                {showRegisterSuccess && (
                                    <Alert variant="success" onClose={() => setShowRegisterSuccess(false)} dismissible>
                                        Registration successful! You can now sign in.
                                    </Alert>
                                )}
                                {showRegisterFail && (
                                    <Alert variant="danger" onClose={() => setShowRegisterFail(false)} dismissible>
                                        {registerErrorMessage}
                                    </Alert>
                                )}
                                <form id="registerForm" onSubmit={handleRegister}>
                                    <div className="form-field mb-3">
                                        <OverlayTrigger placement="top" overlay={<Tooltip>First name must be between 1 and 50 characters.</Tooltip>}>
                                            <input types="text" className="form-control" id="firstName" name="firstName" placeholder="First Name *" required />
                                        </OverlayTrigger>
                                    </div>
                                    <div className="form-field mb-3">
                                        <OverlayTrigger placement="top" overlay={<Tooltip>Last name must be between 1 and 50 characters.</Tooltip>}>
                                            <input types="text" className="form-control" id="lastName" name="lastName" placeholder="Last Name *" required />
                                        </OverlayTrigger>
                                    </div>
                                    <div className="form-field mb-3">
                                        <OverlayTrigger placement="top" overlay={<Tooltip>Company name must be between 1 and 100 characters.</Tooltip>}>
                                            <input types="text" className="form-control" id="companyName" name="companyName" placeholder="Company Name *" required />
                                        </OverlayTrigger>
                                    </div>
                                    <div className="form-field mb-3">
                                        <OverlayTrigger placement="top" overlay={<Tooltip>Email must be between 8 and 128.</Tooltip>}>
                                            <input type="text" className="form-control" id="email" name="email" placeholder="Email *" required />
                                        </OverlayTrigger>
                                    </div>
                                    <div className="form-field mb-3">
                                        <OverlayTrigger placement="top" overlay={<Tooltip>Password must be between 12 and 128 characters.</Tooltip>}>
                                            <input type="password" className="form-control" id="password" name="password" placeholder="Password *" required />
                                        </OverlayTrigger>
                                    </div>
                                    <button type="submit" form="registerForm" id="registerButton" className="btn btn-primary">Register</button>
                                </form>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={5} lg={4}>
                        <Card className="h-100">
                            <Card.Header>Sign In</Card.Header>
                            <Card.Body>
                                {showSignInFail && (
                                    <Alert variant="danger" onClose={() => setShowSignInFail(false)} dismissible>
                                        <span id="signInFailAlertMsg">Sign In Failed! Please try again.</span>
                                    </Alert>
                                )}
                                <form id="signInForm" onSubmit={handleSignIn}>
                                    <div className="form-field mb-3">
                                        <input type="text" className="form-control" id="signInEmail" name="signInEmail" placeholder="Email *" required />
                                    </div>
                                    <div className="form-field mb-3">
                                        <input type="password" className="form-control" id="signInPassword" name="signInPassword" placeholder="Password *" required />
                                    </div>
                                    <button type="submit" form="signInForm" id="signInButton" className="btn btn-primary">Sign In</button>
                                </form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </Container>
    );
}

export default Home;