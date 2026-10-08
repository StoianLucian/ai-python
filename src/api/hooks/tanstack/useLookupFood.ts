import { useMutation } from '@tanstack/react-query';
import { lookupFood, type ProductLookup } from '../../caloriesApi';

export function useLookupFood() {
    return useMutation<ProductLookup, any, string>({
        mutationFn: (name) => lookupFood(name),
    });
}
