export class Criteria {
    constructor(
        public title: string,
        public completed: boolean    
    ) {}
  }
  
export class RebateTier {
    constructor(
    public rebateTierId: number,
    public title: string,
    public rebateTierCriteria?: Array<Criteria>,
    public indeterminate?: boolean,
    public completed?: boolean
    ) {}
}

  export class Rebate {
    constructor(
    public rebateId: number,
    public title: string,
    public rebateCriteria?: Array<Criteria>,
    public rebateTiers?: Array<RebateTier>,
    public indeterminate?: boolean,
    public completed?: boolean
    ) {}
  }