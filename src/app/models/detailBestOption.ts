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
    public type?: string,
    public desable?: boolean
    ){}
}

export class OptionsbyType{ 
    constructor(
    public nameOption?: string,
    public options?:  Array<ComponentDetail> 
    ){}
}
  
export class Card{
    constructor(
        public active: BestDetail,
        public bestOption: BestDetail,
        public showResetCard: boolean,
        public options: Array<BestDetail>,
        public allOptions: Array<OptionsbyType>,
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