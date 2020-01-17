
export interface CalendarTheme {
  dateCell?: string,
  dateCellActive?: string,
  dateCellDayOff?: string,
  dateCellDifferentMonth?: string,
  dateCellDisabled?: string,
  dateCellSelected?: string,
  dateCellToday?: string,
  dateRow?: string,
  dateView?: string,
  footer?: string,
  header?: string,
  monthCell?: string,
  monthCellActive?: string,
  monthCellDisabled?: string,
  monthRow?: string,
  monthView?: string,
  buttonDisabled?: string,
  nextButton?: string,
  nextIcon?: string,
  prevButton?: string,
  prevIcon?: string,
  title?: string,
  titleDisabled?: string,
  weekDaysRow?: string,
  wrapper?: string,
  yearCell?: string,
  yearCellActive?: string,
  yearCellDisabled?: string,
  yearCellDifferentDecade?: string,
  yearRow?: string,
  yearView?: string,
}

/* eslint-disable key-spacing */
export const defaultTheme = {
  dateCell:               'calendar-date-cell',
  dateCellActive:         'active',
  dateCellDayOff:         'day-off',
  dateCellDifferentMonth: 'different-month-date',
  dateCellDisabled:       'disabled-date',
  dateCellSelected:       'selected',
  dateCellToday:          'today',
  dateRow:                'calendar-dates-row',
  dateView:               'calendar-month-dates',
  footer:                 'calendar-footer',
  header:                 'calendar-nav',
  monthCell:              'calendar-month-year-cell',
  monthCellActive:        'active',
  monthCellDisabled:      'disabled-month-year',
  monthRow:               'calendar-month-year-row',
  monthView:              'calendar-month-year-view',
  nextButton:             'calendar-next-button',
  buttonDisabled:         'disabled-button',
  nextIcon:               'calendar-next-icon',
  prevButton:             'calendar-prev-button',
  prevIcon:               'calendar-prev-icon',
  title:                  'calendar-title',
  titleDisabled:          'disabled-title',
  weekDaysRow:            'calendar-week-days',
  wrapper:                'calendar-wrapper',
  yearCell:               'calendar-month-year-cell',
  yearCellActive:         'active',
  yearCellDisabled:       'disabled-month-year',
  yearCellDifferentDecade:'different-year',
  yearRow:                'calendar-month-year-row',
  yearView:               'calendar-month-year-view',
};
/* eslint-enable key-spacing */