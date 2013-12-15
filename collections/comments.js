Comments = new Meteor.Collection('comments');

Meteor.methods({
    comment: function(commentAttributes) {
        var user = Meteor.user();
        var resource = LearningResources.findOne(commentAttributes.resourceId);
        // ensure the user is logged in
        if (!user)
            throw new Meteor.Error(401, "You need to login to make comments");
        if (!commentAttributes.body)
            throw new Meteor.Error(422, 'Please write some content');
        if (!resource)
            throw new Meteor.Error(422, 'You must comment on a post');
        comment = _.extend(_.pick(commentAttributes, 'resourceId', 'body'), {
            userId: user._id,
            author: user.username,
            submitted: new Date().getTime()
        });
        return Comments.insert(comment);
    }
});