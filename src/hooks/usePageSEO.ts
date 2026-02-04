import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface SEOData {
    title: string
    description: string
    ogImage: string
}

export function usePageSEO(
    pageKey: string,
    defaultSEO: SEOData
) {
    const [seo, setSeo] = useState<SEOData>(defaultSEO)

    useEffect(() => {
        let isMounted = true

        async function fetchSEO() {
            // Using maybeSingle() because it's okay if it doesn't exist yet, we stick to defaults
            const { data, error } = await supabase
                .from('site_pages')
                .select('meta_title, meta_description, og_image')
                .eq('page_key', pageKey)
                .maybeSingle()

            if (error) {
                console.warn(`Error fetching SEO for ${pageKey}:`, error)
                return
            }

            if (data && isMounted) {
                setSeo({
                    title: data.meta_title || defaultSEO.title,
                    description: data.meta_description || defaultSEO.description,
                    ogImage: data.og_image || defaultSEO.ogImage
                })
            }
        }

        fetchSEO()

        return () => {
            isMounted = false
        }
    }, [pageKey])

    return seo
}
