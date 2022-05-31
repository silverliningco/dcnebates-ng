
  
/*  defaultTier = true is for selected the TierCriteria with the most benefits by default */
export class RebateTier {
    constructor(
    public rebateTierId: number,
    public title: string,
    public completed?: boolean,
    public defaultTier?: boolean,
    public notes?: string
    ) {}
}

  export class Rebate {
    constructor(
    public rebateId: number,
    public title: string,
    public rebateType: string,
    public notes: string,
    public rebateTiers?: Array<RebateTier>,
    public completed?: boolean
    ) {}
  }