const { User, Thought} = require('../models');

const thoughtController = {
    getAllThought(req, res) {
        Thought.find({})
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },
    getThoughtById({ params },res) {
        Thought.findOne({_id: params.id})
            .populate('reactions')
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: "No thought found wiht this Id!"});
                    return;
                }
                res.json(dbUserData)
            })
    },
    createThought({ body }, res) {
        Thought.create(body)
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => res.json(err))

    },

    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: "No thought was found with this id!" });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },
    deleteThought({ params }, res) {
        Thought.deleteMany({ userId: params.id })
        .then(() => {
            Thought.findByIdAndDelete({ userId: params.id})
                .then(dbThoughtData => {
                    if (!dbThoughtData) {
                        res.status(404).json({message: 'Thought was deleted!'});
                        return;
                    }
                    res.json(!dbThoughtData);
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
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    res.status(404).json({message: 'No reaction found with this id'});
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch((err) => res.status(400).json(err));
    },
    deleteReaction({ params}, res) {
        Reaction.findOneAndUpdate(
            {_id: params.userId},
            {$pull: { friends: params.ReactionId}},
            { new: true }
        )
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'REaction deleted!'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch((err) => res.status(400).json(err));
    }
};

module.exports = thoughtController;

