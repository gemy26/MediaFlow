export const AUTH_SERVICE = Symbol('AUTH_SERVICE');

export interface AuthenticatedIdentity {
  sealedSession: string;
  externalId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

export interface AuthServicePort {
  login(state?: string): string;
  authenticateWithCode(code: string): Promise<AuthenticatedIdentity>;
}
