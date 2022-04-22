class StoryItem {
    constructor (storyId, userId, userName, userProfilePicture, title,  createdAt, imageUrl, description) {
        this.storyId = storyId;
        this.userId = userId;
        this.userName = userName;
        this.userProfilePicture = userProfilePicture;
        this.title = title;
        this.createdAt = createdAt;
        this.imageUrl = imageUrl;
        this.description = description;
    }
};
export default StoryItem;