import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TriagePage } from '@/pages/TriagePage';
import { ActionCenterPage } from '@/pages/ActionCenterPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TriagePage />} />
        <Route path="/student/:studentId" element={<ActionCenterPage />} />
      </Routes>
    </BrowserRouter>
  );
}