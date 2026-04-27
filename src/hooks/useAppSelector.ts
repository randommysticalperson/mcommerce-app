import { useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '../store';

// Typed selector hook to use throughout the app
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
