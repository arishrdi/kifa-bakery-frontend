import { createMutationHook, createQueryHook } from '@/lib/query-hooks';
import type { LoginCredentials, AuthResponse, User, ProfileResponse } from '@/types/auth';

export const loginUser = createMutationHook<LoginCredentials, AuthResponse>('/login');
export const logOutUser = createMutationHook<void, void>('/logout', 'post');

export const getUser = createQueryHook<ProfileResponse, void>('/me', ['me']);