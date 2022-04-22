// import { STORIES } from '../../data/dummy-data';
import StoryItem from '../../models/story-item';
import { CREATESTORY, DELETESTORY, FAVOURITETOGGLE, SETSTORIES, UPDATESTORY, SETFAVOURITESSERVER } from '../actions/storiesActions';

const initialState = {
    stories: [],
    favouriteStories: [],
    userStories: []
};

const StoriesReducer = (state = initialState, action) => {
    switch( action.type ) {
        case SETSTORIES: {
            const loadedStories = action.stories.map(story => {
                return (
                    new StoryItem(story._id, story.userId, story.userName, story.userProfilePicture, story.title, story.createdAt, story.imageUrl, story.description)
                )
            });

            return {
                ...state,
                stories: loadedStories
            }
        }

        case FAVOURITETOGGLE: {
            const storyId = action.storyId;

            const selectedStory = state.favouriteStories.find(story => story.storyId === storyId);

            if(selectedStory) {
                let updatedFavourites = [...state.favouriteStories];
                updatedFavourites = updatedFavourites.filter(story => story.storyId !== storyId);
                

                return {
                    ...state,
                    favouriteStories: updatedFavourites
                }
            }else {
                const addedStory = state.stories.find(story => story.storyId === storyId); 
                
                return {
                    ...state,
                    favouriteStories: state.favouriteStories.concat(addedStory)
                }
            }
        }

        case CREATESTORY: {
            const newStoryItem = new StoryItem(action.storyId, action.userId, action.userName, action.userProfilePicture, action.title, action.createdAt, action.imageUrl, action.description);

            return {
                ...state,
                stories: state.stories.concat(newStoryItem)
            }
        }

        case UPDATESTORY: {
            const storyId = action.updatedStory._id;
            
            const storyIndex = state.stories.findIndex(story => story.storyId === storyId);

            const newStoryItem = new StoryItem(action.updatedStory._id, action.updatedStory.userId, action.updatedStory.userName, action.updatedStory.userProfilePicture, action.updatedStory.title, action.updatedStory.createdAt, action.updatedStory.imageUrl, action.updatedStory.description);

            let updatedStories = [...state.stories];
            updatedStories[storyIndex] = newStoryItem;
            return {
                ...state,
                stories: updatedStories
            }
        }

        case DELETESTORY: {
            const storyId = action.storyId;
            let updatedStories = [...state.stories];
            updatedStories = updatedStories.filter(story => story.storyId !== storyId);

            return {
                ...state,
                stories: updatedStories
            }
        }

        case SETFAVOURITESSERVER: {
            const favourites = action.favourites;
            const favouriteStories = favourites.map(favId => {
                return (
                    state.stories.find(story => story.storyId === favId)
                )
            });
            
            return {
                ...state,
                favouriteStories: favouriteStories
            };
        }

        default: {
            return state;
        }
    }
};


export default StoriesReducer;