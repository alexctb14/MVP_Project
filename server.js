import express from "express";
import pg from "pg";
import dotenv from "dotenv"; 
dotenv.config();

let server = express();
let PORT = 4000;

let db = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});

server.use(express.static("public"));

db.query("SELECT * FROM bucket_list", [], (error, result) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Conected to the database successfully");
    }

});

server.use(express.json());

//GET REQUEST FOR WHOLE BUCKET LIST
server.get("/api/list", (req, res) => {
    db.query("SELECT * FROM bucket_list", []).then(result => {
        res.send(result.rows);
    }).catch(error => {
        console.error('Error executing the query:', error);
    });
});

//GET REQUEST FOR SINGLE ITEM ON BUCKET LIST
server.get("/api/list/:id", (req, res) => {
    let id = Number(req.params.id);

    if(Number.isNaN(id)) {
        res.sendStatus(422);
        return;
    };
    db.query("SELECT * FROM bucket_list WHERE id = $1", [id]).then(result => {
        if (result.rows.length === 0) {
            res.sendStatus(404);
        } else {
        res.send(result.rows[0]);
        };
    }).catch(error => {
        console.error('Error executing the query:', error);
    });
})

//POST REQUEST
server.post('/api/list', (req, res) => {
    let activity = req.body.activity;

    //Validation
    if (!activity) {
        res.sendStatus(422);
        return;
    };
    db.query('INSERT INTO bucket_list (activity) VALUES ($1) RETURNING *', [activity]).then(result => {
        res.status(201).send(result.rows[0]);
    }).catch(error => {
        console.log('Error executing the query:', error);
    })
});

//DELETE 
server.delete("/api/list/:id", (req, res) => {
    let id =  Number(req.params.id);

    if (Number.isNaN(id)) {
        res.sendStatus(422);
        return;
    };
    db.query("DELETE FROM bucket_list WHERE id = $1 RETURNING *", [id]).then((result) => {
        if (result.rows.length === 0) {
            res.sendStatus(404);
            return;
        } else {
        res.send(result.rows[0]);
        };
    }).catch(error => {
        console.log('Error executing the query:', error);
    });
});

//PATCH REQUEST
server.patch("/api/list/:id", (req, res) => {
    let id = Number(req.params.id);
    let activity = req.body.activity;

    if (!activity) {
        res.sendStatus(422);
            return;
    };

    db.query("UPDATE bucket_list SET activity = COALESCE($1, activity) WHERE id = COALESCE($2, id) RETURNING *", [activity, id]).then(result => {
        if (result.rows.length === 0) {
            res.sendStatus(404);
        } else {
            res.send(result.rows[0]);
        }
    });
});
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});