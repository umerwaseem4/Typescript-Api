import express, { Request, Response, Router } from "express";
import auth from "../../middleware/auth";
import Todo from "../../model/Todos";
import { authRequest } from "../../types";
import { ITodo } from "../../model/Todos";

const router: Router = express.Router();

router.get("/", auth, async (req: authRequest, res: Response): Promise<any> => {
  try {
    const todos: ITodo[] = await Todo.find({ user: req.user.id }).sort({
      date: -1,
    });
    return res.json(todos);
  } catch (error) {
    res.status(500).json({ msg: "server error" });
  }
});

router.post(
  "/",
  auth,
  async (req: authRequest, res: Response): Promise<any> => {
    const { title } = req.body;
    try {
      const newTodo: ITodo | any = new Todo({ title, user: req.user.id });
      const todo = await newTodo.save();
      res.json(todo);
    } catch (error) {
      res.status(500).json({ msg: "server error" });
    }
  }
);

router.delete("/", auth, async (req: Request, res: Response) => {
  try {
    let todo: ITodo | null = await Todo.findById(req.params.id);
    if (!todo) {
      res.status(404).json({ msg: "Todo not found" });
    }

    // @ts-ignore
    if (todo?.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: "Not Authorize" });
    }
    todo = await Todo.findByIdAndDelete(req.params.id);
    res.json({ msg: "Contact Deleted" });
  } catch (error) {
    res.status(500).json({ msg: "server error" });
  }
});

export default router;
