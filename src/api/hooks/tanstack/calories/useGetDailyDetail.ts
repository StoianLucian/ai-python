import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../../enums/queryKeys";
import { getDailyDetail, type DailyDetail } from "../../../caloriesApi";

// Foods + exercises for a single day, fetched on demand when a day is selected
// in the table/chart. Disabled until a day is provided.
const useGetDailyDetail = (day: string | null) => {
  return useQuery<DailyDetail, any>({
    queryFn: () => getDailyDetail(day as string),
    queryKey: queryKeys.dailyDetail(day ?? ""),
    enabled: !!day,
    // Keep the previous day's detail visible while a newly clicked day loads,
    // so the stats/summary cards don't blank out and shift the layout.
    placeholderData: keepPreviousData,
  });
};

export default useGetDailyDetail;
