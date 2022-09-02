/* note: all the attributes that have type any, does have value null when received the payload */
export class BestDetail {
    constructor(

        // payload
        public EER?: number,
        public AFUE?: any,
        public HSPF?: number,
        public SEER?: number,
        public Hcap17?: number,
        public Hcap47?: number,
        public fuelTypes?: any,
        public components?: Array<ComponentDetail>,
        public equipmentTags?: any,
        public AHRIReferences?: Array<string>,
        public availableRebates?: Array<AvailableRebate>,
        public furnaceInputBTUH?: any,
        public furnaceOutputBTUH?: number,
        public coolingCapacityRated?: number,
        public furnaceConfigurations?: any,
        public totalAvailableRebates?: number,
        public configurationOptions?: Array<ComponentDetail>,
        // future
        public accesories?:Array<Accesories>, 
 
    ) {}
}
export class ComponentDetail{ 
    constructor(
    public id?: string,
    public SKU?: string,
    public name?: string,
    public type?: string
    ){}
}
  
export class Card{
    constructor(
        public active: BestDetail,
        public options: Array<BestDetail>,
        public indoorOptions?: Array<ComponentDetail>,
        public furnaceOptions?: Array<ComponentDetail>,
        public configurationOptions?: Array<ComponentDetail>
    ){}
}
  
export class AvailableRebate {
    constructor(
        public rebateId: number,
        public rebateTitle: string,
        public description: string,
        public amount: number,
        public links?: Array<any>,
        public rebateTierTitle?: string   
    ) {}
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
