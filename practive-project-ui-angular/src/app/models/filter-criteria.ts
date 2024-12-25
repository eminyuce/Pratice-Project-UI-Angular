export interface FilterCriteria {
  field: string;
  operator: string;
  value: string;
  createdDateStart?: Date;
  createdDateEnd?: Date;
}