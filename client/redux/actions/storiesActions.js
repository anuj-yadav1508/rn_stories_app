import axios from "axios";

export const FAVOURITETOGGLE = 'FAVOURITETOGGLE';
export const CREATESTORY = 'CREATESTORY';
export const UPDATESTORY = 'UPDATESTORY';
export const DELETESTORY = 'DELETESTORY';
export const SETSTORIES = 'SETSTORIES';
export const SETFAVOURITESSERVER = 'SETFAVOURITESSERVER';

export const loadStories = () => {
    return async (dispatch, getState) => {
        try {
            const res = await axios({
                url: 'http://172.20.10.2:8800/api/stories/getallstories',
                method: 'get'
            });
            
            
            dispatch({ type: SETSTORIES, stories: res.data })
        } catch (err) {
            let errorMessage = err.message;
            let message = 'Something went wrong!'

            if(errorMessage === 'Request failed with status code 500') {
                message = 'Network Error!'
            }

            throw new Error(message);
        }
    };
};

export const createStory = ( title, imageUrl, description) => {
    return async (dispatch, getState) => {
        const user = getState().auth.user;
        try {
            const res = await axios({
                method: 'post',
                url: 'http://172.20.10.2:8800/api/stories/make',
                headers: {
                    "authorization": `Bearer ${user.accessToken}`
                },
                data: {
                    userId: user._id,
                    userName: user.userName,
                    userProfilePicture: user.profilePicture,
                    title: title,
                    imageUrl: imageUrl,
                    description: description
                }
            });

            
            dispatch({ type: CREATESTORY, storyId: res.data._id, userId: user._id, userName: user.userName, userProfilePicture: user.profilePicture, title: title, imageUrl: imageUrl, description: description, createdAt: res.data.createdAt });
        } catch (err) {
            let errorMessage = err.message;
            let message = 'Something went wrong!'
            if(errorMessage === 'Request failed with status code 400') {
                message = 'You are not authorized to perform this action!'
            }
            if(errorMessage === 'Request failed with status code 401') {
                message = 'You are not authorized to perform this action!'
            }
            if(errorMessage === 'Request failed with status code 403') {
                message = 'You are not authorized to perform this action!'
            }
            if(errorMessage === 'Request failed with status code 500') {
                message = 'Network Error encountered!'
            }

            throw new Error(message);
        }
    };
};

export const updateStory = (id, title, imageUrl, description) => {
  
    return async (dispatch, getState) => {
        try {
            const user = getState().auth.user;

            const res = await axios({
                method: 'patch',
                url: `http://172.20.10.2:8800/api/stories/updatestory/${id}`,
                headers: {
                    "authorization": `Bearer ${user.accessToken}`
                },
                data: {
                    userId: user._id,
                    title: title,
                    imageUrl: imageUrl,
                    description: description
                }
            });
            
            dispatch({ type: UPDATESTORY, updatedStory: res.data });
        } catch (err) {
            let errorMessage = err.message;
            let message = 'Something went wrong!'
            if(errorMessage === 'Request failed with status code 400') {
                message = 'You are not authorized to perform this action!'
            }
            if(errorMessage === 'Request failed with status code 401') {
                message = 'You are not authorized to perform this action!'
            }
            if(errorMessage === 'Request failed with status code 403') {
                message = 'You are not authorized to perform this action!'
            }
            if(errorMessage === 'Request failed with status code 500') {
                message = 'Network Error encountered!'
            }

            throw new Error(message);
        }
    };
};

export const favouriteToggle = (storyId) => {
    return { type: FAVOURITETOGGLE, storyId: storyId}
};

export const deleteStory = (storyId) => {
    return async (dispatch, getState) => {
        const user = getState().auth.user;
        try {
            const res = await axios({
                method: 'delete',
                url: `http://172.20.10.2:8800/api/stories/deletestory/${storyId}`,
                headers: {
                    "authorization": `Bearer ${user.accessToken}`
                },
                data: {
                    userId: user._id
                }
            });


            dispatch({ type: DELETESTORY, storyId: storyId });
        } catch (err) {
            let errorMessage = err.message;
            let message = 'Something went wrong!'
            if(errorMessage === 'Request failed with status code 400') {
                message = 'You are not authorized to perform this action!'
            }
            if(errorMessage === 'Request failed with status code 401') {
                message = 'You are not authorized to perform this action!'
            }
            if(errorMessage === 'Request failed with status code 403') {
                message = 'You are not authorized to perform this action!'
            }
            if(errorMessage === 'Request failed with status code 500') {
                message = 'Network Error encountered!'
            }

            throw new Error(message);
        }
    };
};

// loading favourites from the server 
export const loadingFavourites = () => {
    return async (dispatch, getState) => {
        const user = getState().auth.user;
        
        try {
        const res = await axios({
            method: 'get',
            url: `http://172.20.10.2:8800/api/favourites/particularuser/${user._id}`,
            headers: {
                "authorization": `Bearer ${user.accessToken}`
            }
        });

        dispatch({ type: SETFAVOURITESSERVER, favourites: res.data.favourites });
    } catch (err) {
        let errorMessage = err.message;
            let message = 'Something went wrong!'
            if(errorMessage === 'Request failed with status code 400') {
                message = 'You are not authorized to perform this action!'
            }
            if(errorMessage === 'Request failed with status code 401') {
                message = 'You are not authorized to perform this action!'
            }
            if(errorMessage === 'Request failed with status code 403') {
                message = 'You are not authorized to perform this action!'
            }
            if(errorMessage === 'Request failed with status code 500') {
                message = 'Network Error encountered!'
            }

            throw new Error(message);
    }
    };
};

// favouriting a story
export const favouritingStory = (storyId) => {
    return async (dispatch, getState) => {
        const user = getState().auth.user;
        try {
            const res = await axios({
                method: 'post',
                url: `http://172.20.10.2:8800/api/favourites/addingfavourite`,
                headers: {
                    "authorization": `Bearer ${user.accessToken}`
                },
                data: {
                    userId: user._id,
                    favouriteId: storyId
                }
            });

            
        } catch (err) {
            let errorMessage = err.message;
            let message = 'Something went wrong!'
            if(errorMessage === 'Request failed with status code 400') {
                message = 'You are not authorized to perform this action!'
            }
            if(errorMessage === 'Request failed with status code 401') {
                message = 'You are not authorized to perform this action!'
            }
            if(errorMessage === 'Request failed with status code 403') {
                message = 'You are not authorized to perform this action!'
            }
            if(errorMessage === 'Request failed with status code 500') {
                message = 'Network Error encountered!'
            }

            throw new Error(message);
        }
    };
};


// favouriting a story
export const deFavouritigStory = (storyId) => {
    return async (dispatch, getState) => {
        const user = getState().auth.user;
        try {
            const res = await axios({
                method: 'post',
                url: `http://172.20.10.2:8800/api/favourites/removingfavourite`,
                headers: {
                    "authorization": `Bearer ${user.accessToken}`
                },
                data: {
                    userId: user._id,
                    favouriteId: storyId
                }
            });

            
        } catch (err) {
            let errorMessage = err.message;
            let message = 'Something went wrong!'
            if(errorMessage === 'Request failed with status code 400') {
                message = 'You are not authorized to perform this action!'
            }
            if(errorMessage === 'Request failed with status code 401') {
                message = 'You are not authorized to perform this action!'
            }
            if(errorMessage === 'Request failed with status code 403') {
                message = 'You are not authorized to perform this action!'
            }
            if(errorMessage === 'Request failed with status code 500') {
                message = 'Network Error encountered!'
            }

            throw new Error(message);
        }
    };
};