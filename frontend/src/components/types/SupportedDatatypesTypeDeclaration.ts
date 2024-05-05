import type { DaySelectionType, MonthSelectionType, YearSelectionType } from './days_months_years_types';
import type { RangeSelectionParamsType, VisibleCalendarType } from './dd_mm_yy_types';

type StartModifierWildCardType = "@" | "+" | "*" | "(" | "#" | "/" | "{" | "(" | "[" | "[";

type StartModifierWildCardUnionType = `${StartModifierWildCardType}${StartModifierWildCardType}`;

type EndModifierWildCardType = "*" | ")" | "#" | "/" | "]" | "}";

type EndModifierWildCardUnionType = `${EndModifierWildCardType}${EndModifierWildCardType}`;
  
type DelimiterType = " - " | "-" | "/" | "." | " " | "*" | "" | '' | ', ' | ", " | '?' | '<' | '>' | '%' | '{' | '}' | '(' | ')' | '+' | '#' | '$' | '@' | '_' | '|' | '=' | '&';

type DelimiterUnionType = `${DelimiterType}${DelimiterType}`;

export interface IdentityType {
  info: {
    attribute: string;
    name: string;
    datatype: string;
  };
  checked: boolean;
  img: {
    ascclicked: string;
    descclicked: string;
    mixclicked: string;
  };
  sorttype: string;
  scroll: {
    areaid: string;
    pos: number;
  };
  result: {
    all: boolean;
    data: { row: string; checked: boolean; selected: boolean }[] | [];
    total: number;
    current: number;
    signal: number;
    max: string;
    min: string;
    totalselection: number;
  };
  loading: boolean;
  bottom: boolean;
}  
  
export interface YearType extends IdentityType {
  search: DateInnerType['days_months_years']['years'] & {
    trueorfalse: boolean;
  };
}

export type StringSearchType = {
  single: string;
  pages: string[][];
  enteredwheninpage: boolean;
  enteredwhennotinpage: boolean;
  signal: number;
  current: number;
  closepaste: number;
  deleting: boolean;
  bottom: boolean;
  loading: boolean;
  addloading: boolean;
  addeditemsref: HTMLDivElement[] | [];
  endoflistitemref: HTMLLIElement | undefined;
};

export type AtNumber<T> = {
  last: string;
  first: string;
  thenumberbeforethelast: {
    thenumberbefore: string;
    thelast: string;
  };
  afterthefirstthenext: {
    afterthefirst: string;
    thenext: string;
  };
  thematchfromthispattern: {
    thematch: string;
    fromthispattern: string;
  }[] | [];
  search: T & {
    atnumberformat: 'LAST' | 'FIRST' | 'THE-NUMBER-BEFORE-THE-LAST' | 'AFTER-THE-FIRST-THE-NEXT';
    exclude: {
        fromto: NumberSearchExcludeFromToType;
        equalto: NumberSearchExcludeEqualToType;
      };
  };
};

export type MultipleWordsStringConcatenatedFieldType = {
  [key: string]: {
    enableincludeandexcludesearch?: boolean | undefined;
    hasfixedlengthof?: number | undefined;
    enableatnumbersearch?: boolean | undefined;
    name: string;
    attribute?: string | undefined;
    table?: string | undefined;
    join?: string | undefined;
    search?: (StringSearchType & {
      tabclicked: boolean;
      include?: StringSearchType | undefined;
      exclude?: StringSearchType | undefined;
      openatnumbersearchwindow: boolean;
      openatnumbersearchexcludenumberwindow: boolean;
      includeorexcludestartswithcontainsendswithequaltoformat: 'STARTS-WITH' | 'CONTAINS' | 'ENDS-WITH' | 'EQUAL-TO';
      includeorexcludeformat: 'INCLUDE' | 'EXCLUDE' | '@NUMBER';
      atnumbersearch?: AtNumber<NumberSearchType> | undefined;
    }) | undefined;
  };
};

export type SingleWordStringConcatenatedFieldType = {
  [key: string]: {
    enableincludeandexcludesearch?: boolean | undefined;
    hasfixedlengthof?: number | undefined;
    enableatnumbersearch?: boolean | undefined;
    name: string;
    attribute?: string | undefined;
    table?: string | undefined;
    join?: string | undefined;
    search?: (StringSearchType & {
      tabclicked: boolean;
      include?: StringSearchType | undefined;
      exclude?: StringSearchType | undefined;
      openatnumbersearchwindow: boolean;
      openatnumbersearchexcludenumberwindow: boolean;
      includeorexcludestartswithcontainsendswithequaltoformat: 'STARTS-WITH' | 'CONTAINS' | 'ENDS-WITH' | 'EQUAL-TO';
      includeorexcludeformat: 'INCLUDE' | 'EXCLUDE' | '@NUMBER';
      atnumbersearch?: AtNumber<NumberSearchType> | undefined;
    }) | undefined;
    startmodifierwildcard?: StartModifierWildCardUnionType | StartModifierWildCardType | undefined;
    endmodifierwildcard?: EndModifierWildCardUnionType | EndModifierWildCardType | undefined;
  };
};

export type MultipleWordsStringConcatenatedType = {
  fields: MultipleWordsStringConcatenatedFieldType;
  delimiters: DelimiterType[] | DelimiterType | DelimiterUnionType[] | DelimiterUnionType | undefined;
};
  
export type SingleWordConcatenatedType = {
  fields: SingleWordStringConcatenatedFieldType;
  delimiters: DelimiterType[] | DelimiterType | DelimiterUnionType[] | DelimiterUnionType | undefined;
};

export interface MultipleWordsStringType extends IdentityType {
  concatenated?: MultipleWordsStringConcatenatedFieldType | undefined;
  enableincludeandexcludesearch?: boolean | undefined;
  hasfixedlengthof?: number | undefined;
  enableatnumbersearch?: boolean | undefined;
  search: {
    searchtype: 'SINGLE' | 'MULTIPLE';
    searchedornot: boolean;
    single: string;
    multiple: StringSearchType & {
      tabclicked: boolean;
      include?: StringSearchType | undefined;
      exclude?: StringSearchType | undefined;
      atnumbersearch?: AtNumber<NumberSearchType> | undefined;
      openatnumbersearchwindow: boolean;
      openatnumbersearchexcludenumberwindow: boolean;
      includeorexcludestartswithcontainsendswithequaltoformat: 'STARTS-WITH' | 'CONTAINS' | 'ENDS-WITH' | 'EQUAL-TO';
      includeorexcludeformat: 'INCLUDE' | 'EXCLUDE' | '@NUMBER';
    };
    trueorfalse: boolean;
  };
  searchFrom: "DOM" | "SERVER";
}

export interface SingleWordStringType extends IdentityType {
  concatenated?: SingleWordStringConcatenatedFieldType | undefined;
  enableincludeandexcludesearch?: boolean | undefined;
  hasfixedlengthof?: number | undefined;
  enableatnumbersearch?: boolean | undefined;
  search: {
    searchtype: 'SINGLE' | 'MULTIPLE';
    searchedornot: boolean;
    single: string;
    multiple: StringSearchType & {
      tabclicked: boolean;
      include?: StringSearchType | undefined;
      exclude?: StringSearchType | undefined;
      openatnumbersearchwindow: boolean;
      openatnumbersearchexcludenumberwindow: boolean;
      includeorexcludestartswithcontainsendswithequaltoformat: 'STARTS-WITH' | 'CONTAINS' | 'ENDS-WITH' | 'EQUAL-TO';
      includeorexcludeformat: 'INCLUDE' | 'EXCLUDE' | '@NUMBER';
      atnumbersearch?: AtNumber<NumberSearchType> | undefined;
    };
    trueorfalse: boolean;
  };
  searchFrom: "DOM" | "SERVER";
}

export interface NumberStringType extends SingleWordStringType {}

export type JSONObjectAndScalarType = {
  [key: string]: JSONObjectAndScalarType;
} | {[key: string]: string | number | boolean};

export type KeyToNameMappingType = {
  keytonamemapping: {
    [key: string]: string
  };
};
  
export interface KeyToNameType extends IdentityType, KeyToNameMappingType {
  search: {
    trueorfalse: boolean;
  };
}
  
export type DateInnerType = {
  format: "DD/MM/YYYY" | "Day(s), Month(s), Year(s)";
  dd_mm_yyyy:
    | {
        format: "RANGE" | "MULTIPLE-OR-SINGLE";
        rangeselectionparams?: RangeSelectionParamsType,
        dates:
          | VisibleCalendarType['selections']
          | {};
      };
  days_months_years:
    | {
        days: {
          format: "RANGE" | "MULTIPLE-OR-SINGLE";
          days: DaySelectionType | {};
        };
        months: {
          format: "RANGE" | "MULTIPLE-OR-SINGLE";
          months: MonthSelectionType | {};
        };
        years: {
          format: "RANGE" | "MULTIPLE-OR-SINGLE" | "GREATER-THAN" | "LESS-THAN";
          greaterthan?: string | undefined;
          lessthan?: string | undefined;
          years: YearSelectionType | {};
        };
        dates:
          | VisibleCalendarType['selections']
          | {};
      };
};
  
export interface TimeType extends IdentityType {
  search: {
    from_to_time: string[]; //[from, to] always in range
    trueorfalse: boolean;
  };
  searchFrom: "DOM" | "SERVER";
  timeFormat: TimeFormat["timeFormat"];
}
  
export interface DateType extends IdentityType {
  search: DateInnerType & {
    trueorfalse: boolean;
  };
  dateFormat: DateFormat["dateFormat"];
  searchFrom: "DOM" | "SERVER";
  isoweek: boolean;
}

export interface DateTimeType extends IdentityType, TimeType, DateType {
  search: DateType['search'] & TimeType['search'];
}

export type NumberSearchType = {
  tab: "GREATER-THAN" | "LESS-THAN" | "EQUAL-TO" | "NOT-EQUAL-TO" | "FROM-TO";
  greaterthan: string;
  lessthan: string;
  equalto: NumberSearchExcludeEqualToType;
  notequalto: NumberSearchExcludeEqualToType;
  fromto: {
    from: string;
    to: string;
  };
};

export type NumberSearchExcludeFromToType = {
  singlefrom: string;
  singleto: string;
  shake: boolean[];
  loading: boolean;
  addloading: boolean;
  show: boolean[];
  bottom: boolean;
  pages: [string, string][][];
  enteredwheninpage: boolean;
  enteredwhennotinpage: boolean;
  signal: number;
  current: number;
  closepaste: number;
  deleting: boolean;
  addeditemsref: HTMLDivElement[] | [];
  inneraddeditemsref: HTMLDivElement[] | [];
  endoflistitemref: HTMLLIElement | undefined;
};

export type NumberSearchExcludeEqualToType = {
  single: string;
  loading: boolean;
  addloading: boolean;
  shake: boolean[];
  show: boolean[];
  bottom: boolean;
  pages: string[][];
  enteredwheninpage: boolean;
  enteredwhennotinpage: boolean;
  signal: number;
  current: number;
  closepaste: number;
  deleting: boolean;
  addeditemsref: HTMLDivElement[] | [];
  inneraddeditemsref: HTMLDivElement[] | [];
  endoflistitemref: HTMLLIElement | undefined;
};

export interface NumberType extends IdentityType {
  search: {
    trueorfalse: boolean;
    searchtype: 'SINGLE' | 'MULTIPLE';
    searchedornot: boolean;
    single: string;
    multiple: NumberSearchType & {
      exclude: {
        fromto: NumberSearchExcludeFromToType;
        equalto: NumberSearchExcludeEqualToType;
      };
    };
  };
  searchFrom: "DOM" | "SERVER";
}
  
export type CardInnerType = {
  position?: number | undefined;
  name: string;
  attribute?: string | undefined;
  limit: number;
  table?: string | undefined;
  join?: string | undefined;
};

export type CardType<T> = 
{
  jsontypes?: T[] | undefined;
  multiplewordsstringtypes?:
    | (T & { 
      concatenated?: MultipleWordsStringConcatenatedType | undefined; 
      enableincludeandexcludesearch?: boolean | undefined; 
      hasfixedlengthof?: number | undefined;
      enableatnumbersearch?: boolean | undefined;
    })[]
    | undefined;
  datetypes?: (T & DateFormat & { isoweek: boolean; })[] | undefined;
  numbertypes?: T[] | undefined;
  keytonamemappingtypes?: (T & KeyToNameMappingType)[] | undefined;
  datetimetypes?: (T & DateFormat & TimeFormat & { isoweek: boolean; })[] | undefined;
  timetypes?: (T & TimeFormat)[] | undefined;
  singlewordstringtypes?:
    | (T & {
        concatenated?: SingleWordConcatenatedType | undefined;
        enableincludeandexcludesearch?: boolean | undefined;
        hasfixedlengthof?: number | undefined;
        enableatnumbersearch?: boolean | undefined;
      })[]
    | undefined;
  numberstringtypes?:
    | (T & {
        concatenated?: SingleWordConcatenatedType | undefined;
        enableincludeandexcludesearch?: boolean | undefined;
        hasfixedlengthof?: number | undefined;
        enableatnumbersearch?: boolean | undefined;
      })[]
    | undefined;
  yeartypes?: T[] | undefined;
};

export type DistinctRecordType = { 
  [x: string]: { 
    min?: string | number | null;
    max?: string | number | null;
    data: {
      row: string | number | null;
      checked: boolean;
      selected: boolean;
    }[] | [];
    total: number;
    offset: number;
  }; 
} | undefined;

export type PrimitiveType =
  | YearType
  | DateType
  | DateTimeType
  | TimeType
  | NumberType
  | MultipleWordsStringType
  | SingleWordStringType
  | NumberStringType
  | KeyToNameType;
  
export type DateFormat = {
  dateFormat:
  | "yyyy/mm/dd"
  | "yyyy/mm/d"
  | "yyyy/m/dd"
  | "yyyy/m/d"
  | "yyyy mmmm dd"
  | "yyyy mmmm d"
  | "yyyy mmm dd"
  | "yyyy mmm d"
  | "ddd, yyyy mmmm dd"
  | "ddd, yyyy mmmm d"
  | "ddd, yyyy mmm dd"
  | "ddd, yyyy mmm d"
  | "dddd, yyyy mmmm dd"
  | "dddd, yyyy mmmm d"
  | "dddd, yyyy mmm dd"
  | "dddd, yyyy mmm d"
  | "dddd yyyy mmmm dd"
  | "dddd yyyy mmmm d"
  | "dddd yyyy mmm dd"
  | "dddd yyyy mmm d"
  | "yyyy.mm.dd"
  | "yyyy.mm.d"
  | "yyyy.m.dd"
  | "yyyy.m.d"
  | "yyyy. mm. dd"
  | "yyyy. mm. d"
  | "yyyy. m. dd"
  | "yyyy. m. d"
  | "yyyy-mm-dd"
  | "yyyy-mm-d"
  | "yyyy-m-dd"
  | "yyyy-m-d"
  //little-endian (day, month, year)
  | "dd/mm/yyyy"
  | "dd/m/yyyy"
  | "d/mm/yyyy"
  | "d/m/yyyy"
  | "d/m yyyy"
  | "dd mmm yyyy"
  | "d mmm yyyy"
  | "dd mmmm yyyy"
  | "d mmmm yyyy"
  | "dd mmm, yyyy"
  | "d mmm, yyyy"
  | "dd mmmm, yyyy"
  | "d mmmm, yyyy"
  | "dddd, dd mmmm yyyy"
  | "dddd, d mmmm yyyy"
  | "dddd, dd mmm yyyy"
  | "dddd, d mmm yyyy"
  | "ddd, dd mmmm yyyy"
  | "ddd, d mmmm yyyy"
  | "ddd, dd mmm yyyy"
  | "ddd, d mmm yyyy"
  | "dddd, dd mmmm, yyyy"
  | "dddd, d mmmm, yyyy"
  | "dddd, dd mmm, yyyy"
  | "dddd, d mmm, yyyy"
  | "ddd, dd mmmm, yyyy"
  | "ddd, d mmmm, yyyy"
  | "ddd, dd mmm, yyyy"
  | "ddd, d mmm, yyyy"
  | "dddd dd mmmm yyyy"
  | "dddd d mmmm yyyy"
  | "dddd dd mmm yyyy"
  | "dddd d mmm yyyy"
  | "ddd dd mmmm yyyy"
  | "ddd d mmmm yyyy"
  | "ddd dd mmm yyyy"
  | "ddd d mmm yyyy"
  | "dddd dd mmmm, yyyy"
  | "dddd d mmmm, yyyy"
  | "dddd dd mmm, yyyy"
  | "dddd d mmm, yyyy"
  | "ddd dd mmmm, yyyy"
  | "ddd d mmmm, yyyy"
  | "ddd dd mmm, yyyy"
  | "ddd d mmm, yyyy"
  | "dd.mm.yyyy"
  | "d.mm.yyyy"
  | "dd.m.yyyy"
  | "d.m.yyyy"
  | "dd. mm. yyyy"
  | "d. mm. yyyy"
  | "dd. m. yyyy"
  | "d. m. yyyy"
  | "d. mmmm yyyy"
  | "d. mmm yyyy"
  | "dd. mmmm yyyy"
  | "dd. mmm yyyy"
  | "dd-mm-yyyy"
  | "dd-m-yyyy"
  | "d-mm-yyyy"
  | "d-m-yyyy"
  //middle-endian (month, day, year)
  | "mm/dd/yyyy"
  | "mm/d/yyyy"
  | "m/dd/yyyy"
  | "m/d/yyyy"
  | "mmmm/dd/yyyy"
  | "mmmm/d/yyyy"
  | "mmm/dd/yyyy"
  | "mmm/d/yyyy"
  | "mm.dd.yyyy"
  | "mm.d.yyyy"
  | "m.dd.yyyy"
  | "m.d.yyyy"
  | "mm. dd. yyyy"
  | "mm. d. yyyy"
  | "m. dd. yyyy"
  | "m. d. yyyy"
  | "dddd mmmm dd yyyy"
  | "dddd mmmm d yyyy"
  | "dddd mmm dd yyyy"
  | "dddd mmm d yyyy"
  | "ddd mmmm dd yyyy"
  | "ddd mmmm d yyyy"
  | "ddd mmm dd yyyy"
  | "ddd mmm d yyyy"
  | "dddd, mmmm dd yyyy"
  | "dddd, mmmm d yyyy"
  | "dddd, mmm dd yyyy"
  | "dddd, mmm d yyyy"
  | "ddd, mmmm dd yyyy"
  | "ddd, mmmm d yyyy"
  | "ddd, mmm dd yyyy"
  | "ddd, mmm d yyyy"
  | "dddd, mmmm dd, yyyy"
  | "dddd, mmmm d, yyyy"
  | "dddd, mmm dd, yyyy"
  | "dddd, mmm d, yyyy"
  | "ddd, mmmm dd, yyyy"
  | "ddd, mmmm d, yyyy"
  | "ddd, mmm dd, yyyy"
  | "ddd, mmm d, yyyy"
  | "mmmm dd, yyyy"
  | "mmmm d, yyyy"
  | "mmm dd, yyyy"
  | "mmm d, yyyy"
  | "mm-dd-yyyy"
  | "mm-d-yyyy"
  | "m-dd-yyyy"
  | "m-d-yyyy"
  | "mmmm-dd-yyyy"
  | "mmmm-d-yyyy"
  | "mmm-dd-yyyy"
  | "mmm-d-yyyy";
};
  
export type TimeFormat = {
  timeFormat:
    | "24-HCWOSWLZ"
    | "24-HCWOSWOLZ"
    | "12-HCWOSWLZ"
    | "12-HCWOSWOLZ"
    | "24-HCWS"
    | "12-HCWS";
};