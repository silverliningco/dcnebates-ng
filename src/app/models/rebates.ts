/* used for both rebateCriteria and TierCriteria*/
export class Criteria {
    constructor(
        public title: string,
        public completed: boolean    
    ) {}
  }
  
/*  defaultTier = true is for selected the TierCriteria with the most benefits by default */
export class RebateTier {
    constructor(
    public rebateTierId: number,
    public title: string,
    public rebateTierCriteria?: Array<Criteria>,
    public completed?: boolean,
    public defaultTier?: boolean,
    ) {}
}

  export class Rebate {
    constructor(
    public rebateId: number,
    public title: string,
    public rebateCriteria?: Array<Criteria>,
    public rebateTiers?: Array<RebateTier>,
    public completed?: boolean
    ) {}
  }