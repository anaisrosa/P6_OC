const Sauce = require("../models/Sauce");
const fs = require("fs");

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// Définit le statut « Like » pour l' userId fourni.

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {

      console.log("@@@@1",req.body,sauce);
      

      if (
        !sauce.usersLiked.includes(req.body.userId) &&
        !sauce.usersDisliked.includes(req.body.userId) &&
        req.body.like == 1
      ) {
        ///////////////////////////////// L'utilisateur veut Liker///////////////////////////////////
console.log("@@@2 ajout like");
        // on ajoute son id au Array
        const updatedUsersLike = [...sauce.usersLiked];
        updatedUsersLike.push(req.body.userId);
        // on ajoute la valeur de son like
        const udpdatedlike = sauce.likes + 1;
        // on update la sauce
        Sauce.updateOne(
          { _id: req.params.id },
          { usersLiked: updatedUsersLike ,likes: udpdatedlike }
        )
          // on renvoie la reponse
          .then(() =>
            res.status(200).json({ message: "Like ajouté à la sauce !" })
          )
          .catch((error) => res.status(400).json({ error }));
      } else if (
        !sauce.usersLiked.includes(req.body.userId) &&
        !sauce.usersDisliked.includes(req.body.userId) &&
        req.body.like == -1
      ) {
        ///////////////////////////////// L'utilisateur veut disliker///////////////////////////////////
        console.log("@@@2 Ajout dislike");
        // on ajoute son id au Array
        const updatedUsersDislike = [...sauce.usersDisliked];
        updatedUsersDislike.push(req.body.userId);

        // on ajoute la valeur de son like
        const udpdatedDislike = sauce.dislikes + 1;
        // on update la sauce
        Sauce.updateOne(
          { _id: req.params.id },
          { usersDisliked: updatedUsersDislike, dislikes: udpdatedDislike }
        )
          // on renvoie la reponse
          .then(() =>
            res.status(200).json({ message: "Dislike ajouté à la sauce !" })
          )
          .catch((error) => res.status(400).json({ error }));
      } else if (
        sauce.usersLiked.includes(req.body.userId) &&
        req.body.like == 0
      ) {
        ///////////////////////////////// L'utilisateur veut annuler son Like///////////////////////////////////
        console.log("@@@2 annule  like");
        // on cherche l'index de l'userID dans l'array
        let userIndex = sauce.usersLiked.findIndex(
          (id) => id == req.body.userId
        );
        // on supprime son id au Array + on stocke dans un nouveau array
        let cancelUsersLike = [...sauce.usersLiked];
        cancelUsersLike.splice(userIndex, 1);
        // on supprime la valeur de son like
        let cancelLike = sauce.likes - 1;
        // on update la sauce
        Sauce.updateOne(
          { _id: req.params.id },
          { usersLiked: cancelUsersLike, likes: cancelLike }
        )
          // on renvoie la réponse
          .then(() => {
            res
              .status(200)
              .json({ message: "Like supprimé pour cette sauce !" });
          })
          .catch((error) => res.status(400).json({ error }));
      } else if (
        sauce.usersDisliked.includes(req.body.userId) &&
        req.body.like == 0
      ) {
        ///////////////////////////////// L'utilisateur veut annuler son dislike///////////////////////////////////
        console.log("@@@2 annule  dislike");
        // on cherche l'index de l'userID dans l'array
        let userIndex = sauce.usersDisliked.findIndex(
          (id) => id == req.body.userId
        );
        // on supprime son id au Array + on stocke dans un nouveau array
        let cancelUsersDislike = [...sauce.usersDisliked];
        cancelUsersDislike.splice(userIndex, 1);
        // on supprime la valeur de son like
        let cancelDislike = sauce.dislikes - 1;
        // on update la sauce
        Sauce.updateOne(
          { _id: req.params.id },
          { usersDisliked: cancelUsersDislike, dislikes: cancelDislike }
        )
          // on renvoie la réponse
          .then(() => {
            res
              .status(200)
              .json({ message: "Dislike supprimé pour cette sauce !" });
          })
          .catch((error) => res.status(400).json({ error }));
      } else {
        console.log("@@@2 erreur");
        res.status(400).json({ error: " Impossible de modifier vos likes" });

      }
    })
    .catch((error) => res.status(500).json({ error: "erreur!" }));
};
