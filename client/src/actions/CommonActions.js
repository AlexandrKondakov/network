export const SET_PRELOADER = 'SET_PRELOADER'
export const SET_INFORMER = 'SET_INFORMER'

export function setPreloader(preloader) {
  return {
    type: SET_PRELOADER,
    payload: preloader,
  }
}

export function setInformer(informerObj) {
  return {
    type: SET_INFORMER,
    payload: informerObj,
  }
}