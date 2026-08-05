import { Link, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function DefaultLayout() {
    return (
        <div className="app">
            <Navbar />
            <main className="content">

                <Outlet />

                <Link className="portfolio btn btn-outline-info" to={"https://portfolio-supabase.giacobelli-mattia12.workers.dev/projects/4"}>Portfolio</Link>

            </main>
            <Footer />
        </div>
    );
}
