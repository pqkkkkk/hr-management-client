import { useCallback, useRef, useState, useEffect } from "react"


export const useQuery = <T extends object>(initialQuery: T) => {

    const [query, setQuery] = useState<T>(initialQuery);

    const initialQueryRef = useRef<T>(initialQuery);

    const updateQuery = useCallback((newQuery: Partial<T>) =>{
        setQuery(prevQuery => ({
            ...prevQuery,
            ...newQuery
        }));
    }, []);

    const resetQuery = useCallback(() =>{
        setQuery(initialQueryRef.current);
    }, []);

    return {
        query,
        updateQuery,
        resetQuery
    };
}