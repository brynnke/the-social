const { User, Thought} = require('../models');

const thoughtController = {
    getAllThought(req, res) {
        Thought.find({})
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },
    getThoughtById({ params },res) {
        Thought.findOne({_id: params.id})
            .populate('username')
            .populate('createdby')
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: "No thought found wiht this Id!"});
                    return;
                }
                res.json(dbUserData)
            })
    },
    createThought({ body }, res) {
        Thought.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.json(err))

    },

    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: "No thought was found with this id!" });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },
    deleteThought({ params }, res) {
        Thought.deleteMany({ userId: params.id })
        .then(() => {
            Thought.findByIdAndDelete({ userId: params.id})
                .then(dbUserData => {
                    if (!dbUserData) {
                        res.status(404).json({message: 'No Thought was found with this id!'});
                        return;
                    }
                    res.json(!dbUserData);
                });
        })
        .catch(err => res.json(err));
    },
    createReaction({ params}, res) {
        Reaction.findOneAndUpdate(
            {_id: params.userId},
            {$push: { friends: params.reactionId}},
            { new: true }
        )
            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(404).json({message: 'No reaction found with this id'});
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => res.status(400).json(err));
    },
    deleteReaction({ params}, res) {
        Reaction.findOneAndUpdate(
            {_id: params.userId},
            {$pull: { friends: params.ReactionId}},
            { new: true }
        )
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No reaction found with this id'});
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => res.status(400).json(err));
    }
};

module.exports = thoughtController;

