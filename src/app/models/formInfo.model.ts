export class FormInfo {
    constructor(
        public rebateIds?: any,
        public heated?: boolean,
        public cooled?: boolean,
        public storeId?: number,
        public country?: string,
        public electricUtilityId?: number,
        public gasOilUtilityId?: number,
        public state?: string,
        public showAllResults?: boolean,
        public fuelSource?: string,
        public nominalSize?: any,
        public eligibilityDetail?: any,
        public productLine?: number,
        public systemTypeId?: number,
        public matchFilters?: any,
        public rangeFilters?: any,
        
    ) {}
}