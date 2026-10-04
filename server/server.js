const express = require("express")
const cors = require("cors")
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const productRoutes = require("./routes/productRoutes")
const categoryRoutes = require("./routes/categoryRoutes")
require("dotenv").config()


const connectDB = require("./configs/db")
const app = express()

connectDB()

app.use(cors())
app.use(express.json())


app.get('/' , (req,res) => res.json({
    success: true,
    message: "Electronics Store API is running"
}))

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/products", productRoutes)
app.use("/api/category", categoryRoutes)

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});




