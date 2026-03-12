import { Outlet } from 'react-router-dom';
import { Navbar } from '../../components/ui/Navbar/Navbar';

export const MainLayout = () => {
    return (
        <div className="layout-container">
            {/* The Navbar will sit at the top of every page */}
            <Navbar />

            {/* The actual page content (Home, Profile, etc.) renders inside this Outlet */}
            <main className="content">
                <Outlet />
            </main>
        </div>
    );
};
