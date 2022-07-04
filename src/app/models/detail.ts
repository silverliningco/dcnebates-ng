/* note: all the attributes that have type any, does have value null when received the payload */
export class Detail {
    constructor(
        public AFUE?: any,
        public AHRIReferences?: Array<string>,
        public EER?: number,
        public HSPF?: number,
        public Hcap17?: number,
        public Hcap47?: number,
        public SEER?: number,
        public SKUs?: Array<string>,
        public availableRebateAmount?: number,
        public availableRebates?: Array<Rebate>,
        public coolingCapacityRated?: number,
        public fuelTypes?: any,
        public furnaceConfigurations?: any,
        public furnaceInputBTUH?: any,
        public furnaceOutputBTUH?: any,
        public furnaceSKU?: any,
        public indoorUnitSKU?: string,
        public names?: Array<string>,
        public outdoorUnitSKU?: string
    ) {}
}

export class Rebate {
    constructor(
        public links?: Array<Links>,
        public amount?: number,
        public rebateId?: number,
        public description?: string,
        public rebateTitle?: string,
        public rebateTierTitle?: string
    ) {}
}

export class Links {
    constructor(
        public url?: string,
        public title?: string
    ) {}
}