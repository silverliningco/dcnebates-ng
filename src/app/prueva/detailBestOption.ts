/* note: all the attributes that have type any, does have value null when received the payload */
export class BestDetail {
    constructor(
        // by procesing data
        public equalUnits?: Array<BestDetail>,
        public lengthEqualUnits?: number,
        public optionsIndoorsToSelect?: Array<string>,
        public optionsfurnaceUnitsToSelect?: Array<string>,

        // payload
        public EER?: number,
        public AFUE?: any,
        public HSPF?: number,
        public SEER?: number,
        public Hcap17?: number,
        public Hcap47?: number,
        public fuelTypes?: any,
        public components?: Array<jsonStructureSearch>,
        public equipmentTags?: any,
        public AHRIReferences?: Array<string>,
        public availableRebates?: Array<Rebate>,
        public furnaceInputBTUH?: any,
        public furnaceOutputBTUH?: any,
        public coolingCapacityRated?: number,
        public furnaceConfigurations?: any,
        public totalAvailableRebates?: number,
        public configurationOptions?: Array<jsonStructureSearch>,
       
        // future
        public accesories?:Array<Accesories>, 

    ) {}
}

export class jsonStructureSearch{
    constructor(
        public id?: string,
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