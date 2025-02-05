import Trick from "../models/Trick.js";

class TrickController {
  async getAll(_, res) {
    try {
      const tricks = await Trick.find();

      if (tricks?.length) {
        res.json({ tricks });
      } else {
        res.json({ alert: { message: "No Tricks", status: "error" }});
      }
    } catch (error) {
      res.json({ alert: { message: "Error", status: "error" }});
    }
  }

  async create(req, res) {
    try {
      const { name, complexity, description } = req.body;
      const isThere = await Trick.findOne({ name });

      if (isThere) {
        return res.json({ alert: { message: "This trick already exists", status: "error"}});
      }

      const newTrick = new Trick({ name, complexity, description });
      await newTrick.save();
      const tricks = await Trick.find();

      res.json({ tricks, alert: { message: `${name} was saved`, status: "success" }});
    } catch (error) {
      res.json({ alert: { message: error._message, status: "error" } });
    }
  }

  async delete(req, res) {
    try {
      const trick = await Trick.findByIdAndDelete(req.params.id);

      if (!trick)
        return res.json({ alert: { message: "Trick not exist", status: "error" }});

      await Trick.findByIdAndUpdate(req.trickId, { $pull: { tricks: req.params.id }});

      const tricks = await Trick.find();

      res.json({ tricks, alert: { message: "Trick deleted", status: "success" }});
    } catch (error) {
      res.json({ alert: { message: "Error", status: "error" }});
    }
  }
}

export const trickController = new TrickController();
