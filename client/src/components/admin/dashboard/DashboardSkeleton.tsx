
import { Skeleton } from "@/components/ui/Skeleton";

export function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-md dark:border-gray-800 dark:bg-gray-900 sm:p-6">
                        <div className="flex items-end justify-between">
                            <div className="w-full">
                                <Skeleton className="h-4 w-24 mb-2" />
                                <Skeleton className="h-8 w-16 mb-2" />
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-3 w-12" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            </div>
                            <Skeleton className="h-11 w-11 rounded-xl" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
                <div className="col-span-12 xl:col-span-8">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-md dark:border-gray-800 dark:bg-gray-900 sm:p-6 h-[400px]">
                        <Skeleton className="h-6 w-32 mb-6" />
                        <Skeleton className="h-[300px] w-full" />
                    </div>
                </div>
                <div className="col-span-12 xl:col-span-4">
                    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-5 shadow-theme-md dark:border-gray-800 dark:bg-gray-900 sm:px-6 sm:pt-6 h-[400px] flex flex-col">
                        <Skeleton className="h-6 w-32 mb-6" />
                        <div className="space-y-4 flex-1">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                                    <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-3 w-2/3" />
                                    </div>
                                    <Skeleton className="h-3 w-10" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
                <div className="lg:col-span-2">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-md dark:border-gray-800 dark:bg-gray-900 sm:p-6 h-[350px]">
                        <Skeleton className="h-6 w-32 mb-6" />
                        <Skeleton className="h-[250px] w-full" />
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-5 shadow-theme-md dark:border-gray-800 dark:bg-gray-900 sm:px-6 sm:pt-6">
                    <Skeleton className="h-6 w-32 mb-4" />
                    <Skeleton className="h-4 w-24 mb-6" />
                    <Skeleton className="h-4 w-full mb-6" />

                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center">
                                        <Skeleton className="w-2 h-2 rounded-full mr-2" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                    <Skeleton className="h-3 w-10" />
                                </div>
                                <Skeleton className="h-1.5 w-full rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
