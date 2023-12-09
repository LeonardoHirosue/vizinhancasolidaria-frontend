import { UseQueryOptions, useQuery } from "react-query";
import { api } from "../apiClient";


type Street = {
    id: string;
    postal_code: string;
    state: string;
    city: string;
    district: string;
    name: string;
}

export async function getStreets(): Promise<Street[]> {
    const { data } = await api.get('streets');

    return data.map((street: Street) => {
        return {
            id: street.id,
            postal_code: street.postal_code,
            state: street.state,
            city: street.city,
            district: street.district,
            name: street.name,
        }
    })
}

export function useStreets() {
    return useQuery('streets', getStreets, {
        staleTime:1000*60*10,
    })
}