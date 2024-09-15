import mongoose from "mongoose";

export function validadId(req, res, next) {
    let idParam;
    if (!req.params.id) {
        req.params.id = req.useId;
        idParam = req.params.id;
    } else {
        idParam = req.params.id;
    }
    if (!mongoose.Types.ObjectId.isValid(idParam)) {
        return res.status(400).send({ message: "id invalido!" });
    }
    next();
}