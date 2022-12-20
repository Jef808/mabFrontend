export type Parameter = {
    name: string;
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
};

type DataModel = {
    name: string;
    label: string;
    parameters: Parameter[];
};

export type Model = DataModel;
export type Policy = DataModel;
export type Options = DataModel;
export type Category = "model" | "policy" | "options"

export interface Series {
    data: number[];
    label?: string;
    backgroundColor?: string;
}

export interface ChartData {
    labels: string[];
    datasets: Series[];
}

export interface DataQuery {
    model: {
        name: string,
        parameters: { name: string, value: number }[]
    },
    policy: {
        name: string,
        parameters: { name: string, value: number }[]
    },
    options: { name: string, value: number }[]
};
