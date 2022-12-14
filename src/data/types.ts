export type ParameterArgs = {
    name: string;
    label: string;
    value: number;
    min?: number;
    max?: number;
    step: number;
};

export type Parameter = Required<ParameterArgs>;

type dataModel = {
    name: string;
    label: string;
    parameters: Parameter[];
};

export type Model = dataModel;
export type Policy = dataModel;
export type Options = dataModel;

export interface Series {
    data: number[];
    label?: string;
    backgroundColor?: string;
}

export interface ChartData {
    labels: string[];
    datasets: Series[];
}
