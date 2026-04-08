import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { IdeaCreatePage } from './pages/IdeaCreatePage';
import { IdeaDetailPage } from './pages/IdeaDetailPage';
import { IdeaEditPage } from './pages/IdeaEditPage';
import { IdeaListPage } from './pages/IdeaListPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/ideas" replace />} />
        <Route path="/ideas" element={<IdeaListPage />} />
        <Route path="/ideas/new" element={<IdeaCreatePage />} />
        <Route path="/ideas/:id" element={<IdeaDetailPage />} />
        <Route path="/ideas/:id/edit" element={<IdeaEditPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppLayout>
  );
}
