import express from "express";
import session from "express-session";
import bcrypt from "bcryptjs";
import Database from "better-sqlite3";
import path from "path";
import {fileURLToPath} from "url";

const __dirname=path.dirname(fileURLToPath(import.meta.url));
const app=express(); const db=new Database("black-diamond.db");
db.exec(`CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY, name TEXT, tagline TEXT, email TEXT);
CREATE TABLE IF NOT EXISTS sections (id INTEGER PRIMARY KEY AUTOINCREMENT,type TEXT,title TEXT,text TEXT,visible INTEGER DEFAULT 1);
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT,username TEXT UNIQUE,password TEXT);`);
const envUser=process.env.ADMIN_USERNAME||"admin", envPass=process.env.ADMIN_PASSWORD||"change-me";
if(!db.prepare("SELECT id FROM users WHERE username=?").get(envUser))
 db.prepare("INSERT INTO users(username,password) VALUES(?,?)").run(envUser,bcrypt.hashSync(envPass,12));
if(!db.prepare("SELECT id FROM settings WHERE id=1").get())
 db.prepare("INSERT INTO settings(id,name,tagline,email) VALUES(1,?,?,?)").run("Ã blãçk diãmõnd","Built different. Made to shine.","your@email.com");
if(db.prepare("SELECT COUNT(*) c FROM sections").get().c===0){
 const add=db.prepare("INSERT INTO sections(type,title,text,visible) VALUES(?,?,?,?)");
 [["hero","Home","Welcome to my personal space.",1],["about","About Me","Add your introduction here.",0],["gallery","Gallery","Add photos here.",0],["projects","My Work","Add your projects here.",0],["video","Videos","Add video links here.",0],["social","Social Links","Instagram | YouTube | WhatsApp",0],["contact","Contact","your@email.com",0]].forEach(x=>add.run(...x));
}
app.use(express.json()); app.use(express.urlencoded({extended:true}));
app.use(session({secret:process.env.SESSION_SECRET||"CHANGE_ME",resave:false,saveUninitialized:false,cookie:{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production"}}));
app.use(express.static(path.join(__dirname,"public")));
const auth=(req,res,next)=>req.session.user?next():res.status(401).json({error:"Unauthorized"});
app.post("/api/login",(req,res)=>{const u=db.prepare("SELECT * FROM users WHERE username=?").get(req.body.username);if(!u||!bcrypt.compareSync(req.body.password,u.password))return res.status(401).json({error:"Invalid login"});req.session.user=u.username;res.json({ok:true})});
app.post("/api/logout",(req,res)=>req.session.destroy(()=>res.json({ok:true})));
app.get("/api/site",(req,res)=>res.json({settings:db.prepare("SELECT name,tagline,email FROM settings WHERE id=1").get(),sections:db.prepare("SELECT * FROM sections ORDER BY id").all()}));
app.put("/api/settings",auth,(req,res)=>{db.prepare("UPDATE settings SET name=?,tagline=?,email=? WHERE id=1").run(req.body.name,req.body.tagline,req.body.email);res.json({ok:true})});
app.post("/api/sections",auth,(req,res)=>{const r=db.prepare("INSERT INTO sections(type,title,text,visible) VALUES(?,?,?,?)").run(req.body.type,req.body.title,req.body.text,req.body.visible?1:0);res.json({id:r.lastInsertRowid})});
app.put("/api/sections/:id",auth,(req,res)=>{db.prepare("UPDATE sections SET type=?,title=?,text=?,visible=? WHERE id=?").run(req.body.type,req.body.title,req.body.text,req.body.visible?1:0,req.params.id);res.json({ok:true})});
app.delete("/api/sections/:id",auth,(req,res)=>{db.prepare("DELETE FROM sections WHERE id=?").run(req.params.id);res.json({ok:true})});
app.get("*",(req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));
app.listen(process.env.PORT||3000,()=>console.log("Ã blãçk diãmõnd running"));
