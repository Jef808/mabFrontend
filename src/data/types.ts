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
export type Category = "model" | "policy" | "options";

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
    modelName: string;
    modelParameters: [{
        [name: string]: number;
    }];
    policyName: string;
    policyParameters: [{
        [name: string]: number;
    }];
    options: [{
        [name: string]: number;
    }];
}

export interface QueryResult {
    id: string;
    data: {
        name: string;
        values: [number, number];
        }[];
}

export type WithId<T> = T & { id: string };
