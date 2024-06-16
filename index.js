import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = process.env.PORT || 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "habit_tracker_db",
    password: "123456",
    port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT * from habits ORDER BY id ASC");
        const habits = result.rows;
        
        res.render("index", {
            listTitle: "My Habits",
            listItems: habits,
        });
    } catch (err){
        console.log(err);
    }
});

app.post("/add", async (req, res) => {
    const habitTitle = req.body.newHabit;

    try {
        await db.query("INSERT INTO habits (title) VALUES ($1)", [habitTitle]);
        res.redirect("/");
    } catch (err) {
        console.log(err);
    }
});

app.post("/edit", async (req, res) => {
    const habitTitle = req.body.updatedHabitTitle;
    const habitId = req.body.updatedHabitId;

    try{
        await db.query("UPDATE habits SET title = $1 WHERE id = $2", [habitTitle, habitId]);
        res.redirect("/");
    } catch (err) {
        console.log(err);
    }
});

app.post("/delete", async (req, res) => {
    const habitId = req.body.deletedHabitId;

    try {
        await db.query("DELETE FROM habits WHERE id = $1", [habitId]);
        res.redirect("/");
    } catch (err) {
        console.log(err);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});