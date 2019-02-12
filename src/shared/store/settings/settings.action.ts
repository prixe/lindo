import { action } from 'typesafe-actions';

export const SET_REMINDERS_ENABLED = 'SET_REMINDERS_ENABLED';
export const SET_REMINDERS_FROM_TIME = 'SET_REMINDERS_FROM_TIME';
export const SET_REMINDERS_TO_TIME = 'SET_REMINDERS_TO_TIME';
export const SET_REMINDERS_WEEKDAYS = 'SET_REMINDERS_WEEKDAYS';
export const SET_POMODORO_ENABLED = 'SET_POMODORO_ENABLED';
export const SET_GITHUB_ENABLED = 'SET_GITHUB_ENABLED';

export const setRemindersEnabled = (flag: boolean) => action(SET_REMINDERS_ENABLED, flag);

export const setRemindersFromTime = (time: string) => action(SET_REMINDERS_FROM_TIME, time);

export const setRemindersToTime = (time: string) => action(SET_REMINDERS_TO_TIME, time);

export const setRemindersWeekdays = (days: { [key: number]: boolean }) => action(SET_REMINDERS_WEEKDAYS, days);

export const setPomodoroEnabled = (flag: boolean) => action(SET_POMODORO_ENABLED, flag);

export const setGithubEnabled = (flag: boolean) => action(SET_GITHUB_ENABLED, flag);
