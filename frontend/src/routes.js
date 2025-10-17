import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import AllBooks from './pages/AllBooks';
import BookDetail from './pages/BookDetail';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import CategoryPage from './pages/CategoryPage';
import AdminDashboard from './pages/AdminDashboard';
import Wishlist from './pages/Wishlist';
import AuthModal from './components/AuthModal'; 
import BookDetails from './pages/BookDetail';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books" element={<AllBooks />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/categories" element={<CategoryPage />} />
        <Route path="/books?action=true" element={<AllBooks />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/reset-password/:token" element={<AuthModal />} />
        <Route path="/admin/book/:id" element={<BookDetail adminView={true} />} />
      </Routes>
    </BrowserRouter>
  );
}