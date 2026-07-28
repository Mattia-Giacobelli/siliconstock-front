import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">

                <div className="footer-section">
                    <img src="/content.png" alt="Silicon Stock logo" className="footer-logo" />
                    <p>Il tuo shop di componenti hardware affidabile.</p>
                </div>
                <div className="footer-section">
                    <h4>Link utili</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/products">Prodotti</Link></li>
                        <li><Link to="/cart">Carrello</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Info</h4>
                    <p>Email: support@siliconstock.it</p>
                    <p>Tel: +39 0123 456789</p>
                </div>

            </div>

            <div className="footer-bottom">
                <i className="bi bi-c-circle"></i> {new Date().getFullYear()} SiliconStock – Tutti i diritti riservati dal GRUPPO MIGLIORE
            </div>
        </footer>
    );
}
