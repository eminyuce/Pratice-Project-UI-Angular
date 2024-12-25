import { SearchCriteria } from './search-criteria.model';


export interface AcquUserEntitySearchParams {

    criteriaList: SearchCriteria[];
  
    createdFrom?: Date | null;
  
    createdTo?: Date | null;
  
    updatedFrom?: Date | null;
  
    updatedTo?: Date | null;
  
  }
  