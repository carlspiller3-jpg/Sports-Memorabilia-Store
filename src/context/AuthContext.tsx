
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const domain = import.meta.env.VITE_SHOPIFY_DOMAIN || '';
const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_ACCESS_TOKEN || '';

interface User {
    firstName?: string;
    lastName?: string;
    email?: string;
    token: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, pass: string) => Promise<boolean>;
    register: (first: string, last: string, email: string, pass: string) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Hydrate from storage
        const token = localStorage.getItem('shopify_customer_token');
        if (token) {
            // Start with just the token, ideally we'd fetch the user profile here too
            setUser({ token });
        }
        setIsLoading(false);
    }, []);

    async function shopifyFetch(query: string, variables: any = {}) {
        if (!domain || !storefrontAccessToken) return null;
        
        try {
            const res = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Storefront-Access-Token': storefrontAccessToken
                },
                body: JSON.stringify({ query, variables })
            });
            return await res.json();
        } catch (e) {
            console.error('Shopify Auth Error:', e);
            return null;
        }
    }

    const login = async (email: string, pass: string) => {
        const query = `
            mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
                customerAccessTokenCreate(input: $input) {
                    customerAccessToken {
                        accessToken
                        expiresAt
                    }
                    customerUserErrors {
                        message
                    }
                }
            }
        `;
        
        const data = await shopifyFetch(query, { input: { email, password: pass } });
        
        if (data?.data?.customerAccessTokenCreate?.customerAccessToken?.accessToken) {
            const token = data.data.customerAccessTokenCreate.customerAccessToken.accessToken;
            localStorage.setItem('shopify_customer_token', token);
            setUser({ email, token }); // We don't have name yet, but that's fine
            return true;
        }
        
        if (data?.data?.customerAccessTokenCreate?.customerUserErrors?.length) {
            alert(data.data.customerAccessTokenCreate.customerUserErrors[0].message);
        }
        return false;
    };

    const register = async (firstName: string, lastName: string, email: string, pass: string) => {
        const query = `
            mutation customerCreate($input: CustomerCreateInput!) {
                customerCreate(input: $input) {
                    customer {
                        id
                    }
                    customerUserErrors {
                        message
                    }
                }
            }
        `;

        const data = await shopifyFetch(query, { input: { firstName, lastName, email, password: pass } });

        if (data?.data?.customerCreate?.customer?.id) {
            // Auto login after register
            return await login(email, pass);
        }

        if (data?.data?.customerCreate?.customerUserErrors?.length) {
            alert(data.data.customerCreate.customerUserErrors[0].message);
        }
        return false;
    };

    const logout = () => {
        localStorage.removeItem('shopify_customer_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
