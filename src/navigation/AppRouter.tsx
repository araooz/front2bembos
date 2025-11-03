import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../features/login/page/LoginPage.tsx";

export default function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage/>} />
            </Routes>
        </Router>
    );
}