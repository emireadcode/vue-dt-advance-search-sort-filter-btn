
export type YearSelectionType = {
  //page number
  [key: string]: {
    //row
    [key: string]: {
      //col
      [key: string]: {
        ref: HTMLLabelElement;
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        year: number,
        status: "ENABLE" | "DISABLE",
        selected: "SELECTED" | "DESELECTED" | "HIGHLIGHTED";
      };
    };
  };
};

export type MonthSelectionType = {
  [key: number]: {
    [key: number]: {
      ref: HTMLLabelElement;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      selected: "SELECTED" | "DESELECTED" | "HIGHLIGHTED";
      monthnumber: number,
      monthname: "Jan" | "Feb" | "Mar" | "Apr" | "May" | "Jun" | "Jul" | "Aug" | "Sep" | "Oct" | "Nov" | "Dec";
    };
  };
}

export type DaySelectionType = {
  [key: string]: {
    daynumber: number;
    selected: "SELECTED" | "DESELECTED" | "HIGHLIGHTED";
    name: "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";
    ref: HTMLLabelElement;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }
};

export type YearRangeFirstSelectionType = {
  page: number;
  year: number;
};

export type MonthRangeFirstSelectionType = {
  month: number;
}

export type DayRangeFirstSelectionType = {day: number;}

export type DuplicateCheckerObjectType = {
  [key: string]: string;
};

export type DaySelectionFormat = {
    format: "RANGE" | "MULTIPLE-OR-SINGLE";
    days: DaySelectionType | {};
};

export type MonthSelectionFormat = {
    format: "RANGE" | "MULTIPLE-OR-SINGLE";
    months: MonthSelectionType | {};
  };


export type YearSelectionFormat = {
    format: "RANGE" | "MULTIPLE-OR-SINGLE" | "GREATER-THAN" | "LESS-THAN";
    years: YearSelectionType | {};
  };