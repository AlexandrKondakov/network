export const SET_INFORMER = 'SET_INFORMER'
export const SET_CONTACTS_LOADING_STATE = 'SET_CONTACTS_LOADING_STATE'

export function setInformer(informerObj) {
  return {
    type: SET_INFORMER,
    payload: informerObj,
  }
}

export function setContactsLoadingState(isLoading) {
  return {
    type: SET_CONTACTS_LOADING_STATE,
    payload: isLoading,
  }
}