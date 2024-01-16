import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors())

app.get("/api/notes/list", async (req, res) => {
    const notes = await prisma.note.findMany();
    res.json(notes);
});

app.post("/api/notes/add", async(req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res
            .status(400)
            .send("title and content fields are required.");
    }

    try {
        const note = await prisma.note.create({
            data: { title, content }
        });
        res.json({
            message: "New note created.",
            note: note
        });
    } catch (error) {
        res
            .status(500)
            .send("Opps! Something went wrong.");
    };
});

app.put("/api/notes/update/:id", async (req, res) => {
    const { title, content } = req.body;
    const id = parseInt(req.params.id);

    if (!title || !content) {
        return res
            .status(400)
            .send("title and content fields are required.");
    }

    if (!id || isNaN(id)) {
        return res
            .status(400)
            .send("Id must be a valid number.");
    }

    try {
        const updatedNode = await prisma.note.update({
            where: { id },
            data: { title, content }
        });
        res.json({
            message: "Note updated.",
            note: updatedNode
        });
    } catch (error) {
        res
            .status(500)
            .send("Oops! Something went wrong.");
    };
});

app.delete("/api/notes/delete/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (!id || isNaN(id)) {
        return res
            .status(400)
            .send("Id must be a valid number.");
    }

    try {
        const deletedNote = await prisma.note.delete({
            where: { id }
        });
        res
            .status(204)
            .send();
    } catch (error) {
        res
            .status(500)
            .send("Oops! Something went wrong.");
    };
});

app.listen(6001, () => {
    console.log("server running on localhost:6001");
});
