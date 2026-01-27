import useSWR from "swr";
import { fetcher } from "../fetcher";

// Fetch all branch configurations
const useBranchConfigs = () => {
    const key = "/api/branch-config";
    const { data, error, isLoading, mutate } = useSWR(key, fetcher);

    return {
        data: data?.data || [],
        error,
        isLoading,
        mutate,
    };
};

// Fetch specific branch configuration
const useBranchConfig = (branchCode) => {
    const key = branchCode ? `/api/branch-config?branch=${branchCode}` : null;
    const { data, error, isLoading, mutate } = useSWR(key, fetcher);

    return {
        data: data?.data || null,
        error,
        isLoading,
        mutate,
    };
};

export { useBranchConfigs, useBranchConfig };
