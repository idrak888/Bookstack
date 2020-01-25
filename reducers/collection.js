const initialState = {
    collection: []
}

export default (state = initialState, action) => {
    switch(action.type) {
        case 'UPDATE_COLLECTION':
            return {
                ...state,
                collection: action.updatedCollection
            }
        default: 
            return state;
    }
}