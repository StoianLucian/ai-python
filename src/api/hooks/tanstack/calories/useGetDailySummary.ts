import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../../enums/queryKeys";
import {
  getDailySummary,
  type DailySummary,
  type DailySummaryFilters,
} from "../../../caloriesApi";

// Daily calorie/exercise summary for the logged-in user. Pass no filters for
// today, `{ day }` for a single day, or `{ start, end }` for a range.
const useGetDailySummary = (filters: DailySummaryFilters = {}) => {
  return useQuery<DailySummary, any>({
    queryFn: () => getDailySummary(filters),
    queryKey: queryKeys.dailySummary(filters),
    placeholderData: keepPreviousData,
  });
};

export default useGetDailySummary;
