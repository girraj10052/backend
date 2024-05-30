import express from "express";
import cors from 'cors'
import { adminRouter } from "./Routes/AdminRoute.js";
import { EmployeeRouter } from "./Routes/EmployeeRoute.js";
import Jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express() 
// app.use(cors({
//     origin: ["https://employee-management-using-react.vercel.app/"],
//     methods: ['GET', 'POST', 'PUT', "DELETE"],
//     credentials: true
// }))
app.use(
    cors({
      origin: "https://employee-management-using-react-85ngwkw6f.vercel.app", // Specify the exact origin
      credentials: true,
      allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization', // Include the Authorization header
      ],
    })
  );
app.use(express.json())
app.use(cookieParser())
app.get("/test", async (req, res)=>{console.log("hello");
    return res.json({"msg": "connected"});
})
app.use('/auth', adminRouter)
app.use('/employee', EmployeeRouter)
app.use(express.static('Public'))

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if(token) {
        Jwt.verify(token, "jwt_secret_key", (err ,decoded) => {
            if(err) return res.json({Status: false, Error: "Wrong Token"})
            req.id = decoded.id;
            req.role = decoded.role;
            next()
        })
    } else {
        return res.json({Status: false, Error: "Not autheticated"})
    }
}
app.get('/verify',verifyUser, (req, res)=> {
    return res.json({Status: true, role: req.role, id: req.id})
} )

app.listen(3000, () => {
    console.log("Server is running")
})