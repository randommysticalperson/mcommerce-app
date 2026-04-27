import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';

// Typed dispatch hook to use throughout the app
export const useAppDispatch = () => useDispatch<AppDispatch>();
