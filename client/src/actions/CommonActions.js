export const SET_PRELOADER = 'SET_PRELOADER'

export function setPreloader(preloader) {
  return {
    type: SET_PRELOADER,
    payload: preloader,
  }
}