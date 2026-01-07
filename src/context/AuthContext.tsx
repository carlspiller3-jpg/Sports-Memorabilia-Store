
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const domain = import.meta.env.VITE_SHOPIFY_DOMAIN || '';
const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_ACCESS_TOKEN || '';

// Basic types (we can expand this later or import from schema if we had one for customer)
export interface CustomerProfile {
    firstName: string
    lastName: string
    email: string
    orders: any[]
    addresses: any[]
    defaultAddress: any
}

interface User {
    token: string
    email?: string
    firstName?: string
    lastName?: string
    profile?: CustomerProfile
}

interface AuthContextType {
    user: User | null
    login: (email: string, pass: string) => Promise<{ success: boolean, error?: string }>
    register: (first: string, last: string, email: string, pass: string) => Promise<{ success: boolean, error?: string }>
    logout: () => void
    isLoading: boolean
    refreshProfile: () => Promise<void>
    addAddress: (address: any) => Promise<boolean>
    deleteAddress: (id: string) => Promise<boolean>
    updateAddress: (id: string, address: any) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Hydrate from storage
        const token = localStorage.getItem('shopify_customer_token');
        if (token) {
            setUser({ token });
            // Fetch profile immediately
            fetchProfile(token);
        } else {
            setIsLoading(false);
        }
    }, []);

    const fetchProfile = async (token: string) => {
        const { CUSTOMER_QUERY } = await import('@/lib/shopify');
        const data = await shopifyFetch(CUSTOMER_QUERY, { customerAccessToken: token });

        if (data?.data?.customer) {
            const c = data.data.customer;
            setUser({
                token,
                profile: {
                    firstName: c.firstName,
                    lastName: c.lastName,
                    email: c.email,
                    defaultAddress: c.defaultAddress,
                    addresses: c.addresses?.edges?.map((e: any) => e.node) || [],
                    orders: c.orders?.edges?.map((e: any) => e.node) || []
                }
            });
        }
        setIsLoading(false);
    };

    const refreshProfile = async () => {
        if (user?.token) {
            await fetchProfile(user.token);
        }
    };

    async function shopifyFetch(query: string, variables: any = {}) {
        if (!domain || !storefrontAccessToken) {
            console.error('Shopify Auth Error: Missing Domain or Access Token in Environment Variables');
            return null;
        }

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
            setUser({ email, token });
            return { success: true };
        }

        const error = data?.data?.customerAccessTokenCreate?.customerUserErrors?.[0]?.message || 'Invalid email or password';
        return { success: false, error };
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
            return await login(email, pass);
        }

        if (data === null) {
            return { success: false, error: 'Shopify Configuration Error: Missing API keys in server environment.' };
        }

        const error = data?.data?.customerCreate?.customerUserErrors?.[0]?.message || 'Failed to create account. Please ensure your email is unique and password is at least 6 characters.';
        return { success: false, error };
    };

    const addAddress = async (address: any) => {
        if (!user?.token) return false;
        const { CUSTOMER_ADDRESS_CREATE } = await import('@/lib/shopify');
        const data = await shopifyFetch(CUSTOMER_ADDRESS_CREATE, {
            customerAccessToken: user.token,
            address
        });

        if (data?.data?.customerAddressCreate?.customerAddress?.id) {
            await refreshProfile();
            return true;
        }
        if (data?.data?.customerAddressCreate?.customerUserErrors?.length) {
            alert(data.data.customerAddressCreate.customerUserErrors[0].message);
        }
        return false;
    };

    const deleteAddress = async (id: string) => {
        if (!user?.token) return false;
        const { CUSTOMER_ADDRESS_DELETE } = await import('@/lib/shopify');
        const data = await shopifyFetch(CUSTOMER_ADDRESS_DELETE, {
            customerAccessToken: user.token,
            id
        });

        if (data?.data?.customerAddressDelete?.deletedCustomerAddressId) {
            await refreshProfile();
            return true;
        }
        return false;
    };

    const updateAddress = async (id: string, address: any) => {
        if (!user?.token) return false;
        const { CUSTOMER_ADDRESS_UPDATE } = await import('@/lib/shopify');
        const data = await shopifyFetch(CUSTOMER_ADDRESS_UPDATE, {
            customerAccessToken: user.token,
            id,
            address
        });

        if (data?.data?.customerAddressUpdate?.customerAddress?.id) {
            await refreshProfile();
            return true;
        }
        return false;
    };

    const logout = () => {
        localStorage.removeItem('shopify_customer_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isLoading, refreshProfile, addAddress, deleteAddress, updateAddress }}>
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
