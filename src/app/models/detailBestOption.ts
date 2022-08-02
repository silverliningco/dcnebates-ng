/* note: all the attributes that have type any, does have value null when received the payload */
export class BestDetail {
    constructor(
        public outdoorUnit?: string,
        public indoorUnit?: string,
        public furnaceUnit?: string,

        public indoorUnits?: Array<string>,
        public furnaceUnits?: Array<string>,

        public name?: string,
        public availablerebates?: Array<Rebate>,
        public EER?: number,
        public AFUE?: any,
        public HSPF?: number,
        public SEER?: number,
        public names?: Array<string>,
        public Hcap17?: number,
        public Hcap47?: number,
        public fuelTypes?: any,
        public furnaceInputBTUH?: any,
        public furnaceOutputBTUH?: any,
        public coolingCapacityRated?: number,
        public furnaceConfigurations?: any,
        public totalAvailableRebates?: number,
        public accesories?:Array<Accesories>,
        public components?: Array<Component>
    ) {}
}

export class Component{
    constructor(
        public SKU?: string,
        public name?: string,
        public type?: string
    ){}
}

export class Accesories{
    constructor(
        public title?: string,
        public amount?: number
    ){}
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