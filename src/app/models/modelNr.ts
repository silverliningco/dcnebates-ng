export class ModelNr {
    constructor(
        public furnaceUnits?:  Array<string>,
        public indoorUnits?: Array<string>,
        public outdoorUnits?:  Array<string>,
    ) {}
}

export class PostBodyNr {
    constructor(
        public searchType?:  any,
        public fuelSource?: any,
        public commerceInfo?:  any,
        public nominalSize?:  any,
        public systemTypeId?:  any,
        public filters?:  any,
        public requiredRebates?:  any,
        public outdoorUnit?:  any,
        public indoorUnit?:  any,
        public furnaceUnit?: any
    ) {}
}
