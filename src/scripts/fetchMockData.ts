/**
 * Sleep for 2.5 seconds then return toy data.
 */
export default async function(target: "BAR" | "LINE"): Promise<{
    labels: string[];
    datasets: { data: number[]; label?: string; backgroundColor?: string; borderColor?: string }[];
}> {
    if (target == "BAR") {
        await sleep(1500);
        return {
            labels: ["January", "February", "March"],
            datasets: [
                {
                    label: "Data One",
                    data: [40, 20, 12],
                    backgroundColor: "#f87979",
                },
            ],
        };
    }
    else {
        await sleep(1500);
        return {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
                {
                    label: "Data One",
                    data: [40, 39, 10, 40, 39, 80, 40],
                    backgroundColor: "#f87979",
                    borderColor: "cyan"
                },
            ],
        };
    }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
