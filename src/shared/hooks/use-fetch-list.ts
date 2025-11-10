import { useEffect, useState } from "react";

export const useFetchList = <Q extends object, T extends object> (entity: string, query: Q) => {

    const [data, setData] = useState<T[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    
    useEffect(() => {
        const fetchData = async () => {
            try {

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [entity, query]);

    const addToList = (newObject: T) =>{
        setData(prevData => [...prevData, newObject]);
    }
    return {
        data,
        totalPages,
        addToList
    };
}