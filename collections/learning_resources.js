// eliminate using var to make LearningResources available to whole app
LearningResources = new Meteor.Collection('learningResources');

// these methods are available to both server and client
Meteor.methods({
    resource: function(resourceAttributes) {
        var user = Meteor.user(),
            resourceWithSameLink = LearningResources.findOne({url: resourceAttributes.url});

        // ensure the user is logged in
        if (!user)
            throw new Meteor.Error(401, "You need to login to post new stories");

        // ensure the post has a title
        if (!resourceAttributes.title)
            throw new Meteor.Error(422, 'Please fill in a headline');

        // check that there are no previous posts with the same link
        if (resourceAttributes.url && resourceWithSameLink) {
            throw new Meteor.Error(302,
                'This link has already been posted',
                resourceWithSameLink._id);
        }

        // pick out the whitelisted keys
        var resource = _.extend(_.pick(resourceAttributes, 'url', 'title', 'message'), {
            userId: user._id,
            author: user.username,
            submitted: new Date().getTime()
        });

        var resourceId = LearningResources.insert(resource);

        return resourceId;
    }
});