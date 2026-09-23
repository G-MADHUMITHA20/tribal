import { SchemeConfig } from '../types/scheme';

export type SchemeWindowState = 'NOT_STARTED' | 'OPEN' | 'CLOSING_SOON' | 'CLOSED';

export interface SchemeWindowStatus {
  state: SchemeWindowState;
  message: string;
  isOpen: boolean; // simple boolean for easy checks
}

export function getSchemeWindowStatus(scheme: SchemeConfig): SchemeWindowStatus {
  // If the scheme does not enforce deadlines by not setting applicationDeadline at all,
  // or it is a protected scheme that hasn't been modified.
  if (!scheme.applicationDeadline) {
    return {
      state: 'OPEN',
      message: 'Applications are currently open.',
      isOpen: true
    };
  }

  const now = new Date();
  const start = scheme.applicationStartDate ? new Date(scheme.applicationStartDate) : null;
  const deadline = new Date(scheme.applicationDeadline);

  // Normalizing times to midnight for date-only comparison since the input is 'YYYY-MM-DD'
  now.setHours(0, 0, 0, 0);
  if (start) start.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);

  if (start && now < start) {
    return {
      state: 'NOT_STARTED',
      message: `Applications open from ${start.toLocaleDateString('en-GB')}`,
      isOpen: false
    };
  }

  if (now > deadline) {
    return {
      state: 'CLOSED',
      message: 'Applications closed',
      isOpen: false
    };
  }

  // Calculate days remaining
  const timeDiff = deadline.getTime() - now.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  if (daysDiff <= 7) {
    return {
      state: 'CLOSING_SOON',
      message: `Applications close in ${daysDiff} day${daysDiff !== 1 ? 's' : ''}`,
      isOpen: true
    };
  }

  return {
    state: 'OPEN',
    message: `Applications open until ${deadline.toLocaleDateString('en-GB')}`,
    isOpen: true
  };
}
