export class resultsSearch {
    constructor(
        public outdoorUnit?: Array<componentDetail>,
        public combinations?: Array<resultsDetail>,
    ) {}
}

export class resultsDetail {
    constructor(
        public indoorUnit?: Array<componentDetail>,
        public furnaceUnit?: Array<componentDetail>,
        public EER?: number,
        public AFUE?: any,
        public HSPF?: number,
        public SEER?: number,
        public Hcap17?: number,
        public Hcap47?: number,
        public fuelTypes?: Array<string>,
        public AHRIReferences?: Array<string>,
        public furnaceInputBTUH?: number,
        public furnaceOutputBTUH?: number,
        public coolingCapacityRated?: number,
        public furnaceConfigurations?: Array<string>,
        public totalAvailableRebates?: number
    ) {}
}

export class componentDetail {
    constructor(
        public SKU?: string,
        public name?: string,
        public type?: string
    ) {}
}
